const express = require("express")
const utils = require("./utils")

const app = express()
const port = 3000
const hostname = "localhost"

app.set('views', './views')
app.set('view engine', 'ejs')

require("./route").route(app)

app.listen(port, hostname, () => {
    utils.log("info", `App listening at http://${hostname}:${port}`)
})

process.on("uncaughtException", err => {
    utils.log("error", err)
})