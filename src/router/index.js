import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import MainLayout from '@/components/MainLayout.vue';
import np from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);
np.configure({ showSpinner: false });

const routes = [{
  path: '/login',
  name: '登录',
  component: () => import('@/views/Login.vue')
}];

const router = new VueRouter({ routes });

router.beforeEach((to, from, next) => {
  np.start();
  if (to.path === '/login') return next();
  if (document.cookie.includes('seec_shop')) {
    if (!store.getters.userId) {
      store.dispatch('getUser').then(v => {
        next(v ? { ...to, replace: true } : '/login?redirect=' + to.path);
      });
    } else {
      next();
    }
  } else {
    next('/login?redirect=' + to.path);
  }
});

router.afterEach(({ name }) => {
  np.done();
  document.title = name || '奈雪点单后台管理系统';
});

export default router;

export const authRoutes = [{
  path: '/',
  redirect: '/main/home',
}, {
  path: '/main',
  component: MainLayout,
  children: [{
    path: 'home',
    name: '首页',
    component: () => import('@/views/Home.vue'),
    meta: {
      icon: 'el-icon-s-home'
    }
  }, {
    path: 'sale/order/current',
    name: '备餐配餐',
    component: () => import('@/views/sale/Current.vue'),
    meta: {
      permissions: ['sale.order.current'],
      icon: 'el-icon-message-solid',
      group: {
        path: 'sale',
        name: '订单管理',
        icon: 'el-icon-s-order'
      }
    }
  }, {
    path: 'sale/order/history',
    name: '历史订单',
    component: () => import('@/views/sale/History.vue'),
    meta: {
      permissions: ['sale.order.history'],
      icon: 'el-icon-s-claim',
      group: {
        path: 'sale',
        name: '订单管理',
        icon: 'el-icon-s-order'
      }
    }
  }, {
    path: 'shop/sale',
    name: '上架下架',
    component: () => import('@/views/shop/Sale.vue'),
    meta: {
      permissions: ['shop.sale.read'],
      icon: 'el-icon-s-platform',
      group: {
        path: 'shop',
        name: '商品管理',
        icon: 'el-icon-s-shop'
      }
    }
  }, {
    path: 'shop/product',
    name: '商品管理',
    component: () => import('@/views/shop/Product.vue'),
    meta: {
      permissions: ['shop.product.read'],
      icon: 'el-icon-s-goods',
      group: {
        path: 'shop',
        name: '商品管理',
        icon: 'el-icon-s-shop'
      }
    }
  }, {
    path: 'shop/category',
    name: '分类管理',
    component: () => import('@/views/shop/Category.vue'),
    meta: {
      permissions: ['shop.category.read'],
      icon: 'el-icon-menu',
      group: {
        path: 'shop',
        name: '商品管理',
        icon: 'el-icon-s-shop'
      }
    }
  }, {
    path: 'admin/user',
    name: '用户管理',
    component: () => import('@/views/admin/User.vue'),
    meta: {
      permissions: ['admin.user.read'],
      icon: 'el-icon-user-solid',
      group: {
        path: 'admin',
        name: '系统管理',
        icon: 'el-icon-s-tools'
      }
    }
  }, {
    path: 'admin/role',
    name: '角色管理',
    component: () => import('@/views/admin/Role.vue'),
    meta: {
      permissions: ['admin.role.read'],
      icon: 'el-icon-s-check',
      group: {
        path: 'admin',
        name: '系统管理',
        icon: 'el-icon-s-tools'
      }
    }
  }]
}, {
  path: '/404',
  name: '页面未找到',
  component: () => import('@/views/404.vue')
}, {
  path: '*',
  redirect: '/404',
}];

export const resetRouter = () => {
  const _router = new VueRouter({ routes });
  router.matcher = _router.matcher;
};
