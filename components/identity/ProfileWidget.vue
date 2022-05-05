<template>
  <div class="relative">
    <!-- Loading -->
    <div v-if="loading"
         class="absolute top-0 right-0 bottom-0 left-0 opacity-80 backdrop-blur-0 bg-white text-center">
      <Spinner></Spinner>
    </div>
    <div v-if="!loading">
      <div class="py-3">
        <h1 class="text-2xl">Edit Profile</h1>
      </div>
      <div>
        <Form :formSchema="$data.form"
              :formModel="$data.identity"
              :formMutation="$data.mutation"
              formButtonText="Update Profile"
              @handleResponse="handleResponse">
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import Identity from './apollo/queries/identity_current.graphql'
import updateIdentity from './apollo/mutations/identity_update.graphql'


export default {
  middleware: 'authenticated',
  data() {
    return {
      mutation: updateIdentity,
      identity: null,
      loading: true,
      form: {
        'groups': [
          {
            'legend': 'User',
            'fields': [
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'UID',
                'model': 'UID',
                'id': 'UID',
                'featured': false,
                'required': true,
                'visible': false,
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Salutation',
                'model': 'salutation',
                'id': 'salutation',
                'placeholder': 'e.g. Dr.',
                'featured': false,
                'required': false
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'First name',
                'model': 'firstName',
                'id': 'firstName',
                'placeholder': 'e.g. John',
                'featured': false,
                'required': true
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Last name',
                'model': 'lastName',
                'id': 'lastName',
                'placeholder': 'e.g. Doe',
                'featured': false,
                'required': true
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Email',
                'model': 'email',
                'id': 'email',
                'placeholder': 'e.g. john.doe@mail.com',
                'featured': false,
                'required': true
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Backup Email',
                'model': 'backupEmail',
                'id': 'backupEmail',
                'placeholder': 'e.g. john.doe@mail.com',
                'featured': false,
                'required': false
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Phone',
                'model': 'phone',
                'id': 'phone',
                'placeholder': 'e.g. +49 1234 5678',
                'featured': false,
                'required': false
              },
              {
                'type': 'input',
                'inputType': 'text',
                'label': 'Backup Phone',
                'model': 'backupPhone',
                'id': 'backupPhone',
                'placeholder': 'e.g. +49 1234 5678',
                'featured': false,
                'required': false
              },
            ]
          }
        ]
      }
    }
  },
  computed: {},
  async mounted() {
    await this.getIdentity();
  },
  methods: {
    async getIdentity() {
      try {
        const res = await this.$apollo.query({
          query: Identity,
          variables: {},
          fetchPolicy: 'no-cache',
        });
        this.identity = res.data.Identity;
        // set current user
        this.$store.commit('identity/setCurrentUser', this.identity)
        this.loading = false;
      } catch (e) {
        console.log('errors', e.graphQLErrors)
        this.$toast.error(e.graphQLErrors.map(e => e['message'] + ' ' || '').join(''), {
          duration: 3000,
        })
        this.loading = false;
      }
    },
    handleResponse(res) {
      // re fetch identity
      this.$store.commit('identity/setCurrentUser', res.updateIdentity)
    },
  },
}</script>
