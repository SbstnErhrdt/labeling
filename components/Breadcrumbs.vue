<template>
  <nav class="text-gray-500 font-light py-3 px-6 bg-gray-100 text-sm" aria-label="Breadcrumb">
    <ol v-if="crumbs !== null" class="list-none p-0 inline-flex">
      <li class="flex items-center">
        <NuxtLink :to="home">Home</NuxtLink>
        <svg v-if="crumbs.length !== 0" class="fill-current w-3 h-3 mx-3 opacity-40" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 320 512">
          <path
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
        </svg>
      </li>
      <li class="flex items-center" v-for="(item, index) in crumbs">
        <div v-if="showLoading(index)"
             class="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] h-5 w-20"></div>
        <span v-if="!showLoading(index)"><NuxtLink :to="item.link">{{ item.name }}</NuxtLink></span>
        <svg v-if="index < crumbs.length-1" class="fill-current w-3 h-3 mx-3 opacity-40" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 320 512">
          <path
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
        </svg>
      </li>
    </ol>
    <div v-if="crumbs === null"
         class="animate-shimmer bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-[length:400%_100%] h-12 w-40"></div>
  </nav>
</template>


<script>
export default {
  data() {
    return {
      newCrumbs: []
    };
  },
  props: {
    crumbs: {
      type: Array,
      default: null,
    },
    home: {
      type: String,
      default: '/',
    },
  },
  watch: {
    crumbs: function(newVal, oldVal) { // watch it
      let crumbs = Object.assign([], newVal);
      this.newCrumbs = crumbs;
    }
  },
  mounted() {
    this.newCrumbs = Object.assign([], this.labels);
  },
  methods: {
    showLoading: function (index) {
      if (this.crumbs === null || this.crumbs === undefined) {
        return true
      }
      if (this.crumbs[index] === null || this.crumbs[index] === undefined) {
        return true
      }
      return this.crumbs[index].link === null || this.crumbs[index].link === undefined;
    },
  },
}
</script>
