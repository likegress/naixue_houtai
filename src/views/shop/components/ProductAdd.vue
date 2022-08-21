<template lang="pug">
el-dialog(
  title="添加商品"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="60px")
    el-form-item(label="名称" prop="name")
      el-input(v-model="formData.name")
    el-form-item(label="分类" prop="category_id")
      el-select(v-model="formData.category_id")
        el-option(v-for="d in $store.getters.categoryList" :key="d.id" :label="d.name" :value="d.id")
    el-form-item(label="标签" prop="tags")
      product-tag(v-model="formData.tags")
    el-form-item(label="图片" prop="pic")
      image-upload(v-model="formData.pic" width="225" height="150")
      .form-tip.el-alert--info.is-light 图片尺寸750px * 500px
    el-form-item(label="介绍" prop="detail")
      el-input(type="textarea" :autosize="{ minRows: 2 }" v-model="formData.detail")
    el-form-item(label="备注" prop="desc" type="textarea")
      el-input(v-model="formData.desc")
  .dialog-footer(slot="footer")
    el-button(@click="onCancel") 取消
    el-button(type="primary" @click="onConfirm") 确定
</template>

<script>
import ProductTag from './ProductTag.vue';
export default {
  components: { ProductTag },
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
        category_id: null,
        tags: [],
        pic: '',
        detail: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        pic: [{ required: true, message: '请设置图片', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
      },
    };
  },
  methods: {
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        name: '',
        category_id: null,
        tags: [],
        pic: '',
        detail: '',
        desc: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.axios.post('/product/add', {
          ...this.formData
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('商品添加成功');
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
.el-select
  width: 100%
</style>
