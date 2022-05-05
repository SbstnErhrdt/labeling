<template>
  <div>
    <Navigation/>

    <div class="max-w-lg mx-auto py-6 sm:px-6 lg:px-8 relative">
      <!-- Loading -->
      <div v-if="loading" class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center">
        <Spinner></Spinner>
      </div>
      <ConfirmPasswordResetWidget v-if="!loading" :token="this.token"></ConfirmPasswordResetWidget>
    </div>

    <Footer></Footer>

  </div>

</template>


<script>
import ConfirmPasswordResetWidget from '@/components/identity/ConfirmPasswordResetWidget';
export default {
  components: {ConfirmPasswordResetWidget},
  data() {
    return {
      loading: true,
      token: "",
    }
  },
  async mounted() {
    if (this.$route.params.token === undefined ||  this.$route.params.token === null || this.$route.params.token.length <= 0) {
      this.$toast.error("can not parse reset token", {
        duration: 3000,
      })
    } else {
      this.token = this.$route.params.token;
      this.loading = false;
    }
  },
  methods: {
  }
}

</script>
