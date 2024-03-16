import transfer1155 from './transfer1155';
import addGroups from './addGroups';
import assignMembers from './assignMembers';
import { Address } from 'viem';

async function main() {
  var walletAddress= "0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4";
  var contractAddress= "0x4712B09299E9175Dd6a9E511B8A7910e5c9b2315";
  await transfer1155(walletAddress as Address, contractAddress as Address);
  await new Promise((resolve) => setTimeout(resolve, 60000));
  await addGroups(contractAddress as Address);
  await new Promise((resolve) => setTimeout(resolve, 60000));
  await assignMembers(contractAddress as Address);
}

main()

