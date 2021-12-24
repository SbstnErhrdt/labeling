<template>
  <div>
    <Navigation/>
  </div>
</template>
<script>

export default {
  data() {
    return {}
  },
  async mounted() {
    await this.$apolloHelpers.onLogout();
    await this.$store.commit('identity/removeCurrentUser');
    await this.$router.push('/');
  },
  methods: {}
}
</script>
