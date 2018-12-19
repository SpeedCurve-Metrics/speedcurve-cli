const api = require("./api")
const Site = require("./model/site")

module.exports.get = function({ key, siteId }) {
  if (siteId) {
    return api.site(key, siteId)
  }

  return api.sites(key).then(res => res.map(data => Site.fromApiResponse(data)))
}
