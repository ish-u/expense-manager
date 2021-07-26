<template>
  <b-container fluid class="p-3 text-center">
    <template v-if="loading">
      <b-spinner type="grow" label="Loading..."></b-spinner>
    </template>
    <template v-else>
      <b-row>
        <b-col xl="3" lg="3" md="12" sm="12">
          <b-container class="d-flex flex-column align-items-center">
            <!-- Add Transactions Component -->
            <b-row class="text-center">
              <AddTransaction v-on:update="getTransactions" />
            </b-row>

            <!-- Sort By Category Section -->
            <b-row class="sort-by-section mt-3">
              <b-col cols="12">
                <b> Sort By: </b>
              </b-col>
              <b-col
                xl="12"
                lg="12"
                md="3"
                sm="3"
                xs="3"
                class="mb-2"
                v-for="category in categories"
                :key="category.name"
              >
                <b-form-checkbox
                  :name="category.name"
                  v-model="category.status"
                  value="accepted"
                  unchecked-value="not_accepted"
                  class="text-left"
                >
                  {{ category.name }}
                </b-form-checkbox>
              </b-col>
            </b-row>
          </b-container>
        </b-col>

        <!-- Transactions List -->
        <b-col xl="9" lg="9" md="12" sm="6" class="text-center">
          <h2>Transactions</h2>
          <br />
          <!-- Table Update Loading Spinner -->
          <b-row class="d-flex justify-content-center" v-if="transactionUpdate">
            <b-spinner type="grow" label="Loading..."></b-spinner>
          </b-row>

          <b-table
            class="transaction-table"
            v-else
            striped
            hover
            responsive=""
            :items="getItems"
            :fields="fields"
            @row-clicked="editTransaction"
          ></b-table>
        </b-col>
      </b-row>

      <!-- EditTransaction Component -->
      <EditTransaction
        v-if="showEditTransaction"
        v-on:update="getTransactions"
        :transaction="transaction"
      />
    </template>
  </b-container>
</template>

<script>
import AddTransaction from "../components/AddTransaction.vue";
import EditTransaction from "../components/EditTransaction.vue";
export default {
  name: "Expense",
  components: {
    AddTransaction,
    EditTransaction,
  },
  data() {
    return {
      loading: true,
      transactionUpdate: true,
      categories: [
        { name: "Home", status: "not_accepted" },
        { name: "Food", status: "not_accepted" },
        { name: "Fuel", status: "not_accepted" },
        { name: "Other", status: "not_accepted" },
      ],
      fields: ["Currency", "Amount", "Category", "Date", "Time"],
      items: [],
      transaction: {},
      showEditTransaction: false,
    };
  },
  methods: {
    // get the all Transactions
    getTransactions() {
      this.transactionUpdate = true;
      this.showEditTransaction = false;
      this.transaction = {};
      const requestOptions = {
        method: "GET",
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      fetch(`${process.env.VUE_APP_API}/getExpense`, requestOptions)
        .then((res) => {
          if (res.status !== 200) {
            throw "err";
          }
          return res.json();
        })
        .then((resJSON) => {
          this.items = resJSON;
          this.items.reverse();
          this.loading = false;
          this.transactionUpdate = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editTransaction(item) {
      this.transaction = item;
      this.showEditTransaction = true;
    },
  },
  computed: {
    // filtering the Table Data by Categories and adding Date, Time values
    getItems: function () {
      this.items.forEach((item) => {
        item.Date = new Date(item.DateTime).toDateString();
        item.Time = new Date(item.DateTime).toLocaleTimeString();
      });
      const sortByCategories = this.getSortByCategories;
      if (sortByCategories.length !== 0) {
        return this.items.filter(
          (item) => sortByCategories.includes(item.Category) === true
        );
      }
      return this.items;
    },
    // get the Selected Categories
    getSortByCategories: function () {
      var categories = [];
      this.categories.forEach((category) => {
        if (category.status === "accepted") {
          categories.push(category.name);
        }
      });
      return categories;
    },
  },
  created() {
    this.getTransactions();
  },
};
</script>

<style scoped>
.transaction-table :hover {
  cursor: pointer;
}
.sort-by-section {
  flex-direction: column;
}

@media (max-width: 786px) and (min-width: 576px) {
  .sort-by-section {
    flex-direction: row;
  }
}
</style>
