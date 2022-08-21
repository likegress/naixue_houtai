<template lang="pug">
el-dialog(
  title="角色授权"
  :visible="value"
  width="400px"
  @close="onCancel"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
)
  el-tree(
    v-if="show"
    ref="tree"
    :data="allPermissions"
    show-checkbox
    node-key="id"
    :default-checked-keys="rolePermissions"
    default-expand-all
  )
    template(slot-scope="{ node, data }")
      span
        | {{ data.label }}
        i(v-if="node.isLeaf") {{ data.id }}
  .dialog-footer(slot="footer")
    el-button(@click="onCancel") 取消
    el-button(type="primary" @click="onConfirm") 确定
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: Number
  },
  data() {
    return {
      show: true,
      allPermissions: [],
      rolePermissions: []
    };
  },
  watch: {
    value(v) {
      if (!v) return;
      this.getRolePermissions();
    },
    rolePermissions() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  },
  created() {
    this.getAllPermissions();
  },
  methods: {
    getAllPermissions() {
      this.axios.get('/permission/list').then(data => {
        this.allPermissions = data.data;
      });
    },
    getRolePermissions() {
      this.axios.get('/role/detail?id=' + this.id).then(data => {
        this.rolePermissions = (data.data || {}).permissions || [];
      });
    },
    onCancel() {
      this.rolePermissions = [];
      this.$emit('input', false);
    },
    onConfirm() {
      const permissions = this.$refs.tree.getCheckedKeys(true);
      this.axios.post('/role/set', {
        id: this.id,
        permissions
      }).then(data => {
        if (!data.errcode) {
          this.$message.success('角色授权成功');
          this.onCancel();
        }
      });
    }
  }
}
</script>

<style lang="sass">
.el-tree-node__content i
  font-style: normal
  padding-left: 5px
  opacity: .6
</style>
