<template>
  <b-container class="w-75 text-center total-amount-container">
    <b-row>
      <b-col>
        <span> <h5>Money Spent:</h5></span>
        <hr />
      </b-col>
    </b-row>
    <b-row class="align-items-center">
      <b-col xl="2" lg="2" md="3" sm="4">
        <b-form-select
          v-model="currentCurrency"
          :options="getCurrencyOptions()"
          size="sm"
        ></b-form-select>
      </b-col>
      <b-col>
        <span class="total-amount">{{ getAmount }}</span>
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
      // Default Currency
      currentCurrency: "INR",
      previousCurrency: "INR",
    };
  },
  methods: {
    // returns currency options for the Select Element
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
    // get the Current Currency
    // ex : Symbol INR -> ₹
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
    // Returning Total Amount based on "currentCurrency"
    getAmount() {
      const currentAmount =
        (this.totalAmount / this.exchangeRates[this.previousCurrency]) *
        this.exchangeRates[this.currentCurrency];
      return `${this.getCurrencySymbol(
        this.currentCurrency
      )} ${currentAmount.toFixed(2)}`;
    },
  },
};
</script>

<style scoped>
.currency-selector ::-webkit-scrollbar {
  display: none;
}
.total-amount-container {
  height: 35vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
}
.total-amount {
  font-size: 4rem;
  font-weight: bold;
}

@media (max-width: 576px) {
  .total-amount-container {
    height: 30vh;
  }
  .total-amount {
    font-size: 2rem;
  }
}

@media (min-width: 768px) {
  .total-amount {
    font-size: 3rem;
  }
}

@media (min-width: 992px) {
  .total-amount {
    font-size: 4rem;
  }
}

@media (min-width: 1400px) {
  .total-amount {
    font-size: 5rem;
  }
}
</style>
