pragma solidity >=0.4.21 <0.7.0;

import "./Token.sol";

contract ETHSwap {
  string public name = "EthSwap";
  uint public rate = 100;   // Redemption Rate = # of tokens they receive for 1 ETH

  // Access to the code of Token.sol
  // It need to know the location of Token.sol
  Token public token;

  // Set the location of Token.sol
  constructor(Token _token) public {
    token = _token;
  }

  // payable allow this function to send ETH
  function buyTokens() public payable{
    // Amount of ETH * Redemption Rate
    // value is how much ETH was sent
    // Calculate the number of tokens to buy
    uint tokenAmount = msg.value * rate;

    // msg is a global variable in solidity
    // sender is an address that is calling this function
    token.transfer(msg.sender, tokenAmount);
  }
}
