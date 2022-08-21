<template lang="pug">
.history-order-list
  history-search(@search="search")
  el-table(:data="list" border style="width:100%" v-loading="loading" row-key="id")
    el-table-column(prop="order_number" label="订单编号" width="180" align="center")
    el-table-column(label="会员信息" align="center")
      template(slot-scope="{ row: { member_name, phone } }")
        .n-w
          i.el-icon-user-solid
          | {{ member_name || '未提供' }}
        .n-w
          i.el-icon-phone
          | {{ phone }}
    el-table-column(align="center" :render-header="renderHeader")
      template(slot-scope="{ row: { meal_time, meal_type } }")
        .w {{ meal_time }}
        .w {{ meal_type }}
    el-table-column(label="商品" align="center")
      template(slot-scope="{ row: { products } }")
        .n-w(v-for="p in products" :key="p.id") {{ p.name }} x {{ p.count }}
    el-table-column(prop="status_name" label="下单时间" align="center")
      template(slot-scope="{ row: { create_time } }")
        span(v-html="create_time.replace(' ', '<br>')")
    el-table-column(label="总价(元)" align="center")
      template(slot-scope="{ row: { total } }")
        | ¥ {{ total.toFixed(2) }}
    el-table-column(prop="status_name" label="状态" width="100" align="center")
      template(slot-scope="{ row }")
          el-tag(:type="statusTagObj[row.status]" size="small") {{ row.status_name }}

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
</template>

<script>
import HistorySearch from './components/HistorySearch.vue';
export default {
  components: { HistorySearch },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      searchForm: {},
      loading: true,
      statusTagObj: {'4': 'success', '5': 'warning'},
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { page, limit, searchForm } = this;
      this.axios.get('/order/history', {
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
    renderHeader(h) {
      return h('span', {
        domProps: {
          innerHTML: '取餐时间<br>就餐方式'
        }
      })
    }
  }
};
</script>

<style lang="sass">
.history-order-list
  .b
    padding-top: 20px
    text-align: right
  .el-checkbox-group
    display: inline-block
  .el-table
    .n-w
        white-space: nowrap
        i
          margin-right: 5px
          color: #909399
</style>
