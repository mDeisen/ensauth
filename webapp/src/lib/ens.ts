import { getOwner } from "@ensdomains/ensjs/public";
import { createSubname } from "@ensdomains/ensjs/wallet";
import { TransactionReceipt, WalletClient, publicActions } from "viem";

export async function wrapSubdomain(client: WalletClient, subdomain: string, newOwner: `0x${string}`): Promise<TransactionReceipt> {
    const hash = await createSubname(client as any, {
        account: client.account!.address,
        name: subdomain,
        owner: newOwner,
        contract: "nameWrapper"
    });

    return client.extend(publicActions).waitForTransactionReceipt({hash})
}

export async function checkOwnership(client: WalletClient, name: string): Promise<string> {
    const result = await getOwner(client.extend(publicActions) as any, {
        name
    });

    if (!result) {
        throw new Error("Address is not registered");
    }

    return result.owner;
}
