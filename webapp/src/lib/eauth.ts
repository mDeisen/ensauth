import { WalletClient } from "viem";
import { getOwner } from "./ens";

/**
 * @param label Domain of the app
 * @returns Domain that is delegated to signify identity management delegation
 */
export const delegatedDomain = (label: string) => `${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`

export async function isAppRegistered(client: WalletClient, label: string): Promise<boolean> {
    const owner = await getOwner(client, delegatedDomain(label));
    return owner === process.env.NEXT_PUBLIC_EAUTH_CONTRACT_ADDR;
}

export async function isAppOwnedByUser(client: WalletClient, label: string): Promise<boolean> {
    const owner = await getOwner(client, label);
    return owner === client.account?.address;
}