  <template>
  <div id="app">

    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <a class="nav-item">
            <img src="./src/assets/img/logo.png" class="vue-logo" title="Vue.js 2.1.10">
            <span>Vue.js 2.1.10</span>
          </a>
        </div>
        <div class="nav-center nav-menu">
          <a class="nav-item is-tab is-hidden-mobile" v-bind:class="{ 'is-active': !authenticated }">
            <v-link href="/">
              <span class="icon">
                <i class="fa fa-home"></i>
              </span>
              Home
            </v-link>
          </a>
          <a class="nav-item is-tab is-hidden-mobile" v-bind:class="{ 'is-active': authenticated }">
            <v-link href="/products">
              <span class="icon">
                <i class="fa fa-industry"></i>
              </span>
              Products
            </v-link>
          </a>
          <a class="nav-item is-tab is-hidden-mobile">
            <v-link href="/about">
              About
            </v-link>
          </a>
        </div>
        <span class="nav-toggle">
      <span></span>
      <span></span>
      <span></span>
    </span>
        <div class="nav-right nav-menu">
          <a class="nav-item is-tab is-hidden-tablet is-active">Home</a>
          <a class="nav-item is-tab is-hidden-tablet">Products</a>
          <a class="nav-item is-tab is-hidden-tablet">About</a>
        </div>
      </div>
    </nav>

    <div class="card" v-show="!authenticated">
      <div class="card-content">
        <div class="content">
          A simple CRUD designed with Vue.js 2.1.10
          <br/><br/>
          Integrated modules:
          <br/>
          - <b>Auth0</b> (JWT and OAuth2 authentication library)
          <br/>
          - <b>json-server</b> (simple backend API for getting app database)
          <br/>
          - <b>bulma.io</b> (like bootstrap)
          <br/>
          - <b>font-awesome</b> (icon library)
          <br/>
          - <b>sweetalert</b> (for beautiful javascript alerts)
          <br/>
          - <b>vee-validator</b> (for form validation)
          <br/>
          - <b>vue-flatpickr</b> (datepicker)
          <br/>
          - <b>webpack/browserify</b> (for packaging and building your app)
          <br/>
          - and a lot more!
          <br>
          <small>Last update: 30/01/2017</small><br/>
          <small>raphael.alex@gmail.com</small>
        </div>
      </div>
    </div>

    <br/>

    <Login></Login>

  </div>
</template>

<script>
  import Vue from 'vue'
  import Login from './components/Login.vue'
  import VLink from './components/VLink.vue'

  export default {
    name: 'app',
    data() {
      return {
        authenticated: false,
      }
    },
    components: {
      Login, VLink
    },
    mounted() {
      this.authenticated = checkAuth();
    }
  }

  // Utility to check auth status
  function checkAuth() {
    return !!localStorage.getItem('id_token');
  }
</script>

<style lang="scss">
  @import "./assets/scss/index.scss";
  @import "./assets/scss/global.scss";
</style>
