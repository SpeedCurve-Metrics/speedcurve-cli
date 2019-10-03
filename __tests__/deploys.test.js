const SpeedCurve = require("../dist")
const request = require("request-promise-native")
const SPEEDCURVE_API_KEY = "abc123"

describe("SpeedCurve.deploys.create()", () => {
	test("Deploy a single site", async () => {
		// Team API response
		request.get.mockResolvedValueOnce({})

		// Sites API response
		request.get.mockResolvedValueOnce({})

		// Deploys API response
		request.post.mockResolvedValueOnce({})

		const results = await SpeedCurve.deploys.create(SPEEDCURVE_API_KEY, [1001])

		expect(results.length).toEqual(1)
		expect(results[0]).toBeInstanceOf(SpeedCurve.DeployResult)
		expect(request.post.mock.calls[0][0].form.site_id).toEqual(1001)
	})

	test("Deploy multiple sites", async () => {
		// Team API response
		request.get.mockResolvedValueOnce({})

		// Sites API responses
		request.get
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})
			.mockResolvedValueOnce({})

		// Deploys API response
		request.post.mockImplementation(settings =>
			Promise.resolve({
				deploy_id: Math.round(Math.random() * 1000),
				site_id: settings.form.site_id
			})
		)

		const results = await SpeedCurve.deploys.create(SPEEDCURVE_API_KEY, [1001, 1002])

		expect(results.length).toEqual(2)
		expect(results[0]).toBeInstanceOf(SpeedCurve.DeployResult)
		expect(results[1]).toBeInstanceOf(SpeedCurve.DeployResult)
		expect(results[0].site).toBeInstanceOf(SpeedCurve.Site)
		expect(results[1].site).toBeInstanceOf(SpeedCurve.Site)
		expect(results[0].site.siteId).toEqual(1001)
		expect(results[1].site.siteId).toEqual(1002)
		expect(request.post.mock.calls[0][0].form.site_id).toEqual(1001)
		expect(request.post.mock.calls[1][0].form.site_id).toEqual(1002)
	})
})
