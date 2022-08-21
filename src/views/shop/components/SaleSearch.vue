<template lang="pug">
.sale-search-form
  el-input(size="mini" v-model="formData.name" placeholder="请输入商品名称" clearable @clear="search")
  el-select(size="mini" v-model="formData.category_id")
    el-option(v-for="d in categoryList" :key="d.id" :label="d.name" :value="d.id")
  el-button(size="mini" type="primary" icon="el-icon-search" @click="search") 查找
  el-button(v-if="isSearch" size="mini" type="primary" icon="el-icon-refresh" @click="reset") 重置
  el-button(
    size="mini"
    type="primary"
    icon="el-icon-plus"
    @click="$emit('publish')"
    v-if="showPublishButton && p(['shop.sale.publish'])"
  ) 上架新商品
</template>

<script>
export default {
  props: {
    showPublishButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        category_id: 0,
      }
    };
  },
  computed: {
    categoryList() {
      return [{ name: '全部分类', id: 0 }].concat(this.$store.getters.categoryList);
    },
    isSearch() {
      const { name, category_id } = this.formData;
      return name || category_id;
    }
  },
  methods: {
    reset() {
      this.formData = {
        name: '',
        category_id: 0,
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
.sale-search-form
  padding-bottom: 20px
  & > .el-input
    width: 200px
    margin-right: 10px
  & > .el-select
    width: 150px
    margin-right: 10px
</style>
