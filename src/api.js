const r = require('request-promise-native')
const log = require('npmlog')

class API {
  constructor() {
    this.base = 'http://127.0.0.1/'
  }

  prepareUrl(key, path) {
    const url = new URL(path, this.base)

    url.username = key
    url.password = 'x'

    return url
  }

  request(url, method = 'GET', data = {}) {
    log.verbose(`Making request to ${url.origin}${url.pathname}`)

    return r({
      method,
      uri: url.href,
      json: true,
      qs: data
    })
  }

  deploy(key, site) {
    const url = this.prepareUrl(key, `/v1/deploy`)

    return this.request(url, 'POST', {
      site_id: site
    })
  }

  sites(key) {
    const url = this.prepareUrl(key, '/v1/sites')

    return this.request(url).then(res => res.sites)
  }
}

module.exports = new API()
