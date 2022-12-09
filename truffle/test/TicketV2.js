// Import the contract artifacts and truffle assert library
const TicketV2 = artifacts.require('TicketV2');
const truffleAssert = require('truffle-assertions')

// Test the contract deployment
contract('TicketV2', (accounts) => {
  let ticketContract;
  let eventOwner = accounts[0];

  beforeEach(async () => {
    ticketContract = await TicketV2.new(eventOwner);
  });

  it('should deploy the contract successfully', async () => {
    assert.isOk(ticketContract.address);
  });
});

// Test the createTickets function
contract('TicketV2', (accounts) => {
  let ticketContract;
  let eventOwner = accounts[0];

  beforeEach(async () => {
    ticketContract = await TicketV2.new(eventOwner);
  });

  it('should create tickets successfully', async () => {
    let ticket1 = {
      price: 10,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 1',
      image: 'http://www.ticket1.com/image.png'
    }
    let ticket2 = {
      price: 20,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 2',
      image: 'http://www.ticket2.com/image.png'
    }
    let ticket3 = {
      price: 30,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 3',
      image: 'http://www.ticket3.com/image.png'
    }
    let ticketsInfo = [ticket1, ticket2, ticket3];
    let result = await ticketContract.createTickets(ticketsInfo);

    // Check that the TicketsCreated event was emitted
    truffleAssert.eventEmitted(result, 'TicketsCreated', ev => {
      return ev.ticketsInfo[0].price.toString() == ticket1.price.toString() &&
        ev.ticketsInfo[1].price.toString() == ticket2.price.toString() &&
        ev.ticketsInfo[2].price.toString() == ticket3.price.toString();
    });

    // Check that the tickets were added to the contract
    let ticket1Res = await ticketContract.tickets(0);
    assert.equal(ticket1Res.price, ticket1.price);
    assert.equal(ticket1Res.maxAmount, ticket1.maxAmount);
    assert.equal(ticket1Res.ticketsAvailables, ticket1.ticketsAvailables);
    assert.equal(ticket1Res.name, ticket1.name);
    assert.equal(ticket1Res.image, ticket1.image);
  });

  it('should not create tickets if the total number of tickets is greater than 10', async () => {
    let ticket1 = {
      price: 10,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 1',
      image: 'http://www.ticket1.com/image.png'
    }
    let ticket2 = {
      price: 20,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 2',
      image: 'http://www.ticket2.com/image.png'
    }
    let ticket3 = {
      price: 30,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 3',
      image: 'http://www.ticket3.com/image.png'
    }
    let ticket4 = {
      price: 40,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 4',
      image: 'http://www.ticket4.com/image.png'
    }
    let ticket5 = {
      price: 50,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 5',
      image: 'http://www.ticket5.com/image.png'
    }
    let ticket6 = {
      price: 60,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 6',
      image: 'http://www.ticket6.com/image.png'
    }
    let ticket7 = {
      price: 70,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 7',
      image: 'http://www.ticket7.com/image.png'
    }
    let ticket8 = {
      price: 80,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 8',
      image: 'http://www.ticket8.com/image.png'
    }
    let ticket9 = {
      price: 90,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 9',
      image: 'http://www.ticket9.com/image.png'
    }
    let ticket10 = {
      price: 100,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 10',
      image: 'http://www.ticket10.com/image.png'
    }
    let ticket11 = {
      price: 110,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 11',
      image: 'http://www.ticket11.com/image.png'
    }
    let ticketsInfo = [ticket1, ticket2, ticket3, ticket4, ticket5, ticket6, ticket7, ticket8, ticket9, ticket10, ticket11];
    // Check that the createTickets function reverts if there are more than 10 tickets
    await truffleAssert.reverts(
      ticketContract.createTickets(ticketsInfo),
      'To much tickets'
    );
  });
});

// Test the mintTickets function
contract('TicketV2', (accounts) => {
  let ticketContract;
  let eventOwner = accounts[0];
  let minter = accounts[0];

  beforeEach(async () => {
    ticketContract = await TicketV2.new(eventOwner);
    let ticket1 = {
      price: 10,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 1',
      image: 'http://www.ticket1.com/image.png'
    }
    let ticket2 = {
      price: 20,
      maxAmount: 100,
      ticketsAvailables: 100,
      name: 'Ticket 2',
      image: 'http://www.ticket2.com/image.png'
    }
    let ticketsInfo = [ticket1, ticket2];
    await ticketContract.createTickets(ticketsInfo);
  });

  it('should mint tickets successfully', async () => {
    let ids = [0, 1];
    let amounts = [1, 2];
    let totalPrice = 10 + (20 * 2);
    let result = await ticketContract.mintTickets(minter, totalPrice, ids, amounts, { from: eventOwner, value: totalPrice });

    // Check that the TicketsMinted event was emitted
    truffleAssert.eventEmitted(result, 'TicketsMinted', ev => {
      return ev.minter == minter &&
        ev.ids.toString() == ids.toString() &&
        ev.amounts.toString() == amounts.toString();
    });

    // Check that the tokens were minted for the minter
    let balance = await ticketContract.balanceOf(minter, ids[0]);
    assert.equal(balance.toString(), '1');
  });

  it('should not mint tickets if the total number of ticket ids is greater than the number of tickets in the contract', async () => {
    let ids = [0, 1, 2];
    let amounts = [1, 2, 3];
    let totalPrice = 10 + (20 * 2);

    // Check that the mintTickets function reverts if there are more ticket ids than tickets in the contract
    await truffleAssert.reverts(
      ticketContract.mintTickets(minter, totalPrice, ids, amounts, { from: eventOwner, value: totalPrice }),
      'To much tickets ids'
    );
  });

  it('should not mint tickets if the provided ticket id does not exist in the contract', async () => {
    let ids = [0, 2];
    let amounts = [1, 2];
    let totalPrice = 10 + (20 * 2);

    // Check that the mintTickets function reverts if the provided ticket id does not exist
    await truffleAssert.reverts(
      ticketContract.mintTickets(minter, totalPrice, ids, amounts, { from: eventOwner, value: totalPrice }),
      'Ticket id not found'
    );
  });

  it('should not mint tickets if there are not enough tickets availables for the provided id', async () => {
    let ids = [0, 1];
    let amounts = [101, 1];
    let totalPrice = 10 + (20 * 1);

    // Check that the mintTickets function reverts if there are not enough tickets availables for the provided id
    await truffleAssert.reverts(
      ticketContract.mintTickets(minter, totalPrice, ids, amounts, { from: eventOwner, value: totalPrice }),
      'Not enough tickets availables for this id'
    );
  });

  it('should not mint tickets if the msg.value is less than the total price of the tickets', async () => {
    let ids = [0, 1];
    let amounts = [1, 1];
    let totalPrice = 10 + (20 * 1);

    // Check that the mintTickets function reverts if the msg.value is less than the total price of the tickets
    await truffleAssert.reverts(
      ticketContract.mintTickets(minter, totalPrice - 1, ids, amounts, { from: eventOwner, value: totalPrice - 1 }),
      'Insuficient funds'
    );
  });
});


