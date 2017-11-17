<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li :key="item" class="search-item" @click="selectItem(item)" v-for="(item, index) in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(index)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>
<script>
  export default {
    name: 'search-list',
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(index) {
        this.$emit('delete', index)
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .search-list{
    .search-item{
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      &.list-enter-active, &.list-leave-active{
        transition: all 0.1s;
      }
      &.list-enter, &.list-leave-to{
        height: 0;
      }
      .text{
        flex: 1;
        color: @color-text-l;
      }
      .icon{
        .extend-click();
        .icon-delete{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
</style>
