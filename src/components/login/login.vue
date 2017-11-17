<template>
  <div class="login">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="title">
      <div class="icon"></div>
      <h1 class="text">用户登录</h1>
    </div>
    <div class="item">
      <span class="label">手机号:</span>
      <input v-model.trim="phone" type="text" class="box" placeholder="请输入手机号" @focus="focus" @blur="blur" ref="phone">
    </div>
    <div class="item">
      <span class="label">密码:</span>
      <input v-model.trim="password" type="password" class="box" placeholder="请输入密码" @focus="focus" @blur="blur" ref="password" @keydown.enter="login">
    </div>
    <div class="item">
      <input type="button" :value="text" class="button" @click="login" :disabled="isLoading">
    </div>
    <top-tip ref="topTip">
      <div class="tip-title">
        <span class="text">{{tip}}</span>
      </div>
    </top-tip>
  </div>
</template>
<script>
  import {post} from '../../utils/http'
  import {setCookie} from '../../common/js/storage'
  import {mapActions, mapMutations} from 'vuex'
  import event, {EVENT_TYPES} from '../../utils/event'

  export default {
    data() {
      return {
        phone: '',
        password: '',
        tip: '',
        text: '登陆',
        isLoading: false
      }
    },
    methods: {
      login() {
        if (this.isLoading) return
        if (this.phone === '' || this.password === '') {
          this.tip = '用户名或密码不能为空'
          this.$refs.topTip.show()
          return
        }
        this.isLoading = true
        this.text = '提交中...'
        post('/login/phone', {
          phone: this.phone,
          password: this.password
        }).then(data => {
          if (data.data.code !== 200) {
            this.tip = '帐号或密码错误'
            this.$refs.topTip.show()
            this.isLoading = false
            this.text = '登陆'
          } else {
            setCookie(data.cookies)
            this.setUserInfo({
              id: data.data.account.id
            })
            event.$emit(EVENT_TYPES.tip, '登陆成功!')
            this.$router.replace({
              name: 'user'
            })
          }
        })
      },
      back() {
        this.$router.go(-1)
      },
      focus() {
        this.setFocus(true)
      },
      blur() {
        this.setFocus(false)
      },
      inputBlur() {
        this.$refs.phone.blur()
        this.$refs.password.blur()
      },
      ...mapActions([
        'setUserInfo'
      ]),
      ...mapMutations({
        setFocus: 'SET_FOCUS'
      })
    },
    created() {
      event.$on(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    activated() {
      event.$on(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    deactivated() {
      event.$off(EVENT_TYPES.inputBlur, this.inputBlur)
    },
    beforeDestroy() {
      event.$off(EVENT_TYPES.inputBlur, this.inputBlur)
    }
  }
</script>
<style scoped lang="less">
  @import "../../common/styles/_vars.less";
  @import "../../common/styles/_mixin.less";

  .login{
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: @color-background;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .title{
      text-align: center;
      margin: 30px 0 10px 0;
      .icon{
        display: inline-block;
        vertical-align: top;
        margin-top: 6px;
        width: 30px;
        height: 32px;
        margin-right: 9px;
        .bg-image('../../components/m-header/logo');
        background-size: 30px 32px;
      }
      .text{
        display: inline-block;
        vertical-align: top;
        line-height: 44px;
        font-size: @font-size-large;
        color: @color-theme;
      }
    }
    .item{
      text-align: center;
      padding: 15px 0;
      .label{
        display: inline-block;
        padding-right: 5px;
        color: @color-theme;
        min-width: 15%;
        text-align: right;
      }
    }
    .box{
      flex: 1;
      margin: 0 5px;
      padding: 4px 4px;
      line-height: 18px;
      border-radius: 5px;
      background: @color-highlight-background;
      color: @color-text;
      font-size: @font-size-medium;
      width: 50%;
      &::placeholder{
        color: @color-text-d;
      }
    }
    .button{
      padding:8px 50px;
      border-radius: 4px;
      background: @color-theme;
      color: #fff;
      &:active{
        background: @color-theme-d;
      }
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .text {
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
  }
</style>
