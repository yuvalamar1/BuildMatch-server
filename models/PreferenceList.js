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
  preferences: {
    type: [
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
    _id: false, // This prevents Mongoose from adding `_id` to the subdocuments
  },
});

const PreferenceList = mongoose.model("PreferenceList", preferenceSchema);

export default PreferenceList;
