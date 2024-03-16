import { WalletClient, publicActions } from "viem";
import { getAddr, getOwner } from "./ens";

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

export async function getUsersGroups(client: WalletClient, label: string, user: string): Promise<string[]> {
    return ["Administrator", "Contributor"];
}

export async function addUserToGroup(client: WalletClient, label: string, user:string, group: string): Promise<void> {
    let userAddr = user;
    if (user.includes(".")) {
        const addr = await getAddr(client.extend(publicActions) as any, user);
        if (!addr) {
            throw new Error(`Name ${user} cannot be resolved`);
        }
        userAddr = addr;
    }

    return;
}

export async function listGroups(client: WalletClient, label: string): Promise<string[]> {
    return ["Administrator", "Contributor", "Banned"];
}

export async function listGroupMembers(client: WalletClient, label: string, groupName: string): Promise<string[]> {
    return ["0x123", "0x456"];
}

export async function createGroup(client: WalletClient, label: string, groupName: string): Promise<void> {
    return;
}
