import { namehash } from "viem";
import hardhat from "hardhat";
import { Address } from "viem";

export default async function assignMembers(contractAddress :Address) {

    var contract = await hardhat.viem.getContractAt("Ensauth", contractAddress);

        const options = { gasLimit: 10000000 }; // Example gas limit, adjust based on needs
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "admin", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await new Promise(resolve => setTimeout(resolve, 5000));
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "admin", "0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4"])
        await new Promise(resolve => setTimeout(resolve, 5000));
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "moderator", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "user", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await new Promise(resolve => setTimeout(resolve, 5000));
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "writer", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])

}
