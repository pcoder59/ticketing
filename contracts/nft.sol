//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketingSystem is ERC721 {
    address public organizer;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public ticketsSold;
    bool public isActive;
    string description;
    string datetime;
    string location;
    
    constructor(string memory _name, string memory _symbol, uint256 _ticketPrice, uint256 _totalTickets, string memory _description, string memory _datetime, string memory _location) ERC721(_name, _symbol) {
        organizer = msg.sender;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        ticketsSold = 0;
        isActive = false;
        description = _description;
        datetime = _datetime;
        location = _location;
    }
    
    function buyTicket() public payable {
        require(isActive == true, "Ticket sales are currently closed");
        require(ticketsSold < totalTickets, "All tickets have been sold");
        require(msg.value == ticketPrice, "Incorrect ticket price");
        uint256 ticketId = ticketsSold + 1;
        _safeMint(msg.sender, ticketId);
        ticketsSold++;
    }
    
    function transferTicket(address _to, uint256 _tokenId) public {
        require(_exists(_tokenId), "Ticket does not exist");
        require(ownerOf(_tokenId) == msg.sender, "You do not own this ticket");
        safeTransferFrom(msg.sender, _to, _tokenId);
    }
    
    function openTicketSales() public {
        require(msg.sender == organizer, "Only the event organizer can open ticket sales");
        isActive = true;
    }
    
    function closeTicketSales() public {
        require(msg.sender == organizer, "Only the event organizer can close ticket sales");
        isActive = false;
    }
    
    function cancelEvent() public {
        require(msg.sender == organizer, "Only the event organizer can cancel the event");
        // Transfer any remaining balance to the organizer's account
        if (address(this).balance > 0) {
            payable(organizer).transfer(address(this).balance);
        }
    }
}
