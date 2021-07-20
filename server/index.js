import app from "./server.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// Port
const PORT = process.env.PORT || 8000;

// Connect to DB
const uri = process.env.DB_CONNECTION;
const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose
  .connect(uri, connectionParams)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Listening for Requests
app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
