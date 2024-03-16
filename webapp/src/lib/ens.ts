import { getOwner as getEnsOwner } from "@ensdomains/ensjs/public";
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

export async function getOwner(client: WalletClient, name: string): Promise<string | null> {
    const result = await getEnsOwner(client.extend(publicActions) as any, {
        name
    });

    if (!result) return null;

    return result?.owner;
}
