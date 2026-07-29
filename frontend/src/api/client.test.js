import { fetchProperties, fetchPropertyDetail } from "./client";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

// Test 1: fetchProperties returns data on success
test("fetchProperties returns results and total on success", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ total: 100, limit: 20, offset: 0, results: [{ L_ListingID: "123" }] }),
  });

  const data = await fetchProperties({ limit: 20, offset: 0 });

  expect(data.total).toBe(100);
  expect(data.results).toHaveLength(1);
  expect(data.results[0].L_ListingID).toBe("123");
});

// Test 2: fetchProperties throws on error response
test("fetchProperties throws an error when response is not ok", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: "Something went wrong" }),
  });

  await expect(fetchProperties()).rejects.toThrow("Something went wrong");
});

// Test 3: fetchPropertyDetail returns a single property
test("fetchPropertyDetail returns property data on success", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ L_ListingID: "456", L_Address: "123 Main St" }),
  });

  const data = await fetchPropertyDetail("456");

  expect(data.L_ListingID).toBe("456");
  expect(data.L_Address).toBe("123 Main St");
});