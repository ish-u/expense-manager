import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Dashboard from "../views/Dashboard.vue";
import SignUp from "../views/SignUp.vue";
import SignIn from "../views/SignIn.vue";
import Report from "../views/Report.vue";
import Expense from "../views/Expense.vue";
import Error404 from "../views/Error404.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/report",
    name: "Report",
    component: Report,
  },
  {
    path: "/expense",
    name: "Expense",
    component: Expense,
  },
  {
    path: "/signup",
    name: "Sign Up",
    component: SignUp,
  },
  {
    path: "/signin",
    name: "Sign In",
    component: SignIn,
  },
  {
    path: "*",
    name: "404",
    component: Error404,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// authentication middleware using Navigation Guards
router.beforeEach((to, from, next) => {
  const publicPages = ["Sign In", "Sign Up"];
  const needAuth = !publicPages.includes(to.name);
  const isLoggedIn = store.getters.isLoggedIn;
  console.log(isLoggedIn, needAuth);
  if (needAuth && !isLoggedIn) {
    next({ name: "Sign In" });
  } else {
    next();
  }
});

export default router;
