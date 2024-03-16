import { TransactionReceipt, WalletClient, getContract, namehash, publicActions } from "viem";
import { getAddr, getOwner } from "./ens";
import EnsAuthJson from "./Ensauth.json"
import { getTextRecord } from "@ensdomains/ensjs/public";
import { normalize } from "viem/ens";
import { waitForTransactionReceipt } from "viem/actions";

const getEnsAuth = (wallet: WalletClient) => {
    return getContract({
        client: wallet,
        abi: EnsAuthJson.abi,
        address: process.env.NEXT_PUBLIC_EAUTH_CONTRACT_ADDR as any
    })
}

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

export async function addUserToGroup(client: WalletClient, label: string, user:string, group: string): Promise<TransactionReceipt> {
    let userAddr = user;
    if (user.includes(".")) {
        const addr = await getAddr(client.extend(publicActions) as any, user);
        if (!addr) {
            throw new Error(`Name ${user} cannot be resolved`);
        }
        userAddr = addr;
    }

    const contract = getEnsAuth(client);
    const node = namehash(normalize(`${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`));
    const txHash = await contract.write.assignRole([node, group, userAddr]);
    return waitForTransactionReceipt(client, {hash: txHash});
}

export async function removeUserFromGroup(client: WalletClient, label: string, user:string, group: string): Promise<TransactionReceipt> {
    let userAddr = user;
    if (user.includes(".")) {
        const addr = await getAddr(client.extend(publicActions) as any, user);
        if (!addr) {
            throw new Error(`Name ${user} cannot be resolved`);
        }
        userAddr = addr;
    }

    const contract = getEnsAuth(client);
    const node = namehash(normalize(`${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`));
    const txHash = await contract.write.removeRole([node, group, userAddr]);
    return waitForTransactionReceipt(client, {hash: txHash});
}

export async function listGroups(client: WalletClient, label: string): Promise<string[]> {
    const result = await getTextRecord(client.extend(publicActions) as any, {
        name: `${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`,
        key: "groups"
    });

    if (!result) {
        throw new Error("Text record 'groups' not found");
    }
    
    return result.trim().split(" ");
}

export async function listGroupMembers(client: WalletClient, label: string, groupName: string): Promise<string[]> {
    const result = await getTextRecord(client.extend(publicActions) as any, {
        name: `${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`,
        key: `groups.${groupName}`
    });

    if (!result) {
        throw new Error(`Text record 'groups.${groupName}' not found`);
    }
    
    return result.trim().split(" ");
}

export async function createGroup(client: WalletClient, label: string, groupName: string): Promise<TransactionReceipt> {
    const contract = getEnsAuth(client);
    const node = namehash(normalize(`${process.env.NEXT_PUBLIC_AUTH_PREFIX}.${label}`))
    const txHash = await contract.write.registerRole([node, groupName]);
    return waitForTransactionReceipt(client, {hash: txHash});
}
