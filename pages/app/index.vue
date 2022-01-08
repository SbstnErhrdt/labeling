<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <div class="container mx-auto pt-10">
      <div class="text-md bg-gray-50 p-10 rounded">
        Hello
        <strong>
          {{ this.$store.state.identity.currentUser.salutation }}
          {{ this.$store.state.identity.currentUser.firstName }}
          {{ this.$store.state.identity.currentUser.lastName }}
        </strong>

        <div class="mb-10"></div>

        <NuxtLink to="/app/organizations"
                  class="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-700 hover:bg-sky-500 md:py-4 md:text-lg md:px-10">
          Get started
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      crumbs: []
    }
  },
  computed: {},
  head: {
    title: 'Organizations'
  }
}
</script>
