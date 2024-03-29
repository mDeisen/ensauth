// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import hardhat logger
import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol";
import "@ensdomains/ens-contracts/contracts/wrapper/INameWrapper.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// Emit TextChanged Event on Change

contract Ensauth is IERC1155Receiver, ERC165, Initializable, ITextResolver {
    struct Role {
        bool exists;
        string[] users;
        mapping(address => bool) userExists;
    }

    struct Application {
        bool exists;
        address[] appAdmins;
        string[] rolesArray;
        mapping(string => Role) roles;
    }

    mapping(bytes32 => Application) private applications;

    uint public val;

    function initialize(uint256 _val) external initializer {
        val = _val;
    }

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
        applications[groupnode].appAdmins.push(msg.sender);

        // Use default resolver

        // Set the ens lookup address of the subdomain to the address of this contract
        // Sepolia
        INameWrapper(0x0635513f179D50A207757E05759CbD106d7dFcE8).setResolver(
            groupnode,
            address(this)
        );

        constructTextRecordsAndEmitEvent(groupnode);
    }

    /**
     * @param groupnode -- the namehash of the subdomain
     * @param roleName -- the name of the role
     * Revert if the application does not exists.
     * Revert if the role exists.
     * Add the role to the application
     */
    function registerRole(bytes32 groupnode, string memory roleName) public {
        require(applications[groupnode].exists, "RegisterRole: Application does not exist");
        require(
            !applications[groupnode].roles[roleName].exists,
            "Role already exists."
        );
        applications[groupnode].roles[roleName].exists = true;
        applications[groupnode].rolesArray.push(roleName);
        
        string memory result = arrayToString(applications[groupnode].rolesArray);
        emit TextChanged(groupnode, "groups", "groups", result);
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
        require(applications[groupnode].exists, "AssignRole: Application does not exist.");
        Role storage role = applications[groupnode].roles[roleName];
        require(role.exists, "Role does not exist.");
        require(!role.userExists[account], "User already assigned to role.");

        applications[groupnode].roles[roleName].userExists[account] = true;
        
        string memory accountS = Strings.toHexString(uint256(uint160(account)), 20);
        applications[groupnode].roles[roleName].users.push(accountS);
 
        
        constructTextRecordsAndEmitEvent(groupnode);
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

        for (uint i = 0; i < role.users.length; i++) {
            if (keccak256(bytes(role.users[i])) == keccak256(bytes(string(abi.encodePacked(account))))){
                role.users[i] = role.users[role.users.length - 1];
                role.users.pop();
                break;
            }
        }

        constructTextRecordsAndEmitEvent(groupnode);
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

        // Sepolia
        bytes memory name = INameWrapper(
            0x0635513f179D50A207757E05759CbD106d7dFcE8
        ).names(node);

        // Check if the subdomain starts with "groups"
        require(
            startsWith(name, bytes("groups")),
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
            registerApplication(bytes32(ids[i]));
        }
        return this.onERC1155BatchReceived.selector;
    }

    function startsWith(
        bytes memory name,
        bytes memory prefix
    ) public pure returns (bool) {
        // If the prefix is longer than the name, it's impossible for the name to start with the prefix
        if (prefix.length > name.length) {
            return false;
        }

        if (name[0] != bytes1(0x06)) {
            return false;
        }

        // Compare each byte of the prefix with the beginning of the name
        for (uint i = 0; i < prefix.length; i++) {
            if (name[i + 1] != prefix[i]) {
                return false; // If any byte doesn't match, the name doesn't start with the prefix
            }
        }

        // If all bytes match, the name starts with the prefix
        return true;
    }

    /**
     * Returns the text data associated with an ENS node and key.
     * @param node The ENS node to query.
     * @param key The text data key to query.
     * @return The associated text data as json with all groups and roles.
     */
    function text(
        bytes32 node,
        string calldata key
    ) external view returns (string memory) {

        // Return groups if it is groups
        if (keccak256(bytes(key)) == keccak256("groups")) {
            require(applications[node].exists, "TextResolver - Groups: Application does not exist.");
            string memory result = arrayToString(applications[node].rolesArray);
            return result;
        } 
        require(applications[node].exists, "TextResolver: Application does not exist.");

        require(applications[node].roles[key[7:]].exists, "Role does not exist."); 
        return arrayToString(applications[node].roles[key[7:]].users);
    }

    /**
     * Emits a TextChanged event for the given node and key.
     * @param node The ENS node to emit the events for.
     */
    function constructTextRecordsAndEmitEvent(
        bytes32 node
    ) public {

        // First emit the groups
        string memory result = arrayToString(applications[node].rolesArray);
        emit TextChanged(node, "groups", "groups", result);

        // Then emit the roles as groups.rolename
        for (uint i = 0; i < applications[node].rolesArray.length; i++) {
            string memory role = applications[node].rolesArray[i];

            string memory value = arrayToString(applications[node].roles[role].users);
            string memory key = concatenateStrings("groups.", role);
            emit TextChanged(node, key, key, value);
        }
    }

    /**
     * 
     * @param array -- the array to convert to string
     * @return result -- the space delimited string representation of the array
     */
    function arrayToString(
        string[] memory array
    ) private pure returns (string memory) {
        string memory result = "";
        for (uint i = 0; i < array.length; i++) {
            result = string(abi.encodePacked(result, array[i], " "));
        }
        return result;
    }

    function concatenateStrings(string memory a, string memory b) public pure returns (string memory) {
        bytes memory concatenatedBytes = abi.encodePacked(a, b);
        return string(concatenatedBytes);
    }
}
