const MAX_PLAY_HISTORY = 30
const MAX_SEARCH_HISTORY = 15

let s = localStorage

// 保存类型
export const saveTypes = {
  searchHistory: 'searchHistory',
  favoriteId: '__favoriteId__',
  favorite: 'favorite',
  playHistory: 'playHistory',
  cookies: '__cookie__',
  user: '__user__'
}

export function addSearchHistory(query) {
  let h = getHistory(saveTypes.searchHistory)
  checkItem(h, query)
  s.setItem(saveTypes.searchHistory, JSON.stringify(h))
}

// 检查是否已存在
function checkItem(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      arr.splice(i, 1)
    }
  }
  if (arr.length >= MAX_SEARCH_HISTORY) arr.pop()
  arr.unshift(item)
}

export function getHistory(type) {
  let h
  try {
    h = JSON.parse(s.getItem(type))
  } catch (err) {
    h = []
  }
  return h || []
}

function getO(type) {
  let h
  try {
    h = JSON.parse(s.getItem(type))
  } catch (err) {
    h = {}
  }
  return h || {}
}

export function removeSearchHistory(index) {
  let h = getHistory(saveTypes.searchHistory)
  h.splice(index, 1)
  s.setItem(saveTypes.searchHistory, JSON.stringify(h))
}

// 添加一首歌到播放历史
export function insertPlayHistory(song) {
  try {
    let list = getHistory(saveTypes.playHistory)
    let index = list.findIndex((item) => {
      return song.id === item.id
    })
    if (index !== -1) {
      list.splice(index, 1)
    }
    let o = Object.assign({}, song)
    delete o.lyric
    list.unshift(o)
    if (list.length > MAX_PLAY_HISTORY) {
      list.pop()
    }
    s.setItem(saveTypes.playHistory, JSON.stringify(list))
  } catch (err) {
    console.log(err)
  }
}

// 删除一个播放历史
export function deletePlayHistory(song) {
  let list = getHistory(saveTypes.playHistory)
  let index = list.findIndex((item) => {
    return item.id === song.id
  })
  if (index !== -1) {
    list.splice(index, 1)
    s.setItem(saveTypes.playHistory, JSON.stringify(list))
  }
}

// 移除所有播放历史
export function removePlayHistory() {
  s.removeItem(saveTypes.playHistory)
}

// 取出/保存用户id
export function setUser({id}) {
  let user = getO(saveTypes.user)
  user.id = id
  s.setItem(saveTypes.user, JSON.stringify(user))
}

export function getUser() {
  return getO(saveTypes.user)
}

// 设置cookie
export function setCookie(arr) {
  let cookie
  if (typeof arr === 'string') {
    let index = arr.indexOf(';')
    cookie = arr.substring(0, index)
  } else {
    for (let i = 0; i < arr.length; i++) {
      let index = arr[i].indexOf(';')
      arr[i] = arr[i].substring(0, index)
    }
    cookie = arr.join('; ')
  }
  s.setItem(saveTypes.cookies, cookie)
}

// 获取cookie
export function getCookie() {
  return s.getItem(saveTypes.cookies) || ''
}
