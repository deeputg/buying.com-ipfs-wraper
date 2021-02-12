const express = require('express')
const router = express.Router()
const base58 = require('bs58')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient(process.env.IPFS_HOST + ':' + process.env.IPFS_PORT)

/**
 * @params : nil
 * @body : indexFileHash : string => hash of the indexing file
 *       : orderData : stringified json of the order data
 * @return : status : boolean
 *         : hash : stting =>hash of the indexer file
 * functionality : writes the orderData data from the body to the ipfs and 
 * index that hash with date as key in indexer file and 
 * return the hash of the indexer file.
 */
router.post("/store-order-details", async (req, res) => {
    const data = req.body
    let indexFileHash = data.indexFileHash;
    let indexFilePin;
    let orderFileHash;
    let orderFilePin;
    try {
        for await (const result of ipfs.add({
            path: data.fileName,
            content: Buffer.from(data.orderData)
        }, { cidVersion: 0 })) {
            orderFileHash = base58.encode(result.cid.multihash)
            orderFilePin = await ipfs.pin.add(hash)
        }
    } catch (err) {
        console.log(err)
    }
    let indexFileData;
    if (indexFileHash == "")
        indexFileData = "";
    else
        indexFileData = await fetchFile(indexFileHash);

    const today = new Date();
    const index = getIndexFromDate(today)
    if (indexFileData == "") {
        indexFileData = {}
    } else {
        indexFileData = JSON.parse(indexFileData)
    }
    indexFileData[index] = orderFileHash
    indexFileData = JSON.stringify(indexFileData)
    try {
        for await (const result of ipfs.add({
            path: "indexFile",
            content: Buffer.from(indexFileData)
        }, { cidVersion: 0 })) {
            indexFileHash = base58.encode(result.cid.multihash)
            indexFilePin = await ipfs.pin.add(indexFileHash)
            res.send({ status: true, hash: indexFileHash })
        }
    } catch (err) {
        console.log(err)
    }
})

/**
 * fucntion : /fetch-data-ipfs
 * @params : hash : string
 * @return : status : boolean
 */
router.get("/fetch-data-ipfs/:hash", async (req, res) => {
    const hash = req.params.hash
    res.send({ status: true, data: await fetchFile });
})

/**
 * @params : hash : string
 * @params : date : string date object
 * @return : status : boolean
 * 
 */
router.get("/fetch-order-by-date/:hash/:date", async (req, res) => {
    const hash = req.params.hash
    // const index = req.params.date
    const date = new Date(req.params.date)
    const index = getIndexFromDate(date)


    let indexFileData = await fetchFile(hash);
    if (indexFileData == "") {
        res.send({ status: false, message: "indexer file is empty" })
    }

    indexFileData = JSON.parse(indexFileData)
    console.log(indexFileData)
    console.log(index)
    const orderDetails = await fetchFile(indexFileData[index])
    res.send({ status: true, data: orderDetails })
})

const fetchFile = async (hash) => {
    try {
        const chunks = []
        for await (const chunk of ipfs.cat(hash)) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks).toString();
    } catch (err) {
        console.log(err)
        return null
    }
}

const getIndexFromDate = (date) => {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
}

module.exports = router