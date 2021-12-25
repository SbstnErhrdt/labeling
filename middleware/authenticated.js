export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.identity.currentUser) {
    return redirect('/identity/login')
  }
}
