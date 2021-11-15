<template>
  <div>
    <main>
      <header class="bg-white shadow">
        <div class="max-w-4xl mx-auto py-6">
          <NuxtLink :to="{
                name: 'organizations-id-projectId-taskId',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: routeParamTaskId,
                }
              }"
                    class="items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </NuxtLink>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div v-if="!$apollo.loading && this.LabelingItemsNerNext && this.LabelingItemsNerNext.length > 0"
           class="container max-w-4xl mx-auto">
        <div class="relative">
          <Annotator
            :text="this.LabelingItemsNerNext[0].text"
            :classes="this.LabelingItemsNerNext[0].classes"
            :clientUID="this.routeParamId"
            :projectUID="this.routeParamProjectId"
            :taskUID="this.routeParamTaskId"
            :itemUID="this.LabelingItemsNerNext[0].UID"
            :labels="this.LabelingItemsNerNext[0].labels"
            @results="handleResults"
            @deleted="handleDeleteLabels"
          >
          </Annotator>
          <div v-if="loading"
               class="absolute left-0 top-0 right-0 bottom-0 z-50 inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full">
            <Spinner></Spinner>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Client from '~/apollo/qureies/client_read'
import Project from '~/apollo/qureies/project_read'
import LabelingTask from '~/apollo/qureies/task_read'
import Spinner from '~/components/Spinner';
import LabelingItemsNerNext from '~/apollo/qureies/ner_item_read_next.graphql'
import createLabelingLabelsNer from '@/apollo/qureies/create_labels_ner.graphql'
import deleteLabelingLabelsNer from '@/apollo/qureies/delete_labels_ner.graphql'

export default {
  components: {Spinner},
  data() {
    return {
      loading: false,
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId,
      routeParamTaskId: this.$route.params.taskId,
    }
  },
  methods: {
    async handleResults(obj) {
      let d = Object.assign({}, obj);
      this.loading = true;
      // send mutation
      await this.$apollo.mutate({
        mutation: createLabelingLabelsNer,
        variables: {
          data: d.labels,
        },
        update: (store, {data: {createLabelingLabelsNer}}) => {
          console.log(createLabelingLabelsNer);
          this.$toast.success('Saved', {
            duration: 1000,
          })
          // remove the first element from the array
          this.LabelingItemsNerNext.splice(0,1);
          // refetch if array is empty
          if(this.LabelingItemsNerNext.length === 0) {
            this.$apollo.queries.LabelingItemsNerNext.refetch()
          }
        },
        error(error) {
          console.log('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors, {
            duration: 1000,
          })
        }
      });
      this.loading = false;
    },
    handleDeleteLabels(obj) {
      // send mutation
      this.$apollo.mutate({
        mutation: deleteLabelingLabelsNer,
        variables: {
          data: obj.labels,
        },
        update: (store, {data: {createLabelingLabelsNer}}) => {
          this.$toast.success('Deleted', {
            duration: 1000,
          })
          console.log(createLabelingLabelsNer);
        },
        error(error) {
          console.log('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors, {
            duration: 1000,
          })
        }
      });
    },
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
      error(error) {
        console.log('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors, {
          duration: 1000,
        })
      }
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
      error(error) {
        console.log('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors, {
          duration: 1000,
        })
      }
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
      error(error) {
        console.log('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors, {
          duration: 1000,
        })
      }
    },
    // Next
    LabelingItemsNerNext: {
      prefetch: false,
      query: LabelingItemsNerNext,
      variables() {
        return {
          clientUID: this.$route.params.id,
          projectUID: this.$route.params.projectId,
          taskUID: this.$route.params.taskId,
        }
      },
      error(error) {
        console.log('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors, {
          duration: 1000,
        })
      }
    }
  },
  head: {
    title: 'Project'
  }
}


</script>
