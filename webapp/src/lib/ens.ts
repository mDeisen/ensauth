import { createEnsWalletClient, createEnsPublicClient } from "@ensdomains/ensjs";
import { custom } from "viem";
import { sepolia } from "wagmi/chains";

export async function wrapSubdomain(subdomain: string, newOwner: `0x${string}`): Promise<string> {
    const wallet = createEnsWalletClient({
        chain: sepolia,
        transport: custom((window as any).ethereum )
    })
    
    return wallet.wrapName({
        name: subdomain,
        newOwnerAddress: newOwner,
        fuses: {
            named: ["CANNOT_TRANSFER"]
        } as any
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
