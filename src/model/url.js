module.exports = class Url {
  constructor(urlId, label, url) {
    this.urlId = urlId
    this.label = label
    this.url = url
  }

  static fromApiResponse(res) {
    return new Url(res.url_id, res.label, res.url)
  }
}
