import fetch from '../utils/fetch'
import qs from 'qs'
import $ from 'jquery'

export function list (url, query, data) {
    if (data !== undefined && !$.isEmptyObject(data)) {
        return fetch({
            url: '/' + url + '/list',
            method: 'post',
            params: query,
            data: data
        })
    } else {
        return fetch({
            url: '/' + url,
            method: 'get',
            params: query
        })
    }
}

export function del (url, id) {
    return fetch({
        url: '/' + url + '/' + id,
        method: 'delete'
    })
}

export function update (url, data) {
    return fetch({
        url: '/' + url,
        method: 'put',
        data: data
    })
}

export function create (url, data) {
    return fetch({
        url: '/' + url,
        method: 'post',
        data: data
    })
}

export function get (url, id) {
    return fetch({
        url: '/' + url + '/' + id,
        method: 'get'
    })
}
