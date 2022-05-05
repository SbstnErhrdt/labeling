<template>
  <div class="relative">
    <!-- Loading -->
    <div v-if="loading" class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center z-40">
      <Spinner></Spinner>
    </div>
    <!-- Form -->
    <div class="py-3">
      <h1 class="text-2xl">Change Password</h1>
    </div>
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
      <div class="mb-6">
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          Current Password
        </label>
        <div class="relative">
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                 id="oldPassword" :type="passwordFieldType" placeholder="******************"
                 v-model="pwChange.oldPassword">
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
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          New Password
        </label>
        <div class="relative">
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                 id="newPassword" :type="passwordFieldType" placeholder="******************"
                 v-model="pwChange.newPassword">
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
        <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
          Confirm New Password
        </label>
        <div class="relative">
          <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                 id="password" :type="passwordFieldType" placeholder="******************"
                 v-model="pwChange.newPasswordConfirmation">
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
      <div class="flex items-center justify-between">
        <button class="bg-app-700 hover:bg-app-800 text-white font-bold py-2 px-4 rounded" type="button"
                v-on:click="onSubmit()">
          Change Password
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import changePassword from './apollo/mutations/identity_init_reset_password.graphql'

export default {
  components: {},
  data() {
    return {
      loading: true,
      pwChange: {
        'newPassword': '',
        'newPasswordConfirmation': '',
      },
      passwordFieldType: 'password',
    }
  },
  async mounted() {
    this.loading = false;
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
      const pwChange = this.pwChange
      try {
        const res = await this.$apollo.mutate({
          mutation: changePassword,
          variables: pwChange
        })
        if (res?.data?.changePassword) {
          this.$toast.success('password changed successfully', {
            duration: 1000,
          })
          this.loading = false;
        } else {
          this.$toast.error('can not parse response', {
            duration: 3000,
          })
          this.loading = false;
        }
      } catch (e) {
        console.log('errors', e.graphQLErrors)
        this.$toast.error(e.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 3000,
        })
        this.loading = false;
      }
    },
  }
}
</script>
