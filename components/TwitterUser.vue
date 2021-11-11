<template>
  <div>
    <div v-if="$data.res === null">
      <Spinner/>
    </div>
    <div v-if="$data.res!==null">
      <!--{{$data.res}}-->
      <!-- Twitter -->
      <div v-if="$data.no_account===true">No twitter account</div>
      <div v-if="$data.no_account===false && $data.res" class="max-w-7xl mx-auto mt-4">
        <img v-if="$data.res && $data.res.data && $data.res.data.profile_image_url"
             crossorigin="anonymous"
             :src="$data.res.data.profile_image_url"
             :alt="$data.res.Id"
             class="mx-auto h-10 w-10 rounded-full lg:w-10 lg:h-10 float-left mr-5">
        <h3 class="text-xl leading-6 font-medium text-gray-900">
          Twitter - @{{ $data.res.Id }} <span class="text-sm float-right font-mono">Twitter-ID: {{ $data.res.data.id }}</span>
        </h3>
        <p class="text-md text-gray-500">{{ $data.res.data.description }}</p>
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Followers
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ $data.res.data.public_metrics.followers_count }}

            </dd>
          </div>

          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Following
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ $data.res.data.public_metrics.following_count }}
            </dd>
          </div>

          <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">
              Tweets
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ $data.res.data.public_metrics.tweet_count }}
            </dd>
          </div>
        </dl>

        <Tweets :twitter-handle="twitterHandle"></Tweets>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      res: null,
      no_account: false
    };
  },
  props: {
    twitterHandle: String,
  },
  methods: {},
  async mounted() {
    if (this.twitterHandle.length > 0 &&
      !(["n.a.", "n.a", "na"].includes(this.twitterHandle.toLowerCase()))) {
      // Request with full url because we are in JSDom env
      this.res = await this.$axios.$get('api/twitter/' + this.twitterHandle);
    } else {
      this.no_account = true;
      this.res = {};
    }
  }
};
</script>

<style>
</style>

