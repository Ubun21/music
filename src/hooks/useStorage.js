import storage from 'good-storage'
import { ref, watchEffect } from 'vue'

export function useStorage (key, val) {
  const exitInStorage = storage.get(key)
  const wrapperVal = exitInStorage ? ref(exitInStorage) : ref(val)
  // if (!exitInStorage) {
  //   storage.set(key, wrapperVal.value)
  // }
  watchEffect(() => {
    storage.set(key, wrapperVal.value)
  })
  return wrapperVal
}
