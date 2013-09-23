
var Calendar__Name = "__zc__commoncalendar",
    CALENDAR_BOX_WIDTH = 170,
    CALENDAR_BOX_HEIGHT = 180,
    month, year;

function CalendarControl() {
    var a = Calendar__Name;

    this.calendarHtml = Calendar__calendarHtml_custom;
    this.attach = _Calendar__attach_custom;
    this.isAttached = _Calendar__isAttached_custom;
    this.hide = _Calendar__hide_custom;
    this.show = _Calendar__show_custom;
    this.setMonth = _Calendar__setMonth_custom;
    this.moveTo = _Calendar__moveTo_custom;
    this.name = Calendar__Name;
    document[a] ? alert("calendar.js: Attempt to create duplicate calendar  with name '" + a + "'") : document[a] = this;
    if (document.all) document.body.insertAdjacentHTML("beforeEnd",
        '<iframe name="' + Calendar__Name + '" id="' + Calendar__Name + '" style="' + calendarIframeStyle + '"  marginwidth=0 marginheight=0  onclick="_Calendar__documentClick_custom(\'' + a + '\')" src="javascript:Calendar__setBox_custom (document)" scrolling=no framespacing=0 frameborder=0 width="' + CALENDAR_BOX_WIDTH + '" height="' + CALENDAR_BOX_HEIGHT + '"></iframe>'), document.body.onclick = _Calendar__documentClick_custom, this.hide();
    return this
}
var _Calendar_wkDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    _Calendar_daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    _Calendar_monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    _calendarIframeBox_custom = null;

function Calendar__setBox_custom(a) {
    _calendarIframeBox_custom = a;
    a.onclick = _Calendar__documentClick_custom;
    return ""
}

function _Calendar__hide_custom() {
    document.all(Calendar__Name)
        .style.display = "none"
}

function _Calendar__show_custom() {
    document.all(Calendar__Name)
        .style.display = "block"
}

function _Calendar__documentClick_custom() {
    _calendarIframeBox_custom && calendar.hide()
}

function Debug(a) {
    var b = document.all("Debug");
    b && b.insertAdjacentText("beforeEnd", a)
}

function _Calendar__isAttached_custom() {
    return this._dateBox != null
}

function _Calendar__setMonth_custom(a, b) {
    _calendarIframeBox_custom.body.innerHTML = this.calendarHtml_custom(a, b)
}

function _Calendar__attach_custom(a) {
    typeof a == "string" && (a = document.all(a));
    var b = a.value;
    parseDate(b) || (b = "");
    var c = null;
    switch (date_format) {
    case "dd/MM/yyyy":
        b && b.length > 0 ? (c = a.value.split("/"), b = convertToInt(c[1]) - 1, convertToInt(c[0]), c = convertToInt(c[2])) : (c = new Date, b = c.getMonth(), c = c.getFullYear());
        break;
    default:
        b && b.length > 0 ? (b = Date.parse(b), c = b == 0 || isNaN(b) ? new Date : new Date(b), b = c.getMonth(), c = c.getFullYear(), c < 100 && (c += 1900)) : (c = new Date, b = c.getMonth(), c = c.getFullYear())
    }
    var d = a.getBoundingClientRect(),
        e = document.all(Calendar__Name)
            .style;
    e.top = d.bottom + 1 + document.body.scrollTop;
    e.left = d.left + document.body.scrollLeft;
    _calendarIframeBox_custom.body.innerHTML = this.calendarHtml_custom(b, c);
    this.show();
    this._dateBox = a;
    event.cancelBubble = !0
}

function _Calendar__moveTo_custom(a, b) {
    var c = document.all(Calendar__Name)
        .style;
    c.top = b;
    c.left = a
}

function _Calendar_updateDisplay_custom(a, b, c) {
    showMonthCalendars_custom(b, c, "${servlet_prefix}/custom/calendar/daysEvents.html?")
}

function _isLeapYear_custom(a) {
    return a % 4 == 0 && (a % 100 != 0 || a % 400 == 0)
}

function _daysInMonth(a, b) {
    return _isLeapYear_custom(b) && a == 1 ? 29 : _Calendar_daysInMonth[a]
}

function _Calendar_noop() {
    try {
        afterAttachInParent()
    } catch (a) {}
}

function _Calendar__prefix0_custom(a) {
    a = "" + a;
    return a.length > 1 ? a : "0" + a
}

function _Calendar_updateBox_custom(a, b, c, d) {
    if (calendar && calendar._dateBox) switch (date_format) {
    case "dd/MM/yyyy":
        calendar._dateBox.value = _Calendar__prefix0_custom(c) + "/" + _Calendar__prefix0_custom(b) + "/" + d;
        calendar.hide();
        _Calendar_noop();
        break;
    default:
        calendar._dateBox.value = _Calendar__prefix0_custom(b) + "/" + _Calendar__prefix0_custom(c) + "/" + d, calendar.hide(), _Calendar_noop()
    }
}

function CalendarHtml_custom(a, b, c) {
    var d = new Date,
        e = "<table height=\"100%\" cellpadding=2 cellspacing=1 border=0 align=center width=\"92%\" style='background-color: rgb(255, 255, 255); font-size: 7pt; font-family: Tahoma;';=''>\n";
    a >= 12 ? (a -= 12, b++) : a < 0 && (a += 12, b--);
    d = new Date;
    e = '<html>\n<body >\n<table cellpadding=1 cellspacing=2 border=0 align=center width="100%"; height="100%" style="' + calendarOuterTableStyle + '">\n';
    e += '<tr>\n  <td colspan=7 valign=top height=10px>\n    <table border=0 style="' +
        calendarInnerTableStyle + '" >\n      <tr >\n       <td width=10% class=calendarArrowClass ><a href="javascript:_Calendar_updateDisplay_custom(\'' + this.name + "', " + a + ", " + (b - 1) + ')" style="text-decoration: none"  onclick="_Calendar_updateDisplay_custom(\'' + this.name + "', " + a + ", " + (b - 1) + ')"><img src=/atCRM/images/arwPyear.png border=0 title="Previous year"></a></td>       <td width=10% class=calendarArrowClass >';
    var f = a - 1,
        g = b;
    f < 0 && (f = 11, g--);
    e += '<a href="javascript:_Calendar_noop()" style="text-decoration: none"   onclick="_Calendar_updateDisplay_custom(\'' +
        this.name + "', " + f + ", " + g + ')"><img src=/atCRM/images/arwPmonth.png border=0 title="Previous month"></a></td>       <td align=center width=90% class=calendarArrowClass style="color:#000000; font-size:10px">' + _makeMonthSelector_custom(a, b) + "</td>\n       <td width=10% class=calendarArrowClass >";
    f = a + 1;
    g = b;
    f > 11 && (f = 0, g++);
    e += '<a href="javascript:_Calendar_noop()" style="text-decoration: none"   onclick="_Calendar_updateDisplay_custom(\'' + this.name + "', " + f + ", " + g + ')"> <img src=/atCRM/images/arwNmonth.png border=0 title="Next month"></a></td>\n       <td width=10% class=calendarArrowClass ><a href="javascript:_Calendar_noop()" style="text-decoration: none"   onclick="_Calendar_updateDisplay_custom(\'' +
        this.name + "', " + a + ", " + (+b + 1) + ')"><img src=/atCRM/images/arwNyear.png border=0 title="Next year"></a></td>\n      </tr>\n    </table>\n  </td>\n</tr>\n';
    e += "<tr>\n";
    for (f = 0; f < 7; f++) e += "<td align=center >" + _Calendar_wkDays[f] + "</td>\n";
    e += "</tr>\n";
    var g = (new Date(b, a, 1))
        .getDay(),
        h = _daysInMonth(a, b) + g;
    e += "<tr>\n";
    d.getDate();
    d.getMonth();
    d.getFullYear();
    for (f = 0; f < h; f++) {
        var i = f - g + 1;
        e += i == d.getDate() && a == d.getMonth() && b == d.getFullYear() ? "  <td align=center  class='calenderSelectedDateColumsStyle'>" :
            i > 0 ? '  <td align=center class="calendarCellClass">' : "  <td>";
        i > 0 && (e += (date_format = "dd/MM/yyyy", '\n    <a href="' + c + "dateParam=" + i + "/" + (a + 1) + "/" + b + "\" style='color:black'>"), e += '\n   <a href="' + c + "dateParam=" + i + "/" + (a + 1) + "/" + b + "\"  style='color:black; text-decoration:none;font-size: 7pt; font-weight: bold; font-family: arial; width: 15px;'>", e += i, e += "</a>", e += "\n");
        e += "  </td >\n";
        (f + 1) % 7 == 0 && (e += "</tr>\n", f < h - 1 && (e += "<tr >\n"))
    }
    f % 7 == 0 && (e += "</tr>\n");
    e += "</table>\n";
    return e
}

