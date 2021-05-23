const bent = require("bent")
const parser = require("csv-parse")
const chalk = require("chalk")

module.exports = {
    log(type, msg) {
        const types = {
            "info": chalk.green.bold("I"),
            "error": chalk.red.bold("E")
        }
        if (!(type in types)) throw new Error("Invalid log type!")
        console.log(types[type], chalk.gray(`[${new Date().toISOString()}]`), msg)
    },
    async getSheetSource(sheetId, gid) {
        const redirected = (await bent("https://docs.google.com", "HEAD", 307)
            (`/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&output=csv`)).headers.location
        const p = parser({columns: true})
        p.write(await bent("string")(redirected))
        p.end()
        let i
        let arr = []
        while (i = p.read()) arr.push(i)
        p.destroy()
        return arr
    }
}