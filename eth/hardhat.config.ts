import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";

require("@openzeppelin/hardhat-upgrades");
require('dotenv').config(); 
require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      accounts: [`0x${process.env.LOCALHOST_PRIVATE_KEY}`],
    },
    sepolia: {
      url: `${process.env.ALCHEMY_SEPOLIA_URL}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    }
  },
  paths: {
    sources: "./contracts",
    // tests: "./test",
    // cache: "./cache",
    // artifacts: "./artifacts",
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    
    apiKey: {
      sepolia: "IT2RFBE4JCFEA8J48ZU6N1RFI9Q769M39N"
    }
  },
};


const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
