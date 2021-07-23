<template>
  <b-container>
    <b-button v-b-modal.add-transaction-modal variant="dark"
      >Add Transaction</b-button
    >

    <b-modal
      id="add-transaction-modal"
      title="Add Transaction"
      title-class="modal-title"
      ok-title="Add"
      @ok="addTransaction"
      button-size="sm"
      body-class="modal-body"
      :ok-disabled="!isFormValid"
    >
      <!-- Currency -->
      <b-form-group>
        <b-form-select
          v-model="currency"
          :options="currency_options"
          required
        ></b-form-select>
      </b-form-group>

      <!-- Amount -->
      <b-form-group>
        <b-form-input
          v-model="amount"
          type="number"
          placeholder="Enter Amount"
          required
        ></b-form-input>
      </b-form-group>

      <!-- Date -->
      <b-form-group>
        <b-form-datepicker
          v-model="date"
          placeholder="Select Date"
          required
        ></b-form-datepicker>
      </b-form-group>

      <!-- Time -->
      <b-form-group>
        <b-form-timepicker
          v-model="time"
          locale="en"
          placeholder="Select Time"
          required
        ></b-form-timepicker>
      </b-form-group>

      <!-- Category -->
      <b-form-group>
        <b-form-select
          v-model="category"
          :options="category_options"
          required
        ></b-form-select>
      </b-form-group>

      <!-- Description -->
      <b-form-group>
        <b-form-textarea
          v-model="description"
          placeholder="Enter Description..."
          rows="3"
          max-rows="6"
          required
        ></b-form-textarea>
      </b-form-group>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: "AddTransaction",
  data() {
    return {
      currency: "",
      amount: "",
      currency_options: [
        { value: "", text: "Select Currency", disabled: true },
        { value: "INR", text: "INR" },
        { value: "USD", text: "USD" },
        { value: "GBP", text: "GBP" },
        { value: "EUR", text: "EUR" },
      ],
      date: "",
      time: "",
      category: "",
      category_options: [
        { value: "", text: "Select Category", disabled: true },
        { value: "Home", text: "Home" },
        { value: "Food", text: "Food" },
        { value: "Fuel", text: "Fuel" },
        { value: "Other", text: "Other" },
      ],
      description: "",
    };
  },
  methods: {
    async addTransaction() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          date: this.date,
          time: this.time,
          Amount: this.amount,
          Currency: this.currency,
          Category: this.category,
          Description: this.description,
        }),
      };
      await fetch(`${process.env.VUE_APP_API}/saveExpense`, requestOptions)
        .then((res) => {
          if (res.status !== 200) {
            throw "err";
          }
          console.log("saved");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    isFormValid() {
      return (
        this.currency !== "" &&
        this.amount !== "" &&
        this.date !== "" &&
        this.time !== "" &&
        this.category !== "" &&
        this.description !== ""
      );
    },
  },
};
</script>

<style>
.modal-title {
  font-size: xx-large;
}
.modal-body {
  padding: 10px 15px;
}
</style>
