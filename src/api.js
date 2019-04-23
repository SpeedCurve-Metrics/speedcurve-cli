const r = require("request-promise-native")
const truncate = require("./util/truncate")
const log = require("./log")
const VERSION = require("../package.json").version

const logFriendlyUrl = url =>
  [url.origin, url.pathname, url.searchParams ? "?" + url.searchParams : ""].join("")

class API {
  constructor() {
    this.base = "https://api.speedcurve.com/"
    this.key = "x"
  }

  prepareUrl(key, path, searchParams = {}) {
    const url = new URL(path, this.base)

    url.username = key
    url.password = "x"

    for (let key in searchParams) {
      if (typeof searchParams[key] !== "undefined") {
        url.searchParams.set(key, searchParams[key])
      }
    }

    return url
  }

  get(url) {
    log.http(`GET ${logFriendlyUrl(url)}`)

    return r.get({
      uri: url.href,
      json: true,
      headers: {
        "user-agent": `speedcurve-cli/${VERSION}`
      }
    })
  }

  post(url, data = {}) {
    log.http(`POST ${logFriendlyUrl(url)} ${truncate(JSON.stringify(data), 60)}`)

    return r.post({
      uri: url.href,
      json: true,
      form: data,
      headers: {
        "user-agent": `speedcurve-cli/${VERSION}`
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

  test(key, testId) {
    const url = this.prepareUrl(key, `/v1/tests/${testId}`)

    return this.get(url)
  }

  tests(key, urlId, days = 1, filters = {}) {
    const { region, browser } = filters
    const url = this.prepareUrl(key, `/v1/urls/${urlId}`, { days, region, browser })

    return this.get(url)
  }
}

module.exports = new API()
