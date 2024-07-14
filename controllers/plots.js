import Plot from "../models/Plot.js";

/* create new plot */
export const createplot = async (req, res) => {
  try {
    const { plotNumber, description, projectId } = req.body;
    const newPlot = new Plot({
      plotNumber,
      description,
      projectId,
    });
    const savedPlot = await newPlot.save();
    res.status(201).json(savedPlot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createplotfromproject = async (projectId, arr, res) => {
  try {
    const savedPlots = [];
    for (let i = 0; i < arr.length; i++) {
      const { plotNumber, description } = arr[i];
      const newPlot = new Plot({
        plotNumber,
        description,
        projectId,
      });
      const savedPlot = await newPlot.save();
      savedPlots.push(savedPlot);
    }
    return savedPlots;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getplotsbyprojectid = async (req, res) => {
  try {
    const { projectId } = req.params;
    const plots = await Plot.find({ projectId });
    res.status(200).json(plots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
