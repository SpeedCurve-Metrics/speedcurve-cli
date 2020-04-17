const SpeedCurve = require("../dist")
const request = require("request-promise")
const SPEEDCURVE_API_KEY = "abc123"

const makeSite = (siteId, siteName) => ({
	site_id: siteId,
	name: siteName,
	urls: [
		{
			url_id: 1234,
			label: "Home",
			url: "https://speedcurve.com/",
		},
	],
	regions: [{ region_id: "us-west-1" }],
	browsers: [{ browser_id: "chrome" }],
})

test("SpeedCurve.sites.get()", async () => {
	request.get.mockResolvedValueOnce({
		site: makeSite(2222, "Test Site"),
	})

	const site = await SpeedCurve.sites.get(SPEEDCURVE_API_KEY, 2222)

	expect(site).toBeInstanceOf(SpeedCurve.Site)
	expect(site.siteId).toEqual(2222)
	expect(site.urls[0]).toBeInstanceOf(SpeedCurve.Url)
	expect(site.urls[0].urlId).toEqual(1234)
	expect(request.get.mock.calls[0][0].uri).toEqual(expect.stringContaining("2222"))
})

test("SpeedCurve.sites.getAll()", async () => {
	request.get.mockResolvedValueOnce({
		sites: [makeSite(2222, "Test Site 1"), makeSite(3333, "Test Site 2"), makeSite(5555, "Test Site 3")],
	})

	const sites = await SpeedCurve.sites.getAll(SPEEDCURVE_API_KEY)

	expect(sites.length).toEqual(3)
	expect(sites[0]).toBeInstanceOf(SpeedCurve.Site)
	expect(sites[1]).toBeInstanceOf(SpeedCurve.Site)
	expect(sites[2]).toBeInstanceOf(SpeedCurve.Site)
	expect(sites[0].siteId).toEqual(2222)
	expect(sites[1].siteId).toEqual(3333)
	expect(sites[2].siteId).toEqual(5555)
})

test("SpeedCurve.sites.getAllWithTests()", async () => {
	request.get
		// Sites API response
		.mockResolvedValueOnce({
			sites: [makeSite(2222, "Test Site 1")],
		})
		// Tests API response
		.mockResolvedValueOnce({
			url_id: 1234,
			label: "Home",
			url: "https://speedcurve.com/",
			tests: [{ test_id: "202020_XYZ" }, { test_id: "202020_ABC" }],
		})

	const sites = await SpeedCurve.sites.getAllWithTests(SPEEDCURVE_API_KEY)

	expect(sites[0]).toBeInstanceOf(SpeedCurve.Site)
	expect(sites[0].urls[0]).toBeInstanceOf(SpeedCurve.Url)
	expect(sites[0].urls[0].tests.length).toEqual(2)
	expect(request.get.mock.calls[1][0].uri).toEqual(expect.stringContaining("1234"))
})
