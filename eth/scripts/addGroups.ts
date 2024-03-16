import { namehash } from "viem";
import hardhat from "hardhat";
import { Address } from "viem";

export default async function addGroups(contractAddress :Address) {

    var contract = await hardhat.viem.getContractAt("Ensauth", contractAddress);
    

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "add"])
    
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "min"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "mod"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "erator"])
   
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "us"])



}
