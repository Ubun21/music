import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/utils'
import { addFavouriteStroage, removeFavouriteStroage } from './stroage-array'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayState', false)
  commit('setPlayList', list)
  commit('setSequenceList', list)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

export function randomPlay ({ commit }, list) {
  commit('setPlayState', true)
  commit('setPlayList', shuffle(list))
  commit('setSequenceList', list)
  commit('setPlayMode', PLAY_MODE.random)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}

export function setFullScreen ({ commit }, full) {
  commit('setFullScreen', full)
}

export function setPlayState ({ commit }, state) {
  commit('setPlayState', state)
}

export function setCurrentIndex ({ commit }, index) {
  commit('setCurrentIndex', index)
}

export function setPlayMode ({ commit, state, getters }, mode) {
  const currentSongId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  const currentIndex = state.playList.findIndex((item) => item.id === currentSongId)
  commit('setPlayMode', mode)
  commit('setCurrentIndex', currentIndex)
}

const key = 'favorite'
export function addfavourite ({ commit, state }, item) {
  commit('addFavourite', item)
  addFavouriteStroage(key, state.favourite)
}

export function removeFavourite ({ commit }, item) {
  commit('removeFavourite', item)
  removeFavouriteStroage(key, item)
}
