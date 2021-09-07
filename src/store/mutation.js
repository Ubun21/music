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
  }
}

export default mutations
