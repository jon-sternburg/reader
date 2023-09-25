import mongoose from "mongoose";

const AnnotationInner = new mongoose.Schema({
  type: String,
  cfiRange: String,
  data: {
    data: String,
    epubcfi: String,
    section: String,
    text: String,
    time: String,
    title: String,
  },
  sectionIndex: Number,
});

const booksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  annotations: [mongoose.Schema.Types.Mixed],
  loc: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Books || mongoose.model("Books", booksSchema);
