import React, { Component } from 'react';
import Web3 from 'web3';

import './App.css';
import Token from './abis/Token.json';
import EthSwap from './abis/ETHSwap.json';
import Navbar from './components/Navbar';
import Main from './components/Main';

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    // Get account address
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Get ETH balance from the account
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance: ethBalance });

    // Get id of the network
    const networkId = await web3.eth.net.getId();

    // Load Token
    const tokenData = Token.networks[networkId];
    if (tokenData) {
      //Create a JS version of the contract
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token: token });

      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    }
    else {
      window.alert('Token contract not deployed to detected network.');
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap: ethSwap });
    }
    else {
      window.alert('EthSwap contract not deployed to detected network.');
    }

    this.setState({ loading: false });
  }

  buyTokens = (ethAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods.buyTokens().send({ value: ethAmount, from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false });
    })
  }

  render(){
    let content;

    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    }
    else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens} />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              {content}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
