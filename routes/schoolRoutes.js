const express = require("express");
const router = express.Router();
const db = require("../db");
const { calculateDistance } = require("../utils/distance");

router.post("/addSchool", async (req, res) => {
    console.log("recived add request");

    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid input" });
    }
    console.log("adding...", name);

    const sql =
        "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    try {
        const r = await db.query(sql, [name, address, latitude, longitude]);

        return res.status(201).json({
            message: "School added successfully",
            id: r.insertId,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get("/listSchools", async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res
            .status(400)
            .json({ error: "Latitude and longitude missing" });
    }

    try {
        const [schools] = await db.query("SELECT * FROM schools");
        console.log("schools", schools);

        const sortedSchools = schools
            .map((school) => ({
                ...school,
                distance: calculateDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    parseFloat(school.latitude),
                    parseFloat(school.longitude)
                ),
            }))
            .sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch schools" });
    }
});

module.exports = router;
