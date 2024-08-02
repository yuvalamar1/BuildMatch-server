import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema({
  clientid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Client",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  preferences: [
    {
      plotid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Plot",
      },
      preference: {
        type: Number,
        required: true,
      },
    },
  ],
});

const PreferenceList = mongoose.model("PreferenceList", preferenceSchema);

export default PreferenceList;
