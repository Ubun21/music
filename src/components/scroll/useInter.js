export default function isIntersection (parent, renfer, fn) {
  if (!(parent instanceof HTMLElement) ||
    !(renfer instanceof HTMLElement)) {
    return
  }
  const options = {
    root: parent
  }
  const callback = (entity) => {
    if (entity[0].isIntersecting) {
      fn()
    }
  }
  const oberver = new IntersectionObserver(callback, options)
  oberver.observe(renfer)
}
