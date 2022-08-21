<template lang="pug">
.product-search-form
  el-input(size="mini" v-model="formData.name" placeholder="请输入商品名称" clearable @clear="search")
  el-select(size="mini" v-model="formData.category_id")
    el-option(v-for="d in categoryList" :key="d.id" :label="d.name" :value="d.id")
  el-select(size="mini" v-model="formData.status")
    el-option(label="全部状态" :value="0")
    el-option(label="未提交" :value="1")
    el-option(label="待审核" :value="2")
    el-option(label="审核通过" :value="3")
    el-option(label="审核拒绝" :value="4")
  el-button(size="mini" type="primary" icon="el-icon-search" @click="search") 查找
  el-button(v-if="isSearch" size="mini" type="primary" icon="el-icon-refresh" @click="reset") 重置
  el-button(size="mini" type="primary" icon="el-icon-plus" @click="$emit('add')" v-if="p(['shop.product.create'])") 添加
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        category_id: 0,
        status: 0,
      }
    };
  },
  computed: {
    categoryList() {
      return [{ name: '全部分类', id: 0 }].concat(this.$store.getters.categoryList);
    },
    isSearch() {
      const { name, category_id, status } = this.formData;
      return name || category_id || status;
    }
  },
  methods: {
    reset() {
      this.formData = {
        name: '',
        category_id: 0,
        status: 0
      };
      this.$emit('search', {});
    },
    search() {
      this.$emit('search', this.formData);
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
  & > .el-select
    width: 150px
    margin-right: 10px
</style>
