<template lang="pug">
el-dialog(
  title="调整商品"
  :visible="value"
  width="425px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-form(ref="form" :model="formData" :rules="rules" label-width="85px")
    el-form-item(label="名称")
      el-input(v-model="name" disabled)
    el-form-item(label="上架时间" prop="sale_time")
      el-date-picker(type="datetime" v-model="formData.sale_time" value-format="yyyy-MM-dd HH:mm:ss")
    el-form-item(label="价格" prop="price")
      el-input(v-model="formData.price")
        template(slot="append") 元
    el-form-item(label="库存" prop="stock")
      el-input(v-model="formData.stock")
        template(slot="append") 元
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
    const checkPrice = (rule, value, callback) => {
      if (/^([0-9]\d*)(\.[0-9]{1,2})?$/.test(value)) {
        callback();
      } else {
        callback(new Error('价格应该为大于等于0的两位小数'));
      }
    };
    const checkStock = (rule, value, callback) => {
      if (/^0|[1-9][0-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error('库存应该为大于等于0的整数'));
      }
    };
    return {
      name: '',
      formData: {
        sale_time: '',
        price: '',
        stock: ''
      },
      rules: {
        sale_time: [{ required: true, message: '请设置上架时间', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { validator: checkStock, trigger: 'blur' }
        ],
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
      this.axios.get('/sale/detail?id=' + this.id).then(({ data }) => {
        this.name = data.name;
        this.formData = {
          sale_time: data.sale_time,
          price: data.price || '',
          stock: data.stock || ''
        };
      });
    },
    onCancel() {
      this.$refs.form.clearValidate();
      this.name = '';
      this.formData = {
        sale_time: '',
        price: '',
        stock: ''
      };
      this.$emit('input', false);
    },
    onConfirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        const { sale_time, price, stock } = this.formData;
        this.axios.post('/sale/adjust', {
          sale_time,
          price: Number(price),
          stock: Number(stock),
          id: this.id
        }).then(data => {
          if (!data.errcode) {
            this.$message.success('商品调整成功');
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
.el-date-editor.el-input
  width: 100%
</style>
