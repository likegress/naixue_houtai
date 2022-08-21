<template lang="pug">
el-dialog(
  title="编辑商品"
  :visible="value"
  width="425px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="85px")
    el-form-item(label="名称" prop="name")
      el-input(v-model="formData.name")
    el-form-item(label="分类" prop="category_id")
      el-select(v-model="formData.category_id")
        el-option(v-for="d in $store.getters.categoryList" :key="d.id" :label="d.name" :value="d.id")
    el-form-item(label="创建时间" prop="create_time")
      el-date-picker(type="datetime" v-model="formData.create_time" value-format="yyyy-MM-dd HH:mm:ss")
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
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formData: {
        name: '',
        category_id: null,
        create_time: '',
        tags: [],
        pic: '',
        detail: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        create_time: [{ required: true, message: '请设置创建时间', trigger: 'blur' }],
        pic: [{ required: true, message: '请设置图片', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入介绍', trigger: 'blur' }],
      },
    };
  },
  watch: {
    value(v) {
      if (!v) return;
      this.getProductDetail();
    }
  },
  methods: {
    getProductDetail() {
      this.axios.get('/product/detail?id=' + this.id).then(({ data }) => {
        delete data.id;
        delete data.category_name;
        delete data.status;
        delete data.status_name;
        delete data.approve_msg;
        delete data.on_sale;
        this.formData = data;
      });
    },
    onCancel() {
      this.$refs.form.clearValidate();
      this.formData = {
        name: '',
        category_id: null,
        create_time: '',
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
        this.axios.post('/product/edit', {
          ...this.formData,
          id: this.id
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('商品编辑成功');
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
.el-select, .el-date-editor.el-input
  width: 100%
</style>
