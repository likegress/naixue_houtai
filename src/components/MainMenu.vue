<template lang="pug">
el-menu.el-menu-shop(
  router
  :default-active="$route.path"
  :collapse="$store.getters.isMenuCollapse"
)
  fragment(
    v-for="d in $store.getters.menus"
    :key="d.path"
  )
    el-submenu(v-if="d.children" :index="d.path")
      template(slot="title")
        i(:class="d.icon")
        span {{ d.name }}
      el-menu-item(v-for="c in d.children" :key="c.path" :index="c.path")
        i(:class="c.icon")
        span(slot="title") {{ c.name }}
    el-menu-item(v-else :index="d.path")
      i(:class="d.icon")
      span(slot="title") {{ d.name }}
</template>

<style lang="sass">
.el-menu.el-menu-shop
  position: absolute
  top: 0
  bottom: 0
  left: 0
  width: 200px
  background: #314255
  border: 0
  overflow: auto
  z-index: 3
  &.el-menu--collapse
    width: 64px

.el-menu.el-menu-shop,
.el-menu--vertical
  .el-menu
    background: #202d3d
  .el-menu-item, .el-submenu__title
    color: #ccc
    i
      color: #ccc
      &[class^=el-icon-]
        margin: -3px 5px 0 0
    &:focus, &:hover
      background: #263445
    &.is-active
      color: #46a0fc
      i
        color: #46a0fc
</style>
