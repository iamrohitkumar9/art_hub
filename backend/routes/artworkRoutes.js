const express = require("express");
const router = express.Router();

const auth = require("../utilities/auth");
const roleCheck = require("../utilities/roleCheck");
const upload = require("../utilities/upload");
const artworkService = require("../services/artworkService");

// CREATE ARTWORK (artist only)
router.post(
  "/create",
  auth,
  roleCheck("artist"),
  upload.array("images", 5),
  async (req, res) => {
    try {
      const images = req.files.map((f) => `${process.env.BASE_URL}/uploads/${f.filename}`);

      const artwork = await artworkService.createArtwork(
        req.user._id,
        req.body,
        images
      );
      res.json(artwork);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  }
);

// SEARCH ARTWORKS
router.get("/search", async (req, res) => {
  try {
    const result = await artworkService.searchArtworks(req.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET DISTINCT MEDIUMS
router.get('/mediums', async (req, res) => {
  try {
    const list = await artworkService.getDistinctMediums();
    res.json(list);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// GET ARTWORK BY ID
router.get("/:id", async (req, res) => {
  try {
    const art = await artworkService.getArtwork(req.params.id);
    res.json(art);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// UPDATE ARTWORK (artist owns it)
router.put("/:id", auth, roleCheck("artist"), async (req, res) => {
  try {
    const updated = await artworkService.updateArtwork(
      req.user._id,
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// DELETE ARTWORK (artist owns it)
router.delete("/:id", auth, roleCheck("artist"), async (req, res) => {
  try {
    const result = await artworkService.deleteArtwork(
      req.user._id,
      req.params.id
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
