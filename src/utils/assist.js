import $ from 'jquery'

export function isEmpty (data) {
    var type
    if (data == null) { // 等同于 value === undefined || value === null
        return true
    }
    type = Object.prototype.toString.call(data).slice(8, -1)
    switch (type) {
    case 'String':
        return !$.trim(data)
    case 'Array':
        return !data.length
    case 'Object':
        return $.isEmptyObject(data) // 普通对象使用 for...in 判断，有 key 即为 false
    default:
        return false // 其他对象均视作非空
    }
}

export function Trim (str, isGlobal) {
    var result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (isGlobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '')
    }
    return result
}

export function CastChar (str) {
    var result
    result = str.replace(/，/g, ',')
    return result
}

export function unique (arr) {
    var result = [], hash = {}
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem)
            hash[elem] = true
        }
    }
    return result
}

export function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true
        }
    }
    return false
}

export function findComponentsDownward (context, componentName, components = []) {
    const childrens = context.$children

    if (childrens.length) {
        childrens.forEach(child => {
            const name = child.$options.name
            const childs = child.$children

            if (name === componentName) components.push(child)
            if (childs.length) {
                const findChilds = findComponentsDownward(child, componentName, components)
                if (findChilds) components.concat(findChilds)
            }
        })
    }
    return components
}

export function deepCopy (data) {
    const t = typeOf(data)
    let o

    if (t === 'array') {
        o = []
    } else if (t === 'object') {
        o = {}
    } else {
        return data
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]))
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i])
        }
    }
    return o
}

function typeOf (obj) {
    const toString = Object.prototype.toString
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    }
    return map[toString.call(obj)]
}
