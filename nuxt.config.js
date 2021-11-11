export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'label',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/form', mode: 'client'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/toast',
  ],
  /*
   ** Toast module configuration
   */
  toast: {
    position: 'top-center',
    register: [ // Register custom toasts
      /*
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
       */
    ]
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.BASE_URL || 'http://localhost:8080/',//process.env.API_URL,
  },
  /*
   ** Apollo module configuration
   */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.BASE_GRAPHQL_URL || 'http://localhost:8080/api/v1/graphql',
        inMemoryCacheOptions: {
          addTypename: false,
        },
      },
    },
    // Sets the authentication type for any authorized request.
    authenticationType: 'Bearer',
    // Token name for the cookie which will be set in case of authentication
    tokenName: 'apollo-token',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
