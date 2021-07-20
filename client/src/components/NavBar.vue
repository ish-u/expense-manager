<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand @click="goToDashboardView">Expense Manager</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto" v-if="isLoggedIn">
        <b-nav-item @click="goToExpenseView">Expenses</b-nav-item>
        <b-nav-item @click="goToReportView">Report</b-nav-item>
        <b-nav-item @click="signOut">Sign Out</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-else>
        <b-nav-item @click="goToSignInView">Sign In</b-nav-item>
        <b-nav-item @click="goToSignUpView">Sign Up</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    goToDashboardView() {
      if (this.$route.name !== "Dashboard" && this.isLoggedIn) {
        this.$router.push({ name: "Dashboard" });
      }
    },
    goToExpenseView() {
      if (this.$route.name !== "Expense") {
        this.$router.push({ name: "Expense" });
      }
    },
    goToReportView() {
      if (this.$route.name !== "Report") {
        this.$router.push({ name: "Report" });
      }
    },
    goToSignInView() {
      if (this.$route.name !== "Sign In") {
        this.$router.push({ name: "Sign In" });
      }
    },
    goToSignUpView() {
      if (this.$route.name !== "Sign Up") {
        this.$router.push({ name: "Sign Up" });
      }
    },
    signOut() {
      this.$store.dispatch("removeAccessToken");
      this.$router.push({ name: "Sign In" });
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>

<style></style>
