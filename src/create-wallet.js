const cardanoCLI = require("./cardanoCLI")

const createWallet = (account) => {
    const payment = cardanoCLI.addressKeyGen(account);
    const stake = cardanoCLI.stakeAddressKeyGen(account);
    cardanoCLI.stakeAddressBuild(account);
    cardanoCLI.addressBuild(account, {
        paymentVkey: payment.vkey,
        stakeVkey: stake.vkey
    });
    return cardanoCLI.wallet(account);
};

createWallet("TestWallet")
