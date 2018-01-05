function(event, currentRow, beginOrEnd) {
    var node = this
        , timeList = this.state.record.sections
        , r = function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0
            , a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0
            , o = e.split(":")
            , r = t.split(":")
            , i = 60 * (parseInt(o[0]) - parseInt(r[0])) + (parseInt(o[1]) - parseInt(r[1])) - (a > 0 ? a : 0);
        return i < 0 && (i += 1440),
        !a && n && i > n && (i -= n),
            i = 10 * parseInt(i / 10),
            Math.min(i, 720)
    }
        , i = function(e) {
        var r = node.state.record;
        beginOrEnd ? timeList[currentRow].start.beginMin = parseInt(e, 10) : timeList[currentRow].end.endMin = parseInt(e, 10),
            r.sections = timeList,
            node.setState({
                record: r
            })
    }
        , l = void 0
        , s = void 0;
    if (beginOrEnd) {
        var d = currentRow - 1 < 0 ? timeList.length - 1 : currentRow - 1;
        l = r(event.start.time, timeList[d].end.time, q, timeList[d].end.endMin),
            s = event.start.beginMin
    } else {
        var c = currentRow === timeList.length - 1 ? 0 : currentRow + 1;
        l = r(timeList[c].start.time, event.end.time, q, timeList[c].start.beginMin),
            s = event.end.endMin
    }
    for (var u = [-1], p = q; p <= l; p += q)
        u.push(p);
    return A.default.createElement(S.default, {
        value: "" + (s > 0 ? s + "" : "--"),
        style: {
            width: 55,
            marginRight: 5
        },
        onChange: i
    }, u.map(function(e, t) {
        return A.default.createElement(G, {
            value: e + "",
            key: t
        }, e > 0 ? e : "--")
    }))
}
