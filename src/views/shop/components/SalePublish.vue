<template lang="pug">
el-dialog(
  title="上架新商品"
  :visible="value"
  width="725px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  .sale-publish
    sale-search(@search="search")
    el-table(
      ref="table"
      :data="list"
      border
      style="width:100%"
      v-loading="loading"
      row-key="id"
      @selection-change="onSelection"
      :row-class-name="onRowClass"
    )
      el-table-column(type="selection" width="54" align="center")
      el-table-column(prop="id" label="ID" width="100" align="center")
      el-table-column(prop="name" label="名称" align="center")
      el-table-column(prop="category_name" label="分类" align="center")
      el-table-column(label="单价(元)" align="center" v-if="selectionList.length")
        template(slot-scope="{ row }")
          .el-input.el-input--mini(v-if="selectionList.some(i => i.id === row.id)")
            input.el-input__inner(v-model="selectionList.find(i => i.id === row.id).price")
      el-table-column(label="库存" align="center" v-if="selectionList.length")
        template(slot-scope="{ row }")
          .el-input.el-input--mini(v-if="selectionList.some(i => i.id === row.id)")
            input.el-input__inner(v-model="selectionList.find(i => i.id === row.id).stock")
    .b
      el-pagination(
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :current-page="page + 1"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      )
  .dialog-footer(slot="footer")
    el-button(@click="onCancel") 取消
    el-button(:disabled="!selectionList.length" type="primary" @click="onConfirm") 确定
</template>

<script>
import SaleSearch from './SaleSearch.vue';
export default {
  components: { SaleSearch },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      searchForm: {},
      loading: true,
      selectionList: [],
    }
  },
  watch: {
    value(v) {
      if (!v) return;
      this.getList();
    }
  },
  methods: {
    getList() {
      this.loading = true;
      const { page, limit, searchForm } = this;
      this.axios.get('/product/unpublish-list', {
        params: {
          page,
          limit,
          ...searchForm
        }
      }).then(({ data }) => {
        this.list = data.list;
        this.total = data.total;
        this.loading = false;
      });
    },
    onSizeChange(limit) {
      this.limit = limit;
      this.page = 0;
      this.getList();
    },
    onPageChange(page) {
      this.page = page - 1;
      this.getList();
    },
    search(f) {
      this.searchForm = f;
      this.page = 0;
      this.getList();
    },
    onSelection(arr) {
      this.selectionList = arr.map(i => {
        const item = this.selectionList.find(j => j.id === i.id) || {};
        return {
          id: i.id,
          price: item.price || '',
          stock: item.stock || ''
        };
      });
    },
    onRowClass({ row }) {
      return this.selectionList.some(i => i.id === row.id) ? 'current-row' : ''
    },
    onCancel() {
      this.$refs.table.clearSelection();
      this.$emit('input', false);
    },
    onConfirm() {
      const price_reg = /^([0-9]\d*)(\.[0-9]{1,2})?$/;
      const stock_reg = /^0|[1-9][0-9]*$/;
      if (this.selectionList.some(i => !i.id || !price_reg.test(i.price) || !stock_reg.test(i.stock))) {
        return this.$message.error('价格或库存有误');
      }
      this.axios.post('/sale/publish', {
        products: this.selectionList.map(i => ({
          id: i.id,
          price: Number(i.price),
          stock: Number(i.stock)
        }))
      }).then(data => {
        if (!data.errcode) {
          this.$message.success('商品上架成功');
          this.onCancel();
          this.$emit('confirm');
        }
      });
    }
  }
};
</script>

<style lang="sass">
.sale-publish
  .b
    padding-top: 20px
    text-align: right
  .el-table--border tbody .el-table__cell:first-child .cell
    padding-left: 14px
  .el-table .el-input__inner
    text-align: center
</style>
