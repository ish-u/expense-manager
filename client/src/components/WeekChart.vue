<template>
  <b-row class="align-items-center mt-5">
    <b-col>
      <span style="font-size: xx-large"> <b> Money Spent per Week </b></span>
      <br />
      <span>
        <em>
          {{ range[0] }} to
          {{ range[1] }}
        </em>
      </span>
    </b-col>
    <b-col xl="6" lg="6" md="12" sm="12" class="chart">
      <!-- Bar Graph -->
      <apexchart
        width="500"
        type="bar"
        :options="options"
        :series="series"
      ></apexchart>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    optionsCategories: [],
    seriesData: [],
    range: [],
  },
  data() {
    return {
      width: window.innerWidth / 2,
      options: {
        chart: {
          id: "week-money-chart",
        },
        xaxis: {
          title: {
            text: "Week",
          },
          categories: this.optionsCategories,
        },
      },
      series: [
        {
          name: "Spent($)",
          data: this.seriesData,
        },
      ],
    };
  },
};
</script>

<style scoped>
.chart {
  display: flex;
  justify-content: center;
  align-content: center;
  overflow: scroll;
}
.chart::-webkit-scrollbar {
  display: none;
}
@media only screen and (max-width: 576px) {
  .chart {
    justify-content: unset !important;
  }
}
</style>
