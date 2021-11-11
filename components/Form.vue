<template>
  <div>
    <button @click="open = true"
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      {{ mode }}
    </button>
    <div v-if="open">
      <!-- This example requires Tailwind CSS v2.0+ -->
      <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <!-- This element is to trick the browser into centering the modal contents. -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
              From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
              From: "opacity-100 translate-y-0 sm:scale-100"
              To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          -->
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:p-6">
            <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
              <button @click="open = false" type="button"
                      class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Close</span>
                <!-- Heroicon name: outline/x -->
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div v-if="$data.formSchema === null">
              <Spinner/>
            </div>
            <div v-if="$data.formSchema!==null">
              <form>
                <vue-form-generator v-if="$data.formSchema!==null" :schema="formSchema" :model="model" :options="formOptions"></vue-form-generator>
                <button type="button" @click="submit()"
                        class="inline-flex items-center px-2.5 py-1.5 border border-transparent font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    formModel: undefined,
    formEntity: null,
    formMode: null,
    formOptions: {
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true
    }
  },
  async mounted() {
    if (this.formMode) {
      this.mode = this.formMode
      this.model = this.formModel
    } else {
      this.mode = "create"
    }
    this.formSchema = await this.$axios.$get('api/schemas/' + this.formEntity + '.json')
  },
  data() {
    return {
      open: false,
      mode: "create",
      model: {},
      formSchema: null,
    }
  },
  methods: {
    async submit() {
      console.log(this.model)
      switch (this.mode) {
        case "create":
          this.res = await this.$axios.$post('api/' + this.formEntity)
          break
        case "update":
          this.res = await this.$axios.$put('api/' + this.formEntity + '/' + this.model.Id)
          break
        case "delete":
          this.res = await this.$axios.$delete('api/' + this.formEntity + '/' + this.model.Id)
          break
        default:
          console.log("err")
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
