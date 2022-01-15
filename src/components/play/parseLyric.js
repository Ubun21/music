// eslint-disable-next-line
const timeRegExp = /\[(\d{2}):([\d]{2})\.\d{2}\]([^\n]*)\n/g
// eslint-disable-next-line
const tiRegExp = /\[(\w*):([^\]]*)\]/g
let timeMapElementIdx = []
const notFindLyric = '该歌曲暂时无法获取歌词'

export default function parserLyric (str) {
  const lyric = {
    head: {},
    body: {}
  }
  if (str.indexOf(notFindLyric) > -1) {
    return {
      parsetedLyric: {
        head: {},
        body: {
          0: '该歌曲暂时无法获取歌词'
        }
      },
      timeMapElementIdx
    }
  }
  const [head, body] = str.split('[offset:0]')
  let result = null
  while ((result = tiRegExp.exec(head))) {
    const name = result[1]
    const val = result[2]
    lyric.head[name] = val
  }
  while ((result = timeRegExp.exec(body + '\n'))) {
    const minute = result[1]
    const seconds = result[2]
    const text = result[3]
    const time = Number(minute) * 60 + Number(seconds)
    if (text !== '') {
      lyric.body[time] = text
    }
  }
  const makeRange = (start, end) => {
    const arr = []
    let index = 0
    for (let i = start; i < end; i++) {
      arr[index] = i
      index++
    }
    return arr
  }
  // 举例:对象数字索引0到12之间只有0和12有值,就把[0, 12)填充为0的值
  const makeSparseToDense = (obj) => {
    const keys = Object.keys(obj)
    const arr = {}
    for (let i = 0; i < keys.length - 1; i++) {
      const preKey = keys[i]
      const nextKey = keys[i + 1]
      const value = obj[preKey]
      const rangIndexArr = makeRange(Number(preKey), Number(nextKey))
      rangIndexArr.forEach((idx) => {
        arr[idx] = {
          lyric: value,
          head: preKey
        }
      })
    }
    arr[keys[keys.length - 1]] = {
      lyric: obj[keys[keys.length - 1]],
      head: keys[keys.length - 1]
    }
    return arr
  }
  timeMapElementIdx = makeSparseToDense(lyric.body)
  return {
    parsetedLyric: lyric,
    timeMapElementIdx
  }
}
