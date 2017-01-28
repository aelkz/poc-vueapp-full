<template id="template-login">
  <div class="has-text-centered">
    <button class="button is-info is-centered" @click="login" v-show="!authenticated">Login with Auth0</button>
    <button class="button is-danger" @click="logout()" v-show="authenticated">Logout</button>

    <div v-show="authenticated">
      <Products></Products>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Products from './Products.vue'

  // Instantiate a Lock
  var AUTH0_CLIENT_ID = 'xxxxxxxxxxxxxxxxxxxxxxxxx';
  var AUTH0_DOMAIN    = 'yyyyyyyyyyyyyyyyyyyyyyyyy'

  var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN)

  /* eslint-disable no-new */
  //window.addEventListener('load', function () {
    export default {
      name: 'app-login',
      template: '#template-login',
      components: { Products },
      data() {
        return {
          authenticated: false,
          secretThing: '',
          lock: lock
        }
      },
      methods: {
        login() {
          // Show the lock widget
          lock.show();
        },
        logout() {
          // Remove the profile and token from localStorage
          localStorage.removeItem('profile');
          localStorage.removeItem('id_token');
          this.authenticated = false;
          this.$router.go('/');
        }
      },
      mounted() {
        this.authenticated = checkAuth();
        console.log('authenticated='+this.authenticated);

        this.lock.on('authenticated', (authResult) => {
          localStorage.setItem('id_token', authResult.idToken);
          this.lock.getProfile(authResult.idToken, (error, profile) => {
            if (error) {
              console.log('not authenticated');
              // Handle error
              return;
            }
            // Set the token and user profile in local storage
            localStorage.setItem('profile', JSON.stringify(profile));

            this.authenticated = true;
            this.$router.go('/');
          });
        });

        if (!this.authenticated) {
          // uncoment to call login modal on page load.
          //this.login()
        }
      }
    }

    // Utility to check auth status
    function checkAuth() {
      return !!localStorage.getItem('id_token');
    }
  //});
</script>
