const ethers = require("ethers");
const Leap = require("leap-core");
const walletConfig = require("./config");
const provider = new ethers.providers.JsonRpcProvider(
  process.env["RPC_URL"] || "https://testnet-node1.leapdao.org"
);

async function main() {
  const tokenAddr = "0xD2D0F8a6ADfF16C2098101087f9548465EC96C98";
  const wallet = new ethers.Wallet(walletConfig.PRIVATE_KEY, provider);
  const from = wallet.address.toLowerCase();
  const to = "0xBbebEa9812971a5C2B7d99a99E7d8b4d5Fda7091".toLowerCase();
  const amount = ethers.utils.parseEther("0.00213")._hex;
  const color = parseInt(
    await provider.send("plasma_getColor", [tokenAddr], 16)
  );
  const utxos = (await provider.send("plasma_unspent", [from, color])).map(
    utxo => ({
      output: Leap.Output.fromJSON(utxo.output),
      outpoint: Leap.Outpoint.fromRaw(utxo.outpoint)
    })
  );

  const tx = Leap.Tx.transferFromUtxos(utxos, from, to, amount, color).signAll(
    wallet.privateKey
  );

  try {
    const res = await wallet.provider.send("eth_sendRawTransaction", [
      tx.hex()
    ]);
    console.log(res);
  } catch (e) {
    console.log(e.message);
  }
}

main();
