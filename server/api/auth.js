import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

// Express Router
const router = express.Router();

// sign in route
router.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = { name: username };

  // checking if the password is valid
  const valid = 1;

  // sending the access token to the user
  if (valid) {
    res.send({
      token: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
    });
  } else {
    res.sendStatus(701);
  }
});

// sign up route

// exporting the router
export default router;
