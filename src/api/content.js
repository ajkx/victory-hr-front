import fetch from '../utils/fetch'
import qs from 'qs';


export function getList(url,query) {
    return fetch({
        url: '/'+url,
        method: 'get',
        params: query
    });
}



