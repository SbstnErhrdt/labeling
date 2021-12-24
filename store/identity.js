export const state = () => ({
  currentUser: null
})

export const mutations = {
  setCurrentUser(state, newUser) {
    state.currentUser = newUser
  },
  removeCurrentUser(state) {
    state.currentUser = null
  }
}
