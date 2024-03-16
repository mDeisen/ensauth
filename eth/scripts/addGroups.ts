import { createPublicClient, namehash } from "viem";
import { sepolia } from "viem/chains";
import { http } from "viem";
import { addEnsContracts } from "@ensdomains/ensjs";
import hardhat from "hardhat";
import { transferName } from "@ensdomains/ensjs/wallet";


async function main() {

var walletClient = await hardhat.viem.getWalletClient("0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4");

    var contract = await hardhat.viem.getContractAt("Ensauth", "0x49b130D7BE8E7a96c55de4e4CEa1708c1211c2C1");
    contract.write.registerRole([namehash("groups.ensauth123.eth"), "testrole"])

}

main();