import Cookies from 'js-cookie'

const TokenKey = 'V-Token';

function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

export function getToken(){
    return Cookies.get(TokenKey);
}

export function setToken(token,expiresTime) {
    var date = new Date();
    date.setMilliseconds(date.getMilliseconds() + 0.5 * 864e+5);
    document.cookie = TokenKey + "="+escape(token) +";expires="+date.toString();
    //因为jsCookies使用的时间是无时区的
    // return Cookies.set(TokenKey,token,{expires: 0.8});
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}