<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <main>
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 v-if="this.Project" class="text-3xl font-bold text-gray-900">
            {{ this.Project.name }}
          </h1>
          <p v-if="this.Project">
            {{ this.Project.description }}
          </p>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div v-if="this.LabelingTasksSearch && this.LabelingTasksSearch.results"
           class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2>Tasks</h2>
        <div>
          <!-- This example requires Tailwind CSS v2.0+ -->
          <div class="text-sm pb-5">
            <strong>Amount: </strong>{{ this.LabelingTasksSearch.amount }}
          </div>
          <ul role="list" class="space-y-3">
            <li v-for="item in this.LabelingTasksSearch.results" :key="item.UID"
                class="">
              <NuxtLink :to="{
                name: 'app-organizations-id-projectId-taskId',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: item.UID,
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
      <!-- This example requires Tailwind CSS v2.0+
      {{ this.Project }}
      {{ this.LabelingTasksSearch }}
      -->
    </main>
  </div>
</template>

<script>
import Client from '~/apollo/queries/client_read'
import Project from '~/apollo/queries/project_read'
import LabelingTasksSearch from '~/apollo/queries/tasks_read'
import Spinner from '~/components/Spinner';

export default {
  middleware: 'authenticated',
  components: {Spinner},
  data() {
    return {
      crumbs: [
        {
          'name': 'Organizations',
          'link': '/app/organizations',
        },
        {
          'name': 'Organization',
          'link': null,
        },
        {
          'name': 'Project',
          'link': null,
        },
      ],
      keyword: '',
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId
    }
  },
  async mounted() {
    console.log(this.$router);
    console.log(this.$route.params.projectId);
  },
  computed: {},
  apollo: {
    // Client
    Client: {
      prefetch: false,
      query: Client,
      variables() {
        return {
          uid: this.$route.params.id,
        }
      },
      result(ApolloQueryResult, key) {
        let crumbs = Object.assign([], this.crumbs);
        crumbs[1] = {
          'name': ApolloQueryResult.data[key].name,
          'link': '/app/organizations/' + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
    },
    // Project
    Project: {
      prefetch: false,
      query: Project,
      variables() {
        return {
          clientUID: this.$route.params.id,
          UID: this.$route.params.projectId,
        }
      },
      result(ApolloQueryResult, key) {
        let crumbs = Object.assign([], this.crumbs);
        crumbs[2] = {
          'name': ApolloQueryResult.data[key].name,
          'link': '/app/organizations/' + ApolloQueryResult.data[key].clientUID + '/' + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
    },
    // Tasks
    LabelingTasksSearch: {
      prefetch: false,
      query: LabelingTasksSearch,
      variables() {
        return {
          clientUID: this.$route.params.id,
          projectUID: this.$route.params.projectId,
        }
      },
    }
  },
  head: {
    title: 'Project'
  }
}


</script>
