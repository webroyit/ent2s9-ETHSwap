const Token = artifacts.require("Token");
const ETHSwap = artifacts.require("ETHSwap");

// Put these contracts on the blockchain
module.exports =  async function (deployer) {
  // Deploy Token contract
  await deployer.deploy(Token);
  const token = await Token.deployed();

  // Deploy ETHSwap contract
  await deployer.deploy(ETHSwap, token.address);
  const ethSwap = await ETHSwap.deployed();

  // Transfer all tokens to ETHSwap (1 Million)
  await token.transfer(ethSwap.address, '1000000000000000000000000');
};