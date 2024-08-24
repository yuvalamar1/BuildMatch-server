import { isValidObjectId } from "mongoose";
import Project from "../models/Project.js";
import Administrator from "../models/Administrator.js";
import sendemail from "./sendingemail.js";

export const getDailyCheck = async (req, res) => {
  try {
    const projecttoalgo = await Project.find({
      isAvailable: true,
      deadline: { $lt: new Date() },
      availablePlaces: 0,
    });
    const projects = await Project.findOneAndUpdate(
      {
        isAvailable: true,
        deadline: { $lt: new Date() },
      },
      { isAvailable: false }
    );
    if (projects.length === 0 && projecttoalgo.length === 0) {
      return res.status(204).json({ message: "No projects to check" });
    }
    // Send email to the administrator if the project deadline has passed and there are available places
    projects.map(async (project) => {
      if (!projecttoalgo.includes(project)) {
        const administrator = await Administrator.findById(
          project.administrator
        );
        await sendemail(
          administrator.email,
          2,
          `The ${project.projectName} project deadline has passed and there are available places`
        );
      }
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const firstcheck = async () => {
  try {
    await sendemail("yuvalamar15@gmail.com", "898989");
  } catch (err) {
    console.log(err);
  }
};

export default firstcheck;
