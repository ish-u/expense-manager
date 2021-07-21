<template>
  <b-container fluid>
    <b-row class="justify-content-center mb-3" cols="12">
      <h1 class="display-3">Transaction</h1>
    </b-row>
    <b-row>
      <b-col xl="3" lg="3" md="4" sm="12">
        <b-container>
          <b-row class="mx-5 mb-3">
            <AddTransaction />
          </b-row>
          <b-row class="mx-5 mt-1">
            <b-container>
              <b> Sort By:</b>
            </b-container>
          </b-row>
          <b-row class="mx-5 mt-1">
            <b-container v-for="category in categories" :key="category.name">
              <b-form-checkbox
                :name="category.name"
                v-model="category.status"
                value="accepted"
                unchecked-value="not_accepted"
              >
                {{ category.name }}
              </b-form-checkbox>
            </b-container>
          </b-row>
        </b-container>
      </b-col>
      <b-col xl="9" lg="9" md="8" sm="12" class="text-center">
        <b-table
          striped
          hover
          primary-key="index"
          :items="getItems()"
          :fields="fields"
          @row-clicked="editTransaction"
        ></b-table>
      </b-col>
    </b-row>

    <EditTransaction :transaction="transaction" v-if="showEditTransaction" />
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
      categories: [
        { name: "Home", status: "not_accepted" },
        { name: "Food", status: "not_accepted" },
        { name: "Fuel", status: "not_accepted" },
        { name: "Other", status: "not_accepted" },
      ],
      fields: ["#", "Currency", "Amount", "Category", "Date"],
      items: [],
      transaction: {},
      showEditTransaction: false,
    };
  },
  methods: {
    getTransactions() {
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
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getItems() {
      this.items.forEach((item, index) => {
        item.Date = new Date(item.DateTime).toDateString();
        item["#"] = index + 1;
      });
      return this.items;
    },
    editTransaction(item) {
      this.transaction = item;
      this.showEditTransaction = true;
    },
  },
  mounted() {
    this.getTransactions();
    this.$root.$on("bv::modal::hide", (bvEvent, modalId) => {
      console.log(bvEvent);
      if (bvEvent.type === "hide" && modalId === "edit-transaction-modal") {
        this.showEditTransaction = false;
        this.transaction = {};
      }
      this.getTransactions();
    });
  },
};
</script>

<style></style>
