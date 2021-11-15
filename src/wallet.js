const cardanoCLI = require("./cardanoCLI")

const wallet = cardanoCLI.wallet("TestWallet") // TODO: Put the wallet name in constants.js

function logBalance() {
    console.log(wallet.balance())
}

function getLovelaceAmount() {
    return getTokenValues().lovelace
}

function getTokenValues() {
    return wallet.balance().value
}

function containsAsset(assetName) {
    const tokenValues = getTokenValues()
    const tokenNames = Object.keys(tokenValues)
    return tokenNames.includes(assetName)
}

function walletContainsTx(hash) {
    const utxos = wallet.balance().utxo
    const txHashes = utxos.map(tx => tx['txHash'])

    return txHashes.includes(hash)
}

module.exports = { getLovelaceAmount, getTokenValues, containsAsset, walletContainsTx }

logBalance()