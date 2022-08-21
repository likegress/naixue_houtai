<template lang="pug">
.product-search-form
  el-input(size="mini" v-model="formData.order_number" placeholder="请输入订单号" clearable @clear="search")
  el-checkbox-group(size="mini" v-model="formData.statusList" :min="1" :max="2")
    el-checkbox(:label="4") 已完成
    el-checkbox(:label="5") 已取消
  el-button(size="mini" type="primary" icon="el-icon-search" @click="search") 查找
  el-button(v-if="isSearch" size="mini" type="primary" icon="el-icon-refresh" @click="reset") 重置
</template>

<script>
export default {
  data() {
    return {
      formData: {
        order_number: '',
        statusList: [4, 5]
      }
    };
  },
  computed: {
    isSearch() {
      const { order_number, statusList } = this.formData;
      return order_number || !(statusList.includes(4) && statusList.includes(5));
    }
  },
  methods: {
    reset() {
      this.formData = {
        order_number: '',
        statusList: [4, 5]
      };
      this.$emit('search', {
        order_number: '',
        status: 0
      });
    },
    search() {
      const { order_number, statusList } = this.formData;
      this.$emit('search', {
        order_number,
        status: statusList.length === 1 ? statusList[0] : 0
      });
    }
  }
};
</script>

<style lang="sass">
.product-search-form
  padding-bottom: 20px
  & > .el-input
    width: 200px
    margin-right: 10px
  & > .el-checkbox-group
    width: auto
    margin-right: 10px
    .el-checkbox
      margin-right: 10px
</style>
