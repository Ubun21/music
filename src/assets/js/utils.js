export function shuffle (arr) {
  const map = arr.slice()
  for (let i = 0; i < map.length; i++) {
    const j = getRandomIdx(i)
    swap(map, i, j)
  }
  return map
}

function getRandomIdx (idx) {
  return Math.floor(Math.random() * (idx + 1))
}

function swap (arr, i, j) {
  const tem = arr[i]
  arr[i] = arr[j]
  arr[j] = tem
}
