pragma solidity >=0.4.21 <0.7.0;

import "./Token.sol";

contract ETHSwap {
  string public name = "EthSwap";
  uint public rate = 100;   // Redemption Rate = # of tokens they receive for 1 ETH

  // Access to the code of Token.sol
  // It need to know the location of Token.sol
  Token public token;

  // For showing history of token purchased
  event TokenPurchased(
    address account,
    address token,
    uint amount,
    uint rate
  );

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

    // Require that EthSwap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    // msg is a global variable in solidity
    // sender is an address that is calling this function
    token.transfer(msg.sender, tokenAmount);

    // Emit an event
    emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint _amount) public {
    // Calculate the amount of ETH to redeem
    uint etherAmount = _amount / rate;

    // Perform sale
    // transferFrom() allow this contract to spend your tokens for you
    // You mush call approve() for transferFrom() to work
    token.transferFrom(msg.sender, address(this), _amount);

    // transfer() send ETH to the person that call this function
    msg.sender.transfer(etherAmount);
  }
}
