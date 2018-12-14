module.exports = class Result {
  constructor(site, team) {
    this.site = site
    this.teamName = team.name
    this.key = team.key
    this.deployId = null
    this.tests = 0
    this.completedTests = 0
  }

  static countTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.tests, 0)
  }

  static countCompletedTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.completedTests, 0)
  }

  updateFromApiResponse(res) {
    this.deployId = res.deploy_id

    if (typeof res["tests-requested"] !== "undefined") {
      this.tests = res["tests-requested"]
    }

    if (typeof res["tests-completed"] !== "undefined") {
      this.completedTests = res["tests-completed"].length
    }
  }
}
