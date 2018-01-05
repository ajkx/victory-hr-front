import Layout from '../views/layout/index.vue'

// 这里的路由延迟加载会导致submenu的初次展开没有动画效果
// import system from '../views/system/index.vue'

// import需加载组件
const _import = require('./_import')

// require需加载组件
// function _require (dir) {
//   return (resolve) => require(['../views/' + dir + '.vue'], resolve)
// }

/**
 * icon: sidebar的icon图标
 * hidden: 如果hidden：true 将不在sidebar显示
 * noDropDown: noDropDown: true 没有submenu
 * index: 默认路由 防止面包屑有重复的项
 * meta: { role: ['xxx'],permission: [ 'xxx'] }页面权限控制
 * @type {[null,null]}
 */
export const constantRouterMap = [

    {path: '/login', component: _import('login'), hidden: true},
    {path: '/help', component: _import('help'), hidden: true},
    {path: '/404', component: _import('error/404'), hidden: true},
    {path: '/401', component: _import('error/401'), hidden: true},

    {
        path: '/',
        component: Layout,
        icon: 'ios-home-outline',
        redirect: '/home',
        noDropDown: true,
        children: [
            {path: 'home', component: _import('home/index'), name: '工作台'}
        ]
    }
]

export const asyncRouterMap = [
    {
        path: '/system',
        component: Layout,
        icon: 'code-working',
        meta: {permission: 'sys:view', name: '系统管理'},
        children: [
            {
                path: '',
                component: _import('system/index'),
                name: '系统管理',
                meta: {permission: 'sys:view', index: true},
                hidden: true
            },
            {
                path: 'user',
                component: _import('system/user/index'),
                meta: {permission: 'sys:user:view', name: '用户管理'},
                children: [
                    {
                        path: '',
                        component: _import('system/user/list'),
                        name: '用户管理',
                        meta: {permission: 'sys:user:view', index: true},
                        hidden: true
                    }
                ]
            },
            {
                path: 'role',
                component: _import('system/role/index'),
                meta: {permission: 'sys:role:view', name: '角色管理'},
                children: [
                    {
                        path: '',
                        component: _import('system/role/list'),
                        name: '角色管理',
                        meta: {permission: 'sys:role:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('system/role/form'),
                        name: '新增角色',
                        meta: {permission: 'sys:role:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('system/role/form'),
                        name: '编辑角色',
                        meta: {permission: 'sys:role:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'permission',
                component: _import('system/permission/index'),
                name: '权限管理',
                meta: {permission: 'sys:permission:view'}
            }
        ]
    },
    {
        path: '/hrm',
        component: Layout,
        icon: 'ios-monitor-outline',
        meta: {permission: 'hrm:view', name: '员工管理'},
        children: [
            {
                path: '',
                component: _import('hrm/index'),
                name: '员工管理',
                meta: {permission: 'hrm:view', index: true},
                hidden: true
            },
            {path: 'user', component: _import('hrm/staff/index'), name: '员工信息', meta: {permission: 'hrm:staff:view'}},
            {path: 'org', component: _import('hrm/org/index'), name: '组织架构', meta: {permission: 'hrm:org:view'}}
        ]
    },
    {
        path: '/attendance',
        component: Layout,
        icon: 'ios-infinite-outline',
        meta: {permission: 'attendance:view', name: '考勤管理'},
        children: [
            {
                path: '',
                component: _import('attendance/index'),
                name: '考勤管理',
                meta: {permission: 'attendance:view', index: true},
                hidden: true
            },
            {
                path: 'classes',
                component: _import('attendance/classes/index'),
                meta: {permission: 'attendance:classes:view', name: '班次管理'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/classes/list'),
                        name: '班次管理',
                        meta: {permission: 'attendance:classes:view', index: true},
                        hidden: true
                    }]
            },
            {
                path: 'group',
                component: _import('attendance/group/index'),
                meta: {permission: 'attendance:group:view', name: '考勤组管理'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/group/list'),
                        name: '考勤组管理',
                        meta: {permission: 'attendance:group:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/group/form'),
                        name: '新增考勤组',
                        meta: {permission: 'attendance:group:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/group/form'),
                        name: '编辑考勤组',
                        meta: {permission: 'attendance:group:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'record',
                component: _import('attendance/record/index'),
                meta: {permission: 'attendance:record:view', name: '原始打卡'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/record/list'),
                        name: '打卡记录',
                        meta: {permission: 'attendance:record:view', index: true},
                        hidden: true
                    }
                ]
            },
            {
                path: 'level',
                component: _import('attendance/level/index'),
                meta: {permission: 'attendance:level:view', name: '请假记录'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/level/list'),
                        name: '请假记录',
                        meta: {permission: 'attendance:level:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/level/form'),
                        name: '请假登记',
                        meta: {permission: 'attendance:level:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/level/form'),
                        name: '请假编辑',
                        meta: {permission: 'attendance:level:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'overtime',
                component: _import('attendance/overtime/index'),
                meta: {permission: 'attendance:overtime:view', name: '加班记录'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/overtime/list'),
                        name: '加班记录',
                        meta: {permission: 'attendance:overtime:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/overtime/form'),
                        name: '加班登记',
                        meta: {permission: 'attendance:overtime:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/overtime/form'),
                        name: '加班编辑',
                        meta: {permission: 'attendance:overtime:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'repair',
                component: _import('attendance/repair/index'),
                meta: {permission: 'attendance:repair:view', name: '补卡记录'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/repair/list'),
                        name: '补卡记录',
                        meta: {permission: 'attendance:repair:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/repair/form'),
                        name: '补卡登记',
                        meta: {permission: 'attendance:repair:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/repair/form'),
                        name: '补卡编辑',
                        meta: {permission: 'attendance:repair:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'manual',
                component: _import('attendance/manual/index'),
                meta: {permission: 'attendance:record:view', name: '签卡管理'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/manual/list'),
                        name: '签卡管理',
                        meta: {permission: 'attendance:record:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/manual/form'),
                        name: '签卡登记',
                        meta: {permission: 'attendance:record:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/manual/form'),
                        name: '签卡编辑',
                        meta: {permission: 'attendance:record:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'holiday',
                component: _import('attendance/holiday/index'),
                meta: {permission: 'attendance:holiday:view', name: '假日管理'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/holiday/list'),
                        name: '假日管理',
                        meta: {permission: 'attendance:holiday:view', index: true},
                        hidden: true
                    },
                    {
                        path: 'create',
                        component: _import('attendance/holiday/form'),
                        name: '新增假日',
                        meta: {permission: 'attendance:holiday:create'},
                        hidden: true
                    },
                    {
                        path: 'edit/:id',
                        component: _import('attendance/holiday/form'),
                        name: '编辑假日',
                        meta: {permission: 'attendance:holiday:update'},
                        hidden: true
                    }
                ]
            },
            {
                path: 'setting',
                component: _import('attendance/setting/index'),
                meta: {permission: 'attendance:setting:view', name: '考勤设置'},
                children: [
                    {
                        path: '',
                        component: _import('attendance/setting/form'),
                        name: '考勤设置',
                        meta: {permission: 'attendance:setting:view', index: true},
                        hidden: true
                    }
                ]
            }
        ]
    },

    {path: '*', redirect: '/404', hidden: true}   // 404页面定义为最后一个router
]
