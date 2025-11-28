const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analyticsService');

// Public analytics for an artist by id
router.get('/artist/:id', async (req, res) => {
    try {
        const analytics = await analyticsService.getAnalytics(req.params.id);
        res.json(analytics);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
