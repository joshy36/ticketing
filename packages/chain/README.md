# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

deploy Event contract
```shell
npx hardhat --network base-sepolia deploy --tags Event
```

deploy SBT contract
```shell
npx hardhat --network base-sepolia deploy --tags SBT
```

deploy Collectible contract
```shell
npx hardhat --network base-sepolia deploy --tags Collectible
```

verify Event contract on etherscan
```shell
npx hardhat verify --network base-sepolia <address> <name> <symbol> <baseUri>
```