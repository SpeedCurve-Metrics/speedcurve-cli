const SpeedCurve = require("../dist")
const request = require("request-promise")
const SPEEDCURVE_API_KEY = "abc123"

test("SpeedCurve.urls.create()", async () => {
	request.post.mockResolvedValueOnce({
		status: "success",
		message: "Success!",
		url_id: 8081,
	})

	const response = await SpeedCurve.urls.create(SPEEDCURVE_API_KEY, {
		siteId: 326,
		url: "https://speedcurve.com/",
		label: "Home",
	})

	expect(response.status).toEqual("success")
	expect(request.post.mock.calls[0][0].form.site_id).toEqual("326")
})

test("SpeedCurve.urls.update()", async () => {
	request.put.mockResolvedValueOnce({
		status: "success",
		message: "Success!",
		url_id: 8081,
	})

	const response = await SpeedCurve.urls.update(SPEEDCURVE_API_KEY, 8081, { label: "home" })

	expect(response.status).toEqual("success")
	expect(request.put.mock.calls[0][0].form.label).toEqual("home")
})

test("SpeedCurve.urls.update(script)", async () => {
	request.put.mockResolvedValueOnce({
		status: "success",
		message: "Success!",
		url_id: 8081,
	})

	const response = await SpeedCurve.urls.update(SPEEDCURVE_API_KEY, 8081, { script: "navigate	https://goodrx.com" })

	expect(response.status).toEqual("success")
	expect(request.put.mock.calls[0][0].form.script).toEqual("navigate	https://goodrx.com")
})
