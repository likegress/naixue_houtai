<template lang="pug">
.login-wrapper
  header
    h1 奈雪点单后台管理系统
    h2 SEEC2工作室
  .login
    .form
      owl-login(:password="closeEye")
      el-form(
        label-width="0"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      )
        el-form-item(prop="username")
          el-input(
            placeholder="用户名"
            v-model="loginForm.username"
          )
            template(#prefix)
              i.icon.el-icon-user
        el-form-item(prop="password")
          el-input(
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            @focus="closeEye = true"
            @blur="closeEye = false"
          )
            template(#prefix)
              i.icon.el-icon-lock
        el-form-item(prop="code")
          el-input(
            maxlength="4"
            placeholder="验证码"
            v-model="loginForm.code"
            @keyup.enter.native="login"
          )
            template(#prefix)
              i.icon.el-icon-mobile-phone
            template(#append)
              el-tooltip(content="点击刷新" placement="top")
                .captcha(v-html="captcha" @click="getCaptcha")
        .el-form-btn
          el-popover(
            width="230"
            placement="top"
            trigger="click"
            content="忘记密码，请联系管理员重置"
          )
            template(#reference)
              el-button(type="text") 忘记密码？
          el-button(
            type="primary"
            @click="login"
            :loading="loading"
          ) 登录
</template>

<script>
import { resetRouter } from '../router';
import store from '../store';
import OwlLogin from '@/components/OwlLogin.vue';
export default {
  components: { OwlLogin },
  data() {
    return {
      redirect: this.$route.query.redirect,
      loading: false,
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      closeEye: false,
      captcha: ''
    };
  },
  created() {
    this.getCaptcha();
  },
  methods: {
    getCaptcha() {
      this.axios.get('/captcha').then(data => {
        this.captcha = data.data;
      });
    },
    login() {
      if (this.loading) return;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.axios.post('/login', {
            ...this.loginForm
          }).then(data => {
            if (!data.errcode) {
              resetRouter();
              store.dispatch('getUser').then(() => {
                this.$router.push(
                  this.redirect ? this.redirect : '/main/home'
                );
              });
            } else {
              this.loading = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="sass">
.login-wrapper
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
  .login
    background: #409EFF
    height: 200px
  .form
    position: relative
    top: 100px
  .el-form
    width: 400px
    margin: 0 auto
    background: #fff
    padding: 30px
    border: 1px solid #ddd
    .el-form-btn
      display: flex
      justify-content: space-between
      margin: 0 -30px -30px
      padding: 15px 30px
      border-top: 1px solid #e4e4e4
      background-color: #f7f7f7
    .el-input-group__append
      padding: 0 10px
    .el-input--prefix .el-input__inner
      padding-left: 36px
    .captcha
      width: 90px
      height: 30px
      cursor: pointer
      svg
        width: 100%
        height: 100%
    .el-input__prefix
      width: 30px
      line-height: 36px
      i.icon
        font-size: 15px
</style>
