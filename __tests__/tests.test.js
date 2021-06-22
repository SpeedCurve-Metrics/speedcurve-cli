const SpeedCurve = require("../dist");
const request = require("request-promise");
const SPEEDCURVE_API_KEY = "abc123";

test("SpeedCurve.tests.get()", async () => {
  request.get.mockResolvedValueOnce({
    test_id: "202020_XYZ",
  });

  const test = await SpeedCurve.tests.get(SPEEDCURVE_API_KEY, "202020_XYZ");

  expect(test).toBeInstanceOf(SpeedCurve.TestResult);
  expect(test.testId).toEqual("202020_XYZ");
  expect(request.get.mock.calls[0][0].uri).toEqual(expect.stringContaining("202020_XYZ"));
});

test("SpeedCurve.tests.getForUrl()", async () => {
  request.get.mockResolvedValueOnce({
    url_id: 1234,
    label: "Home",
    url: "https://speedcurve.com/",
    tests: [{ test_id: "202020_XYZ" }, { test_id: "202020_ABC" }],
  });

  const url = await SpeedCurve.tests.getForUrl(SPEEDCURVE_API_KEY, 1234);

  expect(url).toBeInstanceOf(SpeedCurve.Url);
  expect(url.tests.length).toEqual(2);
  expect(url.tests[0].testId).toEqual("202020_XYZ");
  expect(url.tests[1].testId).toEqual("202020_ABC");
  expect(request.get.mock.calls[0][0].uri).toEqual(expect.stringContaining("1234"));
});
