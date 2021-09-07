import { PLAY_MODE } from '../assets/js/constant'
import { shuffle } from '../assets/js/utils'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayState', true)
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
