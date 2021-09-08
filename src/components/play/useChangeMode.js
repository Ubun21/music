import { computed } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '../../assets/js/constant'

export default function useChangeMode () {
  const store = useStore()
  const mode = computed(() => store.state.playMode)
  const modeIcon = computed(() => {
    return mode.value === PLAY_MODE.sequence
      ? 'icon-sequence'
      : mode.value === PLAY_MODE.loop
        ? 'icon-loop' : 'icon-random'
  })
  const changeMode = () => {
    const next = (mode.value + 1) % 3
    store.dispatch('setPlayMode', next)
  }

  return {
    modeIcon,
    changeMode
  }
}
