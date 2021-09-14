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

export function angle (cx, cy, ex, ey) {
  var dy = ey - cy
  var dx = ex - cx
  var theta = Math.atan2(dy, dx)
  theta *= 180 / Math.PI
  return theta
}
export function angle360 (cx, cy, ex, ey) {
  var theta = angle(cx, cy, ex, ey)
  if (theta < 0) theta = 360 + theta
  return theta
}
export function isNotMove (ang) {
  // 0-28,333-360从左往右移动
  // 140-180从右往左移动
  let move = true
  if ((ang >= 0 && ang <= 28) || (ang >= 333 && ang <= 360)) {
    move = false
  }
  if (ang >= 140 && ang <= 190) {
    move = false
  }
  return move
}

export function isCannotMoveable (startX, startY, moveX, moveY) {
  const ang = angle360(startX, startY, moveX, moveY)
  const notMove = isNotMove(ang)
  return notMove
}
