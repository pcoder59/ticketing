// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
        string title;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    event NFTListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event NFTSold(
        uint256 indexed listingId,
        address indexed seller,
        address indexed buyer,
        address nftContract,
        uint256 tokenId,
        uint256 price
    );

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price, string memory _title) external {
        require(_nftContract != address(0), "Invalid NFT contract address");

        IERC721 nft = IERC721(_nftContract);
        require(nft.ownerOf(_tokenId) == msg.sender, "You do not own this NFT");

        Listing storage listing = listings[listingCounter];
        listing.seller = msg.sender;
        listing.nftContract = _nftContract;
        listing.tokenId = _tokenId;
        listing.price = _price;
        listing.active = true;
        listing.title = _title;

        emit NFTListed(listingCounter, msg.sender, _nftContract, _tokenId, _price);

        listingCounter++;
    }

    function buyNFT(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(msg.value >= listing.price, "Insufficient payment");

        IERC721 nft = IERC721(listing.nftContract);
        require(nft.ownerOf(listing.tokenId) == listing.seller, "Seller no longer owns the NFT");

        // Approve the marketplace contract to transfer the NFT
        nft.approve(address(this), listing.tokenId);

        address payable seller = payable(listing.seller);
        seller.transfer(listing.price);

        nft.safeTransferFrom(listing.seller, msg.sender, listing.tokenId);

        emit NFTSold(_listingId, listing.seller, msg.sender, listing.nftContract, listing.tokenId, listing.price);

        delete listings[_listingId];
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(listing.seller == msg.sender, "You are not the seller");

        listings[_listingId].active = false;
        delete listings[_listingId];
    }

    function isNFTListed(address _nftContract, uint256 _tokenId) external view returns (bool) {
        for (uint256 i = 0; i < listingCounter; i++) {
            Listing storage listing = listings[i];
            if (listing.nftContract == _nftContract && listing.tokenId == _tokenId && listing.active) {
                return true;
            }
        }
        return false;
    }

    function getListingId(address _nftContract, uint256 _tokenId) external view returns (uint256) {
        for (uint256 i = 0; i < listingCounter; i++) {
            Listing storage listing = listings[i];
            if (listing.nftContract == _nftContract && listing.tokenId == _tokenId && listing.active) {
                return i;
            }
        }
        revert("Listing not found");
    }

    function getAllListedNFTs() external view returns (Listing[] memory) {
        Listing[] memory listedNFTs = new Listing[](listingCounter);
        
        for (uint256 i = 0; i < listingCounter; i++) {
            Listing storage listing = listings[i];
            if (listing.active) {
                listedNFTs[i] = listing;
            }
        }
        
        return listedNFTs;
    }
}