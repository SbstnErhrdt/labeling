<template>
  <div>
    <Navigation/>

    <div class="max-w-md mx-auto py-6 sm:px-6 lg:px-8">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username"
                 type="text" placeholder="Username" v-model="credentials.identity">
        </div>
        <div class="mb-6">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                 id="password" type="password" placeholder="******************" v-model="credentials.password">
          <p class="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-gray-900 text-white font-bold py-2 px-4 rounded" type="button" v-on:click="onSubmit()">
            Sign In
          </button>
        </div>
      </div>
    </div>

  </div>

</template>


<script>

import login from '~/apollo/qureies/auth_login'

export default {
  data() {
    return {
      credentials: {
        'identity': '',
        'password': '',
      },
      routeParamId: this.$route.params.id
    }
  },
  methods: {
    async onSubmit() {
      const credentials = this.credentials
      try {
        const res = await this.$apollo.mutate({
          mutation: login,
          variables: credentials
        })
        if(res?.data?.login) {
          console.log("login - store token")
          await this.$apolloHelpers.onLogin(res.data.login)
        } else {
          this.$toast.error("can not parse response", {
            duration: 1000,
          })
        }
      } catch (e) {
        console.log('errors', e.graphQLErrors)
        this.$toast.error(e.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 1000,
        })
      }
    },
  }
}

</script>
