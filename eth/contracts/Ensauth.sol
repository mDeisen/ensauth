// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";

interface ENS {
    function setResolver(bytes32 node, address resolver) external;
}

contract Ensauth is IERC1155Receiver, ERC165 {
    struct Role {
        bool exists;
        address[] users;
    }

    struct Application {
        bool exists;
        address[] appAdmins;
        mapping(string => Role) roles;
    }

    mapping(bytes32 => Application) private applications;

    /**
     * 
     * @param groupnode -- the namehash of the subdomain starting with "groups"
     * Check if the application exists. Revert if it does.
     * Set the resolver for the subdomain to the public ens resolver
     * Set the ens lookup address of the subdomain to the address of this contract
     */
    function registerApplication(bytes32 groupnode) public {
        
        // Check if the application exists. Revert if it does
        require(!applications[groupnode].exists, "Application already registered.");

        // Add the application entry
        applications[groupnode].exists = true;

        // Set the address in the resolver (currently hardcoded to the public resolver)
        ENS ens;
        ens.setResolver(groupnode, 0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63);
        
        // Set the ens lookup address of the subdomain to the address of this contract
        Resolver resolver;
        resolver.setAddr(groupnode, address(this));
    }

    /**
     * @param groupnode -- the namehash of the subdomain
     * @param roleName -- the name of the role
     * Revert if the application does not exists.
     * Revert if the role exists.
     * Add the role to the application
     */
    function registerRole(bytes32 groupnode, string memory roleName) public {
        require(applications[groupnode].exists, "Application does not exist.");
        require(!applications[groupnode].roles[roleName].exists,"Role already exists.");
        applications[groupnode].roles[roleName].exists = true;
    }

    /**
     * @param groupnode -- the namehash of the subdomain
     * @param roleName -- the name of the role
     * @param account -- the address of the account
     * Revert if the application does not exists.
     * Add the account to the role
     */
    function assignRole(
        bytes32 groupnode,
        string memory roleName,
        address account
    ) public {
        // Revert if the application does not existst
        require(applications[groupnode].exists, "Application does not exist.");

        // Revert if the role does not exist
        require(applications[groupnode].roles[roleName].exists,"Role does not exist.");

        // Add the account to the role
        applications[groupnode].roles[roleName].users.push(account);
    }

    /**
     * @param groupnode -- the namehash of the subdomain
     * @param roleName -- the name of the role
     * @param account -- the address of the account
     * Revert if the application does not exists.
     * Revert if the role does not exists.
     * Remove the account from the role
     */
    function removeRole(
        bytes32 groupnode,
        string memory roleName,
        address account
    ) public {
        // Revert if the application does not exist
        require(applications[groupnode].exists, "Application does not exist.");

        // Revert if the role does not exist
        require(applications[groupnode].roles[roleName].exists,"Role does not exist.");

        // Remove the account from the role
        Role storage role = applications[groupnode].roles[roleName];
        for (uint256 i = 0; i < role.users.length; i++) {
            if (role.users[i] == account) {
                role.users[i] = role.users[role.users.length - 1];
                role.users.pop();
                break;
            }
        }
    }

    function isAuthorized(
        bytes32 app,
        string memory roleName,
        address account
    ) public pure returns (bool) {
        return true;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC165, IERC165) returns (bool) {
        return
            interfaceId == type(IERC1155Receiver).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155Received}.
     * This function is called after a single token.
     * In case of a wrapped ENS token, the `data` parameter will contain the ENS subdomain data.
     * If the subdomain starts with "groups" & the owner of the parent domain sent the token, the application will be registered.
     */
    function onERC1155Received(
        address operator, // The address which initiated the transfer
        address from, // The address which previously owned the token
        uint256 id, // The labelhash of the .eth domain
        uint256 value, // ??
        bytes calldata data // ?? 
    ) external override returns (bytes4) {
        (
            string memory ensSubdomain,
            string memory ensParentDomain
        ) = extractEnsDomainsFromTokenData(id, data);

        // If the subdomain does not start with "groups" reject the token
        require(
            keccak256(abi.encodePacked(ensSubdomain)) ==
                keccak256(abi.encodePacked("groups")),
            "Subdomain must be 'groups'"
        );

        registerApplication(bytes32(id));

        return this.onERC1155Received.selector;
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155BatchReceived}.
     * For each token in the batch register the application if the subdomain starts with "groups"
     */
    function onERC1155BatchReceived(
        address operator, // The address which initiated the batch
        address from, // Registrant address
        uint256[] calldata ids, //labelhashes of the .eth domains
        uint256[] calldata values, // empty
        bytes calldata data
    ) external override returns (bytes4) {
        for (uint256 i = 0; i < ids.length; i++) {
            (string memory ensSubdomain, string memory ensParentDomain
            ) = extractEnsDomainsFromTokenData(ids[i], data);

            // If the subdomain does not start with "groups" reject the token
            require(keccak256(abi.encodePacked(ensSubdomain)) ==
                    keccak256(abi.encodePacked("groups")),"Subdomain must be 'groups'");

            registerApplication(bytes32(ids[i]));
        }
        return this.onERC1155BatchReceived.selector;
    }

    function subdomainStartsWithGroup(
        string memory subdomain
    ) internal pure returns (bool) {
        return true;
    }

    function extractEnsDomainsFromTokenData(
        uint256 id,
        bytes memory data
    ) private pure returns (string memory, string memory) {
        string memory ensSubdomain = "groups";
        string memory ensParentDomain = "example.eth";

        return (ensSubdomain, ensParentDomain);
    }
}
