import { GetNameReturnType, getOwner as getEnsOwner, getName, getRecords, getAddressRecord, GetAddressRecordReturnType } from "@ensdomains/ensjs/public";
import { createSubname } from "@ensdomains/ensjs/wallet";
import { TransactionReceipt, WalletClient, publicActions } from "viem";

/**
 * Profile of an Ethereum user, constructed from text records.
 * For meaning of records, see https://docs.ens.domains/ensip/5
 */
interface Profile {
    address: string,
    /**
     * Display-text. Falls back to primary name or address
     */
    display: string,
    avatar?: string,
    description?: string,
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
 * ENS lookup
 * @param client 
 * @param name
 * @returns null if no record is set. Otherwise the address
 */
export async function getAddr(client: WalletClient, name: string): Promise<string | null> {
    let result: GetAddressRecordReturnType;
    try {
        result = await getAddressRecord(client.extend(publicActions) as any, {
        name,
    });
    } catch(e) {
        // Unlike documented, this seems to fail when there's no record
        return null;
    }

    if (!result) return null;

    return result.value;
}

/**
 * Reverse ENS lookup
 * @param client 
 * @param address By default, the users address
 * @returns null if no primary name is set. Otherwise the name
 */
export async function getPrimaryName(client: WalletClient, address?: `0x${string}`): Promise<string | null> {
    let result: GetNameReturnType;
    try {
            result = await getName(client.extend(publicActions) as any, {
            address: address ?? client.account!.address
        });
    } catch(e) {
        // Unlike documented, this seems to fail when there's nor primary name
        return null;
    }

    if (!result) return null;

    return result.name;
}

/**
 * Reverse ENS lookup, followed by retrieval of profile information
 * @param client 
 * @param address By default, the users address
 * @returns Profile, at minimum with an address as displayname
 */
export async function getProfile(client: WalletClient, address: `0x${string}`): Promise<Profile> {
    const profile: Profile = {
        display: address,
        address,
    };

    const reverseLookupResult = await getPrimaryName(client, address);
    if (!reverseLookupResult) return profile;

    profile.display = reverseLookupResult;

    const textRecords = await getRecords(client.extend(publicActions) as any, {
        name: reverseLookupResult,
        texts: [ "avatar", "description", "display", "url", "com.twitter"]
    });

    textRecords.texts.forEach((txt) => profile[txt.key] = txt.value);
    
    return profile;
}
