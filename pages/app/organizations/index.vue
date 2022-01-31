<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <main>
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Organizations
          </h1>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div v-if="this.ClientsSearch && this.ClientsSearch.results">
          <!-- This example requires Tailwind CSS v2.0+ -->
          <div class="text-sm pb-5">
            <strong>Amount: </strong>{{ this.ClientsSearch.amount }}
          </div>

          <ul role="list" class="space-y-3">
            <li v-for="item in this.ClientsSearch.results" :key="item.UID"
            >
              <NuxtLink :to="{ name: 'app-organizations-id', params: { id: item.UID }}"
                        class="block bg-white shadow overflow-hidden rounded-md px-6 py-4 text-gray-600 font-medium hover:text-black hover:bg-gray-200">
                {{ item.name }}
              </NuxtLink>
            </li>
            <!-- More items... -->
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import ClientsSearch from '~/apollo/queries/clients_read'
import Spinner from '~/components/Spinner';

export default {
  middleware: 'authenticated',
  components: {Spinner},
  data() {
    return {
      keyword: '',
      crumbs: [
        {
          'name': 'Organizations',
          'link': '/app/organizations',
        }
      ],
    }
  },
  computed: {},
  apollo: {
    ClientsSearch: {
      prefetch: false,
      query: ClientsSearch,
      // Reactive parameters
      variables() {
        // Use vue reactive properties here
        return {
          message: this.keyword,
        }
      },
      error(error) {
        console.error(error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
    }
  },
  head: {
    title: 'Organizations'
  }
}

</script>
