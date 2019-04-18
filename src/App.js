import React, { Component } from "react";
import "./App.css";
import Web3 from 'web3'
import {helpers} from "leap-core";

/*const url = "https://testnet-node1.leapdao.org";
const socket = "wss://testnet-node1.leapdao.org:1443";
const provider = new Web3.providers.HttpProvider(url);
const wsProvider = new Web3.providers.WebsocketProvider(socket);
const w3instance = new Web3(wsProvider);
const web3 = helpers.extendWeb3(w3instance);
console.log(web3)*/


//
// let randomHash = this.state.web3.utils.sha3(""+Math.random())
// let randomWallet = this.state.web3.eth.accounts.create()
// let sig = this.state.web3.eth.accounts.sign(randomHash, randomWallet.privateKey);
// console.log("STATE",this.state,this.state.contracts)

const XDAI_PROVIDER = "wss://testnet-node1.leapdao.org:1443";
const WEB3_PROVIDER = "https://rinkeby.infura.io/v3/f039330d8fb747e48a7ce98f51400d65"
const WEB_3_WSS = "wss://rinkeby.infura.io/ws/v3/f039330d8fb747e48a7ce98f51400d65"
let mainnetweb3 = new Web3(new Web3.providers.WebsocketProvider(WEB_3_WSS));
//let xdaiweb3 = helpers.extendWeb3(new Web3(new Web3.providers.WebsocketProvider(XDAI_PROVIDER)));


class App extends Component {
  state = {
    list: []
  };
  componentDidMount() {
    //web3.status().then((status)=>console.log(status))
  }

  render() {
    const { list } = this.state;
    return (
      <div className="App">
        {list.map((token, index) => {
          console.log(token);
          return <div>{index}</div>;
        })}
      </div>
    );
  }
}

export default App;
