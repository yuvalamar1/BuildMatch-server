import PreferenceList from "../models/PreferenceList.js";

/* get all preferences */
export const getprojetpreferences = async (req, res) => {
  console.log("getprojetpreferences");
  console.log(req.params);
  const { projectId, clientId } = req.params;
  try {
    const preferences = await PreferenceList.find({ projectId, clientId });
    res.status(200).json(preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createpreference = async (req, res) => {
  try {
    const { clientid, projectId, preferences } = req.body;
    const newPreference = new PreferenceList({
      clientid,
      projectId,
      preferences,
    });
    const savedPreference = await newPreference.save();
    res.status(201).json(savedPreference);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
