const SpeedCurve = require("../dist")

jest.mock("request-promise-native")

test("exposes commonly-used APIs", () => {
	expect(SpeedCurve.budgets).toBeDefined()
	expect(SpeedCurve.deploys).toBeDefined()
	expect(SpeedCurve.sites).toBeDefined()
	expect(SpeedCurve.tests).toBeDefined()
})

test("fetches budgets from the API", async () => {
	const r = require("request-promise-native")
	r.get.mockReset()
	r.get.mockResolvedValueOnce({
		budgets: [
			{
				budget_id: 444,
				status: "under",
				metric_full_name: "Start Render",
				absolute_threshold: 2.0,
				relative_threshold: 20,
				metric_suffix: "s"
			}
		]
	})

	const budgets = await SpeedCurve.budgets.getAll("sckey")

	expect(r.get.mock.calls[0][0].uri).toBe("https://sckey:x@api.speedcurve.com/v1/budgets")
	expect(budgets[0]).toBeInstanceOf(SpeedCurve.PerformanceBudget)
	expect(budgets[0].budgetId).toBe(444)
})

test("fetches deploys from the API", async () => {
	const r = require("request-promise-native")
	r.get.mockReset()
	r.get.mockResolvedValueOnce({
		deploy_id: 222,
		site_id: 777,
		timestamp: 1559086000,
		status: "completed",
		"tests-completed": [],
		"tests-remaining": [],
		note: "v1.0.0",
		detail: "First release"
	})

	const deploy = await SpeedCurve.deploys.status("sckey", 222)

	expect(r.get.mock.calls[0][0].uri).toBe("https://sckey:x@api.speedcurve.com/v1/deploy/222")
	expect(deploy.deploy_id).toBe(222)
	expect(deploy.note).toBe("v1.0.0")
	expect(deploy.detail).toBe("First release")
})

test("fetches sites from the API", async () => {
	const r = require("request-promise-native")
	r.get.mockReset()
	r.get.mockResolvedValueOnce({
		sites: [
			{
				site_id: 101,
				name: "Site 101",
				urls: []
			}
		]
	})

	const sites = await SpeedCurve.sites.getAll("sckey")

	expect(r.get.mock.calls[0][0].uri).toBe("https://sckey:x@api.speedcurve.com/v1/sites")
	expect(sites[0]).toBeInstanceOf(SpeedCurve.Site)
	expect(sites[0].siteId).toBe(101)
})

test("fetches tests from the API", async () => {
	const r = require("request-promise-native")
	r.get.mockReset()
	r.get.mockResolvedValueOnce({
		test_id: "190528_BK_BURGER"
	})

	const test = await SpeedCurve.tests.get("sckey", "190528_BK_BURGER")

	expect(r.get.mock.calls[0][0].uri).toBe("https://sckey:x@api.speedcurve.com/v1/tests/190528_BK_BURGER")
	expect(test).toBeInstanceOf(SpeedCurve.TestResult)
	expect(test.testId).toBe("190528_BK_BURGER")
})
