<template>
  <b-container class="text-center">
    <template v-if="loading">
      <b-spinner type="grow" label="Loading..."></b-spinner>
    </template>
    <template v-else>
      <b-row>
        <TotalAmount
          :currencySymbols="currencySymbols"
          :totalAmount="totalAmount"
          :exchangeRates="exchangeRates"
        />
      </b-row>
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
