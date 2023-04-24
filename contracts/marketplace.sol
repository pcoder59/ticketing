// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace is ERC721 {
    using SafeMath for uint256;
    address public owner;

    struct NFT {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool forSale;
        address contractAddress;
    }

    uint256 private nftCount;
    mapping (uint256 => NFT) private nfts;
    mapping (address => bool) private allowedContracts;

    constructor(string memory _name, string memory _symbol, address[] memory _initialAllowedContracts) ERC721(_name, _symbol) {
        owner = msg.sender;
        // Add the allowed contracts to the mapping
        for (uint256 i = 0; i < _initialAllowedContracts.length; i++) {
            allowedContracts[_initialAllowedContracts[i]] = true;
        }
    }

    function sellNFT(uint256 _tokenId, uint256 _price) public {
        require(msg.sender == ownerOf(_tokenId), "You can only sell an NFT that you own");
        require(_price > 0, "Price must be greater than 0");
        require(allowedContracts[nfts[_tokenId].contractAddress], "This NFT contract is not allowed in the marketplace");
        nfts[_tokenId].price = _price;
        nfts[_tokenId].forSale = true;
    }

    function buyNFT(uint256 _tokenId) public payable {
        require(nfts[_tokenId].forSale, "NFT is not for sale");
        require(msg.value >= nfts[_tokenId].price, "Insufficient funds to buy NFT");
        address payable seller = payable(nfts[_tokenId].owner);
        seller.transfer(msg.value);
        safeTransferFrom(seller, msg.sender, _tokenId);
        nfts[_tokenId].forSale = false;
        nfts[_tokenId].price = 0;
    }

    function addNFT(uint256 _tokenId, address _contractAddress) public {
        require(allowedContracts[_contractAddress], "This NFT contract is not allowed in the marketplace");
        require(ownerOf(_tokenId) == msg.sender, "You can only add an NFT that you own");
        nfts[nftCount] = NFT(_tokenId, msg.sender, 0, false, _contractAddress);
        nftCount++;
        ERC721(_contractAddress).transferFrom(msg.sender, address(this), _tokenId);
    }

    function removeNFT(uint256 _tokenId) public {
        require(nfts[_tokenId].owner == msg.sender, "You can only remove an NFT that you own");
        ERC721(nfts[_tokenId].contractAddress).transferFrom(address(this), msg.sender, _tokenId);
        delete nfts[_tokenId];
    }

    function getNFT(uint256 _index) public view returns (uint256, address, uint256, bool, address) {
        require(_index < nftCount, "Index out of range");
        NFT memory nft = nfts[_index];
        return (nft.tokenId, nft.owner, nft.price, nft.forSale, nft.contractAddress);
    }

    function getNFTCount() public view returns (uint256) {
        return nftCount;
    }

    // Only the contract owner can add an allowed contract address
    function addAllowedContract(address _contractAddress) public onlyOwner {
        allowedContracts[_contractAddress] = true;
    }

    // Only the contract owner can remove an allowed contract address
    function removeAllowedContract(address _contractAddress) public onlyOwner {
        allowedContracts[_contractAddress] = false;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }
}