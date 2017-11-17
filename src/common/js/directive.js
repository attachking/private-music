import event, {EVENT_TYPES} from '../../utils/event'

// 自定义指令，点击放大图片
export default {
  install: (Vue) => {
    Vue.directive('img', {
      bind(el, binding, vnode) {
        el.addEventListener('click', (e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation()
          } else {
            window.event.cancelBubble = true
          }
          event.$emit(EVENT_TYPES.fullImg, binding.value)
        }, false)
      }
    })
  }
}
