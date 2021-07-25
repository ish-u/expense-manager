<template>
  <b-container class="text-center">
    <template v-if="loading">
      <b-spinner type="grow" label="Loading..."></b-spinner>
    </template>
    <!-- Content -->
    <template v-else>
      <b-row class="justify-content-center" cols="12">
        <h6>(Currency : USD $)</h6>
        <template>
          <b-container>
            <CategoryChart
              :options="getCategoryOptions"
              :series="getCategorySeries"
              :range="range"
            />
            <WeekChart
              :optionsCategories="getWeekOptions"
              :seriesData="getWeekSeries"
              :range="range"
            />
          </b-container>
        </template>
      </b-row>
    </template>
  </b-container>
</template>

<script>
import CategoryChart from "../components/CategoryChart.vue";
import WeekChart from "../components/WeekChart.vue";
export default {
  name: "Report",
  components: {
    CategoryChart,
    WeekChart,
  },
  data: function () {
    return {
      loading: true,
      categoryMoney: {},
      weekMoney: {},
      range: [],
    };
  },
  methods: {
    // get the Report about the Transactions that happend in the Current Month
    async getReport() {
      this.loading = true;
      const requestOptions = {
        method: "GET",
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(`${process.env.VUE_APP_API}/getReport`, requestOptions)
        .then((res) => {
          if (res.status !== 200) {
            throw "err";
          }
          return res.json();
        })
        .then((resJSON) => {
          const { categoryMoney, weekMoney, range } = resJSON;
          this.categoryMoney = categoryMoney;
          this.weekMoney = weekMoney;
          this.range = range;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    // returns value corresponding to the Vue-ApexChart formats of Donut Chart and Bar Graph
    // https://apexcharts.com/docs/vue-charts/
    getCategorySeries: function () {
      return Object.values(this.categoryMoney);
    },
    getCategoryOptions: function () {
      const options = {};
      options.labels = [];
      Object.keys(this.categoryMoney).forEach((e) => options.labels.push(e));
      return options;
    },
    getWeekSeries: function () {
      return Object.values(this.weekMoney);
    },
    getWeekOptions: function () {
      const toReturn = [];
      Object.keys(this.weekMoney).forEach((e) => toReturn.push(e));
      return toReturn;
    },
  },
  mounted() {
    this.getReport();
  },
};
</script>

<style></style>
