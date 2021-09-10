import { ref } from 'vue'
import { TimeLine, Animation } from '../../lib/animation'

export default function useAnimation () {
  const moveBox = ref(null)
  let startX = 0
  let width = 0
  let lastTranslateX = 0
  const opacity = ref(1)
  const timeLine = new TimeLine()
  const onMiddleStart = (e) => {
    width = 375
    startX = e.changedTouches[0].clientX
    const reg = /translateX\((-*\d+(\.\d+)*)px\)/
    const val = moveBox.value.style.transform.match(reg)
    const translateX = Number(val ? val[1] : 0)
    lastTranslateX = translateX
    moveBox.value.style.transform = `translateX(${lastTranslateX}px)`
  }
  const onMiddleMove = (e) => {
    e.preventDefault()
    const dx = e.changedTouches[0].clientX - startX
    moveBox.value.style.transform = `translateX(${dx + lastTranslateX}px)`
    calcPercetage(dx)
  }
  const calcPercetage = (dx) => {
    const percetage = Number(dx / width).toFixed(2)
    if (dx < 0) {
      opacity.value = 1 + (percetage * 1)
    } else {
      opacity.value = percetage * 1
    }
  }
  const onMiddleEnd = (e) => {
    console.info(width)
    const dx = e.changedTouches[0].clientX - startX
    let direction = 0
    if (dx < 0) {
      direction = -1
      opacity.value = 0
    } else if (dx > 0) {
      opacity.value = 1
      direction = 0
    }
    const reg = /translateX\((-*\d+\.\d+)px\)/
    const translateX = Number(moveBox.value.style.transform.match(reg)[1])
    const animation = new Animation(moveBox.value.style, 'transform', (v) => `translateX(${v}px)`,
      translateX, width * direction, 0, 0.3)
    timeLine.add(animation)
    timeLine.start()
  }

  return {
    moveBox,
    opacity,
    onMiddleStart,
    onMiddleMove,
    onMiddleEnd
  }
}
