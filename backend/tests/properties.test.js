const request = require("supertest");
const express = require("express");

// Mock the database pool
jest.mock("../db", () => ({
  query: jest.fn(),
}));

const pool = require("../db");
const propertiesRouter = require("../routes/properties");

const app = express();
app.use(express.json());
app.use("/api/properties", propertiesRouter);

describe("GET /api/properties", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns paginated properties with total count", async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 100 }]])
      .mockResolvedValueOnce([[
        { L_ListingID: "123", L_Address: "123 Main St", L_City: "Portland" }
      ]]);

    const res = await request(app)
      .get("/api/properties")
      .query({ limit: 20, offset: 0 });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(100);
    expect(res.body.results).toHaveLength(1);
    expect(res.body.limit).toBe(20);
    expect(res.body.offset).toBe(0);
  });

  test("filters by city", async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 5 }]])
      .mockResolvedValueOnce([[
        { L_ListingID: "456", L_City: "Portland" }
      ]]);

    const res = await request(app)
      .get("/api/properties")
      .query({ city: "Portland", limit: 20, offset: 0 });

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(5);
  });

  test("returns 400 for invalid minPrice", async () => {
    const res = await request(app)
      .get("/api/properties")
      .query({ minPrice: "abc", limit: 20, offset: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("returns 400 for limit over 100", async () => {
    const res = await request(app)
      .get("/api/properties")
      .query({ limit: 200 });

    expect(res.status).toBe(400);
  });

  test("returns 400 for limit of 0", async () => {
    const res = await request(app)
      .get("/api/properties")
      .query({ limit: 0 });

    expect(res.status).toBe(400);
  });
});

describe("GET /api/properties/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns a single property by ID", async () => {
    pool.query.mockResolvedValueOnce([[
      { L_ListingID: "123", L_Address: "123 Main St" }
    ]]);

    const res = await request(app).get("/api/properties/123");

    expect(res.status).toBe(200);
    expect(res.body.L_ListingID).toBe("123");
  });

  test("returns 404 for unknown ID", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/properties/unknown-id");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Property not found");
  });

  test("returns 400 for oversized ID", async () => {
    const longId = "a".repeat(51);
    const res = await request(app).get(`/api/properties/${longId}`);

    expect(res.status).toBe(400);
  });
});

describe("GET /api/properties/:id/openhouses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns open houses for a valid property", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockResolvedValueOnce([[
        { id: 1, L_ListingID: "123", OpenHouseDate: "2026-01-01", OH_StartTime: "10:00:00", OH_EndTime: "12:00:00", all_data: "{}" }
      ]]);

    const res = await request(app).get("/api/properties/123/openhouses");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  test("returns empty array when no open houses exist", async () => {
    pool.query
      .mockResolvedValueOnce([[{ L_ListingID: "123" }]])
      .mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/properties/123/openhouses");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  test("returns 404 for unknown property", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/properties/unknown/openhouses");

    expect(res.status).toBe(404);
  });
});