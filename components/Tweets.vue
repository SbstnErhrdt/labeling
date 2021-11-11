<template>
  <div>

    <h3 class="my-5">Tweets of {{ twitterHandle }}</h3>

    <div v-if="$data.res === null">
      <Spinner/>
    </div>
    <div v-if="$data.res!==null">
      <div v-for="tweet in $data.res" :key="tweet.id" class="mb-4">
        <Tweet :tweet="tweet"></Tweet>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      res: null,
      isOpen: false
    };
  },
  props: {
    twitterHandle: String,
  },
  methods: {},
  async mounted() {
    // Request with full url because we are in JSDom env
    this.res = await this.$axios.$get('api/twitter/' + this.twitterHandle + '/tweets')
  }
};
</script>

<style>
</style>
