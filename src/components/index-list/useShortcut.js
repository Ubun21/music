export default function useShortcut (container, state) {
  const root = container.value
  const items = document.querySelectorAll('.index-wrapper .list-title')
  const options = {
    root,
    rootMargin: '-3% 0% 0% 0%',
    threshold: 0
  }
  const callback = (entries, observer) => {
    const { boundingClientRect, target } = entries[0]
    // console.info(entries)
    if (boundingClientRect.y < 50) {
      // console.info(target)
      const index = state.indexs.indexOf(target.getAttribute('ground-name'))
      state.activeIdx = index
    }
  }
  const observer = new IntersectionObserver(callback, options)
  items.forEach((item) => {
    observer.observe(item)
  })
}
