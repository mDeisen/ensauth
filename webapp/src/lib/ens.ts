import { createEnsWalletClient, createEnsPublicClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { sepolia } from "wagmi/chains";

export async function wrapSubdomain(account: `0x${string}`, subdomain: string, newOwner: `0x${string}`): Promise<string> {
    const wallet = createEnsWalletClient({
        chain: sepolia,
        transport: custom((window as any).ethereum ),
        account
    })
    0x40852aa7ba9a0fd483f40995c1d65d9dd46a82e466f78955fa063e1d145a08c7

    return wallet.createSubname({
        name: subdomain,
        owner: newOwner,
        contract: "nameWrapper"
    })
    
    return wallet.wrapName({
        name: subdomain,
        newOwnerAddress: newOwner
    })
}

export async function checkOwnership(name: string): Promise<string> {
    const client = createEnsPublicClient({
        chain: sepolia,
        transport: custom((window as any).ethereum)
    })
    
    const result = await client.getOwner({
        name
    });

    if (!result) {
        throw new Error("Address is not registered");
    }

    return result.owner;
}
