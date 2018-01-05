import fetch from '../utils/fetch'

//  获取Tree形式的组织架构
export function getOrgTree () {
    return fetch({
        url: '/org/tree',
        method: 'get'
    })
}

//  获取分部
export function getListBySub (id, isAll) {
    return fetch({
        url: '/hrmresources/sub/' + id + '?isAll=' + isAll,
        method: 'get'
    })
}

//  获取分部
export function getListByDep (id, includeChild, isAll) {
    return fetch({
        url: '/hrmresources/dep/' + id + '?child=' + includeChild + '&isAll=' + isAll,
        method: 'get'
    })
}

// 根据名称模糊查询
export function getListByName (query) {
    return fetch({
        url: '/hrmresources/name',
        method: 'get',
        params: query
    })
}
