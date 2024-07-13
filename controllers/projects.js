import Project from "../models/Project.js";
import multer from "multer";
import { createplotfromproject } from "./plots.js";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/temp`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

/* create new project */
export const createproject = [
  upload.fields([
    { name: "zoningImage", maxCount: 1 },
    { name: "architecturalRenderingImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { projectName, administrator, city, deadline, description, plots } =
        req.body;
      const date = new Date(deadline);
      date.setUTCHours(0, 0, 0, 0);
      const newProject = new Project({
        projectName,
        administrator,
        city,
        deadline: date,
        description,
      });
      const savedProject = await newProject.save();
      // create plot from project
      const arr = JSON.parse(plots);
      const allplots = await createplotfromproject(savedProject._id, arr, res);
      allplots.map((plot) => {
        savedProject.plots.push(plot._id);
      });
      const projectDir = `uploads/${savedProject._id}`;
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      if (req.files.zoningImage) {
        const tempPath = req.files.zoningImage[0].path;
        const targetPath = `${projectDir}/zoning.${path.extname(tempPath)}`;
        fs.renameSync(tempPath, targetPath);
        savedProject.zoningImagePath = targetPath;
      }
      if (req.files.architecturalRenderingImage) {
        const tempPath = req.files.architecturalRenderingImage[0].path;
        const targetPath = `${projectDir}/architecturalRendering.${path.extname(
          tempPath
        )}`;
        fs.renameSync(tempPath, targetPath);
        savedProject.architectualrenderingImagePath = targetPath;
      }
      //       await savedProject.save();
      //       req.projecId = savedProject._id;
      //       upload.fields([
      //         { name: "zoningImage", maxCount: 1 },
      //         { name: "architecturalRenderingImage", maxCount: 1 },
      //       ])(req, res, async (err) => {
      //         if (err) {
      //           return res.status(500).json({ error: err.message });
      //         }
      // s
      //         if (req.files.zoningImage) {
      //           savedProject.zoningImagePath = `uploads/${savedProject._id}/zoning`;
      //         }

      //         if (req.files.architectualrenderingImage) {
      //           savedProject.architectualrenderingImagePath = `uploads/${savedProject._id}/architectualrendering`;
      //         }

      //         await savedProject.save();
      //         res.status(201).json(savedProject);
      //       });
      await savedProject.save();
      res.status(201).json(savedProject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

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
