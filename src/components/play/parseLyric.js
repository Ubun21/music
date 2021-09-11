// eslint-disable-next-line
const timeRegExp = /\[(\d{2}):([\d]{2})\.\d{2}\]([^\n]*)\n/g
// eslint-disable-next-line
const tiRegExp = /\[(\w*):([^\]]*)\]/g

export default function parserLyric (str) {
  const lyric = {
    head: {},
    body: {}
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
    lyric.body[time] = text
  }
  return lyric
}
