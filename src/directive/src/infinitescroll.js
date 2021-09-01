import { nextTick } from '@vue/runtime-core'
import throttle from 'lodash/throttle'

const InfiniteScroll = {
  async mounted (el, binding) {
    await nextTick()
    const { value: cb } = binding
    el.addEventListener('scroll', throttle(() => {
      // console.info('scroll')
      const { scrollHeight, scrollTop, offsetHeight } = el
      const distance = scrollHeight - scrollTop
      //  console.info(distance)
      if (distance <= offsetHeight) {
        console.info('distance', distance)
        console.info('offsetHeight', offsetHeight)
        cb()
      }
    }))
  }
}

export default InfiniteScroll
