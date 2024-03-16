import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require('dotenv').config(); 
require("hardhat-ens-mock");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `${process.env.ALCHEMY_SEPOLIA_URL}`,
      accounts: [`0x${process.env.SEPOLIA_PRIVATE_KEY}`],
    }
  }
};


const config: HardhatUserConfig = {
  solidity: "0.8.24",
};

export default config;
