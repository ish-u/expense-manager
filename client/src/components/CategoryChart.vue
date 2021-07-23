<template>
  <b-row class="align-items-center">
    <b-col>
      <span style="font-size: xx-large">
        <b> Money Spend per Category </b>
      </span>
      <br />
      <span>
        <em>
          {{ range[0] }} to
          {{ range[1] }}
        </em>
      </span>
    </b-col>
    <b-col
      xl="6"
      lg="6"
      md="12"
      sm="12"
      class="d-flex justify-content-center align-items-center chart"
    >
      <apexchart
        width="400"
        type="donut"
        :options="options"
        :series="series"
      ></apexchart>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "CategoryChart",
  props: {
    options: {
      labels: [],
    },
    series: [],
    range: [],
  },
  data() {
    return {
      width: window.innerWidth / 3,
    };
  },
};
</script>

<style scoped>
.chart {
  overflow: scroll;
}
.chart::-webkit-scrollbar {
  display: none;
}
</style>
