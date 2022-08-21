<template lang="pug">
.product-list
  product-search(@search="search" @add="add")
  el-table(
    ref="table"
    :data="list"
    border
    style="width:100%"
    v-loading="loading"
    row-key="id"
    @expand-change="onExpandChange"
    :cell-class-name="cellClass"
  )
    el-table-column(type="expand" label="详情" width="50")
      template(slot-scope="{ row }")
        product-detail(:detail="row")
    el-table-column(prop="id" label="ID" width="100" align="center")
    el-table-column(prop="name" label="名称" align="center")
    el-table-column(prop="category_name" label="分类" align="center")
    el-table-column(prop="create_time" label="创建时间" align="center")
      template(slot-scope="{ row: { create_time } }")
        span(v-html="create_time.replace(' ', '<br>')")
    el-table-column(label="审核状态" width="100" align="center")
      template(slot-scope="{ row }")
        el-tag(:type="statusTagArr[row.status]" size="small") {{ row.status_name }}
        template(v-if="row.status > 2 && row.approve_msg")
          el-tooltip(:content="row.approve_msg" placement="top")
            i.el-icon-warning(:class="statusTagArr[row.status]")
    el-table-column(label="操作" align="center" v-if="p(['shop.product.update','shop.product.delete','shop.product.submit','shop.product.approve'])")
      template(slot-scope="{ row }")
        template(v-if="!row.on_sale")
          el-button(size="mini" type="primary" @click="edit(row.id)" v-if="p(['shop.product.update'])") 编辑
          el-button(size="mini" type="danger" @click="del(row.id)" v-if="p(['shop.product.delete'])") 删除
          el-button(size="mini" type="primary" @click="submit(row.id)" v-if="p(['shop.product.submit']) && (row.status === 1 || row.status === 4)") 提交
          el-button(size="mini" type="success" @click="approve(row.id)" v-if="p(['shop.product.approve']) && row.status === 2") 审核
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

  product-add(v-model="show.add" @confirm="onConfirm" v-if="p(['shop.product.create'])")
  product-edit(v-model="show.edit" :id="currentId" @confirm="getList" v-if="p(['shop.product.update'])")
  product-approve(v-model="show.approve" :id="currentId" @confirm="getList" v-if="p(['shop.product.approve'])")
</template>

<script>
import ProductSearch from './components/ProductSearch.vue';
import ProductDetail from './components/ProductDetail.vue';
import ProductAdd from './components/ProductAdd.vue';
import ProductEdit from './components/ProductEdit.vue';
import ProductApprove from './components/ProductApprove.vue';
export default {
  components: { ProductSearch, ProductDetail, ProductAdd, ProductEdit, ProductApprove },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      searchForm: {},
      loading: true,
      show: {
        add: false,
        edit: false,
        approve: false
      },
      currentId: 0,
      statusTagArr: [null, 'info', '', 'success', 'warning'],
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
      this.axios.get('/product/list', {
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
    add() {
      this.show.add = true;
    },
    edit(id) {
      this.currentId = id;
      this.show.edit = true;
    },
    del(id) {
      this.$confirm('信息删除不可恢复，确认操作？', {
        confirmButtonText: '确认删除',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/product/delete', {
          id
        }).then(({ errcode }) => {
          if (!errcode) {
            this.$message.success('删除成功!');
            this.getList();
          }
        });
      }).catch(() => {});
    },
    submit(id) {
      this.$confirm('商品信息已经添加无误，提交给上级审核，确认操作？', {
        confirmButtonText: '确认提交',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/product/submit', {
          id
        }).then(({ errcode }) => {
          if (!errcode) {
            this.$message.success('提交成功!');
            this.getList();
          }
        });
      }).catch(() => {});
    },
    approve(id) {
      this.currentId = id;
      this.show.approve = true;
    },
    onConfirm() {
      this.searchForm = {};
      this.page = 0;
      this.getList();
    },
    cellClass({ row, columnIndex }) {
      return (row.on_sale && columnIndex === 2) ? 'sale' : '';
    }
  }
};
</script>

<style lang="sass">
.product-list
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
    td.sale
      position: relative
      .cell
        padding-left: 20px
      &:after
        content: "已上架"
        display: flex
        justify-content: center
        align-items: center
        position: absolute
        top: 50%
        left: 0
        transform-origin: 0 50%
        transform: translateY(-50%) scale(.8)
        line-height: 1.3em
        padding: 3px 0
        width: 16px
        border-radius: 0 4px 4px 0
        font-size: 12px
        background-color: #67c23a
        color: #fff
</style>
