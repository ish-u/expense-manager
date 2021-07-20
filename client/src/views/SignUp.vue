<template>
  <b-container>
    <h1 class="display-1">Sign Up</h1>
    <b-container class="pt-5">
      <b-form @submit.prevent="signup" class="signup-form">
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ alertMessage }}
        </b-alert>
        <b-form-group>
          <b-form-input
            name="name"
            type="text"
            placeholder="name"
            v-model="name"
            required
            autofocus
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            name="username"
            type="text"
            placeholder="username"
            v-model="username"
            required
            min="6"
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            name="email"
            type="email"
            placeholder="email"
            v-model="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            name="password"
            type="password"
            placeholder="password"
            v-model="password"
            required
            pattern="^(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
          ></b-form-input>
          <b-form-text id="password-help-block" style="text-align: left">
            <ul>
              <li>Must be 8-20 characters long</li>
              <li>Must have 1 Uppercase Letter</li>
              <li>Must have 1 Lowercase Letter</li>
              <li>Must have at least 1 number or special characte</li>
            </ul>
          </b-form-text>
        </b-form-group>
        <b-button type="submit" variant="dark">Sign Up</b-button>
      </b-form>
    </b-container>
  </b-container>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      showDismissibleAlert: false,
      alertMessage: "",
    };
  },
  methods: {
    signup() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
        }),
      };
      fetch(`${process.env.VUE_APP_API}/signup`, requestOptions)
        .then((res) => {
          if (res.status === 200) {
            this.$router.push({ name: "Sign In" });
          } else {
            this.alertMessage = "Username Taken";
            this.showDismissibleAlert = true;
          }
        })
        .catch((err) => {
          this.alertMessage = "Something Went Wrong";
          this.showDismissibleAlert = true;
          console.log(err);
        });
    },
  },
};
</script>

<style>
.signup-form {
  margin: 0 auto;
  width: 50vw;
}
</style>
