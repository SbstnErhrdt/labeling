<template>
  <div>
    <Navigation/>
    <mainhandleResults>
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <NuxtLink :to="{
                name: 'organizations-id-projectId-taskId',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: routeParamTaskId,
                }
              }"
          >
            Back
          </NuxtLink>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>


      <div v-if="!$apollo.loading && this.LabelingItemsNerNext && this.LabelingItemsNerNext.length > 0"
           class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="relative p-20">
          <Annotator
            :text="this.LabelingItemsNerNext[0].text"
            :classes="this.LabelingItemsNerNext[0].classes"
            :clientUID="this.routeParamId"
            :projectUID="this.routeParamProjectId"
            :taskUID="this.routeParamTaskId"
            :itemUID="this.LabelingItemsNerNext[0].UID"
            :labels="this.LabelingItemsNerNext[0].labels"
            @results="handleResults"
          >
          </Annotator>
          <div v-if="loading"
               class="absolute left-0 top-0 right-0 bottom-0 z-50 inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full">
            <Spinner></Spinner>
          </div>
        </div>
      </div>
    </mainhandleResults>
  </div>
</template>

<script>
import Client from '~/apollo/qureies/client_read'
import Project from '~/apollo/qureies/project_read'
import LabelingTask from '~/apollo/qureies/task_read'
import Spinner from '~/components/Spinner';
import LabelingItemsNerNext from '~/apollo/qureies/ner_item_read_next.graphql'
import createLabelingLabelsNer from '@/apollo/qureies/create_labels_ner.graphql'
import deleteLabelingLabelNer from '@/apollo/qureies/delete_label_ner.graphql'

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
    async handleResults(value) {
      this.loading = true;
      // send mutation
      await this.$apollo.mutate({
        mutation: createLabelingLabelsNer,
        variables: {
          data: value.labels,
        },
        update: (store, {data: {createLabelingLabelsNer}}) => {
          console.log(createLabelingLabelsNer);
          this.$toast.success('Saved', {
            duration: 1000,
          })
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
    handleDeleteLabel(label) {
      // send mutation
      this.$apollo.mutate({
        mutation: deleteLabelingLabelNer,
        variables: {
          data: label,
        },
        update: (store, {data: {createLabelingLabelsNer}}) => {
          this.$toast.success('Saved', {
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
        this.$toast.error(error.graphQLErrors)
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
        this.$toast.error(error.graphQLErrors)
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
        this.$toast.error(error.graphQLErrors)
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
        this.$toast.error(error.graphQLErrors)
      }
    }
  },
  head: {
    title: 'Project'
  }
}


</script>
