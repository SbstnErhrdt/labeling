<template>
  <div>
    <Navigation/>
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

        <!-- {{ this.LabelingTask.stats }} -->

        <div class="py-4 mb-3">
          <NuxtLink :to="{
                name: 'organizations-id-projectId-taskId-label',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: routeParamTaskId,
                }
              }"
                    class="bg-indigo-700 shadow overflow-hidden rounded-md text-white font-medium px-6 py-4 hover:bg-indigo-900">
            Start Labeling
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>

        <hr>


        <div class="pt-5">
          <h4>Classes</h4>
          <!-- This example requires Tailwind CSS v2.0+ -->
          <ul role="list" class="space-y-3">
            <li v-for="item in this.LabelingTask.classes" :key="item.UID"
                class="">
              <span class="text-sm font-medium text-gray-900">{{ item.name }}</span><br>
              <span class="text-sm font-medium " :style="{ 'color': item.color}">{{ item.shortName }}</span>
              <p class="text-sm text-gray-500">{{ item.description }}</p>
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
import Client from '~/apollo/qureies/client_read'
import Project from '~/apollo/qureies/project_read'
import LabelingTask from '~/apollo/qureies/task_read'
import Spinner from '~/components/Spinner';

export default {
  components: {Spinner},
  data() {
    return {
      keyword: '',
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId,
      routeParamTaskId: this.$route.params.taskId,
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
    },
    // Tasks
    LabelingTask: {
      prefetch: false,
      query: LabelingTask,
      variables() {
        return {
          clientUID: this.$route.params.id,
          projectUID: this.$route.params.projectId,
          UID: this.$route.params.taskId,
        }
      },
    }
  },
  head: {
    title: 'Project'
  }
}


</script>
