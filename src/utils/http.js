import $ from 'jquery'
import {AGENT} from './config'
import {getCookie, getUser} from '../common/js/storage'

export function post(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: AGENT + url,
      method: 'post',
      data: Object.assign({}, {
        cookies: getCookie(),
        uid: getUser().id
      }, data),
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      }
    })
  })
}
