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
    const { companyname: companyName, phoneNumber, email, password } = req.body;
    console.log(req.body);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newAdministrator = new Administrator({
      companyName,
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

// refacrot this function to check if the user is already in the database
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
// לסדר את הפונקציה הזו כך שתקבל את המשתנים מהקליינט ותחזיר תשובה תקינה
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email" + email + "password" + password);
    res.status(201).json("goodluck");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
