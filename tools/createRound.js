#!/usr/bin/env node

const ethUtil = require("ethereumjs-util");
const ethers = require("ethers");
const { Tx, Outpoint, Input, Output } = require("leap-core");

const provider = new ethers.providers.JsonRpcProvider(
  process.env["RPC_URL"] || "https://testnet-node1.leapdao.org"
);

const RECEIVER_PLACEHOLDER = "1111111111111111111111111111111111111111";
const TOKEN_PLACEHOLDER = "2222222222222222222222222222222222222222";

async function main() {
  let tokenAddr;
  let msgSender;
  let abi;
  let codeBuf;
  let codeHash;
  let spAddr;
  let msgData;
  let spendingCondition;

  try {
    spendingCondition = require("./../build/contracts/RoundLock.json");
  } catch (e) {
    console.error("Please run `npm run compile:contracts` first. 😉");
    return;
  }

  prepareContract();

  let txHash = "";
  let firstFetch = true;

  while (true) {
    const done = await new Promise(async (resolve, reject) => {
      // check every 3 seconds
      setTimeout(async () => {
        console.log(`Calling: plasma_unspent [${spAddr}]`);

        let res = await provider.send("plasma_unspent", [spAddr]);
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
    });

    if (done) {
      break;
    }
  }

  // create the spending condition
  const message = prepareMessage(hand, abi);
  await makeNewSpending({ txHash, codeBuf, message, msgSender: SENDER });
}

function prepareMessage(str, abi) {
  return abi.functions.roundResult.encode([str]);
}
async function makeNewSpending(props) {
  const { txHash, codeBuf, message, msgSender } = props;
  console.log(props);
  let tx = await provider.send("eth_getTransactionByHash", [txHash]);
  let txIndex = tx.transactionIndex;
  let txValue = tx.value;

  const input = new Input({
    prevout: new Outpoint(txHash, txIndex),
    gasPrice: 0,
    script: codeBuf
  });
  input.setMsgData(message);

  const output = new Output(txValue, msgSender, 0);
  const condTx = Tx.spendCond([input], [output]);

  console.log("input", JSON.stringify(input));
  console.log("output", JSON.stringify(output));

  const txRaw = condTx.hex();
  const res = await provider.send("eth_sendRawTransaction", [txRaw]);
  console.log("transaction hash:", res);
}

function prepareContract(process) {
  const SENDER = 0xd8536f0df61cd496b78e336b7fe5e8bdff45cd2f;
  const hand = process.argv[2];
  //tokenAddr = process.argv[2];
  //msgSender = process.argv[3];
  console.log(hand);
  abi = new ethers.utils.Interface(spendingCondition.abi);
  codeBuf = spendingCondition.deployedBytecode;
  /*
    .replace(RECEIVER_PLACEHOLDER, msgSender.replace('0x', '').toLowerCase())
    .replace(TOKEN_PLACEHOLDER, tokenAddr.replace('0x', '').toLowerCase());
    */

  codeHash = ethUtil.ripemd160(codeBuf);
  spAddr = "0x" + codeHash.toString("hex");

  console.log(`Please send some tokens to ` + spAddr);
}

function onException(e) {
  console.error(e);
  process.exit(1);
}

process.on("uncaughtException", onException);
process.on("unhandledRejection", onException);
main();
