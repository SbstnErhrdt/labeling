<template>
  <div>
    <Navigation/>

    <div class="max-w-md mx-auto py-6 sm:px-6 lg:px-8 relative">
      <!-- Loading -->
      <div v-if="loading" class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center">
        <Spinner></Spinner>
      </div>
    </div>

  </div>

</template>


<script>

import registrationConfirmation from '~/pages/identity/apollo/mutations/identity_register_confirm'

export default {
  data() {
    return {
      loading: true,
    }
  },
  async mounted() {
    if (this.$route.params.token === undefined ||  this.$route.params.token === null || this.$route.params.token.length <= 0) {
      this.$toast.error("can not parse confirmation token", {
        duration: 2000,
      })
      await this.$router.push('/identity/login')
      return
    }
    this.loading = true;
    const variables = { "token": this.$route.params.token}
    try {
      const res = await this.$apollo.mutate({
        mutation: registrationConfirmation,
        variables: variables
      })
      if(res?.data?.registrationConfirmation) {
        this.$toast.success("registration successful confirmed", {
          duration: 1000,
        })
        await this.$router.push('/identity/login')
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
  methods: {
  }
}

</script>
