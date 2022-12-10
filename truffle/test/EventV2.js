const EventV2 = artifacts.require("EventV2");

contract("EventV2", function (accounts) {
  let eventV2;

  beforeEach(async function () {
    eventV2 = await EventV2.new();
  });

  it("should create an event", async function () {
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

    await eventV2.createEvent(
      "My Concert",
      "2022-12-31",
      "New York",
      "https://example.com/image.png",
      true,
      0,
      ticketsInfo
    );

    const eventInfo = await eventV2.events(0);

    assert.equal(eventInfo.name, "My Concert");
    assert.equal(eventInfo.date, "2022-12-31");
    assert.equal(eventInfo.location, "New York");
    assert.equal(eventInfo.image, "https://example.com/image.png");
    assert.equal(eventInfo.eventType, 0);
    assert.isTrue(eventInfo.onSale);
  });
});