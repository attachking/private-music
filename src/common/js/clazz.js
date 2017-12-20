import {post} from '../../utils/http'
import {ERR_OK} from '../../utils/config'

export class Singer {
  constructor({id, name, img1v1Url}) {
    this.id = id
    this.name = name
    this.avatar = img1v1Url
  }
}

export class Song {
  constructor(opts) {
    this.id = opts.id
    if (opts.singer) {
      this.singer = opts.singer
    } else if (opts.ar) {
      this.singer = opts.ar.map(item => item.name).join('/')
    } else if (opts.artists) {
      this.singer = opts.artists.map(item => item.name).join('/')
    }
    this.name = opts.name
    this.album = opts.album || opts.al.name
    this.duration = opts.duration || opts.dt
    if (opts.image) {
      this.image = opts.image
    } else if (opts.al) {
      this.image = opts.al.picUrl
    } else if (opts.album && opts.album.artist) {
      this.image = opts.album.artist.img1v1Url
    }
    opts.url && (this.url = opts.url)
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      post('/music/lyric', {
        id: this.id
      }).then(res => {
        if (res.data.code === ERR_OK) {
          if (res.data.nolyric) {
            this.lyric = '暂无歌词~'
            reject(new Error(this.lyric))
          } else {
            this.lyric = res.data.lrc.lyric
            resolve(this.lyric)
          }
        } else {
          this.lyric = '暂无歌词~'
          reject(new Error(this.lyric))
        }
      }).catch(() => {
        this.lyric = 'no lyric'
        reject(new Error(this.lyric))
      })
    })
  }

  getUrl() {
    if (this.url) {
      return Promise.resolve(this.url)
    }
    return post('/music/url', {
      id: this.id
    }).then(data => {
      if (data.data.code === ERR_OK) {
        this.url = data.data.data[0].url
        return Promise.resolve(data.data.data[0].url)
      } else {
        return Promise.reject(data.data.code)
      }
    }).catch(err => {
      return Promise.reject(err)
    })
  }
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

// 时间格式化方法:dateFormat.call(Date, 'yyyy-MM-dd')
export function dateFormat(fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}
