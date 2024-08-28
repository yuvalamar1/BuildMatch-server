import { isValidObjectId } from "mongoose";
import { spawn } from "child_process";
import Project from "../models/Project.js";
import Administrator from "../models/Administrator.js";
import PreferenceList from "../models/PreferenceList.js";
import Client from "../models/Client.js";
import Plot from "../models/Plot.js";
import sendemail from "./sendingemail.js";

export const getDailyCheck = async () => {
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
      return console.log("No projects to check");
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
    //format data to the algorithm ([clientid, [plotid, plotid, plotid]])
    const formatteddata = await formatthedata(projecttoalgo);
    ///////////////////////////////////////////////////////////////////////
    // Execute the Python script
    executePythonScript(formatteddata)
      .then((result) => {
        sendemailtowinners(result);
      })
      .catch((error) => {
        console.error("Error executing Python script:", error);
      });

    /////////////////////////////////////////////////////////////////////////
  } catch (err) {
    console.log(err);
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

const executePythonScript = async (formatteddata) => {
  return new Promise((resolve, reject) => {
    // Spawn the Python process
    const pythonProcess = spawn("python", ["./services/thirdchance.py"]);

    // Pass the formatted data to the Python process via stdin
    pythonProcess.stdin.write(JSON.stringify(formatteddata));
    pythonProcess.stdin.end();

    // Capture the output from the Python script
    let result = "";
    pythonProcess.stdout.on("data", (data) => {
      result += data.toString();
    });

    // Handle errors
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
      reject(data.toString());
    });

    // Resolve the promise with the result when the process exits
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(JSON.parse(result));
      } else {
        reject(`Process exited with code ${code}`);
      }
    });
  });
};

const sendemailtowinners = async (result) => {
  const entries = Object.entries(result);
  for (const [clientid, plotid] of entries) {
    const client = await Client.findById(clientid);
    const plot = await Plot.findById(plotid);
    const project = await Project.findById(plot.projectId);
    await sendemail(
      client.email,
      3,
      `Congratulations! You have been selected for the ${plot.plotNumber} plot in the ${project.projectName} project`
    );
  }
};

export const firstcheck = async () => {
  try {
    await sendemail("yuvalamar15@gmail.com", 1, "898989");
  } catch (err) {
    console.log(err);
  }
};
