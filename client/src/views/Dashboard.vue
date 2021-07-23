<template>
  <b-container class="text-center">
    <b-row class="justify-content-center mb-3">
      <TotalAmount
        :currencySymbols="currencySymbols"
        :totalAmount="totalAmount"
        :exchangeRates="exchangeRates"
      />
    </b-row>
    <b-row>
      <span class="w-100">
        <h3>Latest Transaction:</h3>
        <hr />
      </span>
      <b-container class="latest-transaction-table">
        <b-table striped :items="getTransactions" :fields="fields"></b-table>
      </b-container>
    </b-row>
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
      totalAmount: 0,
      transactions: [],
      currencySymbols: [],
      exchangeRates: {},
      fields: ["Currency", "Amount", "Category", "Date", "Time"],
    };
  },
  methods: {
    getDashboardData() {
      const requestOptions = {
        method: "GET",
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      fetch(`${process.env.VUE_APP_API}/dashboard/INR`, requestOptions)
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
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

<style scoped>
.latest-transaction-table {
  overflow: scroll;
}
.latest-transaction-table::-webkit-scrollbar {
  display: none;
}
</style>
