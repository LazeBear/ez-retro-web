import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import NormalLayout from '../layout/NormalLayout.vue';
import LoginLayout from '../layout/LoginLayout.vue';
import BoardLayout from '../layout/BoardLayout.vue';
import store from '../store';

Vue.use(VueRouter);

function redirectToBoardsIfLoggedIn(to, from, next) {
  store
    .dispatch('auth/authenticate')
    .then(() => {
      next('/boards');
    })
    .catch(() => {
      next();
    });
}

function isLoggedIn(to, from, next) {
  store
    .dispatch('auth/authenticate')
    .then(() => {
      next();
    })
    .catch(() => {
      next('/login');
    });
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: NormalLayout }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    meta: { layout: LoginLayout },
    beforeEnter: redirectToBoardsIfLoggedIn,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: { layout: LoginLayout },
    beforeEnter: redirectToBoardsIfLoggedIn,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/boards',
    name: 'Boards',
    meta: { layout: NormalLayout },
    beforeEnter: isLoggedIn,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/MyBoards.vue')
  },
  {
    path: '/boards/:id',
    name: 'Board',
    meta: { layout: BoardLayout },
    beforeEnter: isLoggedIn,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Board.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
