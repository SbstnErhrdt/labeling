<template>
  <div>
    <Navigation/>

    <div class="max-w-lg mx-auto py-6 sm:px-6 lg:px-8 relative">
      <!-- Loading -->
      <div v-if="loading"
           class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center z-40">
        <Spinner></Spinner>
      </div>
      <!-- Form -->
      <div v-if="!emailSend" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">

        <h1 class="my-6 text-3xl font-extrabold text-gray-900">Create new account</h1>

        <div class="mb-2">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email"
                 type="text" placeholder="email@email.com" v-model="credentials.identity">
        </div>

        <div class="mb-2">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
            Password
          </label>
          <div class="relative">
            <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                   id="password" :type="passwordFieldType" placeholder="******************"
                   v-model="credentials.password">
            <div class="absolute inset-y-0 -top-3 right-0 pr-3 flex items-center text-sm leading-5 z-20">
              <svg @click="switchVisibility()" v-if="!showPassword()" class="h-6 w-6 text-app-700"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg @click="switchVisibility()" v-if="showPassword()" class="h-6 w-6 text-app-700"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="passwordConfirmation">
            Password Confirmation
          </label>
          <div class="relative">
            <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                   id="passwordConfirmation" :type="passwordFieldType" placeholder="******************"
                   v-model="credentials.passwordConfirmation">
            <div class="absolute inset-y-0 -top-3 right-0 pr-3 flex items-center text-sm leading-5 z-20">
              <svg @click="switchVisibility()" v-if="!showPassword()" class="h-6 w-6 text-app-700"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg @click="switchVisibility()" v-if="showPassword()" class="h-6 w-6 text-app-700"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </div>
          </div>

        </div>

        <div class="mb-6">
          <label class="block text-grey-darker text-sm font-bold mb-2" for="acceptTermsAndConditions">
            Accept Terms & Conditions
          </label>
          <input class="shadow border border-red rounded py-2 px-3 text-grey-darker"
                 id="acceptTermsAndConditions" type="checkbox" v-model="credentials.acceptTermsAndConditions">
        </div>

        <div class="flex items-center justify-between">
          <button :class="{ 'opacity-25 cursor-not-allowed': this.isDisabled }"
                  class="bg-app-500 hover:bg-app-800 text-white font-bold py-2 px-4 rounded disabled:opacity-25"
                  type="button"
                  v-on:click="onSubmit()">
            Register
          </button>
          <span class="text-sm text-gray-500">
          Already have an account? <NuxtLink to="/identity/login"
                                             class="inline text-app-500 hover:text-app-800"> Login </NuxtLink>
          </span>
        </div>
      </div>
      <div v-if="emailSend" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div class="py-3">
          <h1 class="text-2xl">Registration Successful</h1>
        </div>
        <div class="bg-gray-50 p-6 rounded">
          <div class="flex">
            <div class="pr-5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor"
                   stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span>
            A confirmation link has been sent to your email address <strong>{{ credentials.identity }}</strong>. <br>
            Please also look in the spam folder. <br>
              <NuxtLink to="/identity/login"
                        class="text-app-500 hover:text-app-800 block mt-5"> Login </NuxtLink>
          </span>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>

</template>


<script>

import register from '~/pages/identity/apollo/mutations/identity_register'

export default {
  data() {
    return {
      loading: true,
      credentials: {
        identity: '',
        password: '',
        passwordConfirmation: '',
        acceptTermsAndConditions: false,
      },
      passwordFieldType: 'password',
      emailSend: false,
    }
  },
  async mounted() {
    if (this.$store.state.identity.currentUser !== null) {
      await this.$router.push('/app')
    }
    this.loading = false;
  },
  computed: {
    isDisabled() {
      return this.credentials.identity === '' || this.credentials.password === '' || this.credentials.passwordConfirmation === '' || !this.credentials.acceptTermsAndConditions;
    }
  },
  methods: {
    switchVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
    showPassword() {
      return this.passwordFieldType !== 'password';
    },
    async onSubmit() {
      this.loading = true;
      const credentials = this.credentials
      try {
        const res = await this.$apollo.mutate({
          mutation: register,
          variables: credentials
        })
        if (res?.data?.register) {
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
