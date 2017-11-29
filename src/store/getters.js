export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = state => state.playList[state.currentIndex] || {}

export const disc = state => state.disc

export const topList = state => state.topList

export const focus = state => state.focus

export const searchHistory = state => state.searchHistory

export const favorite = state => state.favorite

export const playHistory = state => state.playHistory

export const playListShow = state => state.playListShow

export const addSongShow = state => state.addSongShow

export const confirmShow = state => state.confirmShow

export const userDisc = state => state.userDisc

export const userPlayList = state => state.userPlayList