function _makeMonthSelector_custom(a, b) {
    return "<b>" + _Calendar_monthNames[a] + " " + b + "</b>"
}

function showMonthCalendars_custom(a, b, c) {
    for (var d = 0; d < 4; d++) {
        var e = document.getElementById("calendarBox" + (d + 1));
        if (e) {
            var f = a - 1 + d,
                g = b;
            f < 0 ? (f += 12, g--) : f > 11 && (f -= 12, g++);
            e.innerHTML = CalendarHtml_custom(f, g, c)
        }
    }
};
Calendar = function () {
    function a(b) {
        b = b || {};
        this.args = b = Z(b, {
            animation: !U,
            cont: null,
            bottomBar: !0,
            date: !0,
            fdow: x("fdow"),
            min: null,
            max: null,
            reverseWheel: !1,
            selection: [],
            selectionType: a.SEL_SINGLE,
            weekNumbers: !1,
            align: "Bl/ / /T/r",
            inputField: null,
            trigger: null,
            dateFormat: "%Y-%m-%d",
            opacity: w ? 1 : 3,
            titleFormat: "%b %Y",
            showTime: !1,
            timePos: "right",
            time: !0,
            minuteStep: 5,
            disabled: B,
            checkRange: !1,
            dateInfo: B,
            onChange: B,
            onSelect: B,
            onTimeChange: B,
            onFocus: B,
            onBlur: B
        });
        this.handlers = {};
        var c = this,
            d = new Date;
        b.min = N(b.min);
        b.max = N(b.max);
        if (b.date === !0) b.date = d;
        if (b.time === !0) b.time = d.getHours() * 100 + Math.floor(d.getMinutes() / b.minuteStep) * b.minuteStep;
        this.date = N(b.date);
        this.time = b.time;
        this.fdow = b.fdow;
        $("onChange onSelect onTimeChange onFocus onBlur".split(/\s+/), function (a) {
            var d = b[a];
            d instanceof Array || (d = [d]);
            c.handlers[a] = d
        });
        this.selection = new a.Selection(b.selection, b.selectionType, G, this);
        d = h.call(this);
        b.cont && O(b.cont)
            .appendChild(d);
        b.trigger && this.manageFields(b.trigger, b.inputField, b.dateFormat)
    }

    function b(a) {
        var b = ["<table", C, "><tr>"],
            c = 0;
        for (a.args.weekNumbers && b.push("<td><div class='DynarchCalendar-weekNumber'>", x("wk"), "</div></td>"); c < 7;) {
            var d = (c+++a.fdow) % 7;
            b.push("<td><div", x("weekend")
                .indexOf(d) >= 0 ? " class='DynarchCalendar-weekend'>" : ">", x("sdn")[d], "</div></td>")
        }
        b.push("</tr></table>");
        return b.join("")
    }

    function c(a, b, c) {
        var b = b || a.date,
            c = c || a.fdow,
            b = new Date(b.getFullYear(), b.getMonth(), b.getDate(), 12, 0, 0, 0),
            d = b.getMonth(),
            e = [],
            f = 0,
            g = a.args.weekNumbers;
        b.setDate(1);
        c = (b.getDay() - c) % 7;
        c < 0 && (c +=
            7);
        b.setDate(0 - c);
        b.setDate(b.getDate() + 1);
        var h = new Date,
            c = h.getDate(),
            i = h.getMonth(),
            h = h.getFullYear();
        e[f++] = "<table class='DynarchCalendar-bodyTable'" + C + ">";
        for (var j = 0; j < 6; ++j) {
            e[f++] = "<tr class='DynarchCalendar-week";
            j == 0 && (e[f++] = " DynarchCalendar-first-row");
            j == 5 && (e[f++] = " DynarchCalendar-last-row");
            e[f++] = "'>";
            g && (e[f++] = "<td class='DynarchCalendar-first-col'><div class='DynarchCalendar-weekNumber'>" + Y(b) + "</div></td>");
            for (var k = 0; k < 7; ++k) {
                var l = b.getDate(),
                    m = b.getMonth(),
                    n = b.getFullYear(),
                    o = 1E4 * n + 100 * (m + 1) + l,
                    q = a.selection.isSelected(o),
                    p = a.isDisabled(b);
                e[f++] = "<td class='";
                k == 0 && !g && (e[f++] = " DynarchCalendar-first-col");
                if (k == 0 && j == 0) a._firstDateVisible = o;
                if (k == 6 && (e[f++] = " DynarchCalendar-last-col", j == 5)) a._lastDateVisible = o;
                q && (e[f++] = " DynarchCalendar-td-selected");
                e[f++] = "'><div dyc-type='date' unselectable='on' dyc-date='" + o + "' ";
                p && (e[f++] = "disabled='1' ");
                e[f++] = "class='DynarchCalendar-day";
                x("weekend")
                    .indexOf(b.getDay()) >= 0 && (e[f++] = " DynarchCalendar-weekend");
                m != d && (e[f++] =
                    " DynarchCalendar-day-othermonth");
                l == c && m == i && n == h && (e[f++] = " DynarchCalendar-day-today");
                p && (e[f++] = " DynarchCalendar-day-disabled");
                q && (e[f++] = " DynarchCalendar-day-selected");
                (p = a.args.dateInfo(b)) && p.klass && (e[f++] = " " + p.klass);
                e[f++] = "'>" + l + "</div></td>";
                b = new Date(n, m, l + 1, 12, 0, 0, 0)
            }
            e[f++] = "</tr>"
        }
        e[f++] = "</table>";
        return e.join("")
    }

    function d(a) {
        var c = ["<table class='DynarchCalendar-topCont'", C, "><tr><td><div class='DynarchCalendar'>", !w ? "<button class='DynarchCalendar-focusLink'></button>" :
            "<a class='DynarchCalendar-focusLink' href='#'></a>", "<div class='DynarchCalendar-topBar'><div dyc-type='nav' dyc-btn='-Y' dyc-cls='hover-navBtn,pressed-navBtn' class='DynarchCalendar-navBtn DynarchCalendar-prevYear'><div></div></div><div dyc-type='nav' dyc-btn='+Y' dyc-cls='hover-navBtn,pressed-navBtn' class='DynarchCalendar-navBtn DynarchCalendar-nextYear'><div></div></div><div dyc-type='nav' dyc-btn='-M' dyc-cls='hover-navBtn,pressed-navBtn' class='DynarchCalendar-navBtn DynarchCalendar-prevMonth'><div></div></div><div dyc-type='nav' dyc-btn='+M' dyc-cls='hover-navBtn,pressed-navBtn' class='DynarchCalendar-navBtn DynarchCalendar-nextMonth'><div></div></div><table class='DynarchCalendar-titleCont'",
            C, "><tr><td><div dyc-type='title' dyc-btn='menu' dyc-cls='hover-title,pressed-title' class='DynarchCalendar-title'>", e(a), "</div></td></tr></table><div class='DynarchCalendar-dayNames'>", b(a), "</div></div><div class='DynarchCalendar-body'></div>"
        ];
        (a.args.bottomBar || a.args.showTime) && c.push("<div class='DynarchCalendar-bottomBar'>", g(a), "</div>");
        c.push("<div class='DynarchCalendar-menu' style='display: none'>", f(a), "</div><div class='DynarchCalendar-tooltip'></div></div></td></tr></table>");
        return c.join("")
    }

    function e(a) {
        return "<div unselectable='on'>" + F(a.date, a.args.titleFormat) + "</div>"
    }

    function f(a) {
        for (var a = ["<table height='100%'", C, "><tr><td><table style='margin-top: 1.5em'", C, "><tr><td colspan='3'><input dyc-btn='year' class='DynarchCalendar-menu-year' size='6' value='", a.date.getFullYear(), "' /></td></tr><tr><td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='today'>", x("goToday"), "</div></td></tr></table><p class='DynarchCalendar-menu-sep'>&nbsp;</p><table class='DynarchCalendar-menu-mtable'",
            C, ">"
        ], b = x("smn"), c = 0, d = a.length, e; c < 12;) {
            a[d++] = "<tr>";
            for (e = 4; --e > 0;) a[d++] = "<td><div dyc-type='menubtn' dyc-cls='hover-navBtn,pressed-navBtn' dyc-btn='m" + c + "' class='DynarchCalendar-menu-month'>" + b[c++] + "</div></td>";
            a[d++] = "</tr>"
        }
        a[d++] = "</table></td></tr></table>";
        return a.join("")
    }

    function g(a) {
        function b() {
            if (d.showTime) {
                c.push("<td>");
                var e = a,
                    f = c;
                f.push("<table class='DynarchCalendar-time'" + C + "><tr><td rowspan='2'><div dyc-type='time-hour' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-hour'></div></td><td dyc-type='time-hour+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td><td rowspan='2' class='DynarchCalendar-time-sep'></td><td rowspan='2'><div dyc-type='time-min' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-minute'></div></td><td dyc-type='time-min+' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-up'></td>");
                e.args.showTime == 12 && f.push("<td rowspan='2' class='DynarchCalendar-time-sep'></td><td rowspan='2'><div class='DynarchCalendar-time-am' dyc-type='time-am' dyc-cls='hover-time,pressed-time'></div></td>");
                f.push("</tr><tr><td dyc-type='time-hour-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td><td dyc-type='time-min-' dyc-cls='hover-time,pressed-time' class='DynarchCalendar-time-down'></td></tr></table>");
                c.push("</td>")
            }
        }
        var c = [],
            d = a.args;
        c.push("<table", C, " style='width:100%'><tr>");
        d.timePos == "left" && b();
        d.bottomBar && (c.push("<td>"), c.push("<table", C, "><tr><td><div dyc-btn='today' dyc-cls='hover-bottomBar-today,pressed-bottomBar-today' dyc-type='bottomBar-today' class='DynarchCalendar-bottomBar-today'>", x("today"), "</div></td></tr></table>"), c.push("</td>"));
        d.timePos == "right" && b();
        c.push("</tr></table>");
        return c.join("")
    }

    function h() {
        var a = aa("div"),
            b = this.els = {}, c = {
                mousedown: u(o, this, !0),
                mouseup: u(o, this, !1),
                mouseover: u(t, this, !0),
                mouseout: u(t, this, !1),
                keypress: u(M, this)
            };
        c[ga ? "DOMMouseScroll" : "mousewheel"] = u(D, this);
        if (w) c.dblclick = c.mousedown, c.keydown = c.keypress;
        a.innerHTML = d(this);
        P(a.firstChild, function (a) {
            var c = ba[a.className];
            c && (b[c] = a);
            w && a.setAttribute("unselectable", "on")
        });
        E(b.main, c);
        E([b.focusLink, b.yearInput], this._focusEvents = {
            focus: u(i, this),
            blur: u(j, this)
        });
        this.moveTo(this.date, !1);
        this.setTime(null, !0);
        return b.topCont
    }

    function i() {
        this._bluringTimeout && clearTimeout(this._bluringTimeout);
        this.focused = !0;
        V(this.els.main, "DynarchCalendar-focused");
        this.callHooks("onFocus", this)
    }

    function k() {
        this.focused = !1;
        J(this.els.main, "DynarchCalendar-focused");
        this._menuVisible && q(this, !1);
        this.args.cont || this.hide();
        this.callHooks("onBlur", this)
    }

    function j() {
        this._bluringTimeout = setTimeout(u(k, this), 50)
    }

    function l(a) {
        switch (a) {
        case "time-hour+":
            this.setHours(this.getHours() + 1);
            break;
        case "time-hour-":
            this.setHours(this.getHours() - 1);
            break;
        case "time-min+":
            this.setMinutes(this.getMinutes() + this.args.minuteStep);
            break;
        case "time-min-":
            this.setMinutes(this.getMinutes() -
                this.args.minuteStep)
        }
    }

    function n(a, b, c) {
        this._bodyAnim && this._bodyAnim.stop();
        var d;
        if (b != 0) switch (d = new Date(a.date), d.setDate(1), b) {
        case "-Y":
        case -2:
            d.setFullYear(d.getFullYear() - 1);
            break;
        case "+Y":
        case 2:
            d.setFullYear(d.getFullYear() + 1);
            break;
        case "-M":
        case -1:
            d.setMonth(d.getMonth() - 1);
            break;
        case "+M":
        case 1:
            d.setMonth(d.getMonth() + 1)
        } else d = new Date;
        return a.moveTo(d, !c)
    }

    function q(a, b) {
        a._menuVisible = b;
        H(b, a.els.title, "DynarchCalendar-pressed-title");
        var c = a.els.menu;
        if (U) c.style.height = a.els.main.offsetHeight +
            "px";
        if (a.args.animation) {
            a._menuAnim && a._menuAnim.stop();
            var d = a.els.main.offsetHeight;
            if (U) c.style.width = a.els.topBar.offsetWidth + "px";
            if (b) c.firstChild.style.marginTop = -d + "px", a.args.opacity > 0 && A(c, 0), W(c, !0);
            a._menuAnim = Q({
                onUpdate: function (e, f) {
                    c.firstChild.style.marginTop = f(I.accel_b(e), -d, 0, !b) + "px";
                    a.args.opacity > 0 && A(c, f(I.accel_b(e), 0, 0.85, !b))
                },
                onStop: function () {
                    a.args.opacity > 0 && A(c, 0.85);
                    c.firstChild.style.marginTop = "";
                    a._menuAnim = null;
                    b || (W(c, !1), a.focused && a.focus())
                }
            })
        } else W(c, b),
        a.focused && a.focus()
    }

    function o(b, c) {
        var c = c || window.event,
            d = s(c);
        if (d && !d.getAttribute("disabled")) {
            var e = d.getAttribute("dyc-btn"),
                f = d.getAttribute("dyc-type"),
                g = d.getAttribute("dyc-date"),
                h = this.selection,
                i, j = {
                    mouseover: z,
                    mousemove: z,
                    mouseup: function () {
                        var a = d.getAttribute("dyc-cls");
                        a && J(d, m(a, 1));
                        clearTimeout(i);
                        T(document, j, !0);
                        j = null
                    }
                };
            if (b) {
                setTimeout(u(this.focus, this), 1);
                var k = d.getAttribute("dyc-cls");
                k && V(d, m(k, 1));
                if ("menu" == e) this.toggleMenu();
                else if (d && /^[+-][MY]$/.test(e))
                    if (n(this,
                        e)) {
                        var o = u(function () {
                            n(this, e, !0) ? i = setTimeout(o, 40) : (j.mouseup(), n(this, e))
                        }, this);
                        i = setTimeout(o, 350);
                        E(document, j, !0)
                    } else j.mouseup();
                    else if ("year" == e) this.els.yearInput.focus(), this.els.yearInput.select();
                else {
                    if (f != "time-am")
                        if (/^time/.test(f)) o = u(function (a) {
                            l.call(this, a);
                            i = setTimeout(o, 100)
                        }, this, f), l.call(this, f), i = setTimeout(o, 350);
                        else if (g && h.type) h.type == a.SEL_MULTIPLE ? c.shiftKey && this._selRangeStart ? h.selectRange(this._selRangeStart, g) : (!c.ctrlKey && !h.isSelected(g) && h.clear(!0),
                        h.set(g, !0), this._selRangeStart = g) : (h.set(g), this.moveTo(y(g), 2)), d = this._getDateDiv(g), t.call(this, !0, {
                        target: d
                    });
                    E(document, j, !0)
                }
                w && j && /dbl/i.test(c.type) && j.mouseup();
                if (/^(DynarchCalendar-(topBar|bottomBar|weekend|weekNumber|menu(-sep)?))?$/.test(d.className) && !this.args.cont) j.mousemove = u(r, this), this._mouseDiff = ca(c, R(this.els.topCont)), E(document, j, !0)
            } else "today" == e ? (!this._menuVisible && h.type == a.SEL_SINGLE && h.set(new Date), this.moveTo(new Date, !0), q(this, !1)) : /^m([0-9]+)/.test(e) ? (g = new Date(this.date),
                g.setDate(1), g.setMonth(RegExp.$1), g.setFullYear(this._getInputYear()), this.moveTo(g, !0), q(this, !1)) : f == "time-am" && this.setHours(this.getHours() + 12);
            w || z(c)
        }
    }

    function r(a) {
        var a = a || window.event,
            b = this.els.topCont.style,
            a = ca(a, this._mouseDiff);
        b.left = a.x + "px";
        b.top = a.y + "px"
    }

    function s(a) {
        for (var b = a = a.target || a.srcElement; a && a.getAttribute && !a.getAttribute("dyc-type");) a = a.parentNode;
        return a.getAttribute && a || b
    }

    function m(a, b) {
        return "DynarchCalendar-" + a.split(/,/)[b]
    }

    function t(a, b) {
        var b = b || window.event,
            c = s(b);
        if (c) {
            var d = c.getAttribute("dyc-type");
            if (d && !c.getAttribute("disabled") && (!a || !this._bodyAnim || d != "date")) {
                var e = c.getAttribute("dyc-cls"),
                    e = e ? m(e, 0) : "DynarchCalendar-hover-" + d;
                (d != "date" || this.selection.type) && H(a, c, e);
                d == "date" && (H(a, c.parentNode.parentNode, "DynarchCalendar-hover-week"), this._showTooltip(c.getAttribute("dyc-date")));
                /^time-hour/.test(d) && H(a, this.els.timeHour, "DynarchCalendar-hover-time");
                /^time-min/.test(d) && H(a, this.els.timeMinute, "DynarchCalendar-hover-time");
                J(this._getDateDiv(this._lastHoverDate),
                    "DynarchCalendar-hover-date");
                this._lastHoverDate = null
            }
        }
        a || this._showTooltip()
    }

    function D(a) {
        var a = a || window.event,
            b = s(a);
        if (b) {
            var c = b.getAttribute("dyc-btn"),
                b = b.getAttribute("dyc-type"),
                d = a.wheelDelta ? a.wheelDelta / 120 : -a.detail / 3,
                d = d < 0 ? -1 : d > 0 ? 1 : 0;
            this.args.reverseWheel && (d = -d);
            if (/^(time-(hour|min))/.test(b)) switch (RegExp.$1) {
            case "time-hour":
                this.setHours(this.getHours() + d);
                break;
            case "time-min":
                this.setMinutes(this.getMinutes() + this.args.minuteStep * d)
            } else /Y/i.test(c) && (d *= 2), n(this, -d);
            z(a)
        }
    }

    function G() {
        this.refresh();
        var a = this.inputField,
            b = this.selection;
        if (a) {
            var c = b.print(this.dateFormat);
            /input|textarea/i.test(a.tagName) ? a.value = c : a.innerHTML = c
        }
        this.callHooks("onSelect", this, b)
    }

    function M(b) {
        if (!this._menuAnim) {
            var b = b || window.event,
                c = (b.target || b.srcElement)
                    .getAttribute("dyc-btn"),
                d = b.keyCode,
                e = b.charCode || d,
                f = ha[d];
            if ("year" == c && d == 13) return e = new Date(this.date), e.setDate(1), e.setFullYear(this._getInputYear()), this.moveTo(e, !0), q(this, !1), z(b);
            if (this._menuVisible) {
                if (d == 27) return q(this, !1), z(b)
            } else {
                b.ctrlKey || (f = null);
                f == null && !b.ctrlKey && (f = ia[d]);
                d == 36 && (f = 0);
                if (f != null) return n(this, f), z(b);
                e = String.fromCharCode(e)
                    .toLowerCase();
                f = this.els.yearInput;
                c = this.selection;
                if (e == " ") return q(this, !0), this.focus(), f.focus(), f.select(), z(b);
                if (e >= "0" && e <= "9") return q(this, !0), this.focus(), f.value = e, f.focus(), z(b);
                for (var g = x("mn"), f = b.shiftKey ? -1 : this.date.getMonth(), h = 0, i; ++h < 12;)
                    if (i = g[(f + h) % 12].toLowerCase(), i.indexOf(e) == 0) return e = new Date(this.date), e.setDate(1), e.setMonth((f +
                        h) % 12), this.moveTo(e, !0), z(b);
                if (d >= 37 && d <= 40) {
                    e = this._lastHoverDate;
                    if (!e && !c.isEmpty() && (e = d < 39 ? c.getFirstDate() : c.getLastDate(), e < this._firstDateVisible || e > this._lastDateVisible)) e = null;
                    if (e) {
                        for (var j = e, e = y(e), f = 100; f-- > 0;) {
                            switch (d) {
                            case 37:
                                e.setDate(e.getDate() - 1);
                                break;
                            case 38:
                                e.setDate(e.getDate() - 7);
                                break;
                            case 39:
                                e.setDate(e.getDate() + 1);
                                break;
                            case 40:
                                e.setDate(e.getDate() + 7)
                            }
                            if (!this.isDisabled(e)) break
                        }
                        e = v(e);
                        (e < this._firstDateVisible || e > this._lastDateVisible) && this.moveTo(e)
                    } else e = d <
                        39 ? this._lastDateVisible : this._firstDateVisible;
                    J(this._getDateDiv(j), V(this._getDateDiv(e), "DynarchCalendar-hover-date"));
                    this._lastHoverDate = e;
                    return z(b)
                }
                if (d == 13 && this._lastHoverDate) {
                    if (c.type == a.SEL_MULTIPLE && (b.shiftKey || b.ctrlKey)) {
                        if (b.shiftKey && this._selRangeStart && (c.clear(!0), c.selectRange(this._selRangeStart, this._lastHoverDate)), b.ctrlKey) c.set(this._selRangeStart = this._lastHoverDate, !0)
                    } else c.reset(this._selRangeStart = this._lastHoverDate);
                    return z(b)
                }
                d == 27 && !this.args.cont && this.hide()
            }
        }
    }

    function X(a, b) {
        return a.replace(/\$\{([^:\}]+)(:[^\}]+)?\}/g, function (a, c, d) {
            var e = b[c];
            d && (a = d.substr(1)
                .split(/\s*\|\s*/), e = (e >= a.length ? a[a.length - 1] : a[e])
                .replace(/##?/g, function (a) {
                    return a.length == 2 ? "#" : e
                }));
            return e
        })
    }

    function x(a, b) {
        var c = L.__.data[a];
        b && typeof c == "string" && (c = X(c, b));
        return c
    }

    function Y(a) {
        var a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), 12, 0, 0),
            b = a.getDay();
        a.setDate(a.getDate() - (b + 6) % 7 + 3);
        b = a.valueOf();
        a.setMonth(0);
        a.setDate(4);
        return Math.round((b - a.valueOf()) /
            6048E5) + 1
    }

    function ea(a) {
        var a = new Date(a.getFullYear(), a.getMonth(), a.getDate(), 12, 0, 0),
            b = new Date(a.getFullYear(), 0, 1, 12, 0, 0);
        return Math.floor((a - b) / 864E5)
    }

    function v(a) {
        return a instanceof Date ? 1E4 * a.getFullYear() + 100 * (a.getMonth() + 1) + a.getDate() : typeof a == "string" ? parseInt(a, 10) : a
    }

    function y(a, b, c, d, e) {
        if (!(a instanceof Date)) {
            var a = parseInt(a, 10),
                f = Math.floor(a / 1E4);
            a %= 1E4;
            var g = Math.floor(a / 100);
            a %= 100;
            a = new Date(f, g - 1, a, b || 12, c || 0, d || 0, e || 0)
        }
        return a
    }

    function K(a, b, c) {
        var d = a.getFullYear(),
            e = a.getMonth(),
            a = a.getDate(),
            f = b.getFullYear(),
            g = b.getMonth(),
            b = b.getDate();
        return d < f ? -3 : d > f ? 3 : e < g ? -2 : e > g ? 2 : c ? 0 : a < b ? -1 : a > b ? 1 : 0
    }

    function F(a, b) {
        var c = a.getMonth(),
            d = a.getDate(),
            e = a.getFullYear(),
            f = Y(a),
            g = a.getDay(),
            h = a.getHours(),
            i = h >= 12,
            j = i ? h - 12 : h,
            k = ea(a),
            l = a.getMinutes(),
            m = a.getSeconds(),
            o;
        j === 0 && (j = 12);
        o = {
            "%a": x("sdn")[g],
            "%A": x("dn")[g],
            "%b": x("smn")[c],
            "%B": x("mn")[c],
            "%C": 1 + Math.floor(e / 100),
            "%d": d < 10 ? "0" + d : d,
            "%e": d,
            "%H": h < 10 ? "0" + h : h,
            "%I": j < 10 ? "0" + j : j,
            "%j": k < 10 ? "00" + k : k < 100 ? "0" + k : k,
            "%k": h,
            "%l": j,
            "%m": c < 9 ? "0" + (1 + c) : 1 + c,
            "%o": 1 + c,
            "%M": l < 10 ? "0" + l : l,
            "%n": "\n",
            "%p": i ? "PM" : "AM",
            "%P": i ? "pm" : "am",
            "%s": Math.floor(a.getTime() / 1E3),
            "%S": m < 10 ? "0" + m : m,
            "%t": "\t",
            "%U": f < 10 ? "0" + f : f,
            "%W": f < 10 ? "0" + f : f,
            "%V": f < 10 ? "0" + f : f,
            "%u": g + 1,
            "%w": g,
            "%y": ("" + e)
                .substr(2, 2),
            "%Y": e,
            "%%": "%"
        };
        return b.replace(/%./g, function (a) {
            return o.hasOwnProperty(a) ? o[a] : a
        })
    }

    function N(a) {
        if (a) {
            if (typeof a == "number") return y(a);
            if (!(a instanceof Date)) return a = a.split(/-/), new Date(parseInt(a[0], 10), parseInt(a[1], 10) - 1, parseInt(a[2], 10),
                12, 0, 0, 0)
        }
        return a
    }

    function fa(a) {
        if (/\S/.test(a)) {
            var a = a.toLowerCase(),
                b = function (b) {
                    for (var c = b.length; --c >= 0;)
                        if (b[c].toLowerCase()
                            .indexOf(a) == 0) return c
                }, b = b(x("smn")) || b(x("mn"));
            b != null && b++;
            return b
        }
    }

    function Z(a, b, c, d) {
        d = {};
        for (c in b) b.hasOwnProperty(c) && (d[c] = b[c]);
        for (c in a) a.hasOwnProperty(c) && (d[c] = a[c]);
        return d
    }

    function E(a, b, c, d) {
        if (a instanceof Array)
            for (var e = a.length; --e >= 0;) E(a[e], b, c, d);
        else if (typeof b == "object")
            for (e in b) b.hasOwnProperty(e) && E(a, e, b[e], c);
        else a.addEventListener ?
            a.addEventListener(b, c, w ? !0 : !! d) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c
    }

    function T(a, b, c, d) {
        if (a instanceof Array)
            for (var e = a.length; --e >= 0;) T(a[e], b, c);
        else if (typeof b == "object")
            for (e in b) b.hasOwnProperty(e) && T(a, e, b[e], c);
        else a.removeEventListener ? a.removeEventListener(b, c, w ? !0 : !! d) : a.detachEvent ? a.detachEvent("on" + b, c) : a["on" + b] = null
    }

    function z(a) {
        a = a || window.event;
        w ? (a.cancelBubble = !0, a.returnValue = !1) : (a.preventDefault(), a.stopPropagation());
        return !1
    }

    function J(a, b, c) {
        if (a) {
            var d =
                a.className.replace(/^\s+|\s+$/, "")
                .split(/\x20/),
                e = [],
                f;
            for (f = d.length; f > 0;) d[--f] != b && e.push(d[f]);
            c && e.push(c);
            a.className = e.join(" ")
        }
        return c
    }

    function V(a, b) {
        return J(a, b, b)
    }

    function H(a, b, c) {
        if (b instanceof Array)
            for (var d = b.length; --d >= 0;) H(a, b[d], c);
        else J(b, c, a ? c : null);
        return a
    }

    function aa(a, b, c) {
        var d = null,
            d = document.createElementNS ? document.createElementNS("http://www.w3.org/1999/xhtml", a) : document.createElement(a);
        if (b) d.className = b;
        c && c.appendChild(d);
        return d
    }

    function S(a, b) {
        b == null &&
            (b = 0);
        var c, d, e;
        try {
            c = Array.prototype.slice.call(a, b)
        } catch (f) {
            c = Array(a.length - b);
            d = b;
            for (e = 0; d < a.length; ++d, ++e) c[e] = a[d]
        }
        return c
    }

    function u(a, b) {
        var c = S(arguments, 2);
        return b == void 0 ? function () {
            return a.apply(this, c.concat(S(arguments)))
        } : function () {
            return a.apply(b, c.concat(S(arguments)))
        }
    }

    function P(a, b) {
        if (!b(a))
            for (var c = a.firstChild; c; c = c.nextSibling) c.nodeType == 1 && P(c, b)
    }

    function Q(a, b, c) {
        function d(a, b, c, e) {
            return e ? c + a * (b - c) : b + a * (c - b)
        }

        function e() {
            b && f();
            c = 0;
            b = setInterval(g, 1E3 / a.fps)
        }

        function f() {
            b && (clearInterval(b), b = null);
            a.onStop(c / a.len, d)
        }

        function g() {
            var b = a.len;
            a.onUpdate(c / b, d);
            c == b && f();
            ++c
        }
        a = Z(a, {
            fps: 50,
            len: 15,
            onUpdate: B,
            onStop: B
        });
        if (w) a.len = Math.round(a.len / 2);
        e();
        return {
            start: e,
            stop: f,
            update: g,
            args: a,
            map: d
        }
    }

    function A(a, b) {
        b === "" ? w ? a.style.filter = "" : a.style.opacity = "" : b != null ? w ? a.style.filter = "alpha(opacity=" + b * 100 + ")" : a.style.opacity = b : w ? /alpha\(opacity=([0-9.])+\)/.test(a.style.opacity) && (b = parseFloat(RegExp.$1) / 100) : b = parseFloat(a.style.opacity);
        return b
    }

    function W(a,
        b) {
        var c = a.style;
        if (b != null) c.display = b ? "" : "none";
        return c.display != "none"
    }

    function ca(a, b) {
        var c = w ? a.clientX + document.body.scrollLeft : a.pageX,
            d = w ? a.clientY + document.body.scrollTop : a.pageY;
        b && (c -= b.x, d -= b.y);
        return {
            x: c,
            y: d
        }
    }

    function R(a) {
        var b = 0,
            c = 0,
            d = /^div$/i.test(a.tagName);
        if (d && a.scrollLeft) b = a.scrollLeft;
        if (d && a.scrollTop) c = a.scrollTop;
        b = {
            x: a.offsetLeft - b,
            y: a.offsetTop - c
        };
        a.offsetParent && (a = R(a.offsetParent), b.x += a.x, b.y += a.y);
        return b
    }

    function ja() {
        var a = document.documentElement,
            b = document.body;
        return {
            x: a.scrollLeft || b.scrollLeft,
            y: a.scrollTop || b.scrollTop,
            w: a.clientWidth || window.innerWidth || b.clientWidth,
            h: a.clientHeight || window.innerHeight || b.clientHeight
        }
    }

    function $(a, b, c) {
        for (c = 0; c < a.length; ++c) b(a[c])
    }

    function O(a) {
        typeof a == "string" && (a = document.getElementById(a));
        return a
    }
    var p = navigator.userAgent,
        da = /opera/i.test(p),
        ka = /Konqueror|Safari|KHTML/i.test(p),
        w = /msie/i.test(p) && !da && !/mac_powerpc/i.test(p),
        U = w && /msie 6/i.test(p),
        ga = /gecko/i.test(p) && !ka && !da && !w,
        p = a.prototype,
        L = a.I18N = {};
    a.SEL_NONE = 0;
    a.SEL_SINGLE = 1;
    a.SEL_MULTIPLE = 2;
    a.SEL_WEEK = 3;
    a.dateToInt = v;
    a.intToDate = y;
    a.printDate = F;
    a.formatString = X;
    a.i18n = x;
    a.LANG = function (a, b, c) {
        L.__ = L[a] = {
            name: b,
            data: c
        }
    };
    a.setup = function (b) {
        return new a(b)
    };
    p.moveTo = function (a, b) {
        var a = N(a),
            d = K(a, this.date, !0),
            e, f = this.args,
            g = f.min && K(a, f.min),
            h = f.max && K(a, f.max);
        f.showTime && (this.setHours(a.getUTCHours()), this.setMinutes(a.getUTCMinutes()));
        f.animation || (b = !1);
        H(g != null && g <= 1, [this.els.navPrevMonth, this.els.navPrevYear], "DynarchCalendar-navDisabled");
        H(h != null && h >= -1, [this.els.navNextMonth, this.els.navNextYear], "DynarchCalendar-navDisabled");
        if (g < -1) a = f.min, e = 1, d = 0;
        if (h > 1) a = f.max, e = 2, d = 0;
        this.date = a;
        this.refresh( !! b);
        this.callHooks("onChange", this, a, b);
        if (b && !(d == 0 && b == 2)) {
            this._bodyAnim && this._bodyAnim.stop();
            var i = this.els.body,
                j = aa("div", "DynarchCalendar-animBody-" + la[d], i),
                f = i.firstChild;
            A(f);
            var k = e ? I.brakes : d == 0 ? I.shake : I.accel_ab2,
                l = d * d > 4,
                m = l ? f.offsetTop : f.offsetLeft,
                o = j.style,
                n = l ? i.offsetHeight : i.offsetWidth;
            d < 0 ? n += m : d > 0 ? n = m - n : (n = Math.round(n /
                7), e == 2 && (n = -n));
            if (!e && d != 0) {
                var p = j.cloneNode(!0),
                    q = p.style,
                    r = 2 * n;
                p.appendChild(f.cloneNode(!0));
                q[l ? "marginTop" : "marginLeft"] = n + "px";
                i.appendChild(p)
            }
            f.style.visibility = "hidden";
            j.innerHTML = c(this);
            this._bodyAnim = Q({
                onUpdate: u(function (a, b) {
                    var c = k(a);
                    if (p) var f = b(c, n, r) + "px";
                    if (e) o[l ? "marginTop" : "marginLeft"] = b(c, n, 0) + "px";
                    else {
                        if (l || d == 0)
                            if (o.marginTop = b(d == 0 ? k(a * a) : c, 0, n) + "px", d != 0) q.marginTop = f;
                        if (!l || d == 0)
                            if (o.marginLeft = b(c, 0, n) + "px", d != 0) q.marginLeft = f
                    }
                    this.args.opacity > 2 && p && (A(p, 1 - c),
                        A(j, c))
                }, this),
                onStop: u(function () {
                    i.innerHTML = c(this, a);
                    this._bodyAnim = null
                }, this)
            })
        }
        this._lastHoverDate = null;
        return g >= -1 && h <= 1
    };
    p.isDisabled = function (a) {
        var b = this.args;
        return b.min && K(a, b.min) < 0 || b.max && K(a, b.max) > 0 || b.disabled(a)
    };
    p.toggleMenu = function () {
        q(this, !this._menuVisible)
    };
    p.refresh = function (a) {
        var b = this.els;
        if (!a) b.body.innerHTML = c(this);
        b.title.innerHTML = e(this);
        b.yearInput.value = this.date.getFullYear()
    };
    p.redraw = function () {
        var a = this.els;
        this.refresh();
        a.dayNames.innerHTML = b(this);
        a.menu.innerHTML = f(this);
        if (a.bottomBar) a.bottomBar.innerHTML = g(this);
        P(a.topCont, u(function (b) {
            var c = ba[b.className];
            c && (a[c] = b);
            b.className == "DynarchCalendar-menu-year" ? (E(b, this._focusEvents), a.yearInput = b) : w && b.setAttribute("unselectable", "on")
        }, this));
        this.setTime(null, !0)
    };
    p.setLanguage = function (b) {
        if (b = a.setLanguage(b)) this.fdow = b.data.fdow, this.redraw()
    };
    a.setLanguage = function (a) {
        if (a = L[a]) L.__ = a;
        return a
    };
    p.focus = function () {
        try {
            this.els[this._menuVisible ? "yearInput" : "focusLink"].focus()
        } catch (a) {}
        i.call(this)
    };
    p.blur = function () {
        this.els.focusLink.blur();
        this.els.yearInput.blur();
        k.call(this)
    };
    p.showAt = function (a, b, c) {
        this._showAnim && this._showAnim.stop();
        var c = c && this.args.animation,
            d = this.els.topCont,
            e = this,
            f = this.els.body.firstChild,
            g = f.offsetHeight,
            h = d.style;
        h.position = "absolute";
        h.left = a + "px";
        h.top = b + "px";
        h.zIndex = 1E4;
        h.display = "";
        if (c) f.style.marginTop = -g + "px", this.args.opacity > 1 && A(d, 0), this._showAnim = Q({
            onUpdate: function (a, b) {
                f.style.marginTop = -b(I.accel_b(a), g, 0) + "px";
                e.args.opacity > 1 && A(d, a)
            },
            onStop: function () {
                e.args.opacity > 1 && A(d, "");
                e._showAnim = null
            }
        })
    };
    p.hide = function () {
        var a = this.els.topCont,
            b = this,
            c = this.els.body.firstChild,
            d = c.offsetHeight,
            e = R(a)
                .y;
        this.args.animation ? (this._showAnim && this._showAnim.stop(), this._showAnim = Q({
            onUpdate: function (f, g) {
                b.args.opacity > 1 && A(a, 1 - f);
                c.style.marginTop = -g(I.accel_b(f), 0, d) + "px";
                a.style.top = g(I.accel_ab(f), e, e - 10) + "px"
            },
            onStop: function () {
                a.style.display = "none";
                c.style.marginTop = "";
                b.args.opacity > 1 && A(a, "");
                b._showAnim = null
            }
        })) : a.style.display =
            "none";
        this.inputField = null
    };
    p.popup = function (a, b) {
        function c(b) {
            var d = {
                x: i.x,
                y: i.y
            };
            if (!b) return d;
            /B/.test(b) && (d.y += a.offsetHeight);
            /b/.test(b) && (d.y += a.offsetHeight - g.y);
            /T/.test(b) && (d.y -= g.y);
            /l/.test(b) && (d.x -= g.x - a.offsetWidth);
            /L/.test(b) && (d.x -= g.x);
            /R/.test(b) && (d.x += a.offsetWidth);
            /c/i.test(b) && (d.x += (a.offsetWidth - g.x) / 2);
            /m/i.test(b) && (d.y += (a.offsetHeight - g.y) / 2);
            return d
        }
        a = O(a);
        if (!b) b = this.args.align;
        var b = b.split(/\x2f/),
            d = R(a),
            e = this.els.topCont,
            f = e.style,
            g, h = ja();
        f.visibility =
            "hidden";
        f.display = "";
        this.showAt(0, 0);
        document.body.appendChild(e);
        g = {
            x: e.offsetWidth,
            y: e.offsetHeight
        };
        var i = d,
            i = c(b[0]);
        if (i.y < h.y) i.y = d.y, i = c(b[1]);
        if (i.x + g.x > h.x + h.w) i.x = d.x, i = c(b[2]);
        if (i.y + g.y > h.y + h.h) i.y = d.y, i = c(b[3]);
        if (i.x < h.x) i.x = d.x, i = c(b[4]);
        this.showAt(i.x, i.y, !0);
        f.visibility = "";
        this.focus()
    };
    p.manageFields = function (b, c, d) {
        c = O(c);
        E(O(b), "click", u(function () {
            this.inputField = c;
            this.dateFormat = d;
            if (this.selection.type == a.SEL_SINGLE) {
                var e, f, g, h;
                if (e = /input|textarea/i.test(c.tagName) ? c.value :
                    c.innerText || c.textContent)
                    if (f = /(^|[^%])%[bBmo]/.exec(d), g = /(^|[^%])%[de]/.exec(d), f && g && (h = f.index < g.index), e = Calendar.parseDate(e, h)) this.selection.set(e, !1, !0), this.moveTo(e)
            }
            this.popup(b)
        }, this))
    };
    p.callHooks = function (a) {
        for (var b = S(arguments, 1), c = this.handlers[a], d = 0; d < c.length; ++d) c[d].apply(this, b)
    };
    p.addEventListener = function (a, b) {
        this.handlers[a].push(b)
    };
    p.removeEventListener = function (a, b) {
        for (var c = this.handlers[a], d = c.length; --d >= 0;) c[d] === b && c.splice(d, 1)
    };
    p.getTime = function () {
        return this.time
    };
    p.setTime = function (a, b) {
        if (this.args.showTime) {
            var a = this.time = a != null ? a : this.time,
                c = this.getHours(),
                d = this.getMinutes(),
                e = c < 12;
            if (this.args.showTime == 12) c == 0 && (c = 12), c > 12 && (c -= 12), this.els.timeAM.innerHTML = x(e ? "AM" : "PM");
            c < 10 && (c = "0" + c);
            d < 10 && (d = "0" + d);
            this.els.timeHour.innerHTML = c;
            this.els.timeMinute.innerHTML = d;
            b || this.callHooks("onTimeChange", this, a)
        }
    };
    p.getHours = function () {
        return Math.floor(this.time / 100)
    };
    p.getMinutes = function () {
        return this.time % 100
    };
    p.setHours = function (a) {
        a < 0 && (a += 24);
        this.setTime(100 *
            (a % 24) + this.time % 100)
    };
    p.setMinutes = function (a) {
        a < 0 && (a += 60);
        this.setTime(100 * this.getHours() + a % 60)
    };
    p._getInputYear = function () {
        var a = parseInt(this.els.yearInput.value, 10);
        isNaN(a) && (a = this.date.getFullYear());
        return a
    };
    p._showTooltip = function (a) {
        var b = "",
            c, d = this.els.tooltip;
        a && (a = y(a), (c = this.args.dateInfo(a)) && c.tooltip && (b = "<div class='DynarchCalendar-tooltipCont'>" + F(a, c.tooltip) + "</div>"));
        d.innerHTML = b
    };
    var C = " align='center' cellspacing='0' cellpadding='0'",
        ba = {
            "DynarchCalendar-topCont": "topCont",
            "DynarchCalendar-focusLink": "focusLink",
            DynarchCalendar: "main",
            "DynarchCalendar-topBar": "topBar",
            "DynarchCalendar-title": "title",
            "DynarchCalendar-dayNames": "dayNames",
            "DynarchCalendar-body": "body",
            "DynarchCalendar-menu": "menu",
            "DynarchCalendar-menu-year": "yearInput",
            "DynarchCalendar-bottomBar": "bottomBar",
            "DynarchCalendar-tooltip": "tooltip",
            "DynarchCalendar-time-hour": "timeHour",
            "DynarchCalendar-time-minute": "timeMinute",
            "DynarchCalendar-time-am": "timeAM",
            "DynarchCalendar-navBtn DynarchCalendar-prevYear": "navPrevYear",
            "DynarchCalendar-navBtn DynarchCalendar-nextYear": "navNextYear",
            "DynarchCalendar-navBtn DynarchCalendar-prevMonth": "navPrevMonth",
            "DynarchCalendar-navBtn DynarchCalendar-nextMonth": "navNextMonth"
        }, la = {
            "-3": "backYear",
            "-2": "back",
            0: "now",
            2: "fwd",
            3: "fwdYear"
        }, ha = {
            37: -1,
            38: -2,
            39: 1,
            40: 2
        }, ia = {
            33: -1,
            34: 1
        };
    p._getDateDiv = function (a) {
        var b = null;
        if (a) try {
            P(this.els.body, function (c) {
                if (c.getAttribute("dyc-date") == a) throw b = c;
            })
        } catch (c) {}
        return b
    };
    (a.Selection = function (a, b, c, d) {
        this.type = b;
        this.sel = a instanceof
        Array ? a : [a];
        this.onChange = u(c, d);
        this.cal = d
    })
        .prototype = {
            get: function () {
                return this.type == a.SEL_SINGLE ? this.sel[0] : this.sel
            },
            isEmpty: function () {
                return this.sel.length == 0
            },
            set: function (b, c, d) {
                var e = this.type == a.SEL_SINGLE;
                if (b instanceof Array) {
                    if (this.sel = b, this.normalize(), !d) this.onChange(this)
                } else if (b = v(b), e || !this.isSelected(b)) {
                    if (e ? this.sel = [b] : this.sel.splice(this.findInsertPos(b), 0, b), this.normalize(), !d) this.onChange(this)
                } else c && this.unselect(b, d)
            },
            reset: function () {
                this.sel = [];
                this.set.apply(this,
                    arguments)
            },
            countDays: function () {
                for (var a = 0, b = this.sel, c = b.length, d, e; --c >= 0;) d = b[c], d instanceof Array && (e = y(d[0]), d = y(d[1]), a += Math.round(Math.abs(d.getTime() - e.getTime()) / 864E5)), ++a;
                return a
            },
            unselect: function (a, b) {
                for (var a = v(a), c = !1, d = this.sel, e = d.length, f; --e >= 0;)
                    if (f = d[e], f instanceof Array) {
                        if (a >= f[0] && a <= f[1]) {
                            var c = y(a),
                                g = c.getDate();
                            if (a == f[0]) c.setDate(g + 1), f[0] = v(c);
                            else {
                                if (a == f[1]) c.setDate(g - 1);
                                else {
                                    var h = new Date(c);
                                    h.setDate(g + 1);
                                    c.setDate(g - 1);
                                    d.splice(e + 1, 0, [v(h), f[1]])
                                }
                                f[1] =
                                    v(c)
                            }
                            c = !0
                        }
                    } else a == f && (d.splice(e, 1), c = !0);
                if (c && (this.normalize(), !b)) this.onChange(this)
            },
            normalize: function () {
                var ma;
                for (var a = this.sel = this.sel.sort(function (a, b) {
                    a instanceof Array && (a = a[0]);
                    b instanceof Array && (b = b[0]);
                    return a - b
                }), b = a.length, c, d; --b >= 0;) {
                    c = a[b];
                    if (c instanceof Array) {
                        if (c[0] > c[1]) {
                            a.splice(b, 1);
                            continue
                        }
                        c[0] == c[1] && (ma = a[b] = c[0], c = ma)
                    }
                    if (d) {
                        var e = d,
                            f = c instanceof Array ? c[1] : c,
                            f = y(f);
                        f.setDate(f.getDate() + 1);
                        f = v(f);
                        f >= e && (e = a[b + 1], c instanceof Array && e instanceof Array ? (c[1] =
                            e[1], a.splice(b + 1, 1)) : c instanceof Array ? (c[1] = d, a.splice(b + 1, 1)) : e instanceof Array ? (e[0] = c, a.splice(b, 1)) : (a[b] = [c, e], a.splice(b + 1, 1)))
                    }
                    d = c instanceof Array ? c[0] : c
                }
            },
            findInsertPos: function (a) {
                for (var b = this.sel, c = b.length, d; --c >= 0;)
                    if (d = b[c], d instanceof Array && (d = d[0]), d <= a) break;
                return c + 1
            },
            clear: function (a) {
                this.sel = [];
                if (!a) this.onChange(this)
            },
            selectRange: function (b, c) {
                b = v(b);
                c = v(c);
                if (b > c) var d = b,
                b = c, c = d;
                var e = this.cal.args.checkRange;
                if (!e) return this._do_selectRange(b, c);
                try {
                    $((new a.Selection([
                            [b,
                                c
                            ]
                        ], a.SEL_MULTIPLE, B))
                        .getDates(), u(function (a) {
                            if (this.isDisabled(a)) throw e instanceof Function && e(a, this), "OUT";
                        }, this.cal)), this._do_selectRange(b, c)
                } catch (f) {}
            },
            _do_selectRange: function (a, b) {
                this.sel.push([a, b]);
                this.normalize();
                this.onChange(this)
            },
            isSelected: function (a) {
                for (var b = this.sel.length, c; --b >= 0;)
                    if (c = this.sel[b], c instanceof Array && a >= c[0] && a <= c[1] || a == c) return !0;
                return !1
            },
            getFirstDate: function () {
                var a = this.sel[0];
                a && a instanceof Array && (a = a[0]);
                return a
            },
            getLastDate: function () {
                if (this.sel.length >
                    0) {
                    var a = this.sel[this.sel.length - 1];
                    a && a instanceof Array && (a = a[1]);
                    return a
                }
            },
            print: function (a, b) {
                var c = [],
                    d = 0,
                    e, f = this.cal.getHours(),
                    g = this.cal.getMinutes();
                for (b || (b = " -> "); d < this.sel.length;) e = this.sel[d++], e instanceof Array ? c.push(F(y(e[0], f, g), a) + b + F(y(e[1], f, g), a)) : c.push(F(y(e, f, g), a));
                return c
            },
            getDates: function (a) {
                for (var b = [], c = 0, d, e; c < this.sel.length;) {
                    e = this.sel[c++];
                    if (e instanceof Array) {
                        d = y(e[0]);
                        for (e = e[1]; v(d) < e;) b.push(a ? F(d, a) : new Date(d)), d.setDate(d.getDate() + 1)
                    } else d = y(e);
                    b.push(a ? F(d, a) : d)
                }
                return b
            }
    };
    a.parseDate = function (a, b, c) {
        if (!/\S/.test(a)) return "";
        var a = a.replace(/^\s+/, "")
            .replace(/\s+$/, ""),
            c = c || new Date,
            d = null,
            e = null,
            f = null,
            g = null,
            h = null,
            i = null,
            j = a.match(/([0-9]{1,2}):([0-9]{1,2})(:[0-9]{1,2})?\s*(am|pm)?/i);
        j && (g = parseInt(j[1], 10), h = parseInt(j[2], 10), i = j[3] ? parseInt(j[3].substr(1), 10) : 0, a = a.substring(0, j.index) + a.substr(j.index + j[0].length), j[4] && (j[4].toLowerCase() == "pm" && g < 12 ? g += 12 : j[4].toLowerCase() == "am" && g >= 12 && (g -= 12)));
        for (var a = a.split(/\W+/), j = [], k = 0; k < a.length; ++k) {
            var l = a[k];
            /^[0-9]{4}$/.test(l) ? (d = parseInt(l, 10), !e && !f && b == null && (b = !0)) : /^[0-9]{1,2}$/.test(l) ? (l = parseInt(l, 10), l >= 60 ? d = l : l >= 0 && l <= 12 ? j.push(l) : l >= 1 && l <= 31 && (f = l)) : e = fa(l)
        }
        j.length >= 2 ? b ? (e || (e = j.shift()), f || (f = j.shift())) : (f || (f = j.shift()), e || (e = j.shift())) : j.length == 1 && (f ? e || (e = j.shift()) : f = j.shift());
        d || (d = j.length > 0 ? j.shift() : c.getFullYear());
        d < 30 ? d += 2E3 : d < 99 && (d += 1900);
        e || (e = c.getMonth() + 1);
        return d && e && f ? new Date(Date.UTC(d, e - 1, f, g, h, i)) : null
    };
    var I = {
        elastic_b: function (a) {
            return 1 -
                Math.cos(-a * 5.5 * Math.PI) / Math.pow(2, 7 * a)
        },
        magnetic: function (a) {
            return 1 - Math.cos(a * a * a * 10.5 * Math.PI) / Math.exp(4 * a)
        },
        accel_b: function (a) {
            a = 1 - a;
            return 1 - a * a * a * a
        },
        accel_a: function (a) {
            return a * a * a
        },
        accel_ab: function (a) {
            a = 1 - a;
            return 1 - Math.sin(a * a * Math.PI / 2)
        },
        accel_ab2: function (a) {
            return (a /= 0.5) < 1 ? 0.5 * a * a : -0.5 * (--a * (a - 2) - 1)
        },
        brakes: function (a) {
            a = 1 - a;
            return 1 - Math.sin(a * a * Math.PI)
        },
        shake: function (a) {
            return a < 0.5 ? -Math.cos(a * 11 * Math.PI) * a * a : (a = 1 - a, Math.cos(a * 11 * Math.PI) * a * a)
        }
    }, B = new Function;
    return a
}();
Calendar.LANG("en", "English", {
    fdow: 1,
    goToday: "Go Today",
    today: "Today",
    wk: "wk",
    weekend: "0,6",
    AM: "am",
    PM: "pm",
    mn: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    smn: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dn: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    sdn: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
});