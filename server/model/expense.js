import mongoose from "mongoose";

const reqStr = {
  type: String,
  required: true,
};

const reqDate = {
  type: Date,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

// User Schema
const ExpenseSchema = new mongoose.Schema({
  username: reqStr,
  DateTime: reqDate,
  Amount: reqNumber,
  Currency: reqStr,
  Description: String,
  Category: reqStr,
});

export default mongoose.model("Expense", ExpenseSchema);
