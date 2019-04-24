const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  process.env["RPC_URL"] || "https://testnet-node1.leapdao.org"
);

const address = "0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f";
const privateKey =
  "0xebd01224a408a5e8a4a842f822357678b6c302f7b336132e51b5110b9681510f";

let wallet = new ethers.Wallet(privateKey, provider);
const { Tx, Outpoint, Input, Output } = require('leap-core');


const { utils } = ethers;
console.log(wallet.address);

const mainAddress = "0xBbebEa9812971a5C2B7d99a99E7d8b4d5Fda7091";

let amount = ethers.utils.parseEther('1.0');

let tx = {
  to: mainAddress,
  // ... or supports ENS names
  // to: "ricmoo.firefly.eth",

  // We must pass in the amount as wei (1 ether = 1e18 wei), so we
  // use this convenience function to convert ether to wei.
  value: ethers.utils.parseEther('0.0017')
};

let sendPromise = wallet.sendTransaction(tx);

sendPromise.then((tx) => {
  console.log(tx);
  // {
  //    // All transaction fields will be present
  //    "nonce", "gasLimit", "pasPrice", "to", "value", "data",
  //    "from", "hash", "r", "s", "v"
  // }
});


provider.getBalance(address).then(balance => {
  let etherString = utils.formatEther(balance);
  console.log(etherString);
});
