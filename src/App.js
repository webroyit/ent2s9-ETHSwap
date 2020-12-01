import React, { Component } from 'react';
import './App.css';

import Navbar from './components//Navbar';

class App extends Component{
  render(){
    return (
      <div>
        <Navbar />
        <h1 className="text-center mt-5">ETH Swap</h1>
      </div>
    );
  }
}

export default App;
