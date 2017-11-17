import {mapGetters, mapActions} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.$nextTick(() => {
      this.handlePlayList(this.playList)
    })
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const searchMixin = {
  data() {
    return {
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'insertHistory',
      'deleteSearch',
      'removeAllSearch'
    ]),
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.insertHistory(this.query)
    },
    addQuery(k) {
      this.query = k
    },
    deleteSearchHistory(i) {
      this.deleteSearch(i)
    },
    clearSearchHistory() {
      this.removeAllSearch()
    },
    showConfirm() {
      this.$refs.confirm.show()
    }
  }
}
