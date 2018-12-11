const log = require('npmlog')
const api = require('./api')

module.exports = async function deployCommand (config) {
  for (const i in config.accounts) {
    const account = config.accounts[i]
    const accountName = account.name || `accounts[${i}]`

    if (!account.key) {
      log.error(`Invalid configuration: ${accountName} is missing the "key" property`)
    }

    if (account.sites && account.sites.length) {
      log.verbose(`Deploying sites [${account.sites.join(', ')}] in ${accountName}`)
    } else {
      log.verbose(`No sites specified. Deploying all sites in ${accountName}`)

      try {
        account.sites = (await api.sites(account.key)).map(s => s.site_id)
      } catch (err) {
        log.error(`Error fetching sites for ${accountName}: ${err.message}`)
      }
    }

    for (const site of account.sites) {
      api.deploy(account.key, site)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          log.error(`Error deploying site ${site} in ${accountName}: ${err.message}`)
        })
    }
  }
}
