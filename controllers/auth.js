import bcrypt from "bcrypt";
import Administrator from "../models/Administrator.js";

/* REGISTER USER */
export const registeradministator1 = async (req, res) => {
  console.log("asdasd");
  try {
    const { companyname, phoneNumber, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdministrator = new Administrator({
      companyname,
      phoneNumber,
      email,
      password: passwordHash,
    });
    const savedUser = await newAdministrator.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* REGISTER USER */
export const registeradministator = async (req, res) => {
  try {
    const { companyname, phoneNumber, email, password } = req.body;
    console.log(req.body);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("passwordHash", passwordHash);
    res.status(201).json("goodluck");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerclient = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log("passwordHash", passwordHash);
    res.status(201).json("goodluck");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGIN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    res.status(201).json("goodluck");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
