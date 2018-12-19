const Url = require("./url")

module.exports = class Site {
  constructor(siteId, name, urls) {
    this.siteId = siteId
    this.name = name
    this.urls = urls
  }

  static fromApiResponse(res) {
    return new Site(res.site_id, res.name, res.urls.map(url => Url.fromApiResponse(url)))
  }
}
