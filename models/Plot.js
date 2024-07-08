import mongoose from "mongoose";

const plotSchema = new mongoose.Schema({
  plotNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const Plot = mongoose.model("Plot", plotSchema);

export default Plot;
