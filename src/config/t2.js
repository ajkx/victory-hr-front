function(e, t, n){
    "use strict";
    function a(e) {
        return e && e.__esModule ? e : {
            default: e
        }
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var o = n(306)
        , r = a(o)
        , i = n(119)
        , l = a(i)
        , s = n(126)
        , d = a(s)
        , c = n(188)
        , u = a(c)
        , p = n(58)
        , f = a(p)
        , m = n(80)
        , h = a(m)
        , b = n(140)
        , g = a(b)
        , v = n(42)
        , y = a(v)
        , _ = n(46)
        , x = a(_)
        , k = n(23)
        , w = a(k)
        , M = n(72)
        , E = a(M)
        , C = n(81)
        , S = a(C)
        , T = n(44)
        , L = a(T)
        , O = n(92)
        , D = a(O);
    n(120),
        n(127),
        n(189),
        n(67),
        n(62),
        n(141),
        n(43),
        n(47),
        n(28),
        n(93),
        n(45),
        n(101),
        n(543);
    var P = n(1)
        , A = a(P)
        , N = n(14)
        , I = n(51)
        , Y = a(I)
        , R = n(3)
        , j = a(R)
        , z = n(648)
        , F = a(z)
        , H = n(651)
        , U = a(H)
        , V = "HH:mm"
        , B = D.default.Button
        , W = D.default.Group
        , K = L.default.confirm
        , G = S.default.Option
        , q = 10;
    t.default = A.default.createClass({
        displayName: "ClassManage",
        getInitialState: function() {
            return N.Utils.goldlog("pc_kaoqin_class", "pc_kaoqin_class"),
                this.corpId = N.Utils.corpId(),
                this.idIndexMap = {},
                {
                    columns: [],
                    dataSource: [],
                    loading: !1,
                    visible: !1,
                    record: {
                        id: -1,
                        serial: "",
                        permitLateMinutes: {
                            enable: !1,
                            minute: 30
                        },
                        seriousLateTime: {
                            enable: !1,
                            minute: 30
                        },
                        absentTime: {
                            enable: !1,
                            minute: 30
                        },
                        relatedGroupNames: [],
                        sections: JSON.parse((0,
                            E.default)(F.default.DEFAULT_SECTIONS_ONE)),
                        restTime: F.default.getDefaultRestTime(F.default.DEFAULT_SECTIONS_ONE[0]),
                        lateBack: {
                            enable: !1,
                            sections: [{
                                extra: U.default.DEFAULT_SECTION.extra,
                                late: U.default.DEFAULT_SECTION.late
                            }]
                        },
                        checkScopeChecked: !1
                    },
                    selectedRowKeys: this.props.data && this.props.data.selectedRowKeys ? this.props.data.selectedRowKeys : [],
                    classGroupId: ""
                }
        },
        componentDidMount: function() {
            this._ajaxClassList()
        },
        componentWillReceiveProps: function(e) {
            this.setState({
                selectedRowKeys: e.data && e.data.selectedRowKeys
            })
        },
        renderOption: function(e, t, n) {
            var a = this
                , o = this.state.record.sections
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
                var r = a.state.record;
                n ? o[t].start.beginMin = parseInt(e, 10) : o[t].end.endMin = parseInt(e, 10),
                    r.sections = o,
                    a.setState({
                        record: r
                    })
            }
                , l = void 0
                , s = void 0;
            if (n) {
                var d = t - 1 < 0 ? o.length - 1 : t - 1;
                l = r(e.start.time, o[d].end.time, q, o[d].end.endMin),
                    s = e.start.beginMin
            } else {
                var c = t === o.length - 1 ? 0 : t + 1;
                l = r(o[c].start.time, e.end.time, q, o[c].start.beginMin),
                    s = e.end.endMin
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
        },
        _handleSelectChange: function(e) {
            var t = this
                , n = (this.state.dataSource || []).filter(function(t) {
                return !e || t.classGroupId === e
            })
                , a = []
                , o = [];
            this.state.selectedRowKeys.forEach(function(e) {
                N.Utils.includes(n, e, "id") !== -1 && o.push(e)
            }),
                o.forEach(function(e) {
                    a.push({
                        id: e,
                        value: t.state.dataSource[t.idIndexMap[e]]
                    })
                }),
                this.setState({
                    classGroupId: e,
                    selectedRowKeys: o
                }),
            this.props.data.onChange && this.props.data.onChange(a)
        },
        render: function() {
            var e = this
                , t = this
                , n = null;
            this.props.data && (n = {
                selectedRowKeys: this.state.selectedRowKeys,
                type: this.props.data.type,
                onChange: function(t) {
                    var n = [];
                    t.forEach(function(t) {
                        n.push({
                            id: t,
                            value: e.state.dataSource[e.idIndexMap[t]]
                        })
                    }),
                        e.setState({
                            selectedRowKeys: t
                        }),
                    e.props.data.onChange && e.props.data.onChange(n)
                },
                getCheckboxProps: function(e) {
                    return {
                        disabled: e.disabled
                    }
                }
            });
            var section = this.state.record.sections
                , o = this.state.record.checkScopeChecked
                , i = 0;
            i = this.props.data ? -15 : 0,
            this.props.style && (i = this.props.style.marginTop);
            var s = []
                , c = !0
                , p = !1
                , m = void 0;
            try {
                for (var b, v = (0,
                    r.default)(this.state.dataSource); !(c = (b = v.next()).done); c = !0) {
                    var _ = b.value;
                    _.classGroupId && _.classGroupName && N.Utils.includes(s, _.classGroupId, "classGroupId") === -1 && s.push({
                        classGroupId: _.classGroupId,
                        classGroupName: _.classGroupName
                    })
                }
            } catch (e) {
                p = !0,
                    m = e
            } finally {
                try {
                    !c && v.return && v.return()
                } finally {
                    if (p)
                        throw m
                }
            }
            var k = (this.state.dataSource || []).filter(function(t) {
                return !e.state.classGroupId || t.classGroupId === e.state.classGroupId
            });
            return this.props.data && this.props.data.noNeedClassGroup && this.props.data.classGroupId && (k = k.map(function(t) {
                return t.disabled = !1,
                    t.state = "可使用",
                t.classGroupId && t.classGroupId !== e.props.data.classGroupId && (t.disabled = !0,
                    t.state = "已被使用"),
                    t
            })),
                k.sort(function(e, t) {
                    return e.disabled
                }),
                A.default.createElement("div", {
                    style: {
                        margin: "0px 0px 30px 0px",
                        background: "#fff"
                    }
                }, A.default.createElement(Y.default, {
                    delay: 0
                }, A.default.createElement("div", {
                    key: "section",
                    style: {
                        marginBottom: this.props.data ? -40 : 60,
                        marginTop: i
                    }
                }, this.state.loading ? A.default.createElement("div", null) : this.props.data ? !this.props.data.noNeedClassGroup && N.Utils.includes(window.dataTrialCodes, "class_group_manager") > -1 ? A.default.createElement("div", {
                    style: {
                        marginBottom: 10
                    }
                }, A.default.createElement("span", {
                    style: {
                        marginLeft: 10
                    }
                }, "班次组"), A.default.createElement(S.default, {
                    defaultValue: "请选择",
                    style: {
                        marginLeft: 10,
                        width: 100
                    },
                    onChange: this._handleSelectChange.bind(this)
                }, A.default.createElement(G, {
                    value: ""
                }, "请选择"), s.map(function(e, t) {
                    return A.default.createElement(G, {
                        key: t,
                        value: e.classGroupId
                    }, e.classGroupName)
                }))) : A.default.createElement("div", null) : A.default.createElement("div", {
                    style: {
                        marginBottom: 15
                    }
                }, A.default.createElement(w.default, {
                    type: "primary",
                    icon: "plus",
                    style: {
                        fontSize: 14
                    },
                    onClick: this._onAddClassClick
                }, "新增班次")), this.props.data ? A.default.createElement(x.default, {
                    rowSelection: n,
                    selectedRowKeys: this.state.selectedRowKeys,
                    columns: this.state.columns,
                    loading: this.state.loading,
                    dataSource: k,
                    pagination: {
                        pageSize: 5
                    }
                }) : A.default.createElement(x.default, {
                    columns: this.state.columns,
                    loading: this.state.loading,
                    dataSource: this.state.dataSource,
                    pagination: {
                        pageSize: 10
                    }
                }))), A.default.createElement(L.default, {
                    width: 710,
                    title: this.state.record.id === -1 ? "新增班次" : "编辑班次",
                    visible: this.state.visible,
                    onOk: function() {
                        e.state.record.serial.length && e.state.record.serial.length <= 10 ? e.state.record.id !== -1 ? K({
                            title: "选择规则生效时间",
                            content: "立即生效：今日考勤结果将按新规则重算",
                            okText: "立即生效",
                            cancelText: "次日生效",
                            onOk: function() {
                                e._ajaxClassAdd(!1)
                            },
                            onCancel: function() {
                                e._ajaxClassAdd(!0)
                            }
                        }) : e._ajaxClassAdd(!1) : y.default.error("请检查班次名称长度")
                    },
                    confirmLoading: this.state.confirmLoading,
                    onCancel: this._handleCancel
                }, this.state.record.relatedGroupNames.length ? A.default.createElement(g.default, {
                    message: "该班次正在被" + this.state.record.relatedGroupNames.length + "个考勤组使用, 修改将会影响到考勤组" + this.state.record.relatedGroupNames.join("、"),
                    type: "info",
                    showIcon: !0
                }) : A.default.createElement("div", null), A.default.createElement("span", null, "班次名称"), A.default.createElement(h.default, {
                    style: {
                        width: 140,
                        marginLeft: 10,
                        marginRight: 20
                    },
                    value: this.state.record.serial,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.serial = t.target.value,
                            e.setState({
                                record: n
                            })
                    }
                }), A.default.createElement("div", {
                    style: {
                        marginLeft: 60,
                        marginTop: 10,
                        marginBottom: 30,
                        color: "#c4c4c4"
                    }
                }, "最多10个字符（中英文或数字）"), A.default.createElement("span", {
                    style: {
                        marginRight: 20
                    }
                }, "设置该班次一天内上下班的次数"), A.default.createElement(W, {
                    onChange: function(t) {
                        switch (parseInt(t.target.value, 10)) {
                            case 1:
                                section.length > 1 && section.splice(1, section.length - 1);
                                break;
                            case 2:
                                section.length > 2 ? section.splice(2, section.length - 1) : 1 === section.length && (e.state.record.id === -1 ? section = JSON.parse((0,
                                    E.default)(F.default.DEFAULT_SECTIONS_TWO)) : section.push(F.default.getDefaultSection(section[0])),
                                    section[0].end.endMin = -1);
                                break;
                            case 3:
                                if (e.state.record.id === -1)
                                    section = JSON.parse((0,
                                        E.default)(F.default.DEFAULT_SECTIONS_THREE));
                                else {
                                    for (var n = section.length, o = 0; o < 3 - n; ++o)
                                        section.push(F.default.getDefaultSection(section[section.length - 1]));
                                    section[n - 1].end.endMin = -1
                                }
                        }
                        var r = e.state.record;
                        r.sections = section,
                            e.setState({
                                record: r
                            })
                    },
                    value: "" + section.length
                }, A.default.createElement(B, {
                    value: "1"
                }, "1天1次上下班"), A.default.createElement(B, {
                    value: "2"
                }, "1天2次上下班"), A.default.createElement(B, {
                    value: "3"
                }, "1天3次上下班")), A.default.createElement(f.default, {
                    style: {
                        marginLeft: 15,
                        display: "inline-block"
                    },
                    checked: o,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.checkScopeChecked = !o,
                            e.setState({
                                record: n
                            })
                    }
                }, "打卡时段设置"), section.map(function(t, n) {
                    return A.default.createElement("div", {
                        key: n,
                        style: {
                            marginTop: 15
                        }
                    }, A.default.createElement("div", {
                        style: {
                            minWidth: 240,
                            display: "inline-block"
                        }
                    }, A.default.createElement("span", {
                        style: {
                            marginRight: 10
                        }
                    }, " ", "第" + (n + 1) + "次"), "上班:", A.default.createElement(u.default, {
                        onChange: e._onChange.bind(e, n, "start"),
                        style: {
                            marginLeft: 5,
                            marginRight: 5,
                            width: 80
                        },
                        value: (0,
                            j.default)(t.start.time, V),
                        format: V
                    }), t.start.across ? A.default.createElement(d.default, {
                        color: "red",
                        style: {
                            marginTop: 0
                        }
                    }, "次日") : "", o ? A.default.createElement("span", null, e.renderOption(t, n, !0), "分钟前开始打卡") : null), A.default.createElement("div", {
                        style: {
                            marginLeft: 5,
                            minWidth: 320,
                            display: "inline-block",
                            float: o ? "right" : "none"
                        }
                    }, "下班: ", A.default.createElement(u.default, {
                        onChange: e._onChange.bind(e, n, "end"),
                        style: {
                            marginLeft: 5,
                            marginRight: 5,
                            width: 80
                        },
                        value: (0,
                            j.default)(t.end.time, V),
                        format: V
                    }), t.end.across ? A.default.createElement(d.default, {
                        color: "red",
                        style: {
                            marginTop: 0
                        }
                    }, "次日") : "", o ? A.default.createElement("span", null, e.renderOption(t, n, !1), "分钟后结束打卡") : null))
                }), 1 === section.length ? A.default.createElement("div", {
                    style: {
                        marginTop: 10
                    }
                }, A.default.createElement(f.default, {
                    checked: this.state.record.isRestTimeOpen,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.isRestTimeOpen = t.target.checked,
                            e.setState({
                                record: n
                            })
                    }
                }, "休息时间"), A.default.createElement("div", {
                    style: {
                        marginLeft: 5,
                        width: 225,
                        display: "inline-block"
                    }
                }, "休息开始:", A.default.createElement(u.default, {
                    value: (0,
                        j.default)(this.state.record.restTime.start.time, V),
                    onChange: this._onRestTimeChange.bind(this, "start"),
                    style: {
                        marginLeft: 5,
                        marginRight: 10
                    },
                    format: V
                }), this.state.record.restTime.start.across ? A.default.createElement(d.default, {
                    color: "red",
                    style: {
                        marginTop: 0
                    }
                }, "次日") : ""), A.default.createElement("div", {
                    style: {
                        marginLeft: 0,
                        width: 245,
                        display: "inline-block"
                    }
                }, "休息结束: ", A.default.createElement(u.default, {
                    value: (0,
                        j.default)(this.state.record.restTime.end.time, V),
                    onChange: this._onRestTimeChange.bind(this, "end"),
                    style: {
                        marginLeft: 5,
                        marginRight: 10,
                        width: 100
                    },
                    format: V
                }), this.state.record.restTime.end.across ? A.default.createElement(d.default, {
                    color: "red",
                    style: {
                        marginTop: 0
                    }
                }, "次日") : "")) : A.default.createElement("div", null), A.default.createElement("div", {
                    style: {
                        marginTop: 10
                    }
                }, "合计工作时长", parseInt(F.default.getWorkTime(this.state.record.isRestTimeOpen, section, this.state.record.restTime) / 60, 10), "小时", F.default.getWorkTime(this.state.record.isRestTimeOpen, section, this.state.record.restTime) % 60, "分钟", A.default.createElement("span", {
                    style: {
                        color: "#c4c4c4"
                    }
                }, "（考勤统计工作时长及请假出差外出统计，会以此时间为准）")), A.default.createElement("div", {
                    style: {
                        marginTop: 30
                    }
                }, A.default.createElement(f.default, {
                    checked: this.state.record.isOffDutyFreeCheck,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.isOffDutyFreeCheck = t.target.checked,
                            e.setState({
                                record: n
                            })
                    }
                }, "下班不用打卡（开启后，下班不打卡也不会记作异常）")), A.default.createElement("div", {
                    style: {
                        marginTop: 20,
                        marginBottom: 10,
                        borderTop: "1px solid #e4e4e4"
                    }
                }), A.default.createElement("div", {
                    style: {
                        marginTop: 0,
                        color: "#949494"
                    }
                }, "人性化班次"), A.default.createElement("div", {
                    style: {
                        marginTop: 10
                    }
                }, A.default.createElement(f.default, {
                    checked: this.state.record.permitLateMinutes.enable,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.permitLateMinutes.enable = t.target.checked,
                            e.setState({
                                record: n
                            })
                    }
                }, "允许迟到分钟数"), A.default.createElement(l.default, {
                    style: {
                        marginLeft: 10
                    },
                    min: 0,
                    max: 3600,
                    value: this.state.record.permitLateMinutes.minute,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.permitLateMinutes.minute = t,
                            e.setState({
                                record: n
                            })
                    }
                })), A.default.createElement("div", {
                    style: {
                        marginTop: 10
                    }
                }, A.default.createElement(f.default, {
                    checked: this.state.record.seriousLateTime.enable,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.seriousLateTime.enable = t.target.checked,
                            e.setState({
                                record: n
                            })
                    }
                }, "严重迟到分钟数"), A.default.createElement(l.default, {
                    style: {
                        marginLeft: 10
                    },
                    min: 0,
                    max: 3600,
                    value: this.state.record.seriousLateTime.minute,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.seriousLateTime.minute = t,
                            e.setState({
                                record: n
                            })
                    }
                })), A.default.createElement("div", {
                    style: {
                        marginTop: 10
                    }
                }, A.default.createElement(f.default, {
                    checked: this.state.record.absentTime.enable,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.absentTime.enable = t.target.checked,
                            e.setState({
                                record: n
                            })
                    }
                }, "旷工迟到分钟数"), A.default.createElement(l.default, {
                    style: {
                        marginLeft: 10
                    },
                    min: 0,
                    max: 3600,
                    value: this.state.record.absentTime.minute,
                    onChange: function(t) {
                        var n = e.state.record;
                        n.absentTime.minute = t,
                            e.setState({
                                record: n
                            })
                    }
                })), A.default.createElement("div", {
                    style: {
                        marginTop: 20,
                        marginBottom: 10,
                        borderTop: "1px solid #e4e4e4"
                    }
                }), A.default.createElement("div", {
                    className: "lateClass"
                }, A.default.createElement("div", {
                    className: "lateClassTitle"
                }, A.default.createElement(f.default, {
                    checked: t.state.record.lateBack.enable,
                    onChange: t._lateClassChange
                }, "晚走晚到", A.default.createElement("span", {
                    className: "lateClassTitleInfo"
                }, "（第一天下班走太晚，第二天可以晚点到，仅支持固定班制内勤打卡）"))), A.default.createElement("div", {
                    className: "lateClassContent"
                }, t.state.record.lateBack.enable && t.state.record.lateBack.sections.length > 0 ? t.state.record.lateBack.sections.map(function(e, n) {
                    var a = t._getClassSectionBoundaryByOrder(n);
                    return A.default.createElement("div", {
                        key: n,
                        className: "lateClassItem"
                    }, A.default.createElement("div", {
                        className: "title"
                    }, "晚走规则", n + 1, n > 0 ? A.default.createElement("span", {
                        className: "lateClassDel",
                        onClick: function() {
                            t._lateClassDel(n)
                        }
                    }, "删除") : null), A.default.createElement("div", null, A.default.createElement("span", null, "第一天下班后晚走"), A.default.createElement(S.default, {
                        style: {
                            width: 60
                        },
                        value: (e.extra / 60).toFixed(1),
                        onChange: function(e) {
                            t._lateSelectChange(e, n, "extra")
                        }
                    }, t._returnSelectOptions(10).map(function(e, t) {
                        return A.default.createElement(G, {
                            key: t,
                            value: e
                        }, e)
                    })), A.default.createElement("span", null, " 小时，第二天上班可以晚到"), A.default.createElement(S.default, {
                        style: {
                            width: 60
                        },
                        value: (e.late / 60).toFixed(1),
                        onChange: function(e) {
                            t._lateSelectChange(e, n, "late")
                        }
                    }, t._returnSelectOptions(t._returnLateBackMax()).map(function(e, t) {
                        return A.default.createElement(G, {
                            key: t,
                            value: e
                        }, e)
                    })), A.default.createElement("span", null, "小时"), a && a.extra && a.late ? A.default.createElement("span", {
                        className: "infoText"
                    }, "第一天", a.extra.time, a.extra.across ? "(次日)" : null, "下班，第二天", a.late.time, "上班不算迟到") : null))
                }) : null, t.state.record.lateBack.enable && t.state.record.lateBack.sections.length > 0 && t.state.record.lateBack.sections.length < 3 ? A.default.createElement("div", {
                    className: "lateClassAdd",
                    onClick: t._lateClassAdd
                }, "新增晚走晚到") : null))))
        },
        _getClassSectionBoundaryByOrder: function(e) {
            var t = this
                , n = t.state.record.lateBack.sections[e]
                , a = t.state.record.sections
                , o = a[0].start
                , r = a[a.length - 1].end;
            return U.default.getClassSectionBoundary(o, r, n)
        },
        _lateSelectChange: function(e, t, n) {
            var a = this
                , o = a.state.record;
            o.lateBack.sections[t][n] = 60 * parseFloat(e, 10),
                a.setState({
                    record: o
                })
        },
        _lateClassChange: function(e) {
            var t = this
                , n = F.default.getTimeDuring(t.state.record.sections[0]);
            if (e.target.checked && n < 120)
                return void y.default.error("第一个上下班的时长小于两小时无需设置晚走晚到", 3);
            var a = t.state.record;
            a.lateBack.enable = e.target.checked,
                a.lateBack.sections = [{
                    extra: U.default.DEFAULT_SECTION.extra,
                    late: U.default.DEFAULT_SECTION.late
                }],
                t.setState({
                    record: a
                })
        },
        _lateClassAdd: function() {
            var e = this
                , t = e.state.record;
            if (t.lateBack.sections.length > 2)
                return void y.default.info("最多新增3个晚走晚到规则");
            var n = F.default.getTimeDuring(e.state.record.sections[0])
                , a = t.lateBack.sections[t.lateBack.sections.length - 1]
                , o = a.extra
                , r = a.late;
            return o + 30 > 600 || r + 30 > 600 || r + 30 >= n ? void y.default.error("已经设置了晚走晚到的最大时间，无需再新增时段") : (t.lateBack.sections.push({
                extra: o + 30,
                late: r + 30
            }),
                void e.setState({
                    record: t
                }))
        },
        _lateClassDel: function(e) {
            var t = this
                , n = t.state.record;
            n.lateBack.sections.splice(e, 1),
                t.setState({
                    record: n
                })
        },
        _returnLateBackMax: function() {
            var e = this
                , t = F.default.getTimeDuring(e.state.record.sections[0])
                , n = t - 30 > 600 ? 600 : t - 30;
            return .5 * Math.floor(n / 60 * 2)
        },
        _returnSelectOptions: function(e) {
            for (var t = [], n = .5; n <= e; n += .5)
                t.push(n.toFixed(1).toString());
            return t
        },
        _handleCancel: function() {
            this.setState({
                visible: !1
            })
        },
        _onChange: function(e, t, n) {
            var a = this
                , o = null
                , r = N.Utils.deepCopy(this.state.record.sections);
            r[e][t].time = n.format("HH:mm"),
                r[e][t].beginMin = -1,
                r[e][t].endMin = -1;
            var i = 0;
            "start" === t ? (i = parseInt(e) - 1,
            i < 0 && (i = r.length - 1),
                r[i].end.beginMin = -1,
                r[i].end.endMin = -1) : "end" === t && (i = parseInt(e) + 1,
            i > r.length - 1 && (i = 0),
                r[i].start.beginMin = -1,
                r[i].start.endMin = -1);
            for (var l = 0; l < r.length; ++l) {
                var s = r[l];
                if (l) {
                    var d = r[l - 1];
                    if (d.end.time === s.start.time || s.end.time === s.start.time) {
                        o = "两个时间点不能设置为同一时间";
                        break
                    }
                    if (d.end.time < s.start.time)
                        s.start.across = d.end.across;
                    else {
                        if (d.end.across && s.start.across) {
                            o = "请按时间顺序设置时间点";
                            break
                        }
                        s.start.across = 1
                    }
                    if (s.end.time > s.start.time)
                        s.end.across = s.start.across;
                    else {
                        if (s.end.across && s.start.across) {
                            o = "请按时间顺序设置时间点";
                            break
                        }
                        s.end.across = 1
                    }
                } else {
                    if (s.end.time === s.start.time) {
                        o = "两个时间点不能设置为同一时间";
                        break
                    }
                    s.end.time > s.start.time ? (s.start.across = 0,
                        s.end.across = 0) : s.end.time < s.start.time && (s.start.across = 0,
                        s.end.across = 1)
                }
            }
            if (o)
                y.default.error(o);
            else {
                if (a.state.record.lateBack.enable) {
                    var c = F.default.getTimeDuring(r[0])
                        , u = U.default.getSectionValidateResult(c, a.state.record.lateBack.sections);
                    if (0 !== u.errorCode)
                        return void y.default.error(u.errorMsg, 5)
                }
                var p = this.state.record;
                p.sections = r,
                0 === e && (p.restTime = F.default.getDefaultRestTime(r[e])),
                    this.setState({
                        record: p
                    })
            }
        },
        _onRestTimeChange: function(e, t) {
            var n = null
                , a = N.Utils.deepCopy(this.state.record.restTime)
                , o = this.state.record.sections[0];
            if (a[e].time = t.format("HH:mm"),
                    a.end.time === a.start.time || a.start.time === o.start.time ||
                    a.end.time === o.end.time ? n = "两个时间点不能设置为同一时间"
                        : o.end.across && !o.start.across ?
                        a.start.time < o.start.time && a.start.time > o.end.time
                        || a.end.time < a.start.time && a.end.time > o.end.time ? n = "请按时间顺序设置时间点1" : a.end.time < a.start.time ? (a.start.across = 0, a.end.across = 1) : a.start.time < o.start.time && a.start.time < o.end.time ? (a.start.across = 1, a.end.across = 1) : (a.start.across = 0, a.end.across = 0)
                        : o.end.across || o.start.across ||
                        (a.end.time < a.start.time || o.end.time < a.end.time ||
                        o.start.time > a.start.time ? n = "请按时间顺序设置时间点" :
                            (a.start.across = 0,
                        a.end.across = 0)),
                    n)
                y.default.error(n);
            else {
                var r = this.state.record;
                r.restTime = a,
                    this.setState({
                        record: r
                    })
            }
        },
        _onAddClassClick: function(e) {
            N.Utils.goldlog("pc_kaoqin_class_create_new_button", "pc_kaoqin_class_create_new_button"),
                this.setState({
                    visible: !0,
                    record: {
                        id: -1,
                        serial: "",
                        permitLateMinutes: {
                            enable: !1,
                            minute: 30
                        },
                        seriousLateTime: {
                            enable: !1,
                            minute: 30
                        },
                        absentTime: {
                            enable: !1,
                            minute: 30
                        },
                        relatedGroupNames: [],
                        sections: F.default.DEFAULT_SECTIONS_ONE,
                        restTime: F.default.getDefaultRestTime(F.default.DEFAULT_SECTIONS_ONE[0]),
                        lateBack: {
                            enable: !1,
                            sections: [{
                                extra: U.default.DEFAULT_SECTION.extra,
                                late: U.default.DEFAULT_SECTION.late
                            }]
                        }
                    }
                })
        },
        _onModifyClick: function(e, t) {
            N.Utils.goldlog("pc_kaoqin_class_edit_button", "pc_kaoqin_class_edit_button"),
            e.lateBack && e.lateBack.sections || (e.lateBack = {
                enable: !1,
                sections: [{
                    extra: U.default.DEFAULT_SECTION.extra,
                    late: U.default.DEFAULT_SECTION.late
                }]
            }),
                e.checkScopeChecked = e.sections.filter(function(e) {
                    return e.start.beginMin > 0 || e.end.endMin > 0
                }).length > 0,
                this.setState({
                    visible: !0,
                    record: e
                })
        },
        _onDeleteClick: function(e, t) {
            var n = this;
            K({
                title: "您是否确认要删除该班次",
                onOk: function() {
                    n._ajaxClassDelete(e)
                }
            })
        },
        _ajaxClassList: function() {
            var e = this;
            this.setState({
                columns: this._constructColumns(),
                loading: !0
            }),
                N.Utils.getJson("/admin/class/list").then(function(t) {
                    e.idIndexMap = {};
                    var n = [];
                    t.map(function(a, o) {
                        e.idIndexMap[a.id] = o,
                            n.push({
                                id: a.id,
                                value: t[o]
                            });
                        var r = "";
                        for (var i in a.sections)
                            if ({}.hasOwnProperty.call(a.sections, i)) {
                                var l = a.sections[i];
                                r += l.start.across ? "次日" + l.start.time : l.start.time,
                                    r += l.end.across ? "-次日" + l.end.time + " " : "-" + l.end.time + " "
                            }
                        return a.key = a.id,
                            a.name = a.serial,
                            a.description = r,
                            a.relatedGroupNames = a.relatedGroupNames || [],
                            a.isOffDutyFreeCheck = a.isOffDutyFreeCheck || !1,
                            a.isRestTimeOpen = a.isRestTimeOpen || !1,
                            a.permitLateMinutes = {
                                enable: !!(a.permitLateMinutes && a.permitLateMinutes >= 0),
                                minute: a.permitLateMinutes && a.permitLateMinutes > 0 ? a.permitLateMinutes : 30
                            },
                            a.seriousLateTime = {
                                enable: !!(a.seriousLateTime && a.seriousLateTime >= 0),
                                minute: a.seriousLateTime && a.seriousLateTime > 0 ? a.seriousLateTime : 30
                            },
                            a.absentTime = {
                                enable: !!(a.absentTime && a.absentTime >= 0),
                                minute: a.absentTime && a.absentTime > 0 ? a.absentTime : 30
                            },
                            a.restTime = a.restTime || F.default.getDefaultRestTime(a.sections[0]),
                            a
                    }),
                    e.props.data && e.props.data.onInit && e.props.data.onInit(n),
                        e.setState({
                            loading: !1,
                            dataSource: t
                        })
                }).catch(function() {
                    e.setState({
                        loading: !1
                    })
                })
        },
        _checkLateBackSections: function() {
            var e = this;
            if (e.state.record.lateBack.enable)
                for (var t = e.state.record.lateBack.sections, n = t.length, a = 0; a < n; a++) {
                    if (t[a - 1] && (t[a].extra <= t[a - 1].extra || t[a].late <= t[a - 1].late))
                        return !1;
                    if (t[a + 1] && (t[a + 1].extra <= t[a].extra || t[a + 1].late <= t[a].late))
                        return !1
                }
            return !0
        },
        _ajaxClassAdd: function(e) {
            var t = this
                , n = this;
            if (!n._checkLateBackSections())
                return void y.default.error("晚走晚到后面的规则时间必须大于前面的时间", 5);
            this.setState({
                confirmLoading: !0
            });
            var a = this.state.record.sections;
            this.state.record.checkScopeChecked || (a = a.map(function(e, t) {
                return e.start.beginMin = -1,
                    e.start.endMin = -1,
                    e.end.beginMin = -1,
                    e.end.endMin = -1,
                    e
            }));
            var o = {
                sections: (0,
                    E.default)(a)
            };
            this.state.record.id !== -1 && (o.id = this.state.record.id),
                o.isEnableNextDay = e,
                o.isOffDutyFreeCheck = this.state.record.isOffDutyFreeCheck || !1,
                o.serial = this.state.record.serial,
                o.absentTime = this.state.record.absentTime && this.state.record.absentTime.enable ? this.state.record.absentTime.minute : -1,
                o.permitLateMinutes = this.state.record.permitLateMinutes && this.state.record.permitLateMinutes.enable ? this.state.record.permitLateMinutes.minute : -1,
                o.seriousLateTime = this.state.record.seriousLateTime && this.state.record.seriousLateTime.enable ? this.state.record.seriousLateTime.minute : -1,
                o.isRestTimeOpen = this.state.record.isRestTimeOpen,
                o.workTime = F.default.getWorkTime(this.state.record.isRestTimeOpen, a, this.state.record.restTime),
            this.state.record.isRestTimeOpen && (o.restTime = (0,
                E.default)(this.state.record.restTime)),
            n.state.record.lateBack.enable && n.state.record.lateBack.sections.length > 0 && (o.lateBack = (0,
                E.default)(n.state.record.lateBack)),
                N.Utils.postJson("/admin/class/add", o).then(function() {
                    t._ajaxClassList(),
                        t.setState({
                            confirmLoading: !1,
                            visible: !1
                        }),
                        y.default.success("操作成功"),
                        t.state.classId !== -1 ? N.Utils.goldlog("pc_kaoqin_class_edit_suc", "pc_kaoqin_class_edit_suc") : N.Utils.goldlog("pc_kaoqin_class_create_new_suc", "pc_kaoqin_class_create_new_suc")
                }).catch(function() {
                    t.setState({
                        confirmLoading: !1
                    })
                })
        },
        _ajaxClassDelete: function(e) {
            var t = this;
            N.Utils.getJson("/admin/class/delete", {
                classId: e
            }).then(function(e) {
                t._ajaxClassList(),
                    t.setState({
                        confirmLoading: !1,
                        visible: !1
                    }),
                    y.default.success("删除成功")
            }).catch(function() {})
        },
        _constructColumns: function() {
            var e = this
                , t = [];
            return this.props.data ? (t.push({
                width: "160px",
                title: "班次名称",
                dataIndex: "name"
            }),
                t.push({
                    title: "考勤时间",
                    dataIndex: "description"
                }),
            this.props.data && this.props.data.noNeedClassGroup && this.props.data.classGroupId && t.push({
                title: "使用情况",
                dataIndex: "state"
            })) : (t.push({
                width: "300px",
                title: "班次名称",
                dataIndex: "name"
            }),
                t.push({
                    width: "400px",
                    title: "考勤时间",
                    dataIndex: "description"
                }),
                t.push({
                    width: "70px",
                    title: "操作",
                    dataIndex: "operation",
                    render: function(t, n) {
                        return A.default.createElement("div", null, A.default.createElement("a", {
                            onClick: e._onModifyClick.bind(e, n)
                        }, "编辑"), A.default.createElement("span", {
                            className: "ant-divider"
                        }), A.default.createElement("a", {
                            onClick: e._onDeleteClick.bind(e, n.id)
                        }, "删除"))
                    }
                })),
                t
        }
    }),
        e.exports = t.default
}

