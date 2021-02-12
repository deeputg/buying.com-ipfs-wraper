const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient(process.env.IPFS_HOST + ':' + process.env.IPFS_PORT)
// const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')

// const ipfs = ipfsClient({
//     host: 'localhost',
//     port: 5001,
//     protocol: 'http',
//     headers: {
//       authorization: 'Bearer ' + TOKEN
//     }
//   })

const apiRouter = require('./routes/api.private')



const app = express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/api", apiRouter)

app.get("/", async (req, res) => {
    const version = await ipfs.version()
    console.log(version)
    res.send(version)
})



let port = process.env.PORT | 3000

app.listen(port, () => {
    console.log("Listening to port ", port)
})