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
  import VueRouter from 'vue-router'

  Vue.use(VueRouter);

  // Instantiate a Lock
  var AUTH0_CLIENT_ID = 'xxxxxxxxxx';
  var AUTH0_DOMAIN = 'yyyyyyyyyy';

  // https://github.com/auth0/lock
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

        // https://stackoverflow.com/questions/41325336/how-to-detect-that-the-current-request-is-an-authentication-callback
        // https://github.com/auth0/lock/issues/514
        // https://stackoverflow.com/questions/40846157/vue-js-implementing-auth0-example-in-my-project-gives-me-vm-login-is-not-a-fu
        // https://router.vuejs.org/en/essentials/navigation.html
        // https://github.com/vuejs/vue-router/releases
        // https://stackoverflow.com/questions/33021372/vuejs-is-there-a-way-to-access-router-go-inside-a-component
        lock.on("hash_parsed", function (response) {
          if (!response && !localStorage.getItem('login')) {
            // Redirect to the login screen
            //this.$router.go('/');
          } else {
            // Either the user is already logged in or an authentication
            // response will be processed by Lock so don't trigger
            // an automatic redirect to login screen
            console.log('redirect callback with authentication successful');
            location.reload(); // FIX - must use vue-route to push/go
          }
        });

        this.lock.on('authenticated', (authResult) => {
          localStorage.setItem('id_token', authResult.idToken);

          try {
            this.lock.getProfile(authResult.idToken, (error, profile) => {
              if (error) {
                // Handle error
                return;
              }
              // Set the token and user profile in local storage
              localStorage.setItem('profile', JSON.stringify(profile));

              this.authenticated = true;
              this.lock.hide();
              //this.$router.push('/');
              $rootScope.$broadcast('userProfileSet', profile);
            });
          }catch (e){
              console.log('lock.getProfile');
          }
        });

        if (!checkAuth()) {
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
