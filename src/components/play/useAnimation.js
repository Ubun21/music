import { ref } from 'vue'
import { TimeLine, Animation } from '../../lib/animation'

export default function useAnimation () {
  const animationWrapper = ref(null)
  const moveBox = ref(null)
  const opacityBox = ref(null)
  let startX = 0
  let width = 0
  let lastTranslateX = 0
  const opacity = ref(1)
  const timeLine = new TimeLine()
  const onMiddleStart = (e) => {
    width = animationWrapper.value.clientWidth
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
    const percetage = Number((dx / width).toFixed(2))
    if (dx < 0) {
      opacity.value = 1 + (percetage * 1)
    } else if (dx > 0) {
      opacity.value = percetage * 1
    }
  }
  const onMiddleEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX
    // if (dx > 0) {
    //   debugger
    // }
    let direction = 0
    let opacityTem = 0
    if (dx < 0) {
      direction = -1
      opacity.value = 0
      opacityTem = 0
    } else if (dx > 0) {
      opacityTem = 1
      opacity.value = 1
      direction = 0
    }
    const reg = /translateX\((-*\d+\.\d+)px\)/
    const val = moveBox.value.style.transform.match(reg)
    const opacityVal = Number(opacityBox.value.style.opacity)
    const translateX = Number(val ? val[1] : 0)
    console.info(opacityVal)
    console.info(opacityTem)
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
    onMiddleStart,
    onMiddleMove,
    onMiddleEnd
  }
}
