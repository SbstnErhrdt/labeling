<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <main>
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 v-if="this.LabelingTask" class="text-3xl font-bold text-gray-900">
            {{ this.LabelingTask.name }}
          </h1>
          <p v-if="this.LabelingTask">
            {{ this.LabelingTask.description }}
          </p>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div v-if="this.LabelingTask"
           class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        <Instruction v-if="this.LabelingTask.instruction" :instruction="this.LabelingTask.instruction" class="py-5"></Instruction>
        <hr class="mb-4">

        <div class="py-4 mb-3">
          <NuxtLink :to="{
                name: 'app-organizations-id-projectId-taskId-label',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: routeParamTaskId,
                }
              }"
                    class="bg-sky-700 hover:bg-sky-500 shadow overflow-hidden rounded-md text-white font-medium px-6 py-4">
            Start Labeling
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <hr>

        <div>
          <div class="pt-5">
            <h4 class="text-lg mb-3">Stats</h4>
            <div class="mb-4 text-gray-500">
              Done: <span class="font-mono">{{ this.LabelingTask.stats.done }}</span>
            </div>

          </div>

          <hr>
          <div class="py-5">
            <h4 class="text-lg mb-3">Classes</h4>
            <!-- This example requires Tailwind CSS v2.0+ -->
            <ul role="list"
                class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
              <li v-for="item in this.LabelingTask.classes" :key="item.UID"
                  class="p-3 shadow-md rounded-md">
                <span class="text-sm font-medium text-gray-900">{{ item.name }}</span><br>
                <span class="text-sm font-medium " :style="{ 'color': item.color}">{{ item.shortName }}</span>
                <p class="text-sm text-gray-500">{{ item.description }}</p>
              </li>
              <!-- More items... -->
            </ul>
          </div>

          <hr>
          <div class="py-5">
            <h4 class="text-lg mb-3">Leaderboard</h4>

            <!-- This example requires Tailwind CSS v2.0+ -->
            <div class="flex flex-col">
              <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                      <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                      </tr>
                      </thead>
                      <tbody>

                      <!-- Odd row -->
                      <tr class="bg-white hover:bg-gray-50 border-b-2 border-gray-100" v-for="item in this.LabelingTask.leaderboard" :key="item.UID">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {{ item.firstName }} {{ item.lastName }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ item.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ item.count }}
                        </td>
                      </tr>

                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>

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
import LabelingTask from '~/apollo/queries/task_read'
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
        {
          'name': 'Task',
          'link': null,
        },
      ],
      keyword: '',
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId,
      routeParamTaskId: this.$route.params.taskId,
    }
  },
  async mounted() {
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
    LabelingTask: {
      prefetch: false,
      query: LabelingTask,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          clientUID: this.$route.params.id,
          projectUID: this.$route.params.projectId,
          UID: this.$route.params.taskId,
        }
      },
      result(ApolloQueryResult, key) {
        let crumbs = Object.assign([], this.crumbs);
        crumbs[3] = {
          'name': ApolloQueryResult.data[key].name,
          'link': '/app/organizations/' + ApolloQueryResult.data[key].clientUID + '/' + ApolloQueryResult.data[key].projectUID + '/' + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
    }
  },
  head: {
    title: 'Task'
  }
}


</script>

<style>
.html-content strong, .html-content b {
  font-weight: bold
}

.html-content ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

.html-content ol {
  display: block;
  list-style-type: decimal;
  margin-block-start: 1em;
  margin-block-end: 1em;
  padding-inline-start: 40px;
}

.html-content li {
  display: list-item;
  text-align: match-parent;
}

.html-content p {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
}

.html-content mark {
  background: #e3e3e3;
  color: black;
}

</style>
