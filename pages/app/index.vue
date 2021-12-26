<template>
  <div>
    <Navigation/>
    <div class="container mx-auto pt-10">
      <div class="text-md bg-gray-50 p-10">
        Hello
        <strong>
          {{ this.$store.state.identity.currentUser.salutation }}
          {{ this.$store.state.identity.currentUser.firstName }}
          {{ this.$store.state.identity.currentUser.lastName }}
        </strong>
      </div>
      <NuxtLink to="/app/organizations"
                class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
        Get started
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {}
  },
  computed: {},
  head: {
    title: 'Organizations'
  }
}
</script>
