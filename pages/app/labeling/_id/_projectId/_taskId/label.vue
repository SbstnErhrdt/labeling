<template>
  <div class="bg-gray-50 relative" style="min-height: 100vh">
    <div v-if="this.LabelingTask && this.LabelingTask.instruction && this.showInstruction"
         class="absolute top-0 right-0 bottom-0 left-0 bg-white bg-opacity-70 backdrop-blur-0 bg-white z-50">
      <div class="mx-auto max-w-3xl">
        <div class="my-10 bg-white shadow-2xl p-6">
          <button
            @click="showInstruction = !showInstruction"
            class="float-right items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-700 hover:bg-app-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            Close
          </button>
          <br class="clear-both">
          <Instruction :instruction="this.LabelingTask.instruction"></Instruction>
        </div>
      </div>

    </div>
    <main>
      <!-- header bar -->
      <header class="bg-white shadow py-3 px-3 z-10 relative">
        <div class="max-w-5xl mx-auto flex">
          <!-- back button -->
          <NuxtLink :to="{
                name: 'app-labeling-id-projectId-taskId',
                params: {
                  id: routeParamId,
                  projectId: routeParamProjectId,
                  taskId: routeParamTaskId,
                }
              }"
                    class="flex-none  items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-700 hover:bg-app-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Back
          </NuxtLink>
          <div class="flex-auto"></div>
          <!-- help button -->
          <span
            class="flex-none cursor-pointer items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-700 hover:bg-app-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            v-if="this.LabelingTask && this.LabelingTask.instruction && this.LabelingTask && this.LabelingTask.instruction.length > 0"
            @click="showInstruction = !showInstruction">
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5 inline" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Help
          </span>
        </div>
      </header>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading">
        <Spinner></Spinner>
      </div>
      <div class="relative z-0">
        <div v-if="this.LabelingTask && this.LabelingTask.stats.todo === 0"
             class="text-gray-700 mx-auto text-center pt-20">
          <span class="inline-block pr-3">&#127881;</span> Task completed. Thank you.
        </div>
        <div v-if="!$apollo.loading && this.currentItem"
             class="max-w-5xl mx-auto flex">
          <!-- Next list
          <div class="flex-initial w-1/6 bg-gray-50 p-3">
            <span class="font-bold mb-3 block">Next:</span>
            <div v-for="item in this.todoItems" :key="item.UID" class="p-3 bg-white shadow mb-4 overflow-hidden">
              <p class="text-sm truncate">{{ item.text }}</p>
              <span class="text-xs text-gray-700 font-mono">{{ item.source }} - {{ item.documentID }}</span>
            </div>
          </div> -->
          <!-- Annotator -->
          <div class="flex-1 relative bg-white p-3">
            <LabelingAnnotator
              :clientUID="this.routeParamId"
              :projectUID="this.routeParamProjectId"
              :taskUID="this.routeParamTaskId"
              :classes="this.LabelingTask.classes"
              :text="this.currentItem.text"
              :itemUID="this.currentItem.UID"
              :labels="this.currentItem.labels"
              :metadata="{
              'source':this.currentItem.source,
              'documentID':this.currentItem.documentID,
            }"
              @results="handleResults"
              @deleted="handleDeleteLabels"
              @removeFlag="handleRemoveFlag"
              @addFlag="handleAddFlag"
            >
            </LabelingAnnotator>
            <div v-if="loading"
                 class="absolute left-0 top-0 right-0 bottom-0 z-50 inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full">
              <Spinner></Spinner>
            </div>
          </div>
          <!-- Done list -->
          <div class="flex-initial w-1/4 bg-gray-50 p-3 overflow-y-scroll" style="min-height:90vh; max-height: 90vh">
            <span class="font-bold mb-3 block">DONE:</span>
            <div v-for="item in this.doneItems" :key="item.UID">
              <div @click="setItem(item)" class="p-3 bg-white shadow mb-4 overflow-hidden">
                <p class="text-sm truncate">{{ item.text }}</p>
                <span class="text-xs text-gray-700 font-mono">{{ item.source }} - {{ item.documentID }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Client from '~/apollo/queries/client_read'
import Project from '~/apollo/queries/project_read'
import LabelingTask from '~/apollo/queries/task_read'
import Spinner from '~/components/Spinner';
import LabelingItemsNerNext from '~/apollo/queries/ner_item_read_next.graphql'
import createLabelingLabelsNer from '@/apollo/queries/create_labels_ner.graphql'
import deleteLabelingLabelsNer from '@/apollo/queries/delete_labels_ner.graphql'
import markLabelingItemAsSeen from '@/apollo/queries/mark_item_as_seen.graphql'
import addFlag from '@/apollo/queries/add_flag.graphql'
import removeFlag from '@/apollo/queries/remove_flag.graphql'

export default {
  middleware: 'authenticated',
  components: {Spinner},
  data() {
    return {
      loading: false,
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId,
      routeParamTaskId: this.$route.params.taskId,
      currentItem: null,
      todoItems: [],
      doneItems: [],
      showInstruction: false,
    }
  },
  methods: {
    async handleResults(obj) {
      this.loading = true;
      let currentItem = Object.assign({}, this.currentItem)
      let res = Object.assign({}, obj);
      // copy the labels
      currentItem.labels = res.labels;
      // copy the flags
      currentItem.flags = res.flags;
      // submit create labels mutation
      await this.$apollo.mutate({
        mutation: createLabelingLabelsNer,
        variables: {
          data: payload.labels,
        },
      }).then((response) => {
        this.$toast.success('Saved', {
          duration: 1000,
        })
        // add the new labels with the id to the current item
        if (response.data && response.data.createLabelingLabelsNer) {
          currentItem.labels = Object.assign([], response.data.createLabelingLabelsNer)
        }
      }).catch((error) => {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      });

      // send seen flag
      await this.$apollo.mutate({
        mutation: markLabelingItemAsSeen,
        variables: {
          clientUID: this.routeParamId,
          projectUID: this.routeParamProjectId,
          taskUID: this.routeParamTaskId,
          itemUID: currentItem.UID,
        },
      }).catch((error) => {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      });

      // move the item from the todolist to done list
      // or from done to done
      this.addItemToDoneList(currentItem)

      // re-fetch if array is empty
      if (this.todoItems.length === 0) {
        await this.$apollo.queries.LabelingItemsNerNext.refetch()
      }
      // set the first item to current
      if (this.todoItems.length > 0) {
        this.currentItem = this.todoItems[0];
      }

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
        },
      }).catch((error) => {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      });
    },
    handleRemoveFlag(obj) {
      // send mutation
      this.$apollo.mutate({
        mutation: removeFlag,
        variables: {
          data: obj,
        },
        update: (store, {data: {removeLabelingItemFlag}}) => {
          this.$toast.success('Flag removed', {
            duration: 1000,
          })
        },
      }).catch((error) => {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      });
    },
    handleAddFlag(obj) {
      // send mutation
      this.$apollo.mutate({
        mutation: addFlag,
        variables: {
          data: obj,
        },
        update: (store, {data: {addLabelingItemFlag}}) => {
          this.$toast.success('Flag added', {
            duration: 1000,
          })
        },
      }).catch((error) => {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      });
    },
    setItem(item) {
      this.currentItem = Object.assign({}, item);
    },
    addItemToDoneList(item) {
      // check if the item is already in the done list
      let done = Object.assign([], this.doneItems)
      let i = done.length;
      // if the element was already in the done list
      // replace the existing one
      while (i--) {
        if (done[i].UID === item.UID) {
          done[i] = item
          this.doneItems = done;
          // go with the next item
          this.nextItem();
          return
        }
      }
      // if it was new
      // add it to the done list
      this.doneItems.unshift(item);
      // and pop it from the todolist
      this.todoItems.splice(0, 1)
      // go with the next item
      this.nextItem();
    },
    nextItem() {
      // update the current item
      if (this.todoItems && this.todoItems.length > 0) {
        this.currentItem = Object.assign({}, this.todoItems[0])
      } else {
        console.warn('no new item')
        this.currentItem = null;
      }
    },
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
      error(error) {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
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
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
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
      error(error) {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
    },
    // Next
    LabelingItemsNerNext: {
      prefetch: false,
      query: LabelingItemsNerNext,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          clientUID: this.$route.params.id,
          projectUID: this.$route.params.projectId,
          taskUID: this.$route.params.taskId,
        }
      },
      result(ApolloQueryResult, key) {
        this.todoItems = ApolloQueryResult.data[key];
        // set the first item to current
        if (this.todoItems.length > 0) {
          this.currentItem = this.todoItems[0];
        }
      },
      error(error) {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
    }
  },
  head: {
    title: 'Labeling'
  }
}


</script>
