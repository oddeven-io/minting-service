
const db = require('./firestore');
const cardanoCLI = require('./src/cardanoCLI');
const { mintAsset } = require('./src/mint-asset');
const { sendAssetBackToWallet } = require('./src/send-asset-back-to-wallet');

const paymentReceivedQuery = db.collection('transactions').where('minting_state', '==', 'payment_received');
const wallet = cardanoCLI.wallet("TestWallet")
const oneMinInMilliSec = 60000

const paymentReceivedObserver = paymentReceivedQuery.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        let doc = change.doc

        if (change.type === 'added') {
            console.log('New transaction: ', doc.data());
            onNewTransaction(doc);
        }
    });
}, err => {
    console.log(`Encountered error: ${err}`)
});

async function onNewTransaction(doc) {
    // 1. ensure wallet has enough funds for minting
    const lovelaceAmount = doc.data()['amount_lovelace']
    if (!walletHasFundsForTransaction(lovelaceAmount)) { 
        console.log('Could not execute transaction due to insufficient funds')
        return
    }

    // 2. mint asset
    doc.ref.update({ minting_state: "minting"});
    const title = doc.data()['title']
    const description = doc.data()['description']
    const ipfsHash = doc.data()['ipfs_hash']

    const [txHash, assetId] = mintAsset(title, description, ipfsHash)
    console.log("minted asset with transaction hash: " + txHash)

    // 3. wait for the local node to receive the mint transaction on the blockchain
    const dateInTenMin = dateInMinutes(10)
    const assetIsInWallet = await checkWalletForTransaction(txHash, assetId, dateInTenMin)
    console.log(`assetIsInWallet: ${assetIsInWallet}`)
    if (!assetIsInWallet) {
        console.log('asset is not in wallet. something went wrong')
        // maybe send the ada back to sender
        return
    }
    doc.ref.update({ minting_state: "minted"})

    // 4. send asset back to sender
    const receiver = doc.data()['sender_wallet_address']
    const txHash = sendAssetBackToWallet(receiver, assetId)
    console.log("TxHash: " + txHash)

    // ToDo: check block chain the transaction before setting the state
    doc.ref.update({ minting_state: "sent_back", tx_hash: txHash })
}

const walletHasFundsForTransaction = (amount) => {
    const lovelaceInWallet = wallet.balance().value.lovelace
    console.log(lovelaceInWallet)
    return lovelaceInWallet >= amount  
} 

async function checkWalletForTransaction(txHash, assetId, timeOutDate) {
    console.log('check wallet for transaction')
    if (timeOutDate.getTime() <= (new Date()).getTime()) {
        console.log('time out')
        return false
    }

    if (walletContainsTx(txHash)) {
        console.log("wallet has received mint transaction")
        return true
    } else {
        await delay(3000);
        return checkWalletForTransaction(txHash, assetId, timeOutDate)
    }
}

function walletContainsTx(hash) {
    const utxos = wallet.balance().utxo
    const txHashes = utxos.map(tx => tx['txHash'])

    return txHashes.includes(hash)
}

function dateInMinutes(minutes) {
    const now = new Date()
    const dateInMinutes = new Date(now.getTime() + minutes * oneMinInMilliSec)
    return dateInMinutes
}

delay = ms => new Promise(res => setTimeout(res, ms));

async function onNewTransaction2(doc) {
    await ensureMintingServiceIsReady()
    updateTransactionToMinting(doc);
    await mintNFT(doc);
    updateTransactionToMinted(doc)
}

async function ensureMintingServiceIsReady() {
    console.log("waiting for minting service");
    const _ = await resolveAfter5Seconds();
    console.log("minting service is ready");
}

function updateTransactionToMinting(doc) {
    let senderWalletAddres = "test_addr1asgasdfasdfjasdgh";
    doc.ref.update({ minting_state: "minting", sender_wallet_address: senderWalletAddres });
    console.log(`set minting_state to minting for id: ${doc.id}`);
}

function updateTransactionToMinted(doc) {
    doc.ref.update({ minting_state: "minted"});
    console.log(`set minting_state to minted for id: ${doc.id}`);
}

async function mintNFT(doc) {
    const res = await doc.ref.get();
    const senderWalletAddress = res.data()['sender_wallet_address'];
    console.log(`start minting NFT for wallet address: ${senderWalletAddress}`);
    const _ = await resolveAfter5Seconds();
    console.log('minting NFT completed');
}

function resolveAfter5Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 5000);
    });
}