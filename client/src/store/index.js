import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("accessToken") || null,
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
  },
  actions: {
    async getAccessToken(context, payload) {
      const { username, password } = payload;
      return new Promise((resolve, reject) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };
        fetch(`${process.env.VUE_APP_API}/signin`, requestOptions)
          .then((res) => {
            if (res.status !== 200) {
              reject(res.status);
            }
            return res.json();
          })
          .then((resJSON) => {
            localStorage.setItem("accessToken", resJSON.token);
            context.commit("setAccessToken", resJSON.token);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    removeAccessToken(context) {
      localStorage.removeItem("accessToken");
      context.commit("setAccessToken", null);
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.accessToken !== null;
    },
  },
});
