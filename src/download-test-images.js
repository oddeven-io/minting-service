/**
 * This script expects the assets.json to exist
 * inside the src directory 
 */

const random = require('lodash/random')
const axios = require('axios')
const fs = require('fs').promises

const assets = require("./assets.json")

async function main() {

    await Promise.all(
        assets.map(async asset => {

            const { data } = await axios.get(`https://source.unsplash.com/640x400?cat&v=${random()}`, { responseType: 'arraybuffer' })
            console.log(`[${asset.name}] downloaded random cat image`)
            
            await fs.writeFile(__dirname + '/' + asset.src, data)
            console.log(`[${asset.name}] image saved to "${asset.src}"`)
        })
    )
}

main()