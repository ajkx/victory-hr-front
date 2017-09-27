import axios from 'axios';

import { Message } from 'iview'
import store from '../store'
import { getToken } from "./auth"
import env from '../config/env';

const ajaxUrl = env === 'development' ?
    'http://localhost:8888/api' :
    env === 'production' ?
        'http://localhost:8888/api' :
        'http://localhost:8888/api';


//创建axios实例
const service = axios.create({
    baseURL: ajaxUrl,
    // timeout: 5000
});

// request拦截器
service.interceptors.request.use(config => {
    if(store.getters.token){
        //携带请求头V-token
        config.headers['token'] = getToken();
    }
    return config;
},error => {
    console.log("request error : " + error);
    Promise.reject(error);
});

// response拦截器

service.interceptors.response.use(
    response => {
        const data = response.data;
        if(data.code && data.code != 0){
            console.log("返回错误信息！code = "+data.code);
            switch (data.code){
                case 401:
                    Message.warning("认证失败,请重新登录!");
                    store.dispatch('FailLogOut').then(() =>{
                        location.reload();
                    });
                    break;
                case 1003:
                    Message.error(data.message);
                    if(location.href.indexOf("login") <= -1){
                        store.dispatch('FailLogOut').then(() =>{
                            location.reload();
                            Message.error(data.message);
                        });
                    }
                    break;
                default:
                    Message.error(data.message);
                    break;
            }
            return Promise.reject(error);
        }else{
            return response;
        }
    },
    error => {
        //统一的异常处理
        if(error.response){
            console.log("统一的异常处理！code = "+error.response.data.code);
            var code = error.response.data.code;
            var msg = error.response.data.message;
            switch (code) {
                case 401:
                    Message.warning("认证失败,请登录!");
                    store.dispatch('FailLogOut').then(() =>{
                        location.reload();
                    });
                    break;
                default:
                    Message.error(msg);
                    break;
            }
        }else{
            Message.error("连接超时，请检查网络！");
        }
        return Promise.reject(error);
    }
)

export default service;