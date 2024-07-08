import Project from "../models/Project.js";
import multer from "multer";
import { createplotfromproject } from "./plots.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/${req.projectId}`);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.fieldname);
  },
});

const upload = multer({ storage: storage });

/* create new project */
export const createproject = async (req, res) => {
  console.log(req);
  try {
    const {
      projectName,
      administrator,
      city,
      deadline,
      description,
      // zoningImagePath,
      // architectualrenderingImagePath,
    } = req.body;
    const newProject = new Project({
      projectName,
      administrator,
      city,
      deadline,
      description,
    });
    const savedProject = await newProject.save();
    // create plot from project
    const arr = req.body.plots;
    const allplots = await createplotfromproject(savedProject._id, arr, res);
    allplots.map((plot) => {
      savedProject.plots.push(plot._id);
    });
    await savedProject.save();
    req.projecId = savedProject._id;
    // Handle file uploads manually
    upload.fields([
      { name: "zoningImage", maxCount: 1 },
      { name: "architecturalRenderingImage", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Save images and update the project with image paths
      if (req.files.zoningImage) {
        savedProject.zoningImagePath = `uploads/${savedProject._id}/zoning`;
      }

      if (req.files.architectualrenderingImage) {
        savedProject.architectualrenderingImagePath = `uploads/${savedProject._id}/architectualrendering`;
      }

      await savedProject.save();
      res.status(201).json(savedProject);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createprojectwithpostman = async (req, res) => {
  try {
    const {
      projectName,
      administrator,
      city,
      deadline,
      description,
      zoningImagePath,
      architectualrenderingImagePath,
    } = req.body;
    const newProject = new Project({
      projectName,
      administrator,
      city,
      deadline,
      description,
      zoningImagePath,
      architectualrenderingImagePath,
    });
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
