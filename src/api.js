const r = require("request-promise-native")
const truncate = require("./util/truncate")
const log = require("./log")
const VERSION = require("../package.json").version

class API {
  constructor() {
    this.base = "http://127.0.0.1/"
    this.key = "x"
  }

  prepareUrl(key, path) {
    const url = new URL(path, this.base)

    url.username = key
    url.password = "x"

    return url
  }

  get(url) {
    log.http(`GET ${url.origin}${url.pathname}`)

    return r.get({
      uri: url.href,
      json: true,
      headers: {
        "user-agent": `SpeedCurve CLI ${VERSION}`
      }
    })
  }

  post(url, data = {}) {
    log.http(`POST ${url.origin}${url.pathname} ${truncate(JSON.stringify(data), 60)}`)

    return r.post({
      uri: url.href,
      json: true,
      form: data,
      headers: {
        "user-agent": `SpeedCurve CLI ${VERSION}`
      }
    })
  }

  deploy(key, site, note = "", detail = "") {
    const url = this.prepareUrl(key, `/v1/deploy`)

    return this.post(url, {
      site_id: site,
      note,
      detail
    })
  }

  deployStatus(key, deployId) {
    const url = this.prepareUrl(key, `/v1/deploy/${deployId}`)

    return this.get(url)
  }

  team(key) {
    const url = this.prepareUrl(key, "/v1/export")

    return this.get(url).then(res => res.teams[0])
  }

  site(key, siteId) {
    const url = this.prepareUrl(key, `/v1/sites/${siteId}`)

    return this.get(url).then(res => res.site)
  }

  sites(key) {
    const url = this.prepareUrl(key, "/v1/sites")

    return this.get(url).then(res => res.sites)
  }
}

module.exports = new API()
