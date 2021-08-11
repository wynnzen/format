import Vue from "vue";
import VueRouter from "vue-router";
import Index from '@/views/index'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    redirect:'f',
    children:[
      {
        path:'f',
        name:'format',
        component:() => import('@/views/formatter')
      }
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
