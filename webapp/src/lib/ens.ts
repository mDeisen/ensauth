import { getOwner as getEnsOwner, getName, getRecords } from "@ensdomains/ensjs/public";
import { createSubname } from "@ensdomains/ensjs/wallet";
import { TransactionReceipt, WalletClient, publicActions } from "viem";

/**
 * Profile of an Ethereum user, constructed from text records.
 * For meaning of records, see https://docs.ens.domains/ensip/5
 */
interface Profile {
    /**
     * Display-text, primary name, or address
     */
    displayName: string
    avatar?: string,
    decsription?: string,
    display?: string,
    url?: string,
    "com.twitter"?: string,
    [key: string]: string | undefined

}

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

    return result.owner;
}

/**
 * Reverse ENS lookup
 * @param client 
 * @param address By default, the users address
 * @returns null if no primary name is set. Otherwise the name
 */
export async function getPrimaryName(client: WalletClient, address?: `0x${string}`): Promise<string | null> {
    const result = await getName(client.extend(publicActions) as any, {
        address: address ?? client.account!.address
    });

    if (!result) return null;

    return result.name;
}

/**
 * Reverse ENS lookup, followed by retrieval of profile information
 * @param client 
 * @param address By default, the users address
 * @returns Profile, at minimum with an address as displayname
 */
export async function getProfile(client: WalletClient, address?: `0x${string}`): Promise<Profile> {
    const addressToLookup = address ?? client.account!.address
    
    const profile: Profile = {
        displayName: addressToLookup
    }

    const reverseLookupResult = await getName(client.extend(publicActions) as any, {
        address: addressToLookup
    });

    if (!reverseLookupResult) return profile;

    profile.displayName = reverseLookupResult.name;

    const textRecords = await getRecords(client.extend(publicActions) as any, {
        name: reverseLookupResult.name,
        resolver: {address: reverseLookupResult.resolverAddress},
        texts: [ "avatar", "description", "display", "url", "com.twitter"]
    });

    textRecords.texts.forEach((txt) => profile[txt.key] = txt.value);
    
    return profile;
}