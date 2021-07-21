<template>
  <b-container class="text-center">
    <h1 class="display-1">Sign In</h1>
    <b-container class="pt-5">
      <b-form @submit.prevent="signin" class="signin-form">
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ alertMessage }}
        </b-alert>
        <b-form-group>
          <b-form-input
            name="username"
            type="text"
            placeholder="username"
            v-model="username"
            required
            autofocus
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            name="password"
            type="password"
            placeholder="password"
            v-model="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="dark">Sign In</b-button>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      username: "",
      password: "",
      showDismissibleAlert: false,
      alertMessage: "",
    };
  },
  methods: {
    signin() {
      this.$store
        .dispatch("getAccessToken", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "Dashboard" });
        })
        .catch(() => {
          this.alertMessage = "Wrong Credentials";
          this.showDismissibleAlert = true;
        });
    },
  },
};
</script>

<style>
.signin-form {
  margin: 0 auto;
  width: 25vw;
}
</style>
