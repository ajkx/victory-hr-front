import axios from 'axios'

import { Message } from 'iview'
import store from '../store'
import { getToken } from './auth'
import env from '../config/env'

const ajaxUrl = env === 'development'
    ? 'http://localhost:8888/api'
    : env === 'production'
        ? 'http://localhost:8888/api'
        : 'http://localhost:8888/api'

// 创建axios实例
const service = axios.create({
    baseURL: ajaxUrl
    // timeout: 5000
})

// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        // 携带请求头V-token
        config.headers['token'] = getToken()
    }
    return config
}, error => {
    console.log('request error : ' + error)
    Promise.reject(error)
})

// response拦截器

service.interceptors.response.use(
    response => {
        const result = response.data
        if (!result.code) {        // 如果返回的数据不存在code 则直接return该数据
            return result
        } else if (result.code === '0') {     // 如果返回的数据存在code，并且为0，即返回的数据为封装的ResponseInfo
            return result.data
        } else {    // 返回的code不为0，即存在错误，下面是错误处理
            console.log('返回错误信息！code = ' + result.code)
            switch (result.code) {
            case '401':
                Message.warning('认证失败,请重新登录!')
                store.dispatch('FailLogOut').then(() => {
                    location.reload()
                })
                break
            case '1002':    // 用户被冻结
                Message.error(result.message)
                if (location.href.indexOf('login') <= -1) {
                    store.dispatch('FailLogOut').then(() => {
                        location.reload()
                        Message.error(result.message)
                    })
                }
                break
            default:
                Message.error(result.message)
                break
            }
            /* eslint-disable no-undef */
            return Promise.reject(result)
        }
    },
    error => {
        // 统一的异常处理
        if (error.response) {
            console.log('统一的异常处理！code = ' + error.response.data.code)
            var code = error.response.data.code
            var msg = error.response.data.message
            switch (code) {
            case '401':
                Message.warning('认证失败,请登录!')
                store.dispatch('FailLogOut').then(() => {
                    location.reload()
                })
                break
            default:
                Message.error(msg)
                break
            }
        } else {
            Message.error('连接超时，请检查网络！')
        }
        return Promise.reject(error)
    }
)

export default service
