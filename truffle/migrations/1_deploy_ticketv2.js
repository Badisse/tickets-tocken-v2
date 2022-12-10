const TicketV2 = artifacts.require("TicketV2");

module.exports = function (deployer) {
  deployer.deploy(TicketV2, '0x8424033c53Ce83A5898e26e569d3bA0794710Fed');
};

