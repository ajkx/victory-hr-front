
import { constantRouterMap, asyncRouterMap } from '../../router'
import store from 'store'
/**
 * 通过meta.permission判断是否与当前用户权限匹配,判断逻辑同shiro的字符串判断类似 xxx:* 能匹配 xxx:xxx:create
 * @param permissions
 * @param route
 */
function hasPermission (permissions, route) {
    if (route.meta && route.meta.permission) {
        const array = route.meta.permission.split(':')
        let checkArray = new Array(0)
        let beforePrefix = ''
        for (var i = 0; i < array.length; i++) {
            if (array[i] === '') continue
            // 最后一个的字符串不进行拼接*,而push进未分割的meta.permission
            if (i === array.length - 1) {
                checkArray.push(route.meta.permission)
                continue
            }
            checkArray.push(beforePrefix + array[i] + ':*')
            beforePrefix += array[i] + ':'
        }
        console.log('checkArray = ' + checkArray)
        return permissions.some(permission => {
            return checkArray.some(checkStr => {
                console.log(checkStr + ' : ' + permission)
                return checkStr === permission
            })
        })
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * 权限判断逻辑: 如果route有children 则循环判断children的权限，判断后如何children为0 则不返回该路由
 * 如果没有children 则使用 hasPermission判断
 * @param asyncRouterMap
 * @param permissions
 */
function filterAsyncRouter (asyncRouterMap, permissions) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, permissions)
            if (route.children.length > 0) return true
            else {
                // 如果没有任何一个children的权限 则返回false
                return false
            }
        } else {
            if (hasPermission(permissions, route)) return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRouters ({ commit }) {
            return new Promise(resolve => {
                let accessedRouters
                const roles = store.getters.roles
                const permissions = store.getters.permissions
                accessedRouters = asyncRouterMap
                if (roles.some(role => role.super === true)) {
                    console.log('登录用户为超级管理员')
                    accessedRouters = asyncRouterMap
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, permissions)
                }
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default permission
