import { namehash } from "viem";
import hardhat from "hardhat";
import { Address } from "viem";

export default async function addGroups(contractAddress :Address) {

    var contract = await hardhat.viem.getContractAt("Ensauth", contractAddress);
    

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole1"])
    
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole2"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole3"])

    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole4"])
   
    await contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole6"])



}
