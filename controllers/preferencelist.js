import PreferenceList from "../models/PreferenceList.js";

/* get all preferences */
export const getprojetpreferences = async (req, res) => {
  const { projectId, clientId } = req.params;
  try {
    const preferences = await PreferenceList.findOne({ projectId, clientId });
    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }
    res.status(200).json(preferences.preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getsubmittedproject = async (req, res) => {
  const { clientid } = req.params;
  try {
    const submittedlist = await PreferenceList.find({ clientid });
    if (!submittedlist) {
      return res.status(204).json({ message: "registered project not found" });
    }
    let templist = [];
    submittedlist.map((item) => {
      templist.push(item.projectId);
    });
    console.log(templist);
    res.status(200).json(templist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createpreference = async (req, res) => {
    try {
      const { clientid, projectId, preferences } = req.body;
  
      // Find the document and update it, or create a new one if it doesn't exist
      const updatedPreference = await PreferenceList.findOneAndUpdate(
        { clientid, projectId },  // Query to find the document
        { preferences },           // Data to update
        { new: true, upsert: true } // Options: new=true returns the updated document, upsert=true creates the document if it doesn't exist
      );
  
      res.status(200).json(updatedPreference);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
