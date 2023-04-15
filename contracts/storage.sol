// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

contract ContractRegistry {
    mapping(address => address[]) public deployedContracts;

    function registerContract(address owner, address contractAddress) public {
        deployedContracts[owner].push(contractAddress);
    }

    function getDeployedContracts(address owner) public view returns (address[] memory) {
        return deployedContracts[owner];
    }
}
