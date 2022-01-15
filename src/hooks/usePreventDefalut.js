export function usePreventDefault (scrollWrapper) {
  let startY = 0
  const touchStart = (e) => {
    startY = e.changedTouches[0].clientY
  }
  const touchMove = (e) => {
    const moveY = e.changedTouches[0].clientY
    const dx = startY - moveY
    // 阻止浏览器的默认处理事件
    if ((scrollWrapper.value.scrollTop === 0) && (dx < 0)) {
      e.preventDefault()
    }
  }
  const touchEnd = (e) => {
    startY = 0
  }
  return {
    touchStart,
    touchMove,
    touchEnd
  }
}
