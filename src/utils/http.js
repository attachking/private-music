import $ from 'jquery'
import {AGENT} from './config'
import {getCookie} from '../common/js/storage'

export function jsonp(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'get',
      dataType: 'jsonp',
      jsonp: 'jsonpCallback',
      data: Object.assign({}, data),
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      }
    })
  })
}
export function post(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: AGENT + url,
      method: 'post',
      data: Object.assign({}, {
        cookies: getCookie()
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
export function get(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      method: 'get',
      data: data,
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      }
    })
  })
}
