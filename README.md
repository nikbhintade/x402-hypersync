# x402 + HyperSync

A demo showcasing how to **monetize HyperSync queries** using **x402**.

With **HyperSync**, developers can efficiently query and filter blockchain data across multiple networks. This project demonstrates how you can combine it with **x402** to create **pay-per-request blockchain APIs**

## Demo Overview

This demo lets users fetch **token transfer history** for any address across all **HyperSync-supported networks** and optionally filter results by a specific token.

### Endpoints

#### Get all token transfers for an address:

```text
ENDPOINT/:chainid/:address
```

#### Get token transfers for a specific token:

```text
ENDPOINT/:chainid/:address/:token
````

## About HyperSync

**HyperSync** is a purpose-built, high-performance data engine designed to provide flexible, low-latency access to historical on-chain data, solving the limitations of traditional RPCs (slow queries, lack of filtering, and high costs).

- Docs: [https://docs.envio.dev/docs/HyperSync/overview](https://docs.envio.dev/docs/HyperSync/overview)  
- GitHub: [https://github.com/enviodev](https://github.com/enviodev)  
- Discord: [https://discord.gg/MvtJG3EmJP](https://discord.gg/MvtJG3EmJP)  
- Twitter: [@envio_indexer](https://x.com/envio_indexer)  
- Website: [https://envio.dev](https://envio.dev)


## About x402

**x402** is an open protocol for internet-native payments enabling real-time, autonomous transactions between APIs and agents.

> “x402 is an open payment standard that enables AI agents and web services to autonomously pay for API access, data, and digital services. By leveraging the long-reserved HTTP 402 ‘Payment Required’ status code, x402 removes the need for API keys, subscriptions, and manual payment processing — enabling direct, machine-native micropayments using stablecoins like USDC.”

- Website: [https://x402.org](https://x402.org)  
- Whitepaper: [https://www.x402.org/x402-whitepaper.pdf](https://www.x402.org/x402-whitepaper.pdf)  
- GitHub: [https://github.com/coinbase/x402](https://github.com/coinbase/x402)


## Quick Start

Clone the repository and install dependencies:

```bash
git clone https://github.com/nikbhintade/x402-hypersync.git
cd x402-hypersync
npm install
````

Set up payout address in `.env` file.
```
PAY_TO_ADDRESS=add_your_address_here
```

### Run in Production

```bash
npm run build && npm run start
```

### Run in Development

```bash
npm run dev
```

## Tech Stack

* [@envio-dev/hypersync-client](https://www.npmjs.com/package/@envio-dev/hypersync-client)
* [x402-express](https://github.com/coinbase/x402)
* [Express.js](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* Node.js



> Built with ❤️ using **x402** & **HyperSync**

