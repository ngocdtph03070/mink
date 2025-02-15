var ie = globalThis;
function Q(e) {
    return (ie.__Zone_symbol_prefix || "__zone_symbol__") + e
}
function ft() {
    let e = ie.performance;
    function n(j) {
        e && e.mark && e.mark(j)
    }
    function a(j, r) {
        e && e.measure && e.measure(j, r)
    }
    n("Zone");
    let $ = class $ {
        static assertZonePatched() {
            if (ie.Promise !== D.ZoneAwarePromise)
                throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)")
        }
        static get root() {
            let r = $.current;
            for (; r.parent; )
                r = r.parent;
            return r
        }
        static get current() {
            return k.zone
        }
        static get currentTask() {
            return S
        }
        static __load_patch(r, i, s=!1) {
            if (D.hasOwnProperty(r)) {
                let b = ie[Q("forceDuplicateZoneCheck")] === !0;
                if (!s && b)
                    throw Error("Already loaded patch: " + r)
            } else if (!ie["__Zone_disable_" + r]) {
                let b = "Zone:" + r;
                n(b),
                D[r] = i(ie, $, w),
                a(b, b)
            }
        }
        get parent() {
            return this._parent
        }
        get name() {
            return this._name
        }
        constructor(r, i) {
            this._parent = r,
            this._name = i ? i.name || "unnamed" : "<root>",
            this._properties = i && i.properties || {},
            this._zoneDelegate = new f(this,this._parent && this._parent._zoneDelegate,i)
        }
        get(r) {
            let i = this.getZoneWith(r);
            if (i)
                return i._properties[r]
        }
        getZoneWith(r) {
            let i = this;
            for (; i; ) {
                if (i._properties.hasOwnProperty(r))
                    return i;
                i = i._parent
            }
            return null
        }
        fork(r) {
            if (!r)
                throw new Error("ZoneSpec required!");
            return this._zoneDelegate.fork(this, r)
        }
        wrap(r, i) {
            if (typeof r != "function")
                throw new Error("Expecting function got: " + r);
            let s = this._zoneDelegate.intercept(this, r, i)
              , b = this;
            return function() {
                return b.runGuarded(s, this, arguments, i)
            }
        }
        run(r, i, s, b) {
            k = {
                parent: k,
                zone: this
            };
            try {
                return this._zoneDelegate.invoke(this, r, i, s, b)
            } finally {
                k = k.parent
            }
        }
        runGuarded(r, i=null, s, b) {
            k = {
                parent: k,
                zone: this
            };
            try {
                try {
                    return this._zoneDelegate.invoke(this, r, i, s, b)
                } catch (x) {
                    if (this._zoneDelegate.handleError(this, x))
                        throw x
                }
            } finally {
                k = k.parent
            }
        }
        runTask(r, i, s) {
            if (r.zone != this)
                throw new Error("A task can only be run in the zone of creation! (Creation: " + (r.zone || te).name + "; Execution: " + this.name + ")");
            if (r.state === X && (r.type === U || r.type === g))
                return;
            let b = r.state != F;
            b && r._transitionTo(F, d),
            r.runCount++;
            let x = S;
            S = r,
            k = {
                parent: k,
                zone: this
            };
            try {
                r.type == g && r.data && !r.data.isPeriodic && (r.cancelFn = void 0);
                try {
                    return this._zoneDelegate.invokeTask(this, r, i, s)
                } catch (M) {
                    if (this._zoneDelegate.handleError(this, M))
                        throw M
                }
            } finally {
                r.state !== X && r.state !== Y && (r.type == U || r.data && r.data.isPeriodic ? b && r._transitionTo(d, F) : (r.runCount = 0,
                this._updateTaskCount(r, -1),
                b && r._transitionTo(X, F, X))),
                k = k.parent,
                S = x
            }
        }
        scheduleTask(r) {
            if (r.zone && r.zone !== this) {
                let s = this;
                for (; s; ) {
                    if (s === r.zone)
                        throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${r.zone.name}`);
                    s = s.parent
                }
            }
            r._transitionTo(v, X);
            let i = [];
            r._zoneDelegates = i,
            r._zone = this;
            try {
                r = this._zoneDelegate.scheduleTask(this, r)
            } catch (s) {
                throw r._transitionTo(Y, v, X),
                this._zoneDelegate.handleError(this, s),
                s
            }
            return r._zoneDelegates === i && this._updateTaskCount(r, 1),
            r.state == v && r._transitionTo(d, v),
            r
        }
        scheduleMicroTask(r, i, s, b) {
            return this.scheduleTask(new _(B,r,i,s,b,void 0))
        }
        scheduleMacroTask(r, i, s, b, x) {
            return this.scheduleTask(new _(g,r,i,s,b,x))
        }
        scheduleEventTask(r, i, s, b, x) {
            return this.scheduleTask(new _(U,r,i,s,b,x))
        }
        cancelTask(r) {
            if (r.zone != this)
                throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (r.zone || te).name + "; Execution: " + this.name + ")");
            if (!(r.state !== d && r.state !== F)) {
                r._transitionTo(q, d, F);
                try {
                    this._zoneDelegate.cancelTask(this, r)
                } catch (i) {
                    throw r._transitionTo(Y, q),
                    this._zoneDelegate.handleError(this, i),
                    i
                }
                return this._updateTaskCount(r, -1),
                r._transitionTo(X, q),
                r.runCount = 0,
                r
            }
        }
        _updateTaskCount(r, i) {
            let s = r._zoneDelegates;
            i == -1 && (r._zoneDelegates = null);
            for (let b = 0; b < s.length; b++)
                s[b]._updateTaskCount(r.type, i)
        }
    }
    ;
    $.__symbol__ = Q;
    let t = $
      , c = {
        name: "",
        onHasTask: (j,r,i,s)=>j.hasTask(i, s),
        onScheduleTask: (j,r,i,s)=>j.scheduleTask(i, s),
        onInvokeTask: (j,r,i,s,b,x)=>j.invokeTask(i, s, b, x),
        onCancelTask: (j,r,i,s)=>j.cancelTask(i, s)
    };
    class f {
        get zone() {
            return this._zone
        }
        constructor(r, i, s) {
            this._taskCounts = {
                microTask: 0,
                macroTask: 0,
                eventTask: 0
            },
            this._zone = r,
            this._parentDelegate = i,
            this._forkZS = s && (s && s.onFork ? s : i._forkZS),
            this._forkDlgt = s && (s.onFork ? i : i._forkDlgt),
            this._forkCurrZone = s && (s.onFork ? this._zone : i._forkCurrZone),
            this._interceptZS = s && (s.onIntercept ? s : i._interceptZS),
            this._interceptDlgt = s && (s.onIntercept ? i : i._interceptDlgt),
            this._interceptCurrZone = s && (s.onIntercept ? this._zone : i._interceptCurrZone),
            this._invokeZS = s && (s.onInvoke ? s : i._invokeZS),
            this._invokeDlgt = s && (s.onInvoke ? i : i._invokeDlgt),
            this._invokeCurrZone = s && (s.onInvoke ? this._zone : i._invokeCurrZone),
            this._handleErrorZS = s && (s.onHandleError ? s : i._handleErrorZS),
            this._handleErrorDlgt = s && (s.onHandleError ? i : i._handleErrorDlgt),
            this._handleErrorCurrZone = s && (s.onHandleError ? this._zone : i._handleErrorCurrZone),
            this._scheduleTaskZS = s && (s.onScheduleTask ? s : i._scheduleTaskZS),
            this._scheduleTaskDlgt = s && (s.onScheduleTask ? i : i._scheduleTaskDlgt),
            this._scheduleTaskCurrZone = s && (s.onScheduleTask ? this._zone : i._scheduleTaskCurrZone),
            this._invokeTaskZS = s && (s.onInvokeTask ? s : i._invokeTaskZS),
            this._invokeTaskDlgt = s && (s.onInvokeTask ? i : i._invokeTaskDlgt),
            this._invokeTaskCurrZone = s && (s.onInvokeTask ? this._zone : i._invokeTaskCurrZone),
            this._cancelTaskZS = s && (s.onCancelTask ? s : i._cancelTaskZS),
            this._cancelTaskDlgt = s && (s.onCancelTask ? i : i._cancelTaskDlgt),
            this._cancelTaskCurrZone = s && (s.onCancelTask ? this._zone : i._cancelTaskCurrZone),
            this._hasTaskZS = null,
            this._hasTaskDlgt = null,
            this._hasTaskDlgtOwner = null,
            this._hasTaskCurrZone = null;
            let b = s && s.onHasTask
              , x = i && i._hasTaskZS;
            (b || x) && (this._hasTaskZS = b ? s : c,
            this._hasTaskDlgt = i,
            this._hasTaskDlgtOwner = this,
            this._hasTaskCurrZone = this._zone,
            s.onScheduleTask || (this._scheduleTaskZS = c,
            this._scheduleTaskDlgt = i,
            this._scheduleTaskCurrZone = this._zone),
            s.onInvokeTask || (this._invokeTaskZS = c,
            this._invokeTaskDlgt = i,
            this._invokeTaskCurrZone = this._zone),
            s.onCancelTask || (this._cancelTaskZS = c,
            this._cancelTaskDlgt = i,
            this._cancelTaskCurrZone = this._zone))
        }
        fork(r, i) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, r, i) : new t(r,i)
        }
        intercept(r, i, s) {
            return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, r, i, s) : i
        }
        invoke(r, i, s, b, x) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, r, i, s, b, x) : i.apply(s, b)
        }
        handleError(r, i) {
            return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, r, i) : !0
        }
        scheduleTask(r, i) {
            let s = i;
            if (this._scheduleTaskZS)
                this._hasTaskZS && s._zoneDelegates.push(this._hasTaskDlgtOwner),
                s = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, r, i),
                s || (s = i);
            else if (i.scheduleFn)
                i.scheduleFn(i);
            else if (i.type == B)
                W(i);
            else
                throw new Error("Task is missing scheduleFn.");
            return s
        }
        invokeTask(r, i, s, b) {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, r, i, s, b) : i.callback.apply(s, b)
        }
        cancelTask(r, i) {
            let s;
            if (this._cancelTaskZS)
                s = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, r, i);
            else {
                if (!i.cancelFn)
                    throw Error("Task is not cancelable");
                s = i.cancelFn(i)
            }
            return s
        }
        hasTask(r, i) {
            try {
                this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, r, i)
            } catch (s) {
                this.handleError(r, s)
            }
        }
        _updateTaskCount(r, i) {
            let s = this._taskCounts
              , b = s[r]
              , x = s[r] = b + i;
            if (x < 0)
                throw new Error("More tasks executed then were scheduled.");
            if (b == 0 || x == 0) {
                let M = {
                    microTask: s.microTask > 0,
                    macroTask: s.macroTask > 0,
                    eventTask: s.eventTask > 0,
                    change: r
                };
                this.hasTask(this._zone, M)
            }
        }
    }
    class _ {
        constructor(r, i, s, b, x, M) {
            if (this._zone = null,
            this.runCount = 0,
            this._zoneDelegates = null,
            this._state = "notScheduled",
            this.type = r,
            this.source = i,
            this.data = b,
            this.scheduleFn = x,
            this.cancelFn = M,
            !s)
                throw new Error("callback is not defined");
            this.callback = s;
            let de = this;
            r === U && b && b.useG ? this.invoke = _.invokeTask : this.invoke = function() {
                return _.invokeTask.call(ie, de, this, arguments)
            }
        }
        static invokeTask(r, i, s) {
            r || (r = this),
            K++;
            try {
                return r.runCount++,
                r.zone.runTask(r, i, s)
            } finally {
                K == 1 && A(),
                K--
            }
        }
        get zone() {
            return this._zone
        }
        get state() {
            return this._state
        }
        cancelScheduleRequest() {
            this._transitionTo(X, v)
        }
        _transitionTo(r, i, s) {
            if (this._state === i || this._state === s)
                this._state = r,
                r == X && (this._zoneDelegates = null);
            else
                throw new Error(`${this.type} '${this.source}': can not transition to '${r}', expecting state '${i}'${s ? " or '" + s + "'" : ""}, was '${this._state}'.`)
        }
        toString() {
            return this.data && typeof this.data.handleId < "u" ? this.data.handleId.toString() : Object.prototype.toString.call(this)
        }
        toJSON() {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            }
        }
    }
    let E = Q("setTimeout"), m = Q("Promise"), C = Q("then"), T = [], I = !1, P;
    function Z(j) {
        if (P || ie[m] && (P = ie[m].resolve(0)),
        P) {
            let r = P[C];
            r || (r = P.then),
            r.call(P, j)
        } else
            ie[E](j, 0)
    }
    function W(j) {
        K === 0 && T.length === 0 && Z(A),
        j && T.push(j)
    }
    function A() {
        if (!I) {
            for (I = !0; T.length; ) {
                let j = T;
                T = [];
                for (let r = 0; r < j.length; r++) {
                    let i = j[r];
                    try {
                        i.zone.runTask(i, null, null)
                    } catch (s) {
                        w.onUnhandledError(s)
                    }
                }
            }
            w.microtaskDrainDone(),
            I = !1
        }
    }
    let te = {
        name: "NO ZONE"
    }
      , X = "notScheduled"
      , v = "scheduling"
      , d = "scheduled"
      , F = "running"
      , q = "canceling"
      , Y = "unknown"
      , B = "microTask"
      , g = "macroTask"
      , U = "eventTask"
      , D = {}
      , w = {
        symbol: Q,
        currentZoneFrame: ()=>k,
        onUnhandledError: z,
        microtaskDrainDone: z,
        scheduleMicroTask: W,
        showUncaughtError: ()=>!t[Q("ignoreConsoleErrorUncaughtError")],
        patchEventTarget: ()=>[],
        patchOnProperties: z,
        patchMethod: ()=>z,
        bindArguments: ()=>[],
        patchThen: ()=>z,
        patchMacroTask: ()=>z,
        patchEventPrototype: ()=>z,
        isIEOrEdge: ()=>!1,
        getGlobalObjects: ()=>{}
        ,
        ObjectDefineProperty: ()=>z,
        ObjectGetOwnPropertyDescriptor: ()=>{}
        ,
        ObjectCreate: ()=>{}
        ,
        ArraySlice: ()=>[],
        patchClass: ()=>z,
        wrapWithCurrentZone: ()=>z,
        filterProperties: ()=>[],
        attachOriginToPatched: ()=>z,
        _redefineProperty: ()=>z,
        patchCallbacks: ()=>z,
        nativeScheduleMicroTask: Z
    }
      , k = {
        parent: null,
        zone: new t(null,null)
    }
      , S = null
      , K = 0;
    function z() {}
    return a("Zone", "Zone"),
    t
}
function ht() {
    let e = globalThis
      , n = e[Q("forceDuplicateZoneCheck")] === !0;
    if (e.Zone && (n || typeof e.Zone.__symbol__ != "function"))
        throw new Error("Zone already loaded.");
    return e.Zone ??= ft(),
    e.Zone
}
var ve = Object.getOwnPropertyDescriptor
  , Ae = Object.defineProperty
  , je = Object.getPrototypeOf
  , dt = Object.create
  , _t = Array.prototype.slice
  , He = "addEventListener"
  , xe = "removeEventListener"
  , Le = Q(He)
  , Ie = Q(xe)
  , ce = "true"
  , ae = "false"
  , be = Q("");
function Ge(e, n) {
    return Zone.current.wrap(e, n)
}
function Ve(e, n, a, t, c) {
    return Zone.current.scheduleMacroTask(e, n, a, t, c)
}
var H = Q
  , Se = typeof window < "u"
  , ye = Se ? window : void 0
  , J = Se && ye || globalThis
  , Et = "removeAttribute";
function Fe(e, n) {
    for (let a = e.length - 1; a >= 0; a--)
        typeof e[a] == "function" && (e[a] = Ge(e[a], n + "_" + a));
    return e
}
function Tt(e, n) {
    let a = e.constructor.name;
    for (let t = 0; t < n.length; t++) {
        let c = n[t]
          , f = e[c];
        if (f) {
            let _ = ve(e, c);
            if (!Qe(_))
                continue;
            e[c] = (E=>{
                let m = function() {
                    return E.apply(this, Fe(arguments, a + "." + c))
                };
                return ue(m, E),
                m
            }
            )(f)
        }
    }
}
function Qe(e) {
    return e ? e.writable === !1 ? !1 : !(typeof e.get == "function" && typeof e.set > "u") : !0
}
var et = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope
  , De = !("nw"in J) && typeof J.process < "u" && J.process.toString() === "[object process]"
  , Be = !De && !et && !!(Se && ye.HTMLElement)
  , tt = typeof J.process < "u" && J.process.toString() === "[object process]" && !et && !!(Se && ye.HTMLElement)
  , Ce = {}
  , Ye = function(e) {
    if (e = e || J.event,
    !e)
        return;
    let n = Ce[e.type];
    n || (n = Ce[e.type] = H("ON_PROPERTY" + e.type));
    let a = this || e.target || J, t = a[n], c;
    if (Be && a === ye && e.type === "error") {
        let f = e;
        c = t && t.call(this, f.message, f.filename, f.lineno, f.colno, f.error),
        c === !0 && e.preventDefault()
    } else
        c = t && t.apply(this, arguments),
        c != null && !c && e.preventDefault();
    return c
};
function $e(e, n, a) {
    let t = ve(e, n);
    if (!t && a && ve(a, n) && (t = {
        enumerable: !0,
        configurable: !0
    }),
    !t || !t.configurable)
        return;
    let c = H("on" + n + "patched");
    if (e.hasOwnProperty(c) && e[c])
        return;
    delete t.writable,
    delete t.value;
    let f = t.get
      , _ = t.set
      , E = n.slice(2)
      , m = Ce[E];
    m || (m = Ce[E] = H("ON_PROPERTY" + E)),
    t.set = function(C) {
        let T = this;
        if (!T && e === J && (T = J),
        !T)
            return;
        typeof T[m] == "function" && T.removeEventListener(E, Ye),
        _ && _.call(T, null),
        T[m] = C,
        typeof C == "function" && T.addEventListener(E, Ye, !1)
    }
    ,
    t.get = function() {
        let C = this;
        if (!C && e === J && (C = J),
        !C)
            return null;
        let T = C[m];
        if (T)
            return T;
        if (f) {
            let I = f.call(this);
            if (I)
                return t.set.call(this, I),
                typeof C[Et] == "function" && C.removeAttribute(n),
                I
        }
        return null
    }
    ,
    Ae(e, n, t),
    e[c] = !0
}
function nt(e, n, a) {
    if (n)
        for (let t = 0; t < n.length; t++)
            $e(e, "on" + n[t], a);
    else {
        let t = [];
        for (let c in e)
            c.slice(0, 2) == "on" && t.push(c);
        for (let c = 0; c < t.length; c++)
            $e(e, t[c], a)
    }
}
var re = H("originalInstance");
function ke(e) {
    let n = J[e];
    if (!n)
        return;
    J[H(e)] = n,
    J[e] = function() {
        let c = Fe(arguments, e);
        switch (c.length) {
        case 0:
            this[re] = new n;
            break;
        case 1:
            this[re] = new n(c[0]);
            break;
        case 2:
            this[re] = new n(c[0],c[1]);
            break;
        case 3:
            this[re] = new n(c[0],c[1],c[2]);
            break;
        case 4:
            this[re] = new n(c[0],c[1],c[2],c[3]);
            break;
        default:
            throw new Error("Arg list too long.")
        }
    }
    ,
    ue(J[e], n);
    let a = new n(function() {}
    ), t;
    for (t in a)
        e === "XMLHttpRequest" && t === "responseBlob" || function(c) {
            typeof a[c] == "function" ? J[e].prototype[c] = function() {
                return this[re][c].apply(this[re], arguments)
            }
            : Ae(J[e].prototype, c, {
                set: function(f) {
                    typeof f == "function" ? (this[re][c] = Ge(f, e + "." + c),
                    ue(this[re][c], f)) : this[re][c] = f
                },
                get: function() {
                    return this[re][c]
                }
            })
        }(t);
    for (t in n)
        t !== "prototype" && n.hasOwnProperty(t) && (J[e][t] = n[t])
}
function le(e, n, a) {
    let t = e;
    for (; t && !t.hasOwnProperty(n); )
        t = je(t);
    !t && e[n] && (t = e);
    let c = H(n)
      , f = null;
    if (t && (!(f = t[c]) || !t.hasOwnProperty(c))) {
        f = t[c] = t[n];
        let _ = t && ve(t, n);
        if (Qe(_)) {
            let E = a(f, c, n);
            t[n] = function() {
                return E(this, arguments)
            }
            ,
            ue(t[n], f)
        }
    }
    return f
}
function gt(e, n, a) {
    let t = null;
    function c(f) {
        let _ = f.data;
        return _.args[_.cbIdx] = function() {
            f.invoke.apply(this, arguments)
        }
        ,
        t.apply(_.target, _.args),
        f
    }
    t = le(e, n, f=>function(_, E) {
        let m = a(_, E);
        return m.cbIdx >= 0 && typeof E[m.cbIdx] == "function" ? Ve(m.name, E[m.cbIdx], m, c) : f.apply(_, E)
    }
    )
}
function ue(e, n) {
    e[H("OriginalDelegate")] = n
}
var Je = !1
  , Me = !1;
function yt() {
    try {
        let e = ye.navigator.userAgent;
        if (e.indexOf("MSIE ") !== -1 || e.indexOf("Trident/") !== -1)
            return !0
    } catch {}
    return !1
}
function mt() {
    if (Je)
        return Me;
    Je = !0;
    try {
        let e = ye.navigator.userAgent;
        (e.indexOf("MSIE ") !== -1 || e.indexOf("Trident/") !== -1 || e.indexOf("Edge/") !== -1) && (Me = !0)
    } catch {}
    return Me
}
var ge = !1;
if (typeof window < "u")
    try {
        let e = Object.defineProperty({}, "passive", {
            get: function() {
                ge = !0
            }
        });
        window.addEventListener("test", e, e),
        window.removeEventListener("test", e, e)
    } catch {
        ge = !1
    }
var pt = {
    useG: !0
}
  , ee = {}
  , rt = {}
  , ot = new RegExp("^" + be + "(\\w+)(true|false)$")
  , st = H("propagationStopped");
function it(e, n) {
    let a = (n ? n(e) : e) + ae
      , t = (n ? n(e) : e) + ce
      , c = be + a
      , f = be + t;
    ee[e] = {},
    ee[e][ae] = c,
    ee[e][ce] = f
}
function kt(e, n, a, t) {
    let c = t && t.add || He
      , f = t && t.rm || xe
      , _ = t && t.listeners || "eventListeners"
      , E = t && t.rmAll || "removeAllListeners"
      , m = H(c)
      , C = "." + c + ":"
      , T = "prependListener"
      , I = "." + T + ":"
      , P = function(v, d, F) {
        if (v.isRemoved)
            return;
        let q = v.callback;
        typeof q == "object" && q.handleEvent && (v.callback = g=>q.handleEvent(g),
        v.originalDelegate = q);
        let Y;
        try {
            v.invoke(v, d, [F])
        } catch (g) {
            Y = g
        }
        let B = v.options;
        if (B && typeof B == "object" && B.once) {
            let g = v.originalDelegate ? v.originalDelegate : v.callback;
            d[f].call(d, F.type, g, B)
        }
        return Y
    };
    function Z(v, d, F) {
        if (d = d || e.event,
        !d)
            return;
        let q = v || d.target || e
          , Y = q[ee[d.type][F ? ce : ae]];
        if (Y) {
            let B = [];
            if (Y.length === 1) {
                let g = P(Y[0], q, d);
                g && B.push(g)
            } else {
                let g = Y.slice();
                for (let U = 0; U < g.length && !(d && d[st] === !0); U++) {
                    let D = P(g[U], q, d);
                    D && B.push(D)
                }
            }
            if (B.length === 1)
                throw B[0];
            for (let g = 0; g < B.length; g++) {
                let U = B[g];
                n.nativeScheduleMicroTask(()=>{
                    throw U
                }
                )
            }
        }
    }
    let W = function(v) {
        return Z(this, v, !1)
    }
      , A = function(v) {
        return Z(this, v, !0)
    };
    function te(v, d) {
        if (!v)
            return !1;
        let F = !0;
        d && d.useG !== void 0 && (F = d.useG);
        let q = d && d.vh
          , Y = !0;
        d && d.chkDup !== void 0 && (Y = d.chkDup);
        let B = !1;
        d && d.rt !== void 0 && (B = d.rt);
        let g = v;
        for (; g && !g.hasOwnProperty(c); )
            g = je(g);
        if (!g && v[c] && (g = v),
        !g || g[m])
            return !1;
        let U = d && d.eventNameToString, D = {}, w = g[m] = g[c], k = g[H(f)] = g[f], S = g[H(_)] = g[_], K = g[H(E)] = g[E], z;
        d && d.prepend && (z = g[H(d.prepend)] = g[d.prepend]);
        function $(o, u) {
            return !ge && typeof o == "object" && o ? !!o.capture : !ge || !u ? o : typeof o == "boolean" ? {
                capture: o,
                passive: !0
            } : o ? typeof o == "object" && o.passive !== !1 ? {
                ...o,
                passive: !0
            } : o : {
                passive: !0
            }
        }
        let j = function(o) {
            if (!D.isExisting)
                return w.call(D.target, D.eventName, D.capture ? A : W, D.options)
        }
          , r = function(o) {
            if (!o.isRemoved) {
                let u = ee[o.eventName], p;
                u && (p = u[o.capture ? ce : ae]);
                let R = p && o.target[p];
                if (R) {
                    for (let y = 0; y < R.length; y++)
                        if (R[y] === o) {
                            R.splice(y, 1),
                            o.isRemoved = !0,
                            o.removeAbortListener && (o.removeAbortListener(),
                            o.removeAbortListener = null),
                            R.length === 0 && (o.allRemoved = !0,
                            o.target[p] = null);
                            break
                        }
                }
            }
            if (o.allRemoved)
                return k.call(o.target, o.eventName, o.capture ? A : W, o.options)
        }
          , i = function(o) {
            return w.call(D.target, D.eventName, o.invoke, D.options)
        }
          , s = function(o) {
            return z.call(D.target, D.eventName, o.invoke, D.options)
        }
          , b = function(o) {
            return k.call(o.target, o.eventName, o.invoke, o.options)
        }
          , x = F ? j : i
          , M = F ? r : b
          , de = function(o, u) {
            let p = typeof u;
            return p === "function" && o.callback === u || p === "object" && o.originalDelegate === u
        }
          , me = d && d.diff ? d.diff : de
          , he = Zone[H("UNPATCHED_EVENTS")]
          , Pe = e[H("PASSIVE_EVENTS")];
        function h(o) {
            if (typeof o == "object" && o !== null) {
                let u = {
                    ...o
                };
                return o.signal && (u.signal = o.signal),
                u
            }
            return o
        }
        let l = function(o, u, p, R, y=!1, O=!1) {
            return function() {
                let N = this || e
                  , L = arguments[0];
                d && d.transferEventName && (L = d.transferEventName(L));
                let G = arguments[1];
                if (!G)
                    return o.apply(this, arguments);
                if (De && L === "uncaughtException")
                    return o.apply(this, arguments);
                let V = !1;
                if (typeof G != "function") {
                    if (!G.handleEvent)
                        return o.apply(this, arguments);
                    V = !0
                }
                if (q && !q(o, G, N, arguments))
                    return;
                let fe = ge && !!Pe && Pe.indexOf(L) !== -1
                  , oe = h($(arguments[2], fe))
                  , _e = oe?.signal;
                if (_e?.aborted)
                    return;
                if (he) {
                    for (let se = 0; se < he.length; se++)
                        if (L === he[se])
                            return fe ? o.call(N, L, G, oe) : o.apply(this, arguments)
                }
                let Oe = oe ? typeof oe == "boolean" ? !0 : oe.capture : !1
                  , Ue = oe && typeof oe == "object" ? oe.once : !1
                  , ut = Zone.current
                  , Ne = ee[L];
                Ne || (it(L, U),
                Ne = ee[L]);
                let We = Ne[Oe ? ce : ae]
                  , Ee = N[We]
                  , qe = !1;
                if (Ee) {
                    if (qe = !0,
                    Y) {
                        for (let se = 0; se < Ee.length; se++)
                            if (me(Ee[se], G))
                                return
                    }
                } else
                    Ee = N[We] = [];
                let we, ze = N.constructor.name, Xe = rt[ze];
                Xe && (we = Xe[L]),
                we || (we = ze + u + (U ? U(L) : L)),
                D.options = oe,
                Ue && (D.options.once = !1),
                D.target = N,
                D.capture = Oe,
                D.eventName = L,
                D.isExisting = qe;
                let pe = F ? pt : void 0;
                pe && (pe.taskData = D),
                _e && (D.options.signal = void 0);
                let ne = ut.scheduleEventTask(we, G, pe, p, R);
                if (_e) {
                    D.options.signal = _e;
                    let se = ()=>ne.zone.cancelTask(ne);
                    o.call(_e, "abort", se, {
                        once: !0
                    }),
                    ne.removeAbortListener = ()=>_e.removeEventListener("abort", se)
                }
                if (D.target = null,
                pe && (pe.taskData = null),
                Ue && (D.options.once = !0),
                !ge && typeof ne.options == "boolean" || (ne.options = oe),
                ne.target = N,
                ne.capture = Oe,
                ne.eventName = L,
                V && (ne.originalDelegate = G),
                O ? Ee.unshift(ne) : Ee.push(ne),
                y)
                    return N
            }
        };
        return g[c] = l(w, C, x, M, B),
        z && (g[T] = l(z, I, s, M, B, !0)),
        g[f] = function() {
            let o = this || e
              , u = arguments[0];
            d && d.transferEventName && (u = d.transferEventName(u));
            let p = arguments[2]
              , R = p ? typeof p == "boolean" ? !0 : p.capture : !1
              , y = arguments[1];
            if (!y)
                return k.apply(this, arguments);
            if (q && !q(k, y, o, arguments))
                return;
            let O = ee[u], N;
            O && (N = O[R ? ce : ae]);
            let L = N && o[N];
            if (L)
                for (let G = 0; G < L.length; G++) {
                    let V = L[G];
                    if (me(V, y)) {
                        if (L.splice(G, 1),
                        V.isRemoved = !0,
                        L.length === 0 && (V.allRemoved = !0,
                        o[N] = null,
                        !R && typeof u == "string")) {
                            let fe = be + "ON_PROPERTY" + u;
                            o[fe] = null
                        }
                        return V.zone.cancelTask(V),
                        B ? o : void 0
                    }
                }
            return k.apply(this, arguments)
        }
        ,
        g[_] = function() {
            let o = this || e
              , u = arguments[0];
            d && d.transferEventName && (u = d.transferEventName(u));
            let p = []
              , R = ct(o, U ? U(u) : u);
            for (let y = 0; y < R.length; y++) {
                let O = R[y]
                  , N = O.originalDelegate ? O.originalDelegate : O.callback;
                p.push(N)
            }
            return p
        }
        ,
        g[E] = function() {
            let o = this || e
              , u = arguments[0];
            if (u) {
                d && d.transferEventName && (u = d.transferEventName(u));
                let p = ee[u];
                if (p) {
                    let R = p[ae]
                      , y = p[ce]
                      , O = o[R]
                      , N = o[y];
                    if (O) {
                        let L = O.slice();
                        for (let G = 0; G < L.length; G++) {
                            let V = L[G]
                              , fe = V.originalDelegate ? V.originalDelegate : V.callback;
                            this[f].call(this, u, fe, V.options)
                        }
                    }
                    if (N) {
                        let L = N.slice();
                        for (let G = 0; G < L.length; G++) {
                            let V = L[G]
                              , fe = V.originalDelegate ? V.originalDelegate : V.callback;
                            this[f].call(this, u, fe, V.options)
                        }
                    }
                }
            } else {
                let p = Object.keys(o);
                for (let R = 0; R < p.length; R++) {
                    let y = p[R]
                      , O = ot.exec(y)
                      , N = O && O[1];
                    N && N !== "removeListener" && this[E].call(this, N)
                }
                this[E].call(this, "removeListener")
            }
            if (B)
                return this
        }
        ,
        ue(g[c], w),
        ue(g[f], k),
        K && ue(g[E], K),
        S && ue(g[_], S),
        !0
    }
    let X = [];
    for (let v = 0; v < a.length; v++)
        X[v] = te(a[v], t);
    return X
}
function ct(e, n) {
    if (!n) {
        let f = [];
        for (let _ in e) {
            let E = ot.exec(_)
              , m = E && E[1];
            if (m && (!n || m === n)) {
                let C = e[_];
                if (C)
                    for (let T = 0; T < C.length; T++)
                        f.push(C[T])
            }
        }
        return f
    }
    let a = ee[n];
    a || (it(n),
    a = ee[n]);
    let t = e[a[ae]]
      , c = e[a[ce]];
    return t ? c ? t.concat(c) : t.slice() : c ? c.slice() : []
}
function vt(e, n) {
    let a = e.Event;
    a && a.prototype && n.patchMethod(a.prototype, "stopImmediatePropagation", t=>function(c, f) {
        c[st] = !0,
        t && t.apply(c, f)
    }
    )
}
function bt(e, n) {
    n.patchMethod(e, "queueMicrotask", a=>function(t, c) {
        Zone.current.scheduleMicroTask("queueMicrotask", c[0])
    }
    )
}
var Re = H("zoneTask");
function Te(e, n, a, t) {
    let c = null
      , f = null;
    n += t,
    a += t;
    let _ = {};
    function E(C) {
        let T = C.data;
        return T.args[0] = function() {
            return C.invoke.apply(this, arguments)
        }
        ,
        T.handleId = c.apply(e, T.args),
        C
    }
    function m(C) {
        return f.call(e, C.data.handleId)
    }
    c = le(e, n, C=>function(T, I) {
        if (typeof I[0] == "function") {
            let P = {
                isPeriodic: t === "Interval",
                delay: t === "Timeout" || t === "Interval" ? I[1] || 0 : void 0,
                args: I
            }
              , Z = I[0];
            I[0] = function() {
                try {
                    return Z.apply(this, arguments)
                } finally {
                    P.isPeriodic || (typeof P.handleId == "number" ? delete _[P.handleId] : P.handleId && (P.handleId[Re] = null))
                }
            }
            ;
            let W = Ve(n, I[0], P, E, m);
            if (!W)
                return W;
            let A = W.data.handleId;
            return typeof A == "number" ? _[A] = W : A && (A[Re] = W),
            A && A.ref && A.unref && typeof A.ref == "function" && typeof A.unref == "function" && (W.ref = A.ref.bind(A),
            W.unref = A.unref.bind(A)),
            typeof A == "number" || A ? A : W
        } else
            return C.apply(e, I)
    }
    ),
    f = le(e, a, C=>function(T, I) {
        let P = I[0], Z;
        typeof P == "number" ? Z = _[P] : (Z = P && P[Re],
        Z || (Z = P)),
        Z && typeof Z.type == "string" ? Z.state !== "notScheduled" && (Z.cancelFn && Z.data.isPeriodic || Z.runCount === 0) && (typeof P == "number" ? delete _[P] : P && (P[Re] = null),
        Z.zone.cancelTask(Z)) : C.apply(e, I)
    }
    )
}
function Pt(e, n) {
    let {isBrowser: a, isMix: t} = n.getGlobalObjects();
    if (!a && !t || !e.customElements || !("customElements"in e))
        return;
    let c = ["connectedCallback", "disconnectedCallback", "adoptedCallback", "attributeChangedCallback", "formAssociatedCallback", "formDisabledCallback", "formResetCallback", "formStateRestoreCallback"];
    n.patchCallbacks(n, e.customElements, "customElements", "define", c)
}
function wt(e, n) {
    if (Zone[n.symbol("patchEventTarget")])
        return;
    let {eventNames: a, zoneSymbolEventNames: t, TRUE_STR: c, FALSE_STR: f, ZONE_SYMBOL_PREFIX: _} = n.getGlobalObjects();
    for (let m = 0; m < a.length; m++) {
        let C = a[m]
          , T = C + f
          , I = C + c
          , P = _ + T
          , Z = _ + I;
        t[C] = {},
        t[C][f] = P,
        t[C][c] = Z
    }
    let E = e.EventTarget;
    if (!(!E || !E.prototype))
        return n.patchEventTarget(e, n, [E && E.prototype]),
        !0
}
function Rt(e, n) {
    n.patchEventPrototype(e, n)
}
function at(e, n, a) {
    if (!a || a.length === 0)
        return n;
    let t = a.filter(f=>f.target === e);
    if (!t || t.length === 0)
        return n;
    let c = t[0].ignoreProperties;
    return n.filter(f=>c.indexOf(f) === -1)
}
function Ke(e, n, a, t) {
    if (!e)
        return;
    let c = at(e, n, a);
    nt(e, c, t)
}
function Ze(e) {
    return Object.getOwnPropertyNames(e).filter(n=>n.startsWith("on") && n.length > 2).map(n=>n.substring(2))
}
function Ct(e, n) {
    if (De && !tt || Zone[e.symbol("patchEvents")])
        return;
    let a = n.__Zone_ignore_on_properties
      , t = [];
    if (Be) {
        let c = window;
        t = t.concat(["Document", "SVGElement", "Element", "HTMLElement", "HTMLBodyElement", "HTMLMediaElement", "HTMLFrameSetElement", "HTMLFrameElement", "HTMLIFrameElement", "HTMLMarqueeElement", "Worker"]);
        let f = yt() ? [{
            target: c,
            ignoreProperties: ["error"]
        }] : [];
        Ke(c, Ze(c), a && a.concat(f), je(c))
    }
    t = t.concat(["XMLHttpRequest", "XMLHttpRequestEventTarget", "IDBIndex", "IDBRequest", "IDBOpenDBRequest", "IDBDatabase", "IDBTransaction", "IDBCursor", "WebSocket"]);
    for (let c = 0; c < t.length; c++) {
        let f = n[t[c]];
        f && f.prototype && Ke(f.prototype, Ze(f.prototype), a)
    }
}
function St(e) {
    e.__load_patch("legacy", n=>{
        let a = n[e.__symbol__("legacyPatch")];
        a && a()
    }
    ),
    e.__load_patch("timers", n=>{
        let a = "set"
          , t = "clear";
        Te(n, a, t, "Timeout"),
        Te(n, a, t, "Interval"),
        Te(n, a, t, "Immediate")
    }
    ),
    e.__load_patch("requestAnimationFrame", n=>{
        Te(n, "request", "cancel", "AnimationFrame"),
        Te(n, "mozRequest", "mozCancel", "AnimationFrame"),
        Te(n, "webkitRequest", "webkitCancel", "AnimationFrame")
    }
    ),
    e.__load_patch("blocking", (n,a)=>{
        let t = ["alert", "prompt", "confirm"];
        for (let c = 0; c < t.length; c++) {
            let f = t[c];
            le(n, f, (_,E,m)=>function(C, T) {
                return a.current.run(_, n, T, m)
            }
            )
        }
    }
    ),
    e.__load_patch("EventTarget", (n,a,t)=>{
        Rt(n, t),
        wt(n, t);
        let c = n.XMLHttpRequestEventTarget;
        c && c.prototype && t.patchEventTarget(n, t, [c.prototype])
    }
    ),
    e.__load_patch("MutationObserver", (n,a,t)=>{
        ke("MutationObserver"),
        ke("WebKitMutationObserver")
    }
    ),
    e.__load_patch("IntersectionObserver", (n,a,t)=>{
        ke("IntersectionObserver")
    }
    ),
    e.__load_patch("FileReader", (n,a,t)=>{
        ke("FileReader")
    }
    ),
    e.__load_patch("on_property", (n,a,t)=>{
        Ct(t, n)
    }
    ),
    e.__load_patch("customElements", (n,a,t)=>{
        Pt(n, t)
    }
    ),
    e.__load_patch("XHR", (n,a)=>{
        C(n);
        let t = H("xhrTask")
          , c = H("xhrSync")
          , f = H("xhrListener")
          , _ = H("xhrScheduled")
          , E = H("xhrURL")
          , m = H("xhrErrorBeforeScheduled");
        function C(T) {
            let I = T.XMLHttpRequest;
            if (!I)
                return;
            let P = I.prototype;
            function Z(w) {
                return w[t]
            }
            let W = P[Le]
              , A = P[Ie];
            if (!W) {
                let w = T.XMLHttpRequestEventTarget;
                if (w) {
                    let k = w.prototype;
                    W = k[Le],
                    A = k[Ie]
                }
            }
            let te = "readystatechange"
              , X = "scheduled";
            function v(w) {
                let k = w.data
                  , S = k.target;
                S[_] = !1,
                S[m] = !1;
                let K = S[f];
                W || (W = S[Le],
                A = S[Ie]),
                K && A.call(S, te, K);
                let z = S[f] = ()=>{
                    if (S.readyState === S.DONE)
                        if (!k.aborted && S[_] && w.state === X) {
                            let j = S[a.__symbol__("loadfalse")];
                            if (S.status !== 0 && j && j.length > 0) {
                                let r = w.invoke;
                                w.invoke = function() {
                                    let i = S[a.__symbol__("loadfalse")];
                                    for (let s = 0; s < i.length; s++)
                                        i[s] === w && i.splice(s, 1);
                                    !k.aborted && w.state === X && r.call(w)
                                }
                                ,
                                j.push(w)
                            } else
                                w.invoke()
                        } else
                            !k.aborted && S[_] === !1 && (S[m] = !0)
                }
                ;
                return W.call(S, te, z),
                S[t] || (S[t] = w),
                U.apply(S, k.args),
                S[_] = !0,
                w
            }
            function d() {}
            function F(w) {
                let k = w.data;
                return k.aborted = !0,
                D.apply(k.target, k.args)
            }
            let q = le(P, "open", ()=>function(w, k) {
                return w[c] = k[2] == !1,
                w[E] = k[1],
                q.apply(w, k)
            }
            )
              , Y = "XMLHttpRequest.send"
              , B = H("fetchTaskAborting")
              , g = H("fetchTaskScheduling")
              , U = le(P, "send", ()=>function(w, k) {
                if (a.current[g] === !0 || w[c])
                    return U.apply(w, k);
                {
                    let S = {
                        target: w,
                        url: w[E],
                        isPeriodic: !1,
                        args: k,
                        aborted: !1
                    }
                      , K = Ve(Y, d, S, v, F);
                    w && w[m] === !0 && !S.aborted && K.state === X && K.invoke()
                }
            }
            )
              , D = le(P, "abort", ()=>function(w, k) {
                let S = Z(w);
                if (S && typeof S.type == "string") {
                    if (S.cancelFn == null || S.data && S.data.aborted)
                        return;
                    S.zone.cancelTask(S)
                } else if (a.current[B] === !0)
                    return D.apply(w, k)
            }
            )
        }
    }
    ),
    e.__load_patch("geolocation", n=>{
        n.navigator && n.navigator.geolocation && Tt(n.navigator.geolocation, ["getCurrentPosition", "watchPosition"])
    }
    ),
    e.__load_patch("PromiseRejectionEvent", (n,a)=>{
        function t(c) {
            return function(f) {
                ct(n, c).forEach(E=>{
                    let m = n.PromiseRejectionEvent;
                    if (m) {
                        let C = new m(c,{
                            promise: f.promise,
                            reason: f.rejection
                        });
                        E.invoke(C)
                    }
                }
                )
            }
        }
        n.PromiseRejectionEvent && (a[H("unhandledPromiseRejectionHandler")] = t("unhandledrejection"),
        a[H("rejectionHandledHandler")] = t("rejectionhandled"))
    }
    ),
    e.__load_patch("queueMicrotask", (n,a,t)=>{
        bt(n, t)
    }
    )
}
function Dt(e) {
    e.__load_patch("ZoneAwarePromise", (n,a,t)=>{
        let c = Object.getOwnPropertyDescriptor
          , f = Object.defineProperty;
        function _(h) {
            if (h && h.toString === Object.prototype.toString) {
                let l = h.constructor && h.constructor.name;
                return (l || "") + ": " + JSON.stringify(h)
            }
            return h ? h.toString() : Object.prototype.toString.call(h)
        }
        let E = t.symbol
          , m = []
          , C = n[E("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1
          , T = E("Promise")
          , I = E("then")
          , P = "__creationTrace__";
        t.onUnhandledError = h=>{
            if (t.showUncaughtError()) {
                let l = h && h.rejection;
                l ? console.error("Unhandled Promise rejection:", l instanceof Error ? l.message : l, "; Zone:", h.zone.name, "; Task:", h.task && h.task.source, "; Value:", l, l instanceof Error ? l.stack : void 0) : console.error(h)
            }
        }
        ,
        t.microtaskDrainDone = ()=>{
            for (; m.length; ) {
                let h = m.shift();
                try {
                    h.zone.runGuarded(()=>{
                        throw h.throwOriginal ? h.rejection : h
                    }
                    )
                } catch (l) {
                    W(l)
                }
            }
        }
        ;
        let Z = E("unhandledPromiseRejectionHandler");
        function W(h) {
            t.onUnhandledError(h);
            try {
                let l = a[Z];
                typeof l == "function" && l.call(this, h)
            } catch {}
        }
        function A(h) {
            return h && h.then
        }
        function te(h) {
            return h
        }
        function X(h) {
            return M.reject(h)
        }
        let v = E("state")
          , d = E("value")
          , F = E("finally")
          , q = E("parentPromiseValue")
          , Y = E("parentPromiseState")
          , B = "Promise.then"
          , g = null
          , U = !0
          , D = !1
          , w = 0;
        function k(h, l) {
            return o=>{
                try {
                    $(h, l, o)
                } catch (u) {
                    $(h, !1, u)
                }
            }
        }
        let S = function() {
            let h = !1;
            return function(o) {
                return function() {
                    h || (h = !0,
                    o.apply(null, arguments))
                }
            }
        }
          , K = "Promise resolved with itself"
          , z = E("currentTaskTrace");
        function $(h, l, o) {
            let u = S();
            if (h === o)
                throw new TypeError(K);
            if (h[v] === g) {
                let p = null;
                try {
                    (typeof o == "object" || typeof o == "function") && (p = o && o.then)
                } catch (R) {
                    return u(()=>{
                        $(h, !1, R)
                    }
                    )(),
                    h
                }
                if (l !== D && o instanceof M && o.hasOwnProperty(v) && o.hasOwnProperty(d) && o[v] !== g)
                    r(o),
                    $(h, o[v], o[d]);
                else if (l !== D && typeof p == "function")
                    try {
                        p.call(o, u(k(h, l)), u(k(h, !1)))
                    } catch (R) {
                        u(()=>{
                            $(h, !1, R)
                        }
                        )()
                    }
                else {
                    h[v] = l;
                    let R = h[d];
                    if (h[d] = o,
                    h[F] === F && l === U && (h[v] = h[Y],
                    h[d] = h[q]),
                    l === D && o instanceof Error) {
                        let y = a.currentTask && a.currentTask.data && a.currentTask.data[P];
                        y && f(o, z, {
                            configurable: !0,
                            enumerable: !1,
                            writable: !0,
                            value: y
                        })
                    }
                    for (let y = 0; y < R.length; )
                        i(h, R[y++], R[y++], R[y++], R[y++]);
                    if (R.length == 0 && l == D) {
                        h[v] = w;
                        let y = o;
                        try {
                            throw new Error("Uncaught (in promise): " + _(o) + (o && o.stack ? `
` + o.stack : ""))
                        } catch (O) {
                            y = O
                        }
                        C && (y.throwOriginal = !0),
                        y.rejection = o,
                        y.promise = h,
                        y.zone = a.current,
                        y.task = a.currentTask,
                        m.push(y),
                        t.scheduleMicroTask()
                    }
                }
            }
            return h
        }
        let j = E("rejectionHandledHandler");
        function r(h) {
            if (h[v] === w) {
                try {
                    let l = a[j];
                    l && typeof l == "function" && l.call(this, {
                        rejection: h[d],
                        promise: h
                    })
                } catch {}
                h[v] = D;
                for (let l = 0; l < m.length; l++)
                    h === m[l].promise && m.splice(l, 1)
            }
        }
        function i(h, l, o, u, p) {
            r(h);
            let R = h[v]
              , y = R ? typeof u == "function" ? u : te : typeof p == "function" ? p : X;
            l.scheduleMicroTask(B, ()=>{
                try {
                    let O = h[d]
                      , N = !!o && F === o[F];
                    N && (o[q] = O,
                    o[Y] = R);
                    let L = l.run(y, void 0, N && y !== X && y !== te ? [] : [O]);
                    $(o, !0, L)
                } catch (O) {
                    $(o, !1, O)
                }
            }
            , o)
        }
        let s = "function ZoneAwarePromise() { [native code] }"
          , b = function() {}
          , x = n.AggregateError;
        class M {
            static toString() {
                return s
            }
            static resolve(l) {
                return l instanceof M ? l : $(new this(null), U, l)
            }
            static reject(l) {
                return $(new this(null), D, l)
            }
            static withResolvers() {
                let l = {};
                return l.promise = new M((o,u)=>{
                    l.resolve = o,
                    l.reject = u
                }
                ),
                l
            }
            static any(l) {
                if (!l || typeof l[Symbol.iterator] != "function")
                    return Promise.reject(new x([],"All promises were rejected"));
                let o = []
                  , u = 0;
                try {
                    for (let y of l)
                        u++,
                        o.push(M.resolve(y))
                } catch {
                    return Promise.reject(new x([],"All promises were rejected"))
                }
                if (u === 0)
                    return Promise.reject(new x([],"All promises were rejected"));
                let p = !1
                  , R = [];
                return new M((y,O)=>{
                    for (let N = 0; N < o.length; N++)
                        o[N].then(L=>{
                            p || (p = !0,
                            y(L))
                        }
                        , L=>{
                            R.push(L),
                            u--,
                            u === 0 && (p = !0,
                            O(new x(R,"All promises were rejected")))
                        }
                        )
                }
                )
            }
            static race(l) {
                let o, u, p = new this((O,N)=>{
                    o = O,
                    u = N
                }
                );
                function R(O) {
                    o(O)
                }
                function y(O) {
                    u(O)
                }
                for (let O of l)
                    A(O) || (O = this.resolve(O)),
                    O.then(R, y);
                return p
            }
            static all(l) {
                return M.allWithCallback(l)
            }
            static allSettled(l) {
                return (this && this.prototype instanceof M ? this : M).allWithCallback(l, {
                    thenCallback: u=>({
                        status: "fulfilled",
                        value: u
                    }),
                    errorCallback: u=>({
                        status: "rejected",
                        reason: u
                    })
                })
            }
            static allWithCallback(l, o) {
                let u, p, R = new this((L,G)=>{
                    u = L,
                    p = G
                }
                ), y = 2, O = 0, N = [];
                for (let L of l) {
                    A(L) || (L = this.resolve(L));
                    let G = O;
                    try {
                        L.then(V=>{
                            N[G] = o ? o.thenCallback(V) : V,
                            y--,
                            y === 0 && u(N)
                        }
                        , V=>{
                            o ? (N[G] = o.errorCallback(V),
                            y--,
                            y === 0 && u(N)) : p(V)
                        }
                        )
                    } catch (V) {
                        p(V)
                    }
                    y++,
                    O++
                }
                return y -= 2,
                y === 0 && u(N),
                R
            }
            constructor(l) {
                let o = this;
                if (!(o instanceof M))
                    throw new Error("Must be an instanceof Promise.");
                o[v] = g,
                o[d] = [];
                try {
                    let u = S();
                    l && l(u(k(o, U)), u(k(o, D)))
                } catch (u) {
                    $(o, !1, u)
                }
            }
            get[Symbol.toStringTag]() {
                return "Promise"
            }
            get[Symbol.species]() {
                return M
            }
            then(l, o) {
                let u = this.constructor?.[Symbol.species];
                (!u || typeof u != "function") && (u = this.constructor || M);
                let p = new u(b)
                  , R = a.current;
                return this[v] == g ? this[d].push(R, p, l, o) : i(this, R, p, l, o),
                p
            }
            catch(l) {
                return this.then(null, l)
            }
            finally(l) {
                let o = this.constructor?.[Symbol.species];
                (!o || typeof o != "function") && (o = M);
                let u = new o(b);
                u[F] = F;
                let p = a.current;
                return this[v] == g ? this[d].push(p, u, l, l) : i(this, p, u, l, l),
                u
            }
        }
        M.resolve = M.resolve,
        M.reject = M.reject,
        M.race = M.race,
        M.all = M.all;
        let de = n[T] = n.Promise;
        n.Promise = M;
        let me = E("thenPatched");
        function he(h) {
            let l = h.prototype
              , o = c(l, "then");
            if (o && (o.writable === !1 || !o.configurable))
                return;
            let u = l.then;
            l[I] = u,
            h.prototype.then = function(p, R) {
                return new M((O,N)=>{
                    u.call(this, O, N)
                }
                ).then(p, R)
            }
            ,
            h[me] = !0
        }
        t.patchThen = he;
        function Pe(h) {
            return function(l, o) {
                let u = h.apply(l, o);
                if (u instanceof M)
                    return u;
                let p = u.constructor;
                return p[me] || he(p),
                u
            }
        }
        return de && (he(de),
        le(n, "fetch", h=>Pe(h))),
        Promise[a.__symbol__("uncaughtPromiseErrors")] = m,
        M
    }
    )
}
function Ot(e) {
    e.__load_patch("toString", n=>{
        let a = Function.prototype.toString
          , t = H("OriginalDelegate")
          , c = H("Promise")
          , f = H("Error")
          , _ = function() {
            if (typeof this == "function") {
                let T = this[t];
                if (T)
                    return typeof T == "function" ? a.call(T) : Object.prototype.toString.call(T);
                if (this === Promise) {
                    let I = n[c];
                    if (I)
                        return a.call(I)
                }
                if (this === Error) {
                    let I = n[f];
                    if (I)
                        return a.call(I)
                }
            }
            return a.call(this)
        };
        _[t] = a,
        Function.prototype.toString = _;
        let E = Object.prototype.toString
          , m = "[object Promise]";
        Object.prototype.toString = function() {
            return typeof Promise == "function" && this instanceof Promise ? m : E.call(this)
        }
    }
    )
}
function Nt(e, n, a, t, c) {
    let f = Zone.__symbol__(t);
    if (n[f])
        return;
    let _ = n[f] = n[t];
    n[t] = function(E, m, C) {
        return m && m.prototype && c.forEach(function(T) {
            let I = `${a}.${t}::` + T
              , P = m.prototype;
            try {
                if (P.hasOwnProperty(T)) {
                    let Z = e.ObjectGetOwnPropertyDescriptor(P, T);
                    Z && Z.value ? (Z.value = e.wrapWithCurrentZone(Z.value, I),
                    e._redefineProperty(m.prototype, T, Z)) : P[T] && (P[T] = e.wrapWithCurrentZone(P[T], I))
                } else
                    P[T] && (P[T] = e.wrapWithCurrentZone(P[T], I))
            } catch {}
        }),
        _.call(n, E, m, C)
    }
    ,
    e.attachOriginToPatched(n[t], _)
}
function Lt(e) {
    e.__load_patch("util", (n,a,t)=>{
        let c = Ze(n);
        t.patchOnProperties = nt,
        t.patchMethod = le,
        t.bindArguments = Fe,
        t.patchMacroTask = gt;
        let f = a.__symbol__("BLACK_LISTED_EVENTS")
          , _ = a.__symbol__("UNPATCHED_EVENTS");
        n[_] && (n[f] = n[_]),
        n[f] && (a[f] = a[_] = n[f]),
        t.patchEventPrototype = vt,
        t.patchEventTarget = kt,
        t.isIEOrEdge = mt,
        t.ObjectDefineProperty = Ae,
        t.ObjectGetOwnPropertyDescriptor = ve,
        t.ObjectCreate = dt,
        t.ArraySlice = _t,
        t.patchClass = ke,
        t.wrapWithCurrentZone = Ge,
        t.filterProperties = at,
        t.attachOriginToPatched = ue,
        t._redefineProperty = Object.defineProperty,
        t.patchCallbacks = Nt,
        t.getGlobalObjects = ()=>({
            globalSources: rt,
            zoneSymbolEventNames: ee,
            eventNames: c,
            isBrowser: Be,
            isMix: tt,
            isNode: De,
            TRUE_STR: ce,
            FALSE_STR: ae,
            ZONE_SYMBOL_PREFIX: be,
            ADD_EVENT_LISTENER_STR: He,
            REMOVE_EVENT_LISTENER_STR: xe
        })
    }
    )
}
function It(e) {
    Dt(e),
    Ot(e),
    Lt(e)
}
var lt = ht();
It(lt);
St(lt);
