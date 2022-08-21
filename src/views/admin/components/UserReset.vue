<template lang="pug">
el-dialog(
  title="重置用户密码"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="60px")
    el-form-item(label="密码" prop="password")
      el-input(v-model="formData.password" type="password" show-password)
      el-button(size="mini" @click="random") 生成随机密码
  .dialog-footer(slot="footer")
    el-button(@click="onCancel") 取消
    el-button(type="primary" @click="onConfirm") 确定
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        password: ''
      },
      rules: {
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        password: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.axios.post('/user/password', {
          ...this.formData,
          id: this.id
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('用户密码重置成功');
            this.onCancel();
          }
        });
      });
    },
    random() {
      const pw = Math.random().toFixed(6).slice(-6);
      this.formData.password = pw;
      this.$alert(`随机密码为：${pw}`, { confirmButtonText: '知道了' });
    }
  }
}
</script>

<style lang="sass">

</style>
