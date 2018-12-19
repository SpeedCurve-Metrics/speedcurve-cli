const SpeedCurve = require("../index")
const log = require("../log")

module.exports = function listSites({ key, json = false }) {
  SpeedCurve.sites.get({ key }).then(sites => {
    if (json) {
      log.stdout(JSON.stringify(sites, null, 4))
    } else {
      sites.forEach(site => {
        const urlOutput = site.urls
          .map(url =>
            [
              `\tURL Label: ${url.label}\n`,
              `\tURL: ${url.url}\n`,
              `\tURL ID: ${url.urlId}\n\n`
            ].join("")
          )
          .join("")

        log.stdout(
          [
            "\n=========================\n\n",
            `Site Name: ${site.name}\n`,
            `Site ID: ${site.siteId}\n`,
            "Site URLs:\n",
            urlOutput
          ].join("")
        )
      })
    }
  })
}
