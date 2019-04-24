#!/usr/bin/env node

const ethUtil = require('ethereumjs-util');
const ethers = require('ethers');
const { Tx, Outpoint, Input, Output } = require('leap-core');
const walletConfig = require('./config');

const provider = new ethers.providers.JsonRpcProvider(process.env['RPC_URL'] || 'https://testnet-node1.leapdao.org');

async function main() {
  let codeBuf;
  let codeHash;
  let spendingCondition;

  try {
    spendingCondition = require('./../build/contracts/HashLock.json');
  } catch (e) {
    console.error('Please run `npm run compile:contracts` first');
    return;
  }

  //tokenAddr = "0xD2D0F8a6ADfF16C2098101087f9548465EC96C98";

  //msgSender = "0xD8536F0dF61CD496B78e336b7Fe5e8bDFF45CD2f";
  const abi = new ethers.utils.Interface(spendingCondition.abi);
  codeBuf = spendingCondition.deployedBytecode;
    //.replace(RECEIVER_PLACEHOLDER, msgSender.replace('0x', '').toLowerCase())
    //.replace(TOKEN_PLACEHOLDER, tokenAddr.replace('0x', '').toLowerCase());

  codeHash = ethUtil.ripemd160(codeBuf);
  const fundHash = '0x' + codeHash.toString('hex');
  //const answer = ethers.utils.formatBytes32String('A1A1A1D1D1');
  //const resolverName = "roundResult";
  //msgData = abi.functions[resolverName].encode([answer]);



  /*
  *
  *  Fund spending condition
  *
  * */

  const tokenAddr = "0xD2D0F8a6ADfF16C2098101087f9548465EC96C98";
  const wallet = new ethers.Wallet(walletConfig.PRIVATE_KEY, provider);
  const from = wallet.address.toLowerCase();
  const to = fundHash.toLowerCase();
  const amount = ethers.utils.parseEther("0.0017")._hex;
  const color = parseInt(
    await provider.send("plasma_getColor", [tokenAddr], 16)
  );
  const utxos = (await provider.send("plasma_unspent", [from, color])).map(
    utxo => ({
      output: Output.fromJSON(utxo.output),
      outpoint: Outpoint.fromRaw(utxo.outpoint)
    })
  );

  const tx = Tx.transferFromUtxos(utxos, from, to, amount, color).signAll(
    wallet.privateKey
  );

  let txHash;
  try {
    txHash = await wallet.provider.send("eth_sendRawTransaction", [
      tx.hex()
    ]);
  } catch (e) {
    console.log(e.message);
  }

  console.log('Code Buffer');
  console.log(codeBuf);
  console.log(typeof codeBuf);

  console.log('Transaction hash');
  console.log(txHash);
  console.log(typeof txHash);

}

function onException (e) {
  console.error(e);
  process.exit(1);
}

process.on('uncaughtException', onException);
process.on('unhandledRejection', onException);
main();
