const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/:id/openhouses", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length > 50) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const [propertyRows] = await pool.query(
      `SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?`,
      [id]
    );

    if (propertyRows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    const [openhouses] = await pool.query(
      `SELECT * FROM rets_openhouse 
       WHERE L_ListingID = ? 
       ORDER BY OpenHouseDate ASC, OH_StartTime ASC`,
      [id]
    );

    res.json(openhouses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.length > 50) {
      return res.status(400).json({ error: "Invalid listing ID" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM rets_property WHERE L_ListingID = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset) || 0;

    // Validate limit
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      return res.status(400).json({ error: "limit must be a number between 1 and 100" });
    }

    // Validate offset
    if (isNaN(offset) || offset < 0) {
      return res.status(400).json({ error: "offset must be a non-negative number" });
    }

    const conditions = [];
    const values = [];

    // City filter
    if (req.query.city) {
      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(req.query.city);
    }

    // Zipcode filter
    if (req.query.zipcode) {
      conditions.push("L_Zip = ?");
      values.push(req.query.zipcode);
    }

    // Min price filter
    if (req.query.minPrice) {
      if (isNaN(parseInt(req.query.minPrice))) {
        return res.status(400).json({ error: "minPrice must be a number" });
      }
      conditions.push("L_SystemPrice >= ?");
      values.push(parseInt(req.query.minPrice));
    }

    // Max price filter
    if (req.query.maxPrice) {
      if (isNaN(parseInt(req.query.maxPrice))) {
        return res.status(400).json({ error: "maxPrice must be a number" });
      }
      conditions.push("L_SystemPrice <= ?");
      values.push(parseInt(req.query.maxPrice));
    }

    // Beds filter
    if (req.query.beds) {
      if (isNaN(parseInt(req.query.beds))) {
        return res.status(400).json({ error: "beds must be a number" });
      }
      conditions.push("L_Keyword2 >= ?");
      values.push(parseInt(req.query.beds));
    }

    // Baths filter
    if (req.query.baths) {
      if (isNaN(parseFloat(req.query.baths))) {
        return res.status(400).json({ error: "baths must be a number" });
      }
      conditions.push("LM_Dec_3 >= ?");
      values.push(parseFloat(req.query.baths));
    }

    // Build WHERE clause
    const where = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // Count query - how many total results match the filters
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM rets_property ${where}`,
      values
    );
    const total = countRows[0].total;

    // Results query - get the actual properties with pagination
    const [results] = await pool.query(
      `SELECT L_ListingID, L_Address, L_City, L_State, L_Zip, 
              L_SystemPrice, L_Keyword2, LM_Dec_3, LM_Int2_3, 
              L_Photos, LMD_MP_Latitude, LMD_MP_Longitude
       FROM rets_property ${where}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({ total, limit, offset, results });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;