import {post} from '../../utils/http'
import {ERR_OK} from '../../utils/config'

export class Singer {
  constructor({id, name, avatar}) {
    this.id = id
    this.name = name
    this.avatar = avatar
  }
}

export class Song {
  constructor(opts) {
    this.id = opts.id
    this.singer = opts.singer || opts.ar.map(item => item.name).join('/')
    this.name = opts.name || opts.name
    this.album = opts.album || opts.al.name
    this.duration = opts.duration || opts.dt
    this.image = opts.image || opts.al.picUrl
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

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) return '未知'
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
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
