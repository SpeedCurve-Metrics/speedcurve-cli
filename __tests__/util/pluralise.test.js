const truncate = require("../../dist/util/truncate").default;

describe("truncate()", () => {
  test("doesn't truncate strings that are shorter than the max length", () => {
    expect(truncate("test string", 20)).toEqual("test string");
  });

  test("only truncates strings when the truncated string is shorter than the original", () => {
    expect(truncate("test string", 11)).toEqual("test string");
    expect(truncate("test string", 10)).toEqual("test string");
    expect(truncate("test string", 9)).toEqual("test string");
    expect(truncate("test string", 8)).toEqual("test string");
    expect(truncate("test string", 7)).toEqual("test st...");
  });
});
