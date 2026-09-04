import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String },
  authorName: { type: String },
  language: { type: String },
  desc: { type: String },
  status: { type: String }, // also note: was lowercase "string" — should be String (capital, no quotes)
  category: { type: String },
  Download: { type: String },
  imageUrl: { type: String }, // same fix here
  genprice: { type: Number },
  ourprice: { type: Number },
  format: { type: String },
  pages: { type: Number },
  dimensions: { type: String },
  pubDate: { type: Date },
  ISBN: { type: Number },
  Reviews: { type: String },
  AboutAuthor: { type: String },
  AuthorSince: { type: Date },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;