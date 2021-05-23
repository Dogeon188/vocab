const fs = require("fs")
const express = require("express")
const chalk = require("chalk")

const utils = require("./utils")
routers = {
    index(req, res) {
        const content = fs.readFileSync("./contents/index.html").toString()
        const cfg = JSON.parse(content.split("\n", 1)[0].slice(4, -4))
        cfg.body = content
        res.render('layout', cfg)
    },
    vocabData(req, res, next) {
        const path = `./data/${req.params.src}.json`
        fs.access(path, fs.F_OK, async err => {
            if (err) return next()
            const sheetInfo = JSON.parse(fs.readFileSync(path))
            utils.getSheetSource(sheetInfo.sheetId, sheetInfo.sheets[0].gid)
                .then(r => res.send(r)).catch(err => next())
        })
    },
    notFoundPage(req, res) {
        const content = fs.readFileSync("./source/404.html").toString()
        const cfg = JSON.parse(content.split("\n", 1)[0].slice(4, -4))
        cfg.body = content
        res.status(404).render('layout', cfg)
    }
}
module.exports = {
    route(app) {
        app.use((req, res, next) => {
            utils.log("info", `HTTP v${req.httpVersion} ${req.method} ${chalk.magenta(req.url)}`)
            next()
        })
        app.use(express.static("./public/"))
        app.get("/", routers.index)
        app.get('/data/words/:src', routers.vocabData)
        app.use(routers.notFoundPage)
    }
}