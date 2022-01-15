export default function useShortcut (container, state, activeIdx, activeTitle) {
  const root = container.value
  const items = document.querySelectorAll('.index-wrapper .list-title')
  const options = {
    root
  }
  let isIntersec = false // 同一方向移动，只触发一次
  const callback = (entries, observer) => {
    if (!isIntersec) {
      isIntersec = true
      const { target } = entries[0]
      console.info(entries)
      console.info(target)
      const title = target.getAttribute('ground-name')
      activeTitle.value = title
      const index = state.indexs.indexOf(title)
      activeIdx.value = index
      return
    }
    isIntersec = false
  }
  const observer = new IntersectionObserver(callback, options)
  items.forEach((item) => {
    observer.observe(item)
  })
}
