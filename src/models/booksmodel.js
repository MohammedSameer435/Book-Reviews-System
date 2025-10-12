import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  genre: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const Books = mongoose.model("Books", bookSchema);
