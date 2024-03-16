import { namehash } from "viem";
import hardhat from "hardhat";
import { Address } from "viem";

export default async function assignMembers(contractAddress :Address) {

    var contract = await hardhat.viem.getContractAt("Ensauth", contractAddress);

        const options = { gasLimit: 1000000 }; // Example gas limit, adjust based on needs
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "add", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "add", "0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4"])
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "min", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "mod", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])
        await contract.write.assignRole([namehash("groups.ensauth123.eth"), "erator", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])

}
