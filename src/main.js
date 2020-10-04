import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false;

Vue.use(Toasted, {
  position: 'top-center',
  duration: 5000,
  keepOnHover: true,
  iconPack: 'custom-class'
});
let options = {
  type: 'error',
  icon: 'mdi mdi-alert'
};

// register the toast with the custom message
Vue.toasted.register(
  'error',
  (message) => {
    // if there is no message passed show default message
    if (!message) {
      return 'Oops.. Something Went Wrong..';
    }

    // if there is a message show it with the message
    return 'Oops.. ' + message;
  },
  options
);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
