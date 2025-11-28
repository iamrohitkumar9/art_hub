const express = require("express");
const router = express.Router();

const auth = require("../utilities/auth");
const roleCheck = require("../utilities/roleCheck");
const artistService = require("../services/artistsService");
const analyticsService = require("../services/analyticsService");

// GET ARTIST PROFILE
router.get("/profile", auth, async (req, res) => {
  try {
    const profile = await artistService.getProfile(req.user._id);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// UPDATE ARTIST PROFILE
router.put("/profile", auth, async (req, res) => {
  try {
    const updated = await artistService.updateProfile(req.user._id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET ARTIST ANALYTICS
router.get("/analytics", auth, async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalytics(req.user._id);
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// PUBLIC: SEARCH ARTISTS
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const limit = parseInt(req.query.limit) || 8;
    const list = await artistService.searchArtists(q, { limit });
    res.json(list);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// PUBLIC: Return artists from seed JSON (useful for debugging/testing)
router.get('/fromjson', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const limit = parseInt(req.query.limit) || 4;
    const p = path.resolve(__dirname, '..', 'seed', 'artists.json');
    if (!fs.existsSync(p)) return res.status(404).json({ msg: 'artists.json not found' });
    const raw = fs.readFileSync(p, 'utf8');
    const arr = JSON.parse(raw);
    const sliced = Array.isArray(arr) ? arr.slice(0, limit) : [];
    // Normalize to public-facing fields
    const normalized = sliced.map(u => ({ _id: u._id || u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl || '', bio: u.bio || '', role: u.role || 'artist' }));
    res.json(normalized);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PUBLIC: GET ARTIST BY ID
router.get('/:id', async (req, res) => {
  try {
    const profile = await artistService.getProfile(req.params.id);
    // remove sensitive fields if any
    res.json(profile);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;

