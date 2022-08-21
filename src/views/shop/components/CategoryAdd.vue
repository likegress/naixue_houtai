<template lang="pug">
el-dialog(
  title="添加分类"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="80px")
    el-form-item(label="分类名称" prop="name")
      el-input(v-model="formData.name")
    el-form-item(label="分类标签" prop="tag")
      el-radio-group(v-model="formData.tag" size="small")
        el-radio(v-for="d in $store.getters.categoryTagList" :key="d" :label="d" @click.native.prevent="onTagClick(d)") {{ d }}
    el-form-item(label="分类描述" prop="desc")
      el-input(v-model="formData.desc" type="textarea")
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
        tag: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
    };
  },
  methods: {
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        name: '',
        tag: '',
        desc: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.axios.post('/category/add', {
          ...this.formData
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('分类添加成功');
            this.onCancel();
            this.$emit('confirm');
          }
        });
      });
    },
    onTagClick(v) {
      this.formData.tag === v ? (this.formData.tag = '') : (this.formData.tag = v);
    }
  }
}
</script>
