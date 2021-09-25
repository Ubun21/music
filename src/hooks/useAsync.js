import { ref } from 'vue'

export default function useAsync (asyncFn) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const excute = (para) => {
    loading.value = true
    return asyncFn(para)
      .then((res) => {
        debugger
        data.value = res
        loading.value = false
      }).catch((err) => {
        debugger
        error.value = err
        loading.value = false
      })
  }

  return { excute, data, loading, error }
}
