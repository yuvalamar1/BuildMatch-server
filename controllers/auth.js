import bcrypt from "bcrypt";
import Administrator from "../models/Administrator.js";
import Client from "../models/Client.js";

/* REGISTER USER */
export const registeradministator = async (req, res) => {
  try {
    const { companyName, phoneNumber, email, password } = req.body;
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
    const newClient = new Client({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    console.log("newClient", newClient);
    const savedUser = await newClient.save();
    console.log("passwordHash", passwordHash);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGIN USER */
// לסדר את הפונקציה הזו כך שתקבל את המשתנים מהקליינט ותחזיר תשובה תקינה
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const AdminUser = await Administrator.findOne({ email });
    const clientUser = await Client.findOne({ email });
    if (!AdminUser && !clientUser) {
      return res.status(400).json("User not found");
    }

    let validPassword = false;

    if (AdminUser) {
      validPassword = await bcrypt.compare(password, AdminUser.password);
    }

    if (!validPassword && clientUser) {
      validPassword = await bcrypt.compare(password, clientUser.password);
    }

    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    res.status(201).json("login successfull");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
