const fs = require("fs")
const cardanoCLI = require("./cardanoCLI")

const wallet = cardanoCLI.wallet("TestWallet")

const {slot} = cardanoCLI.queryTip()

const SLOTS_PER_EPOCH = 5 * 24 * 60 * 60 // 432000

const mintScript = {
    type: "all",
    scripts: [
        {
            slot: slot + (SLOTS_PER_EPOCH * 5), // we have 5 epochs (25 days) to mint the collection
            type: "before",
        },
        {
            keyHash: cardanoCLI.addressKeyHash(wallet.name),
            type: "sig"
        }
    ]

}

fs.writeFileSync(__dirname + "/mint-policy.json", JSON.stringify(mintScript, null, 2))
fs.writeFileSync(__dirname + "/mint-policy-id.txt", cardanoCLI.transactionPolicyid(mintScript))