// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'
import Login from './components/Login.vue'
import Products from './components/Products.vue'
import About from './pages/About.vue'

Vue.use(VueResource);
Vue.use(VueRouter);

var $ = require('jquery');
global.jQuery = global.$ = window.jQuery = $;
require("jquery-mask-plugin");

// require("bulma");
// require("font-awesome");
// require("./assets/css/global.css");

const appRoutes = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: App },
    { path: '/login', component: Login },
    { path: '/list-products', component: Products },
    { path: '/about', component: About },
    { path: '*', component: App },
  ]
});

const app = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  render: h => h(App),
  router: appRoutes,
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      const matchingView = appRoutes.routes[this.currentRoute];
      return matchingView ? require('./pages/' + matchingView + '.vue') : require('./pages/404.vue')
    }
  }
});

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
});
