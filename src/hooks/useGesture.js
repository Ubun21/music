import enableGesture from '@/lib/gesture'

export default function useGesture (el, actions) {
  if (!(el instanceof HTMLElement)) {
    throw new Error('el must be html node')
  }
  enableGesture(el)
  el.addEventListener('tap', () => {
    actions()
  })
}
