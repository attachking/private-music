<template>
  <transition name="slide">
    <music-list :bgImage="coverImgUrl" :title="title" :songs="songs" :del="true" @delete="del"></music-list>
  </transition>
</template>
<script>
  import {post} from '../../utils/http'
  import {ERR_OK} from '../../utils/config'
  import {Song} from '../../common/js/clazz'
  import {mapGetters, mapActions} from 'vuex'
  import {saveTypes} from '../../common/js/storage'

  export default {
    data() {
      return {
        songs: [],
        title: '',
        coverImgUrl: ''
      }
    },
    computed: {
      ...mapGetters([
        'playList',
        'userDisc',
        'favorite'
      ]),
      isFavorite: {
        get() {
          return this.$route.params.id.toString() === localStorage.getItem(saveTypes.favoriteId).toString()
        }
      }
    },
    created() {
      if (!this.userDisc.id) {
        this.$router.replace({
          name: 'user'
        })
      } else {
        this.getDetail()
      }
    },
    methods: {
      ...mapActions([
        'getFavoriteList'
      ]),
      getDetail() {
        post('/playlist/detail', {
          id: this.$route.params.id
        }).then(data => {
          if (data.data.code === ERR_OK) {
            this.title = data.data.playlist.name
            this.coverImgUrl = data.data.playlist.coverImgUrl
            this.songs = data.data.playlist.tracks.map(item => new Song(item))
          }
        })
      },
      del(song, index) {
        post('/playlist/track', {
          pid: this.$route.params.id,
          tracks: song.id,
          op: 'del'
        }).then(data => {
          if (data.data.code === ERR_OK) {
            this.getDetail()
            if (this.isFavorite) {
              this.getFavoriteList()
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
