pragma solidity >=0.4.21 <0.7.0;

import "./Token.sol";

contract ETHSwap {
  string public name = "EthSwap";

  // Access to the code of Token.sol
  // It need to know the location of Token.sol
  Token public token;

  // Set the location of Token.sol
  constructor(Token _token) public {
    token = _token;
  }
}
