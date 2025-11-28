const CommunityPost = require("../models/communityModel");

module.exports = {
  // Create a community post
  async createPost(userId, data, images) {
    const post = await CommunityPost.create({
      author: userId,
      title: data.title,
      body: data.body,
      attachments: images,
    });

    return post;
  },

  // List all posts
  async listPosts() {
    return await CommunityPost.find()
      .populate("author", "name avatarUrl")
      .populate('comments.author', 'name avatarUrl')
      .sort({ createdAt: -1 });
  },

  // Add comment to a post
  async addComment(postId, userId, content) {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new Error('Post not found');
    post.comments = post.comments || [];
    post.comments.push({ author: userId, content });
    await post.save();
    return await CommunityPost.findById(postId).populate('author', 'name avatarUrl').populate('comments.author', 'name avatarUrl');
  },
};
