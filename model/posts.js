const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '貼文姓名未填寫']
    },
    tags: {
      type: Array,
      required: [true, '貼文tag 未填寫']
    },
    type: {
      type: String,
      enum: ['group', 'person'],
      required: [true, '貼文type 未填寫']
    },
    image: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    content: {
      type: String,
      required: [true, '貼文content未填寫']
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
);

const Posts = mongoose.model('Post', postsSchema);

module.exports = Posts;
