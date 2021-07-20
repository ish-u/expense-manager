<template>
  <div id="app">
    <NavBar />
    <b-container fluid class="p-5">
      <router-view />
    </b-container>
  </div>
</template>
<script>
import NavBar from "./components/NavBar.vue";
export default {
  components: {
    NavBar,
  },
};
</script>

<style>
#app {
  text-align: center;
}
</style>
