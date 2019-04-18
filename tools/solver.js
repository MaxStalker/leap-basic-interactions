const ethUtil = require("ethereumjs-util");
const ethers = require("ethers");
const { Tx, Outpoint, Input, Output } = require('leap-core');

const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');

async function main() {

  const hand = process.argv[2];

  let roundLock;
  let abi;
  try {
    roundLock = require('./../build/contracts/RoundLock.json');
  } catch (e) {
    console.error('Please run `npm run compile:contracts` first. 😉');
    return;
  }
  console.log(roundLock);
  abi = new ethers.utils.Interface(roundLock.abi);
  const codeBuf = roundLock.deployedBytecode;
  const sender = '0x7A8D7dFd4d3DAD5FDf41d145AbD26D8cA05b3798';
  const txHash = '0xab22ff67d3480fca1754a9a6b9a58e6d6ee5739fcfe6e954bae7a7ae358ea4c7';
  const msgData = abi.functions.fullfill.encode([hand]);

  // replace following txHash on next round
  // need to be string!
  let tx = await provider.send('eth_getTransactionByHash', [txHash]);
  let txIndex = tx.transactionIndex;
  let txValue = tx.value;

  // create the spending condition
  const input = new Input(
    {
      prevout: new Outpoint(txHash, txIndex),
      gasPrice: 0,
      script: codeBuf,
    }
  );
  input.setMsgData(msgData);

  const output = new Output(txValue, sender, 0);
  const condTx = Tx.spendCond(
    [input],
    [output]
  );

  console.log('input', JSON.stringify(input));
  console.log('output', JSON.stringify(output));

  const txRaw = condTx.hex();
  const res = await provider.send('eth_sendRawTransaction', [txRaw]);
  console.log('transaction hash:', res);

}
function onException(e) {
  console.error(e);
  process.exit(1);
}

process.on("uncaughtException", onException);
process.on("unhandledRejection", onException);
main();
