import Vue from 'vue';

import Layout from '../views/layout/index.vue'

//这里的路由延迟加载会导致submenu的初次展开没有动画效果
import system from '../views/system/index.vue'

//import需加载组件
const _import = require('./_import');

//require需加载组件
function _require(dir){
    return (resolve) => require(['../views/'+dir+'.vue'], resolve)
}

/**
 * icon: sidebar的icon图标
 * hidden: 如果hidden：true 将不在sidebar显示
 * noDropDown: noDropDown: true 没有submenu
 * meta: { role: ['xxx'],permission: [ 'xxx'] }页面权限控制
 * @type {[null,null]}
 */
export const constantRouterMap = [

    { path: '/login', component: _import('login'), hidden: true },
    { path: '/help', component: _import('help'), hidden: true },
    { path: '/404', component: _import('error/404'), hidden: true },
    { path: '/401', component: _import('error/401'), hidden: true },

    {
        path: '/',
        component: Layout,
        icon:'ios-home-outline',
        redirect: '/home',
        noDropDown: true,
        children: [
            { path: 'home',component: _import('home/index'),name: '首页'}
        ]
    },
]

export const asyncRouterMap = [
    {
        path: '/system',
        component: Layout,
        icon: 'code-working',
        meta: { permission: 'system:view'},
        children: [
            { path: '', component: _import('system/index'), name:'系统管理', meta: { permission: 'system:view'},hidden:true},
            { path: 'user',component: _import('system/user'),name:'用户管理',meta: { permission: 'system:user:view'} },
            { path: 'role',component: _import('system/role'),name:'角色管理',meta: { permission: 'system:role:view'} },
            { path: 'permission',component: _import('system/permission'),name:'权限管理',meta: { permission: 'system:permission:view'} },
        ]
    },
    {
        path: '/hrm',
        component: Layout,
        icon: 'ios-monitor-outline',
        meta: { permission: 'hrm:view'},
        children: [
            { path: '', component: _import('hrm/index'), name:'员工管理', meta: { permission: 'hrm:view'},hidden:true },
            { path: 'user',component: _import('hrm/staff/index'),name:'员工信息',meta: { permission: 'hrm:staff:view'} },
            { path: 'org',component: _import('hrm/org/index'),name:'组织架构',meta: { permission: 'hrm:org:view'} },
        ]
    },
    {
        path: '/attendance',
        component: Layout,
        icon: 'ios-infinite-outline',
        meta: { permission: 'attendance:view'},
        children: [
            { path: '', component: _import('attendance/index'), name: '考勤管理', meta: {permission: 'attendance:view'}, hidden:true },
            { path: 'classes', component: _import('attendance/classes'), name: '班次管理', meta: {permission: 'attendance:classes:view'} }
        ]
    },

    { path: '*', redirect: '/404', hidden: true }   //404页面定义为最后一个router
]
