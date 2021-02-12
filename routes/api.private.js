const express = require('express')
const router = express.Router()


const { postOrderToIPFS, fetchFile } = require('../services/ipfs.service')
const {
    fetchStatusGenericAPI,
    transferAsset,
    postDataToGenericAPI,
    fetchBalanceFromGenericAPI,
    fetchIndexFileHashFromGeneralAPI
} = require('../services/genericApi.services')
const { getIndexFromDate } = require('../services/utility.service')


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

    // fetch current indexFile hash
    const indexFileHash = await fetchIndexFileHashFromGeneralAPI();
    // console.log(indexFileHash)
    // return
    // const indexFileHash = ""
    const indexHash = await postOrderToIPFS(indexFileHash, data.orderData);
    const result = await postDataToGenericAPI(indexHash);
    res.send({ status: true, data: result })
})

router.get("/fetch-data-ipfs/:hash", async (req, res) => {
    const hash = req.params.hash
    res.send({ status: true, data: await fetchFile });
})

router.get("/status", async (req, res) => {
    try {
        const result = await fetchStatusGenericAPI()
        res.send({ status: true, data: result });
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

router.get("/get-asset-balance/:address", async (req, res) => {
    const address = req.params.address
    try {
        const result = await fetchBalanceFromGenericAPI(address)
        res.send({ status: true, data: result });
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

router.get("/fetch-order-by-date/:date", async (req, res) => {
    const hash = await fetchIndexFileHashFromGeneralAPI();
    // const hash = req.params.hash
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

router.post("/transfer-asset", async (req, res) => {
    const data = req.body
    const result = await transferAsset(data.recipient_addr, data.buy_token_amount);
    res.send({ status: true, data: result })
})




module.exports = router