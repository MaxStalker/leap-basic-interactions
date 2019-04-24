const ethers = require("ethers");
const config = require("./config");
const { Tx, Outpoint, Input, Output } = require('leap-core');


const { PRIVATE_KEY, RPC_URL } = config;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

let wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const mainAddress = "0xBbebEa9812971a5C2B7d99a99E7d8b4d5Fda7091";
const receiver = "0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f";
async function main() {

  let balance = await wallet.getBalance();
  console.log(ethers.utils.formatEther(balance));
/*
  let res = await provider.send('plasma_unspent',[mainAddress]);
  console.log(res[0]);
  const { output, outpoint} = res[0];

  const input = new Input(
    {
      prevout: outpoint,
      gasPrice: 0
    }
  )*/

  const value = ethers.utils.parseEther("0.03")._hex;
  const depositId = 0x0012;
  const depositTx = Tx.deposit(depositId, value, mainAddress, 0);
  const txRaw = depositTx.hex();

  const depositResponse = await provider.send('eth_sendRawTransaction', [txRaw]);
  console.log(depositResponse);

  const result = await provider.send('eth_getTransactionByHash',[depositResponse]);
  console.log(result);

  //console.log(ethers.utils.formatBytes32String("A1A1A1D1D1"));
  /*  let tx = {
    to: mainAddress,
    value: ethers.utils.parseEther("0.0017")
  };
  /!*

  let sendPromise = wallet.sendTransaction(tx);
  *!/

  const input = new Input(
    {
      prevout: new Outpoint(txHash, txIndex),
      gasPrice: 0,
      script: codeBuf,
    }
  );
  input.setMsgData(msgData);

  const output = new Output(txValue, msgSender, 0);
  const condTx = Tx.spendCond(
    [input],
    [output]
  );

  console.log('input', JSON.stringify(input));
  console.log('output', JSON.stringify(output));

  const txRaw = condTx.hex();

  const res = await provider.send('eth_sendRawTransaction', [txRaw]);
  console.log(res);*/
  /*
  sendPromise.then(tx => {
    console.log(tx);
  });*/
}

main();