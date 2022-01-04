<template>
  <span>
  <NuxtLink v-if="this.$store.state.identity.currentUser != null" to="/app" class="text-white">
    Label
  </NuxtLink>
  <NuxtLink v-if="this.$store.state.identity.currentUser == null" to="/" class="text-white">
    Label
  </NuxtLink>
    </span>
</template>
