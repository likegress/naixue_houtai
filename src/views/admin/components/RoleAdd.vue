<template lang="pug">
el-dialog(
  title="添加角色"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="80px")
    el-form-item(label="角色名称" prop="name")
      el-input(v-model="formData.name")
    el-form-item(label="角色描述" prop="desc")
      el-input(type="textarea" v-model="formData.desc")
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
    }
  },
  data() {
    return {
      formData: {
        name: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
    };
  },
  methods: {
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        name: '',
        desc: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.axios.post('/role/add', {
          ...this.formData
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('角色添加成功');
            this.onCancel();
            this.$emit('confirm');
          }
        });
      });
    }
  }
}
</script>
