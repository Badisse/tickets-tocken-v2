// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";


// Ticket contract
contract TicketV2 is ERC1155, Ownable {
    address eventOwner;
    uint constant FEES = 5; // 5%

    struct TicketInfo {
        uint price;
        uint maxAmount;
        uint ticketsAvailables;
        string name;
        string image;
    }

    TicketInfo[] public tickets;

    event TicketsCreated(TicketInfo[] ticketsInfo);
    event TicketsMinted(address minter, uint[] ids, uint[] amounts);

    modifier onlyEventOwner() {
        require(msg.sender == eventOwner, "Not allowed");
        _;
    }

    constructor (address _eventOwner) ERC1155('') {
      eventOwner = _eventOwner;
    }

    function createTickets(
        TicketInfo[] calldata _ticketsInfo
    ) external onlyOwner {
        require(tickets.length + _ticketsInfo.length < 10, "To much tickets");
        
        for(uint i = 0; i<_ticketsInfo.length; i++) {
            tickets.push(_ticketsInfo[i]);
        }

        emit TicketsCreated(_ticketsInfo);
    }

    function mintTickets(
        address _minter,
        uint _msgValue,
        uint[] calldata _ids,
        uint[] calldata _amounts
    ) external payable onlyOwner() {
        require(_ids.length<=tickets.length, "To much tickets ids");
        for(uint i = 0; i<_ids.length; i++) {
            require(_ids[i]<tickets.length, "Ticket id not found");
            require(_amounts[i]<tickets[_ids[i]].ticketsAvailables, "Not enough tickets availables for this id");
            tickets[_ids[i]].ticketsAvailables -= _amounts[i];
        }
        uint totalTicketsPrice = 0;
        for(uint i = 0; i<_ids.length; i++) {
            totalTicketsPrice += tickets[_ids[i]].price * _amounts[i];
        }
        require(_msgValue == totalTicketsPrice, "Insuficient funds");
        _mintBatch(_minter, _ids, _amounts, '');
        
        emit TicketsMinted(_minter, _ids, _amounts);

    }

}
