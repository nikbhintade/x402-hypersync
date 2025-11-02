import express, { Request, Response } from "express";
import { paymentMiddleware } from "x402-express";
import {
    HypersyncClient,
    Decoder,
    LogField,
    Query
} from "@envio-dev/hypersync-client";

const payToAddress = process.env.PAY_TO_ADDRESS as `0x${string}`;
if (!payToAddress) {
    throw new Error("PAY_TO_ADDRESS environment variable is not set");
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
    paymentMiddleware(
        payToAddress,
        {
            "/token-transfers/*": {
                price: "$0.01",
                network: "base-sepolia",
            }
        },
    ),
);


app.get("/token-transfers/:chainId/:address/:token", async (req: Request, res: Response) => {
    const address = req.params.address?.toLowerCase();
    const chainId = req.params.chainId;
    if (!address || !chainId) {
        return res.status(400).json({ error: "Address and chainId parameters are required" });
    }

    // reusable Hypersync client
    const client = HypersyncClient.new({
        url: `https://${chainId}.hypersync.xyz`,
    });

    // decoder for ERC20 Transfer event
    const decoder = Decoder.fromSignatures([
        "Transfer(address indexed from, address indexed to, uint amount)"
    ]);

    try {
        const padded = "0x" + address.replace(/^0x/, "").padStart(32, "0");
        // Query both directions: sent or received by this address
        let query: Query = {
            fromBlock: 0,
            logs: [
                {
                    topics: [
                        ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"], // Transfer event
                        [], // from
                        [padded] // to
                    ]
                },
                {
                    topics: [
                        ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
                        [padded] // from
                    ]
                }
            ],
            fieldSelection: {
                log: [
                    LogField.Topic0,
                    LogField.Topic1,
                    LogField.Topic2,
                    LogField.Data,
                    LogField.Address,
                    LogField.BlockNumber,
                    LogField.TransactionHash
                ]
            }
        };

        if (req.params.token) {
            query = {
                ...query,
                logs: [
                    {
                        ...query.logs![0],
                        address: [req.params.token]
                    },
                    {
                        ...query.logs![1],
                        address: [req.params.token]
                    }
                ]
            }
        }

        const result = await client.collect(query, {
            reverse: true
        });
        const logs = result.data.logs || [];

        if (logs.length === 0) {
            return res.json({ message: "No token transfers found for this address." });
        }

        const decoded = await decoder.decodeLogs(logs);

        // Combine decoded + raw log metadata
        const transfers = decoded.map((decodedLog, i) => {
            const rawLog = logs[i];
            if (!rawLog) return null;
            return {
                token: rawLog.address, // contract emitting the event
                transactionHash: rawLog.transactionHash,
                from: decodedLog?.indexed?.[0]?.val ?? null,
                to: decodedLog?.indexed?.[1]?.val ?? null,
                value: decodedLog?.body?.[0]?.val?.toString() ?? "0",
            };
        });

        res.json({ address, transfers });
    } catch (err) {
        console.error("Error while fetching token transfers:", err);
        res.status(500).json({ error: "Failed to fetch token transfers" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});