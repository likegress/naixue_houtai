<template lang="pug">
.main-header
  header
    .l
      .toggle(@click="$store.commit('toggleMenu')")
        i(:class="[$store.getters.isMenuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']")
      el-breadcrumb
        el-breadcrumb-item(v-for="(d, i) in breadcrumbs" :key="i")
          router-link(v-if="d.path" :to="d.path") {{ d.name }}
          span(v-else) {{ d.name }}
    user-dropdown
  nav
    el-tabs(
      v-model="activeName"
      type="card"
      :editable="navList.length > 1"
      @tab-click="onNav"
      @edit="onEdit"
    )
      el-tab-pane(
        v-for="d in navList"
        :key="d.name"
        :label="d.label"
        :name="d.name"
      )
</template>

<script>
import UserDropdown from './UserDropdown.vue';
export default {
  components: { UserDropdown },
  data() {
    return {
      navList: [],
      activeName: ''
    }
  },
  computed: {
    breadcrumbs() {
      const { $route : r } = this;
      if (r.name === '首页') {
        return [{
          name: '首页'
        }];
      }
      const arr = [{
        name: '首页',
        path: '/main/home'
      }];
      if (r.meta && r.meta.group) {
        arr.push({
          name: r.meta.group.name
        });
      }
      arr.push({
        name: r.name
      });
      return arr;
    }
  },
  watch: {
    $route() {
      this.setNavList();
    }
  },
  created() {
    this.setNavList();
  },
  methods: {
    setNavList() {
      const { name: label, path: name } = this.$route;
      const nav = this.navList.find(i => i.name === name);
      if (!nav) this.navList.push({ label, name });
      this.activeName = name;
    },
    onNav({ name }) {
      if (name === this.$route.path) return;
      this.$router.push(name);
    },
    onEdit(targetName, action) {
      if (action === 'remove') {
        let { navList, activeName } = this;
        if (activeName === targetName) {
          navList.forEach((tab, i) => {
            if (tab.name === targetName) {
              const nextTab = navList[i + 1] || navList[i - 1];
              if (nextTab) activeName = nextTab.name;
            }
          });
        }
        if (this.activeName !== activeName) {
          this.$router.push(activeName);
        }
        this.activeName = activeName;
        this.navList = navList.filter(tab => tab.name !== targetName);
      }
    }
  }
};
</script>

<style lang="sass">
.main-header
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12)
  header
    display: flex
    justify-content: space-between
    align-items: center
    padding: 0 20px 0 8px
    height: 50px
    border-bottom: 1px solid #e6e6e6
    .l
      display: flex
      align-items: center
    .toggle
      display: flex
      justify-content: center
      align-items: center
      width: 40px
      height: 40px
      font-size: 24px
      color: #606266
      cursor: pointer
    .el-breadcrumb
      margin-left: 10px
      a
        font-weight: normal
        color: #606266
  nav
    padding: 7px 17px 8px
    .el-tabs--card>.el-tabs__header
      margin: 0
      border: 0
    .el-tabs--card>.el-tabs__header .el-tabs__nav
      border: 0
    .el-tabs--card>.el-tabs__header .el-tabs__item
      border: 1px solid #E4E7ED
      border-radius: 4px
      margin: 0 3px
      padding: 0 10px!important
      height: 30px
      line-height: 28px
      font-weight: normal
      color: #909399
      &.is-active
        border: 1px solid #d9ecff
        background: #ecf5ff
        color: #46a0fc
    .el-tabs__new-tab
      display: none
    .el-tabs__nav-next, .el-tabs__nav-prev
      line-height: 30px
</style>
