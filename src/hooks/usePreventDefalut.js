/**
 * 在滚动的某些情况下，阻止浏览器的的默认行为
 * @param {HTMLElement} scrollWrapper - 滚动的容器
 * @param {boolean} isDown - 向下滚动阻止默认行为
 * */
export function usePreventDefault (scrollWrapper, isDown = true) {
  let startY = 0
  const touchStart = (e) => {
    startY = e.changedTouches[0].clientY
  }
  const touchMove = (e) => {
    const moveY = e.changedTouches[0].clientY
    const dy = startY - moveY
    // 阻止浏览器的默认处理事件
    if ((scrollWrapper.value.scrollTop === 0) && (dy < 0)) {
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
