import { namehash } from "viem";
import hardhat from "hardhat";


async function main() {

var walletClient = await hardhat.viem.getWalletClient("0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4");

    var contract = await hardhat.viem.getContractAt("Ensauth", "0x1899342737632CB34aD1E9779Ee6059a0ADD8bEb");
    contract.write.Get([namehash("groups.ensauth123.eth"), "testrole", "0x69420f05A11f617B4B74fFe2E04B2D300dFA556F"])

}

main();