<template>
  <b-container class="text-center">
    <template v-if="loading">
      <b-spinner type="grow" label="Loading..."></b-spinner>
    </template>
    <template v-else>
      <!-- TotalAmount component -->
      <b-row>
        <TotalAmount
          :currencySymbols="currencySymbols"
          :totalAmount="totalAmount"
          :exchangeRates="exchangeRates"
        />
      </b-row>

      <!-- Latest 5 Transactions -->
      <b-row>
        <span class="w-100">
          <h5>Latest Transactions:</h5>
          <hr />
        </span>
        <b-container class="latest-transaction-table">
          <b-table
            responsive
            striped
            :items="getTransactions"
            :fields="fields"
          ></b-table>
        </b-container>
      </b-row>

      <!-- Go To Expense View -->
      <b-row class="d-flex justify-content-center">
        <b-button @click="$router.push({ name: 'Expense' })">
          See All
        </b-button>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import TotalAmount from "../components/TotalAmount.vue";
export default {
  name: "Dashboard",
  components: {
    TotalAmount,
  },
  data() {
    return {
      loading: true,
      totalAmount: 0,
      transactions: [],
      currencySymbols: [],
      exchangeRates: {},
      fields: ["Currency", "Amount", "Category", "Date", "Time"],
    };
  },
  methods: {
    // getting the Dashboard Data - Total Amount Spent, Latest 5 Transactions
    async getDashboardData() {
      const requestOptions = {
        method: "GET",
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(`${process.env.VUE_APP_API}/dashboard/INR`, requestOptions)
        .then((res) => {
          if (res.status !== 200) {
            throw "err";
          }
          return res.json();
        })
        .then((resJSON) => {
          this.totalAmount = resJSON.totalAmount;
          this.transactions = resJSON.transactions;
          this.transactions.length = 5;
          this.currencySymbols = resJSON.currencySymbols;
          this.exchangeRates = resJSON.exchangeRates;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    // adding the Date, Time key to 'transaction' objects of 'transactions' array
    getTransactions: function () {
      this.transactions.forEach((transaction) => {
        transaction.Date = new Date(transaction.DateTime).toDateString();
        transaction.Time = new Date(transaction.DateTime).toLocaleTimeString();
      });
      return this.transactions;
    },
  },
  mounted() {
    this.getDashboardData();
  },
};
</script>
