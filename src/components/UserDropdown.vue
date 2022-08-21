<template lang="pug">
.user-dropdown
  el-dropdown(@command="onUser")
    span.el-dropdown-link
      .el-avatar(:style="{ 'background-image': `url(${$store.getters.user.avatar})` }")
      | {{ $store.getters.user.username }}
      i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu.user-dropdown-menu(slot="dropdown")
        el-dropdown-item(command="changePw") 修改密码
        el-dropdown-item(command="logout") 退出登陆

  el-dialog(
    title="修改密码"
    :visible="showChangePw"
    width="400px"
    @close="onCancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  )
    el-form(ref="form" :model="formData" :rules="rules" label-width="100px")
      el-form-item(label="旧密码" prop="oldPassword")
        el-input(type="password" v-model="formData.oldPassword")
      el-form-item(label="新密码" prop="newPassword1")
        el-input(type="password" v-model="formData.newPassword1")
      el-form-item(label="确认新密码" prop="newPassword2")
        el-input(type="password" v-model="formData.newPassword2")
    .dialog-footer(slot="footer")
      el-button(@click="onCancel") 取消
      el-button(type="primary" @click="onChangePw") 确定
</template>

<script>
export default {
  data() {
    var validator = (rule, value, callback) => {
      if (value !== this.formData.newPassword1) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      showChangePw: false,
      formData: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword1: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newPassword2: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator, message: '两次输入密码不一致', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    logout() {
      this.axios.post('/logout').then(data => {
        if (!data.errcode) {
          this.$message.success(data.errmsg);
          this.$router.push('/login');
        }
      });
    },
    changePw() {
        this.showChangePw = true;
    },
    onUser(val) {
      this[val]();
    },
    onChangePw() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const { oldPassword, newPassword1 } = this.formData;
        this.axios.post('/password/reset', {
          old_password: oldPassword,
          new_password: newPassword1
        }).then(data => {
          if (!data.errcode) {
            this.$router.push('/login');
            this.$message.success('密码修改成功，请重新登陆');
          }
        });
      });
    },
    onCancel() {
      this.formData = {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      };
      this.showChangePw = false;
    }
  }
};
</script>

<style lang="sass">
.user-dropdown
  height: 40px
  .el-dropdown-link
    display: flex
    align-items: center
  .el-avatar
    margin-right: 7px
    border-radius: 50%
    background-repeat: no-repeat
    background-position: center
    background-size: cover

.user-dropdown-menu
  width: 100px
  .el-dropdown-menu__item
    text-align: center
</style>
