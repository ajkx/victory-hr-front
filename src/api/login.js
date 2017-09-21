import fetch from '../utils/fetch'
import qs from 'qs';

export function login(userinfo) {
    return fetch({
        url: '/auth',
        method: 'post',
        data: qs.stringify(userinfo),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export function getInfo() {
    return fetch({
        url: '/userinfo',
        method: 'get'
    })
}

export function logout() {
    return fetch({
        url: '/logout',
        method: 'post'
    })
}


