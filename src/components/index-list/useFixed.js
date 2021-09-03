export default function useFixed(list) {
  const coll = list.value.children
  let height = 0
  const heights = new Map()
  const indexs = new Array()
  coll.forEach((el) => {
    heights.set(el.getAttribute('ground-name'), height)
    indexs.push(el.getAttribute('ground-name'))
    height += el.clientHeight
  })
  
  return {
    heights,
    indexs
  }
}