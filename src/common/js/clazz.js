import {post} from '../../utils/http'
import {ERR_OK} from '../../utils/config'

export class Singer {
  constructor({id, name}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}

export class Song {
  constructor({id, al, ar, dt, name}) {
    this.id = id
    this.singer = ar.map(item => item.name).join('/')
    this.name = name
    this.album = al.name
    this.duration = dt
    this.image = al.picUrl
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return post('/music/lyric', {
      id: this.id
    }).then(res => {
      if (res.data.code === ERR_OK) {
        this.lyric = res.data.lrc.lyric
        return Promise.resolve(this.lyric)
      } else {
        return Promise.reject(new Error('error format'))
      }
    }).catch((err) => {
      this.lyric = 'no lyric'
      return Promise.reject(err)
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
