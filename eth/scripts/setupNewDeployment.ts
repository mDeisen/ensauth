import transfer1155 from './transfer1155';
import addGroups from './addGroups';
import assignMembers from './assignMembers';
import { Address } from 'viem';

async function main() {
  var walletAddress= "0x5Dc2957BE65C937dbe92513665F3FC4E951d5AD4";
  var contractAddress= "0xE9ed54Cc3F7159e9302cdddEE3AA71AB3CE4C5C9";
//   await transfer1155(walletAddress as Address, contractAddress as Address);
//   await addGroups(contractAddress as Address);
  await assignMembers(contractAddress as Address);
}

main()

