import { addEnsContracts } from "@ensdomains/ensjs";
import hardhat from "hardhat";
import { transferName } from "@ensdomains/ensjs/wallet";
import { Address } from "viem";


export default async function transfer1155(walletAddress : Address, contractAddress : Address) {

var walletClient = await hardhat.viem.getWalletClient(walletAddress);

const tx = transferName({ ...walletClient, chain: addEnsContracts(walletClient.chain) }, {
    name: "groups.ensauth123.eth",
    newOwnerAddress: contractAddress,
    contract: "nameWrapper",
    asParent: true,
    gas: 500000n,
});
}

