const cardanoCLI = require("./cardanoCLI")

const sender = cardanoCLI.wallet("TestWallet") // TODO: Put the wallet name in constants.js

console.log(sender.balance())

