const axios = require('axios').default;
const genereicApi = process.env.GENERIC_API
const appId = parseInt(process.env.APP_ID)
const contractAddress = process.env.CONTRACT_ADDRESS;

exports.postDataToGenericAPI = (hash) => {

  const postData = {
    contract_id: appId,
    function_name: "storeData",
    function_args: ["indexFileHash", hash]
  }
  axios.post(genereicApi + "algo-contract", postData).then(returnData => {
    return returnData.data;
  }).catch(error => {
    console.log(error)
    throw error;
  })
}

exports.fetchBalanceFromGenericAPI = (requester_addr) => {
  const body = {
    requester_addr
  }
  console.log(genereicApi + "algo-balance")

  return axios.post(genereicApi + "algo-balance", body).then(returnData => {
    return returnData.data;
  }).catch(error => {
    throw error;
  })
}

exports.transferAsset = (recipient_addr, buy_token_amount) => {
  const body = {
    recipient_addr: recipient_addr,
    buy_token: buy_token_amount
  }
  console.log(body)
  return axios.post(genereicApi + "asset-transfer", body).then(returnData => {
    return returnData.data;
  }).catch(error => {
    console.log(error)
    throw error;
  })
}

exports.fetchStatusGenericAPI = () => {
  return axios.get(genereicApi + "status").then(returnData => {
    return returnData.data;
  }).catch(error => {
    throw error;
  })
}


exports.fetchIndexFileHashFromGeneralAPI = () => {
  const body = {
    "contract_id": appId,
    "contract_addr": contractAddress
  }
  return axios.post(genereicApi + "algo-contract-state", body).then(returnData => {
    let indexFileHash = "";
    const indexFileKey_base64 = new Buffer.from("indexFileHash").toString('base64');
    console.log(indexFileKey_base64)
    const contractState = returnData.data.contractState
    for (let i = 0; i < contractState.length; i++) {
      // console.log(contractState[i].key)
      if (contractState[i].key == indexFileKey_base64) {
        indexFileHash = new Buffer.from(contractState[i].value.bytes, 'base64').toString('ascii');
      }
    }
    return indexFileHash;
  }).catch(error => {
    throw error;
  })
}
