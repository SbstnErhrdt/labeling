<template>
  <div>
    <Navigation/>

    <div class="max-w-md mx-auto py-6 sm:px-6 lg:px-8 relative">
      <!-- Loading -->
      <div v-if="loading"
           class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center">
        <Spinner></Spinner>
      </div>
      <!-- Form -->
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">

        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email"
                 type="text" placeholder="email@email.com" v-model="credentials.identity">
        </div>

        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold" for="password">
            Password
          </label>
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker"
                 id="password" type="password" placeholder="******************" v-model="credentials.password">
        </div>

        <div class="mb-4">
          <label class="block text-grey-darker text-sm font-bold" for="passwordConfirmation">
            Password Confirmation
          </label>
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker"
                 id="passwordConfirmation" type="password" placeholder="******************"
                 v-model="credentials.passwordConfirmation">
        </div>

        <div class="mb-6">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="acceptTermsAndConditions">
            Accept Terms & Conditions
          </label>
          <input class="shadow border border-red rounded py-2 px-3 text-grey-darker"
                 id="acceptTermsAndConditions" type="checkbox" v-model="credentials.acceptTermsAndConditions">
        </div>

        <div class="flex items-center justify-between">
          <button class="bg-gray-900 text-white font-bold py-2 px-4 rounded" type="button" v-on:click="onSubmit()">
            Register
          </button>
          <NuxtLink to="/identity/login" class="text-black py-2 px-4"
                    >
            To Login
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>

</template>


<script>

import register from '~/pages/identity/apollo/mutations/identity_register'

export default {
  data() {
    return {
      loading: true,
      credentials: {
        'identity': '',
        'password': '',
        'passwordConfirmation': '',
        'acceptTermsAndConditions': false,
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
          mutation: register,
          variables: credentials
        })
        if (res?.data?.register) {
          this.$toast.success('registration successful', {
            duration: 1000,
          })
          await this.$router.push('/identity/login')
          this.loading = false;
        } else {
          this.$toast.error('can not parse response', {
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
