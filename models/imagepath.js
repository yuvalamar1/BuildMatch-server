import mongoose from "mongoose";

const imagePathSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picturePath: {
    type: String,
    required: true,
  },
});

const ImagePath = mongoose.model("ImagePath", imagePathSchema);

export default ImagePath;
