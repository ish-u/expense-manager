<template>
  <b-container fluid class="p-3">
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
          :items="getItems"
          :fields="fields"
          @row-clicked="editTransaction"
        ></b-table>
      </b-col>
    </b-row>
    <!-- EditTransaction Component -->
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
      fields: ["Currency", "Amount", "Category", "Date", "Time"],
      items: [],
      transaction: {},
      showEditTransaction: false,
    };
  },
  methods: {
    async getTransactions() {
      const requestOptions = {
        method: "GET",
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(`${process.env.VUE_APP_API}/getExpense`, requestOptions)
        .then((res) => {
          if (res.status !== 200) {
            throw "err";
          }
          return res.json();
        })
        .then((resJSON) => {
          this.items = resJSON;
          this.items.reverse();
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
    this.$root.$on("bv::modal::hide", async (bvEvent, modalId) => {
      console.log(bvEvent, modalId);
      await this.getTransactions();
      if (bvEvent.type === "hide" && modalId === "edit-transaction-modal") {
        this.showEditTransaction = false;
        this.transaction = {};
        await this.getTransactions();
      }
    });
  },
};
</script>

<style scoped>
tbody:hover {
  cursor: pointer;
}
</style>
