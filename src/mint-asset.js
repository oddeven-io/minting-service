// const cardano = require("./cardano")

// console.log("start minting nft...")

// // 1. Get the wallet
// const wallet = cardano.wallet("TestWallet")

// // 2. Define mint script
// // ToDo: implement time locking
// const mintScript = {
//     keyHash: cardano.addressKeyHash(wallet.name),
//     type: "sig"
// }

// console.log("mint script: \n" + mintScript)

// // 3. Create POLICY_ID
// const POLICY_ID = cardano.transactionPolicyid(mintScript)

// console.log("policy id: \n" + POLICY_ID)

// // 4. Define ASSET_NAME
// const ASSET_NAME = "nftName"

// console.log("asset name: \n" + ASSET_NAME)

// // 5. Create ASSET_ID
// const ASSET_ID = POLICY_ID + "." + ASSET_NAME

// console.log("asset id: \n" + ASSET_ID)

// // 6. Define Metadata
// const metadata = {
//     721: {
//         [POLICY_ID]: {
//             [ASSET_NAME]: {
//                 name: ASSET_NAME,
//                 image: "ipfs://QmShqccBVuntaxDvGA8KGdFdG7jWDCSGYw5NtBvBoXMHbV", // thumbnail image (lower than 1 MB), can be there even if type is something else like a video
//                 description: "Super Fancy Berry Space Green NFT",
//                 type: "image/png",
//                 src: "ipfs://QmShqccBVuntaxDvGA8KGdFdG7jWDCSGYw5NtBvBoXMHbV", // original image
//                 // other properties of your choice
//                 author: "Philip + Christian"
//             }
//         }
//     }
// }

// console.log("metadata: \n" + metadata)

// // 7. Define Transaction
// const tx = {
//     txIn: wallet.balance().utxo,
//     txOut: [
//         {
//             address: wallet.paymentAddr,
//             value: { ...wallet.balance().value, [ASSET_ID]: 1 }
//         }
//     ],
//     mint: {
//         actions: [{ type: "mint", quantity: 1, asset: ASSET_ID }],
//         script: [mintScript]
//     },
//     metadata,
//     witnessCount: 2
// }

// console.log("transaction: \n" + tx)

// // 8. Build Transaction
// const buildTransaction = (tx) => {

//     const raw = cardano.transactionBuildRaw(tx)
//     const fee = cardano.transactionCalculateMinFee({
//         ...tx,
//         txBody: raw
//     })

//     tx.txOut[0].value.lovelace -= fee

//     return cardano.transactionBuildRaw({ ...tx, fee })
// }

// const raw = buildTransaction(tx)

// console.log("raw transaction: \n" + raw)

// // 9. Sign transaction
// const signTransaction = (wallet, tx) => {

//     return cardano.transactionSign({
//         signingKeys: [wallet.paymentAddr.skey, wallet.paymentAddr.skey], // pass the signing/private key twice since we have a witness count of 2
//         txBody: tx
//     })
// }

// const signed = signTransaction(wallet, raw)

// console.log("signed transaction: \n" + signed)

// // 10. Submit transaction
// const txHash = cardano.transactionSubmit(signed)

// console.log("transaction hash:" + txHash)

const cardanoCLI = require("./cardanoCLI")

// 1. Get the wallet

const wallet = cardanoCLI.wallet("TestWallet")

// 2. Define mint script

const mintScript = {
    keyHash: cardanoCLI.addressKeyHash(wallet.name),
    type: "sig"
}

// 3. Create POLICY_ID

const POLICY_ID = cardanoCLI.transactionPolicyid(mintScript)

// 4. Define ASSET_NAME

const ASSET_NAME = "MyNFT"

// 5. Create ASSET_ID

const ASSET_ID = POLICY_ID + "." + ASSET_NAME

// 6. Define metadata

const metadata = {
    721: {
        [POLICY_ID]: {
            [ASSET_NAME]: {
                name: ASSET_NAME,
                image: "ipfs://QmShqccBVuntaxDvGA8KGdFdG7jWDCSGYw5NtBvBoXMHbV",
                description: "Super Fancy Berry Space Green NFT",
                type: "image/png",
                src: "ipfs://QmShqccBVuntaxDvGA8KGdFdG7jWDCSGYw5NtBvBoXMHbV",
                // other properties of your choice
                authors: ["PK", "CS"]
            }
        }
    }
}

// 7. Define transaction

const tx = {
    txIn: wallet.balance().utxo,
    txOut: [
        {
            address: wallet.paymentAddr,
            value: { ...wallet.balance().value, [ASSET_ID]: 1 }
        }
    ],
    mint: [
        { action: "mint", quantity: 1, asset: ASSET_ID, script: mintScript }
    ],
    metadata,
    witnessCount: 2,
}

// 8. Build transaction

const buildTransaction = (tx) => {

    const raw = cardanoCLI.transactionBuildRaw(tx)
    const fee = cardanoCLI.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })

    tx.txOut[0].value.lovelace -= fee

    return cardanoCLI.transactionBuildRaw({ ...tx, fee })
}

const raw = buildTransaction(tx)

// 9. Sign transaction

const signTransaction = (wallet, tx, script) => {

    return cardanoCLI.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        txBody: tx
    })
}

const signed = signTransaction(wallet, raw)

// 10. Submit transaction

const txHash = cardanoCLI.transactionSubmit(signed)

console.log(txHash)