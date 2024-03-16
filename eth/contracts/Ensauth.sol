// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";

contract Ensauth is IERC1155Receiver, ERC165 {
    struct Role {
        bool exists;
        mapping(address => bool) userExists;
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
        require(
            !applications[groupnode].exists,
            "Application already registered."
        );

        // Add the application entry
        applications[groupnode].exists = true;

        // Use default resolver

        // Set the ens lookup address of the subdomain to the address of this contract
        Resolver(0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63).setAddr(
            groupnode,
            address(this)
        );
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
        require(
            !applications[groupnode].roles[roleName].exists,
            "Role already exists."
        );
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
        require(applications[groupnode].exists, "Application does not exist.");
        Role storage role = applications[groupnode].roles[roleName];
        require(role.exists, "Role does not exist.");
        require(!role.userExists[account], "User already assigned to role.");

        role.userExists[account] = true;
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
        require(applications[groupnode].exists, "Application does not exist.");
        Role storage role = applications[groupnode].roles[roleName];
        require(role.exists, "Role does not exist.");
        require(role.userExists[account], "User not in role.");

        role.userExists[account] = false;
    }

    function isAuthorized(
        bytes32 groupnode,
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
        uint256 value, // Dont use
        bytes calldata data // Dont use
    ) external override returns (bytes4) {
        // Transform id into the namehash in bytes32
        bytes32 node = bytes32(id);

        // Lookup the name of the node
        string memory name = Resolver(
            0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63
        ).name(node);

        // Check if the subdomain starts with "groups"
        require(
            startsWith(name, "groups"),
            "Subdomain must start with 'groups'"
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
            // Transform id into the namehash in bytes32
            bytes32 node = bytes32(ids[i]);

            // Lookup the name of the node
            string memory name = Resolver(
                0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63
            ).name(node);

            // Check if the subdomain starts with "groups"
            require(
                startsWith(name, "groups"),
                "Subdomain must start with 'groups'"
            );

            registerApplication(bytes32(ids[i]));
        }
        return this.onERC1155BatchReceived.selector;
    }

    function startsWith(
        string memory name,
        string memory prefix
    ) public pure returns (bool) {
        bytes memory nameBytes = bytes(name);
        bytes memory prefixBytes = bytes(prefix);

        // If the prefix is longer than the name, it's impossible for the name to start with the prefix
        if (prefixBytes.length > nameBytes.length) {
            return false;
        }

        // Compare each byte of the prefix with the beginning of the name
        for (uint i = 0; i < prefixBytes.length; i++) {
            if (nameBytes[i] != prefixBytes[i]) {
                return false; // If any byte doesn't match, the name doesn't start with the prefix
            }
        }

        // If all bytes match, the name starts with the prefix
        return true;
    }
}
