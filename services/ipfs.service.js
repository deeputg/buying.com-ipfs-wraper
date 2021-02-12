const base58 = require('bs58')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient(process.env.IPFS_HOST + ':' + process.env.IPFS_PORT)
const { getIndexFromDate } = require('../services/utility.service')

exports.postOrderToIPFS = async (indexFileHash, orderData) => {
  let orderFileHash;
  try {
    for await (const result of ipfs.add({
      path: "index",
      content: Buffer.from(orderData)
    }, { cidVersion: 0 })) {
      orderFileHash = base58.encode(result.cid.multihash)
      // pinning the file to currecnt ipfs node
      await ipfs.pin.add(orderFileHash)
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  let indexFileData;
  if (indexFileHash == "")
    indexFileData = "{}";
  else
    indexFileData = await this.fetchFile(indexFileHash);
  // console.log(indexFileData)
  const today = new Date();
  const index = getIndexFromDate(today)

  indexFileData = JSON.parse(indexFileData)

  // mapping the order file hash with the current date in yyyy-(mm-1)-(dd-1) format
  indexFileData[index] = orderFileHash
  indexFileData = JSON.stringify(indexFileData)
  try {
    for await (const result of ipfs.add({
      path: "indexFile",
      content: Buffer.from(indexFileData)
    }, { cidVersion: 0 })) {
      indexFileHash = base58.encode(result.cid.multihash)
      // pinning files to current ipfs node
      await ipfs.pin.add(indexFileHash)
      return indexFileHash
    }
  } catch (err) {
    console.log(err)
    throw err;
  }
}



exports.fetchFile = async (hash) => {
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

