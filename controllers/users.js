import Client from "../models/Client.js";
import Administrator from "../models/Administrator.js";
import bcrypt from "bcrypt";
import express from "express";

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

export const updateuser = async (req, res) => {
  try {
    const { userid, usertype, userdata } = req.body;
    let previususer = null;
    if (usertype === "client") {
      let user = null;
      previususer = await Client.findOne({ _id: userid });
      if (userdata.password === previususer.password) {
        user = await Client.findOneAndUpdate({ _id: userid }, userdata, {
          new: true,
        });
      }
      if (userdata.password !== previususer.password) {
        const salt = await bcrypt.genSalt();
        userdata.password = await bcrypt.hash(userdata.password, salt);
        user = await Client.findOneAndUpdate({ _id: userid }, userdata, {
          new: true,
        });
      }
      res.status(200).json(user);
    }
    if (usertype === "administrator") {
      let user = null;
      previususer = await Administrator.findOne({ _id: userid });
      if (userdata.password === previususer.password) {
        user = await Administrator.findOneAndUpdate({ _id: userid }, userdata, {
          new: true,
        });
      }
      if (userdata.password !== previususer.password) {
        const salt = await bcrypt.genSalt();
        userdata.password = await bcrypt.hash(userdata.password, salt);
        user = await Administrator.findOneAndUpdate({ _id: userid }, userdata, {
          new: true,
        });
      }
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
