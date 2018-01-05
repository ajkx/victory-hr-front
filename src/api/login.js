import fetch from '../utils/fetch'
import qs from 'qs'

// 登录
export function login (userinfo) {
    return fetch({
        url: '/auth',
        method: 'post',
        // data: qs.stringify(userinfo),
        data: userinfo
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
    })
}

// 登出
export function logout () {
    return fetch({
        url: '/logout',
        method: 'post'
    })
}

export function getUserInfo () {
    return fetch({
        url: '/userinfo',
        method: 'get'
    })
}