function(e, t) {
    "use strict";
    e.exports = {
        DEFAULT_SECTIONS_ONE: [{
            start: {
                time: "09:00",
                across: 0
            },
            end: {
                time: "18:00",
                across: 0
            }
        }],
        DEFAULT_SECTIONS_TWO: [{
            start: {
                across: 0,
                time: "09:00"
            },
            end: {
                across: 0,
                time: "12:00"
            }
        }, {
            start: {
                across: 0,
                time: "14:00"
            },
            end: {
                across: 0,
                time: "18:00"
            }
        }],
        DEFAULT_SECTIONS_THREE: [{
            start: {
                across: 0,
                time: "09:00"
            },
            end: {
                across: 0,
                time: "11:00"
            }
        }, {
            start: {
                across: 0,
                time: "12:00"
            },
            end: {
                across: 0,
                time: "15:00"
            }
        }, {
            start: {
                across: 0,
                time: "16:00"
            },
            end: {
                across: 0,
                time: "18:00"
            }
        }],
        DEFAULT_REST: {
            start: {
                time: "12:00",
                across: 0
            },
            end: {
                time: "13:00",
                across: 0
            }
        },
        getDefaultSection: function(section) {
            if (!section || !section.end || !section.end.time)
                return null;
            var endTimeArray = section.end.time.split(":");
            if (2 !== endTimeArray.length)
                return null;
            var endAcross = section.end.across
                , a = parseInt(endTimeArray[0], 10) + 1;
            a >= 24 && (endAcross += 1,
                a -= 24);
            var o = endAcross
                , r = a + 3;
            return r >= 24 && (o += 1,
                r -= 24),
                {
                    start: {
                        time: this.getFormatTime(a) + ":" + endTimeArray[1],
                        across: endAcross
                    },
                    end: {
                        time: this.getFormatTime(r) + ":" + endTimeArray[1],
                        across: o
                    }
                }
        },
        getFormatTime: function(e) {
            var t = e + "";
            return 2 === t.length ? t : "0" + t
        },
        getDefaultRestTime: function(e) {
            if (!(e && e.start && e.start.time && e.end && e.end.time))
                return null;
            var t = e.start.time.split(":")
                , n = e.end.time.split(":");
            if (2 !== t.length)
                return null;
            if (2 !== n.length)
                return null;
            var a = e.start.across
                , o = e.end.across;
            if (0 === a && 0 === o && parseInt(t[0], 10) < 12 && parseInt(n[0], 10) > 13)
                return this.DEFAULT_REST;
            var r = Math.floor((parseInt(t[0], 10) + 24 * a + parseInt(n[0], 10) + 24 * o) / 2)
                , i = Math.floor(r / 24)
                , l = Math.floor((parseInt(t[1], 10) + parseInt(n[1], 10)) / 2)
                , s = this.getWorkTime(!1, [e])
                , d = Math.floor(s / 8)
                , c = Math.floor(d / 60)
                , u = i
                , p = r + c
                , f = r === p ? d % 60 : 0;
            p >= 24 && (u += 1,
                p -= p),
            i === e.start.across && this.getFormatTime(r % 24) === t[0] && this.getFormatTime(l) === t[1] && (l += 1,
            60 === l && (l = 0,
                r += 1)),
            i === u && r === p && l > f && (f = l + 1);
            var m = {
                start: {
                    time: this.getFormatTime(r % 24) + ":" + this.getFormatTime(l),
                    across: i
                },
                end: {
                    time: this.getFormatTime(p) + ":" + this.getFormatTime(f),
                    across: u
                }
            };
            return m
        },
        getCompareTimePoint: function(e, t, n) {
            return 0 === e && "start" === t ? null : e >= 0 && "end" === t ? n.sections[e].start : e > 0 && "start" === t ? n.sections[e - 1].end : e > 0 && "end" === t ? n.sections[e].start : e === -1 && "start" === t ? n.sections[0].start : e === -1 && "end" === t ? n.restTime.start : void 0
        },
        getAcrossTip: function(e) {
            for (var t = "", n = 0; n < e; n++)
                t += "次";
            return "" !== t && (t += "日"),
                t
        },
        getAcross: function(e, t) {
            var n = void 0;
            return n = e > t.time ? t.across : t.across + 1
        },
        getSectionValidateResult: function(e) {
            var t = e.start
                , n = e.end
                , a = 0
                , o = "";
            return n.time === t.time && n.across === t.across ? (a = 1,
                o = "两个时间点不能设置为同一时间") : (n.time < t.time && n.across <= t.across || n.time > t.time && n.across < t.across) && (a = 2,
                o = "请按时间顺序设置时间点"),
                {
                    errorCode: a,
                    errorMsg: o
                }
        },
        getSectionDuring: function(e) {
            if (!(e && e.start && e.end && e.start.time && e.end.time))
                return 0;
            var t = e.start.time.split(":")
                , n = e.end.time.split(":");
            if (2 !== t.length || 2 !== n.length)
                return 0;
            var a = 60 * parseInt(t[0], 10) + parseInt(t[1], 10) + 24 * e.start.across * 60
                , o = 60 * parseInt(n[0], 10) + parseInt(n[1], 10) + 24 * e.end.across * 60;
            return o > a ? o - a : 0
        },
        getWorkTime: function(e, t, n) {
            for (var a = 0, o = 0; o < t.length; o++)
                a += this.getSectionDuring(t[o]);
            return e && 1 === t.length && n && (a -= this.getSectionDuring(n)),
                a
        }
    }
}
