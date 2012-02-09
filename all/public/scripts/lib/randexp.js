//
// randexp v0.3.0
// Create random strings that match a given regular expression.
//
// Copyright (C) 2011 by Roly Fentanes (https://github.com/fent)
// MIT License
// http://github.com/fent/randexp.js/raw/master/LICENSE
//
(function () {
    var a = function (b, c) {
            var d = a.resolve(b, c || "/"),
                e = a.modules[d];
            if (!e) throw new Error("Failed to resolve module " + b + ", tried " + d);
            var f = e._cached ? e._cached : e();
            return f
        };
    a.paths = [], a.modules = {}, a.extensions = [".js", ".coffee"], a._core = {
        assert: !0,
        events: !0,
        fs: !0,
        path: !0,
        vm: !0
    }, a.resolve = function () {
        return function (b, c) {
            function h(b) {
                if (a.modules[b]) return b;
                for (var c = 0; c < a.extensions.length; c++) {
                    var d = a.extensions[c];
                    if (a.modules[b + d]) return b + d
                }
            }
            function i(b) {
                b = b.replace(/\/+$/, "");
                var c = b + "/package.json";
                if (a.modules[c]) {
                    var e = a.modules[c](),
                        f = e.browserify;
                    if (typeof f == "object" && f.main) {
                        var g = h(d.resolve(b, f.main));
                        if (g) return g
                    } else if (typeof f == "string") {
                        var g = h(d.resolve(b, f));
                        if (g) return g
                    } else if (e.main) {
                        var g = h(d.resolve(b, e.main));
                        if (g) return g
                    }
                }
                return h(b + "/index")
            }
            function j(a, b) {
                var c = k(b);
                for (var d = 0; d < c.length; d++) {
                    var e = c[d],
                        f = h(e + "/" + a);
                    if (f) return f;
                    var g = i(e + "/" + a);
                    if (g) return g
                }
                var f = h(a);
                if (f) return f
            }
            function k(a) {
                var b;
                a === "/" ? b = [""] : b = d.normalize(a).split("/");
                var c = [];
                for (var e = b.length - 1; e >= 0; e--) {
                    if (b[e] === "node_modules") continue;
                    var f = b.slice(0, e + 1).join("/") + "/node_modules";
                    c.push(f)
                }
                return c
            }
            c || (c = "/");
            if (a._core[b]) return b;
            var d = a.modules.path(),
                e = c || ".";
            if (b.match(/^(?:\.\.?\/|\/)/)) {
                var f = h(d.resolve(e, b)) || i(d.resolve(e, b));
                if (f) return f
            }
            var g = j(b, e);
            if (g) return g;
            throw new Error("Cannot find module '" + b + "'")
        }
    }(), a.alias = function (c, d) {
        var e = a.modules.path(),
            f = null;
        try {
            f = a.resolve(c + "/package.json", "/")
        } catch (g) {
            f = a.resolve(c, "/")
        }
        var h = e.dirname(f),
            i = b(a.modules);
        for (var j = 0; j < i.length; j++) {
            var k = i[j];
            if (k.slice(0, h.length + 1) === h + "/") {
                var l = k.slice(h.length);
                a.modules[d + l] = a.modules[h + l]
            } else k === h && (a.modules[d] = a.modules[h])
        }
    }, a.define = function (b, c) {
        var d = a._core[b] ? "" : a.modules.path().dirname(b),
            e = function (b) {
                return a(b, d)
            };
        e.resolve = function (b) {
            return a.resolve(b, d)
        }, e.modules = a.modules, e.define = a.define;
        var f = {
            exports: {}
        };
        a.modules[b] = function () {
            return a.modules[b]._cached = f.exports, c.call(f.exports, e, f, f.exports, d, b), a.modules[b]._cached = f.exports, f.exports
        }
    };
    var b = Object.keys ||
    function (a) {
        var b = [];
        for (var c in a) b.push(c);
        return b
    };
    typeof process == "undefined" && (process = {}), process.nextTick || (process.nextTick = function () {
        var a = [],
            b = window.postMessage && window.addEventListener;
        return b && window.addEventListener("message", function (b) {
            if (b.source === window && b.data === "browserify-tick") {
                b.stopPropagation();
                if (a.length > 0) {
                    var c = a.shift();
                    c()
                }
            }
        }, !0), function (c) {
            b ? (a.push(c), window.postMessage("browserify-tick", "*")) : setTimeout(c, 0)
        }
    }()), process.title || (process.title = "browser"), process.binding || (process.binding = function (b) {
        if (b === "evals") return a("vm");
        throw new Error("No such module")
    }), process.cwd || (process.cwd = function () {
        return "."
    }), a.define("path", function (a, b, c, d, e) {
        function f(a, b) {
            var c = [];
            for (var d = 0; d < a.length; d++) b(a[d], d, a) && c.push(a[d]);
            return c
        }
        function g(a, b) {
            var c = 0;
            for (var d = a.length; d >= 0; d--) {
                var e = a[d];
                e == "." ? a.splice(d, 1) : e === ".." ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
            }
            if (b) for (; c--; c) a.unshift("..");
            return a
        }
        var h = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
        c.resolve = function () {
            var a = "",
                b = !1;
            for (var c = arguments.length; c >= -1 && !b; c--) {
                var d = c >= 0 ? arguments[c] : process.cwd();
                if (typeof d != "string" || !d) continue;
                a = d + "/" + a, b = d.charAt(0) === "/"
            }
            return a = g(f(a.split("/"), function (a) {
                return !!a
            }), !b).join("/"), (b ? "/" : "") + a || "."
        }, c.normalize = function (a) {
            var b = a.charAt(0) === "/",
                c = a.slice(-1) === "/";
            return a = g(f(a.split("/"), function (a) {
                return !!a
            }), !b).join("/"), !a && !b && (a = "."), a && c && (a += "/"), (b ? "/" : "") + a
        }, c.join = function () {
            var a = Array.prototype.slice.call(arguments, 0);
            return c.normalize(f(a, function (a, b) {
                return a && typeof a == "string"
            }).join("/"))
        }, c.dirname = function (a) {
            var b = h.exec(a)[1] || "",
                c = !1;
            return b ? b.length === 1 || c && b.length <= 3 && b.charAt(1) === ":" ? b : b.substring(0, b.length - 1) : "."
        }, c.basename = function (a, b) {
            var c = h.exec(a)[2] || "";
            return b && c.substr(-1 * b.length) === b && (c = c.substr(0, c.length - b.length)), c
        }, c.extname = function (a) {
            return h.exec(a)[3] || ""
        }
    }), a.define("/node_modules/ret/package.json", function (a, b, c, d, e) {
        b.exports = {
            main: "./lib/index.js"
        }
    }), a.define("/node_modules/ret/lib/index.js", function (a, b, c, d, e) {
        var f = a("./util"),
            g = a("./types"),
            h = a("./sets"),
            i = a("./positions"),
            j = function (a, b) {
                throw new Error("Invalid regular expression: /" + a + "/: " + b)
            };
        b.exports = function (a) {
            var b = 0,
                c, d, e = {
                    type: g.ROOT,
                    stack: []
                },
                k = e,
                l = e.stack,
                m = [],
                n = function (b) {
                    j(a, "Nothing to repeat at column " + (b - 1))
                },
                o = f.strToChars(a);
            c = o.length;
            while (b < c) {
                d = o[b++];
                switch (d) {
                case "\\":
                    d = o[b++];
                    switch (d) {
                    case "b":
                        l.push(i.wordBoundary());
                        break;
                    case "B":
                        l.push(i.nonWordBoundary());
                        break;
                    case "w":
                        l.push(h.words());
                        break;
                    case "W":
                        l.push(h.notWords());
                        break;
                    case "d":
                        l.push(h.ints());
                        break;
                    case "D":
                        l.push(h.notInts());
                        break;
                    case "s":
                        l.push(h.whitespace());
                        break;
                    case "S":
                        l.push(h.notWhitespace());
                        break;
                    default:
                        /\d/.test(d) ? l.push({
                            type: g.REFERENCE,
                            value: parseInt(d)
                        }) : l.push({
                            type: g.CHAR,
                            value: d.charCodeAt(0)
                        })
                    }
                    break;
                case "^":
                    l.push(i.begin());
                    break;
                case "$":
                    l.push(i.end());
                    break;
                case "[":
                    if (o[b] === "^") {
                        var p = !0;
                        b++
                    } else var p = !1;
                    var q = f.tokenizeClass(o.slice(b));
                    b += q[1], l.push({
                        type: g.SET,
                        set: q[0],
                        not: p
                    });
                    break;
                case ".":
                    l.push(h.anyChar());
                    break;
                case "(":
                    var r = {
                        type: g.GROUP,
                        stack: [],
                        remember: !0
                    };
                    d = o[b], d === "?" && (d = o[b + 1], b += 2, d === "=" ? r.followedBy = !0 : d === "!" ? r.notFollowedBy = !0 : d !== ":" && j(a, "Invalid character '" + d + "' after '?' at column " + (b - 1)), r.remember = !1), l.push(r), m.push(k), k = r, l = r.stack;
                    break;
                case ")":
                    m.length === 0 && j(a, "Unmatched ) at column " + (b - 1)), k = m.pop(), l = k.options ? k.options[k.options.length - 1] : k.stack;
                    break;
                case "|":
                    k.options || (k.options = [k.stack], delete k.stack);
                    var s = [];
                    k.options.push(s), l = s;
                    break;
                case "{":
                    var t = /^(\d+)(,(\d+)?)?\}/.exec(o.slice(b)),
                        u, v;
                    t !== null ? (u = parseInt(t[1]), v = t[2] ? t[3] ? parseInt(t[3]) : Infinity : u, b += t[0].length, l.push({
                        type: g.REPETITION,
                        min: u,
                        max: v,
                        value: l.pop()
                    })) : l.push({
                        type: g.CHAR,
                        value: 123
                    });
                    break;
                case "?":
                    l.length === 0 && n(b), l.push({
                        type: g.REPETITION,
                        min: 0,
                        max: 1,
                        value: l.pop()
                    });
                    break;
                case "+":
                    l.length === 0 && n(b), l.push({
                        type: g.REPETITION,
                        min: 1,
                        max: Infinity,
                        value: l.pop()
                    });
                    break;
                case "*":
                    l.length === 0 && n(b), l.push({
                        type: g.REPETITION,
                        min: 0,
                        max: Infinity,
                        value: l.pop()
                    });
                    break;
                default:
                    l.push({
                        type: g.CHAR,
                        value: d.charCodeAt(0)
                    })
                }
            }
            return e
        }, b.exports.types = g
    }), a.define("/node_modules/ret/lib/util.js", function (a, b, c, d, e) {
        var f = a("./types"),
            g = a("./sets"),
            h = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?",
            i = {
                0: 0,
                t: 9,
                n: 10,
                v: 11,
                f: 12,
                r: 13
            },
            j = b.exports = {
                strToChars: function (a) {
                    var b = /(\[\\b\])|\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]\^?])|([0tnvfr]))/g,
                        a = a.replace(b, function (a, b, c, d, e, f, g) {
                            var j = b ? 8 : c ? parseInt(c, 16) : d ? parseInt(d, 16) : e ? parseInt(e, 8) : f ? h.indexOf(f) : g ? i[g] : undefined,
                                k = String.fromCharCode(j);
                            return /[\[\]{}\^$.|?*+()]/.test(k) && (k = "\\" + k), k
                        });
                    return a
                },
                tokenizeClass: function (a) {
                    var b = [],
                        c = /\\(?:(w)|(d)|(s)|(W)|(D)|(S)|(.))|(.-[^\]])|(\])|(.)/g,
                        d, e;
                    while ((d = c.exec(a)) != null) if (d[1]) b.push(g.words());
                    else if (d[2]) b.push(g.ints());
                    else if (d[3]) b.push(g.whitespace());
                    else if (d[4]) b.push(g.notWords());
                    else if (d[5]) b.push(g.notInts());
                    else if (d[6]) b.push(g.notWhitespace());
                    else if (e = d[7] || d[10]) b.push({
                        type: f.CHAR,
                        value: e.charCodeAt(0)
                    });
                    else if (e = d[8]) b.push({
                        type: f.RANGE,
                        from: e.charCodeAt(0),
                        to: e.charCodeAt(2)
                    });
                    else return [b, c.lastIndex]
                }
            }
    }), a.define("/node_modules/ret/lib/types.js", function (a, b, c, d, e) {
        b.exports = {
            ROOT: 0,
            GROUP: 1,
            POSITION: 2,
            SET: 3,
            RANGE: 4,
            REPETITION: 5,
            REFERENCE: 6,
            CHAR: 7
        }
    }), a.define("/node_modules/ret/lib/sets.js", function (a, b, c, d, e) {
        var f = a("./types"),
            g = function () {
                return [{
                    type: f.RANGE,
                    from: 48,
                    to: 57
                }]
            },
            h = function () {
                return [{
                    type: f.RANGE,
                    from: 97,
                    to: 122
                }, {
                    type: f.RANGE,
                    from: 65,
                    to: 90
                }].concat(g())
            },
            i = function () {
                return [{
                    type: f.CHAR,
                    value: 12
                }, {
                    type: f.CHAR,
                    value: 10
                }, {
                    type: f.CHAR,
                    value: 13
                }, {
                    type: f.CHAR,
                    value: 9
                }, {
                    type: f.CHAR,
                    value: 11
                }, {
                    type: f.CHAR,
                    value: 160
                }, {
                    type: f.CHAR,
                    value: 5760
                }, {
                    type: f.CHAR,
                    value: 6158
                }, {
                    type: f.CHAR,
                    value: 8192
                }, {
                    type: f.CHAR,
                    value: 8193
                }, {
                    type: f.CHAR,
                    value: 8194
                }, {
                    type: f.CHAR,
                    value: 8195
                }, {
                    type: f.CHAR,
                    value: 8196
                }, {
                    type: f.CHAR,
                    value: 8197
                }, {
                    type: f.CHAR,
                    value: 8198
                }, {
                    type: f.CHAR,
                    value: 8199
                }, {
                    type: f.CHAR,
                    value: 8200
                }, {
                    type: f.CHAR,
                    value: 8201
                }, {
                    type: f.CHAR,
                    value: 8202
                }, {
                    type: f.CHAR,
                    value: 8232
                }, {
                    type: f.CHAR,
                    value: 8233
                }, {
                    type: f.CHAR,
                    value: 8239
                }, {
                    type: f.CHAR,
                    value: 8287
                }, {
                    type: f.CHAR,
                    value: 12288
                }]
            };
        c.words = function () {
            return {
                type: f.SET,
                set: h()
            }
        }, c.notWords = function () {
            return {
                type: f.SET,
                set: h(),
                not: !0
            }
        }, c.ints = function () {
            return {
                type: f.SET,
                set: g()
            }
        }, c.notInts = function () {
            return {
                type: f.SET,
                set: g(),
                not: !0
            }
        }, c.whitespace = function () {
            return {
                type: f.SET,
                set: i()
            }
        }, c.notWhitespace = function () {
            return {
                type: f.SET,
                set: i(),
                not: !0
            }
        }, c.anyChar = function () {
            return {
                type: f.SET,
                set: [{
                    type: f.CHAR,
                    value: 10
                }],
                not: !0
            }
        }
    }), a.define("/node_modules/ret/lib/positions.js", function (a, b, c, d, e) {
        var f = a("./types");
        c.wordBoundary = function () {
            return {
                type: f.POSITION,
                value: "b"
            }
        }, c.nonWordBoundary = function () {
            return {
                type: f.POSITION,
                value: "B"
            }
        }, c.begin = function () {
            return {
                type: f.POSITION,
                value: "^"
            }
        }, c.end = function () {
            return {
                type: f.POSITION,
                value: "$"
            }
        }
    }), a.define("/randexp.js", function (a, b, c, d, e) {
        var f = a("ret"),
            g = f.types,
            h = function (a, b) {
                return a + Math.floor(Math.random() * (1 + b - a))
            },
            i = function (a) {
                return a + (97 <= a && a <= 122 ? -32 : 65 <= a && a <= 90 ? 32 : 0)
            },
            j = function (a, b, c, d) {
                return a <= c && c <= b ? {
                    from: c,
                    to: Math.min(b, d)
                } : a <= d && d <= b ? {
                    from: Math.max(a, c),
                    to: d
                } : !1
            },
            k = function (a, b) {
                var c, d, e, f;
                if ((d = a.length) !== b.length) return !1;
                for (c = 0; c < d; c++) {
                    f = a[c];
                    for (e in f) if (f.hasOwnProperty(e) && f[e] !== b[c][e]) return !1
                }
                return !0
            },
            l = function (a, b) {
                for (var c = 0, d = a.length; c < d; c++) {
                    var e = a[c];
                    if (e.not !== b.not && k(e.set, b.set)) return !0
                }
                return !1
            },
            m = function (a, b, c) {
                var d, e, f = [],
                    h = !1;
                for (var k = 0, n = a.length; k < n; k++) {
                    d = a[k];
                    switch (d.type) {
                    case g.CHAR:
                        e = d.value;
                        if (e === b || c && i(e) === b) return !0;
                        break;
                    case g.RANGE:
                        if (d.from <= b && b <= d.to || c && ((e = j(97, 122, d.from, d.to)) !== !1 && e.from <= b && b <= e.to || (e = j(65, 90, d.from, d.to)) !== !1 && e.from <= b && b <= e.to)) return !0;
                        break;
                    case g.SET:
                        f.length > 0 && l(f, d) ? h = !0 : f.push(d);
                        if (!h && !m(d.set, b, c) != !d.not) return !0
                    }
                }
                return !1
            },
            n = function (a, b) {
                return String.fromCharCode(b && Math.random() > .5 ? i(a) : a)
            },
            o = function (a, b, c) {
                switch (a.type) {
                case g.ROOT:
                case g.GROUP:
                    if (a.notFollowedBy) return "";
                    if (a.remember) var d = b.push(!0) - 1;
                    var e = a.options ? a.options[Math.floor(Math.random() * a.options.length)] : a.stack,
                        f = "";
                    for (var i = 0, j = e.length; i < j; i++) f += o.call(this, e[i], b);
                    return a.remember && (b[d] = f), f;
                case g.POSITION:
                    return "";
                case g.SET:
                    var k = !c != !a.not;
                    if (!k) return o.call(this, a.set[Math.floor(Math.random() * a.set.length)], b, k);
                    for (;;) {
                        var l = this.anyRandChar(),
                            p = l.charCodeAt(0);
                        if (m(a.set, p, this.ignoreCase)) continue;
                        return l
                    };
                case g.RANGE:
                    return n(h(a.from, a.to), this.ignoreCase);
                case g.REPETITION:
                    var q = h(a.min, a.max === Infinity ? a.min + this.max : a.max),
                        f = "";
                    for (var i = 0; i < q; i++) f += o.call(this, a.value, b);
                    return f;
                case g.REFERENCE:
                    return b[a.value - 1];
                case g.CHAR:
                    return n(a.value, this.ignoreCase)
                }
            },
            p = b.exports = function (a, b) {
                if (a instanceof RegExp) this.ignoreCase = a.ignoreCase, this.multiline = a.multiline, typeof a.max == "number" && (this.max = a.max), typeof a.anyRandChar == "function" && (this.anyRandChar = a.anyRandChar), a = a.source;
                else if (typeof a == "string") this.ignoreCase = b && b.indexOf("i") !== -1, this.multiline = b && b.indexOf("m") !== -1;
                else throw new Error("Expected a regexp or string");
                this.tokens = f(a)
            };
        p.prototype.max = 100, p.prototype.anyRandChar = function () {
            return String.fromCharCode(h(0, 65535))
        }, p.prototype.gen = function () {
            return o.call(this, this.tokens, [])
        };
        var q = p.randexp = function (a, b) {
                var c;
                return a._randexp === undefined ? (c = new p(a, b), a._randexp = c) : (c = a._randexp, typeof a.max == "number" && (c.max = a.max), typeof a.anyRandChar == "function" && (c.anyRandChar = a.anyRandChar)), c.gen()
            };
        p.sugar = function () {
            RegExp.prototype.gen = function () {
                return q(this)
            }
        }
    }), function (a, b) {
        typeof define == "function" && typeof define.amd == "object" ? define(function () {
            return b
        }) : typeof window != "undefined" && (window[a] = b)
    }("RandExp", a("/randexp.js"))
})()