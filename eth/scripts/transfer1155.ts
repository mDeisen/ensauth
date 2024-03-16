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
    newOwnerAddress: "0xCf9D6459B05ce8c3eBCd6E6da2012097E20a3Bf4",
    contract: "nameWrapper",
    asParent: true,
    gas: 500000n,
});
}

main();