import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/index";
import Goods from "../views/goods";
import Member from "../views/member";
import Staff from "../views/staff";
import Supplier from "../views/supplier";
import Home from "../views/home";
import Layout from "../components/Layout";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout,
    redirect:'/home',
    children: [
      {
        path: '/home',
        component: Home,
        meta: {
          title: "首页"
        }
      },
      {
        path: '/goods',
        component: Goods,
        meta: {
          title: "商品"
        }
      }, 
      {
        path: '/supplier',
        component: Supplier,
        meta: {
          title: "工商"
        }
      },
      {
        path: '/member',
        component: Member,
        meta: {
          title: "会员"
        }
      },
      {
        path: '/staff',
        component: Staff,
        meta: {
          title: "员工"
        }
      }
    ]

  }
  
];

const router = new VueRouter({
  routes
});

export default router;
