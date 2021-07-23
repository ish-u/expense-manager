<template>
  <b-container class="w-75 text-center total-amount-container">
    <b-row>
      <b-col>
        <span> <h3>Money Spent:</h3></span>
        <hr />
      </b-col>
    </b-row>
    <b-row class="align-items-center">
      <b-col cols="2">
        <b-form-select
          v-model="currentCurrency"
          :options="getCurrencyOptions()"
          size="sm"
        ></b-form-select>
      </b-col>
      <b-col>
        <span style="font-size: 4rem; font-weight: bold">{{ getAmount }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "TotalAmount",
  props: {
    currencySymbols: Array,
    totalAmount: Number,
    exchangeRates: Object,
  },
  data() {
    return {
      currentCurrency: "INR",
      previousCurrency: "INR",
    };
  },
  methods: {
    getCurrencyOptions() {
      let currencyOptions = [];
      this.currencySymbols.forEach((element) => {
        currencyOptions.push({
          value: element.ID,
          text: `${element.ID} ${element.Symbol || "-"}`,
        });
      });
      return currencyOptions;
    },
    getCurrencySymbol(ID) {
      let symbol;
      this.currencySymbols.forEach((element) => {
        if (element.ID === ID) {
          symbol = element.Symbol || element.ID;
        }
      });
      return symbol;
    },
  },
  computed: {
    getAmount() {
      const currentAmount =
        (this.totalAmount / this.exchangeRates[this.previousCurrency]) *
        this.exchangeRates[this.currentCurrency];
      console.log(this.getCurrencySymbol(this.currentCurrency));
      return `${this.getCurrencySymbol(
        this.currentCurrency
      )} ${currentAmount.toFixed(2)}`;
    },
  },
  created() {
    console.log(this.currencySymbols, this.totalAmount, this.exchangeRates);
  },
};
</script>

<style scoped>
.currency-selector ::-webkit-scrollbar {
  display: none;
}
.total-amount-container {
  height: 30vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
}
</style>
