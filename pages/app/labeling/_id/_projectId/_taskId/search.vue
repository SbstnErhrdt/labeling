<template>
  <div>
    <Navigation/>
    <Breadcrumbs home="/app" :crumbs="crumbs"/>
    <SubNavigation :links="this.subNavigation"></SubNavigation>
    <main>
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div v-if="$apollo.loading || !this.searchData || !this.classes">
        <Spinner></Spinner>
      </div>
      <div v-if="this.LabelingTask && !$apollo.loading && this.searchData && this.classes">
        <div class="flex">
          <div class="w-1/4 shadow">
            <div v-if="this.searchData && this.classes">
              <!-- Search Form -->
              <form v-on:submit="submit">
                <div class="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8 px-3 py-3 bg-gray-50 border-b-2 border-gray-100">
                  <div>
                    <label for="first-name" class="block text-sm font-medium text-gray-700">Source</label>
                    <div class="mt-1">
                      <select id="documentSource" v-model="searchSource"
                              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-500 focus:outline-none focus:ring-app-500 focus:border-app-500 sm:text-sm rounded-md">
                        <option value="">All sources</option>
                        <option v-for="i in this.LabelingTask.sources" v-bind:value="i">{{ i }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label for="docId" class="block text-sm font-medium text-gray-700">Document ID</label>
                    <div class="mt-1">
                      <input type="text" v-model="searchDocumentID" name="docId" id="docId"
                             class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-500 focus:outline-none focus:ring-app-500 focus:border-app-500 sm:text-sm rounded-md">
                    </div>
                  </div>
                  <div class="col-span-2">
                    <label for="keyword" class="block text-sm font-medium text-gray-700">Full-Text</label>
                    <div class="mt-1">
                      <input type="text" v-model="searchKeyword" name="keyword" id="keyword"
                             class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-500 focus:outline-none focus:ring-app-500 focus:border-app-500 sm:text-sm rounded-md">
                    </div>
                  </div>
                  <div class="col-span-2">
                    <button type="submit" class="bg-app-600 hover:bg-app-800 text-white text-sm py-1 px-2 rounded">Search</button>
                  </div>
                </div>
              </form>

              <div class="px-3 text-sm py-2 text-gray-500">
                Search results: {{ this.searchData.amount }}
              </div>
              <div class="overflow-y-scroll px-3" style="height: 70vh">
                <div v-for="(item, index) in this.searchData.results"
                     class="shadow mb-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                     :class="{ 'bg-gray-100 ring-app-500': isActive(item) }"
                     @click="selectItem(item)"
                     :key="index">
                  <span class="text-sm font-mono">{{ item.source }} - {{ item.documentID }}</span>
                  <span class="text-sm text-gray-500 text-ellipsis overflow-hidden block h-16">{{ item.text }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-3/4 relative">
            <div v-if="loading"
                 class="absolute left-0 top-0 right-0 bottom-0 z-50 inset-0 bg-white bg-opacity-50 overflow-y-auto h-full w-full">
              <Spinner></Spinner>
            </div>
            <div class="p-6 max-w-5xl mx-auto">
              <LabelingAnnotator
                v-if="currentItem"
                :clientUID="this.routeParamId"
                :projectUID="this.routeParamProjectId"
                :taskUID="this.routeParamTaskId"
                :classes="this.classes"
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
import createLabelingLabelsNer from '@/apollo/queries/create_labels_ner';
import markLabelingItemAsSeen from '@/apollo/queries/mark_item_as_seen';
import deleteLabelingLabelsNer from '@/apollo/queries/delete_labels_ner';
import removeFlag from '@/apollo/queries/remove_flag';
import addFlag from '@/apollo/queries/add_flag';
import labelingItemsSearch from './labeling_items_search.graphql'

export default {
  middleware: 'authenticated',
  components: {Spinner},
  data() {
    return {
      loading: false,
      searchKeyword: '',
      searchSource: '',
      searchDocumentID: '',
      searchData: null,
      classes: null,
      subNavigation: [],
      crumbs: [
        {
          'name': 'Labeling',
          'link': '/app/labeling',
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
        {
          'name': 'Search',
          'link': null,
        },
      ],
      keyword: '',
      routeParamId: this.$route.params.id,
      routeParamProjectId: this.$route.params.projectId,
      routeParamTaskId: this.$route.params.taskId,
      currentItem: null,
    }
  },
  async mounted() {
    let subNavigation = Object.assign([], this.subNavigation);
    subNavigation[0] = {
      'name': 'Task',
      'link': '/app/labeling/' + this.routeParamId + '/' + this.routeParamProjectId + '/' + this.routeParamTaskId,
    }
    subNavigation[1] = {
      'name': 'Search',
      'link': '/app/labeling/' + this.routeParamId + '/' +  this.routeParamProjectId + '/' + this.routeParamTaskId + '/search',
    }
    subNavigation[2] = {
      'name': 'Label',
      'link': '/app/labeling/' + this.routeParamId + '/' +  this.routeParamProjectId + '/' + this.routeParamTaskId + '/label',
    }
    this.subNavigation = subNavigation;

    await this.search();



  },
  methods: {
    isActive(item) {
      if (this.currentItem === null) {
        return false;
      }
      return this.currentItem && this.currentItem.UID === item.UID;
    },
    submit(e) {
      e.preventDefault() // it prevents from page reload
      this.search();
    },
    selectItem(item) {
      this.currentItem = Object.assign({}, item);
    },
    async search() {
      this.searchData = null;
      // submit create labels mutation
      try {
        const res = await this.$apollo.query({
          query: labelingItemsSearch,
          fetchPolicy: 'no-cache',
          variables: {
            clientUID: this.$route.params.id,
            projectUID: this.$route.params.projectId,
            taskUID: this.$route.params.taskId,
            source: this.searchSource,
            documentID: this.searchDocumentID,
            keyword: this.searchKeyword,
          }
        });
        this.searchData = res.data.LabelingItemsNerSearch;
        this.classes = res.data.LabelingClassesSearch.results;
      } catch (error) {
        console.error('errors', error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
    },
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
        fetchPolicy: 'no-cache',
        variables: {
          data: res.labels,
        },
        update: (store, {data: {createLabelingLabelsNer}}) => {
          this.$toast.success('Saved', {
            duration: 1000,
          })
          this.currentItem = Object.assign({}, currentItem)
        },
        error(error) {
          console.error('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
            duration: 4000,
          })
        }
      });

      // send seen flag
      await this.$apollo.mutate({
        mutation: markLabelingItemAsSeen,
        fetchPolicy: 'no-cache',
        variables: {
          clientUID: this.routeParamId,
          projectUID: this.routeParamProjectId,
          taskUID: this.routeParamTaskId,
          itemUID: currentItem.UID,
        },
        update: (store, {data: {markLabelingItemAsSeen}}) => {
        },
        error(error) {
          console.error('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
            duration: 4000,
          })
        }
      });

      // update item in list
      let searchData = Object.assign({}, this.searchData);
      // iterate over list
      let i = searchData.results.length;
      while(i--) {
        if(searchData.results[i].UID === this.currentItem.UID) {
          searchData.results[i] = this.currentItem;
          break
        }
      }
      this.searchData = searchData;

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
        error(error) {
          console.error('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
            duration: 4000,
          })
        }
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
        error(error) {
          console.error('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
            duration: 4000,
          })
        }
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
        error(error) {
          console.error('errors', error.graphQLErrors)
          this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
            duration: 4000,
          })
        }
      });
    },
    setItem(item) {
      this.currentItem = Object.assign({}, item);
    },
  },
  computed: {
  },
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
          'link': '/app/labeling/' + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
      error(error) {
        console.error(error.graphQLErrors)
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
      result(ApolloQueryResult, key) {
        let crumbs = Object.assign([], this.crumbs);
        crumbs[2] = {
          'name': ApolloQueryResult.data[key].name,
          'link': '/app/labeling/' + ApolloQueryResult.data[key].clientUID + '/' + ApolloQueryResult.data[key].UID,
        }
        this.crumbs = crumbs;
      },
      error(error) {
        console.error(error.graphQLErrors)
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
      result(ApolloQueryResult, key) {
        let crumbs = Object.assign([], this.crumbs);
        crumbs[3] = {
          'name': ApolloQueryResult.data[key].name,
          'link': '/app/labeling/' + ApolloQueryResult.data[key].clientUID + '/' + ApolloQueryResult.data[key].projectUID + '/' + ApolloQueryResult.data[key].UID,
        }
        crumbs[4] = {
          'name': 'Search',
          'link': '/app/labeling/' + ApolloQueryResult.data[key].clientUID + '/' + ApolloQueryResult.data[key].projectUID + '/' + ApolloQueryResult.data[key].UID + '/search',
        }
        this.crumbs = crumbs;
      },
      error(error) {
        console.error(error.graphQLErrors)
        this.$toast.error(error.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 4000,
        })
      }
    },
  },
  head: {
    title: 'Task'
  }
}
</script>
