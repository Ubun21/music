const mutations = {
  setPlayState (state, play) {
    state.playing = play
  },
  setPlayList (state, list) {
    state.playList = list
  },
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setFullScreen (state, full) {
    state.fullScreen = full
  },
  addFavourite (state, item) {
    state.favourite.push(item)
  },
  removeFavourite (state, item) {
    const index = state.favourite.findIndex((f) => f.id === item.id)
    if (index > -1) {
      state.favourite.splice(index, 1)
    }
  },
  setVisiual (state, payload) {
    state.visiual = payload
  }
}

export default mutations
