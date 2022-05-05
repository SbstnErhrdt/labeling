<template>

  <div class="relative">
    <!-- Loading -->
    <div v-if="loading" class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center z-40">
      <Spinner></Spinner>
    </div>
    <!-- Form -->
    <div v-if="!emailSend" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div class="py-3">
        <h1 class="text-2xl">Reset Password</h1>
      </div>
      <div class="mb-4">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="username">
          Email
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username"
               type="text" placeholder="email@email.com" v-model="credentials.identity">
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-app-500 hover:bg-app-800 text-white font-bold py-2 px-4 rounded" type="button"
                v-on:click="onSubmit()">
          Send recovery link to email
        </button>
      </div>
    </div>
    <div v-if="emailSend" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div class="py-3">
        <h1 class="text-2xl">Reset Password</h1>
      </div>
      <div class="bg-gray-50 p-6 rounded">
        <div class="flex">
          <div class="pr-5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span>
            A password reset link has been sent to your email address <strong>{{credentials.identity}}</strong>.
            Please also look in the spam folder.
          </span>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import initResetPassword from './apollo/mutations/identity_init_reset_password.graphql'

export default {
  components: {},
  data() {
    return {
      loading: true,
      emailSend: false,
      credentials: {
        'identity': '',
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
          mutation: initResetPassword,
          variables: credentials
        })
        if (res?.data?.initResetPassword) {
          this.$toast.success('reset link send', {
            duration: 1000,
          })
          this.emailSend = true;
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
