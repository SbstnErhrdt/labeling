<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav id="sub-navigation" class="bg-white shadow relative z-20">
    <div class="px-6">
      <div class="flex justify-between h-12">
        <div class="flex">
          <div class="hidden sm:flex">
            <div v-if="links===[]"
                 class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] h-4 w-10"></div>
            <NuxtLink v-for="(item, index) in links"
                      :key="index"
                      :to="item.link"
                      class="border-app-500 text-gray-700 inline-flex items-center px-3 text-sm font-medium" >
              <div v-if="showLoading(index)"
                   class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] h-4 w-10"></div>
              <span v-if="!showLoading(index)">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-app-500" aria-controls="mobile-menu" aria-expanded="false">
            <span class="sr-only">Open main menu</span>
            <!--
              Icon when menu is closed.

              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!--
              Icon when menu is open.

              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink v-for="(item, index) in links"
                  :key="index"
                  :to="item.link"
                  class="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium" >
          <div v-if="showLoading(index)"
               class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] h-4 w-10"></div>
          <span v-if="!showLoading(index)">{{ item.name }}</span>
        </NuxtLink>
      </div>
      <!--
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">Tom Cook</div>
            <div class="text-sm font-medium text-gray-500">tom@example.com</div>
          </div>
          <button type="button" class="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-500">
            <span class="sr-only">View notifications</span>

            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Your Profile</a>
          <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Settings</a>
          <a href="#" class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Sign out</a>
        </div>
      </div>
      -->
    </div>
  </nav>
</template>
<script>
  export default {
    props: {
      links: {
        type: Array,
        default: [],
      },
    },
    methods: {
      showLoading: function (index) {
        if (this.links === null || this.links === undefined) {
          return true
        }
        if (this.links[index] === null || this.links[index] === undefined) {
          return true
        }
        if(this.links[index].link && this.links[index].link  === '') {
          return true
        }
        return this.links[index].link === null || this.links[index].link === undefined;
      },
    },
  }
</script>
<style>
/* exact link will show the primary color for only the exact matching link */
#sub-navigation a.nuxt-link-exact-active, #sub-navigation a.nuxt-link-exact-active:hover {
  color: black;
  background: rgba(0,0,0,0.1);
}
#sub-navigation a:hover {
  background: rgba(0,0,0,0.05);
}
</style>
