import 'babel-polyfill'
import Vue from 'vue'
import iView from 'iview'
import VueRouter from 'vue-router'
import { constantRouterMap } from './router'
import store from './store'
import Util from './libs/util'
import App from './app.vue'
import 'iview/dist/styles/iview.css'
import $ from 'jquery'

import { getToken } from './utils/auth'
import moment from 'moment'

Object.defineProperty(Vue.prototype, '$moment', { value: moment })

Vue.use(VueRouter)
Vue.use(iView)

//  iView组件初始化配置
iView.Message.config({
    duration: 3
})

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: constantRouterMap
}

const router = new VueRouter(RouterConfig)

const whiteList = ['/login', '/404', '/401']   // 不用认证的白名单页面

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    Util.title(to.name)
    if (getToken()) {     // 判断是否有token
        if (to.path === '/login') {
            next({ path: '/home' })
        } else {
            if (!store.getters.loaded) {   // 判断当前用户是否拉取了权限信息
                store.dispatch('GetInfo').then(data => {
                    const roles = data.roles
                    const permissions = data.permissions
                    store.dispatch('GenerateRouters', { roles, permissions }).then(() => {  // 生成可访问的路由表
                        router.addRoutes(store.getters.addRouters)
                        next({ ...to })
                    })
                }).catch(() => {
                    store.dispatch('FailLogOut').then(() => {
                        next({ path: '/login' })
                    })
                })
                next()
            } else {
                next()
            }
        }
    } else {
        // 免登录白名单判断
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
        }
    }
})

router.afterEach(() => {
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
