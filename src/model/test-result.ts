import { TestResultApiResponse } from "../api"

/**
 * An object representing a SpeedCurve synthetic test result. See the
 * {@link https://api.speedcurve.com/#get-all-sites|API documentation} for a
 * description of the data object.
 */
export default class TestResult {
	testId: string
	data: TestResultData

	constructor(testId: string, data: TestResultData) {
		this.testId = testId
		this.data = data
	}

	/**
	 * Build a new {@link TestResult} object from a {@link https://api.speedcurve.com/#get-all-sites|/v1/sites}
	 * API response object
	 */
	static fromApiResponse(response: TestResultApiResponse): TestResult {
		return new TestResult(response.test_id, response)
	}
}

interface TestResultData {
	test_id: string
}
