const express = require("express");
const router = express.Router();

const auth = require("../utilities/auth");
const upload = require("../utilities/upload");
const communityService = require("../services/communityService");

// CREATE POST
router.post(
  "/create",
  auth,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const images = req.files.map((f) => `${process.env.BASE_URL}/uploads/${f.filename}`);

      const post = await communityService.createPost(
        req.user._id,
        req.body,
        images
      );

      res.json(post);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  }
);

// GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const posts = await communityService.listPosts();
    res.json(posts);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ADD COMMENT
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await communityService.addComment(req.params.id, req.user._id, req.body.content);
    res.json(post);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
