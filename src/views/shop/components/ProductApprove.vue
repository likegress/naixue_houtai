<template lang="pug">
el-dialog(
  title="审核商品"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="80px")
    el-form-item(label="审核意见" prop="approve")
      <el-radio-group v-model="formData.approve">
        <el-radio :label="true" border>审核通过</el-radio>
        <el-radio :label="false" border>审核拒绝</el-radio>
      </el-radio-group>
    el-form-item(label="审核说明" prop="msg")
      el-input(type="textarea" v-model="formData.msg")
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
        approve: true,
        msg: ''
      },
      rules: {
        approve: [{ required: true, message: '请选择审核意见', trigger: 'blur' }]
      },
    };
  },
  methods: {
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        approve: true,
        msg: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.axios.post('/product/approve', {
          ...this.formData,
          id: this.id
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('已审核' + (this.formData.approve ? '通过' : '拒绝'));
            this.onCancel();
            this.$emit('confirm');
          }
        });
      });
    }
  }
}
</script>

<style lang="sass">
.el-radio-group
  display: flex
  justify-content: space-between
  width: 100%
  .el-radio.is-bordered
    flex: 0 0 130px
    margin: 0
    padding: 10px 20px
</style>
