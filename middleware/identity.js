import Identity from '~/apollo/queries/identity_current'

const getCookieValue = (name) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)

export default async function ({app, store, apollo, redirect}) {
  console.log('[identity middleware]', 'start');
  // the following look directly for the cookie created by nuxtjs/auth
  // instead of using $auth.loggedIn
  if (process.client) {
    const token = getCookieValue('auth-token');
    // if there is no current user
    if (token && !store.state.identity.currentUser) {
      console.log('[identity middleware]', app.apolloProvider);
      console.log('[identity middleware]', token);
      // get the identity
      const identity = await app.apolloProvider.defaultClient.query({
        query: Identity,
        variables: {},
      })
      // console.log("identity", identity)
      // set current user
      store.commit("identity/setCurrentUser", identity.data.Identity)
      // let the user see the page
    } else if (token && store.state.identity.currentUser) {

    }
    else {
      console.log('[identity middleware]', 'no token');
      // redirect to homepage
      // redirect('/identity/login')
    }
  }
}
