var mongoose = require("mongoose");
    var blogSchema = new mongoose.Schema(
      {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: "" },
        image: { type: String, default: "" },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        category: {
          type: String,
          enum: ["fitness", "nutrition", "lifestyle", "motivation", "news"],
          default: "fitness"
        },
        tags: [{ type: String }],
        isPublished: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 }
      },
      { timestamps: true }
    );
    module.exports = mongoose.model("Blog", blogSchema);
