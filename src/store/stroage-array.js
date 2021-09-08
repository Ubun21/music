import storage from 'good-storage'

export function addFavouriteStroage (key, item) {
  storage.set(key, item)
}

export function removeFavouriteStroage (key, item) {
  debugger
  const arr = storage.get(key, [])
  const index = arr.findIndex(child => child.id === item.id)
  if (index > -1) {
    arr.splice(index, 1)
  }
  storage.set(key, arr)
}
