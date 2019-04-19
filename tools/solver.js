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
  const sender = '0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f';

  // both of those from server
  const codeBuf = roundLock.deployedBytecode;
  const txHash = '0x0508e7237bd38e9e04d7c80bc9477a1547ed9c4b8d08ac7d5491cf71dfa37bf3';

  // array is specific to ethers implementation
  const msgData = abi.functions.roundResult.encode([hand]);

  // replace following txHash on next round
  // need to be string!
  let tx = await provider.send('eth_getTransactionByHash', [txHash]);
  let txIndex = tx.transactionIndex;
  let txValue = tx.value;

  // create the spending condition
  const input = new Input(
    {
      prevout: new Outpoint(txHash, txIndex),
      script: codeBuf,
    }
  );
  input.setMsgData(msgData);

  // TODO: for Johann
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
