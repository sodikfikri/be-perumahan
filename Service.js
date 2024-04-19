const path = require('path')
require("dotenv").config({ path: path.join(__dirname, ".env") })
const express = require('express')
// const multer = require('multer')
const bodyParser = require('body-parser')
const app = express()

const fileUpload = require('express-fileupload')
app.use(fileUpload())

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: "50mb",
    })
)

app.use(
    bodyParser.json({
        inflate: true,
        limit: "50mb",
        // type: () => true,
    })
)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
    res.header("Access-Control-Expose-Headers", "Content-Length")
    res.header("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type, Content-Length, X-Requested-With, Range, x-api-key, x-forwarded-for")
    if (req.method === "OPTIONS") {
        return res.json(200)
    } else {
        return next()
    }
})

const routes = require('./routes')

routes.routesConfig(app)

app.use('/' + process.env.API_URL + '/files/ktp/', express.static(__dirname + '/files/ktp'))
// app.use('/' + process.env.API_URL + '/rekon_ar', express.static(__dirname + '/files/documents/rekon_ar'))

const server = require("http").createServer(app)

server.listen(process.env.PORT, () => {
    // const host = app.address().address
    // const port = app.address().port
    console.log("Service Running on Port: " + process.env.PORT)
})
