import { ref } from 'vue'
import { TimeLine, Animation } from '../../lib/animation'
import { isCannotMoveable } from '../../assets/js/utils'

export default function useAnimation () {
  const animationWrapper = ref(null)
  const moveBox = ref(null)
  const opacityBox = ref(null)
  let startX = 0
  let startY = 0
  let width = 0
  let lastTranslateX = 0
  const activeIndex = ref(1)
  const opacity = ref(1)
  const timeLine = new TimeLine()
  const onMiddleStart = (e) => {
    width = animationWrapper.value.clientWidth
    startX = e.changedTouches[0].clientX
    startY = e.changedTouches[0].clientY
    const reg = /translateX\((-*\d+(\.\d+)*)px\)/
    const val = moveBox.value.style.transform.match(reg)
    const translateX = Number(val ? val[1] : 0)
    lastTranslateX = translateX
    moveBox.value.style.transform = `translateX(${lastTranslateX}px)`
  }
  const onMiddleMove = (e) => {
    const moveX = e.changedTouches[0].clientX
    const moveY = e.changedTouches[0].clientY
    const dx = moveX - startX
    // 只有从左到右和右到左可以移动,防止跟系统的上下滚动冲突
    if (isCannotMoveable(startX, startY, moveX, moveY)) {
      return
    }
    // 到达最左边时,从左到右被禁止移动
    if ((lastTranslateX === 0) && (dx > 0)) {
      return
    }
    // 到达最右边时,从右到左被禁止移动
    if ((lastTranslateX === -width) && (dx < 0)) {
      return
    }
    moveBox.value.style.transform = `translateX(${dx + lastTranslateX}px)`
    calcPercetage(dx)
  }
  const calcPercetage = (dx) => {
    const percetage = Number((dx / width).toFixed(2))
    if (dx < 0) {
      opacity.value = 1 + (percetage * 1)
    } else if (dx > 0) {
      opacity.value = percetage * 1
    }
  }
  const onMiddleEnd = (e) => {
    const moveX = e.changedTouches[0].clientX
    const moveY = e.changedTouches[0].clientY
    const dx = e.changedTouches[0].clientX - startX
    if (isCannotMoveable(startX, startY, moveX, moveY)) {
      return
    }
    if ((lastTranslateX === 0) && (dx > 0)) {
      return
    }
    if ((lastTranslateX === -width) && (dx < 0)) {
      return
    }
    // if (dx > 0) {
    //   debugger
    // }
    let direction = 0
    if (dx < 0) {
      direction = -1
      activeIndex.value = 2
      opacity.value = 0
    } else if (dx > 0) {
      opacity.value = 1
      activeIndex.value = 1
      direction = 0
    }
    const reg = /translateX\((-*\d+\.\d+)px\)/
    const val = moveBox.value.style.transform.match(reg)
    const translateX = Number(val ? val[1] : 0)
    const animation = new Animation(moveBox.value.style, 'transform', (v) => `translateX(${v}px)`,
      translateX, width * direction, 0, 0.3)
    // const opacityAnima = new Animation(opacityBox.value.style, 'opacity', (v) => v,
    //   opacityVal, opacityTem, 0, 0.3)
    timeLine.add(animation)
    // timeLine.add(opacityAnima)
    timeLine.start()
  }

  return {
    animationWrapper,
    moveBox,
    opacityBox,
    opacity,
    activeIndex,
    onMiddleStart,
    onMiddleMove,
    onMiddleEnd
  }
}
