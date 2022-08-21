<template lang="pug">
.role-list
  .form
    el-input(size="mini" v-model="name" placeholder="请输入角色名称" clearable @clear="search")
    el-button(size="mini" type="primary" icon="el-icon-search" @click="search") 查找
    el-button(size="mini" type="primary" icon="el-icon-plus" @click="add" v-if="p(['admin.role.create'])") 添加
  el-table(:data="list" border style="width:100%" v-loading="loading" row-key="id")
    el-table-column(prop="id" label="ID" width="100" align="center")
    el-table-column(prop="name" label="角色名称" align="center")
    el-table-column(prop="desc" label="角色描述" align="center")
    el-table-column(label="操作" align="center" v-if="p(['admin.role.update','admin.role.delete','admin.role.permission'])")
      template(slot-scope="{ row }")
        el-button(size="mini" type="primary" @click="edit(row)" v-if="p(['admin.role.update'])") 编辑
        el-button(size="mini" type="danger" @click="del(row.id)" v-if="p(['admin.role.delete'])") 删除
        el-button(size="mini" type="primary" @click="auth(row)" v-if="p(['admin.role.permission'])") 授权
  .b
    el-pagination(
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :current-page="page + 1"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    )

  role-add(v-model="show.add" @confirm="onConfirm" v-if="p(['admin.role.create'])")
  role-edit(v-model="show.edit" :role="role" @confirm="getList" v-if="p(['admin.role.update'])")
  role-auth(v-model="show.auth" :id="role.id" v-if="p(['admin.role.permission'])")
</template>

<script>
import RoleAdd from './components/RoleAdd.vue';
import RoleEdit from './components/RoleEdit.vue';
import RoleAuth from './components/RoleAuth.vue';
export default {
  components: { RoleAdd, RoleEdit, RoleAuth },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      name: '',
      loading: true,
      show: {
        add: false,
        edit: false,
        auth: false,
      },
      role: {},
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { page, limit, name } = this;
      this.axios.get('/role/list', {
        params: {
          page, limit, name
        }
      }).then(({ data }) => {
        this.list = data.list;
        this.total = data.total;
        this.loading = false;
      });
    },
    onSizeChange(limit) {
      this.limit = limit;
      this.page = 0;
      this.getList();
    },
    onPageChange(page) {
      this.page = page - 1;
      this.getList();
    },
    search() {
      this.page = 0;
      this.getList();
    },
    add() {
      this.show.add = true;
    },
    edit(role) {
      this.show.edit = true;
      this.role = role;
    },
    auth(role) {
      this.show.auth = true;
      this.role = role;
    },
    del(id) {
      this.$confirm('信息删除不可恢复，确认操作？', {
        confirmButtonText: '确认删除',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/role/delete', {
          id
        }).then(({ errcode }) => {
          if (!errcode) {
            this.$message.success('删除成功!');
            this.getList();
          }
        });
      }).catch(() => {});
    },
    onConfirm() {
      this.name = '';
      this.page = 0;
      this.getList();
    },
  }
};
</script>

<style lang="sass">
.role-list
  .form
    padding-bottom: 20px
    .el-input
      width: 200px
      margin-right: 10px
  .b
    padding-top: 20px
    text-align: right
</style>
