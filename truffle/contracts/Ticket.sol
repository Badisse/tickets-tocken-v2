// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

// Ticket contract
contract Ticket is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter public _ticketIds;

    uint public price;
    uint public maxTicketsSupply;
    string public uri;
    address public eventOwner;

    // Event for when a ticket is created
    event TicketMinted(uint id, address owner);

    // Event for when a ticket is sold
    event TicketSold(uint id, address owner, uint price);

    constructor (
        string memory _name,
        string memory _symbol,
        uint _price,
        uint _maxTicketsSupply,
        string memory _uri,
        address _eventOwner
    ) ERC721(_name, _symbol) {
      price = _price;
      maxTicketsSupply = _maxTicketsSupply;
      uri = _uri;
      eventOwner = _eventOwner;
    }

    // Function to create a new ticket
    function mintTicket() external payable {
        require(_ticketIds.current() < maxTicketsSupply, 'Event sold out');
        require(msg.value == price, 'You must send the ticket price value');

        (bool sent,) = payable(eventOwner).call{value: msg.value}("");
        require(sent, 'Transaction failed');

        uint id = _ticketIds.current();
        _mint(msg.sender, id);

        // Emit event to indicate that the ticket has been created
        emit TicketMinted(id, msg.sender);

        _ticketIds.increment();
    }

}
