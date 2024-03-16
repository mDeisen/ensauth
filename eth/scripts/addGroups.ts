import { namehash } from "viem";
import hardhat from "hardhat";
import { Address } from "viem";

export default async function addGroups(contractAddress :Address) {

    var contract = await hardhat.viem.getContractAt("Ensauth", contractAddress);
    

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "admin"])
    
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "moderator"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "user"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "reader"])
   
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "writer"])



}
