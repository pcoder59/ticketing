// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketingSystem is ERC721 {
    address public owner = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
    address public organizer;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public ticketsSold;
    uint256 public deploymentFee = 1 ether;
    bool public isActive;
    string public description;
    string public datetime;
    string public location;
    string public baseURI;

    mapping(address => uint256[]) private ownedTokens;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _ticketPrice,
        uint256 _totalTickets,
        string memory _description,
        string memory _datetime,
        string memory _location,
        string memory _baseURI
    ) ERC721(_name, _symbol) payable {
        require(
            msg.value == deploymentFee,
            "Please Pay the Deployment Fee to Deploy!"
        );
        address payable receiver = payable(owner);
        receiver.transfer(msg.value);
        organizer = msg.sender;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        ticketsSold = 0;
        isActive = true;
        description = _description;
        datetime = _datetime;
        location = _location;
        baseURI = _baseURI;
    }

    function buyTicket() public payable {
        require(isActive == true, "Ticket sales are currently closed");
        require(ticketsSold < totalTickets, "All tickets have been sold");
        require(
            msg.value == ticketPrice,
            "Incorrect ticket price"
        );
        uint256 ticketId = ticketsSold + 1;
        address payable receiver = payable(organizer);
        receiver.transfer(msg.value);
        _safeMint(msg.sender, ticketId);
        string newURI = "localhost:8080/ipfs/" + baseURI + "?filename=" + ticketId + ".json";
        _setTokenURI(ticketId, newURI);
        ticketsSold++;
        ownedTokens[msg.sender].push(ticketId);
        if (ticketsSold == totalTickets) {
            isActive = false;
        }
    }

    function getTicketIdsByOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        return ownedTokens[_owner];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(
            _isApprovedOrOwner(msg.sender, tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        _safeTransfer(from, to, tokenId, "");
        removeTokenFromOwner(from, tokenId);
        ownedTokens[to].push(tokenId);
    }

    function removeTokenFromOwner(address _owner, uint256 _tokenId) private {
        uint256[] storage tokenList = ownedTokens[_owner];
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (tokenList[i] == _tokenId) {
                tokenList[i] = tokenList[tokenList.length - 1];
                tokenList.pop();
                return;
            }
        }
    }

    function openTicketSales() public {
        require(
            msg.sender == organizer,
            "Only the event organizer can open ticket sales"
        );
        isActive = true;
    }

    function closeTicketSales() public {
        require(
            msg.sender == organizer,
            "Only the event organizer can close ticket sales"
        );
        isActive = false;
    }

    function cancelEvent() public {
        require(
            msg.sender == organizer,
            "Only the event organizer can cancel the event"
        );
        // Transfer any remaining balance to the organizer's account
        if (address(this).balance > 0) {
            payable(organizer).transfer(address(this).balance);
        }
    }
}