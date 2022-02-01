<template>
  <div>
    <div>
      <div v-if="errs.length !== 0">
        <h3 class="text-xl text-red-700">Form Error</h3>
        <ul>
          <li v-for="(err, index) in errs">
            {{err}}
          </li>
        </ul>
      </div>
      <div v-if="errs.length === 0">
        <form>
          <vue-form-generator v-if="formSchema!==null" :schema="formSchema" :model="model"
                              :options="formOptions"></vue-form-generator>
          <button type="button" @click="submit()"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    entityEndpoint: '',
    formMutation: null,
    formMode: null,
    formModel: null,
    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true
    },
    formSchema: null,
  },
  async mounted() {
    // check if necessary stuff is loaded
    if(this.formMutation === null || this.formMutation === undefined) {
      this.errs.push("no form mutation found")
    }
    if(this.formSchema === null || this.formSchema === undefined) {
      this.errs.push("no form schema found")
    }
    this.model = Object.assign({}, this.formModel)
  },
  data() {
    return {
      loading: false,
      model: {},
      errs: [],
    }
  },
  methods: {
    async submit() {
      try {
        this.loading = true;
        const res = await this.$apollo.mutate({
          mutation: this.formMutation,
          variables: {"data":this.model},
        })
        if (res?.data) {
          this.$toast.success('successful', {
            duration: 1000,
          })
          // emit to parent
          this.$emit('handleResponse', res.data)
        } else {
          this.$toast.error('can not parse response', {
            duration: 1000,
          })
          this.loading = false;
        }
      } catch (e) {
        console.error('errors', e.graphQLErrors)
        this.$toast.error(e.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 5000,
        })
        this.loading = false;
      }
    }
  }
}
</script>

<style>
.vue-form-generator fieldset {
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.vue-form-generator fieldset legend {
  display: block;
}
</style>
