import express from "express";
import cors from "cors";

// API routes
import auth from "./api/auth.js";
import api from "./api/api.js";

// Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// binding api from "API" folder to express app
app.use("/api", auth, cors());
app.use("/api", api, cors());

// for 404
app.use("*", (req, res) => res.json({ error: "error" }));

// exporting the App
export default app;
