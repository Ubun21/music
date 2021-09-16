export default function intersectionObserver (root, target, callback) {
  const options = {
    root,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0
  }
  const observer = new IntersectionObserver(callback, options)
  const startObserver = () => {
    observer.observe(target)
  }
  const stopObserver = () => {
    observer.unobserve(target)
  }
  return {
    startObserver,
    stopObserver
  }
}
