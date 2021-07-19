import axios from "axios";
import jwt from "jsonwebtoken";
import express from "express";

// Express Router
const router = express.Router();

// authenticate middleware
const authenticateToken = (req, res, next) => {
  // getting the Access Token
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // if the authHeader is null send 401
  if (token === null) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(401);
      req.user = user;
      next();
    });
  }
};

// index route
router.get("/", authenticateToken, (req, res) => {
  res.send({ user: req.user });
});

// exporting the router
export default router;
