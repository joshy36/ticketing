import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';

import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

const ALCHEMY_SEPOLIA_URL = `${process.env.ALCHEMY_SEPOLIA_URL}`;
const PRIVATE_KEY = `${process.env.PRIVATE_KEY}`;
const ETHERSCAN_API_KEY = `${process.env.ETHERSCAN_API_KEY}`;

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  networks: {
    hardhat: {},
    // 'base-mainnet': {
    //   url: 'https://mainnet.base.org',
    //   accounts: [process.env.WALLET_KEY as string],
    //   gasPrice: 1000000000,
    // },
    'base-sepolia': {
      url: ALCHEMY_SEPOLIA_URL!,
      accounts: [PRIVATE_KEY!],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY!,
  },
  // https://github.com/wighawag/hardhat-deploy/tree/master#1-namedaccounts-ability-to-name-addresses
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      // 4: '0xd2f235B03056b9439D86D91bA890598aAAaD7C85', // but for rinkeby it will be a specific address
      // goerli: '0xd2f235B03056b9439D86D91bA890598aAAaD7C85', //it can also specify a specific netwotk name (specified in hardhat.config.js)
    },
  },
};

export default config;
