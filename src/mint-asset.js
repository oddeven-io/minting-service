const cardanoCLI = require("./cardanoCLI")

function mintAsset(title, description, ipfs) {
    console.log("start minting nft...")
    const wallet = cardanoCLI.wallet("TestWallet") // 1. Get the wallet
    const mintScript = getMintScript(wallet) // 2. Define mint script
    const POLICY_ID = cardanoCLI.transactionPolicyid(mintScript) // 3. Create POLICY_ID
    const ASSET_NAME = removeWhiteSpaces(title) // 4. Define ASSET_NAME
    const ASSET_ID = POLICY_ID + "." + ASSET_NAME // 5. Create ASSET_ID
    const metadata = getMetaData(POLICY_ID, ASSET_NAME, title, description, ipfs) // 6. Define metadata
    const tx = defineTransaction(wallet, ASSET_ID, metadata, mintScript) // 7. Define transaction
    const raw = buildTransaction(tx) // 8. Build transaction
    const signed = signTransaction(wallet, raw) // 9. Sign transaction
    const txHash = cardanoCLI.transactionSubmit(signed) // 10. Submit transaction

    return [txHash, ASSET_ID]
}

const removeWhiteSpaces = (string) => string.replace(/\s/g, "")

function getMintScript(wallet) {
    return {
        keyHash: cardanoCLI.addressKeyHash(wallet.name),
        type: "sig"
    }
}

function getMetaData(policyId, assetName, title, description, ipfs) {
    // TODO: Check if this metadata format is correct
    return {
        721: {
            [policyId]: { // this
                [assetName]: { // this
                    name: assetName, // this
                    title: title,
                    image: ipfs, // thumbnail
                    description: description,
                    type: "image/png",
                    src: ipfs, // full size image
                    // other properties of your choice
                    authors: ["PK", "CS"]
                }
            }
        }
    }
}

function defineTransaction(wallet, assetID, metadata, mintScript) {
    return {
        txIn: wallet.balance().utxo,
        txOut: [
            {
                address: wallet.paymentAddr,
                value: { ...wallet.balance().value, [assetID]: 1 }
            }
        ],
        mint: [
            { action: "mint", quantity: 1, asset: assetID, script: mintScript }
        ],
        metadata,
        witnessCount: 2,
    }
}

const buildTransaction = (tx) => {

    const raw = cardanoCLI.transactionBuildRaw(tx)
    const fee = cardanoCLI.transactionCalculateMinFee({
        ...tx,
        txBody: raw
    })

    tx.txOut[0].value.lovelace -= fee

    return cardanoCLI.transactionBuildRaw({ ...tx, fee })
}

const signTransaction = (wallet, tx, script) => {

    return cardanoCLI.transactionSign({
        signingKeys: [wallet.payment.skey, wallet.payment.skey],
        txBody: tx
    })
}

module.exports = { mintAsset }
