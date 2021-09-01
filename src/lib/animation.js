/* eslint-disable */

const liner = (t) => t

export class Animation {
  constructor(object, property, template ,start, end, delay, duration, timeFunction) {
    this.object = object
    this.property = property
    this.template = template
    this.start = start
    this.end = end
    this.delay = delay ?? 0 
    this.duration = duration
    this.timeFunction = timeFunction || liner
  }

  valueFromProcession(procession) {
    return this.start + (this.end - this.start) * procession
  }
}

export class ColorAnimation {
  constructor(object, property, template ,start, end, delay, duration, timeFunction) {
    this.object = object
    this.property = property
    this.template = template
    this.start = start
    this.end = end
    this.delay = delay ?? 0 
    this.duration = duration
    this.timeFunction = timeFunction || liner
  }

  valueFromProcession(procession) {
    return {
      r: this.start.r + (this.end.r - this.start.r) * procession,
      g: this.start.g + (this.end.g - this.start.g) * procession,
      b: this.start.b + (this.end.b - this.start.b) * procession,
      a: this.start.a + (this.end.a - this.start.a) * procession,
    }
  }
}

export class TimeLine {
  constructor() {
    this.animations = []
    this.requestID = null
    this.startTime = 0
    this.state = 'init'
  }

  tick() {
    let t = (Date.now() - this.startTime) / 1000
    let animations = this.animations.filter((animation) => !animation.fished)
    for (let animation of animations) {
      const {object, property, template, start, end, delay, duration, timeFunction, addTime} = animation

      if (t <= delay) {
        continue
      }

      if (t > duration + delay + addTime) {
        animation.fished = true
        let index = this.animations.indexOf(animation)
        this.animations.splice(index, index + 1)
        t = duration + delay + addTime
      }

      let procession = timeFunction((t - delay - addTime) / duration)
      let moveX = animation.valueFromProcession(procession)
      object[property] = template(moveX)
    }

    if (animations.length) {
      this.requestID = requestAnimationFrame(() => {
        this.tick()
      })
    } else {
      this.requestID = null
    }
  }

  add(animation, addTime) {
    this.animations.push(animation)
    if (this.state === 'playing' && this.requestID === null) {
      this.tick();
    }
    if (this.state === 'playing' || this.state === 'paused') {
      animation.addTime = addTime !== undefined ? addTime : (Date.now() - this.startTime) / 1000
    } else {
      animation.addTime = addTime !== undefined ? addTime : 0
    }
  }

  start() {
    if (this.state !== 'init') return
    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }

  pause() {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this.pauseTime = Date.now()
    cancelAnimationFrame(this.requestID)
  }

  resume() {
    if (this.state !== 'paused') return
    this.state = 'playing'
    this.startTime = Date.now() - (this.pauseTime - this.startTime)
    this.tick()
  }

  restart() {
    if (this.state === 'playing') {
      this.pause()
    }
    this.animations.forEach(a => a.fished = false)
    this.startTime = Date.now()
    this.state = 'playing'
    this.pauseTime = 0
    this.requestID = null
  }

  reset() {
    this.info = 'reset'
    if (this.state !== 'paused') return
    this.animations = []
    this.state = 'init'
    this.requestID = null
  }
}