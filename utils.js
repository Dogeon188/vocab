const bent = require("bent")
const parser = require("csv-parse")
const chalk = require("chalk")

module.exports = {
    log(msg) {
        console.log(chalk.green.bold("I"), chalk.gray(`[${new Date().toISOString()}]`), msg)
    },
    error(err) {
        console.log(chalk.red.bold("E"), chalk.gray(`[${new Date().toISOString()}]`), err)
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