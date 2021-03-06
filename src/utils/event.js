export const EVENT_TYPES = {
  inputBlur: 'inputBlur',
  confirmHide: 'confirmHide',
  fullImg: 'fullImg',
  tip: 'tip'
}

// 仿照Vue的事件系统封装一个类
class Event {
  constructor() {
    this._listener = {}
  }

  $emit(name) {
    if (typeof name === 'undefined') return this
    if (typeof this._listener[name] === 'undefined') {
      _register.call(this, name)
    }
    for (let i = 0; i < this._listener[name].length; i++) {
      if (typeof this._listener[name][i] === 'function') {
        this._listener[name][i].apply(this, Array.prototype.slice.call(arguments).slice(1))
      }
    }
    return this
  }

  $on(name, fn) {
    if (typeof this._listener[name] === 'undefined') {
      _register.call(this, name)
    }
    for (let i = 0; i < this._listener[name].length; i++) {
      if (this._listener[name] === fn) {
        return this
      }
    }
    this._listener[name].push(fn)
    return this
  }

  $off(name, fn) {
    if (typeof name === 'undefined') return this
    if (this._listener[name]) {
      if (typeof fn === 'function') {
        for (let i = 0; i < this._listener[name].length; i++) {
          if (this._listener[name][i] === fn) {
            this._listener[name].splice(i, 1)
            break
          }
        }
      } else {
        this._listener[name] = []
      }
    }
    return this
  }
}

function _register(name) {
  this._listener[name] = []
}

export default new Event()
