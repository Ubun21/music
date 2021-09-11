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

export function formate (interval) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}

export function toFixed2 (num) {
  if (typeof num !== 'number') {
    throw new Error('tofixed input must be number')
  }
  return Number(num.toFixed(2))
}
