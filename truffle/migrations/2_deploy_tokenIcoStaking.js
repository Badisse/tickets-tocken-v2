const TicketToken = artifacts.require("TicketToken")
const ICO = artifacts.require("ICO")
const SingleStaking = artifacts.require("SingleStaking")

module.exports = async function (deployer) {

  const totalSupply = 550000000
  const multiSigAddr = deployer.options.from

  await deployer.deploy(
    TicketToken, 
    multiSigAddr, 
    totalSupply)

  console.log(TicketToken.address)

  const ticketTokenAddress = TicketToken.address
  const decimals = 18
  const minAmount = 1
  const maxAmount = 10
  const exchangeRate = 10000
  const maxCap = 3000
  const vestingDuration = 600
  const stepDuration = 60

  await deployer.deploy(
    ICO, 
    ticketTokenAddress,
    multiSigAddr,
    decimals,
    minAmount,
    maxAmount,
    exchangeRate,
    maxCap,
    vestingDuration,
    stepDuration
    )

  await deployer.deploy(
    SingleStaking,
    ticketTokenAddress
  )

};
