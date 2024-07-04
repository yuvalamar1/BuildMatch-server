import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  administrator: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  zoningImagePath: {
    type: String,
    required: true,
  },
  architectualrenderingImagePath: {
    type: String,
    required: true,
  },

  plots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plot",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
