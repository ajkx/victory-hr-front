import fetch from '../utils/fetch'
import qs from 'qs';

/**
 * ========用户管理模块=========
 */

//获取用户列表
export function getUsers(query) {
    return fetch({
        url: '/user',
        method: 'get',
        params: query
    });
}

//更新用户角色
export function updateUserRole(data) {
    return fetch({
        url: '/user/updateRole',
        method: 'post',
        data: data
    });
}

//更改用户状态（解锁还是锁定，这视乎服务器的取反判断）
export function updateUserStatus(data) {
    return fetch({
        url: '/user/updateStatus',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}


/**
 * ========角色管理模块=========
 */
//获取角色列表
export function getRoles(query) {
    return fetch({
        url: '/role',
        method: 'get',
        params: query
    });
}

//更新角色
export function updateRole(data) {
    return fetch({
        url: '/role',
        method: 'put',
        data: data
    });
}

//更改角色状态（解锁还是锁定，这视乎服务器的取反判断）
export function updateRoleStatus(data) {
    return fetch({
        url: '/role/updateStatus',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
    });
}

export function deleteRole(id) {
    return fetch({
        url: '/role/'+id,
        method: 'delete',
    });
}

