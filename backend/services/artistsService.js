const User = require("../models/userModel");

module.exports = {
  // Get artist profile
  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("Artist not found");
    return user;
  },

  // Update profile
  async updateProfile(userId, data) {
    const updated = await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-password");

    if (!updated) throw new Error("Update failed");

    return updated;
  },
  // Search artists by name or email
  async searchArtists(query, opts = {}) {
    const q = (query || '').trim();
    if (!q) return [];
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const limit = opts.limit || 8;
    const artists = await User.find({ role: 'artist', $or: [{ name: regex }, { email: regex }] })
      .select('-password -socialLinks -bio')
      .limit(limit)
      .lean();
    return artists;
  }
};
