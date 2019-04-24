const ethUtil = require('ethereumjs-util');
const ethers = require('ethers');
const { Tx, Outpoint, Input, Output } = require('leap-core');
const config = require('./hashConfig');

const {txHash} = config;

const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');

async function main() {
  let spendingCondition;

  try {
    spendingCondition = require('./../build/contracts/HashLock.json');
  } catch (e) {
    console.error('Please run `npm run compile:contracts` first');
    return;
  }

  const codeBuf = spendingCondition.deployedBytecode;
  const msgSender = "0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f";
  const abi = new ethers.utils.Interface(spendingCondition.abi);
  const answer = ethers.utils.formatBytes32String('A1A1A1D1D1');
  const resolverName = "roundResult";
  const msgData = abi.functions[resolverName].encode([answer]);

  // Create new transaction
  const tx = await provider.send('eth_getTransactionByHash', [txHash]);
  console.log(tx);
  const txIndex = tx.transactionIndex;
  const txValue = tx.value;

  // create the spending condition
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
  const txRaw = condTx.hex();
  const res = await provider.send('eth_sendRawTransaction', [txRaw]);
  console.log('transaction hash:', res);
}

main();