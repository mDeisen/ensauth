import transfer1155 from './transfer1155';
import addGroups from './addGroups';
import assignMembers from './assignMembers';
import { Address } from 'viem';

async function main() {
  var walletAddress= "0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4";
  var contractAddress= "0x25b3cE9952F0C8f1495A4A96a6a361185C05B4C8";
//   await transfer1155(walletAddress as Address, contractAddress as Address);
//   await addGroups(contractAddress as Address);
  await assignMembers(contractAddress as Address);
}

main()

