<template lang="pug">
.chart-box(ref="chart")
</template>

<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
      chart: null
    };
  },
  methods: {
    init() {
      this.chart = echarts.init(this.$refs.chart);
    },
    draw(config) {
      if (!this.chart) this.init();
      this.chart.setOption(config);
    },
    resize() {
      if (!this.chart) this.init();
      this.chart.resize();
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.chart && this.chart.dispose();
  }
};
</script>

<style lang="sass">
.chart-box
  background: #fff
  border-radius: 4px
  box-shadow: 0 0 1px rgba(0,0,0,.125), 0 1px 3px rgba(0,0,0,.2)
  overflow: hidden
</style>
