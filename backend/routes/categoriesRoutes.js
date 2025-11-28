const express = require('express');
const router = express.Router();

const Category = require('../models/categoryModel');
const Artwork = require('../models/artworkModel');

// GET all categories
router.get('/', async (req, res) => {
    try {
        const cats = await Category.find().sort({ name: 1 });
        res.json(cats);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

// GET categories with counts (counts computed from artworks)
router.get('/with-counts', async (req, res) => {
    try {
        const cats = await Category.find().sort({ name: 1 });
        const results = await Promise.all(cats.map(async (c) => {
            const name = c.name || '';
            const count = await Artwork.countDocuments({ medium: name });
            return {
                name: c.name,
                slug: c.slug,
                iconName: c.iconName,
                description: c.description,
                count: count
            };
        }));
        res.json(results);
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
