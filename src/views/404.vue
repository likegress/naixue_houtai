<template lang="pug">
.err-wrapper
  header
    h1 奈雪点单后台管理系统
    h2 SEEC2工作室
  .err
  .info
    h1 404
    el-button(@click="$router.push('/main/home')") 返回首页
    img(:src="'/img/404.gif?_=' + timestamp")
</template>

<script>
export default {
  data() {
    return {
      timestamp: +new Date()
    }
  }
};
</script>

<style lang="sass">
.err-wrapper
  header
    display: flex
    justify-content: space-between
    align-items: center
    height: 60px
    padding: 0 50px
    background: #409EFF
    color: #fff
    h1
      font-weight: bold
      font-size: 20px
    h2
      font-size: 16px
  .err
    background: #409EFF
    height: calc(50vh - 60px)
  .info
    position: fixed
    top: 10%
    left: 50%
    transform: translateX(-50%)
    & > *
      display: block
      margin: 0 auto
    h1
      font-size: 100px
      color: #fff
      font-weight: bold
      text-align: center
    img
      width: 456px
      height: 415px
      transform: scale(.6)
      transform-origin: 52% -5%
</style>
