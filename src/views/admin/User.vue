<template lang="pug">
.user-list
  .form
    el-input(size="mini" v-model="username" placeholder="请输入用户名/账号" clearable @clear="search")
    el-button(size="mini" type="primary" icon="el-icon-search" @click="search") 查找
    el-button(size="mini" type="primary" icon="el-icon-plus" @click="add" v-if="p(['admin.user.create'])") 添加
  el-table(:data="list" border style="width:100%" v-loading="loading" row-key="id")
    el-table-column(prop="id" label="ID" width="100" align="center")
    el-table-column(prop="username" label="用户名/账号" align="center")
    el-table-column(label="头像" width="100" align="center")
      template(slot-scope="{ row: { avatar } }")
        .el-avatar(:style="{ 'background-image': `url(${avatar})` }")
    el-table-column(label="角色列表" align="center")
      template(slot-scope="{ row: { role_names } }")
        el-tag(type="info" size="small" v-for="d in role_names" :key="d") {{ d }}
    el-table-column(prop="tel" label="联系方式" align="center")
      template(slot-scope="{ row: { tel, mail } }")
        .contact
          i.el-icon-phone
          | {{ tel }}
        .contact
          i.el-icon-message
          | {{ mail }}
    el-table-column(label="操作" align="center" v-if="p(['admin.user.update','admin.user.delete','admin.user.password'])")
      template(slot-scope="{ row: { id } }")
        template(v-if="id > 1")
          el-button(size="mini" type="primary" @click="edit(id)" v-if="p(['admin.user.update'])") 编辑
          el-button(size="mini" type="danger" @click="del(id)" v-if="p(['admin.user.delete'])") 删除
          el-button(size="mini" type="primary" @click="reset(id)" v-if="p(['admin.user.password'])") 重置密码
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

  user-add(v-model="show.add" @confirm="onConfirm" v-if="p(['admin.user.create'])")
  user-edit(v-model="show.edit" :id="currentId" @confirm="getList" v-if="p(['admin.user.update'])")
  user-reset(v-model="show.reset" :id="currentId" v-if="p(['admin.user.password'])")
</template>

<script>
import UserAdd from './components/UserAdd.vue';
import UserEdit from './components/UserEdit.vue';
import UserReset from './components/UserReset.vue';
export default {
  components: { UserAdd, UserEdit, UserReset },
  data() {
    return {
      list: [],
      total: 0,
      page: 0,
      limit: 10,
      username: '',
      loading: true,
      show: {
        add: false,
        edit: false,
        reset: false,
      },
      currentId: 0,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      const { page, limit, username } = this;
      this.axios.get('/user/list', {
        params: {
          page, limit, username
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
    edit(id) {
      this.show.edit = true;
      this.currentId = id;
    },
    reset(id) {
      this.show.reset = true;
      this.currentId = id;
    },
    del(id) {
      this.$confirm('信息删除不可恢复，确认操作？', {
        confirmButtonText: '确认删除',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/user/delete', {
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
      this.username = '';
      this.page = 0;
      this.getList();
    },
  }
};
</script>

<style lang="sass">
.user-list
  .form
    padding-bottom: 20px
    .el-input
      width: 200px
      margin-right: 10px
  .b
    padding-top: 20px
    text-align: right
  .el-table
    .el-avatar
      display: block
      margin: 0 auto
      border-radius: 4px
      background-repeat: no-repeat
      background-position: center
      background-size: cover
    .el-tag + .el-tag
      margin-left: 7px
    .el-tag--small
      padding: 0 5px
    .contact
      white-space: nowrap
      i
        margin-right: 5px
        color: #909399
</style>
