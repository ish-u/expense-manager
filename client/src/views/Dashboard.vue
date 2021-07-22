<template>
  <b-container fluid class="text-center">
    <b-row class="w-100 text-center justify-content-center mb-5">
      <h1 class="display-4">Dashboard</h1>
    </b-row>
    <b-row>
      <b-col xl="3" lg="3" md="4" sm="12">
        <h2>Money Spent : INR {{ total }}</h2>
      </b-col>
      <b-col>
        <b-table striped :items="getTransactions" :fields="fields"></b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      total: 0,
      transactions: [],
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
          this.total = resJSON.total;
          this.transactions = resJSON.transactions;
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
