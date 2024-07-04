import Project from "../models/Project.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

/* create new project */
export const createproject = async (req, res) => {
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
