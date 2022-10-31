# AmpliFrens

Frontend repository for [AmpliFrens](https://github.com/lakchote/amplifrens), a platform where you can:
- get the daily crypto news posted by the community
- make frens
- amplify your network
- earn special perks by contributing

Under the hood, it uses [The Graph](https://thegraph.com/en/) to index events and fetch data from the blockchain.

## Getting Started

PREREQUISITES

1. Install dependencies
```
yarn
```

2. Fill the env variables in a new .env.local file.
If subgraph is deployed locally, `RPC_LOCAL_NODE` should be equal to `http://127.0.0.1:8545/`

3. Launch local server
```
yarn dev
```

## Project in action

Project is deployed in a decentralized manner on IPFS, and backed up by Filecoin, thanks to the wonderful [Fleek](https://fleek.co/) solution.

You can see it in action here:
https://empty-hat-4319.on.fleek.co/