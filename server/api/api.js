import jwt from "jsonwebtoken";
import express from "express";
import Expense from "../model/expense.js";
import { getExchangeRates, currencySymbol } from "../currency.js";

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
router.get(
  "/dashboard/:reqCurrnecySymbol",
  authenticateToken,
  async (req, res) => {
    // returning the total amount spent and the latest 5 Transaction
    await Expense.find(
      { username: req.user.username },
      async (err, transactions) => {
        if (err) {
          res.sendStatus(701);
        } else {
          let total = 0;
          const reqCurrnecySymbol = req.params.reqCurrnecySymbol;
          const exchangeRates = await getExchangeRates();
          if (
            transactions !== null &&
            exchangeRates[reqCurrnecySymbol] !== undefined
          ) {
            transactions.forEach((transaction) => {
              total += transaction.Amount / exchangeRates[transaction.Currency];
            });
            total *= exchangeRates[reqCurrnecySymbol];
          }
          res.send({
            transactions: transactions,
            total: total,
            currencySymbol: currencySymbol,
          });
        }
      }
    );
  }
);

// get Expense Documents
router.get("/getExpense", authenticateToken, async (req, res) => {
  await Expense.find({ username: req.user.username }, (err, expenses) => {
    if (err) {
      res.sendStatus(701);
    } else {
      res.send(expenses);
    }
  });
});

// save Expense Document
router.post("/saveExpense", authenticateToken, async (req, res) => {
  const username = req.user.username;
  const DateTime = new Date(req.body.date + " " + req.body.time);
  const Amount = req.body.Amount;
  const Currency = req.body.Currency;
  const Description = req.body.Description;
  const Category = req.body.Category;

  // creating the Expense Document
  const expense = new Expense({
    username: username,
    DateTime: DateTime,
    Amount: Amount,
    Currency: Currency,
    Description: Description,
    Category: Category,
  });

  // saving the Expense Document
  await expense.save((err, data) => {
    if (err || data === null) {
      res.sendStatus(701);
    } else {
      res.sendStatus(200);
    }
  });
});

// update the Expense Doucment
router.post("/updateExpense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const username = req.user.username;
  const DateTime = new Date(req.body.date + " " + req.body.time);
  const Amount = req.body.Amount;
  const Currency = req.body.Currency;
  const Description = req.body.Description;
  const Category = req.body.Category;

  // creating the Updated Expense Object
  const updatedExpense = {
    username: username,
    DateTime: DateTime,
    Amount: Amount,
    Currency: Currency,
    Description: Description,
    Category: Category,
  };

  // updating the Expense Document
  await Expense.findByIdAndUpdate(id, { $set: updatedExpense }, (err, data) => {
    if (err || data === null) {
      res.sendStatus(701);
    } else {
      res.sendStatus(200);
    }
  });
});

// delete Expense Document
router.get("/deleteExpense/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  await Expense.findByIdAndDelete(id, (err, data) => {
    if (err || data === null) {
      res.sendStatus(701);
    } else {
      res.sendStatus(200);
    }
  });
});

// exporting the router
export default router;
