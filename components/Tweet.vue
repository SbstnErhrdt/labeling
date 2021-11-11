<template>
  <div>
    <div class="bg-white rounded-lg shadow-lg p-5">
      <div>
        <div class="text-sm">
          <a href="#" class="font-medium text-gray-900 font-mono">{{ tweet.id }}</a>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">
          {{ tweet.created_at }}
        </p>
      </div>
      <div class="mt-2 mb-5 text-sm text-gray-700">
        <p>
          {{ tweet.text }}
        </p>
      </div>

      <div class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center">
    <span class="relative z-0 inline-flex shadow-sm rounded-md -space-x-px">
      <div
        class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">

        <span class="text-center">
          Retweets<br/>
          {{ tweet.public_metrics.retweet_count }}
        </span>

      </div>
      <div
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
        <span class="text-center">
          Replies<br/>
        {{ tweet.public_metrics.reply_count }}</span>
      </div>
      <div
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
         <span class="text-center">
          Likes<br/>
           {{ tweet.public_metrics.like_count }}</span>
      </div>
      <div
        class="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-400 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
         <span class="text-center">
          Quotes<br/>
           {{ tweet.public_metrics.quote_count }}</span>
      </div>
    </span>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    tweet: {},
  },
  methods: {},
  async mounted() {
  }
};
</script>

<style>
</style>
