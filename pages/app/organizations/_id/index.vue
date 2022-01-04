<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <main>
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 v-if="this.Client" class="text-3xl font-bold text-gray-900">
            {{ this.Client.name }}
          </h1>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div v-if="this.ProjectSearch && this.ProjectSearch.results" class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2>Projects</h2>
        <div>
          <!-- This example requires Tailwind CSS v2.0+ -->
          <div class="text-sm pb-5">
            <strong>Amount: </strong>{{ this.ProjectSearch.amount }}
          </div>
          <ul role="list" class="space-y-3">
            <li v-for="item in this.ProjectSearch.results" :key="item.UID"
                class="">
              <NuxtLink :to="{
                name: 'app-organizations-id-projectId',
                params: {
                  id: routeParamId,
                  projectId: item.UID
                }
              }"
                        class="bg-white shadow overflow-hidden rounded-md hover:text-black text-gray-600 font-medium block px-6 py-4 hover:bg-gray-200">
                <span class="text-sm font-medium text-gray-900">{{ item.name }}</span>
                <p class="text-sm text-gray-500">{{ item.description }}</p>
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
import Client from '~/apollo/queries/client_read'
import ProjectSearch from '~/apollo/queries/projects_read.graphql'
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
        },
        {
          'name': 'Organization',
          'link': null,
        },
      ],
      routeParamId: this.$route.params.id
    }
  },
  async mounted() {
    console.log(this.$route.params.id);
  },
  computed: {},
  apollo: {
    Client: {
      prefetch: false,
      query: Client,
      // Reactive parameters
      variables() {
        // Use vue reactive properties here
        return {
          uid: this.$route.params.id,
        }
      },
      result(ApolloQueryResult, key) {
        console.log(ApolloQueryResult.data[key].name, key)
        let crumbs = Object.assign([], this.crumbs);
        crumbs[1] = {
          'name': ApolloQueryResult.data[key].name,
          'link': "/app/organizations/" + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
    },
    ProjectSearch: {
      prefetch: false,
      query: ProjectSearch,
      // Reactive parameters
      variables() {
        // Use vue reactive properties here
        return {
          clientUID: this.$route.params.id,
          keyword: this.keyword,
          projectType: 'LABELING',
        }
      },
    }
  },
  head: {
    title: 'Organizations'
  }
}

</script>
