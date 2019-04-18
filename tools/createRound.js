const ethUtil = require("ethereumjs-util");
const ethers = require("ethers");


const ROUND_BET_SIZE = "ROUND_BET_SIZE";
const ROUND_PLAYER_HAND = "ROUND_PLAYER_HAND";
const ROUND_ENEMY_HAND = "ROUND_ENEMY_HAND";

const provider = new ethers.providers.JsonRpcProvider(
  process.env["RPC_URL"] || "https://testnet-node1.leapdao.org"
);
async function main() {
  let roundLock;
  try {
    roundLock = require("./../build/contracts/RoundLock.json");
  } catch (e) {
    console.error("Please run `npm run compile:contracts` first. 😉");
    return;
  }

  //let abi = new ethers.utils.Interface(roundLock.abi);
  // create new round HERE
  let codebuf = roundLock.deployedBytecode;
  let codehash = ethUtil.ripemd160(codebuf);
  let spAddr = "0x" + codehash.toString("hex");

  console.log('Send tokens to ' + spAddr);

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

}

function onException(e) {
  console.error(e);
  process.exit(1);
}

process.on("uncaughtException", onException);
process.on("unhandledRejection", onException);
main();
