import jwt from "jsonwebtoken";
import express from "express";
import Expense from "../model/expense.js";
import { getExchangeRates, getCurrencySymbols } from "../currency.js";
import datefns from "date-fns";

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

// dashboard route
router.get(
  "/dashboard/:reqCurrnecySymbol",
  authenticateToken,
  async (req, res) => {
    const reqCurrnecySymbol = req.params.reqCurrnecySymbol;
    // returning the total amount spent and the latest 5 Transaction
    await Expense.find(
      { username: req.user.username },
      async (err, transactions) => {
        if (err) {
          res.sendStatus(701);
        } else {
          let totalAmount = 0;
          // getting the Exchange rates
          const exchangeRates = await getExchangeRates();
          if (
            transactions !== null &&
            exchangeRates[reqCurrnecySymbol] !== undefined
          ) {
            transactions.forEach((transaction) => {
              totalAmount +=
                transaction.Amount / exchangeRates[transaction.Currency];
            });
            totalAmount *= exchangeRates[reqCurrnecySymbol];
          }
          res.send({
            transactions: transactions,
            totalAmount: totalAmount,
            currencySymbols: getCurrencySymbols(),
            exchangeRates: exchangeRates,
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

// get the Report
router.get("/getReport", authenticateToken, async (req, res) => {
  // getting the starting and ending Dates, Week Number of Current Month
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const exchangeRates = await getExchangeRates();
  const startDateWeek = datefns.getISOWeek(startDate);
  const endDateWeek = datefns.getISOWeek(endDate);

  // refer to MongoDB and Mongoose aggregate and facet docs
  // transactionByCategory - grouping the Documents by "Category"
  // transactionByWeek - grouping the Documents by "Week Number of Year"
  await Expense.aggregate()
    .facet({
      transactionByCategory: [
        {
          $match: {
            username: req.user.username,
            DateTime: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$Category",
            transactions: {
              $push: "$$ROOT",
            },
          },
        },
      ],
      transactionByWeek: [
        {
          $match: {
            username: req.user.username,
            DateTime: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              week: { $isoWeek: "$DateTime" },
            },
            transactions: {
              $push: "$$ROOT",
            },
          },
        },
      ],
    })
    .exec((err, data) => {
      if (err) {
        res.sendStatus(701);
      } else if (data == null) {
        res.sendStatus(202);
      }
      // objects returend by MongoDB
      const { transactionByWeek, transactionByCategory } = data[0];

      // creating the categoryMoney Object
      const categoryMoney = {};
      transactionByCategory.forEach((item) => {
        let total = 0;
        item.transactions.forEach((transaction) => {
          total += transaction.Amount / exchangeRates[transaction.Currency];
        });
        categoryMoney[item._id] = total;
      });

      // creating the weekMoney Object
      const weekMoney = {};
      transactionByWeek.forEach((item) => {
        let total = 0;
        item.transactions.forEach((transaction) => {
          total += transaction.Amount / exchangeRates[transaction.Currency];
        });
        weekMoney[item._id.week] = total.toFixed(2);
      });
      for (var i = startDateWeek; i <= endDateWeek; i++) {
        if (weekMoney[i] === undefined) {
          weekMoney[i] = 0;
        }
      }

      res.send({
        categoryMoney,
        weekMoney,
        range: [startDate.toDateString(), endDate.toDateString()],
      });
    });
});

// exporting the router
export default router;
