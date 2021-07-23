import jwt from "jsonwebtoken";
import express from "express";
import Expense from "../model/expense.js";
import { getExchangeRates, getCurrencySymbols } from "../currency.js";
import { isNull } from "util";

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
          let totalAmount = 0;
          const reqCurrnecySymbol = req.params.reqCurrnecySymbol;
          // const exchangeRates = await getExchangeRates();
          const exchangeRates = {
            AED: 3.673,
            AFN: 79.499999,
            ALL: 103.841764,
            AMD: 488.291824,
            ANG: 1.797003,
            AOA: 639.873,
            ARS: 96.413188,
            AUD: 1.35567,
            AWG: 1.8,
            AZN: 1.700805,
            BAM: 1.660509,
            BBD: 2,
            BDT: 84.889672,
            BGN: 1.6612,
            BHD: 0.37695,
            BIF: 1983.737811,
            BMD: 1,
            BND: 1.361815,
            BOB: 6.91268,
            BRL: 5.2015,
            BSD: 1,
            BTC: 0.000030707024,
            BTN: 74.442116,
            BWP: 11.055992,
            BYN: 2.515006,
            BZD: 2.017914,
            CAD: 1.257081,
            CDF: 1990.25597,
            CHF: 0.919989,
            CLF: 0.027321,
            CLP: 753.878506,
            CNH: 6.474355,
            CNY: 6.4718,
            COP: 3862.140978,
            CRC: 620.708412,
            CUC: 1,
            CUP: 25.75,
            CVE: 93.905,
            CZK: 21.7837,
            DJF: 178.223057,
            DKK: 6.319485,
            DOP: 57.168334,
            DZD: 134.621275,
            EGP: 15.6707,
            ERN: 15.004625,
            ETB: 44.351997,
            EUR: 0.849631,
            FJD: 2.08165,
            FKP: 0.726687,
            GBP: 0.726687,
            GEL: 3.11,
            GGP: 0.726687,
            GHS: 5.961625,
            GIP: 0.726687,
            GMD: 51.15,
            GNF: 9791.69102,
            GTQ: 7.758562,
            GYD: 209.449425,
            HKD: 7.77075,
            HNL: 23.780618,
            HRK: 6.3981,
            HTG: 94.606229,
            HUF: 303.969813,
            IDR: 14482.9,
            ILS: 3.2725,
            IMP: 0.726687,
            INR: 74.484839,
            IQD: 1460.628112,
            IRR: 42127.499938,
            ISK: 126.08,
            JEP: 0.726687,
            JMD: 154.532378,
            JOD: 0.709,
            JPY: 110.26807895,
            KES: 108.32,
            KGS: 84.582648,
            KHR: 4076.597926,
            KMF: 418.849764,
            KPW: 900,
            KRW: 1149.393951,
            KWD: 0.300591,
            KYD: 0.834317,
            KZT: 426.820158,
            LAK: 9553.60271,
            LBP: 1513.690085,
            LKR: 199.722721,
            LRD: 171.649999,
            LSL: 14.576219,
            LYD: 4.516874,
            MAD: 8.966762,
            MDL: 18.08981,
            MGA: 3798.793992,
            MKD: 52.311415,
            MMK: 1647.843006,
            MNT: 2848.112285,
            MOP: 8.014009,
            MRO: 356.999828,
            MRU: 36.170601,
            MUR: 42.549998,
            MVR: 15.4,
            MWK: 810.439449,
            MXN: 20.096293,
            MYR: 4.2235,
            MZN: 63.648993,
            NAD: 14.55,
            NGN: 411.96,
            NIO: 35.149088,
            NOK: 8.849823,
            NPR: 119.118647,
            NZD: 1.433353,
            OMR: 0.384978,
            PAB: 1,
            PEN: 3.949909,
            PGK: 3.515149,
            PHP: 50.326833,
            PKR: 161.0296,
            PLN: 3.878908,
            PYG: 6896.97411,
            QAR: 3.641,
            RON: 4.1828,
            RSD: 99.847171,
            RUB: 73.7044,
            RWF: 998.643127,
            SAR: 3.750675,
            SBD: 8.048354,
            SCR: 15.189282,
            SDG: 446.5,
            SEK: 8.680747,
            SGD: 1.35969,
            SHP: 0.726687,
            SLL: 10256.449779,
            SOS: 579.105564,
            SRD: 21.22,
            SSP: 130.26,
            STD: 20599.812016,
            STN: 21.15,
            SVC: 8.760029,
            SYP: 1257.428581,
            SZL: 14.576219,
            THB: 32.927,
            TJS: 11.417656,
            TMT: 3.5,
            TND: 2.7835,
            TOP: 2.261735,
            TRY: 8.5655,
            TTD: 6.79331,
            TWD: 28.0305,
            TZS: 2321.58032,
            UAH: 27.216878,
            UGX: 3551.984035,
            USD: 1,
            UYU: 43.826899,
            UZS: 10610.610033,
            VES: 3705881.101852,
            VND: 23054.379854,
            VUV: 110.118851,
            WST: 2.551678,
            XAF: 557.321701,
            XAG: 0.03944387,
            XAU: 0.0005546,
            XCD: 2.70255,
            XDR: 0.703896,
            XOF: 557.321701,
            XPD: 0.00036658,
            XPF: 101.388002,
            XPT: 0.00091182,
            YER: 250.150007,
            ZAR: 14.718711,
            ZMW: 22.149679,
            ZWL: 322,
          };
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
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const exchangeRates = {
    AED: 3.673,
    AFN: 79.499999,
    ALL: 103.841764,
    AMD: 488.291824,
    ANG: 1.797003,
    AOA: 639.873,
    ARS: 96.413188,
    AUD: 1.35567,
    AWG: 1.8,
    AZN: 1.700805,
    BAM: 1.660509,
    BBD: 2,
    BDT: 84.889672,
    BGN: 1.6612,
    BHD: 0.37695,
    BIF: 1983.737811,
    BMD: 1,
    BND: 1.361815,
    BOB: 6.91268,
    BRL: 5.2015,
    BSD: 1,
    BTC: 0.000030707024,
    BTN: 74.442116,
    BWP: 11.055992,
    BYN: 2.515006,
    BZD: 2.017914,
    CAD: 1.257081,
    CDF: 1990.25597,
    CHF: 0.919989,
    CLF: 0.027321,
    CLP: 753.878506,
    CNH: 6.474355,
    CNY: 6.4718,
    COP: 3862.140978,
    CRC: 620.708412,
    CUC: 1,
    CUP: 25.75,
    CVE: 93.905,
    CZK: 21.7837,
    DJF: 178.223057,
    DKK: 6.319485,
    DOP: 57.168334,
    DZD: 134.621275,
    EGP: 15.6707,
    ERN: 15.004625,
    ETB: 44.351997,
    EUR: 0.849631,
    FJD: 2.08165,
    FKP: 0.726687,
    GBP: 0.726687,
    GEL: 3.11,
    GGP: 0.726687,
    GHS: 5.961625,
    GIP: 0.726687,
    GMD: 51.15,
    GNF: 9791.69102,
    GTQ: 7.758562,
    GYD: 209.449425,
    HKD: 7.77075,
    HNL: 23.780618,
    HRK: 6.3981,
    HTG: 94.606229,
    HUF: 303.969813,
    IDR: 14482.9,
    ILS: 3.2725,
    IMP: 0.726687,
    INR: 74.484839,
    IQD: 1460.628112,
    IRR: 42127.499938,
    ISK: 126.08,
    JEP: 0.726687,
    JMD: 154.532378,
    JOD: 0.709,
    JPY: 110.26807895,
    KES: 108.32,
    KGS: 84.582648,
    KHR: 4076.597926,
    KMF: 418.849764,
    KPW: 900,
    KRW: 1149.393951,
    KWD: 0.300591,
    KYD: 0.834317,
    KZT: 426.820158,
    LAK: 9553.60271,
    LBP: 1513.690085,
    LKR: 199.722721,
    LRD: 171.649999,
    LSL: 14.576219,
    LYD: 4.516874,
    MAD: 8.966762,
    MDL: 18.08981,
    MGA: 3798.793992,
    MKD: 52.311415,
    MMK: 1647.843006,
    MNT: 2848.112285,
    MOP: 8.014009,
    MRO: 356.999828,
    MRU: 36.170601,
    MUR: 42.549998,
    MVR: 15.4,
    MWK: 810.439449,
    MXN: 20.096293,
    MYR: 4.2235,
    MZN: 63.648993,
    NAD: 14.55,
    NGN: 411.96,
    NIO: 35.149088,
    NOK: 8.849823,
    NPR: 119.118647,
    NZD: 1.433353,
    OMR: 0.384978,
    PAB: 1,
    PEN: 3.949909,
    PGK: 3.515149,
    PHP: 50.326833,
    PKR: 161.0296,
    PLN: 3.878908,
    PYG: 6896.97411,
    QAR: 3.641,
    RON: 4.1828,
    RSD: 99.847171,
    RUB: 73.7044,
    RWF: 998.643127,
    SAR: 3.750675,
    SBD: 8.048354,
    SCR: 15.189282,
    SDG: 446.5,
    SEK: 8.680747,
    SGD: 1.35969,
    SHP: 0.726687,
    SLL: 10256.449779,
    SOS: 579.105564,
    SRD: 21.22,
    SSP: 130.26,
    STD: 20599.812016,
    STN: 21.15,
    SVC: 8.760029,
    SYP: 1257.428581,
    SZL: 14.576219,
    THB: 32.927,
    TJS: 11.417656,
    TMT: 3.5,
    TND: 2.7835,
    TOP: 2.261735,
    TRY: 8.5655,
    TTD: 6.79331,
    TWD: 28.0305,
    TZS: 2321.58032,
    UAH: 27.216878,
    UGX: 3551.984035,
    USD: 1,
    UYU: 43.826899,
    UZS: 10610.610033,
    VES: 3705881.101852,
    VND: 23054.379854,
    VUV: 110.118851,
    WST: 2.551678,
    XAF: 557.321701,
    XAG: 0.03944387,
    XAU: 0.0005546,
    XCD: 2.70255,
    XDR: 0.703896,
    XOF: 557.321701,
    XPD: 0.00036658,
    XPF: 101.388002,
    XPT: 0.00091182,
    YER: 250.150007,
    ZAR: 14.718711,
    ZMW: 22.149679,
    ZWL: 322,
  };
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
              week: { $week: "$DateTime" },
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
      const { transactionByWeek, transactionByCategory } = data[0];
      const categoryMoney = {};
      const weekMoney = {};
      transactionByCategory.forEach((item) => {
        let total = 0;
        item.transactions.forEach((transaction) => {
          total += transaction.Amount / exchangeRates[transaction.Currency];
        });
        categoryMoney[item._id] = total;
      });
      transactionByWeek.forEach((item) => {
        let total = 0;
        item.transactions.forEach((transaction) => {
          total += transaction.Amount / exchangeRates[transaction.Currency];
        });
        weekMoney[item._id.week] = total.toFixed(2);
      });
      res.send({
        categoryMoney,
        weekMoney,
        range: [startDate.toDateString(), endDate.toDateString()],
      });
    });
});

// exporting the router
export default router;
