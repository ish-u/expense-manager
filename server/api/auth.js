import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import User from "../model/user.js";

// Express Router
const router = express.Router();

// sign in route
router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // checking if the user exists or not
  await User.findOne({ username: username }, async (err, user) => {
    if (err || user === null) {
      res.sendStatus(701);
    } else {
      // checking if the password is valid
      const valid = await bcrypt.compare(password, user.password);

      // sending the access token to the user
      if (valid) {
        res.send({
          token: jwt.sign(
            { username: user.username },
            process.env.ACCESS_TOKEN_SECRET
          ),
        });
      } else {
        res.sendStatus(701);
      }
    }
  });
});

// sign up route
router.post("/signup", async (req, res) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // checking if the user already exists
  await User.findOne({ username: username }, async (err, data) => {
    if (err || data !== null) {
      res.sendStatus(701);
    } else {
      // creating encyrpted password
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);

      // Creating a new User Document
      const user = new User({
        name: name,
        username: username,
        password: encryptedPassword,
        email: email,
      });

      // saving the new User Document
      await user.save((err, data) => {
        if (err) {
          res.sendStatus(701);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// exporting the router
export default router;
