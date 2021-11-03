const cardanoCLI = require("./cardanoCLI")

const sender = cardanoCLI.wallet("TestWallet2") // TODO: Put the wallet name in constants.js

console.log(sender.balance())

