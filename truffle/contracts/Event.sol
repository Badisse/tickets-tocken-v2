// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./Ticket.sol";

// Event contract
contract Event {
    using Counters for Counters.Counter;
    Counters.Counter public _eventIds;

    // Struct for storing event information
    struct EventInfo {
        string name;
        string date;
        string location;
        Ticket ticket;
        string uri;
    }

    // Mapping from event id to event struct
    mapping(uint => EventInfo) public events;

    // Event for when an event is created
    event EventCreated(
        uint id,
        string name,
        string date,
        string location,
        Ticket ticket,
        string uri
    );

    // Event for when an event is updated
    event EventUpdated(uint id, string name, string date, string location);

    // Function to create a new event
    function createEvent(
        string memory _name,
        string memory _date,
        string memory _location,
        string memory _uri,
        string memory _ticketName,
        string memory _ticketSymbol,
        uint _ticketPrice,
        uint _maxTicketSupply,
        string memory _ticketURI
    ) external {
        uint id = _eventIds.current();
        Ticket ticket = new Ticket(
            _ticketName,
            _ticketSymbol,
            _ticketPrice,
            _maxTicketSupply,
            _ticketURI,
            msg.sender
        );

        events[id] = EventInfo({
          name: _name,
          date: _date,
          location: _location,
          ticket: ticket,
          uri: _uri
        });

        // Emit event to indicate that the event has been created
        emit EventCreated(id, _name, _date, _location, ticket, _uri);

        _eventIds.increment();
    }

    // Function to update an existing event
    function updateEvent(
        uint _id,
        string memory _name,
        string memory _date,
        string memory _location,
        string memory _uri
    ) external {
        events[_id].name = _name;
        events[_id].date = _date;
        events[_id].location = _location;
        events[_id].uri = _uri;

        emit EventUpdated(_id, _name, _date, _location);
    }
}
