const CardanocliJs = require("cardanocli-js")
const os = require("os");
const path = require("path");


const testNetwork = "testnet-magic 1097911063"
const mainNetwork = "mainnet"

const dir = path.join(os.homedir(), "cardano-node-testnet");

const testShelleyPath = path.join(
  os.homedir(),
  "cardano-node-testnet",
  "testnet-shelley-genesis.json"
);

const cardanoCLI = new CardanocliJs({
    network: testNetwork,
    dir: dir,
    shelleyGenesisPath: testShelleyPath,
    socketPath: path.join(os.homedir(), "cardano-node-testnet", "db", "node.socket")
});

module.exports = cardanoCLI