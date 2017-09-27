import "babel-polyfill";
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import { constantRouterMap } from './router';
import store from './store';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';

import { getToken } from "./utils/auth";


Vue.use(VueRouter);
Vue.use(iView);

//iView组件初始化配置
iView.Message.config({
    duration: 3
});

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: constantRouterMap
};

const router = new VueRouter(RouterConfig);

const whiteList = ['/login','/404','/401'];   //不用认证的白名单页面

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.name);
    if(getToken()){     //判断是否有token
        if(to.path === '/login'){
            console.log("login to home");
            next({ path: '/home'})
        }else{
            if(!store.getters.loaded){   //判断当前用户是否拉取了权限信息
                console.log("init userinfo");
                store.dispatch("GetInfo").then(response => {
                    const roles = response.data.roles;
                    const permissions = response.data.permissions;
                    store.dispatch("GenerateRouters", { roles,permissions }).then(() => {  //生成可访问的路由表
                        router.addRoutes(store.getters.addRouters);
                        next({ ...to });
                    });
                }).catch(error =>{
                    store.dispatch('FailLogOut').then(() => {
                        next({ path: '/login' });
                    })
                });
                next();
            }else{
                console.log("success link");
                next();
            }
        }
    }else{
        //免登录白名单判断
        if(whiteList.indexOf(to.path) !== -1) {
            console.log("white list");
            next();
        }else{
            console.log("No token to login");
            next('/login');
        }

    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});