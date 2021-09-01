/* eslint-disable */
export default function enableGesture(el) {
  let contexts = Object.create(null)
  let MOUSE = Symbol('mouse')

  document.addEventListener('contextmenu',(e) => e.preventDefault());
  document.addEventListener('selectstart',e => e.preventDefault());
  // 这里需要手动将 `passive` 可选项设置为 false，因为在某些浏览器中（fireFox 和 chrome）会默认设置为 `true`，从而使监听方法中无法调用 preventDefault
  document.addEventListener('touchmove', e => e.preventDefault(), {passive: false});
  let start = (point, context) => {
    context.startX = point.clientX
    context.startY = point.clientY
    
    let event = new CustomEvent('start', {
      detail: {
        startX: point.clientX,
        startY: point.clientY
      }
    })
    el.dispatchEvent(event)

    // tap 快速点击一下 有2个事件tap start 和 tap end
    // pan 点击一下后移动一段距离，一般设置为10px, 有3个事件 panstart panmove panend
    // fclick 从panmove到panend的时候 速度大于一个值 
    // press 按住屏幕不动超过一段时间，一般设置为0.5秒
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.timeID = setTimeout(() => {
      if (context.isPan) return
      context.isTap = false
      context.isPan = false
      context.isPress = true
      let event = new CustomEvent('pressstart', {
        detail: {
          startX: context.startX,
          startY: context.startY,
        }
      })
      el.dispatchEvent(event)
    }, 500)
  }

  let move = (point, context) => {
    let { startX, startY } = context
    let dx = point.clientX - startX
    let dy = point.clientY - startY
    
    // 直角斜边公式
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true
      context.isTap = false
      context.isPress = false
      context.moves = []
      let event = new CustomEvent('panstart', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        }
      })
      el.dispatchEvent(event)
    }

    if (context.isPan) {
      context.moves.push({dx, dy, t: Date.now()})
      context.moves = context.moves.filter(record => Date.now() - record.t < 300)
      let event = new CustomEvent('panmove', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        }
      })
      el.dispatchEvent(event)
    }
  }

  let end = (point, context) => {
    if (context.isPan) {
      let disX = point.clientX - context.startX
      let disY = point.clientY - context.startY

      let record = context.moves[0]

      let distance = Math.sqrt((record.dx - disX) ** 2 + (record.dy - disY) ** 2)
      let t = (Date.now() - record.t) 
      let speed = distance / t
      if (speed > 1) {
        context.isPan = false
        context.isPress = false
        context.isTap = false

        context.isFclick = true
        let event = new CustomEvent('fclick', {
          detail: {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY
          }
        })
        el.dispatchEvent(event)
      }
    }
    if (context.isTap) {
      let event = new CustomEvent('tap', {
        detail: {
          startX: context.startX,
          startY: context.startY
        }
      })
      console.info('tap')
      el.dispatchEvent(event)
    }
    if (context.isPress) {
      let event = new CustomEvent('pressend', {
        startX: context.startX,
        startY: context.startY
      })
      el.dispatchEvent(event)
    }
    if (context.isPan) {
      let event = new CustomEvent('panend', {
        detail: {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isFclick: false
        }
      })
      el.dispatchEvent(event)
    }
    clearTimeout(context.timeID)
  }

  let cancel = () => {
    console.info('touch event cancel')
  }

  // todo 移动端是移除
  if (true) {
    el.addEventListener('mousedown', (event) => {
      contexts[MOUSE] = Object.create(null)
      console.info('mouseDown')
      start(event, contexts)
      let mousemove = (event) => {
        move(event, contexts)
      }
      let up = (event) => {
        end(event, contexts)
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', mousemove)
      document.addEventListener('mouseup', up)
    })
  }

  el.addEventListener('touchstart', (e)=> {
    for (let touch of e.changedTouches) {
      contexts[touch.identifier] = Object.create(null)
      console.info('touch beigin')
      start(touch, contexts[touch.identifier])
    }
  })

  el.addEventListener('touchmove', (e)=> {
    for (let touch of e.changedTouches) {
      move(touch, contexts[touch.identifier])
    }
  })

  el.addEventListener('touchend', (e)=> {
    for (let touch of e.changedTouches) {
      end(touch, contexts[touch.identifier])
      delete contexts[touch.identifier]
    }
  })

  el.addEventListener('touchcancel', (e)=> {
    for (let touch of e.changedTouches) {
      cancel(touch)
    }
  })
}