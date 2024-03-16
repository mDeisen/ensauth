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

contract EnsAuth is IERC1155Receiver, ERC165 {
    struct Role {
        string[] users;
    }

    struct Application {
        bool exists; // Existence flag
        mapping(string => Role) roles;
    }

    mapping(bytes32 => Application) private applications;

    function registerApplication(
        bytes32 node,
        address /* ensAddress */
    ) public {
        require(!applications[node].exists, "Application already registered.");

        // Simply setting the existence flag is enough to "create" the application
        applications[node].exists = true;

        // Set the address in the resolver (currently hardcoded to the public resolver address on mainnet)
        ENS ens;
        ens.setResolver(node, 0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63);

        Resolver resolver;
        resolver.setAddr(node, address(this));
    }

    function registerRole(
        string memory appName,
        string memory roleName
    ) public {}

    function assignRole(
        string memory appName,
        string memory roleName,
        address account
    ) public {}

    function removeRole(
        string memory appName,
        string memory roleName,
        address account
    ) public {}

    function isAuthorized(
        string memory appName,
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
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data // this should be namehash of parent domain
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

        registerApplication(bytes32(id), from);

        return this.onERC1155Received.selector;
    }

    /**
     * @dev See {IERC1155Receiver-onERC1155BatchReceived}.
     * For each token in the batch, call `onERC1155Received`.
     * Not sure if this is the correct way to handle batch transfers.
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        for (uint256 i = 0; i < ids.length; i++) {
            this.onERC1155Received(operator, from, ids[i], values[i], data);
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
        // Example implementation. You'll need to replace this with actual logic to extract subdomain and parent domain
        string memory ensSubdomain = "groups";
        string memory ensParentDomain = "example.eth";

        return (ensSubdomain, ensParentDomain);
    }
}
