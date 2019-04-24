#!/usr/bin/env node

const ethUtil = require('ethereumjs-util');
const ethers = require('ethers');
const { Tx, Outpoint, Input, Output } = require('leap-core');

const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');

const RECEIVER_PLACEHOLDER = '1111111111111111111111111111111111111111';
const TOKEN_PLACEHOLDER = '2222222222222222222222222222222222222222';


console.log(ethers.utils.formatBytes32String("A1A1A1D1D1"));

async function main() {
  let msgSender;
  let abi;
  let codeBuf;
  let codeHash;
  let spAddr;
  //let msgData;
  let spendingCondition;

  try {
    spendingCondition = require('./../build/contracts/HashLockCondition.json');
  } catch (e) {
    console.error('Please run `npm run compile:contracts` first. 😉');
    return;
  }

  const hand = "test";
  abi = new ethers.utils.Interface(spendingCondition.abi);
  codeBuf = spendingCondition.deployedBytecode

  codeHash = ethUtil.ripemd160(codeBuf);
  spAddr = '0x' + codeHash.toString('hex');
  //msgData = abi.functions.roundResult.encode([hand]);

  console.log(`Please send some tokens to ` + spAddr);

  let txHash = '';
  let firstFetch = true;

  while (true) {
    const done = await new Promise(
      async (resolve, reject) => {
        // check every 3 seconds
        setTimeout(async () => {
          console.log(`Calling: plasma_unspent [${spAddr}]`);

          let res = await provider.send('plasma_unspent', [spAddr]);
          let tx = res[0];

          if (tx) {
            let newTxHash = tx.outpoint.substring(0, 66);

            if (firstFetch) {
              txHash = newTxHash;
              firstFetch = false;
              resolve(false);
              return;
            }

            if (newTxHash !== txHash) {
              console.log(`found new unspent UTXO(${newTxHash})`);
              txHash = newTxHash;
              resolve(true);
              return;
            }
          }
          firstFetch = false;
          resolve(false);
        }, 3000);
      }
    );

    if (done) {
      break;
    }
  }

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

  const output = new Output(txValue, msgSender, 0);
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

function onException (e) {
  console.error(e);
  process.exit(1);
}

process.on('uncaughtException', onException);
process.on('unhandledRejection', onException);
main();
