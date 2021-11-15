const cardanoCLI = require("./cardanoCLI")

// 1. get wallet
const wallet = cardanoCLI.wallet("TestWallet");

function sendAssetBackToWallet(receiverAddress, assetName) {
    logWalletBalance()
    const txInfo = getTransactionInfo(receiverAddress, assetName)
    console.log(`txInfo: \n${JSON.stringify(txInfo)}`)

    const raw = cardanoCLI.transactionBuildRaw(txInfo)
    const fee = calculateFee(txInfo, raw)
    txInfo.txOut[0].value.lovelace -= fee; // pay the fee by subtracting it from the sender utxo
    const tx = cardanoCLI.transactionBuildRaw({ ...txInfo, fee }); // create final transaction
    const txSigned = signTransaction(tx)
    const txHash = cardanoCLI.transactionSubmit(txSigned);
    return txHash
}

function logWalletBalance() {
    console.log(
        "Balance of Sender wallet: " +
          cardanoCLI.toAda(wallet.balance().value.lovelace) +
          " ADA"
      );
}

function getTransactionInfo(receiverAddress, assetName) {
    const [txOutValueOne, txInValueTwo] = getTxOutValues(assetName)
    console.log(txOutValueOne)
    console.log(txInValueTwo)

    return {
        txIn: cardanoCLI.queryUtxo(wallet.paymentAddr),
        txOut: [
          {
            address: wallet.paymentAddr,
            value: txOutValueOne,
          },
          {
            address: receiverAddress,
            value: txInValueTwo,
          },
        ],
    };
}

function getTxOutValues(assetName) {
  const txOutValues = wallet.balance().value
  console.log(txOutValues)
  if (!txOutValues[assetName]) {
    console.log("Asset name does not exist in wallet")
  }

  delete txOutValues[assetName]
  txOutValues.lovelace -= cardanoCLI.toLovelace(1.5)

  const txInValues = {
      lovelace: cardanoCLI.toLovelace(1.5),
      [assetName]: 1
  }

  return [txOutValues, txInValues]
}

function calculateFee(txInfo, raw) {
    return cardanoCLI.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1,
      });
}

function signTransaction(tx) {
    return cardanoCLI.transactionSign({
        txBody: tx,
        signingKeys: [wallet.payment.skey],
    });
}

module.exports = { sendAssetBackToWallet }