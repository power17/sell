import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResouce from 'vue-resource';
import App from './App.vue';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratiins.vue';
import seller from 'components/seller/seller.vue';

import 'common/stylus/index.styl';

Vue.use(VueRouter);// 注册路由
Vue.use(VueResouce);// 注册获取数据(http，ajax)

let app = Vue.extend(App);// 接入App

let router = new VueRouter({
  linkActiveClass: 'active'
});// 实例化

router.map({
  // 定义路由（路径）
  '/goods': {
    component: goods
  },
  '/ratings': {
    component: ratings
  },
  '/seller': {
    component: seller
  }
});

router.start(app, '#app');// 放在哪里

router.go('/goods');// 默认路由位置
