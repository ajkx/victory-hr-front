export function getTimeDiffStr (s1, s2) {
    var begin = new Date(s1.replace(/-/g, '/')).getTime()
    var end = new Date(s2.replace(/-/g, '/')).getTime()
    var result = Math.floor((end - begin) / 60000)
    var hour = Math.floor(result / 60)
    var min = result % 60
    return hour + '小时' + min + '分钟'
}

export function getTimeDiff (s1, s2) {
    var begin = new Date(s1.replace(/-/g, '/')).getTime()
    var end = new Date(s2.replace(/-/g, '/')).getTime()
    var result = Math.floor((end - begin) / 60000)
    var hour = Math.floor(result / 60)
    var min = result % 60
    return hour * 60 + min
}
