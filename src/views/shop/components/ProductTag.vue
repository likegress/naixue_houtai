<template lang="pug">
.product-tag
  el-tag(
    v-for="(d, i) in tags"
    :key="i"
    type="info"
    :disable-transitions="true"
    closable
    @close="onClose(index)"
  ) {{ d }}
  el-input.input-new-tag(
    v-if="inputVisible"
    v-model="inputValue"
    ref="saveTagInput"
    size="small"
    @keyup.enter.native="onInputConfirm"
    @keyup.esc.native="onInputCancel"
    @blur="onInputCancel"
  )
  el-button.button-new-tag(
    v-else
    size="small"
    type="primary"
    @click="showInput"
  ) 添加
</template>

<script>
export default {
  props: {
    value: Array
  },

  data() {
    return {
      tags: [].concat(this.value),
      inputVisible: false,
      inputValue: ''
    };
  },

  watch: {
    value(val) {
      this.tags = [].concat(val);
    }
  },

  methods: {
    update() {
      this.$emit('input', this.tags);
    },

    onClose(i) {
      this.tags.splice(i, 1)
      this.update();
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },

    onInputCancel() {
      this.inputVisible = false;
      this.inputValue = '';
    },

    onInputConfirm() {
      const v = this.inputValue.trim();
      if (!v) return;
      this.tags.push(v);
      this.update();
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style lang="sass">
.product-tag
  .el-tag
    margin-right: 10px
  .button-new-tag
    height: 32px
    line-height: 30px
    padding-top: 0
    padding-bottom: 0
  .input-new-tag
    width: 120px
    vertical-align: bottom
</style>
