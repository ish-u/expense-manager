<template>
  <b-container class="text-center mt-3">
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
      // dispatching the getAccessToken Action to obtain the Access Token
      // for making furthur requests
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

<style scoped>
.signin-form {
  margin: 0 auto;
  width: 30vw;
}

@media (max-width: 576px) {
  .signin-form {
    width: 75vw;
  }
  .display-1 {
    font-size: 5rem;
  }
}

@media (min-width: 768px) {
  .signin-form {
    margin: 0 auto;
    width: 50vw;
  }
}

@media (min-width: 992px) {
  .signin-form {
    margin: 0 auto;
    width: 30vw;
  }
}
</style>
