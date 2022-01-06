<template>
  <div>
    <Navigation/>

    <div class="max-w-md mx-auto py-6 sm:px-6 lg:px-8 relative">
      <!-- Loading -->
      <div v-if="loading" class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center">
        <Spinner></Spinner>
      </div>
      <!-- Form -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
            Email
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username"
                 type="text" placeholder="email@email.com" v-model="credentials.identity">
        </div>
        <div class="mb-6">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                 id="password" type="password" placeholder="******************" v-model="credentials.password">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-gray-900 text-white font-bold py-2 px-4 rounded" type="button" v-on:click="onSubmit()">
            Sign In
          </button>
          <NuxtLink to="/identity/register" class="text-black py-2 px-4">
            Register
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>

</template>


<script>

import login from './apollo/mutations/identity_login.graphql'
import Identity from './apollo/queries/identity_current.graphql'

export default {
  data() {
    return {
      loading: true,
      credentials: {
        'identity': '',
        'password': '',
      },
    }
  },
  async mounted() {
    if (this.$store.state.identity.currentUser !== null) {
      await this.$router.push('/app')
    }
    this.loading = false;
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const credentials = this.credentials
      try {
        const res = await this.$apollo.mutate({
          mutation: login,
          variables: credentials
        })
        if(res?.data?.login) {
          console.log("login - store token")
          await this.$apolloHelpers.onLogin(res.data.login)
          this.$toast.success("login successful", {
            duration: 1000,
          })
          // get current user
          const identity = await this.$apollo.query({
            query: Identity,
            variables: {},
          })
          // set current user
          this.$store.commit("identity/setCurrentUser", identity.data.Identity)
          await this.$router.push('/app')
          this.loading = false;
        } else {
          this.$toast.error("can not parse response", {
            duration: 1000,
          })
          this.loading = false;
        }
      } catch (e) {
        console.log('errors', e.graphQLErrors)
        this.$toast.error(e.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 1000,
        })
        this.loading = false;
      }
    },
  }
}

</script>
