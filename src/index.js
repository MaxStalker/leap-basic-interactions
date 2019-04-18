/*
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
*/

import Web3 from 'web3';
import { helpers } from 'leap-core';

const web3 = helpers.extendWeb3(new Web3('https://testnet-node.leapdao.org'));

// Now you can use leap-specific methods

const accountAddr = "0xBbebEa9812971a5C2B7d99a99E7d8b4d5Fda7091";

// reads utxo for all colors
web3.getUnspent(accountAddr).then(utxo => {
  console.log(utxo);
});
