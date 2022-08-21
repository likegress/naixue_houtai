<template lang="pug">
.main-layout
  aside(ref="aside")
    main-menu
  main(:class="{ 'menu-collapse': $store.getters.isMenuCollapse }")
    main-header
    .content
      transition(name="router" mode="out-in")
        router-view
</template>

<script>
import MainMenu from './MainMenu.vue';
import MainHeader from './MainHeader.vue';

let aside = null;
let x = 0;

export default {
  components: { MainMenu, MainHeader },
  methods: {
    setX() {
      const _x = window.pageXOffset;
      if (x !== _x) {
        x = _x;
        aside.style = `transform:translateX(-${x}px)`;
      }
    }
  },
  mounted() {
    aside = this.$refs.aside;
    window.addEventListener('scroll', this.setX);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.setX);
  }
}
</script>

<style lang="sass">
.main-layout
  aside
    position: fixed
    top: 0
    bottom: 0
    left: 0
    width: 0
  main
    min-width: 800px
    margin-left: 200px
    transition: .3s ease-in-out
    &.menu-collapse
      margin-left: 64px
    & > .content
      padding: 20px

  .router-enter
    opacity: 0
    transform: translateX(20px)
  .router-leave-to
    opacity: 0
    transform: translateX(20px)
  .router-enter-active,
  .router-leave-active
    transition: .4s
</style>
