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

We currently support group and user creation, assignment and deletion. The groups and group memberships are made visible on the ens subdomain as records.

## Purpose
Permission management is a central aspect of any application. With our solution that integrates with the widely adopted ENS protocol we propose a standard setup for permission management in Web3 applications.

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
