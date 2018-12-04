# SpeedCurve Deploy

Define and run SpeedCurve tests from the command line. With speedcurve-deploy, you use a `speedcurve.json` file to configure the tests that you want to run. Then, using a single command, you run the tests on-demand and optionally wait to receive results.

A `speedcurve.json` file looks like this:

```json
{
  "sites": [
    {
      "site_id": 12345
    }
  ]
}
```
