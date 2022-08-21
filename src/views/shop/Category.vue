<template lang="pug">
.category-list
  .form(v-if="p(['shop.category.create'])")
    el-button(size="mini" type="primary" icon="el-icon-plus" @click="add") 添加
  el-table(v-if="render" :data="list" border style="width:100%" v-loading="loading" row-key="id")
    el-table-column(prop="id" label="ID" width="100" align="center")
    el-table-column(prop="name" label="分类名称" align="center")
    el-table-column(prop="tag" label="分类标签" align="center")
      template(slot-scope="{ row: { tag } }")
        el-tag(v-if="tag" type="info" size="small") {{ tag }}
    el-table-column(prop="desc" label="分类描述" align="center")
    el-table-column(type="index" :index="indexFn" label="展示顺序" width="100" align="center")
    el-table-column(label="操作" align="center" v-if="p(['shop.category.update','shop.category.delete','shop.category.order'])")
      template(slot-scope="{ row, $index }")
        template(v-if="p(['shop.category.order'])")
          el-button(:disabled="!$index" size="mini" type="info" icon="el-icon-caret-top" @click="order(row.id, 'up', $index)")
          el-button(:disabled="$index === list.length - 1" size="mini" type="info" icon="el-icon-caret-bottom" @click="order(row.id, 'down', $index)")
        el-button(size="mini" type="primary" @click="edit(row)" v-if="p(['shop.category.update'])") 编辑
        el-button(size="mini" type="danger" @click="del(row.id)" v-if="p(['shop.category.delete'])") 删除

  category-add(v-model="show.add" @confirm="onConfirm" v-if="p(['shop.category.create'])")
  category-edit(v-model="show.edit" :category="category" @confirm="getList" v-if="p(['shop.category.update'])")
</template>

<script>
import CategoryAdd from './components/CategoryAdd.vue';
import CategoryEdit from './components/CategoryEdit.vue';
export default {
  components: { CategoryAdd, CategoryEdit },
  data() {
    return {
      render: true,
      list: [],
      total: 0,
      loading: true,
      show: {
        add: false,
        edit: false,
        auth: false,
      },
      category: {},
    }
  },
  created() {
    this.getList();
    if (this.p(['shop.category.create','shop.category.update'])) {
      this.$store.dispatch('getCategoryTagList');
    }
  },
  methods: {
    getList() {
      this.loading = true;
      return this.axios.get('/category/list').then(({ data }) => {
        this.list = data.list;
        this.total = data.total;
        this.loading = false;
      });
    },
    add() {
      this.show.add = true;
    },
    edit(category) {
      this.show.edit = true;
      this.category = category;
    },
    del(id) {
      this.$confirm('信息删除不可恢复，确认操作？', {
        confirmButtonText: '确认删除',
        cancelButtonText: '暂不操作',
        type: 'warning'
      }).then(() => {
        this.axios.post('/category/delete', {
          id
        }).then(({ errcode }) => {
          if (!errcode) {
            this.$message.success('删除成功!');
            this.getList();
          }
        });
      }).catch(() => {});
    },
    reRender() {
      const el = document.querySelector('.category-list');
      const { height } = el.getBoundingClientRect();
      el.style.height = height + 'px';
      this.render = false;
      this.$nextTick(() => {
        this.render = true;
        this.getList().then(() => {
          this.$nextTick(() => {
            el.style.height = 'auto';
          });
        });
      });
    },
    animate(d, i) {
      return new Promise(resolve => {
        const tr = document.querySelector(`.category-list tbody tr:nth-child(${i + 1})`);
        const { height } = tr.getBoundingClientRect();
        let sibling = null;
        if (d === 'up') {
          sibling = document.querySelector(`.category-list tbody tr:nth-child(${i})`);
          tr.style = `transform:translateY(-${height}px)`;
          sibling.style = `transform:translateY(${height}px)`;
        }
        if (d === 'down') {
          sibling = document.querySelector(`.category-list tbody tr:nth-child(${i + 2})`);
          tr.style = `transform:translateY(${height}px)`;
          sibling.style = `transform:translateY(-${height}px)`;
        }
        setTimeout(resolve, 800);
      });
    },
    order(id, direction, index) {
      this.axios.post('/category/order', {
        id, direction
      }).then(async ({ errcode }) => {
        if (!errcode) {
          await this.animate(direction, index);
          this.reRender();
        }
      });
    },
    onConfirm() {
      this.name = '';
      this.page = 0;
      this.getList();
    },
    indexFn(i) {
      return '第' + (i + 1) + '位';
    }
  }
};
</script>

<style lang="sass">
.category-list
  .form
    padding-bottom: 20px
  .el-table
    .el-tag--small
      padding: 0 5px
    tbody tr
      transition: .3s
</style>
