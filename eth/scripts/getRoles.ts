import { namehash } from "viem";
import hardhat from "hardhat";


async function main() {
    var contract = await hardhat.viem.getContractAt("Ensauth", "0x1899342737632CB34aD1E9779Ee6059a0ADD8bEb");
    contract.read.text([namehash("groups.ensauth123.eth"), "groups"])

}

main();