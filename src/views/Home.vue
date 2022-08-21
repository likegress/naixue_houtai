<template lang="pug">
.home-wrapper
  .overview
    .item
      p 会员数量
      h2
        count-to(
          :startVal="0"
          :endVal="overview.member"
          :duration="2000"
        )
      i.el-icon-s-custom
    .item
      p 订单数量
      h2
        count-to(
          :startVal="0"
          :endVal="overview.order"
          :duration="2000"
        )
      i.el-icon-s-order
    .item
      p 总销售额
      h2
        count-to(
          :startVal="0"
          :endVal="overview.total"
          :duration="2000"
          :decimals="2"
          separator=""
        )
      i.el-icon-s-marketing
    .item
      p 商品数量
      h2
        count-to(
          :startVal="0"
          :endVal="overview.product"
          :duration="2000"
        )
      i.el-icon-s-goods
  chart-box(ref="chart")
</template>

<script>
import CountTo from 'vue-count-to';
import ChartBox from '@/components/ChartBox.vue';

export default {
  components: { CountTo, ChartBox },
  data() {
    return {
      overview: {
        member: 0,
        order: 0,
        total: 0,
        product: 0
      }
    };
  },
  watch: {
    '$store.getters.isMenuCollapse'() {
      setTimeout(this.resize, 300);
    }
  },
  created() {
    this.axios.get('/chart/overview').then(({ data }) => {
      this.overview = data;
    });
  },
  mounted() {
    this.draw();
    window.addEventListener('resize', this.resize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    resize() {
      if (this.timeId) clearTimeout(this.timeId);
      this.timeId = setTimeout(() => {
        this.$refs.chart.resize();
      }, 200);
    },
    async draw() {
      const { data } = await this.axios.get('/chart/week');
      const config = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['会员数量', '订单数量'],
          top: '5%'
        },
        grid: {
          top: '18%',
          right: '6%',
          bottom: '6%',
          left: '4%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.date
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '会员数量',
            type: 'line',
            smooth: true,
            data: data.member
          },
          {
            name: '订单数量',
            type: 'line',
            smooth: true,
            data: data.order
          }
        ]
      };
      this.$refs.chart.draw(config);
    }
  }
}
</script>

<style lang="sass">
.home-wrapper
  .overview
    display: flex
    justify-content: space-between
    .item
      position: relative
      flex: 0 0 23.8%
      padding: 20px
      border-radius: 4px
      box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)
      color: #fff
      &:nth-child(1)
        background: #17a2b8
      &:nth-child(2)
        background: #ffc107
      &:nth-child(3)
        background: #28a745
      &:nth-child(4)
        background: #dc3545
      h2
        padding-top: .2em
        font-weight: bold
      p
        font-size: 14px
      i
        position: absolute
        right: 15px
        top: 50%
        transform: translateY(-50%)
        color: rgba(0,0,0,.15)
        font-size: 60px
  .chart-box
    height: 300px
    margin-top: 20px
</style>
