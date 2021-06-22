const SpeedCurve = require("../dist");
const request = require("request-promise");
const SPEEDCURVE_API_KEY = "abc123";

const makeBudget = (budgetId, metric) => ({
  budget_id: budgetId,
  metric: metric,
});

test("SpeedCurve.budgets.getAll()", async () => {
  request.get.mockResolvedValueOnce({
    budgets: [makeBudget(1111, "render"), makeBudget(2222, "doc")],
  });

  const budgets = await SpeedCurve.budgets.getAll(SPEEDCURVE_API_KEY);

  expect(budgets.length).toEqual(2);
  expect(budgets[0]).toBeInstanceOf(SpeedCurve.PerformanceBudget);
  expect(budgets[1]).toBeInstanceOf(SpeedCurve.PerformanceBudget);
  expect(budgets[0].budgetId).toEqual(1111);
  expect(budgets[1].budgetId).toEqual(2222);
});

test("SpeedCurve.budgets.getByDeployId()", async () => {
  request.get.mockResolvedValueOnce({
    budgets: [makeBudget(1111, "render")],
  });

  const budgets = await SpeedCurve.budgets.getByDeployId(SPEEDCURVE_API_KEY, 9876);

  expect(budgets[0]).toBeInstanceOf(SpeedCurve.PerformanceBudget);
  expect(request.get.mock.calls[0][0].uri).toEqual(expect.stringContaining("9876"));
});
