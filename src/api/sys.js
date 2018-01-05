import fetch from '../utils/fetch'

/**
 * ========用户管理模块=========
 */

// 更新用户角色
export function updateUserRole (data) {
    return fetch({
        url: '/user/updateRole',
        method: 'post',
        data: data
    })
}

// 更改用户状态（解锁还是锁定，这视乎服务器的取反判断）
export function updateUserStatus (data) {
    return fetch({
        url: '/user/updateStatus',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

/**
 * ========角色管理模块=========
 */

// 更新角色
export function updateRole (data) {
    return fetch({
        url: '/role',
        method: 'put',
        data: data
    })
}

// 更改角色状态（解锁还是锁定，这视乎服务器的取反判断）
export function updateRoleStatus (data) {
    return fetch({
        url: '/role/updateStatus',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    })
}

/**
 *  =======权限管理模块===========
 */

export function getPermissionTree (data) {
    return fetch({
        url: '/permission/tree',
        method: 'get',
        data: data
    })
}
