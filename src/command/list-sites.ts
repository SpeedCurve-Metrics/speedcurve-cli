import * as SpeedCurve from "../index";
import log from "../log";

interface ListSitesCommandOptions {
  key: string;
  json: boolean;
}

export default async function listSitesCommand(opts: ListSitesCommandOptions): Promise<void> {
  const { key, json = false } = opts;

  return SpeedCurve.sites.getAll(key).then((sites) => {
    if (json) {
      log.json(sites);
    } else {
      sites.forEach((site) => {
        const urlOutput = site.urls
          .map((url) => [`\tURL Label: ${url.label}\n`, `\tURL: ${url.url}\n`, `\tURL ID: ${url.urlId}\n\n`].join(""))
          .join("");

        log.stdout(
          [
            "\n=========================\n\n",
            `Site Name: ${site.name}\n`,
            `Site ID: ${site.siteId}\n`,
            "Site URLs:\n",
            urlOutput,
          ].join("")
        );
      });
    }
  });
}

module.exports = listSitesCommand;
