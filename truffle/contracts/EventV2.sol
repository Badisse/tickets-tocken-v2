// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./TicketV2.sol";

contract EventV2 is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public _eventIds;

    enum EventType {
        Concert,
        Festival,
        Sport
    }

    struct EventInfo {
        address owner;
        string name;
        string date;
        string location;
        string image;
        EventType eventType;
        bool onSale;
        TicketV2 ticket;
    }

    address public vault = 0x8424033c53Ce83A5898e26e569d3bA0794710Fed;
    mapping(uint => EventInfo) public events;

    event EventCreated(
        uint id,
        EventInfo newEvent
    );

    event EventUpdated(
        uint id,
        EventInfo updatedEvent
    );

    modifier onlyEventOwner(address _eventOwner) {
        require(msg.sender == _eventOwner, "Not allowed");
        _;
    }

    function update(address _vault) external onlyOwner() {
        vault = _vault;
    }

    function createEvent(
        EventInfo calldata _eventInfo,
        TicketV2.TicketInfo[] calldata _ticketsInfo
    ) external {
        uint id = _eventIds.current();
        TicketV2 ticket = new TicketV2(
            msg.sender
        );

        events[id] = _eventInfo;

        ticket.createTickets(_ticketsInfo);
        
        emit EventCreated(id, events[id]);

        _eventIds.increment();
    }

    function updateEvent(
        uint _id,
        string calldata _name,
        string calldata _date,
        string calldata _location,
        string calldata _image,
        bool _onSale
    ) external {
        require(msg.sender == events[_id].owner, "Not allowed");

        events[_id].name = _name;
        events[_id].date = _date;
        events[_id].location = _location;
        events[_id].image = _image;
        events[_id].onSale = _onSale;

        emit EventUpdated(_id, events[_id]);
    }

    function createEventTickets(
        uint _eventId,
        TicketV2.TicketInfo[] calldata _ticketsInfo
    ) external onlyEventOwner(events[_eventId].owner) {
        events[_eventId].ticket.createTickets(_ticketsInfo);
    }

    function mintEventTickets(
        uint _eventId,
        uint[] calldata _ids,
        uint[] calldata _amounts
    ) external payable onlyOwner() nonReentrant() {

        events[_eventId].ticket.mintTickets(msg.sender, msg.value, _ids, _amounts);

        uint eventOwnerPayableValue = msg.value * 95 / 100;
        uint vaultPayableValue = msg.value * 5 / 100;

        (bool sentEventOwner,) = events[_eventId].owner.call{value: eventOwnerPayableValue}("");
        (bool sentVault,) = events[_eventId].owner.call{value: vaultPayableValue}("");
        require(sentEventOwner, "Transaction to Event Owner failed");
        require(sentVault, "Transaction to Vault failed");

    }
}
