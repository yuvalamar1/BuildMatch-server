import { isValidObjectId } from "mongoose";
import Project from "../models/Project.js";
import Administrator from "../models/Administrator.js";
import PreferenceList from "../models/PreferenceList.js";
import sendemail from "./sendingemail.js";

export const getDailyCheck = async (req, res) => {
  try {
    const projecttoalgo = await Project.find({
      isAvailable: true,
      deadline: { $lt: new Date() },
      availablePlaces: 0,
    });

    // Find all projects that need to be updated (set isavailable to false)
    const projects = await Project.find({
      isAvailable: true,
      deadline: { $lt: new Date() },
    });

    if (projects.length === 0 && projecttoalgo.length === 0) {
      return res.status(204).json({ message: "No projects to check" });
    }

    // Update the projects
    await Project.updateMany(
      {
        _id: { $in: projects.map((project) => project._id) },
      },
      { isAvailable: false }
    );

    const projecttoalgoids = projecttoalgo.map((project) =>
      project._id.toString()
    );
    // Send email to the administrator if the project deadline has passed and there are available places
    projects.map(async (project) => {
      if (!projecttoalgoids.includes(project._id.toString())) {
        console.log("send email to administrator");
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
    /////////////////////////////////////////////////////////////////////////
    //format data to the algorithm ({clientid, [plotid, plotid, plotid]})
    const formatteddata = await formatthedata(projecttoalgo);
    console.log(formatteddata);
    /////////////////////////////////////////////////////////////////////////
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const formatthedata = async (projecttoalgo) => {
  let formatteddata = [];
  for (const project of projecttoalgo) {
    const preferencelist = await PreferenceList.find({
      projectId: project._id,
    });
    for (const preference of preferencelist) {
      const preferencearray = new Array(preference.preferences.length);

      preference.preferences.forEach((pref) => {
        preferencearray[pref.preference - 1] = pref.plotid.toString();
      });

      formatteddata.push([preference.clientid.toString(), preferencearray]);
    }
  }

  return formatteddata;
};

export const firstcheck = async () => {
  try {
    await sendemail("yuvalamar15@gmail.com", 1, "898989");
  } catch (err) {
    console.log(err);
  }
};
