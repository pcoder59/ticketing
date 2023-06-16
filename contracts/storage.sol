// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

contract ContractRegistry {
    mapping(address => address[]) public deployedContracts;
    address[] private owners;

    function registerContract(address owner, address contractAddress) public {
        if (getDeployedContracts(owner).length == 0) {
            owners.push(owner);
        }
        deployedContracts[owner].push(contractAddress);
    }

    function getDeployedContracts(address owner) public view returns (address[] memory) {
        return deployedContracts[owner];
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }
}
