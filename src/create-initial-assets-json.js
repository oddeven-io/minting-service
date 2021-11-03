/**
 * This script is responsible fof generating the initial
 * assets.json that can later be adjusted to fit your specific needs
 * 
 * You can define:
 * 1. amount of assets
 * 2. whether you want to start the collection with eitheer 1 or 0
 * 3. what the mime type is (jpeg, png or gif)
 */

const times = require('lodash/times')
const fs = require("fs").promises

const AMOUNT_OF_ASSETS = 14
const START_WITH_ZERO = true
const MIME_TYPE = "image/png"

async function main() {
 
    const assets = times(AMOUNT_OF_ASSETS).map(i => {
        const number = START_WITH_ZERO ? i : i + 1
        const id = `PKCS${number}`

        const [extension] = MIME_TYPE.split("/").reverse()

        return {
            id,
            name: `PKCS #${number}`,
            // description: ""
            image: `images/${id}_thumbnail.${extension}`,
            src: `images/${id}.${extension}`,
            type: MIME_TYPE,
            // add whatever below
            authors: "PKCS",
        }
    })

    await fs.writeFile(__dirname + '/assets.json', JSON.stringify(assets, null, 2))
}

main()