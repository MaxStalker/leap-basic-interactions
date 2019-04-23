const ethers = require("ethers");

async function main() {
  console.log('hello!');
  const hand = 'A1A1A2D2M2'
  const encoded = ethers.utils.formatBytes32String(hand);
  const decoded = ethers.utils.parseBytes32String(encoded);
  console.log(encoded);
  console.log(decoded)
}

function onException(e) {
  console.error(e);
  process.exit(1);
}


process.on("uncaughtException", onException);
process.on("unhandledRejection", onException);
main();
