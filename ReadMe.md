# ENSAuth - ENS Based Permission Management for Your Web3 App

- [ENSAuth - ENS Based Permission Management for Your Web3 App](#ensauth---ens-based-permission-management-for-your-web3-app)
  - [TLDR](#tldr)
  - [Purpose](#purpose)
  - [How its made](#how-its-made)
    - [Smart Contract](#smart-contract)
      - [Application Registration](#application-registration)
      - [Role Management](#role-management)
      - [User Management](#user-management)
    - [Frontend](#frontend)

## TLDR
By minting and wrapping a subdomain called 'groups' on your ENS domain and sending it to the ensauth contract you can onboard your ens domain to a permissioning system. The whole process can be comfortably managed through our webapp.

We currently support group and user creation, assignment and deletion. The groups and group memberships are made visible on the ENS subdomain as text records.

## Purpose
Permission management is a central aspect of any application. With our solution that integrates with the widely adopted ENS protocol we propose a standard setup for permission management in Web3 applications. Through this mechanism, multiple smart contracts and applications may use the same user groups. These can be managed centrally through our frontend. Especially for privileged users, ENSAuth drastically improves ease of management and transparency.

## How its made
The solution consists of a smart contract and a frontend.

### [Smart Contract](eth/contracts/Ensauth.sol)

#### Application Registration
 The Smart Contract implements the [IERC1155Receiver](https://docs.openzeppelin.com/contracts/4.x/api/token/erc1155#IERC1155Receiver) interface. When the contract receives a wrapped ens 'groups' subdomain, it will register the subdomain as an application and set itself as the resolver for the subdomain.

#### Role Management
 After the application is registered, arbitrary roles can be added to the application. The roles of an application are visible as an ENS text record. When roles are added or removed a 'TextChanged' event is emitted and the text record updated. This is achieved by implementing the [ITextResolver Interface](https://github.com/ensdomains/ens-contracts/blob/staging/contracts/resolvers/profiles/ITextResolver.sol)

#### User Management
 When roles are available, users can be added to and removed from the created roles. Similar to the roles, users role assignments are reflected on ENS as text records.

### [Frontend](webapp/)

#### Frameworks

The application is based on Next JS and uses ConnectKit to interface with wallets such as MetaMask. Transactions and calls are made through Alchemy RPC.

To improve the user experience, components from ENS' Thorin design system are reused. Layout is based on Bulma.

#### ENS for provision of permissions

The frontend relies heavily on ENS standards to verify ownership of domains (and by extension apps) and to simplify user management. For example, administrators can enter ENS names instead of addresses to manage group memberships. Most read operations regarding group memberships are also done with ENS as group information is exposed with text records.

To that end, we make use of the latest version of @ensdomains/ensjs and Viem.

#### ENS as directory service

Albeit it is only implemented partially, the frontend also demonstrates ENS potential as fully fledged directory service. Here, roles and groups are displayed alongside personal information taken from text records. This information is available to any app that choses to use the same groups.
