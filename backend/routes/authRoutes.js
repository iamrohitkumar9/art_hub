const express = require("express");
const router = express.Router();

const authService = require("../services/authService");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.json({
            ...result,
            message: "Registration successful! Please check your email for confirmation."
        });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
