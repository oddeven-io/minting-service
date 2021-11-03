const cardanoCLI = require("./cardanoCLI")
const mintScript = require("./mint-policy.json")

module.exports = () => {

    const policyId = cardanoCLI.transactionPolicyid(mintScript)

    return {
        policyId,
        mintScript
    }
}