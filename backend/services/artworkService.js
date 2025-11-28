const Artwork = require("../models/artworkModel");

module.exports = {
  // Create new artwork
  async createArtwork(userId, data, images) {
    data.images = images;
    data.artist = userId;

    const artwork = await Artwork.create(data);
    return artwork;
  },

  // Search artwork
  async searchArtworks(query) {
    const q = query.q || "";
    const medium = query.medium;
    const min = parseInt(query.min) || 0;
    const max = parseInt(query.max) || Number.MAX_SAFE_INTEGER;
    // pagination
    const page = parseInt(query.page) || 1;
    const perPage = parseInt(query.limit) || parseInt(query.perPage) || 12;

    const filter = {
      $and: [
        { price: { $gte: min, $lte: max } },
        {
          $or: [
            { title: new RegExp(q, "i") },
            { description: new RegExp(q, "i") },
            { tags: new RegExp(q, "i") },
          ],
        },
      ],
    };

    // support medium param (single or comma-separated values) — use case-insensitive regex matching
    if (medium) {
      const mediums = Array.isArray(medium) ? medium : medium.split(',').map(m => m.trim()).filter(Boolean);
      if (mediums.length) {
        // escape and create case-insensitive regexes so UI labels like "Digital Art" match "Digital"
        const regexes = mediums.map(m => new RegExp(m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        filter.$and.push({ medium: { $in: regexes } });
      }
    }

    // support tags param (single tag or comma separated)
    if (query.tags) {
      const tags = Array.isArray(query.tags) ? query.tags : query.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tags.length) {
        const tagRegexes = tags.map(t => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        filter.$and.push({ tags: { $in: tagRegexes } });
      }
    }

    // support style param
    if (query.style) {
      const styleVal = query.style.toString().trim();
      if (styleVal) {
        filter.$and.push({ style: new RegExp(styleVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
      }
    }

    // support filtering by artist id
    if (query.artist) {
      // accept single id
      filter.$and.push({ artist: query.artist });
    }

    const total = await Artwork.countDocuments(filter);
    const items = await Artwork.find(filter)
      .populate("artist", "name avatarUrl")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return { items, total, page, perPage };
  },

  // Get single artwork
  async getArtwork(id) {
    const art = await Artwork.findById(id).populate("artist", "name avatarUrl");
    if (!art) throw new Error("Artwork not found");
    return art;
  },

  // Get distinct mediums
  async getDistinctMediums() {
    const list = await Artwork.distinct('medium');
    return (Array.isArray(list) ? list.filter(Boolean) : []);
  },

  // Update artwork
  async updateArtwork(userId, artworkId, data) {
    const art = await Artwork.findById(artworkId);
    if (!art) throw new Error("Artwork not found");

    if (art.artist.toString() !== userId.toString())
      throw new Error("Not authorized");

    Object.assign(art, data);
    await art.save();
    return art;
  },

  // Delete artwork
  async deleteArtwork(userId, artworkId) {
    const art = await Artwork.findById(artworkId);
    if (!art) throw new Error("Artwork not found");

    if (art.artist.toString() !== userId.toString())
      throw new Error("Not authorized");

    await art.deleteOne();
    return { msg: "Artwork deleted" };
  },
};
