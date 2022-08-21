<template lang="pug">
.image-upload(:style="style" :class="{ 'hover': showInput }")
  .bg
  .plus(v-if="!value")
    i.el-icon-plus
  .btn-list
    el-upload(
      action="/api/upload"
      :show-file-list="false"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
    )
      el-button(type="primary" size="mini") {{ value ? '重新上传' : '上传图片' }}
    span.or 或者
    el-popover(
      placement="top"
      width="300"
      v-model="showInput"
    )
      .el-input.el-input--medium
        input.el-input__inner(v-model="inputValue")
      .footer(style="text-align:right;margin-top:5px")
        el-button(size="mini" @click="onCancel") 取消
        el-button(type="primary" size="mini" @click="onConfirm" style="margin-left:5px") 确定
      el-button(slot="reference" type="primary" size="mini") {{ value ? '编辑路径' : '填写路径' }}
</template>

<script>
export default {
  props: ['value', 'width', 'height'],
  data() {
    return {
      showInput: false,
      inputValue: ''
    };
  },
  computed: {
    style() {
      const { width, height, value } = this;
      const s = {
        width: width + 'px',
        height: height + 'px'
      };
      if (value) s['background-image'] = `url(${value})`;
      return s;
    }
  },
  watch: {
    showInput(v) {
      if (v) this.inputValue = this.value;
    }
  },
  methods: {
    onSuccess(res) {
      this.$emit('input', res.data);
    },
    beforeUpload(file) {
      let msg = '';
      if (file.size / 1024 / 1024 > 5) {
        msg = '文件大小不能超过5M';
      } else if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.name.split('.').pop().toLowerCase())) {
        msg = '文件格式必须为图片';
      }
      if (msg) {
        this.$alert(msg, { confirmButtonText: '知道了' });
      }
      return !msg;
    },
    onCancel() {
      this.showInput = false;
    },
    onConfirm() {
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(this.inputValue.split('.').pop().toLowerCase())) {
        return this.$message.error('路径文件格式必须为图片');
      }
      this.$emit('input', this.inputValue);
      this.showInput = false;
    }
  }
};
</script>

<style lang="sass">
.image-upload
  position: relative
  background-color: #f8f8f9
  background-repeat: no-repeat
  background-position: center
  background-size: cover
  border: 1px dashed #d9d9d9
  border-radius: 6px
  overflow: hidden
  &:hover, &.hover
    border-color: #409EFF
    .bg, .btn-list
      opacity: 1
    .plus
      opacity: 0
  .bg
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(248,248,249,.86)
    color: #8c939d
    transition: .3s
    opacity: 0
  .plus
    display: flex
    justify-content: center
    align-items: center
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    transition: .3s
    opacity: 1
    .el-icon-plus
      font-size: 28px
      color: #8c939d
  .btn-list
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    transition: .3s
    opacity: 0
    .el-upload, .el-button
      display: block
    .el-button--mini
      padding: 5px 7px
    .or
      line-height: 2em
      font-size: 12px

.is-error .image-upload
  border-color: #F56C6C
</style>
