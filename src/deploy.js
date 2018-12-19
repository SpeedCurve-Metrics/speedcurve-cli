const log = require("./log")
const api = require("./api")
const DeployResult = require("./model/deploy-result")
const pl = require("./util/pluralise")

module.exports = async function deploy({ key, site = [], note = "", detail = "" }) {
  let teamName = "your SpeedCurve team"

  try {
    await api.team(key).then(res => (teamName = res.team))
  } catch {
    log.verbose(`Couldn't fetch team data`)
  }

  if (site && site.length) {
    site = await Promise.all(
      site.map(siteId =>
        api.site(key, siteId).catch(() => ({ site_id: siteId, name: `Site #${siteId}` }))
      )
    )
  } else {
    log.verbose(`No sites specified. Deploying all sites in ${teamName}`)

    try {
      site = await api.sites(key)
    } catch (err) {
      log.error(`Error fetching sites for ${teamName}: ${err.message}`)
    }
  }

  if (!site || !site.length) {
    log.warn(`No sites for ${teamName}`)
  }

  const ps = site
    .map(site => new DeployResult(site))
    .map(result =>
      api
        .deploy(key, result.site.site_id, note, detail)
        .then(res => {
          if (res.status === "success") {
            result.updateFromApiResponse(res)
            result.success = true

            log.ok(`Triggered ${result.tests} ${pl("test", result.tests)} for ${result.site.name}`)
          } else {
            log.error(`Couldn't deploy site ${result.site.name}: ${res.message}`)
          }

          return result
        })
        .catch(err => {
          log.error(`Couldn't deploy site ${result.site.name}: ${err.message}`)

          return { success: false }
        })
    )

  return Promise.all(ps)
}
