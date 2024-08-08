import Project from "../models/Project.js";
import sendemail from "./sendingemail.js";

// export const getDailyCheck = async (req, res) => {
//   try {
//     const projects = await Project.find();
//     res.status(200).json(projects);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// }

const firstcheck = async () => {
  try {
    await sendemail("yuvalamar15@gmail.com", "898989");
  } catch (err) {
    console.log(err);
  }
};

export default firstcheck;
