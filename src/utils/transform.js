
export function getTimeList (timeList) {
    let result = ''
    for (var t of timeList) {
        let beginTime = t.beginTime
        let beginAcross = t.beginAcross
        let endTime = t.endTime
        let endAcross = t.endAcross
        if (beginAcross) result += '次日'
        result += beginTime + '-'
        if (endAcross) result += '次日'
        result += endTime + ' '
    }
    return result
}
