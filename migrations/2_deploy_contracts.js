const ETHSwap = artifacts.require("ETHSwap");

// Put these contracts on the blockchain
module.exports = function (deployer) {
  deployer.deploy(ETHSwap);
};