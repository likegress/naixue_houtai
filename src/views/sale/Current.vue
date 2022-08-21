<template lang="pug">
.current-order-list(
  @mouseenter="autoRefresh = false"
  @mouseleave="autoRefresh = true"
)
  .l(v-loading="loading")
    h1 制作中
    transition-group(name="card-list")
      el-card(v-if="!loading && !paid_list.length" :key="0") 暂无订单
      el-card(v-for="d in paid_list" :key="d.id")
        template(slot="header")
          p 订单号：{{ d.order_number }}
          p {{ d.meal_type }} - {{ d.meal_time }}
          p 手机号：{{ d.phone }}
          el-button(round type="primary" icon="el-icon-dish" @click="status(d.order_number, d.id, 3)" v-if="p(['sale.order.status'])") 确定完成
        ul
          li(v-for="p in d.products" :key="p.id")
            | {{ p.name }} x {{ p.count }}

  .r(v-loading="loading")
    h1 请取餐
    transition-group(name="card-list")
      el-card(v-if="!loading && !meal_list.length" :key="0") 暂无订单
      el-card(v-for="d in meal_list" :key="d.id")
        template(slot="header")
          p 订单号：{{ d.order_number }}
          p {{ d.meal_type }} - {{ d.meal_time }}
          p 手机号：{{ d.phone }}
          el-button(round type="primary" icon="el-icon-shopping-cart-full" @click="status(d.order_number, d.id, 4)" v-if="p(['sale.order.status'])") 确定取餐
        ul
          li(v-for="p in d.products" :key="p.id")
            | {{ p.name }} x {{ p.count }}
</template>

<script>
export default {
  data() {
    return {
      paid_list: [],
      meal_list: [],
      loading: true, // 第一次加载Loading动画
      getting: false, // 接口是否正在请求
      autoRefresh: true,
      timeId: null
    }
  },
  created() {
    this.getList().then(() => {
      this.loading = false;
    });
  },
  methods: {
    getList(force) {
      if (!force && (!this.autoRefresh || this.getting)) return;
      this.getting = true;
      return this.axios.get('/order/current').then(({ data }) => {
        this.getting = false;
        this.paid_list = data.paid_list;
        this.meal_list = data.meal_list;
      });
    },
    status(order_number, id, status) {
      this.axios.post('/order/status', {
        id, status
      }).then(({ errcode }) => {
        if (!errcode) {
          const statusObj = { '3': '已制作完成', '4': '顾客已取餐' };
          this.$notify({
            title: '订单' + order_number,
            message: statusObj[status],
            type: 'success'
          });
          this.getList(true);
        }
      });
    }
  },
  mounted() {
    this.timeId = setInterval(this.getList, 5000);
  },
  beforeDestroy() {
    this.timeId && clearInterval(this.timeId);
  }
};
</script>

<style lang="sass">
.current-order-list
  position: relative
  display: flex
  min-height: calc(100vh - 134px)
  &:after
    content: ""
    position: absolute
    top: 0
    bottom: 0
    left: 50%
    width: 6px
    margin-left: -3px
    background: #e6e6e6
  .l, .r
    flex: 1
    padding-bottom: 20px
  .r
    margin-left: 46px
  .el-card
    margin-top: 15px
    .el-card__header
      position: relative
      .el-button
        position: absolute
        top: 50%
        right: 20px
        transform: translateY(-50%)

  .card-list-active, .card-list-active
    transition: opacity .3s
  .card-list-enter, .card-list-leave-to
    opacity: 0
</style>

