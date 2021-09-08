import { computed } from 'vue'
import { useStore } from 'vuex'

export default function useFavorite () {
  const store = useStore()
  const favouriteList = computed(() => {
    return store.state.favourite
  })
  const getIconFavourite = (song) => {
    return isFavourite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  const isFavourite = (song) => {
    return favouriteList.value.findIndex(
      (fa) => fa.id === song.id) > -1
  }
  const changefavouriteStatus = (song) => {
    if (isFavourite(song)) {
      store.dispatch('removeFavourite', song)
    } else {
      store.dispatch('addfavourite', song)
    }
  }
  return {
    getIconFavourite,
    changefavouriteStatus
  }
}
