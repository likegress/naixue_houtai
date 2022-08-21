<template lang="pug">
.sale-list
  sale-search(@search="search" @publish="publish" show-publish-button)
  el-table(
    ref="table"
    :data="list"
    border
    style="width:100%"
    v-loading="loading"
    row-key="id"
    @expand-change="onExpandChange"
  )
    el-table-column(type="expand" label="详情" width="50")
      template(slot-scope="{ row }")
        product-detail(:detail="row")
    el-table-column(prop="id" label="ID" width="100" align="center")
    el-table-column(prop="name" label="名称" align="center")
    el-table-column(prop="category_name" label="分类" align="center")
    el-table-column(prop="price" label="单价(元)" align="center")
    el-table-column(prop="stock" label="库存" align="center")
    el-table-column(prop="visits" label="访问量" align="center")
    el-table-column(prop="sale_time" label="上架时间" align="center")
      template(slot-scope="{ row: { sale_time } }")
        span(v-html="sale_time.replace(' ', '<br>')")
    el-table-column(label="操作" align="center" v-if="p(['shop.sale.adjust','shop.sale.unpublish'])")
      template(slot-scope="{ row }")
        el-button(size="mini" type="primary" @click="adjust(row.id)" v-if="p(['shop.sale.adjust'])") 调整
        el-button(size="mini" type="danger" @click="unpublish(row.id)" v-if="p(['shop.sale.unpublish'])") 下架
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

  sale-publish(v-model="show.publish" @confirm="onConfirm" v-if="p(['shop.sale.publish'])")
  sale-adjust(v-model="show.adjust" :id="currentId" @confirm="getList" v-if="p(['shop.sale.adjust'])")
</template>

<script>
import SaleSearch from './components/SaleSearch.vue';
import ProductDetail from './components/ProductDetail.vue';
import SalePublish from './components/SalePublish.vue';
import SaleAdjust from './components/SaleAdjust.vue';
export default {
  components: { SaleSearch, ProductDetail, SalePublish, SaleAdjust },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      searchForm: {},
      loading: true,
      show: {
        publish: false,
        adjust: false
      },
      currentId: 0
    }
  },
  created() {
    this.getList();
    this.$store.dispatch('getCategoryList');
  },
  methods: {
    onExpandChange(row, expandedRows) {
      if (expandedRows.length === 2) {
        const elseRow = expandedRows.find(i => i.id !== row.id);
        this.$refs.table.toggleRowExpansion(elseRow);
      }
    },
    getList() {
      this.loading = true;
      const { page, limit, searchForm } = this;
      this.axios.get('/sale/list', {
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
    publish() {
      this.show.publish = true;
    },
    adjust(id) {
      this.currentId = id;
      this.show.adjust = true;
    },
    unpublish(id) {
      this.$confirm('商品下架后顾客不可选择购买，确认操作？', {
        confirmButtonText: '确认下架',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/sale/unpublish', {
          id
        }).then(({ errcode }) => {
          if (!errcode) {
            this.$message.success('下架成功!');
            this.getList();
          }
        });
      }).catch(() => {});
    },
    submit() {
      // this.$confirm('商品信息已经添加无误，提交给上级审核，确认操作？', {
      //   confirmButtonText: '确认提交',
      //   cancelButtonText: '暂不操作',
      //   type: 'warning'
      // }).then(() => {
      //   this.axios.post('/product/submit', {
      //     id
      //   }).then(({ errcode }) => {
      //     if (!errcode) {
      //       this.$message.success('提交成功!');
      //       this.getList();
      //     }
      //   });
      // }).catch(() => {});
    },
    approve(id) {
      this.currentId = id;
      this.show.approve = true;
    },
    onConfirm() {
      this.searchForm = {};
      this.page = 0;
      this.getList();
    }
  }
};
</script>

<style lang="sass">
.sale-list
  .b
    padding-top: 20px
    text-align: right
  .el-table
    .el-tag + .el-tag
      margin-left: 7px
    .el-tag--small
      padding: 0 5px
    .el-icon-warning
      margin-left: 3px
      &.success
        color: #67c23a
      &.warning
        color: #e6a23c
</style>
