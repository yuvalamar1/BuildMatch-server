import Client from "../models/Client.js";
import Administrator from "../models/Administrator.js";
import bcrypt from "bcrypt";

export const getuser = async (req, res) => {
  try {
    const { userid, usertype } = req.query;
    if (usertype === "client") {
      const user = await Client.findOne({ _id: userid });
      res.status(200).json(user);
    }
    if (usertype === "administrator") {
      const user = await Administrator.findOne({
        _id: userid,
      });
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
