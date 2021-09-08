import storage from 'good-storage'

const key = 'favourite'
storage.set(key, [])

export function addFavourite (item) {
  const arr = storage.get(key)
  arr.push(item)
  storage.set(key, arr)
  return arr
}

export function removeFavourite (item) {
  const arr = storage.get(key)
  const index = arr.findIndex((child) => child.id === item.id)
  if (index > -1) {
    arr.splice(index, 1)
  }
  storage.set(key, arr)
  return arr
}