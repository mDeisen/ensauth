import { createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { http } from "viem";
import { addEnsContracts } from "@ensdomains/ensjs";
import hardhat from "hardhat";
import { transferName } from "@ensdomains/ensjs/wallet";


async function main() {

var walletClient = await hardhat.viem.getWalletClient("0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4");

const tx = transferName({ ...walletClient, chain: addEnsContracts(walletClient.chain) }, {
    name: "groups.ensauth123.eth",
    newOwnerAddress: "0x49b130D7BE8E7a96c55de4e4CEa1708c1211c2C1",
    contract: "nameWrapper",
    asParent: true,
    gas: 500000n,
});
}

main();