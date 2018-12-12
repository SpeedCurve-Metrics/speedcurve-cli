module.exports = class Result {
  constructor(siteId, team) {
    this.siteId = siteId
    this.teamName = team.name
    this.key = team.key
    this.deployId = null
    this.tests = []
    this.completedTests = []
  }

  static countTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.tests.length, 0)
  }

  static countCompletedTests(resultsCollection) {
    return resultsCollection.reduce((sum, result) => sum + result.completedTests.length, 0)
  }

  updateFromApiResponse(res) {
    this.deployId = res.deploy_id

    if (typeof res.info["tests-added"] !== "undefined") {
      this.tests = res.info["tests-added"]
    }

    if (typeof res.info["tests-completed"] !== "undefined") {
      this.completedTests = res.info["tests-completed"]
    }
  }
}
