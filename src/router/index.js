import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NormalLayout from "../layout/NormalLayout.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { layout: NormalLayout }
  },
  {
    path: "/sign-up",
    name: "SignUp",
    meta: { layout: NormalLayout },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Signup.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
