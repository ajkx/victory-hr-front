import fetch from '../utils/fetch'

//  获取setting
export function getSetting () {
    return fetch({
        url: '/attendanceSetting',
        method: 'get'
    })
}

//  更新基础信息
export function updateBaseSetting (data) {
    return fetch({
        url: '/attendanceSetting/base',
        method: 'post',
        data: data
    })
}

//  更新大小周
export function updateWeekSetting (data) {
    return fetch({
        url: '/attendanceSetting/week',
        method: 'post',
        data: data
    })
}

//  更新加班设置
export function updateOTSetting (data) {
    return fetch({
        url: '/attendanceSetting/ot',
        method: 'post',
        data: data
    })
}
