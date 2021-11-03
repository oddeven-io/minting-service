const cardanoCLI = require("./cardanoCLI")
const assets = require("./assets.json")
const getPolicyId = require('./get-policy-id')

const sender = cardanoCLI.wallet("TestWallet")

console.log("Balance of sender wallet: " + cardanoCLI.toAda(sender.balance().value.lovelace) + " ADA")

const { policyId: POLICY_ID } = getPolicyId()

function sendAssets({ receiver, assets }) {

    const txOut_value_sender = assets.reduce((result, asset) => {

        const ASSET_ID = POLICY_ID + "." + asset
        delete result[ASSET_ID]
        return result
    }, {
        ...sender.balance().value
    })

    const txOut_value_receiver = assets.reduce((result, asset) => {

        const ASSET_ID = POLICY_ID + "." + asset
        result[ASSET_ID] = 1
        return result
    }, {})

    // This is depedent at the network, try to increase this value of ADA
    // if you get an error saying: OutputTooSmallUTxO
    const MIN_ADA = 3

    const txInfo = {
        txIn: cardanoCLI.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                value: {
                    ...txOut_value_sender,
                    lovelace: txOut_value_sender.lovelace - cardanoCLI.toLovelace(MIN_ADA)
                }
            },
            {
                address: receiver,
                value: {
                    lovelace: cardanoCLI.toLovelace(MIN_ADA),
                    ...txOut_value_receiver
                }
            }
        ]
    }

    const raw = cardanoCLI.transactionBuildRaw(txInfo)

    const fee = cardanoCLI.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1
    })

    txInfo.txOut[0].value.lovelace -= fee

    const tx = cardanoCLI.transactionBuildRaw({ ...txInfo, fee })

    const txSigned = cardanoCLI.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey]
    })

    const txHash = cardanoCLI.transactionSubmit(txSigned)

    console.log(txHash)
}

sendAssets({
    receiver: "addr_test1qpw42erzzc279g8vvqdh8rp4mw5ktn2e8mm9yrjsfamnuqgjmjc4mzccr4fvahxccrsk9mhnwr6xxjcrqddm6nsdl9vq6dn02d",
    assets: assets.map(asset => asset.id)
})