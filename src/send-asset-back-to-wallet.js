const cardanoCLI = require("./cardanoCLI")

// 1. get the sender's wallet
const sender = cardanoCLI.wallet("TestWallet")

console.log("Balance of sender wallet: " + cardanoCLI.toAda(sender.balance().value.lovelace) + " ADA")

// 2. define the transaction
const receiverAddr = "addr_test1qzjlc05tyyw264wy7m4u7np5yqdwglks0xhu6765cl4qex9r9kvav4hmznru9px9n7cpa2hmmv4593eegve3t834xppqwskp4t" // the address of the receiver

// depending on amount of metadata, generally not lower than 1.5 ada, min to be sent along with native asset
// in future we can also pay with native assets (babel fees)
const minLovelaceAmount = cardanoCLI.toLovelace(1.5)

const txInfo = {
    txIn: cardanoCLI.queryUtxo(sender.paymentAddr),
    txOut: [
        {
            address: sender.paymentAddr,
            value: {
                lovelace: sender.balance().value.lovelace - minLovelaceAmount,
            },
        },
        {
            address: receiverAddr,
            value: {
                lovelace: minLovelaceAmount,
                "f21547d7823d01758bd2b50d556fce54edbfe003442ca214c2a0ee5c.MyNFT": 1 // TODO: add asset id from minting
            }
        }
    ]
}

// 3. build the transaction
let raw = cardanoCLI.transactionBuildRaw(txInfo);

// 4. calculate the fee
let fee = cardanoCLI.transactionCalculateMinFee({
    ...txInfo,
    txBody: raw,
    witnessCount: 1,
});

// 5. pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].value.lovelace -= fee;


// 6. build the final transaction
let tx = cardanoCLI.transactionBuildRaw({ ...txInfo, fee })

// 7. sign the transaction
let txSigned = cardanoCLI.transactionSign({
    txBody: tx,
    signingKeys: [sender.payment.skey],
});
  

// 8. submit the transaction
let txHash = cardanoCLI.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);

