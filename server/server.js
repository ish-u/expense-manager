import express from "express";
import cors from "cors";

// API routes

// Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// binding api from "API" folder to express app
app.get("/", (req, res) => {
  res.send("OK");
});

// for 404
app.use("*", (req, res) => res.json({ error: "error" }));

// exporting the App
export default app;
