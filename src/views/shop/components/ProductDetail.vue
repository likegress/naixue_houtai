<template lang="pug">
.product-detail
  .l(:style="{ 'background-image': `url(${detail.pic})` }")
  .r
    el-descriptions(:column="1")
      el-descriptions-item(label="名称")
        h3
          | {{ detail.name }}
          span [{{ detail.category_name }}]
      el-descriptions-item(label="标签")
        el-tag(
          v-for="(d, i) in detail.tags"
          :key="i"
          type="info"
          size="small"
        ) {{ d }}
        span(v-if="!detail.tags.length") 无
      el-descriptions-item(label="介绍")
        .detail {{ detail.detail }}
      el-descriptions-item(label="备注")
        span {{ detail.desc || '无' }}
</template>

<script>
export default {
  props: ['detail']
};
</script>

<style lang="sass">
.product-detail
  display: flex
  margin: 0 15px
  align-items: center
  .l
    flex: 0 0 150px
    height: 100px
    border-radius: 4px
    background-repeat: no-repeat
    background-position: center
    background-size: cover
  .r
    flex: 1
    margin-left: 20px
  .detail
    white-space: pre-wrap
  .el-descriptions
    tbody:nth-child(1),
    tbody:nth-child(2)
      .el-descriptions-item__label
        display: flex
        align-items: center
    .el-descriptions-item__label:not(.is-bordered-label)
      margin-right: 20px
      white-space: nowrap
      opacity: .6
    h3 span
      font-size: 14px
      padding-left: 10px
      opacity: .6
</style>
