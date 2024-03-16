//scripts/deploy_contract.js
const { ethers, upgrades } = require("hardhat");

async function main() {
   const EnsauthU = await ethers.getContractFactory("Ensauth");
    console.log("Deploying Ensauth.sol...");
    const ensauthu = await upgrades.deployProxy(EnsauthU, [42], {
        initializer: "initialize",
    });
   console.log("Ensauth deployed to:", ensauthu.address);
}

main();
