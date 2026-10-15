function tn(o) {
  const e = String(o || "").trim();
  if (!/^\d+$/.test(e)) return null;
  const t = Number(e);
  return Number.isFinite(t) ? t : null;
}
function co(o) {
  if (o == null) return "";
  try {
    return o instanceof ArrayBuffer ? new TextDecoder().decode(new Uint8Array(o)) : ArrayBuffer.isView(o) ? new TextDecoder().decode(o) : String(o || "");
  } catch {
    return "";
  }
}
async function ei(o, e) {
  const t = Math.max(0, Math.floor(Number(e) || 0)), r = tn(o?.headers?.get?.("Content-Length"));
  if (Number.isFinite(r) && r > t) {
    try {
      Promise.resolve(o?.body?.cancel?.()).catch(() => {
      });
    } catch {
    }
    return {
      bodyBytes: /* @__PURE__ */ new Uint8Array(0),
      bytes: r,
      exceeded: !0
    };
  }
  if (!o?.body) return {
    bodyBytes: /* @__PURE__ */ new Uint8Array(0),
    bytes: 0,
    exceeded: !1
  };
  const a = o.body.getReader(), n = [];
  let s = 0;
  try {
    for (; ; ) {
      const { done: l, value: d } = await a.read();
      if (l) break;
      const u = d instanceof Uint8Array ? d : new Uint8Array(d || 0);
      if (s + u.byteLength > t) {
        try {
          Promise.resolve(a.cancel()).catch(() => {
          });
        } catch {
        }
        return {
          bodyBytes: /* @__PURE__ */ new Uint8Array(0),
          bytes: s + u.byteLength,
          exceeded: !0
        };
      }
      n.push(u), s += u.byteLength;
    }
  } catch {
    return {
      bodyBytes: /* @__PURE__ */ new Uint8Array(0),
      bytes: s,
      exceeded: !0
    };
  } finally {
    try {
      a.releaseLock();
    } catch {
    }
  }
  const i = new Uint8Array(s);
  let c = 0;
  for (const l of n)
    i.set(l, c), c += l.byteLength;
  return {
    bodyBytes: i,
    bytes: s,
    exceeded: !1
  };
}
async function Ne(o, e) {
  const t = await ei(o, e);
  return {
    text: t.exceeded ? "" : new TextDecoder().decode(t.bodyBytes),
    bytes: t.bytes,
    exceeded: t.exceeded
  };
}
function rn(o) {
  let e = /* @__PURE__ */ new WeakMap(), t = o(), r = t;
  return {
    get(a = null) {
      if (!a || typeof a != "object" && typeof a != "function") return t;
      let n = e.get(a);
      return n || (n = o(), e.set(a, n)), r = n, n;
    },
    current() {
      return r;
    },
    reset() {
      e = /* @__PURE__ */ new WeakMap(), t = o(), r = t;
    }
  };
}
function gl(o, e = 8192) {
  const t = Math.max(2, Math.floor(Number(e) || 8192)), r = Math.max(1, Math.min(32, Math.floor(t / 256))), a = Math.max(16, Math.min(512, Math.floor(t / Math.max(4, r * 2)))), n = 4, s = Math.max(8, Math.min(256, Math.floor(t / 32))), i = /* @__PURE__ */ new WeakSet();
  let c = 0, l = !1;
  const d = (f, m = 0) => {
    if (f == null) return f;
    if (typeof f == "string")
      return f.length <= a ? f : (l = !0, `${f.slice(0, a)}...`);
    if (typeof f == "number" || typeof f == "boolean") return f;
    if (typeof f == "bigint" || typeof f != "object") return String(f);
    if (i.has(f)) return "[Circular]";
    if (m >= n || c >= s)
      return l = !0, "[Truncated]";
    c += 1, i.add(f);
    try {
      if (Array.isArray(f)) {
        const h = [];
        for (let y = 0; y < f.length && y < r; y += 1) h.push(d(f[y], m + 1));
        return f.length > r && (l = !0, h.push("[Truncated]")), h;
      }
      const p = {};
      let g = 0;
      for (const h in f) {
        if (!Object.prototype.hasOwnProperty.call(f, h)) continue;
        if (g >= r) {
          l = !0, p._truncated = !0;
          break;
        }
        const y = h.length > a ? `${h.slice(0, a)}...` : h;
        p[y] = d(f[h], m + 1), g += 1;
      }
      return p;
    } finally {
      i.delete(f);
    }
  };
  try {
    const f = JSON.stringify(d(o));
    if (!l && f && f.length <= t) return f;
  } catch {
  }
  const u = JSON.stringify({ truncated: !0 });
  return u.length <= t ? u : "{}";
}
function ne(o = "") {
  const e = String(o || "");
  let t = 2166136261;
  for (let r = 0; r < e.length; r += 1)
    t ^= e.charCodeAt(r), t = Math.imul(t, 16777619);
  return (t >>> 0).toString(36);
}
function Yo(o = []) {
  const e = Array.isArray(o) ? o : [o];
  let t = 2166136261;
  const r = (a) => {
    for (let n = 0; n < 32; n += 8)
      t ^= a >>> n & 255, t = Math.imul(t, 16777619);
  };
  r(e.length);
  for (const a of e) {
    const n = String(a ?? "");
    r(n.length);
    for (let s = 0; s < n.length; s += 1)
      t ^= n.charCodeAt(s), t = Math.imul(t, 16777619);
  }
  return (t >>> 0).toString(36);
}
function bn(o = "") {
  const e = new TextEncoder().encode(String(o || ""));
  let t = 14695981039346656037n;
  const r = 1099511628211n;
  for (const a of e)
    t ^= BigInt(a), t = BigInt.asUintN(64, t * r);
  return t.toString(16).padStart(16, "0");
}
async function vn(o = "") {
  const e = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(o || "")));
  return [...new Uint8Array(e)].map((t) => t.toString(16).padStart(2, "0")).join("");
}
function ht(o) {
  const e = Array.isArray(o) ? o : String(o || "").split(/[\\r\\n,，;；|]+/), t = /* @__PURE__ */ new Set(), r = [];
  for (const a of e) {
    const n = String(a || "").trim();
    if (!n) continue;
    const s = n.toLowerCase();
    t.has(s) || (t.add(s), r.push(n));
  }
  return r;
}
function lo(o) {
  const e = String(o || "").trim().toLowerCase();
  if (!e) return null;
  const t = e.includes("*"), r = e.replace(/^\*\./, "").replace(/^\*+/, "").replace(/\*+$/g, "").replace(/^\.+|\.+$/g, "");
  return r ? {
    hostname: r,
    wildcard: t
  } : null;
}
function re(o) {
  return lo(o)?.hostname || "";
}
function Zt(o = []) {
  const e = Array.isArray(o) ? o : [o], t = [], r = /* @__PURE__ */ new Set();
  for (const a of e) {
    const n = String(a || "").trim();
    !n || r.has(n) || (r.add(n), t.push(n));
  }
  return t;
}
function $(o) {
  return !!o && typeof o == "object" && !Array.isArray(o);
}
function le(o, e, t, r) {
  let a;
  if (typeof o == "number") a = o;
  else if (typeof o == "string") {
    const n = o.trim();
    if (!/^-?\d+$/.test(n)) return e;
    a = Number(n);
  } else return e;
  return Number.isFinite(a) ? Math.min(r, Math.max(t, Math.floor(a))) : e;
}
function hl(o, e, t, r) {
  const a = Number(o);
  return Number.isFinite(a) ? Math.min(r, Math.max(t, a)) : e;
}
function da(o, e) {
  return !!o && typeof o == "object" && Object.prototype.hasOwnProperty.call(o, e);
}
function Pa(o) {
  return String(o || "").replace(/[\\%_]/g, "\\$&");
}
function yl(o) {
  const e = String(o || "").trim();
  return e ? /^(?:\d{1,3}\.){3}\d{1,3}$/.test(e) ? !0 : /^[0-9a-f:]+$/i.test(e) && e.includes(":") : !1;
}
function Jo(o) {
  const e = String(o || "").trim();
  return e ? /^[a-z]{3,4}$/i.test(e) : !1;
}
function Sl() {
  return {
    phase: 0,
    lastRunAt: 0,
    iterators: {
      node: null,
      playbackRoute: null,
      crypto: null,
      rate: null,
      log: null,
      playbackInfo: null,
      failover: null,
      progress: null,
      monthlyTraffic: null
    }
  };
}
function _l() {
  const o = rn(() => ({ namespaces: /* @__PURE__ */ new Map() }));
  let e = "default";
  const t = (r, a = "default") => {
    const n = String(a || "default").trim() || "default";
    let s = r.namespaces.get(n);
    return s || (s = {
      ConfigCache: null,
      RuntimeConfigCacheGeneration: 0,
      SingleFlightTasks: /* @__PURE__ */ new Map()
    }, r.namespaces.set(n, s)), e = n, s;
  };
  return {
    get(r = null, a = "default") {
      return t(o.get(r), a);
    },
    current() {
      return t(o.current(), e);
    },
    reset() {
      o.reset(), e = "default";
    }
  };
}
function bl() {
  const o = rn(() => ({
    KvDataMutationChain: Promise.resolve(),
    KvTidyMutationChain: Promise.resolve()
  }));
  return {
    get(e = null) {
      return o.get(e);
    },
    current() {
      return o.current();
    },
    reset() {
      o.reset();
    }
  };
}
function ur(o = globalThis) {
  try {
    return o?.caches?.default ?? null;
  } catch {
    return null;
  }
}
function Fn(o = globalThis) {
  return o.crypto.subtle;
}
function Qo(o) {
  return String(o || "").trim();
}
function El(o = [], e = {}) {
  const t = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ new Map();
  for (const s of o) {
    const i = Qo(s?.name) || "anonymous", c = s?.handlers && typeof s.handlers == "object" ? s.handlers : s;
    for (const [l, d] of Object.entries(c || {})) {
      if (typeof d != "function") throw new TypeError(`Admin action ${l} from ${i} is not a function`);
      if (t[l]) throw new Error(`Duplicate admin action ${l}: ${r.get(l)} and ${i}`);
      t[l] = d, r.set(l, i);
    }
  }
  const a = Object.freeze({ ...e.aliases });
  for (const [s, i] of Object.entries(a)) if (!t[i]) throw new Error(`Admin action alias ${s} targets missing action ${i}`);
  for (const s of e.requiredActions || []) if (!t[s]) throw new Error(`Missing required admin action ${s}`);
  const n = Object.freeze({ ...t });
  return Object.freeze({
    handlers: n,
    names: Object.freeze(Object.keys(n).sort()),
    resolve(s) {
      const i = Qo(s);
      return n[a[i] || i] || null;
    }
  });
}
function Tl(o) {
  function e(r, a = null) {
    if (typeof r != "function") {
      const i = r;
      return (c) => e(c, i);
    }
    const n = o.get(a), s = n.KvDataMutationChain.catch(() => null).then(() => r());
    return n.KvDataMutationChain = s.catch(() => null), s;
  }
  function t(r, a = null) {
    if (typeof r != "function") {
      const i = r;
      return (c) => t(c, i);
    }
    const n = o.get(a), s = n.KvTidyMutationChain.catch(() => null).then(() => e(r, a));
    return n.KvTidyMutationChain = s.catch(() => null), s;
  }
  return Object.freeze({
    runDataMutation: e,
    runTidyMutation: t
  });
}
function Rl() {
  return rn(() => ({
    LogQueue: [],
    LogDedupe: /* @__PURE__ */ new Map(),
    LogFlushPending: !1,
    LogFlushTask: null,
    LogClearEpochMs: 0,
    LogLastFlushAt: 0,
    runtimeConfig: null
  }));
}
function dr(o = "") {
  return String(o || "").trim().toLowerCase().split(";", 1)[0].trim();
}
function an(o = "") {
  const e = dr(o);
  return e === "application/json" || e === "text/json" || /^application\/[a-z0-9!#$&^_.+-]+\+json$/i.test(e);
}
function ti(o = "") {
  const e = dr(o);
  return e === "text/html" || e === "application/xhtml+xml";
}
function Al(o = "", e = "text/html") {
  const t = dr(e);
  if (!ti(t)) return !1;
  const [r, a] = t.split("/", 2);
  let n = -1, s = 0;
  for (const i of String(o || "").split(",")) {
    const [c, ...l] = i.split(";"), [d, u] = dr(c).split("/", 2);
    let f = -1;
    if (d === r && u === a ? f = 2 : d === r && u === "*" ? f = 1 : d === "*" && u === "*" && (f = 0), f < n || f < 0) continue;
    let m = 1;
    for (const p of l) {
      const [g, h] = p.split("=", 2);
      if (String(g || "").trim().toLowerCase() !== "q") continue;
      const y = String(h || "").trim();
      m = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(y) ? Number(y) : 0;
      break;
    }
    f > n && (n = f, s = m);
  }
  return s > 0;
}
var Cl = Object.freeze({
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  409: "Conflict",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout"
});
function Un(o, e, t = {}) {
  const r = e?.response, a = Math.max(400, Number(t.status) || 502), n = String(t.statusText || Cl[a] || "Error").trim(), s = new Headers(r?.headers || {});
  [
    "Accept-Ranges",
    "Content-Disposition",
    "Content-Encoding",
    "Content-Length",
    "Content-MD5",
    "Content-Range",
    "Digest",
    "ETag",
    "Last-Modified",
    "Location",
    "Refresh",
    "Set-Cookie",
    "Transfer-Encoding"
  ].forEach((d) => s.delete(d)), s.set("Content-Type", "application/json; charset=utf-8"), s.set("Cache-Control", "no-store"), s.delete("X-Proxy-Mime-Guard"), s.delete("X-Proxy-Contract-Guard");
  const i = String(t.guardHeader || "").trim(), c = String(t.guardValue || "").trim();
  i && c && s.set(i, c);
  const l = {
    error: String(t.error || n || "Error"),
    code: a,
    message: String(t.message || "The API response did not satisfy the proxy contract."),
    ...t.details && typeof t.details == "object" && !Array.isArray(t.details) ? { details: t.details } : {}
  };
  try {
    Promise.resolve(r?.body?.cancel?.()).catch(() => {
    });
  } catch {
  }
  return o && typeof o == "object" && (o.proxyGuardState = c), {
    ...e,
    response: new Response(o?.requestMethod === "HEAD" ? null : JSON.stringify(l), {
      status: a,
      statusText: n,
      headers: s
    })
  };
}
function wl(o, e, t = {}) {
  const r = e?.response;
  if (!r || o?.requestTraits?.isApiRequest !== !0 || r.status === 101 || r.status === 204 || r.status === 205 || r.status === 304) return e;
  const a = typeof t.sanitizePath == "function" ? t.sanitizePath : (l) => String(l || "/"), n = r.headers.get("Content-Type");
  if ((o?.requestMethod === "GET" || o?.requestMethod === "HEAD") && a(o?.proxyPath || "/") === "/" && Al(o?.request?.headers?.get("Accept"), n) || !ti(n)) return e;
  const s = typeof t.buildErrorState == "function" ? t.buildErrorState : Un, i = Number(r.status) || 0, c = i >= 400;
  return s(o, e, {
    status: c ? i : void 0,
    statusText: c && String(r.statusText || "").trim() || void 0,
    message: "Upstream API returned an HTML document instead of API data.",
    guardHeader: "X-Proxy-Mime-Guard",
    guardValue: "html-document",
    details: {
      upstreamStatus: r.status,
      contentType: dr(n) || "missing"
    }
  });
}
var Ll = "playback-info", ri = /* @__PURE__ */ new WeakSet();
function uo(o) {
  if (!o || typeof o != "object" || Array.isArray(o)) return !1;
  const e = Object.getPrototypeOf(o);
  return e === Object.prototype || e === null;
}
function nn(o = "") {
  let e;
  try {
    e = JSON.parse(String(o || ""));
  } catch {
    return null;
  }
  return uo(e) ? e : null;
}
function fo({ response: o, bodyText: e, bodyBytes: t, payload: r }) {
  if (!o || !uo(r)) return null;
  const a = Object.freeze({
    contract: Ll,
    response: o,
    bodyText: String(e || ""),
    bodyBytes: Math.max(0, Number(t) || 0),
    payload: r
  });
  return ri.add(a), a;
}
function rr(o) {
  return ri.has(o) && o?.contract === "playback-info" && !!o.response && typeof o.bodyText == "string" && Number.isFinite(o.bodyBytes) && o.bodyBytes >= 0 && uo(o.payload);
}
function En(o, e) {
  return Object.freeze({
    kind: "invalid",
    reason: e,
    details: Object.freeze({
      reason: e,
      upstreamStatus: Number(o?.status) || 0,
      contentType: dr(o?.headers?.get?.("Content-Type")) || "missing"
    })
  });
}
var Nl = 256 * 1024;
async function Dl(o, e = {}) {
  const t = String(e.requestMethod || "GET").toUpperCase();
  if (!o || !(o.status >= 200 && o.status < 300) || t === "HEAD" || o.status === 204 || o.status === 205 || !o.body) return Object.freeze({ kind: "skip" });
  if (!an(o.headers.get("Content-Type"))) return En(o, "unsupported_content_type");
  const r = Number(e.maxBytes), a = Number.isFinite(r) && r > 0 ? Math.floor(r) : Nl, n = await Ne(o.clone(), a);
  if (n.exceeded) return En(o, Number(n.bytes) > a ? "body_too_large" : "body_read_failed");
  const s = nn(n.text);
  return s ? Object.freeze({
    kind: "valid",
    representation: fo({
      response: o,
      bodyText: n.text,
      bodyBytes: n.bytes,
      payload: s
    })
  }) : En(o, "invalid_root_object");
}
function mo(o) {
  const e = o instanceof Headers ? new Headers(o) : new Headers(o || {});
  return [
    "Content-Encoding",
    "Content-Length",
    "Content-MD5",
    "Digest",
    "ETag",
    "Transfer-Encoding"
  ].forEach((t) => e.delete(t)), e.set("Content-Type", "application/json; charset=utf-8"), e;
}
function Ba(o) {
  if (typeof o != "string") return o;
  const e = o.trim();
  if (!e || !e.startsWith("{") && !e.startsWith("[")) return o;
  try {
    return JSON.parse(e);
  } catch {
    return o;
  }
}
function po(o) {
  const e = Ba(o);
  if (!Array.isArray(e)) return {
    items: [],
    changed: !0
  };
  let t = e !== o;
  const r = [];
  for (const a of e) {
    const n = Ba(a);
    if (!n || typeof n != "object" || Array.isArray(n)) {
      t = !0;
      continue;
    }
    n !== a && (t = !0), r.push(n);
  }
  return {
    items: r,
    changed: t
  };
}
function ai(o) {
  let e = o, t = !1;
  const r = (a, n) => {
    e === o && (e = { ...o }), e[a] = n, t = !0;
  };
  for (const a of ["MediaStreams", "MediaAttachments"]) {
    if (!Object.prototype.hasOwnProperty.call(o, a)) continue;
    const n = po(o[a]);
    n.changed && r(a, n.items);
  }
  if (Object.prototype.hasOwnProperty.call(o, "RequiredHttpHeaders")) {
    const a = Ba(o.RequiredHttpHeaders);
    !a || typeof a != "object" || Array.isArray(a) ? r("RequiredHttpHeaders", {}) : a !== o.RequiredHttpHeaders && r("RequiredHttpHeaders", a);
  }
  return {
    mediaSource: e,
    changed: t
  };
}
function go(o) {
  if (!o || typeof o != "object" || Array.isArray(o) || !Object.prototype.hasOwnProperty.call(o, "MediaSources")) return {
    payload: o,
    rewriteState: "not_needed"
  };
  const e = po(o.MediaSources);
  let t = e.changed;
  const r = e.items.map((a) => {
    const n = ai(a);
    return n.changed && (t = !0), n.mediaSource;
  });
  return t ? {
    payload: {
      ...o,
      MediaSources: r
    },
    rewriteState: "applied"
  } : {
    payload: o,
    rewriteState: "not_needed"
  };
}
function ni(o, e = {}) {
  const t = go(o), r = t.payload;
  if (!r || typeof r != "object" || Array.isArray(r) || !Array.isArray(r.MediaSources)) return {
    payload: o,
    rewriteState: "not_needed"
  };
  const a = typeof e.buildProxyUrl == "function" ? e.buildProxyUrl : () => "";
  let n = t.rewriteState === "applied";
  const s = r.MediaSources.map((i) => {
    let c = i;
    const l = (p, g, h = {}) => {
      const y = Object.prototype.hasOwnProperty.call(c, p);
      h.onlyIfPresent === !0 && !y || c[p] === g && !(h.ensurePresent === !0 && !y) || (c === i && (c = { ...i }), c[p] = g, n = !0);
    }, d = String(i.DirectStreamUrl || "").trim(), u = String(i.Path || "").trim(), f = d || u, m = f ? a(f) : "";
    return m ? (l("DirectStreamUrl", m, { ensurePresent: !0 }), l("Path", m, { ensurePresent: !0 })) : l("Path", "", { ensurePresent: !0 }), l("IsRemote", !1, { ensurePresent: !0 }), l("Protocol", "Http", { ensurePresent: !0 }), l("SupportsTranscoding", !1, { ensurePresent: !0 }), l("TranscodingUrl", "", { ensurePresent: !0 }), l("TranscodingSubProtocol", "", { onlyIfPresent: !0 }), l("TranscodingContainer", "", { onlyIfPresent: !0 }), l("TranscodingType", "", { onlyIfPresent: !0 }), c;
  });
  return n ? {
    payload: {
      ...r,
      MediaSources: s
    },
    rewriteState: "applied"
  } : {
    payload: o,
    rewriteState: "not_needed"
  };
}
function Il(o, e = {}) {
  if (!rr(o)) return {
    kind: "invalid",
    reason: "invalid_representation"
  };
  const t = e.rewriteEnabled === !0 ? ni(o.payload, { buildProxyUrl: e.buildProxyUrl }) : go(o.payload);
  if (t.rewriteState !== "applied") return {
    kind: "valid",
    representation: o,
    rewriteState: e.rewriteEnabled === !0 ? "not_needed" : "passthrough"
  };
  const r = JSON.stringify(t.payload), a = new TextEncoder().encode(r).byteLength, n = o.response;
  try {
    Promise.resolve(n.body?.cancel?.()).catch(() => {
    });
  } catch {
  }
  return {
    kind: "valid",
    representation: fo({
      response: new Response(r, {
        status: n.status,
        statusText: n.statusText,
        headers: mo(n.headers)
      }),
      bodyText: r,
      bodyBytes: a,
      payload: t.payload
    }),
    rewriteState: "applied"
  };
}
var Ml = new TextEncoder();
function kn(o) {
  return Ml.encode(String(o || "")).byteLength;
}
function oi(o, e) {
  const t = Number(o?.status);
  if (!(t >= 200 && t < 300) || t === 204 || t === 205) return null;
  let r;
  try {
    r = new Headers(Array.isArray(o?.headers) ? o.headers : []);
  } catch {
    return null;
  }
  if (!an(r.get("Content-Type"))) return null;
  const a = String(o.bodyText || ""), n = kn(a), s = Number(e);
  if (Number.isFinite(s) && s > 0 && n > s) return null;
  const i = nn(a);
  return i ? {
    headers: r,
    bodyText: a,
    bodyBytes: n,
    payload: i
  } : null;
}
var Pl = class {
  constructor(o = {}) {
    if (!(o.entries instanceof Map)) throw new TypeError("PlaybackInfoCacheStore requires a Map");
    this.entries = o.entries, this.now = typeof o.now == "function" ? o.now : Date.now, this.maxEntries = Math.max(1, Number(o.maxEntries) || 1), this.maxEntryBytes = Math.max(1, Number(o.maxEntryBytes) || 1), this.maxTotalBytes = Math.max(1, Number(o.maxTotalBytes) || 1);
  }
  cleanup(o = this.now()) {
    for (const [t, r] of this.entries) {
      const a = Number(r?.expiresAt) || 0;
      a > 0 && a <= o && this.entries.delete(t);
    }
    for (; this.entries.size > this.maxEntries; ) {
      const t = this.entries.keys().next().value;
      if (!t) break;
      this.entries.delete(t);
    }
    let e = 0;
    for (const t of this.entries.values()) {
      const r = Number(t?.bodyBytes), a = Number.isFinite(r) && r > 0 ? r : kn(t?.bodyText);
      t.bodyBytes = a, e += a;
    }
    for (; this.entries.size > 0 && e > this.maxTotalBytes; ) {
      const t = this.entries.keys().next().value;
      if (!t) break;
      const r = this.entries.get(t);
      e -= Number(r?.bodyBytes) || 0, this.entries.delete(t);
    }
  }
  set(o, e, t = {}) {
    if (!o || !rr(e)) return !1;
    const r = e.response;
    if (!(r.status >= 200 && r.status < 300) || r.status === 204 || r.status === 205 || !an(r.headers.get("Content-Type"))) return !1;
    const a = kn(e.bodyText);
    if (a > this.maxEntryBytes || !nn(e.bodyText)) return !1;
    const n = Math.max(0, Number(t.ttlMs) || 0);
    if (n <= 0) return !1;
    const s = mo(r.headers);
    s.delete("Set-Cookie");
    const i = this.now();
    return this.entries.delete(o), this.entries.set(o, {
      nodeName: String(t.nodeName || "").trim().toLowerCase(),
      nodeRevision: String(t.nodeRevision || "").trim(),
      playbackInfoRewrite: String(t.playbackInfoRewrite || "").trim(),
      status: r.status,
      statusText: r.statusText,
      headers: [...s.entries()],
      bodyText: e.bodyText,
      bodyBytes: a,
      storedAt: i,
      expiresAt: i + n
    }), this.cleanup(i), !0;
  }
  get(o) {
    if (!o) return null;
    this.cleanup();
    const e = this.entries.get(o);
    if (!e) return null;
    const t = oi(e, this.maxEntryBytes);
    if (!t)
      return this.entries.delete(o), null;
    let r;
    try {
      r = new Response(t.bodyText, {
        status: Number(e.status) || 200,
        statusText: String(e.statusText || ""),
        headers: t.headers
      });
    } catch {
      return this.entries.delete(o), null;
    }
    const a = fo({
      response: r,
      bodyText: t.bodyText,
      bodyBytes: t.bodyBytes,
      payload: t.payload
    });
    return this.entries.delete(o), this.entries.set(o, {
      ...e,
      bodyBytes: t.bodyBytes
    }), {
      representation: a,
      metadata: e
    };
  }
};
function xl() {
  return {
    NodeCache: /* @__PURE__ */ new Map(),
    PlaybackRouteHotCache: /* @__PURE__ */ new Map(),
    NodesListCache: null,
    NodesRevisionCache: null,
    NodesIndexCache: null,
    NodesRevisionCacheGeneration: 0,
    NodeCacheResetGeneration: 0,
    NodeCacheGenerationNonce: 0,
    NodeCacheGenerationEvictionEpoch: 0,
    NodeCacheGenerations: /* @__PURE__ */ new Map(),
    SingleFlightTasks: /* @__PURE__ */ new Map(),
    NodeIndexMutationChain: Promise.resolve(),
    CleanupIterators: {
      node: null,
      playbackRoute: null
    },
    CleanupState: Sl()
  };
}
var yt = rn(xl), Se = (o = null) => yt.get(o), ar = Rl(), Ka = _l(), Hn = bl(), { runDataMutation: er, runTidyMutation: Ol } = Tl(Hn), te = {
  ProxyFailoverStateCache: /* @__PURE__ */ new Map(),
  CryptoKeyCache: /* @__PURE__ */ new Map(),
  PlaybackInfoResponseCache: /* @__PURE__ */ new Map(),
  PlaybackProgressRelay: /* @__PURE__ */ new Map(),
  MetadataPrewarmTasks: /* @__PURE__ */ new Map(),
  TmdbLookupCache: /* @__PURE__ */ new Map(),
  MedbItemsCountsCache: /* @__PURE__ */ new Map(),
  DashboardMonthlyTrafficCache: /* @__PURE__ */ new Map(),
  SingleFlightTasks: /* @__PURE__ */ new Map(),
  AdminRemoteShellCacheMutationChains: /* @__PURE__ */ new Map(),
  LogsReadinessProbeCache: /* @__PURE__ */ new WeakMap(),
  ProxyAccessRuleProfileCache: /* @__PURE__ */ new WeakMap()
};
for (const o of [
  "NodeCache",
  "PlaybackRouteHotCache",
  "NodesListCache",
  "NodesRevisionCache",
  "NodesIndexCache",
  "NodesRevisionCacheGeneration",
  "NodeCacheResetGeneration",
  "NodeCacheGenerationNonce",
  "NodeCacheGenerationEvictionEpoch",
  "NodeCacheGenerations"
]) Object.defineProperty(te, o, {
  enumerable: !0,
  configurable: !1,
  get: () => yt.current()[o],
  set: (e) => {
    yt.current()[o] = e;
  }
});
for (const o of ["ConfigCache", "RuntimeConfigCacheGeneration"]) Object.defineProperty(te, o, {
  enumerable: !0,
  configurable: !1,
  get: () => Ka.current()[o],
  set: (e) => {
    Ka.current()[o] = e;
  }
});
var We = {
  LogQueue: [],
  LogDedupe: /* @__PURE__ */ new Map(),
  RateLimitCache: /* @__PURE__ */ new Map(),
  LogFlushPending: !1,
  LogFlushTask: null,
  LogClearEpochMs: 0,
  LogLastFlushAt: 0,
  OpsStatusWriteChain: Promise.resolve(),
  NodeIndexMutationChain: Promise.resolve(),
  InitCheckWarnedFingerprints: /* @__PURE__ */ new Set(),
  TmdbCredentialOverrideWarned: !1
};
for (const o of ["CleanupState"]) Object.defineProperty(We, o, {
  enumerable: !0,
  configurable: !1,
  get: () => yt.current()[o],
  set: (e) => {
    yt.current()[o] = e;
  }
});
for (const o of ["KvDataMutationChain", "KvTidyMutationChain"]) Object.defineProperty(We, o, {
  enumerable: !0,
  configurable: !1,
  get: () => Hn.current()[o],
  set: (e) => {
    Hn.current()[o] = e;
  }
});
var J = {
  D1SchemaReadyState: /* @__PURE__ */ new WeakMap(),
  D1DatabaseInitReady: /* @__PURE__ */ new WeakMap(),
  LogsBaseDbReady: /* @__PURE__ */ new WeakMap(),
  StatsHourlyDbReady: /* @__PURE__ */ new WeakMap(),
  DnsIpWorkspaceDbReady: /* @__PURE__ */ new WeakMap(),
  OpsStatusDbReady: /* @__PURE__ */ new WeakMap(),
  OpsStatusShadowCache: /* @__PURE__ */ new WeakMap(),
  AdminShellStatusWriteState: /* @__PURE__ */ new WeakMap(),
  ScheduledLeaseDbReady: /* @__PURE__ */ new WeakMap(),
  AuthFailuresDbReady: /* @__PURE__ */ new WeakMap(),
  CfDashboardCacheDbReady: /* @__PURE__ */ new WeakMap(),
  CfRuntimeCacheDbReady: /* @__PURE__ */ new WeakMap()
};
function vl(o) {
  const e = {}, t = {};
  for (const r of o) for (const a of Object.keys(r)) t[a] = {
    enumerable: !0,
    configurable: !1,
    get: () => r[a],
    set: (n) => {
      r[a] = n;
    }
  };
  return Object.defineProperties(e, t);
}
var Fl = vl([
  te,
  We,
  J
]);
function se(o, e = "unknown_error") {
  const t = String(o?.message || "").trim();
  return t || String(o || "").trim() || e;
}
function De(o, e = 500) {
  const t = Number(o);
  if (Number.isFinite(t) && t >= 400 && t <= 599) return Math.floor(t);
  const r = Number(e);
  return Number.isFinite(r) && r >= 400 && r <= 599 ? Math.floor(r) : 500;
}
function on(o) {
  if (!o || typeof o != "object") return !1;
  const e = String(o?.code || "").trim(), t = Number(o?.status);
  return !!e || Number.isFinite(t) && t >= 400 && t <= 599;
}
function Ul(o, e = {}) {
  const t = De(e?.status, 500), r = String(e?.code || "INTERNAL_ERROR").trim().toUpperCase() || "INTERNAL_ERROR", a = String(e?.message || "Server Error").trim() || "Server Error", n = on(o);
  return {
    status: n ? De(o?.status, t) : t,
    code: n && String(o?.code || r).trim().toUpperCase() || r,
    message: n && String(o?.message || a).trim() || a,
    details: n && o?.details !== void 0 ? o.details : e?.details !== void 0 ? e.details : null
  };
}
function si(o = "get", e = {}, t = "unknown_error") {
  const r = $(e) ? e : {}, a = {
    dependency: "KV",
    operation: String(o || "").trim().toLowerCase() === "list" ? "list" : "get",
    reason: String(t || "unknown_error").trim() || "unknown_error"
  }, n = String(r.key || "").trim(), s = String(r.prefix || "").trim();
  return n && (a.key = n), s && (a.prefix = s), we("KV_READ_FAILED", "KV 读取异常", 503, a);
}
function ho(o) {
  return on(o) && String(o?.code || "").trim().toUpperCase() === "KV_READ_FAILED" && String(o?.details?.dependency || "").trim().toUpperCase() === "KV";
}
function kl(o, e = "INTERNAL_ERROR", t = "Server Error", r = "admin.read.kv_read_failed") {
  if (!ho(o)) return o;
  const a = we(e, t, 503, { ...$(o?.details) ? o.details : {} });
  return Ae(r, a, a.details), a;
}
function wt(o, e, t, r = "admin.read") {
  if (!ho(o)) return o;
  const a = String(o?.details?.operation || "").trim().toLowerCase() === "list" ? "list" : "get";
  return kl(o, e, t, `${String(r || "admin.read").trim() || "admin.read"}.kv_${a}_failed`);
}
function Ae(o, e, t = null, r = "warn") {
  const a = r === "error" ? "error" : "warn", n = String(o || "runtime_failure").trim() || "runtime_failure", s = $(t) ? { ...t } : {}, i = String(e?.code || "").trim(), c = Number(e?.status);
  i && (s.errorCode = i), Number.isFinite(c) && (s.errorStatus = Math.floor(c)), Object.keys(s).length > 0 ? console[a](`[${n}] ${se(e)}`, s) : console[a](`[${n}] ${se(e)}`);
}
async function pe(o, e, t = null, r = null) {
  try {
    return await o;
  } catch (a) {
    return Ae(e, a, t), r;
  }
}
function we(o = "CONFIG_INVALID", e = "配置无效", t = 400, r = null) {
  const a = new Error(String(e || "配置无效"));
  return a.code = String(o || "CONFIG_INVALID"), a.status = De(t, 400), r != null && (a.details = r), a;
}
function $t(o) {
  return o ? o.name === "AbortError" ? !0 : String(o.message || "").toLowerCase().includes("abort") : !1;
}
var ii = 4 * 1024 * 1024, sn = 64 * 1024, ci = Object.freeze({
  "Referrer-Policy": "origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=15552000; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block"
}), ia = Object.freeze({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Emby-Authorization, X-Emby-Token, X-Emby-Client, X-Emby-Device-Id, X-Emby-Device-Name, X-Emby-Client-Version, X-MediaBrowser-Authorization, X-MediaBrowser-Token"
});
function Ur(o, e) {
  const t = o.get("Vary");
  if (!t) {
    o.set("Vary", e);
    return;
  }
  const r = t.split(",").map((a) => a.trim()).filter(Boolean);
  r.includes(e) || r.push(e), o.set("Vary", r.join(", "));
}
function Ce(o) {
  return Object.entries(ci).forEach(([e, t]) => o.set(e, t)), o;
}
function ee(o) {
  return Array.isArray(o) || $(o) ? JSON.stringify(o) : o === void 0 ? "" : JSON.stringify(o);
}
var H = () => Date.now(), li = (o) => new Promise((e) => setTimeout(e, Math.max(0, Number(o) || 0)));
function Hl(o) {
  let e = !1, t = () => {
  };
  const r = setTimeout(() => {
    e || (e = !0, t(!0));
  }, Math.max(0, Number(o) || 0));
  return {
    promise: new Promise((a) => {
      t = a;
    }),
    cancel() {
      return e ? !1 : (e = !0, clearTimeout(r), t(!1), !0);
    }
  };
}
var $l = Object.freeze({
  JwtExpiry: 3600 * 24 * 30,
  LoginLockDuration: 900,
  MaxLoginAttempts: 5
}), Mt = Object.freeze({
  CacheTTL: 6e4,
  NodeMissCacheTtlMs: 1e3,
  CryptoKeyCacheTTL: 86400,
  CryptoKeyCacheMax: 100,
  NodeCacheMax: 512,
  PlaybackRouteHotCacheTtlMs: 86400 * 1e3,
  PlaybackRouteHotCacheMax: 256,
  NodesRevisionCacheTtlMs: 1e3,
  NodesReadConcurrency: 12,
  CacheTtlImagesDays: 30,
  PingCacheMinutes: 10,
  PlaybackInfoCacheTtlSec: 60,
  PlaybackInfoCacheMax: 64,
  PlaybackInfoCacheEntryMaxBytes: 256 * 1024,
  PlaybackInfoCacheTotalMaxBytes: 4 * 1024 * 1024,
  VideoProgressForwardIntervalSec: 3,
  VideoProgressForwardSessionMax: 128,
  VideoProgressSnapshotMaxBytes: 32 * 1024,
  RateLimitCacheMax: 4096,
  D1SchemaReadyTtlMs: 600 * 1e3,
  OpsStatusReadCacheTtlMs: 15 * 1e3,
  AdminShellStatusStableWriteIntervalMs: 300 * 1e3,
  CleanupBudgetMs: 1,
  CleanupChunkSize: 64,
  CleanupMinIntervalMs: 1e3
}), Bl = Object.freeze({
  EnableHostPrefixProxy: !1,
  MultiLinkCopyPanelEnabled: !1,
  DashboardShowD1WriteHotspot: !1,
  DashboardShowKvD1Status: !1,
  UiRadiusPx: 10,
  NodePanelPingAutoSort: !1
}), Kl = Object.freeze({
  LogRetentionDays: 7,
  LogRetentionDaysMax: 365,
  LogFlushDelayMinutes: 20,
  LogFlushCountThreshold: 100,
  LogBatchChunkSize: 50,
  LogBatchRetryCount: 2,
  LogBatchRetryBackoffMs: 75,
  LogQueryDefaultDays: 1,
  LogKeywordMaxWindowDays: 3,
  LogSearchMode: "fts",
  LogWriteMode: "info",
  LogVacuumMinIntervalMs: 10080 * 60 * 1e3,
  LogFtsRebuildMinIntervalMs: 10080 * 60 * 1e3,
  KvTidyIntervalMs: 3600 * 1e3,
  TgAlertDroppedBatchThreshold: 0,
  TgAlertFlushRetryThreshold: 0,
  TgAlertCooldownMinutes: 30,
  TgAlertOnScheduledFailure: !1,
  TgAlertKvUsageEnabled: !1,
  TgAlertKvUsageThresholdPercent: 80,
  TgAlertD1UsageEnabled: !1,
  TgAlertD1UsageThresholdPercent: 80,
  LogQueueMax: 512,
  LogQueueOverflowDropCount: 256,
  LogDedupeMax: 2048,
  LogDedupeTrimTarget: 1024
}), zl = Object.freeze({
  ScheduledLeaseMinMs: 30 * 1e3,
  ScheduledLeaseMs: 300 * 1e3,
  ScheduleUtcOffsetMinutes: 480,
  TgDailyReportSummaryEnabled: !1,
  TgDailyReportKvEnabled: !1,
  TgDailyReportD1Enabled: !1,
  TgDailyReportClockTimes: ["09:00"]
}), Ke = Object.freeze({
  PingTimeoutMs: 1e4,
  HedgeFailoverEnabled: !1,
  HedgeProbePreferGet: !0,
  HedgeProbePath: "/emby/system/ping",
  HedgeProbeTimeoutMs: 2500,
  HedgeProbeParallelism: 2,
  HedgeWaitTimeoutMs: 3e3,
  HedgeLockTtlMs: 5e3,
  HedgePreferredTtlSec: 300,
  HedgeFailureCooldownSec: 30,
  HedgeWakeJitterMs: 200,
  UpstreamTimeoutMs: 8e3,
  UpstreamRetryAttempts: 0,
  ProxyStreamIdleTimeoutMs: 15e3,
  ProxyPlaylistIdleTimeoutMs: 12e3,
  BufferedRetryBodyMaxBytes: 256 * 1024,
  PrewarmCacheTtl: 120,
  MetadataPrewarmTimeoutMs: 3e3,
  PrewarmPrefetchBytes: 4 * 1024 * 1024,
  DefaultPlaybackInfoMode: "passthrough",
  DefaultRealClientIpMode: "forward",
  DefaultMediaAuthMode: "auto"
}), Wl = Object.freeze({
  DnsHistoryLimit: 5,
  DnsIpProbeCacheTtlSec: 600,
  DnsIpProbeTimeoutMs: 2500,
  DnsIpProbeConcurrency: 4,
  DnsIpWorkspaceSyncProbeLimit: 2,
  DnsIpSourceConcurrency: 4,
  DnsIpSourceFetchMaxBytes: 2 * 1024 * 1024,
  DnsIpSourceIpLimit: 5
}), Gl = Object.freeze({
  CfQuotaPlanCacheMinutes: 60,
  CfQuotaPlanOverride: ""
}), jl = Object.freeze({
  AssetHash: "v19.6",
  Version: "19.6"
}), Vl = Object.freeze({
  ...$l,
  ...Mt,
  ...Bl,
  ...Kl,
  ...zl,
  ...Ke,
  ...Wl,
  ...Gl,
  ...jl
}), k = Object.freeze({ Defaults: Vl });
function Oe(o) {
  return le(o, k.Defaults.ScheduleUtcOffsetMinutes, -720, 840);
}
function fa(o = "", e = "00:00") {
  const t = String(e || "00:00").trim() || "00:00", r = String(o || "").trim().match(/^(\d{1,2}):(\d{1,2})$/);
  if (!r) return t;
  const a = Number(r[1]), n = Number(r[2]);
  return !Number.isInteger(a) || a < 0 || a > 23 || !Number.isInteger(n) || n < 0 || n > 59 ? t : `${String(a).padStart(2, "0")}:${String(n).padStart(2, "0")}`;
}
function Nt(o = [], e = []) {
  const t = Array.isArray(o) ? o : String(o || "").split(/[\r\n,]+/), r = [], a = /* @__PURE__ */ new Set();
  for (const n of t) {
    const s = fa(n, "");
    !s || a.has(s) || (a.add(s), r.push(s));
  }
  return r.sort((n, s) => Lr(n) - Lr(s)), r.length ? r : [...new Set((Array.isArray(e) ? e : [e]).map((n) => fa(n, "")).filter(Boolean))].sort((n, s) => Lr(n) - Lr(s));
}
function Lr(o = "") {
  const e = fa(o, "");
  if (!e) return -1;
  const [t, r] = e.split(":");
  return (Number(t) || 0) * 60 + (Number(r) || 0);
}
function ql(o = "") {
  const e = String(o || "").trim().match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})$/);
  return e ? {
    dateKey: e[1],
    clockTime: fa(e[2], "")
  } : {
    dateKey: "",
    clockTime: ""
  };
}
function Xl(o, e = k.Defaults.ScheduleUtcOffsetMinutes) {
  const t = Oe(e), r = o.getUTCFullYear(), a = String(o.getUTCMonth() + 1).padStart(2, "0"), n = String(o.getUTCDate()).padStart(2, "0"), s = String(o.getUTCHours()).padStart(2, "0"), i = String(o.getUTCMinutes()).padStart(2, "0"), c = String(o.getUTCSeconds()).padStart(2, "0"), l = String(o.getUTCMilliseconds()).padStart(3, "0"), d = t >= 0 ? "+" : "-", u = Math.abs(t);
  return `${r}-${a}-${n}T${s}:${i}:${c}.${l}${d}${String(Math.floor(u / 60)).padStart(2, "0")}:${String(u % 60).padStart(2, "0")}`;
}
function Ca(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes) {
  const t = Oe(e), r = t * 60 * 1e3, a = o instanceof Date ? new Date(o.getTime()) : new Date(o), n = a.getTime() + r, s = new Date(n), i = s.getUTCFullYear(), c = String(s.getUTCMonth() + 1).padStart(2, "0"), l = String(s.getUTCDate()).padStart(2, "0"), d = String(s.getUTCHours()).padStart(2, "0"), u = String(s.getUTCMinutes()).padStart(2, "0"), f = String(s.getUTCSeconds()).padStart(2, "0"), m = String(s.getUTCMilliseconds()).padStart(3, "0"), p = Number(d), g = Number(u);
  return {
    now: a,
    shiftedDate: s,
    utcOffsetMinutes: t,
    offsetLabel: yo(t),
    dateKey: `${i}-${c}-${l}`,
    clockTime: `${d}:${u}`,
    hour: p,
    minute: g,
    second: Number(f),
    millisecond: Number(m),
    minuteOfDay: p * 60 + g,
    localIso: Xl(s, t)
  };
}
function Zo(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes) {
  return Ca(o, e).localIso;
}
function ot(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes) {
  return Ca(o, e);
}
function st(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes, t = "") {
  const r = Ca(o, e), a = fa(t || r.clockTime, r.clockTime), n = Lr(a), s = Date.UTC(r.shiftedDate.getUTCFullYear(), r.shiftedDate.getUTCMonth(), r.shiftedDate.getUTCDate()) - r.utcOffsetMinutes * 60 * 1e3, i = s + 1440 * 60 * 1e3 - 1, c = s + Math.max(0, n) * 60 * 1e3;
  return {
    ...r,
    normalizedClockTime: a,
    plannedMinuteOfDay: n,
    plannedTs: c,
    plannedSlotKey: `${r.dateKey} ${a}`,
    startTs: s,
    endTs: i
  };
}
function Yl(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes) {
  const t = ot(o, e);
  return {
    ...t,
    slotKey: `${t.dateKey} ${t.clockTime}`
  };
}
function yo(o = k.Defaults.ScheduleUtcOffsetMinutes) {
  const e = Oe(o), t = e >= 0 ? "+" : "-", r = Math.abs(e);
  return `UTC${t}${String(Math.floor(r / 60)).padStart(2, "0")}:${String(r % 60).padStart(2, "0")}`;
}
function Jl(o = {}, e = "") {
  const t = o?.fixedQueue && typeof o.fixedQueue == "object" ? o.fixedQueue : {};
  let r = String(t.localDateKey || "").trim(), a = Nt(t.executedSlots || [], []);
  if (!r) {
    const n = ql(o?.lastPlannedSlot || "");
    n.dateKey && n.dateKey === e && (r = n.dateKey, a = Nt([...a, n.clockTime], []));
  }
  return !e || r !== e ? {
    localDateKey: e,
    executedSlots: []
  } : {
    localDateKey: r,
    executedSlots: a
  };
}
function Ql(o = {}, e = [], t = k.Defaults.ScheduleUtcOffsetMinutes, r = /* @__PURE__ */ new Date()) {
  const a = Ca(r, t), n = Nt(e, []), s = Jl(o, a.dateKey);
  if (!n.length) return {
    due: !1,
    context: a,
    normalizedClockTimes: n,
    fixedQueue: s,
    dueSlots: [],
    reason: "no_clock_times_configured"
  };
  const i = new Set(Nt(s.executedSlots || [], [])), c = n.filter((d) => Lr(d) <= a.minuteOfDay), l = c.filter((d) => !i.has(d));
  return l.length ? {
    due: !0,
    context: a,
    normalizedClockTimes: n,
    fixedQueue: s,
    dueSlots: l,
    reason: "clock_slots_due"
  } : {
    due: !1,
    context: a,
    normalizedClockTimes: n,
    fixedQueue: s,
    dueSlots: [],
    reason: c.length ? "slot_already_processed" : "time_not_matched"
  };
}
function Bt(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "inherit" ? "inherit" : e === "emby" ? "emby" : e === "jellyfin" ? "jellyfin" : e === "passthrough" ? "passthrough" : "auto";
}
function Nr(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "inherit" ? "inherit" : e === "forward" ? "forward" : e === "strip" ? "strip" : e === "disable" || e === "none" ? "disable" : "forward";
}
function Dr(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "inherit" ? "inherit" : e === "rewrite" ? "rewrite" : e === "passthrough" ? "passthrough" : "inherit";
}
function nr(o = "") {
  return String(o || "").trim().toLowerCase() === "host_prefix" ? "host_prefix" : "kv_route";
}
function Ye(o = "") {
  return nr(o) === "host_prefix";
}
function ui(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "emby" ? "emby" : e === "jellyfin" ? "jellyfin" : e === "passthrough" ? "passthrough" : "auto";
}
function Gt(o = "") {
  return String(o || "").trim().toLowerCase() === "rewrite" ? "rewrite" : k.Defaults.DefaultPlaybackInfoMode;
}
function So(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "strip" ? "strip" : e === "disable" || e === "none" ? "disable" : "forward";
}
function kr(o) {
  return le(o, k.Defaults.DnsIpSourceIpLimit, 1, 1e3);
}
function cn(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "direct" ? "direct" : e === "proxy" ? "proxy" : "inherit";
}
function Hr(o = {}) {
  return cn(o?.mainVideoStreamMode ?? o?.wangpanDirectMode ?? o?.wangpanMode);
}
function $r(o = [], e = "") {
  const t = Array.isArray(o) ? o : String(o || "").split(/[,，\r\n]+/), r = [], a = /* @__PURE__ */ new Set();
  for (const n of [...t, e]) {
    const s = String(n || "").trim().slice(0, 24), i = s.toLowerCase();
    if (!(!s || a.has(i)) && (a.add(i), r.push(s), r.length >= 20))
      break;
  }
  return r;
}
var $n = /\b(?:(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)|[0-9a-f:]{2,})\b/gi, di = {
  AKL: {
    cityName: "Auckland",
    countryCode: "NZ",
    countryName: "新西兰"
  },
  AMS: {
    cityName: "Amsterdam",
    countryCode: "NL",
    countryName: "荷兰"
  },
  ARN: {
    cityName: "Stockholm",
    countryCode: "SE",
    countryName: "瑞典"
  },
  ATL: {
    cityName: "Atlanta",
    countryCode: "US",
    countryName: "美国"
  },
  BKK: {
    cityName: "Bangkok",
    countryCode: "TH",
    countryName: "泰国"
  },
  BOM: {
    cityName: "Mumbai",
    countryCode: "IN",
    countryName: "印度"
  },
  CDG: {
    cityName: "Paris",
    countryCode: "FR",
    countryName: "法国"
  },
  CGK: {
    cityName: "Jakarta",
    countryCode: "ID",
    countryName: "印度尼西亚"
  },
  CPH: {
    cityName: "Copenhagen",
    countryCode: "DK",
    countryName: "丹麦"
  },
  DEL: {
    cityName: "Delhi",
    countryCode: "IN",
    countryName: "印度"
  },
  DFW: {
    cityName: "Dallas",
    countryCode: "US",
    countryName: "美国"
  },
  DOH: {
    cityName: "Doha",
    countryCode: "QA",
    countryName: "卡塔尔"
  },
  DXB: {
    cityName: "Dubai",
    countryCode: "AE",
    countryName: "阿联酋"
  },
  EWR: {
    cityName: "Newark",
    countryCode: "US",
    countryName: "美国"
  },
  FRA: {
    cityName: "Frankfurt",
    countryCode: "DE",
    countryName: "德国"
  },
  GRU: {
    cityName: "Sao Paulo",
    countryCode: "BR",
    countryName: "巴西"
  },
  HKG: {
    cityName: "Hong Kong",
    countryCode: "HK",
    countryName: "中国香港"
  },
  HND: {
    cityName: "Tokyo",
    countryCode: "JP",
    countryName: "日本"
  },
  IAD: {
    cityName: "Ashburn",
    countryCode: "US",
    countryName: "美国"
  },
  ICN: {
    cityName: "Seoul",
    countryCode: "KR",
    countryName: "韩国"
  },
  JNB: {
    cityName: "Johannesburg",
    countryCode: "ZA",
    countryName: "南非"
  },
  KIX: {
    cityName: "Osaka",
    countryCode: "JP",
    countryName: "日本"
  },
  KUL: {
    cityName: "Kuala Lumpur",
    countryCode: "MY",
    countryName: "马来西亚"
  },
  LAX: {
    cityName: "Los Angeles",
    countryCode: "US",
    countryName: "美国"
  },
  LHR: {
    cityName: "London",
    countryCode: "GB",
    countryName: "英国"
  },
  MAD: {
    cityName: "Madrid",
    countryCode: "ES",
    countryName: "西班牙"
  },
  MEL: {
    cityName: "Melbourne",
    countryCode: "AU",
    countryName: "澳大利亚"
  },
  MIA: {
    cityName: "Miami",
    countryCode: "US",
    countryName: "美国"
  },
  MNL: {
    cityName: "Manila",
    countryCode: "PH",
    countryName: "菲律宾"
  },
  MXP: {
    cityName: "Milan",
    countryCode: "IT",
    countryName: "意大利"
  },
  NRT: {
    cityName: "Tokyo",
    countryCode: "JP",
    countryName: "日本"
  },
  ORD: {
    cityName: "Chicago",
    countryCode: "US",
    countryName: "美国"
  },
  OSL: {
    cityName: "Oslo",
    countryCode: "NO",
    countryName: "挪威"
  },
  PHX: {
    cityName: "Phoenix",
    countryCode: "US",
    countryName: "美国"
  },
  PRG: {
    cityName: "Prague",
    countryCode: "CZ",
    countryName: "捷克"
  },
  SAN: {
    cityName: "San Diego",
    countryCode: "US",
    countryName: "美国"
  },
  SCL: {
    cityName: "Santiago",
    countryCode: "CL",
    countryName: "智利"
  },
  SEA: {
    cityName: "Seattle",
    countryCode: "US",
    countryName: "美国"
  },
  SFO: {
    cityName: "San Francisco",
    countryCode: "US",
    countryName: "美国"
  },
  SIN: {
    cityName: "Singapore",
    countryCode: "SG",
    countryName: "新加坡"
  },
  SJC: {
    cityName: "San Jose",
    countryCode: "US",
    countryName: "美国"
  },
  SYD: {
    cityName: "Sydney",
    countryCode: "AU",
    countryName: "澳大利亚"
  },
  TPE: {
    cityName: "Taipei",
    countryCode: "TW",
    countryName: "中国台湾"
  },
  VIE: {
    cityName: "Vienna",
    countryCode: "AT",
    countryName: "奥地利"
  },
  WAW: {
    cityName: "Warsaw",
    countryCode: "PL",
    countryName: "波兰"
  },
  YUL: {
    cityName: "Montreal",
    countryCode: "CA",
    countryName: "加拿大"
  },
  YVR: {
    cityName: "Vancouver",
    countryCode: "CA",
    countryName: "加拿大"
  },
  YYZ: {
    cityName: "Toronto",
    countryCode: "CA",
    countryName: "加拿大"
  }
}, es = Object.freeze((() => {
  const o = {};
  for (const e of Object.values(di)) {
    const t = String(e?.countryCode || "").trim().toUpperCase(), r = String(e?.countryName || "").trim();
    !t || !r || o[t] || (o[t] = r);
  }
  return o.CN = o.CN || "中国", o.HK = o.HK || "中国香港", o.MO = o.MO || "中国澳门", o.TW = o.TW || "中国台湾", o;
})()), ta = null;
function wa(o = "") {
  const e = String(o || "").trim();
  if (!e || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(e)) return !1;
  const t = e.split(".");
  return t.length === 4 && t.every((r) => {
    const a = Number(r);
    return Number.isInteger(a) && a >= 0 && a <= 255;
  });
}
function Zl(o = "") {
  if (!wa(o)) return !1;
  const [e = 0, t = 0] = String(o || "").trim().split(".").map((r) => Number(r));
  return e === 10 || e === 127 || e === 169 && t === 254 || e === 172 && t >= 16 && t <= 31 ? !0 : e === 192 && t === 168;
}
function ln(o = "") {
  const e = String(o || "").trim();
  if (!e || !e.includes(":") || /\s/.test(e)) return !1;
  try {
    return new URL(`http://[${e}]/`), !0;
  } catch {
    return !1;
  }
}
function fi(o = "") {
  return String(o || "").trim().toUpperCase() === "IPV6" ? "IPv6" : "IPv4";
}
function qe(o = "") {
  return ln(o) ? "IPv6" : wa(o) ? "IPv4" : "";
}
function _o(o = "", e = {}) {
  const t = String(o || ""), r = /* @__PURE__ */ new Set(), a = [], n = Number(e?.limit), s = Number.isFinite(n) && n > 0 ? Math.max(1, Math.floor(n)) : Number.POSITIVE_INFINITY, i = (l) => {
    const d = String(l || "").trim();
    if (!d) return !1;
    const u = qe(d);
    if (!u) return !1;
    const f = d.toLowerCase();
    return r.has(f) ? !1 : (r.add(f), a.push({
      ip: d,
      ipType: u
    }), a.length >= s);
  };
  $n.lastIndex = 0;
  let c = null;
  for (; (c = $n.exec(t)) !== null && !i(c[0]); ) ;
  return a;
}
function eu(o = null) {
  const e = Array.isArray(o?.Answer) ? o.Answer : [], t = /* @__PURE__ */ new Set(), r = [];
  for (const a of e) {
    const n = String(a?.data || "").trim(), s = qe(n);
    if (!s) continue;
    const i = n.toLowerCase();
    t.has(i) || (t.add(i), r.push({
      ip: n,
      ipType: s
    }));
  }
  return r;
}
function Tn(o = "") {
  return String(o || "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'");
}
function tu(o = "") {
  const e = /* @__PURE__ */ new Map(), t = String(o || ""), r = t.match(/\[[0-9a-f:]{2,}\]/gi) || [];
  for (const n of r) {
    const s = String(n || "").replace(/^\[|\]$/g, "").trim();
    qe(s) && e.set(s.toLowerCase(), s);
  }
  const a = t.match($n) || [];
  for (const n of a) {
    const s = String(n || "").trim();
    qe(s) && e.set(s.toLowerCase(), s);
  }
  return [...e.values()];
}
function ru(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "联通" ? "联通" : e === "电信" ? "电信" : e === "移动" ? "移动" : e === "多线" ? "多线" : e === "ipv6" ? "ipv6" : "";
}
function ts(o = "", e = "") {
  const t = ru(e);
  return t ? String(o || "").trim().toLowerCase() === t.toLowerCase() : !0;
}
function au(o = "", e = "") {
  const t = /* @__PURE__ */ new Map(), r = (s, i = "") => {
    const c = String(s || "").trim(), l = qe(c);
    if (!l || Zl(c)) return;
    const d = c.toLowerCase(), u = Br(i), f = t.get(d);
    if (!f) {
      t.set(d, {
        ip: c,
        ipType: l,
        lineLabel: u
      });
      return;
    }
    !Br(f?.lineLabel) && u && t.set(d, {
      ...f,
      lineLabel: u
    });
  }, a = String(o || ""), n = a.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const s of n) {
    const i = s.match(/<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi) || [];
    if (i.length < 3) continue;
    const c = Tn(String(i[1] || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!ts(c, e)) continue;
    const l = tu(Tn(String(i[2] || "").replace(/<[^>]+>/g, " "))).find((d) => qe(d)) || "";
    l && r(l, c);
  }
  if (!t.size) {
    const s = Tn(a.replace(/<[^>]+>/g, `
`)), i = /(?:^|\n)\s*(?:\d+\s+)?(电信|联通|移动|多线|ipv6)\s+((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-f0-9]{1,4}:){2,}[a-f0-9:]{1,39})/gi;
    let c = null;
    for (; (c = i.exec(s)) !== null; )
      ts(c[1], e) && r(c[2], c[1]);
  }
  return [...t.values()];
}
function nu(o = "", e = {}) {
  return _o(o, e);
}
function ou(o = "") {
  const e = String(o || "").trim().toUpperCase(), t = di[e];
  return e ? t ? {
    coloCode: e,
    cityName: String(t.cityName || e),
    countryCode: String(t.countryCode || "UNKNOWN"),
    countryName: String(t.countryName || "未知")
  } : {
    coloCode: e,
    cityName: e,
    countryCode: "UNKNOWN",
    countryName: "未知"
  } : {
    coloCode: "",
    cityName: "",
    countryCode: "UNKNOWN",
    countryName: "未知"
  };
}
function su(o = "") {
  const e = String(o || "").trim().toUpperCase();
  if (!e || e === "UNKNOWN") return "未知";
  if (es[e]) return es[e];
  try {
    if (ta === null && (ta = typeof Intl?.DisplayNames == "function" ? new Intl.DisplayNames(["zh-CN"], { type: "region" }) : !1), ta && typeof ta.of == "function") {
      const t = String(ta.of(e) || "").trim();
      if (t) return t;
    }
  } catch {
  }
  return e;
}
function mi(o = "") {
  const e = String(o || "").trim();
  if (!e) return "";
  const t = e.match(/-([A-Za-z]{3,4})$/);
  return t ? String(t[1] || "").trim().toUpperCase() : "";
}
function iu(o = "") {
  return `dns-ip-source-${ne(o || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`)}`;
}
function bt(o = "") {
  return String(o || "").trim().toLowerCase() === "domain" ? "domain" : "url";
}
var pi = Object.freeze([Object.freeze({
  id: "all",
  label: "麒麟优选",
  sourceType: "url",
  url: "https://api.uouin.com/cloudflare.html"
}), Object.freeze({
  id: "preferred",
  label: "CF-SPEED-DNS优选",
  sourceType: "url",
  url: "https://raw.githubusercontent.com/ZhiXuanWang/cf-speed-dns/refs/heads/main/ipTop10.html"
})]), gi = Object.freeze([
  Object.freeze({
    id: "wetest_ipv4",
    label: "Wetest IPv4 API",
    sourceType: "url",
    url: "https://www.wetest.vip/api/cf2dns/get_cloudflare_ip?key=o1zrmHAF&type=v4"
  }),
  Object.freeze({
    id: "wetest_ipv6",
    label: "Wetest IPv6 API",
    sourceType: "url",
    url: "https://www.wetest.vip/api/cf2dns/get_cloudflare_ip?key=o1zrmHAF&type=v6"
  }),
  Object.freeze({
    id: "vps789_ip_api",
    label: "VPS789 优选IP API",
    sourceType: "url",
    url: "https://hhhhh.eu.org/vps789.txt"
  }),
  Object.freeze({
    id: "164746_source",
    label: "164746源",
    sourceType: "url",
    url: "https://ip.164746.xyz/"
  }),
  Object.freeze({
    id: "haogege_source",
    label: "haogege源",
    sourceType: "url",
    url: "https://hhhhh.eu.org/haogege.txt"
  }),
  Object.freeze({
    id: "bestcf_source",
    label: "bestcf源",
    sourceType: "url",
    url: "https://raw.githubusercontent.com/hubbylei/bestcf/main/bestcf.txt"
  })
]), cu = Object.freeze([
  Object.freeze({
    label: "CM优选域名集合",
    url: "https://cf.090227.xyz/"
  }),
  Object.freeze({
    label: "NB优选",
    url: "https://www.byoip.top/"
  }),
  Object.freeze({
    label: "VPS789 域名优选",
    url: "https://vps789.com/cfip/?remarks=domain"
  })
]), lu = Object.freeze([Object.freeze({
  label: "VPS789 优选IP",
  url: "https://vps789.com/cfip/"
}), Object.freeze({
  label: "Wetest IPv4 优选",
  url: "https://www.wetest.vip/page/cloudflare/address_v4.html"
})]);
function uu(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "builtin" ? "builtin" : e === "preset" ? "preset" : "custom";
}
function hi(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "preferred" ? "preferred" : e === "all" ? "all" : "";
}
function du(o = "") {
  return String(o || "").trim().toLowerCase().replace(/[^a-z0-9_:-]+/g, "_");
}
function fu(o = "") {
  const e = hi(o);
  return pi.find((t) => t.id === e) || null;
}
function mu(o = "") {
  const e = du(o);
  return e && gi.find((t) => t.id === e) || null;
}
function _r() {
  return {
    builtInSourceOptions: pi.map((o) => ({
      id: o.id,
      label: o.label,
      sourceType: o.sourceType,
      value: "domain" in o ? o.domain : o.url
    })),
    presetList: gi.map((o) => ({
      id: o.id,
      label: o.label,
      sourceType: o.sourceType,
      value: "domain" in o ? o.domain : o.url
    })),
    preferredDomainLinks: cu.map((o) => ({ ...o })),
    preferredIpLinks: lu.map((o) => ({ ...o }))
  };
}
function Br(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e.includes("联通") ? "联通" : e.includes("电信") ? "电信" : e.includes("移动") ? "移动" : e.includes("多线") ? "多线" : e.includes("ipv6") ? "ipv6" : "";
}
function yi(o = {}) {
  const e = uu(o?.sourceKind || o?.source_kind || ""), t = e === "builtin" ? fu(o?.builtinId || o?.builtin_id || o?.presetId || o?.preset_id || o?.name) : null, r = e === "preset" ? mu(o?.presetId || o?.preset_id || o?.builtinId || o?.builtin_id || o?.name) : null, a = t || r || null, n = bt(a?.sourceType || o?.sourceType || o?.source_type || ""), s = a && "url" in a ? a.url : "", i = a && "domain" in a ? a.domain : "", c = String(s || o?.url || "").trim(), l = re(i || o?.domain || ""), d = String(o?.name || a?.label || "").trim();
  return {
    sourceKind: e,
    builtinId: t?.id || "",
    presetId: r?.id || "",
    name: d,
    sourceType: n,
    url: c,
    domain: l,
    resolvedLabel: String(a?.label || "").trim()
  };
}
function Si(o = {}) {
  const e = yi(o);
  return bt(e.sourceType) === "domain" ? re(e.domain || "") : String(e.url || "").trim();
}
function or(o = {}) {
  return !!Si(o);
}
function fr(o = {}, e = {}) {
  const t = String(o?.ip || o?.content || "").trim(), r = qe(t);
  if (!t || !r) return null;
  const a = String(e.updatedAt || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()), n = String(o?.sourceKind || o?.source_kind || e.sourceKind || "manual").trim().toLowerCase() || "manual", s = String(o?.sourceLabel || o?.source_label || e.sourceLabel || "").trim(), i = Br(o?.lineLabel || o?.line_label || e.lineLabel || ""), c = String(o?.remark || "").trim();
  return {
    id: String(o?.id || `dns-ip-${ne(t.toLowerCase())}`),
    ip: t,
    ipType: r,
    sourceKind: n,
    sourceLabel: s,
    lineLabel: i,
    remark: c,
    createdAt: String(o?.createdAt || o?.created_at || e.createdAt || a),
    updatedAt: a
  };
}
function Dt(o = {}, e = 0) {
  const t = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), r = yi(o), a = r.sourceKind, n = bt(r.sourceType), s = String(r.builtinId || o?.builtinId || o?.builtin_id || "").trim(), i = String(r.presetId || o?.presetId || o?.preset_id || "").trim(), c = String(r.resolvedLabel || "").trim(), l = String(r.url || "").trim(), d = re(r.domain || ""), u = n === "domain" ? d : l, f = String(o?.name || c || "").trim(), m = o?.enabled, p = m == null ? !0 : !(m === !1 || m === 0 || String(m).trim() === "0");
  return {
    id: String(o?.id || iu(`${a}|${s}|${i}|${n}|${u}|${e}`)),
    name: f || c || `抓取源 ${Number(e) + 1}`,
    url: l,
    domain: d,
    sourceType: n,
    sourceKind: a,
    presetId: i,
    builtinId: s,
    enabled: p,
    sortOrder: Math.max(0, Number.parseInt(String(o?.sortOrder ?? o?.sort_order ?? e), 10) || 0),
    ipLimit: kr(o?.ipLimit ?? o?.ip_limit),
    lastFetchAt: String(o?.lastFetchAt || o?.last_fetch_at || ""),
    lastFetchStatus: String(o?.lastFetchStatus || o?.last_fetch_status || ""),
    lastFetchCount: Math.max(0, Number(o?.lastFetchCount ?? o?.last_fetch_count) || 0),
    createdAt: String(o?.createdAt || o?.created_at || t),
    updatedAt: String(o?.updatedAt || o?.updated_at || t)
  };
}
function mr(o = []) {
  const e = [], t = /* @__PURE__ */ new Map();
  for (const r of Array.isArray(o) ? o : []) {
    const a = fr(r);
    if (!a) continue;
    const n = String(a.ip || "").trim().toLowerCase();
    if (!n) continue;
    const s = t.get(n);
    if (s === void 0) {
      t.set(n, e.length), e.push(a);
      continue;
    }
    const i = e[s];
    i && !Br(i.lineLabel) && Br(a.lineLabel) && (e[s] = {
      ...i,
      lineLabel: a.lineLabel
    });
  }
  return e;
}
function pu(o = {}) {
  const e = fr(o);
  return e ? {
    ...e,
    probeStatus: "pending",
    latencyMs: null,
    cfRay: "",
    coloCode: "",
    cityName: "",
    countryCode: "UNKNOWN",
    countryName: "未知",
    probedAt: ""
  } : null;
}
function bo(o = []) {
  return mr(o).map((e) => pu(e)).filter(Boolean);
}
function un(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "success" ? "success" : e === "failed" ? "failed" : "empty";
}
function _i(o = {}, e = {}) {
  const t = Dt(e), r = mr(o?.items || []).slice(0, kr(t?.ipLimit)), a = un(o?.status || (r.length ? "success" : "empty"));
  return {
    id: String(o?.id || t?.id || ""),
    name: String(o?.name || t?.name || ""),
    sourceType: bt(o?.sourceType || t?.sourceType || ""),
    status: a,
    count: Math.max(0, Number(o?.count) || r.length),
    items: r,
    error: a === "failed" ? String(o?.error || "") : "",
    lastFetchAt: String(o?.lastFetchAt || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString())
  };
}
function bi(o = []) {
  return (Array.isArray(o) ? o : []).map((e) => {
    const t = _i(e, e), r = bo(t?.items || []);
    return {
      id: String(t?.id || ""),
      name: String(t?.name || ""),
      sourceType: bt(t?.sourceType || ""),
      status: un(t?.status),
      count: Math.max(0, Number(t?.count) || r.length),
      items: r,
      error: String(t?.error || ""),
      lastFetchAt: String(t?.lastFetchAt || "")
    };
  });
}
function gu(o = []) {
  const e = Array.isArray(o) ? o : [];
  return e.length ? e.some((t) => un(t?.status) !== "failed") : !0;
}
function za(o) {
  const e = Number(o) || 0;
  return !Number.isFinite(e) || e <= 0 ? "" : new Date(e).toISOString();
}
function Fa(o = [], e = k.Defaults.DnsIpSourceFetchMaxBytes) {
  return ne(ee({
    maxBytes: le(e, k.Defaults.DnsIpSourceFetchMaxBytes, 1024, 8 * 1024 * 1024),
    enabledSources: (Array.isArray(o) ? o : []).map((t, r) => Dt(t, r)).filter((t) => t.enabled === !0 && or(t)).map((t) => ({
      id: String(t.id || ""),
      name: String(t.name || ""),
      sourceType: bt(t.sourceType),
      target: Si(t),
      ipLimit: kr(t.ipLimit),
      enabled: t.enabled !== !1
    }))
  }));
}
function hu(o = "") {
  return String(o || "").trim().toLowerCase() === "shared_snapshot" ? "shared_snapshot" : "local_pool";
}
function Ei(o = []) {
  const e = [], t = /* @__PURE__ */ new Set();
  for (const r of Array.isArray(o) ? o : []) {
    const a = String(r?.ip || r || "").trim();
    if (!qe(a)) continue;
    const n = a.toLowerCase();
    t.has(n) || (t.add(n), e.push(a));
  }
  return {
    normalizedIps: e,
    deleteKeySet: t
  };
}
function rs(o = [], e = /* @__PURE__ */ new Set()) {
  const t = [], r = [];
  for (const a of mr(o)) {
    const n = String(a?.ip || "").trim();
    if (n) {
      if (e.has(n.toLowerCase())) {
        r.push(a);
        continue;
      }
      t.push(a);
    }
  }
  return {
    keptItems: t,
    removedItems: r
  };
}
function yu(o = {}, e = []) {
  const { deleteKeySet: t } = Ei(e), r = mr(o?.items || []), a = Array.isArray(o?.sourceResults) ? o.sourceResults : [];
  if (!t.size) return {
    deletedCount: 0,
    deletedIps: [],
    items: r,
    sourceResults: a
  };
  const { keptItems: n, removedItems: s } = rs(r, t), i = new Set(s.map((l) => String(l?.ip || "").trim().toLowerCase()).filter(Boolean)), c = a.map((l) => {
    const { keptItems: d } = rs(l?.items || [], i), u = un(l?.status) === "failed" ? "failed" : d.length ? "success" : "empty";
    return {
      id: String(l?.id || ""),
      name: String(l?.name || ""),
      sourceType: bt(l?.sourceType || l?.source_type || ""),
      status: u,
      count: d.length,
      items: d,
      error: u === "failed" ? String(l?.error || "") : "",
      lastFetchAt: String(l?.lastFetchAt || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString())
    };
  });
  return {
    deletedCount: s.length,
    deletedIps: s.map((l) => String(l?.ip || "").trim()).filter(Boolean),
    items: n,
    sourceResults: c
  };
}
function Ua(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "ok" ? "ok" : e === "pending" ? "pending" : e === "cf_header_missing" ? "cf_header_missing" : e === "non_cloudflare" ? "non_cloudflare" : e === "timeout" ? "timeout" : "network_error";
}
function Rn(o = []) {
  const e = Array.isArray(o) ? o : [], t = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
  let a = 0, n = 0;
  for (const s of e) {
    fi(s?.ipType || s?.ip_type || s?.type || "") === "IPv6" ? n += 1 : a += 1;
    const i = String(s?.countryCode || s?.country_code || "").trim().toUpperCase(), c = String(s?.coloCode || s?.colo_code || "").trim().toUpperCase();
    i && t.add(i), c && r.add(c);
  }
  return {
    ipCount: e.length,
    ipv4Count: a,
    ipv6Count: n,
    countryCount: t.size,
    coloCount: r.size
  };
}
function Su(o = [], e = []) {
  const t = Array.isArray(o) ? o : [], r = Array.isArray(e) ? e : [];
  return {
    currentHost: Rn(t),
    sharedPool: Rn(r),
    combined: Rn([...t, ...r])
  };
}
function _u(o = "") {
  const e = String(o || "").trim().toLowerCase();
  if (!e) return "";
  const t = e.endsWith(".") ? e.slice(0, -1) : e;
  return !t || t.length > 253 || t.endsWith(".") || /\s|[:/@*?#\\]/.test(t) || wa(t) || ln(t) || t.split(".").some((r) => !La(r)) ? "" : t;
}
function ze(o) {
  return _u(o?.HOST);
}
function Kr(o) {
  return re(o?.LEGACY_HOST);
}
function bu(o) {
  const e = ze(o), t = Kr(o), r = Eo(t, e);
  return r?.prefix ? {
    name: String(r.prefix || "").trim().toLowerCase(),
    reservedBy: t,
    reason: "legacy_host",
    legacyHost: t,
    host: e
  } : null;
}
function ma(o, e) {
  const t = re(o), r = re(e);
  return !t || !r ? !1 : t === r || t.endsWith(`.${r}`);
}
function La(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return !e || e.length > 63 ? !1 : /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(e);
}
function jt(o = "") {
  const e = String(o || "").trim().toLowerCase().replace(/\.+$/, "");
  return !e || e.length > 253 || /\s|[:/@*]/.test(e) || wa(e) || ln(e) || e.split(".").some((t) => !La(t)) ? "" : e;
}
function Ti(o = "") {
  const e = String(o || "").trim();
  return !e || jt(e) ? "" : "CNAME 指向必须是合法主机名，不能包含协议、端口、路径、通配符、空格或 IP 地址";
}
function Eu(o = "", e = "defaultHostPrefixCnameTarget") {
  const t = Ti(o);
  if (t)
    throw we("HOST_PREFIX_CNAME_TARGET_INVALID", t, 400, {
      field: e,
      value: String(o || "").trim()
    });
}
function Wa(o = null, e = {}, t = "") {
  return jt(o?.hostPrefixCnameTarget) || jt(e?.defaultHostPrefixCnameTarget) || re(t);
}
function Eo(o = "", e = "") {
  const t = re(o), r = re(e);
  if (!t || !r || t === r) return null;
  const a = `.${r}`;
  if (!t.endsWith(a)) return null;
  const n = t.slice(0, -a.length);
  return !n || n.includes(".") || !La(n) ? null : {
    hostname: t,
    host: r,
    prefix: n
  };
}
function Ri(o) {
  const e = String(o || "").trim();
  if (!e) return null;
  const t = e.indexOf("/"), r = t === -1 ? e : e.slice(0, t), a = t === -1 ? "" : e.slice(t), n = lo(r);
  return n ? {
    ...n,
    path: a,
    pattern: e
  } : null;
}
function To(o, e = {}) {
  const t = String(e.path || "");
  let r = 0;
  return e.wildcard || (r += 100), o.includes(".workers.dev") && (r -= 20), t === "/" || t === "/*" ? r += 20 : t.endsWith("*") ? r += 10 : t && (r += 4), r += o.split(".").length * 4, r -= Math.min(t.length, 30), r;
}
var Tu = "https://admin-local-index.invalid", Ru = "local-", Au = "sys:admin_index_upload:v1:", Cu = "sys:admin_index_active:v2";
function Ir(o = "") {
  const e = String(o || "").trim();
  if (!e) return "";
  try {
    const t = new URL(e);
    return ["http:", "https:"].includes(t.protocol) ? t.toString() : "";
  } catch {
    return "";
  }
}
function wu(o = "") {
  const e = String(o || "").trim();
  return !(!e || /[\x00-\x20~^:?*[\\\]]/.test(e) || e.includes("..") || e.includes("@{") || e.includes("//") || e.startsWith("/") || e.endsWith("/") || e.endsWith(".") || e.endsWith(".lock"));
}
function mt(o = "") {
  const e = String(o || "").trim();
  return wu(e) ? e : "";
}
function Lt(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return /^[a-f0-9]{64}$/.test(e) ? e : "";
}
function zr(o = "") {
  const e = Lt(o);
  return e ? `${Tu}/${e}/index.html` : "";
}
function Je(o = "") {
  const e = Ir(o);
  if (!e) return "";
  try {
    const t = new URL(e);
    return t.origin !== "https://admin-local-index.invalid" || t.search || t.hash ? "" : Lt(t.pathname.match(/^\/([a-f0-9]{64})\/index\.html$/i)?.[1] || "");
  } catch {
    return "";
  }
}
function Ro(o = "") {
  const e = Lt(o);
  return e ? `${Ru}${e}` : "";
}
function Lu(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e.startsWith("local-") ? Lt(e.slice(6)) : "";
}
function pt(o = null, e = {}) {
  const t = Ir(($(e) ? e : {}).indexUrl), r = Je(t), a = !!r, n = a ? zr(r) : "";
  return {
    effectiveRef: r,
    effectiveRefType: a ? "local_upload" : "",
    configIndexUrl: t,
    envIndexUrl: "",
    indexUrl: n,
    persistedIndexUrl: n,
    indexUrlSource: a ? "local_upload" : "unset",
    isLocalUpload: a,
    localUploadRevision: r,
    assetRevision: a ? Ro(r) : "",
    hasGithubRelease: !1,
    hasLocalUpload: a,
    hasDerivedIndexUrl: !1,
    gateState: n ? "shell_ready" : "setup_required"
  };
}
function Nu(o = {}) {
  const e = String($(o) && o.indexUrl || "").trim();
  if (!(!e || Je(e)))
    throw we("ADMIN_INDEX_SOURCE_UPLOAD_ONLY", "管理台 HTML 仅支持本地上传，请通过启动门或 Worker 和 HTML 更新面板提交 index.html", 400, { field: "indexUrl" });
}
function Ai(o = {}, e = null) {
  const t = String(e?.HOST || "").trim(), r = ze(e), a = String(o?.cfZoneId || "").trim(), n = String(o?.cfApiToken || "").trim(), s = [], i = [];
  return t ? r || i.push("HOST") : s.push("HOST"), a || s.push("cfZoneId"), n || s.push("cfApiToken"), {
    host: r,
    cfZoneId: a,
    cfApiToken: n,
    missingFields: s,
    invalidFields: i
  };
}
function Ci(o = {}) {
  if (!(!Array.isArray(o?.invalidFields) || !o.invalidFields.includes("HOST")))
    throw we("HOST_PREFIX_HOST_INVALID", "HOST 必须是合法 DNS 主机名，不能包含协议、用户信息、端口、路径、通配符、下划线、空标签或 IP 地址", 400, {
      field: "HOST",
      reason: "invalid_hostname"
    });
}
function Du(o = {}, e = null) {
  if (o?.enableHostPrefixProxy !== !0) return;
  const t = Ai(o, e);
  if (Ci(t), !(t.missingFields.length <= 0))
    throw we("HOST_PREFIX_PROXY_CONFIG_REQUIRED", "启用域名前缀代理前，必须先配置 HOST、Cloudflare Zone ID 和 API 令牌", 400, {
      missingFields: t.missingFields,
      host: t.host
    });
}
function ca(o = {}, e = null) {
  const t = Ai(o, e);
  if (Ci(t), t.missingFields.length <= 0) return t;
  throw we("HOST_PREFIX_DNS_CONFIG_REQUIRED", "保存域名前缀节点前，必须先配置 HOST、Cloudflare Zone ID 和 API 令牌", 400, {
    missingFields: t.missingFields,
    host: t.host
  });
}
function An(o = [], e = {}, t = null) {
  return (Array.isArray(o) ? o : [o]).some((r) => Ye(r?.nextNode?.entryMode)) ? ca(e, t) : null;
}
var Iu = Ke.PingTimeoutMs, Mu = Ke.UpstreamTimeoutMs, Bn = Ke.UpstreamRetryAttempts, wi = Ke.HedgeProbePath, as = "/emby/system/info/public", Pu = "/emby/system/ping", xu = "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7", Kn = "Hills/1.10.0 (android; 16)";
function Ou(o = "") {
  return String(o || "").trim() || Kn;
}
function Ao(o = "") {
  return {
    Accept: "*/*",
    "Accept-Language": xu,
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    "User-Agent": Ou(o)
  };
}
var vu = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Co = Ke.HedgeProbeTimeoutMs, Li = Ke.HedgeProbeParallelism, Ni = Ke.HedgeWaitTimeoutMs, Di = Ke.HedgeLockTtlMs, na = Ke.HedgePreferredTtlSec, Ii = Ke.HedgeFailureCooldownSec, Mi = Ke.HedgeWakeJitterMs, Pi = Ke.BufferedRetryBodyMaxBytes, Fu = Ke.MetadataPrewarmTimeoutMs, Uu = Ke.PrewarmCacheTtl, ku = Mt.PlaybackInfoCacheTtlSec, wo = Mt.PlaybackInfoCacheEntryMaxBytes, Hu = Mt.PlaybackInfoCacheTotalMaxBytes, xi = Mt.VideoProgressForwardIntervalSec, $u = Mt.VideoProgressSnapshotMaxBytes, Oi = Mt.CacheTtlImagesDays, Bu = Mt.PlaybackRouteHotCacheTtlMs, sr = Mt.PlaybackRouteHotCacheMax, vi = 12 * 1024 * 1024, Ku = vi - 64 * 1024, zu = 2e6, Vt = 19e5, ns = 50, Fi = 512 * 1024, Wu = 4, Lo = 8 * 1024 * 1024, Cn = 256 * 1024, zn = 32, os = 64, ss = 64 * 1024, is = 128, cs = 8 * 1024, br = 4 * 1024, Gu = Object.freeze([
  "displayName",
  "remark",
  "tag",
  "tagColor",
  "remarkColor",
  "secret",
  "hostPrefixCnameTarget",
  "hedgeProbePath"
]), ls = 500, xa = 1e4, Mr = 25e3, Oa = 1e4, ju = 1e4, wn = 1e4, Vu = 600 * 1e3, qu = 120 * 1e3, at = 2, va = 2;
function Ln(o = "") {
  const e = String(o || "").trim().toUpperCase();
  return e.includes("INT") ? "INTEGER" : e.includes("CHAR") || e.includes("CLOB") || e.includes("TEXT") ? "TEXT" : e.includes("REAL") || e.includes("FLOA") || e.includes("DOUB") ? "REAL" : !e || e.includes("BLOB") ? "BLOB" : "NUMERIC";
}
var Wr = /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i, Xu = /\.(?:js|css|woff2?|ttf|otf|map|webmanifest)$/i, pr = /\.(?:srt|ass|vtt|sub)$/i, Gr = /(?:\/Images\/|\/Icons\/|\/Branding\/|\/emby\/covers\/)/i, St = /\.(?:m3u8|mpd)$/i, Ui = /\.(?:ts|m4s)$/i, Yu = /\.(?:mp4|m4v|m4a|ogv|webm|mkv|mov|avi|wmv|flv)$/i, Wn = /* @__PURE__ */ new Set([
  "host",
  "x-real-ip",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
  "forwarded",
  "connection",
  "upgrade",
  "transfer-encoding",
  "te",
  "keep-alive",
  "proxy-authorization",
  "proxy-authenticate",
  "trailer",
  "expect"
]), Ju = /* @__PURE__ */ new Set([
  "cf-connecting-ip",
  "cf-connecting-ipv6",
  "cf-ipcountry",
  "cf-region",
  "cf-region-code",
  "cf-city",
  "cf-latitude",
  "cf-longitude",
  "cf-postal-code",
  "cf-subdivision",
  "cf-metro-code",
  "cf-timezone",
  "true-client-ip",
  "x-client-ip",
  "x-original-forwarded-for",
  "x-forwarded",
  "cdn-loop",
  "cf-visitor",
  "cf-ray",
  "cf-pseudo-ipv4"
]), Qu = /* @__PURE__ */ new Set([
  "access-control-allow-origin",
  "access-control-allow-methods",
  "access-control-allow-headers",
  "access-control-allow-credentials",
  "x-frame-options",
  "strict-transport-security",
  "x-content-type-options",
  "x-xss-protection",
  "referrer-policy",
  "x-powered-by",
  "server"
]), No = "legacy_proxy_ctx", Zu = 86400, pa = [No, "emby_web_bypass"], ed = /* @__PURE__ */ new Set([
  "users",
  "items",
  "videos",
  "audio",
  "livetv",
  "sessions",
  "system"
]);
function Yr(o, e, t = null) {
  const r = e.headers.get("Origin"), a = e.headers.get("Access-Control-Request-Headers") || ia["Access-Control-Allow-Headers"];
  return {
    "Access-Control-Allow-Origin": t || r || ia["Access-Control-Allow-Origin"],
    "Access-Control-Allow-Methods": ia["Access-Control-Allow-Methods"],
    "Access-Control-Allow-Headers": a,
    "Access-Control-Expose-Headers": "Content-Length, Content-Range",
    "Access-Control-Max-Age": "86400"
  };
}
function It(o = "") {
  if (!o) return "";
  try {
    return decodeURIComponent(o);
  } catch {
    return o;
  }
}
function Y(o) {
  let e = typeof o == "string" ? o : "/";
  return e ? (e.startsWith("/") || (e = "/" + e), e = e.replace(/^\/+/, "/"), e) : "/";
}
function ga(o = "") {
  let e = Y(o);
  for (; ; ) {
    const a = e.replace(/%([0-9a-f]{2})/gi, (n, s) => {
      const i = Number.parseInt(s, 16);
      return i <= 127 ? String.fromCharCode(i) : n;
    });
    if (a === e) break;
    e = a;
  }
  const t = [];
  for (const a of e.replace(/\\/g, "/").toLowerCase().split("/"))
    !a || a === "." || (a === ".." ? t.pop() : t.push(a));
  const r = `/${t.join("/")}`;
  return r === "/web" || r.startsWith("/web/");
}
function ha(o = "") {
  const e = String(o || ""), t = new TextEncoder().encode(e);
  let r = "";
  for (const a of t) r += String.fromCharCode(a);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function jr(o = "") {
  const e = String(o || "").trim().replace(/-/g, "+").replace(/_/g, "/");
  if (!e) return "";
  const t = e.length % 4, r = e + (t ? "=".repeat(4 - t) : ""), a = atob(r), n = Uint8Array.from(a, (s) => s.charCodeAt(0));
  return new TextDecoder().decode(n);
}
function ki(o) {
  const e = "/admin", t = String(o || "").trim();
  if (!t) return e;
  let r = Y(t);
  return r = r.replace(/\/{2,}/g, "/"), r.length > 1 && (r = r.replace(/\/+$/, "")), !r || r === "/" || r.toLowerCase().startsWith("/api") ? e : r;
}
function Hi(o, e) {
  const t = Y(o || "/"), r = Y(e || "/");
  return t === r || t.startsWith(r + "/");
}
function Ar(o, e) {
  const t = Y(o || "/"), r = Y(e || "/");
  return !r || r === "/" ? t === r : t === r || t === `${r}/`;
}
function it(o) {
  return ki(o?.ADMIN_PATH);
}
function dn(o = "/admin") {
  const e = ki(o);
  return e === "/" ? "/login" : `${e}/login`;
}
function Do(o) {
  return dn(it(o));
}
function td(o) {
  const e = it(o), t = Y(e).toLowerCase(), r = [], a = t.split("/").filter(Boolean).map((n) => It(n).toLowerCase());
  return a.length === 1 && a[0] && r.push({
    name: a[0],
    reservedBy: e,
    reason: "admin_path"
  }), t === "/admin" && r.push({
    name: "api",
    reservedBy: "/api/auth/login",
    reason: "legacy_admin_login"
  }), r;
}
function rd(o, e) {
  const t = String(o || "").trim().toLowerCase();
  return t && td(e).find((r) => r.name === t) || null;
}
function $i(o = {}) {
  return String(o?.name || "").trim() ? String(o?.target || "").trim() ? !0 : Array.isArray(o?.lines) && o.lines.length > 0 : !1;
}
function us(o, e) {
  const t = Array.isArray(o) ? o : [o];
  for (const r of t) {
    if (!$i(r) || Ye(r?.entryMode)) continue;
    const a = rd(r?.name, e);
    if (a)
      return {
        ...a,
        name: String(r?.name || "").trim().toLowerCase()
      };
  }
  return null;
}
function ad(o = {}, e = null) {
  if (!Ye(o?.entryMode)) return null;
  const t = String(o?.name || "").trim().toLowerCase();
  if (!t) return {
    code: "HOST_PREFIX_REQUIRED",
    message: "域名前缀不能为空",
    name: t
  };
  if (!La(t)) return {
    code: "HOST_PREFIX_INVALID",
    message: "域名前缀仅支持小写字母、数字、连字符，且不能以下划线、点或连字符结尾",
    name: t
  };
  const r = bu(e);
  if (r && r.name === t) return {
    code: "HOST_PREFIX_RESERVED_BY_LEGACY_HOST",
    message: "该域名前缀已被旧部署子域兼容入口保留，请更换后重试",
    name: t,
    reservedBy: r.reservedBy,
    reason: r.reason,
    legacyHost: r.legacyHost,
    host: r.host
  };
  const a = Ti(o?.hostPrefixCnameTarget);
  return a ? {
    code: "HOST_PREFIX_CNAME_TARGET_INVALID",
    message: a,
    field: "hostPrefixCnameTarget",
    value: String(o?.hostPrefixCnameTarget || "").trim(),
    name: t
  } : null;
}
function ds(o, e = null) {
  const t = Array.isArray(o) ? o : [o];
  for (const r of t) {
    if (!$i(r)) continue;
    const a = ad(r, e);
    if (a) return a;
  }
  return null;
}
function nd(o) {
  const e = it(o);
  return e === "/" ? "/" : e;
}
function Te(o) {
  return String(o ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function Vr(o) {
  return JSON.stringify(o).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function $e(o, e = null) {
  const t = [];
  o?.JWT_SECRET || t.push("JWT_SECRET"), o?.ADMIN_PASS || t.push("ADMIN_PASS");
  const r = typeof e?.adminPath == "string" ? e.adminPath : it(o), a = typeof e?.loginPath == "string" ? e.loginPath : dn(r);
  return {
    ok: t.length === 0,
    missing: t,
    adminPath: r,
    loginPath: a,
    message: t.length ? `系统未初始化：缺少 ${t.join("、")}。` : "系统初始化检查通过。"
  };
}
function Bi(o, e = null) {
  const t = $e(o, e);
  if (t.ok) return t;
  const r = t.missing.join("|") || "unknown";
  return We.InitCheckWarnedFingerprints.has(r) || (We.InitCheckWarnedFingerprints.size >= 32 && We.InitCheckWarnedFingerprints.clear(), We.InitCheckWarnedFingerprints.add(r), console.warn(`[Init Check] ${t.message} 管理入口: ${t.adminPath}`)), t;
}
function Gn(o) {
  if (!o || o.ok) return "";
  const e = Array.isArray(o.missing) && o.missing.length ? o.missing.map((t) => `<code class="rounded bg-amber-100/80 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">${Te(t)}</code>`).join(" ") : '<code class="rounded bg-amber-100/80 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">UNKNOWN</code>';
  return `<div id="init-health-banner" class="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50/95 px-4 py-3 text-sm text-amber-900 shadow-sm"><div class="flex flex-col gap-1 md:flex-row md:items-center md:justify-between"><div class="font-semibold">系统未初始化</div><div class="text-xs text-amber-700">管理入口：${Te(o.adminPath || "/admin")}</div></div><p class="mt-2 leading-6">检测到关键环境变量缺失：${e}</p><p class="mt-1 text-xs leading-5 text-amber-700">请先在 Cloudflare Worker 环境变量中补齐后再使用管理台登录与敏感操作。</p></div>`;
}
function oa(o) {
  return String(o?.cf?.colo || "").trim().toUpperCase() || "UNKNOWN";
}
function Ga(o) {
  return mi(String(o?.headers?.get?.("CF-RAY") || o?.headers?.get?.("cf-ray") || "").trim());
}
function od(o) {
  return String(o?.cf?.country || "").trim().toUpperCase() || "UNKNOWN";
}
function sd(o) {
  const e = od(o);
  return {
    countryCode: e,
    countryName: su(e)
  };
}
function id(o = {}, e = {}) {
  const { statusPort: t } = o, r = '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><link rel="icon" href="/favicon.ico" sizes="any"><title>Emby Proxy Admin Shell</title><script id="admin-bootstrap" type="application/json">__ADMIN_BOOTSTRAP_JSON__<\/script><style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at top,#0f172a 0,#020617 44%,#020617 100%);color:#e2e8f0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-decoration:none}.admin-fallback-shell{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 18px}.admin-fallback-card{width:min(100%,980px);border:1px solid rgba(51,65,85,.92);border-radius:30px;background:rgba(15,23,42,.94);box-shadow:0 32px 96px rgba(2,6,23,.52);padding:28px;backdrop-filter:blur(20px)}.admin-fallback-pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:8px 14px;background:rgba(59,130,246,.12);border:1px solid rgba(96,165,250,.32);color:#bfdbfe;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.admin-fallback-title{margin:20px 0 0;font-size:clamp(1.9rem,4vw,3rem);line-height:1.08;color:#fff}.admin-fallback-copy{margin:14px 0 0;max-width:54rem;color:#cbd5e1;font-size:15px;line-height:1.8}.admin-fallback-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:24px}.admin-fallback-stat{border:1px solid rgba(51,65,85,.9);border-radius:22px;background:rgba(2,6,23,.48);padding:16px}.admin-fallback-k{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#64748b}.admin-fallback-v{margin-top:10px;font-size:15px;line-height:1.7;color:#f8fafc;word-break:break-word}.admin-fallback-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}.admin-fallback-btn{display:inline-flex;align-items:center;justify-content:center;border-radius:16px;padding:12px 18px;font-size:14px;font-weight:700;transition:transform .18s ease,background-color .18s ease,border-color .18s ease}.admin-fallback-btn:hover{transform:translateY(-1px)}.admin-fallback-btn-primary{background:#2563eb;color:#fff;border:1px solid rgba(147,197,253,.7);box-shadow:0 12px 28px rgba(37,99,235,.24)}.admin-fallback-btn-primary:hover{background:#1d4ed8;border-color:#93c5fd}.admin-fallback-btn-secondary{background:rgba(15,23,42,.5);color:#e2e8f0;border:1px solid rgba(51,65,85,.95)}.admin-fallback-btn-secondary:hover{background:rgba(30,41,59,.85)}.admin-fallback-panel{margin-top:24px;border:1px solid rgba(51,65,85,.9);border-radius:24px;background:rgba(2,6,23,.4);padding:20px}.admin-fallback-panel h2{margin:0;font-size:15px;color:#fff}.admin-fallback-panel p{margin:10px 0 0;font-size:14px;line-height:1.7;color:#cbd5e1}.admin-fallback-panel details{margin-top:16px}.admin-fallback-panel summary{cursor:pointer;color:#93c5fd;font-weight:700}.admin-fallback-panel pre{overflow:auto;margin:12px 0 0;padding:14px;border-radius:18px;background:#020617;color:#cbd5e1;font-size:12px;line-height:1.6}.admin-fallback-note{margin-top:16px;color:#94a3b8;font-size:13px;line-height:1.7}@media (max-width:640px){.admin-fallback-shell{padding:18px 12px}.admin-fallback-card,.admin-fallback-stat,.admin-fallback-panel{border-radius:22px}.admin-fallback-card{padding:22px}.admin-fallback-actions{flex-direction:column}.admin-fallback-btn{width:100%}}</style></head><body><main class="admin-fallback-shell"><section class="admin-fallback-card"><div class="admin-fallback-pill">Admin Shell</div><h1 class="admin-fallback-title">管理台壳层正在处理中</h1><p class="admin-fallback-copy">Worker 继续负责管理台壳、登录与统一后台 API；页面主体会根据当前状态注入设置页、远端壳或错误态内容。</p>__INIT_HEALTH_BANNER____ADMIN_APP_ROOT__</section></main></body></html>';
  let a = -1;
  const n = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <defs>
        <linearGradient id="media-favicon-bg" x1="18%" y1="12%" x2="84%" y2="88%">
          <stop offset="0%" stop-color="#3b82f6"/>
          <stop offset="100%" stop-color="#4f46e5"/>
        </linearGradient>
        <radialGradient id="media-favicon-highlight" cx="28%" cy="20%" r="72%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.34"/>
          <stop offset="55%" stop-color="#ffffff" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="15" fill="url(#media-favicon-bg)"/>
      <rect x="4" y="4" width="56" height="56" rx="15" fill="url(#media-favicon-highlight)"/>
      <rect x="4.75" y="4.75" width="54.5" height="54.5" rx="14.25" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
      <path d="M24 18h8v28h-8zM24 18h18v6H24zM24 29h14v6H24zM24 40h18v6H24z" fill="#ffffff"/>
    </svg>`, s = '<style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at top,#0f172a 0,#020617 48%,#020617 100%);color:#e2e8f0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-decoration:none}.landing-shell{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:48px 24px}.landing-card{width:min(100%,1100px);border:1px solid rgba(51,65,85,.9);border-radius:32px;background:rgba(15,23,42,.94);box-shadow:0 28px 90px rgba(2,6,23,.48);overflow:hidden}.landing-grid{display:grid;gap:0}.landing-primary,.landing-side{padding:32px}.landing-primary{text-align:left}.landing-side{border-top:1px solid rgba(51,65,85,.9);background:rgba(2,6,23,.55)}.landing-pill{display:inline-flex;align-items:center;border:1px solid rgba(59,130,246,.3);border-radius:999px;background:rgba(59,130,246,.1);padding:6px 12px;color:#93c5fd;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}.landing-title{margin:20px 0 0;font-size:clamp(2rem,4vw,3.25rem);line-height:1.1;color:#fff}.landing-text{margin:16px 0 0;font-size:15px;line-height:1.8;color:#cbd5e1}.landing-text-muted{color:#94a3b8}.landing-highlight{font-weight:700;color:#fff}.landing-actions{display:flex;flex-direction:column;gap:12px;margin-top:32px}.landing-btn{display:inline-flex;align-items:center;justify-content:center;border-radius:18px;padding:14px 20px;font-size:14px;font-weight:700;transition:background-color .18s ease,border-color .18s ease,transform .18s ease}.landing-btn:hover{transform:translateY(-1px)}.landing-btn-primary{border:1px solid rgba(147,197,253,.7);background:#2563eb;color:#fff;box-shadow:0 12px 28px rgba(37,99,235,.25)}.landing-btn-primary:hover{border-color:#93c5fd;background:#1d4ed8}.landing-btn-secondary{border:1px solid rgba(51,65,85,.95);background:rgba(15,23,42,.45);color:#e2e8f0}.landing-btn-secondary:hover{background:rgba(30,41,59,.8)}.landing-notes{border:1px solid rgba(51,65,85,.9);border-radius:24px;background:rgba(15,23,42,.72);padding:24px}.landing-notes-title{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#64748b}.landing-note-list{margin:16px 0 0;padding-left:18px;color:#cbd5e1;font-size:14px;line-height:1.75}.landing-note-list li+li{margin-top:12px}.landing-banner{margin-bottom:16px;border:1px solid rgba(252,211,77,.32);border-radius:18px;background:rgba(245,158,11,.12);padding:14px 16px;color:#fef3c7}.landing-banner-title{font-size:14px;font-weight:700;color:#fef3c7}.landing-banner-text{margin-top:6px;font-size:12px;line-height:1.6;color:rgba(254,243,199,.92)}@media (min-width:900px){.landing-grid{grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr)}.landing-primary,.landing-side{padding:40px}.landing-side{border-top:0;border-left:1px solid rgba(51,65,85,.9)}}@media (min-width:640px){.landing-actions{flex-direction:row}}@media (max-width:639px){.landing-shell{padding:24px 16px}.landing-card,.landing-notes{border-radius:24px}.landing-primary,.landing-side{padding:24px}.landing-btn{width:100%}}</style>';
  function i(B = "GET") {
    const G = new Headers({
      "Content-Type": "image/svg+xml;charset=UTF-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable"
    });
    return Ce(G), new Response(B === "HEAD" ? null : n, { headers: G });
  }
  const c = Object.freeze([
    "__ADMIN_BOOTSTRAP_JSON__",
    "__INIT_HEALTH_BANNER__",
    "__ADMIN_APP_ROOT__"
  ]), l = "embedded-fallback-v1", d = m(r), u = "minimal-split-parts", f = !0;
  function m(B = "") {
    const G = String(B || ""), X = [];
    let W = 0;
    for (const Z of c) {
      const oe = G.indexOf(Z, W);
      if (oe < 0) throw new Error(`missing admin html placeholder: ${Z}`);
      X.push(G.slice(W, oe)), W = oe + Z.length;
    }
    return X.push(G.slice(W)), X;
  }
  function p(B = [], G = {}) {
    let X = String(B[0] || "");
    for (let W = 0; W < c.length; W += 1) {
      const Z = c[W];
      X += String(G[Z] || ""), X += String(B[W + 1] || "");
    }
    return X;
  }
  const g = "__ADMIN_BOOTSTRAP_JSON__", h = "__INIT_HEALTH_BANNER__", y = "__ADMIN_APP_ROOT__", _ = "", S = "https://admin-shell-cache.invalid", T = "private, no-store, max-age=0", b = "public, max-age=31536000, immutable", R = 300 * 1e3, w = 2 * 1024 * 1024, L = "bootstrap-tailwind-assets-v3-active-index", U = "X-Admin-Shell-Cached-At", E = "X-Admin-Shell-Source-Etag", D = "X-Admin-Shell-Source-Last-Modified", A = "X-Admin-Shell-Source-Hash", x = "__release", O = "vendor", N = "__warm", v = "https://admin-release-vendor-cache.invalid", P = "https://admin-release-vendor-manifest.invalid", C = "public, max-age=31536000, immutable", I = "no-store, max-age=0", M = 8 * 1024 * 1024, F = 3, V = "X-Admin-Release-Vendor-Cached-At", j = "X-Admin-Release-Vendor-Source-Hash", K = Object.freeze([
    "dashboard",
    "nodes",
    "logs",
    "dns",
    "settings"
  ]), q = Object.freeze([
    "系统 UI",
    "代理与网络",
    "静态资源策略",
    "安全防护",
    "日志设置",
    "监控告警",
    "账号设置",
    "备份与恢复"
  ]), de = Object.freeze([
    "ui",
    "proxy",
    "security",
    "logs",
    "account"
  ]);
  function he() {
    return {
      truthSources: {
        primaryUi: "frontend/",
        templateHtml: "frontend/index.html",
        contractDoc: "worker.md"
      },
      bootstrapActions: {
        default: "getAdminBootstrap",
        settings: "getSettingsBootstrap"
      },
      primaryViews: [...K],
      settings: {
        visualSections: [...q],
        saveGroups: [...de]
      }
    };
  }
  function fe(B, G = $e(B), X = {}) {
    return {
      adminPath: it(B),
      loginPath: Do(B),
      initHealth: G,
      hostDomain: ze(B),
      contract: he(),
      shell: Et(B, G, X)
    };
  }
  function ie() {
    if (a >= 0) return a;
    if (!Array.isArray(d) || d.length !== c.length + 1)
      return a = 0, 0;
    const B = new TextEncoder();
    let G = 0;
    for (let X = 0; X < d.length; X += 1)
      G += B.encode(String(d[X] || "")).length, X < c.length && (G += B.encode(c[X]).length);
    return a = G, a;
  }
  function me(B = !1, G = "") {
    const X = String(G || "").trim().toLowerCase();
    return B ? "remote_ready" : X === "setup_required" ? "setup_required" : "embedded_only";
  }
  function Me(B = !1, G = f) {
    return B ? G ? "embedded_fallback_retained" : "legacy_inline_shell_active" : "embedded_fallback_missing";
  }
  function Ue(B = "embedded", G = "") {
    return String(B || "").trim().toLowerCase() === "gate" || String(G || "").trim() === "setup_gate" ? "setup_gate" : String(B || "").trim().toLowerCase() === "remote" ? "remote_shell" : String(G || "").trim() === "embedded_fallback" ? "embedded_fallback" : "embedded_shell";
  }
  function et(B = !1, G = "") {
    return B ? String(G || "").trim() === "embedded_fallback" ? "active" : "retained" : "missing";
  }
  function Et(B, G = $e(B), X = {}) {
    const W = pt(B, X), Z = W.indexUrl, oe = ie(), ge = !!Z, Xe = !!(B?.ASSETS && typeof B.ASSETS.fetch == "function"), dt = !ge && Xe ? "shell_ready" : W.gateState, Ge = oe > 0;
    let At = "";
    if (Z) try {
      At = new URL(Z).origin;
    } catch {
      At = "";
    }
    return {
      mode: ge ? "remote-preferred" : Xe ? "embedded" : "setup_required",
      lifecycleState: me(ge, dt),
      embeddedFallbackState: Ge ? "retained" : "missing",
      retirementState: Me(Ge),
      gateState: dt,
      indexUrl: W.indexUrl,
      indexUrlSource: W.indexUrlSource,
      effectiveRef: W.effectiveRef,
      remoteShellConfigured: ge,
      remoteShellIndexUrl: Z,
      remoteShellOrigin: At,
      bundledShellAvailable: Xe,
      bundledShellSource: Xe ? "frontend/dist/index.html" : "",
      initHealthOk: G?.ok === !0,
      embeddedFallbackAvailable: Ge,
      embeddedTemplateSource: u,
      embeddedTemplateMode: u,
      embeddedTemplateBytes: oe,
      finalUiHtmlRetired: f
    };
  }
  function Jr(B, G = {}) {
    return pt(B, G).indexUrl;
  }
  function Le(B = {}) {
    const G = $(B.shellState) ? B.shellState : {}, X = $(B.initHealth) ? B.initHealth : {}, W = $(B.indexState) ? B.indexState : {}, Z = String(B.remoteShellIndexUrl || G.remoteShellIndexUrl || W.indexUrl || "").trim(), oe = String(B.mode || "").trim().toLowerCase(), ge = oe === "remote" ? "remote" : oe === "gate" ? "gate" : "embedded", Xe = G.remoteShellConfigured === !0 || !!Z, dt = G.embeddedFallbackAvailable === !0, Ge = G.finalUiHtmlRetired !== !1, At = String(B.routeState || "").trim() || (ge === "remote" ? "remote_active" : ge === "gate" ? "setup_gate" : "embedded_active"), ea = String(B.lifecycleState || G.lifecycleState || "").trim() || me(Xe, B.gateState || G.gateState || W.gateState || ""), Ut = String(B.embeddedFallbackState || G.embeddedFallbackState || "").trim() || et(dt, At), fl = String(B.retirementState || G.retirementState || "").trim() || Me(dt, Ge), ml = String(B.gateState || G.gateState || W.gateState || (Z ? "shell_ready" : "setup_required")).trim() || "setup_required";
    return {
      ...G,
      mode: ge,
      effectiveMode: Ue(ge, At),
      gateState: ml,
      lifecycleState: ea,
      embeddedFallbackState: Ut,
      retirementState: fl,
      sourceType: String(B.sourceType || "").trim().toLowerCase() || (ge === "remote" ? "remote_fetch" : ge === "gate" ? "setup_gate" : "embedded_local"),
      routeState: At,
      indexUrl: String(B.indexUrl || G.indexUrl || W.indexUrl || Z).trim(),
      indexUrlSource: String(B.indexUrlSource || G.indexUrlSource || W.indexUrlSource || "").trim(),
      effectiveRef: String(B.effectiveRef || G.effectiveRef || W.effectiveRef || "").trim(),
      effectiveRefType: String(B.effectiveRefType || G.effectiveRefType || W.effectiveRefType || "").trim(),
      remoteShellIndexUrl: Z,
      remoteShellOrigin: String(G.remoteShellOrigin || "").trim(),
      remoteCacheState: String(B.remoteCacheState || "").trim().toLowerCase(),
      revalidateDue: B.revalidateDue === !0,
      lastFetchStatus: String(B.lastFetchStatus || "").trim().toLowerCase(),
      reason: String(B.reason || "").trim(),
      requestPath: String(B.requestPath || "").trim(),
      initHealthOk: X.ok === !0,
      initHealthMissing: [...new Set((Array.isArray(X.missing) ? X.missing : []).map((pl) => String(pl || "").trim()).filter(Boolean))],
      fallbackRetained: dt,
      templateMode: String(G.embeddedTemplateMode || G.embeddedTemplateSource || "").trim() || u,
      finalUiHtmlRetired: Ge,
      updatedAt: String(B.updatedAt || "").trim() || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async function Qr(B, G = {}, X = null) {
    const W = $(G.shellState) ? G.shellState : Et(B, G.initHealth, G.config || {}), Z = Le({
      ...G,
      shellState: W
    }), oe = t.resolveOpsStatusStores(B).db, { updatedAt: ge, ...Xe } = Z, dt = ne(ee(Xe)), Ge = oe ? J.AdminShellStatusWriteState.get(oe) : null, At = Math.max(1e3, Number(k.Defaults.AdminShellStatusStableWriteIntervalMs) || 1e3);
    if (G.throttleStableWrites === !0 && Ge?.fingerprint === dt) {
      if (Ge.writePromise) return Ge.writePromise;
      if (H() - (Number(Ge.writtenAt) || 0) < At) return null;
    }
    const ea = pe(Promise.resolve(t.patchOpsStatus(B, { adminShell: Z }, X)).then((Ut) => ({
      ok: !0,
      result: Ut
    })), "admin.shell_status_patch", {
      requestPath: Z.requestPath,
      mode: Z.mode,
      sourceType: Z.sourceType
    }, {
      ok: !1,
      result: null
    }).then((Ut) => (!oe || J.AdminShellStatusWriteState.get(oe)?.writePromise !== ea || (Ut?.ok === !0 ? J.AdminShellStatusWriteState.set(oe, {
      fingerprint: dt,
      writtenAt: H(),
      writePromise: null
    }) : Ge ? J.AdminShellStatusWriteState.set(oe, Ge) : J.AdminShellStatusWriteState.delete(oe)), Ut?.result ?? null));
    return oe && J.AdminShellStatusWriteState.set(oe, {
      fingerprint: dt,
      writtenAt: 0,
      writePromise: ea
    }), ea;
  }
  function tt(B = {}, G, X = {}, W = $e(G)) {
    const Z = $(B) ? B : {}, oe = pt(G, X), ge = Et(G, W, X);
    return {
      ...Z,
      adminShell: Le({
        ...$(Z.adminShell) ? Z.adminShell : {},
        shellState: ge,
        initHealth: W,
        indexState: oe,
        remoteShellIndexUrl: oe.indexUrl,
        gateState: oe.gateState,
        indexUrl: oe.indexUrl,
        indexUrlSource: oe.indexUrlSource,
        effectiveRef: oe.effectiveRef,
        effectiveRefType: oe.effectiveRefType,
        mode: $(Z.adminShell) && String(Z.adminShell.mode || "").trim() ? Z.adminShell.mode : oe.indexUrl ? "remote" : "gate",
        routeState: $(Z.adminShell) && String(Z.adminShell.routeState || "").trim() ? Z.adminShell.routeState : oe.indexUrl ? "remote_ready_idle" : "setup_gate",
        sourceType: $(Z.adminShell) && String(Z.adminShell.sourceType || "").trim() ? Z.adminShell.sourceType : oe.indexUrl ? "runtime_status" : "setup_gate"
      })
    };
  }
  function rt(B = "") {
    const G = String(B || "").trim();
    if (!G) return "已上传的管理台 HTML 暂时不可用，请重新上传。";
    if (G.startsWith("remote_shell_render_failed")) {
      const X = G.replace(/^remote_shell_render_failed:\s*/i, "").trim();
      return X ? `Worker 读取 index.html 失败：${X}` : "Worker 读取 index.html 失败。";
    }
    return G;
  }
  function yr(B = {}, G = {}, X = {}, W = {}) {
    const Z = String(B.adminPath || "/admin").trim() || "/admin", oe = String(W.remoteShellIndexUrl || G.remoteShellIndexUrl || "").trim(), ge = rt(W.reason || ""), Xe = `${Z}?setup=1`;
    return `<style>
        .admin-remote-error-shell{max-width:920px;margin:0 auto;padding:44px 20px 56px;color:#0f172a}
        .admin-remote-error-card{background:rgba(255,255,255,.96);border:1px solid rgba(248,113,113,.22);border-radius:28px;box-shadow:0 24px 80px rgba(15,23,42,.12);overflow:hidden}
        .dark .admin-remote-error-card{background:rgba(15,23,42,.94);border-color:rgba(248,113,113,.32);color:#e2e8f0}
        .admin-remote-error-head{padding:30px 30px 22px;border-bottom:1px solid rgba(248,113,113,.14)}
        .admin-remote-error-kicker{display:inline-flex;align-items:center;padding:7px 12px;border-radius:999px;background:rgba(239,68,68,.1);color:#b91c1c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
        .dark .admin-remote-error-kicker{background:rgba(248,113,113,.16);color:#fecaca}
        .admin-remote-error-title{margin:16px 0 10px;font-size:clamp(28px,4.8vw,40px);line-height:1.05}
        .admin-remote-error-desc{margin:0;color:#475569;line-height:1.8}
        .dark .admin-remote-error-desc{color:#cbd5e1}
        .admin-remote-error-body{padding:26px 30px 30px}
        .admin-remote-error-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-bottom:22px}
        .admin-remote-error-stat{padding:15px 16px;border-radius:18px;background:#f8fafc;border:1px solid rgba(148,163,184,.16)}
        .dark .admin-remote-error-stat{background:#111827;border-color:rgba(71,85,105,.5)}
        .admin-remote-error-k{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#64748b}
        .admin-remote-error-v{margin-top:8px;font-size:14px;line-height:1.7;color:#0f172a;word-break:break-word}
        .dark .admin-remote-error-v{color:#f8fafc}
        .admin-remote-error-actions{display:flex;flex-wrap:wrap;gap:12px;margin:22px 0 20px}
        .admin-remote-error-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:14px;font-weight:700;text-decoration:none}
        .admin-remote-error-btn-primary{background:#0f172a;color:#fff}
        .dark .admin-remote-error-btn-primary{background:#e2e8f0;color:#0f172a}
        .admin-remote-error-btn-secondary{background:#fff;border:1px solid rgba(148,163,184,.22);color:#334155}
        .dark .admin-remote-error-btn-secondary{background:#0f172a;border-color:rgba(71,85,105,.6);color:#e2e8f0}
        .admin-remote-error-note{margin:0;color:#64748b;line-height:1.8}
        .dark .admin-remote-error-note{color:#94a3b8}
        .admin-remote-error-debug{margin-top:18px}
        .admin-remote-error-debug pre{margin:12px 0 0;padding:16px;border-radius:18px;background:#0f172a;color:#e2e8f0;overflow:auto;font-size:12px;line-height:1.6}
        @media (max-width: 820px){
          .admin-remote-error-grid{grid-template-columns:1fr}
          .admin-remote-error-head,.admin-remote-error-body{padding:22px}
        }
      </style>
      <div class="admin-remote-error-shell">
        <section class="admin-remote-error-card">
          <div class="admin-remote-error-head">
            <div class="admin-remote-error-kicker">HTML Error</div>
            <h1 class="admin-remote-error-title">管理台 HTML 暂时不可用</h1>
            <p class="admin-remote-error-desc">${Te(ge)}</p>
          </div>
          <div class="admin-remote-error-body">
            <div class="admin-remote-error-grid">
              <article class="admin-remote-error-stat"><div class="admin-remote-error-k">错误原因</div><div class="admin-remote-error-v">${Te(ge)}</div></article>
              <article class="admin-remote-error-stat"><div class="admin-remote-error-k">本地版本标识</div><div class="admin-remote-error-v">${Te(oe || "未找到本地 HTML 版本")}</div></article>
            </div>
            <div class="admin-remote-error-actions">
              <a href="${Te(Z)}" class="admin-remote-error-btn admin-remote-error-btn-primary">刷新 /admin</a>
              <a href="${Te(Xe)}" class="admin-remote-error-btn admin-remote-error-btn-secondary">重新上传 index.html</a>
            </div>
            <p class="admin-remote-error-note">如果这里继续报错，请重新上传与当前 Worker 匹配的 index.html。</p>
          </div>
        </section>
      </div>`;
  }
  function Zr(B = {}, G = {}, X = {}, W = {}, Z = {}) {
    const oe = String(B.adminPath || "/admin").trim() || "/admin", ge = Z?.isLocalUpload === !0, Xe = Vr({ adminPath: oe });
    return `<style>
        .admin-gate-shell{max-width:720px;margin:0 auto;padding:48px 20px 64px;color:#0f172a}
        .admin-gate-card{background:#fff;border:1px solid #dbe3ee;border-radius:8px;box-shadow:0 18px 50px rgba(15,23,42,.1);overflow:hidden}
        .dark .admin-gate-card{background:#0f172a;border-color:#334155;color:#e2e8f0}
        .admin-gate-head{padding:24px 24px 18px;border-bottom:1px solid #e2e8f0}
        .dark .admin-gate-head{border-color:#334155}
        .admin-gate-kicker{margin:0 0 8px;color:#0369a1;font-size:12px;font-weight:700;text-transform:uppercase}
        .dark .admin-gate-kicker{color:#7dd3fc}
        .admin-gate-title{margin:0;font-size:24px;line-height:1.3}
        .admin-gate-body{padding:24px;display:grid;gap:18px}
        .admin-gate-field{display:grid;gap:8px;min-width:0}
        .admin-gate-label{font-size:13px;font-weight:700;color:#475569}
        .dark .admin-gate-label{color:#cbd5e1}
        .admin-gate-input{width:100%;min-width:0;padding:12px;border-radius:6px;border:1px solid #cbd5e1;background:#fff;color:#0f172a;font-size:14px;outline:none}
        .dark .admin-gate-input{background:#020617;color:#e2e8f0;border-color:#475569}
        .admin-gate-input:focus{border-color:#0284c7;box-shadow:0 0 0 3px rgba(2,132,199,.14)}
        .admin-gate-hint{font-size:12px;line-height:1.6;color:#64748b;overflow-wrap:anywhere}
        .dark .admin-gate-hint{color:#94a3b8}
        .admin-gate-status{min-height:44px;padding:11px 12px;border-radius:6px;background:#f8fafc;border:1px solid #e2e8f0;color:#475569;line-height:1.6;overflow-wrap:anywhere}
        .dark .admin-gate-status{background:#111827;border-color:#334155;color:#cbd5e1}
        .admin-gate-status.is-error{background:#fff1f2;border-color:#fecdd3;color:#be123c}
        .dark .admin-gate-status.is-error{background:#4c0519;border-color:#881337;color:#fecdd3}
        .admin-gate-status.is-success{background:#ecfdf5;border-color:#a7f3d0;color:#166534}
        .dark .admin-gate-status.is-success{background:#052e16;border-color:#166534;color:#bbf7d0}
        .admin-gate-actions{display:flex;justify-content:flex-end}
        .admin-gate-btn{min-height:42px;padding:10px 16px;border:0;border-radius:6px;background:#0369a1;color:#fff;font-size:14px;font-weight:700;cursor:pointer}
        .admin-gate-btn:hover{background:#075985}
        .admin-gate-btn:disabled{cursor:wait;opacity:.65}
        @media (max-width:640px){.admin-gate-shell{padding:24px 12px 40px}.admin-gate-head,.admin-gate-body{padding:18px}.admin-gate-actions,.admin-gate-btn{width:100%}}
      </style>
      <div class="admin-gate-shell">
        <section class="admin-gate-card">
          <header class="admin-gate-head">
            <p class="admin-gate-kicker">Index Source</p>
            <h1 class="admin-gate-title">上传 index.html</h1>
          </header>
          <form id="admin-index-gate-form" class="admin-gate-body" novalidate>
            <label class="admin-gate-field">
              <span class="admin-gate-label">index.html</span>
              <input id="admin-gate-local-file" class="admin-gate-input" type="file" accept=".html,text/html" required />
              <span id="admin-gate-local-hint" class="admin-gate-hint">文件上限 2 MiB</span>
            </label>
            <div id="admin-gate-status" class="admin-gate-status${ge ? " is-success" : ""}" role="status" aria-live="polite">${ge ? "当前已有 HTML 版本，可上传新文件替换。" : "请选择 index.html。"}</div>
            <div class="admin-gate-actions">
              <button id="admin-gate-submit" type="submit" class="admin-gate-btn">上传并进入管理台</button>
            </div>
          </form>
        </section>
      </div>
      <script>
        const ADMIN_INDEX_GATE_RUNTIME = ${Xe};
        const gateForm = document.getElementById("admin-index-gate-form");
        const localFileInput = document.getElementById("admin-gate-local-file");
        const localFileHint = document.getElementById("admin-gate-local-hint");
        const submitButton = document.getElementById("admin-gate-submit");
        const gateStatus = document.getElementById("admin-gate-status");
        function setGateStatus(message, tone) {
          if (!gateStatus) return;
          gateStatus.textContent = message || "";
          gateStatus.classList.remove("is-error", "is-success");
          if (tone === "error") gateStatus.classList.add("is-error");
          if (tone === "success") gateStatus.classList.add("is-success");
        }
        function formatFileSize(bytes) {
          const value = Number(bytes) || 0;
          return value >= 1024 * 1024
            ? (value / (1024 * 1024)).toFixed(2) + " MiB"
            : Math.max(0, Math.round(value / 1024)) + " KiB";
        }
        function validateFile(file) {
          if (!file) return "请选择 index.html。";
          if (String(file.name || "").trim().toLowerCase() !== "index.html") return "文件名必须是 index.html。";
          if (file.size > 2 * 1024 * 1024) return "文件超过 2 MiB 上限。";
          return "";
        }
        localFileInput?.addEventListener("change", () => {
          const file = localFileInput.files?.[0];
          const error = validateFile(file);
          if (localFileHint) localFileHint.textContent = file ? file.name + " · " + formatFileSize(file.size) : "文件上限 2 MiB";
          setGateStatus(error || ("已选择 " + file.name + "。"), error ? "error" : "success");
        });
        gateForm?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const file = localFileInput?.files?.[0];
          const validationError = validateFile(file);
          if (validationError) {
            setGateStatus(validationError, "error");
            localFileInput?.focus();
            return;
          }
          if (submitButton) submitButton.disabled = true;
          if (localFileInput) localFileInput.disabled = true;
          setGateStatus("正在上传并校验 index.html...", "");
          let redirecting = false;
          try {
            const response = await fetch(ADMIN_INDEX_GATE_RUNTIME.adminPath || "/admin", {
              method: "POST",
              credentials: "same-origin",
              headers: { "Content-Type": "application/json", "Accept": "application/json" },
              body: JSON.stringify({
                action: "uploadAdminIndex",
                fileName: file.name,
                indexHtml: await file.text()
              })
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
              const message = payload?.message || payload?.error?.message || payload?.error || ("上传失败（HTTP " + response.status + "）");
              throw new Error(String(message || "上传失败"));
            }
            redirecting = true;
            setGateStatus("index.html 已更新，正在进入管理台...", "success");
            window.location.assign(ADMIN_INDEX_GATE_RUNTIME.adminPath || "/admin");
          } catch (error) {
            setGateStatus(error?.message ? "上传失败：" + error.message : "上传失败，请稍后重试。", "error");
          } finally {
            if (!redirecting) {
              if (submitButton) submitButton.disabled = false;
              if (localFileInput) localFileInput.disabled = false;
            }
          }
        });
      <\/script>`;
  }
  function ke(B = "{}", G = "", X = _) {
    return !Array.isArray(d) || d.length !== c.length + 1 ? "" : p(d, {
      [g]: String(B || "{}"),
      [h]: String(G || ""),
      [y]: String(X || _)
    });
  }
  function Xt(B = {}, G = null, X = _) {
    const W = $(B) ? B : {}, Z = $(G) ? G : $(W.initHealth) ? W.initHealth : {}, oe = {
      templateRevision: String(l).trim() || "admin-shell",
      adminPath: String(W.adminPath || "").trim(),
      loginPath: String(W.loginPath || "").trim(),
      hostDomain: re(W.hostDomain),
      contractHash: ne(ee(W.contract || he())),
      initHealthOk: Z.ok === !0,
      initHealthMissing: [...new Set((Array.isArray(Z.missing) ? Z.missing : []).map((ge) => String(ge || "").trim()).filter(Boolean))],
      appRootHash: ne(String(X || _))
    };
    return `${oe.templateRevision}-${ne(ee(oe))}`;
  }
  function lt(B = "") {
    return `"${String(B || "").trim()}"`;
  }
  function ut(B = "") {
    return String(B || "").trim().replace(/^W\//i, "").replace(/^"(.*)"$/, "$1");
  }
  function xt(B, G = "") {
    const X = String(B?.headers?.get?.("If-None-Match") || "").trim(), W = ut(G);
    return !X || !W ? !1 : X.split(",").some((Z) => {
      const oe = ut(Z);
      return oe === "*" || oe === W;
    });
  }
  function Tt(B, G = "") {
    const X = B instanceof Request ? new URL(B.url) : new URL(String(B || ""), S), W = new URL(X.pathname, S);
    return W.searchParams.set("remote", ne(String(G || "").trim())), new Request(W.toString(), { method: "GET" });
  }
  function Ot(B, G = "", X = {}) {
    const W = Tt(B, G), Z = new URL(W.url);
    return Z.searchParams.set("transform", L), Z.searchParams.set("bootstrap", ne(ee($(X) ? X : {}))), new Request(Z.toString(), { method: "GET" });
  }
  function Yt(B = "", G = "no-store, max-age=0") {
    const X = new Headers({
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": String(G || "no-store, max-age=0")
    });
    return Ce(X), B && X.set("ETag", lt(B)), X;
  }
  function Rt(B = "") {
    const G = String(B || "").trim();
    if (!G) return "";
    const X = Date.parse(G);
    return Number.isFinite(X) ? new Date(X).toUTCString() : "";
  }
  function Sr(B, G = "") {
    const X = String(B?.headers?.get?.("If-Modified-Since") || "").trim(), W = Rt(G);
    if (!X || !W) return !1;
    const Z = Date.parse(X), oe = Date.parse(W);
    return !Number.isFinite(Z) || !Number.isFinite(oe) ? !1 : Z >= oe;
  }
  function vt(B, G) {
    return String(B?.headers?.get?.("If-None-Match") || "").trim() ? xt(B, G?.headers?.get?.("ETag") || "") : Sr(B, G?.headers?.get?.("Last-Modified") || "");
  }
  function Ft(B, G = "no-store, max-age=0") {
    const X = new Headers({ "Cache-Control": String(G || "no-store, max-age=0") }), W = ut(B?.headers?.get?.("ETag") || ""), Z = Rt(B?.headers?.get?.("Last-Modified") || "");
    W && X.set("ETag", lt(W)), Z && X.set("Last-Modified", Z);
    const oe = String(B?.headers?.get?.("X-Admin-Shell-Revision") || "").trim();
    return oe && X.set("X-Admin-Shell-Revision", oe), Ce(X), new Response(null, {
      status: 304,
      headers: X
    });
  }
  return {
    ADMIN_FALLBACK_HTML_TEMPLATE: r,
    cachedAdminTemplateBytes: a,
    SITE_FAVICON_SVG: n,
    LANDING_PAGE_STYLE_HTML: s,
    renderFaviconResponse: i,
    ADMIN_HTML_DYNAMIC_PLACEHOLDERS: c,
    ADMIN_HTML_VARIANT_ETAG: l,
    ADMIN_HTML_PARTS_PLAIN: d,
    ADMIN_EMBEDDED_TEMPLATE_MODE: u,
    ADMIN_FINAL_UI_HTML_RETIRED: f,
    splitAdminHtmlTemplate: m,
    renderAdminHtmlTemplate: p,
    ADMIN_BOOTSTRAP_PLACEHOLDER: g,
    ADMIN_INIT_HEALTH_BANNER_PLACEHOLDER: h,
    ADMIN_APP_ROOT_PLACEHOLDER: y,
    ADMIN_APP_ROOT_HTML: _,
    ADMIN_HTML_CACHE_KEY_ORIGIN: S,
    ADMIN_REMOTE_SHELL_BROWSER_CACHE_CONTROL: T,
    ADMIN_REMOTE_SHELL_EDGE_CACHE_CONTROL: b,
    ADMIN_REMOTE_SHELL_REVALIDATE_MS: R,
    ADMIN_REMOTE_SHELL_MAX_BYTES: w,
    ADMIN_REMOTE_SHELL_TRANSFORM_REVISION: L,
    ADMIN_REMOTE_SHELL_CACHED_AT_HEADER: U,
    ADMIN_REMOTE_SHELL_SOURCE_ETAG_HEADER: E,
    ADMIN_REMOTE_SHELL_SOURCE_LAST_MODIFIED_HEADER: D,
    ADMIN_REMOTE_SHELL_SOURCE_HASH_HEADER: A,
    ADMIN_RELEASE_PROXY_PATH_SEGMENT: x,
    ADMIN_RELEASE_VENDOR_PATH_SEGMENT: O,
    ADMIN_WARM_PATH_SEGMENT: N,
    ADMIN_RELEASE_VENDOR_CACHE_KEY_ORIGIN: v,
    ADMIN_RELEASE_VENDOR_MANIFEST_CACHE_KEY_ORIGIN: P,
    ADMIN_RELEASE_VENDOR_CACHE_CONTROL: C,
    ADMIN_RELEASE_VENDOR_MUTABLE_CACHE_CONTROL: I,
    ADMIN_RELEASE_VENDOR_MAX_BYTES: M,
    ADMIN_WARM_VENDOR_CONCURRENCY: F,
    ADMIN_RELEASE_VENDOR_CACHED_AT_HEADER: V,
    ADMIN_RELEASE_VENDOR_SOURCE_HASH_HEADER: j,
    ADMIN_PRIMARY_VIEWS: K,
    ADMIN_SETTINGS_VISUAL_SECTIONS: q,
    ADMIN_SETTINGS_SAVE_GROUPS: de,
    buildAdminUiContract: he,
    buildAdminBootstrapPayload: fe,
    measureAdminShellTemplateBytes: ie,
    buildAdminShellLifecycleState: me,
    buildAdminShellRetirementState: Me,
    buildAdminShellEffectiveMode: Ue,
    buildAdminEmbeddedFallbackRuntimeState: et,
    buildAdminShellState: Et,
    resolveAdminShellIndexUrl: Jr,
    normalizeAdminShellRuntimeStatus: Le,
    patchAdminShellRuntimeStatus: Qr,
    withAdminShellRuntimeStatus: tt,
    describeAdminRemoteShellFailureReason: rt,
    buildAdminRemoteShellErrorContent: yr,
    buildAdminIndexSetupContent: Zr,
    renderAdminHtmlShell: ke,
    buildAdminHtmlVariantEtag: Xt,
    formatAdminHtmlEtag: lt,
    normalizeEtagToken: ut,
    requestHasMatchingEtag: xt,
    buildAdminRemoteShellLegacyCacheKeyRequest: Tt,
    buildAdminRemoteShellCacheKeyRequest: Ot,
    buildAdminHtmlResponseHeaders: Yt,
    normalizeAdminHttpDateHeader: Rt,
    requestHasMatchingLastModified: Sr,
    requestMatchesAdminHtmlResponse: vt,
    buildConditionalNotModifiedResponseFromStoredResponse: Ft
  };
}
function cd(o = {}, e = {}) {
  function t(C = "{}") {
    return `${s(C)}${r}`;
  }
  const r = '<script id="admin-bootstrap-loader">try{window.__ADMIN_BOOTSTRAP__=JSON.parse(document.getElementById("admin-bootstrap")?.textContent||"{}")}catch(_){window.__ADMIN_BOOTSTRAP__=window.__ADMIN_BOOTSTRAP__||{},window.__ADMIN_UI_BOOT_ERROR__=window.__ADMIN_UI_BOOT_ERROR__||"admin bootstrap parse failed: "+(_?.message||String(_||"unknown_error"))}<\/script>', a = '<script id="admin-tailwind-prelude">window.tailwind=window.tailwind||{};<\/script>', n = /* @__PURE__ */ new Set([
    "script",
    "style",
    "template",
    "textarea",
    "title",
    "noscript"
  ]);
  function s(C = "{}") {
    return `<script id="admin-bootstrap" type="application/json">${String(C || "{}")}<\/script>`;
  }
  function i(C = "") {
    return C === " " || C === "	" || C === `
` || C === "\f" || C === "\r";
  }
  function c(C, I) {
    let M = "";
    for (let F = I; F < C.length; F += 1) {
      const V = C[F];
      if (M)
        V === M && (M = "");
      else if (V === '"' || V === "'") M = V;
      else if (V === ">") return F;
    }
    return -1;
  }
  function l(C, I) {
    let M = I + 1;
    if (!/[A-Za-z]/.test(C[M] || "")) return null;
    const F = c(C, M);
    if (F < 0) return null;
    const V = M;
    for (; M < F && !i(C[M]) && C[M] !== "/"; ) M += 1;
    const j = C.slice(V, M).toLowerCase(), K = /* @__PURE__ */ new Map();
    for (; M < F; ) {
      for (; M < F && i(C[M]); ) M += 1;
      if (M >= F) break;
      if (C[M] === "/") {
        M += 1;
        continue;
      }
      const q = M;
      for (; M < F && !i(C[M]) && C[M] !== "=" && C[M] !== "/"; ) M += 1;
      if (M === q) {
        M += 1;
        continue;
      }
      const de = C.slice(q, M).toLowerCase();
      for (; M < F && i(C[M]); ) M += 1;
      let he = "", fe = !1, ie = -1, me = -1;
      if (C[M] === "=") {
        for (M += 1; M < F && i(C[M]); ) M += 1;
        const Me = C[M];
        if (Me === '"' || Me === "'") {
          for (fe = !0, M += 1, ie = M; M < F && C[M] !== Me; ) M += 1;
          me = M, he = C.slice(ie, me), M < F && (M += 1);
        } else {
          for (ie = M; M < F && !i(C[M]); ) M += 1;
          me = M, he = C.slice(ie, me);
        }
      }
      K.has(de) || K.set(de, {
        value: he,
        quoted: fe,
        valueStart: ie,
        valueEnd: me
      });
    }
    return {
      tagName: j,
      attributes: K,
      start: I,
      tagEnd: F
    };
  }
  function d(C, I, M, F) {
    const V = `</${M}`;
    let j = F;
    for (; j < C.length; ) {
      const K = I.indexOf(V, j);
      if (K < 0) return null;
      const q = C[K + V.length] || "";
      if (!q || i(q) || q === "/" || q === ">") {
        const de = c(C, K + V.length);
        return de >= 0 ? {
          start: K,
          tagEnd: de
        } : null;
      }
      j = K + V.length;
    }
    return null;
  }
  function* u(C = "") {
    const I = String(C || ""), M = I.toLowerCase();
    let F = 0;
    for (; F < I.length; ) {
      const V = I.indexOf("<", F);
      if (V < 0) return;
      if (I.startsWith("<!--", V)) {
        const fe = I.indexOf("-->", V + 4);
        F = fe < 0 ? I.length : fe + 3;
        continue;
      }
      const j = I[V + 1] || "";
      if (j === "!" || j === "?" || j === "/") {
        const fe = c(I, V + 2);
        if (fe < 0) return;
        F = fe + 1;
        continue;
      }
      const K = l(I, V);
      if (!K) {
        if (/[A-Za-z]/.test(j)) return;
        F = V + 1;
        continue;
      }
      const q = K.tagEnd + 1, de = n.has(K.tagName) ? d(I, M, K.tagName, q) : null, he = de ? de.start : q;
      if (F = de ? de.tagEnd + 1 : q, yield {
        ...K,
        contentStart: q,
        contentEnd: de || !n.has(K.tagName) ? he : I.length,
        contentTagEnd: de ? de.tagEnd : -1,
        contentClosed: !!de || !n.has(K.tagName)
      }, n.has(K.tagName) && !de) return;
    }
  }
  function f(C = "", I = "") {
    const M = String(C || ""), F = String(I || "");
    if (!M || !F) return M;
    let V = -1;
    for (const j of u(M)) {
      if (j.tagName === "head") {
        const K = j.tagEnd + 1;
        return `${M.slice(0, K)}${F}${M.slice(K)}`;
      }
      j.tagName === "body" && V < 0 && (V = j.tagEnd + 1);
    }
    return V >= 0 ? `${M.slice(0, V)}${F}${M.slice(V)}` : `${F}${M}`;
  }
  function m(C = "") {
    const I = String(C || "");
    if (!I) return I;
    let M = -1;
    for (const F of u(I)) {
      if (F.tagName !== "script" || !F.contentClosed) continue;
      if (F.attributes.get("id")?.value === "admin-tailwind-prelude") return I;
      if (M >= 0 || F.attributes.has("src")) continue;
      const V = I.slice(F.contentStart, F.contentEnd);
      /\btailwind\s*\.\s*config\s*=/i.test(V) && (M = F.start);
    }
    return M < 0 ? I : `${I.slice(0, M)}${a}${I.slice(M)}`;
  }
  function p(C = "", I = "{}") {
    const M = m(String(C || ""));
    if (!M) return M;
    const F = s(I);
    let V = null, j = null;
    for (const K of u(M)) {
      if (K.tagName !== "script" || !K.contentClosed) continue;
      const q = String(K.attributes.get("id")?.value || "").trim();
      q === "admin-bootstrap" && String(K.attributes.get("type")?.value || "").trim().toLowerCase() === "application/json" ? V = K : q === "admin-bootstrap-loader" && (j = K);
    }
    if (V && V.contentTagEnd >= V.tagEnd) {
      const K = M.slice(0, V.start), q = M.slice(V.contentTagEnd + 1);
      return `${K}${F}${j ? "" : r}${q}`;
    }
    return j ? `${M.slice(0, j.start)}${F}${M.slice(j.start)}` : f(M, t(I));
  }
  function g(C) {
    const I = String(C?.tagName || "").trim().toLowerCase();
    let M = "", F = "";
    if (I === "script" && C.attributes?.has("src"))
      M = "src", F = "script";
    else if (I === "link" && C.attributes?.has("href")) {
      const q = new Set(String(C.attributes.get("rel")?.value || "").trim().toLowerCase().split(/\s+/).filter(Boolean)), de = String(C.attributes.get("as")?.value || "").trim().toLowerCase();
      q.has("stylesheet") ? F = "css" : q.has("modulepreload") ? F = "script" : (q.has("preload") || q.has("prefetch")) && de === "style" ? F = "css" : (q.has("preload") || q.has("prefetch")) && de === "script" && (F = "script"), F && (M = "href");
    }
    if (!M || !F) return null;
    const V = C.attributes.get(M), j = Number(V?.valueStart), K = Number(V?.valueEnd);
    return !Number.isInteger(j) || !Number.isInteger(K) || j < 0 || K < j ? null : {
      rawValue: String(V?.value || ""),
      assetKind: F,
      valueStart: j,
      valueEnd: K
    };
  }
  function h(C = "") {
    const I = [];
    for (const M of u(C)) {
      const F = g(M);
      F && I.push(F);
    }
    return I;
  }
  function y(C = "") {
    for (const I of u(C))
      if (I.tagName === "script" && String(I.attributes.get("type")?.value || "").trim().toLowerCase() === "importmap")
        return !0;
    return !1;
  }
  function _(C = "", I = "") {
    const M = String(C || "");
    if (!M) return [];
    let F = null;
    try {
      F = new URL(String(I || "").trim());
    } catch {
      F = null;
    }
    const V = [];
    for (const j of h(M)) {
      const K = String(j.rawValue || "").trim();
      if (!(!K || /^data:/i.test(K) || /^javascript:/i.test(K)))
        try {
          const q = F ? new URL(K, F).toString() : new URL(K).toString();
          V.push({
            rawValue: K,
            normalizedUrl: q,
            assetKind: j.assetKind
          });
        } catch {
          continue;
        }
    }
    return V.filter((j, K, q) => q.findIndex((de) => de.normalizedUrl === j.normalizedUrl) === K);
  }
  function S(C = "", I = "") {
    return _(C, I).map((M) => M.normalizedUrl);
  }
  function T(C = "") {
    return String(C || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function b(C = "", I = "") {
    const M = String(C || "").trim(), F = String(I || "").trim().toLowerCase() === "css" ? "css" : "js";
    return M ? `${ne(M)}.${F}` : "";
  }
  function R(C = "/admin", I = "", M = "") {
    const F = Y(C || "/admin").replace(/\/+$/, "") || "/admin", V = mt(I), j = String(M || "").trim();
    return !V || !j ? "" : `${F}/${e.ADMIN_RELEASE_PROXY_PATH_SEGMENT}/${encodeURIComponent(V)}/${e.ADMIN_RELEASE_VENDOR_PATH_SEGMENT}/${encodeURIComponent(j)}`;
  }
  function w(C = "", I = {}) {
    const M = _(C, I.baseUrl || I.sourceUrl || "").map((F) => ({
      assetKey: b(F.normalizedUrl, F.assetKind),
      assetKind: F.assetKind,
      upstreamUrl: F.normalizedUrl
    })).filter((F) => F.assetKey && F.upstreamUrl).filter((F, V, j) => j.findIndex((K) => K.assetKey === F.assetKey) === V);
    return {
      version: 1,
      releaseTag: mt(I.releaseTag),
      sourceUrl: Ir(I.sourceUrl || I.baseUrl || ""),
      entries: M
    };
  }
  function L(C = "", I = {}, M = {}) {
    const F = String(C || "");
    if (!F) return F;
    const V = String(M.adminPath || "/admin").trim() || "/admin", j = mt(M.releaseTag), K = new Map((Array.isArray(I?.entries) ? I.entries : []).map((fe) => [String(fe?.upstreamUrl || "").trim(), String(fe?.assetKey || "").trim()]));
    if (!j || K.size === 0) return F;
    let q = null;
    try {
      q = new URL(String(M.baseUrl || M.sourceUrl || "").trim());
    } catch {
      q = null;
    }
    const de = [];
    for (const fe of h(F)) {
      const ie = String(fe.rawValue || "").trim();
      if (!(!ie || /^data:/i.test(ie) || /^javascript:/i.test(ie)))
        try {
          const me = q ? new URL(ie, q).toString() : new URL(ie).toString(), Me = K.get(me), Ue = R(V, j, Me);
          if (!Me || !Ue) continue;
          de.push({
            start: fe.valueStart,
            end: fe.valueEnd,
            value: Ue
          });
        } catch {
          continue;
        }
    }
    let he = F;
    for (const fe of de.sort((ie, me) => me.start - ie.start)) he = `${he.slice(0, fe.start)}${fe.value}${he.slice(fe.end)}`;
    return he;
  }
  function U(C = {}) {
    const I = $(C) ? C : {};
    return {
      version: Number(I.version) || 1,
      releaseTag: mt(I.releaseTag),
      sourceUrl: Ir(I.sourceUrl),
      entries: (Array.isArray(I.entries) ? I.entries : []).map((M) => ({
        assetKey: String(M?.assetKey || "").trim(),
        assetKind: String(M?.assetKind || "").trim().toLowerCase() === "css" ? "css" : "script",
        upstreamUrl: Ir(M?.upstreamUrl)
      })).filter((M) => M.assetKey && M.upstreamUrl)
    };
  }
  function E(C = "") {
    let I = null;
    try {
      I = new URL(String(C || "").trim());
    } catch {
      return !1;
    }
    const M = I.hostname.replace(/\.+$/, "");
    if (!/(^|\.)jsdelivr\.net$/i.test(M) || !/^\/gh\/[^/]+\/[^/]+\//i.test(I.pathname)) return !1;
    const F = I.pathname.match(/^\/gh\/[^/]+\/[^@/]+@([^/]+)\//i);
    if (!F) return !0;
    const V = decodeURIComponent(String(F[1] || "").trim());
    return V ? !(/^[0-9a-f]{7,40}$/i.test(V) || /^v?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/i.test(V)) : !0;
  }
  function D(C = "") {
    const I = String(C || ""), M = [], F = (j = "") => /[A-Za-z0-9_$]/.test(j), V = (j) => {
      let K = j;
      for (; K < I.length; ) {
        if (/\s/.test(I[K])) {
          K += 1;
          continue;
        }
        if (I.startsWith("//", K)) {
          const q = I.indexOf(`
`, K + 2);
          K = q < 0 ? I.length : q + 1;
          continue;
        }
        if (I.startsWith("/*", K)) {
          const q = I.indexOf("*/", K + 2);
          K = q < 0 ? I.length : q + 2;
          continue;
        }
        break;
      }
      return K;
    };
    for (let j = 0; j < I.length; ) {
      if (I.startsWith("import", j) && !F(I[j - 1]) && !F(I[j + 6])) {
        let K = j - 1;
        for (; K >= 0 && /\s/.test(I[K]); ) K -= 1;
        const q = V(j + 6);
        I[K] !== "." && I[q] === "(" && M.push({
          index: j,
          reference: I.slice(j, q + 1)
        });
      }
      j += 1;
    }
    return M;
  }
  function A(C = "") {
    const I = String(C || "");
    for (const M of u(I)) {
      if (M.tagName !== "script" || !M.contentClosed || M.attributes.get("src")?.value) continue;
      const F = String(M.attributes.get("type")?.value || "").trim().toLowerCase().split(";")[0];
      if (!(F && ![
        "module",
        "text/javascript",
        "application/javascript",
        "text/ecmascript",
        "application/ecmascript"
      ].includes(F)) && D(I.slice(M.contentStart, M.contentEnd)).length > 0)
        return !0;
    }
    return !1;
  }
  function x(C = "", I = "") {
    const M = _(C, I), F = [];
    y(C) && F.push("远端 index.html 不允许 importmap；所有运行时依赖必须通过显式 script/link 标签交付"), A(C) && F.push("index.html 不允许 inline 动态 import()；所有运行时依赖必须通过显式 script/link 标签交付");
    for (const V of M) {
      const j = String(V?.rawValue || "").trim(), K = String(V?.normalizedUrl || "").trim();
      let q = "", de = "";
      try {
        const he = new URL(K);
        q = he.hostname.replace(/\.+$/, "").toLowerCase(), de = he.pathname;
      } catch {
      }
      if (!/^(?:https?:)?\/\//i.test(j)) {
        F.push(`远端 index.html 不允许相对或本地 bundle 资源：${j}`);
        continue;
      }
      if (q === "esm.sh" || q.endsWith(".esm.sh")) {
        F.push(`esm.sh 资产不再允许：${K}`);
        continue;
      }
      if (q === "raw.githubusercontent.com") {
        F.push(`raw.githubusercontent.com 资产不再允许：${K}`);
        continue;
      }
      if (q === "github.com" && /^\/[^/]+\/[^/]+\/releases\/download\//i.test(de)) {
        F.push(`浏览器直连 GitHub Release 资产不再允许：${K}`);
        continue;
      }
    }
    return F;
  }
  function O(C = "") {
    for (const I of u(C)) {
      if (n.has(I.tagName)) continue;
      const M = I.attributes.get("id");
      if (M?.quoted && M.value === "app") return !0;
    }
    return !1;
  }
  function N(C = "") {
    const I = String(C || "").trim();
    return I ? /<!doctype\s+html\b/i.test(I) || /<html\b/i.test(I) : !1;
  }
  function v(C = "", I = !1) {
    const M = String(C || "").trim().toLowerCase();
    return !M || M.includes("text/html") || M.includes("application/xhtml+xml") ? !0 : I ? M.startsWith("text/plain") || M.startsWith("application/octet-stream") : !1;
  }
  function P(C = {}) {
    const I = $(C.bootstrap) ? C.bootstrap : {}, M = $(C.initHealth) ? C.initHealth : $(I.initHealth) ? I.initHealth : {};
    return `admin-remote-shell-${ne(ee({
      templateRevision: "admin-remote-shell",
      sourceHash: ne(String(C.sourceUrl || "").trim()),
      originEtag: e.normalizeEtagToken(C.originEtag || ""),
      originLastModified: e.normalizeAdminHttpDateHeader(C.originLastModified || ""),
      htmlHash: ne(String(C.html || "")),
      variantSeed: e.buildAdminHtmlVariantEtag(I, M, "remote-admin-shell")
    }))}`;
  }
  return {
    buildAdminRemoteBootstrapMarkup: t,
    ADMIN_REMOTE_BOOTSTRAP_LOADER_HTML: r,
    ADMIN_REMOTE_TAILWIND_PRELUDE_HTML: a,
    ADMIN_HTML_SKIPPED_CONTENT_TAGS: n,
    buildAdminRemoteBootstrapScriptMarkup: s,
    isAdminHtmlSpace: i,
    findAdminHtmlTagEnd: c,
    parseAdminHtmlOpeningTag: l,
    findAdminHtmlClosingTag: d,
    iterateAdminHtmlOpeningTags: u,
    injectMarkupIntoHtmlDocument: f,
    ensureAdminRemoteTailwindConfigGlobal: m,
    applyAdminRemoteBootstrapMarkup: p,
    getAdminRemoteShellAssetReference: g,
    collectAdminRemoteShellAssetReferences: h,
    hasAdminRemoteShellImportMap: y,
    extractAdminRemoteShellAssetDescriptors: _,
    extractAdminRemoteShellAssetUrls: S,
    escapeRegexForRoute: T,
    buildAdminReleaseVendorAssetKey: b,
    buildAdminReleaseVendorProxyPath: R,
    buildAdminReleaseVendorManifest: w,
    rewriteAdminRemoteShellAssetUrlsToProxy: L,
    normalizeAdminReleaseVendorManifestRecord: U,
    isMutableJsdelivrGithubAssetUrl: E,
    collectAdminInlineDynamicImports: D,
    hasAdminRemoteShellInlineDynamicImport: A,
    getAdminRemoteShellAssetPolicyViolations: x,
    hasAdminRemoteShellAppRoot: O,
    hasAdminRemoteShellHtmlDocument: N,
    isAcceptedAdminHtmlDocumentContentType: v,
    buildAdminRemoteShellVariantEtag: P
  };
}
function Be(o, e) {
  return fetch(o, e);
}
function Ki(o = {}) {
  const e = {};
  if (!o || typeof o != "object" || Array.isArray(o)) return e;
  for (const [t, r] of Object.entries(o)) {
    const a = String(t || "").trim().toLowerCase();
    !a || e[a] !== void 0 || (e[a] = r);
  }
  return e;
}
function fs(o = {}, e = []) {
  const t = Ki(o);
  for (const r of Array.isArray(e) ? e : [e]) {
    const a = String(r || "").trim().toLowerCase();
    if (!a) continue;
    const n = t[a];
    if (!(n == null || n === ""))
      return n;
  }
  return "";
}
function ct(o = []) {
  return (Array.isArray(o) ? o : [o]).map((e) => String(e ?? "").trim()).filter(Boolean).join(":");
}
async function Kt(o, e) {
  return await fn(te.SingleFlightTasks, o, e);
}
async function fn(o, e, t) {
  const r = String(e || "").trim();
  if (!r) return await t();
  const a = o.get(r);
  if (a) return await a;
  const n = Promise.resolve().then(() => t()).finally(() => {
    o.get(r) === n && o.delete(r);
  });
  return o.set(r, n), await n;
}
function Io(o) {
  return String(o?.__CONFIG_CACHE_NAMESPACE || o?.__WORKER_CACHE_SCOPE || "default").trim() || "default";
}
function mn(o) {
  return Ka.get(Da(o), Io(o));
}
function ms(o) {
  return mn(o).ConfigCache?.data || null;
}
function ja(o) {
  if (arguments.length === 0) {
    Ka.reset();
    return;
  }
  const e = mn(o);
  e.RuntimeConfigCacheGeneration += 1, e.ConfigCache = null;
}
function ld(o, e) {
  const t = mn(o);
  t.RuntimeConfigCacheGeneration += 1, t.ConfigCache = {
    data: e,
    exp: Date.now() + k.Defaults.CacheTTL,
    namespace: Io(o)
  };
}
async function jn(o, e) {
  const t = String(o), r = (te.AdminRemoteShellCacheMutationChains.get(t) || Promise.resolve()).catch(() => null).then(() => e()).finally(() => {
    te.AdminRemoteShellCacheMutationChains.get(t) === r && te.AdminRemoteShellCacheMutationChains.delete(t);
  });
  return te.AdminRemoteShellCacheMutationChains.set(t, r), await r;
}
function ud(o = {}, e = {}) {
  function t(E = "", D = {}) {
    const A = e.buildAdminHtmlResponseHeaders(D.variantEtag || "", e.ADMIN_REMOTE_SHELL_EDGE_CACHE_CONTROL), x = Number.parseInt(String(D.cachedAt || ""), 10);
    A.set(e.ADMIN_REMOTE_SHELL_CACHED_AT_HEADER, String(Number.isFinite(x) && x > 0 ? x : H()));
    const O = e.normalizeEtagToken(D.originEtag || "");
    O && A.set(e.ADMIN_REMOTE_SHELL_SOURCE_ETAG_HEADER, O);
    const N = e.normalizeAdminHttpDateHeader(D.originLastModified || "");
    N && A.set(e.ADMIN_REMOTE_SHELL_SOURCE_LAST_MODIFIED_HEADER, N);
    const v = ne(String(D.sourceUrl || "").trim());
    v && A.set(e.ADMIN_REMOTE_SHELL_SOURCE_HASH_HEADER, v);
    const P = Lt(D.shellRevision || Je(D.sourceUrl));
    return P && A.set("X-Admin-Shell-Revision", P), new Response(String(E || ""), {
      status: 200,
      headers: A
    });
  }
  async function r(E) {
    if (!E) return null;
    try {
      const D = await Ne(E, e.ADMIN_REMOTE_SHELL_MAX_BYTES);
      if (D.exceeded) return null;
      const A = new Headers(E.headers || {});
      return A.delete("Content-Length"), new Response(D.text, {
        status: Number(E.status) || 200,
        statusText: String(E.statusText || ""),
        headers: A
      });
    } catch {
      return null;
    }
  }
  async function a(E, D, A, x) {
    const O = await Ne(E, e.ADMIN_REMOTE_SHELL_MAX_BYTES);
    if (O.exceeded) throw new Error("legacy remote admin shell too large");
    const N = O.text, v = e.applyAdminRemoteBootstrapMarkup(N, Vr(A)), P = E.headers.get(e.ADMIN_REMOTE_SHELL_SOURCE_ETAG_HEADER) || "", C = e.normalizeAdminHttpDateHeader(E.headers.get(e.ADMIN_REMOTE_SHELL_SOURCE_LAST_MODIFIED_HEADER) || ""), I = e.normalizeAdminHttpDateHeader(E.headers.get("Last-Modified") || "") || C;
    return t(v, {
      variantEtag: e.buildAdminRemoteShellVariantEtag({
        html: v,
        bootstrap: A,
        initHealth: x,
        sourceUrl: D,
        originEtag: P,
        originLastModified: C || I
      }),
      lastModified: I,
      originEtag: P,
      originLastModified: C || I,
      sourceUrl: D,
      cachedAt: _(E)
    });
  }
  function n(E, D = "GET") {
    if (!E) return new Response("Remote admin shell unavailable", { status: 502 });
    const A = new Headers(E.headers || {});
    return A.set("Content-Type", "text/html;charset=UTF-8"), A.set("Cache-Control", e.ADMIN_REMOTE_SHELL_BROWSER_CACHE_CONTROL), A.delete(e.ADMIN_REMOTE_SHELL_CACHED_AT_HEADER), A.delete(e.ADMIN_REMOTE_SHELL_SOURCE_ETAG_HEADER), A.delete(e.ADMIN_REMOTE_SHELL_SOURCE_LAST_MODIFIED_HEADER), A.delete(e.ADMIN_REMOTE_SHELL_SOURCE_HASH_HEADER), Ce(A), new Response(D === "HEAD" ? null : E.body, {
      status: E.status,
      statusText: E.statusText,
      headers: A
    });
  }
  function s(E = "", D = "") {
    const A = new URL(`/${encodeURIComponent(mt(E) || "release")}`, e.ADMIN_RELEASE_VENDOR_MANIFEST_CACHE_KEY_ORIGIN);
    return A.searchParams.set("source", ne(String(D || "").trim())), new Request(A.toString(), { method: "GET" });
  }
  function i(E = "", D = "", A = "") {
    const x = new URL(`/${encodeURIComponent(mt(E) || "release")}/${encodeURIComponent(String(D || "").trim())}`, e.ADMIN_RELEASE_VENDOR_CACHE_KEY_ORIGIN);
    return x.searchParams.set("source", ne(String(A || "").trim())), x.searchParams.set("schema", "2"), new Request(x.toString(), { method: "GET" });
  }
  function c(E = {}, D = "") {
    const A = new Headers({
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": e.ADMIN_REMOTE_SHELL_EDGE_CACHE_CONTROL
    }), x = String(D || E?.sourceUrl || "").trim();
    return A.set(e.ADMIN_RELEASE_VENDOR_CACHED_AT_HEADER, String(H())), x && A.set(e.ADMIN_RELEASE_VENDOR_SOURCE_HASH_HEADER, ne(x)), new Response(JSON.stringify(E), {
      status: 200,
      headers: A
    });
  }
  function l(E = "", D = "script") {
    const A = String(E || "").trim().toLowerCase(), x = String(D || "").trim().toLowerCase() === "css" ? "css" : "script";
    return A ? x === "css" ? A.includes("text/css") || A.includes("application/css") || A.startsWith("text/plain") : A.includes("javascript") || A.includes("ecmascript") || A.startsWith("text/plain") || A.startsWith("application/octet-stream") : !0;
  }
  function d(E, D = "GET") {
    const A = new Headers(E.headers);
    return A.set("Cache-Control", String(E.headers.get("Cache-Control") || e.ADMIN_RELEASE_VENDOR_CACHE_CONTROL).trim() || e.ADMIN_RELEASE_VENDOR_CACHE_CONTROL), A.delete(e.ADMIN_RELEASE_VENDOR_CACHED_AT_HEADER), A.delete(e.ADMIN_RELEASE_VENDOR_SOURCE_HASH_HEADER), Ce(A), new Response(D === "HEAD" ? null : E.body, {
      status: E.status,
      statusText: E.statusText,
      headers: A
    });
  }
  async function u(E, D = "", A = "") {
    if (!E || typeof E.match != "function") return null;
    const x = await E.match(s(D, A));
    if (!x) return null;
    try {
      const O = await Ne(x, Fi);
      return O.exceeded ? null : e.normalizeAdminReleaseVendorManifestRecord(JSON.parse(O.text));
    } catch {
      return null;
    }
  }
  async function f(E = "", D = "") {
    const A = mt(E), x = Ir(D);
    if (!A || !x) return null;
    const O = await Be(x, { method: "GET" });
    if (!O.ok) throw new Error(`release index fetch failed: HTTP ${O.status}`);
    const N = String(O.headers.get("Content-Type") || "").trim().toLowerCase(), v = Number.parseInt(String(O.headers.get("Content-Length") || ""), 10);
    if (Number.isFinite(v) && v > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`release index too large: ${v} bytes`);
    const P = await Ne(O, e.ADMIN_REMOTE_SHELL_MAX_BYTES), C = P.text, I = P.bytes;
    if (P.exceeded || !C || I > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`release index payload invalid: ${I} bytes`);
    const M = e.hasAdminRemoteShellHtmlDocument(C);
    if (!e.isAcceptedAdminHtmlDocumentContentType(N, M)) throw new Error(`release index content-type invalid: ${N}`);
    if (!M) throw new Error("release index payload invalid: html document expected");
    if (!e.hasAdminRemoteShellAppRoot(C)) throw new Error("release index missing #app root");
    const F = e.getAdminRemoteShellAssetPolicyViolations(C, x);
    if (F.length > 0) throw new Error(`release index asset policy invalid: ${F.slice(0, 3).join(" | ")}`);
    return e.normalizeAdminReleaseVendorManifestRecord(e.buildAdminReleaseVendorManifest(C, {
      releaseTag: A,
      sourceUrl: x
    }));
  }
  async function m(E, D = {}, A = null) {
    const x = e.normalizeAdminReleaseVendorManifestRecord(D);
    if (!E || typeof E.put != "function" || !x.releaseTag || !x.sourceUrl) return x;
    const O = pe(E.put(s(x.releaseTag, x.sourceUrl), c(x, x.sourceUrl)), "admin.release_vendor_manifest_cache_write", { releaseTag: x.releaseTag }, null);
    return A && typeof A.waitUntil == "function" ? A.waitUntil(O) : await O, x;
  }
  async function p(E, D = "", A = "", x = null) {
    const O = await u(E, D, A);
    if (O?.entries?.length) return O;
    const N = await f(D, A);
    return N ? (await m(E, N, x), N) : null;
  }
  function g(E = {}, D = "") {
    const A = String(D || "").trim();
    return A && (Array.isArray(E?.entries) ? E.entries : []).find((x) => String(x?.assetKey || "").trim() === A) || null;
  }
  function h(E = "", D = "/admin") {
    const A = Y(D || "/admin").replace(/\/+$/, "") || "/admin", x = Y(E || "/"), O = new RegExp(`^${e.escapeRegexForRoute(A)}/${e.ADMIN_RELEASE_PROXY_PATH_SEGMENT}/([^/]+)/${e.ADMIN_RELEASE_VENDOR_PATH_SEGMENT}/([^/]+)/*$`, "i"), N = x.match(O);
    if (!N) return null;
    try {
      return {
        releaseTag: mt(decodeURIComponent(String(N[1] || ""))),
        assetKey: String(decodeURIComponent(String(N[2] || "")) || "").trim()
      };
    } catch {
      return null;
    }
  }
  function y(E = "", D = "/admin") {
    const A = Y(D || "/admin").replace(/\/+$/, "") || "/admin";
    return (Y(E || "/").replace(/\/+$/, "") || "/").toLowerCase() === `${A}/${e.ADMIN_WARM_PATH_SEGMENT}`.toLowerCase();
  }
  function _(E) {
    const D = Number.parseInt(String(E?.headers?.get?.(e.ADMIN_REMOTE_SHELL_CACHED_AT_HEADER) || ""), 10);
    return Number.isFinite(D) && D > 0 ? D : 0;
  }
  function S(E) {
    const D = _(E);
    return D ? H() - D >= e.ADMIN_REMOTE_SHELL_REVALIDATE_MS : !0;
  }
  function T(E = "", D = "", A = {}) {
    const x = String(E || ""), O = String(A.sourceLabel || "admin shell").trim() || "admin shell", N = String(A.contentType || "").trim().toLowerCase(), v = new TextEncoder().encode(x).length;
    if (!x || v > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`${O} payload invalid: ${v} bytes`);
    const P = e.hasAdminRemoteShellHtmlDocument(x);
    if (!e.isAcceptedAdminHtmlDocumentContentType(N, P)) throw new Error(`${O} content-type invalid: ${N}`);
    if (!P) throw new Error(`${O} payload invalid: html document expected`);
    if (!e.hasAdminRemoteShellAppRoot(x)) throw new Error(`${O} missing #app root`);
    const C = e.getAdminRemoteShellAssetPolicyViolations(x, D);
    if (C.length > 0) throw new Error(`${O} asset policy invalid: ${C.slice(0, 3).join(" | ")}`);
    return {
      html: x,
      bytes: v
    };
  }
  function b(E = "", D = {}, A = {}, x = "", O = {}) {
    const N = T(E, x, O), v = mt(O.assetRevision || O.releaseTag), P = v ? e.normalizeAdminReleaseVendorManifestRecord(e.buildAdminReleaseVendorManifest(N.html, {
      releaseTag: v,
      sourceUrl: x
    })) : null, C = P?.entries?.length ? e.rewriteAdminRemoteShellAssetUrlsToProxy(N.html, P, {
      adminPath: String(O.adminPath || D?.adminPath || "/admin").trim() || "/admin",
      releaseTag: v,
      sourceUrl: x
    }) : N.html, I = e.applyAdminRemoteBootstrapMarkup(C, Vr(D)), M = e.normalizeAdminHttpDateHeader(O.lastModified || "") || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toUTCString(), F = String(O.originEtag || "").trim();
    return {
      storedResponse: t(I, {
        variantEtag: e.buildAdminRemoteShellVariantEtag({
          html: I,
          bootstrap: D,
          initHealth: A,
          sourceUrl: x,
          originEtag: F,
          originLastModified: M
        }),
        lastModified: M,
        originEtag: F,
        originLastModified: M,
        sourceUrl: x,
        shellRevision: Je(x)
      }),
      vendorManifest: P
    };
  }
  async function R(E = "", D = "index.html") {
    const A = String(E || ""), x = await vn(A), O = zr(x);
    let N;
    try {
      N = T(A, O, {
        sourceLabel: "local admin index",
        contentType: "text/html"
      });
    } catch (C) {
      throw C && typeof C == "object" && (C.code = String(C.code || "ADMIN_INDEX_UPLOAD_INVALID"), C.status = De(C.status, 400)), C;
    }
    const v = Ro(x), P = e.normalizeAdminReleaseVendorManifestRecord(e.buildAdminReleaseVendorManifest(N.html, {
      releaseTag: v,
      sourceUrl: O
    }));
    return {
      version: 1,
      revision: x,
      assetRevision: v,
      sourceUrl: O,
      fileName: (String(D || "index.html").trim().replace(/^.*[\\/]/, "") || "index.html").slice(0, 180),
      uploadedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
      bytes: N.bytes,
      html: N.html,
      manifest: P
    };
  }
  async function w(E, D, A, x = null, O = {}) {
    if (Je(E)) {
      const q = typeof O.loadLocalIndexRecord == "function" ? await O.loadLocalIndexRecord() : null;
      if (!q?.html) throw new Error("local admin index upload is missing");
      return b(q.html, D, A, E, {
        sourceLabel: "local admin index",
        contentType: "text/html",
        adminPath: O.adminPath,
        assetRevision: O.assetRevision || q.assetRevision,
        lastModified: q.uploadedAt
      });
    }
    const N = new Headers(), v = e.normalizeEtagToken(x?.headers?.get?.(e.ADMIN_REMOTE_SHELL_SOURCE_ETAG_HEADER) || ""), P = e.normalizeAdminHttpDateHeader(x?.headers?.get?.(e.ADMIN_REMOTE_SHELL_SOURCE_LAST_MODIFIED_HEADER) || "");
    v && N.set("If-None-Match", v), P && N.set("If-Modified-Since", P);
    const C = await Be(E, {
      method: "GET",
      headers: N
    });
    if (C.status === 304 && x) {
      const q = await Ne(x, e.ADMIN_REMOTE_SHELL_MAX_BYTES);
      if (q.exceeded) throw new Error("cached remote admin shell too large");
      const de = q.text;
      return {
        storedResponse: t(de, {
          variantEtag: e.normalizeEtagToken(x.headers.get("ETag") || ""),
          lastModified: e.normalizeAdminHttpDateHeader(x.headers.get("Last-Modified") || ""),
          originEtag: v,
          originLastModified: P,
          sourceUrl: E
        }),
        vendorManifest: null
      };
    }
    if (!C.ok) throw new Error(`remote admin shell fetch failed: HTTP ${C.status}`);
    const I = String(C.headers.get("Content-Type") || "").trim().toLowerCase(), M = Number.parseInt(String(C.headers.get("Content-Length") || ""), 10);
    if (Number.isFinite(M) && M > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`remote admin shell too large: ${M} bytes`);
    const F = await Ne(C, e.ADMIN_REMOTE_SHELL_MAX_BYTES), V = F.text, j = F.bytes;
    if (F.exceeded || !V || j > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`remote admin shell payload invalid: ${j} bytes`);
    const K = e.normalizeAdminHttpDateHeader(C.headers.get("Last-Modified") || "") || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toUTCString();
    return b(V, D, A, E, {
      sourceLabel: "remote admin shell",
      contentType: I,
      adminPath: O.adminPath,
      assetRevision: O.assetRevision || O.releaseTag,
      lastModified: K,
      originEtag: C.headers.get("ETag") || ""
    });
  }
  async function L(E, D, A, x, O, N, v, P = {}, C = null) {
    if (!D || typeof D.put != "function") return null;
    const I = await w(x, O, N, v, P), M = I?.storedResponse || null;
    return M ? (await D.put(A, M.clone()), I?.vendorManifest?.entries?.length && await m(D, I.vendorManifest, C), M) : null;
  }
  async function U(E, D, A, x, O, N = {}) {
    return Kt(ct(["admin_remote_shell_cold_load", D.url]), () => jn(D.url, async () => {
      if (E && typeof E.match == "function") {
        const C = await E.match(D);
        if (C) {
          const I = await e.materializeAdminRemoteShellCachedResponse(C);
          if (I) return {
            storedResponse: I,
            vendorManifest: null,
            loadedFromCache: !0
          };
        }
      }
      const v = await w(A, x, O, null, N), P = v?.storedResponse || null;
      return P ? (E && typeof E.put == "function" && (await E.put(D, P.clone()), v?.vendorManifest?.entries?.length && await m(E, v.vendorManifest, null)), {
        ...v,
        loadedFromCache: !1
      }) : v;
    }));
  }
  return {
    buildAdminRemoteShellStoredResponse: t,
    materializeAdminRemoteShellCachedResponse: r,
    migrateLegacyAdminRemoteShellStoredResponse: a,
    buildAdminRemoteShellClientResponse: n,
    buildAdminReleaseVendorManifestCacheKeyRequest: s,
    buildAdminReleaseVendorAssetCacheKeyRequest: i,
    buildAdminReleaseVendorManifestResponse: c,
    isAcceptedAdminReleaseVendorContentType: l,
    buildAdminReleaseVendorClientResponse: d,
    readAdminReleaseVendorManifestFromCache: u,
    buildAdminReleaseVendorManifestFromSource: f,
    cacheAdminReleaseVendorManifest: m,
    getOrCreateAdminReleaseVendorManifest: p,
    resolveAdminReleaseVendorManifestEntry: g,
    resolveAdminReleaseVendorRouteMatch: h,
    isAdminWarmRoute: y,
    getAdminRemoteShellCachedAt: _,
    shouldRevalidateAdminRemoteShell: S,
    validateAdminShellHtmlSource: T,
    buildAdminShellStoredPayloadFromHtml: b,
    buildAdminLocalIndexUploadRecord: R,
    fetchAdminRemoteShellStoredResponse: w,
    revalidateAdminRemoteShellCache: L,
    loadAdminRemoteShellColdCache: U
  };
}
function dd(o = {}, e = {}) {
  const { indexRepository: t } = o;
  async function r(f, m, p, g = $e(m), h = {}) {
    const y = m?.ASSETS;
    if (!y || typeof y.fetch != "function") return null;
    const _ = new URL("/index.html", f.url), S = await y.fetch(new Request(_, {
      method: "GET",
      headers: { Accept: "text/html" }
    }));
    if (!S?.ok) throw new Error(`bundled admin shell fetch failed: HTTP ${Number(S?.status) || 0}`);
    const T = Number.parseInt(String(S.headers.get("Content-Length") || ""), 10);
    if (Number.isFinite(T) && T > e.ADMIN_REMOTE_SHELL_MAX_BYTES) throw new Error(`bundled admin shell too large: ${T} bytes`);
    const b = await Ne(S, e.ADMIN_REMOTE_SHELL_MAX_BYTES);
    if (b.exceeded || !b.text) throw new Error(`bundled admin shell payload invalid: ${b.bytes} bytes`);
    const R = e.buildAdminShellState(m, g, h), w = e.buildAdminBootstrapPayload(m, g, h), L = pt(m, h), U = _.toString(), E = e.buildAdminShellStoredPayloadFromHtml(b.text, w, g, U, {
      sourceLabel: "bundled admin shell",
      contentType: S.headers.get("Content-Type") || "text/html",
      adminPath: w.adminPath,
      lastModified: S.headers.get("Last-Modified") || "Thu, 01 Jan 1970 00:00:00 GMT",
      originEtag: S.headers.get("ETag") || ""
    })?.storedResponse || null;
    if (!E) throw new Error("bundled admin shell response is unavailable");
    return await e.patchAdminShellRuntimeStatus(m, {
      shellState: R,
      initHealth: g,
      indexState: L,
      mode: "embedded",
      sourceType: "static_assets",
      routeState: "embedded_active",
      gateState: "shell_ready",
      lifecycleState: "embedded_only",
      embeddedFallbackState: "active",
      remoteCacheState: "bypassed",
      lastFetchStatus: "loaded",
      reason: "served_bundled_admin_shell",
      requestPath: new URL(f.url).pathname,
      indexUrl: U,
      indexUrlSource: "worker_assets",
      effectiveRef: "frontend/dist/index.html",
      effectiveRefType: "static_assets"
    }, p), e.requestMatchesAdminHtmlResponse(f, E) ? e.buildConditionalNotModifiedResponseFromStoredResponse(E, e.ADMIN_REMOTE_SHELL_BROWSER_CACHE_CONTROL) : e.buildAdminRemoteShellClientResponse(E, f.method);
  }
  async function a(f, m, p, g = $e(m), h = {}, y = "index_url_not_configured") {
    const _ = pt(m, h), S = e.buildAdminShellState(m, g, h), T = e.buildAdminBootstrapPayload(m, g, h), b = Vr(T), R = Gn(g), w = new URL(f.url).pathname;
    await e.patchAdminShellRuntimeStatus(m, {
      shellState: S,
      initHealth: g,
      indexState: _,
      remoteShellIndexUrl: _.indexUrl,
      mode: "gate",
      sourceType: "setup_gate",
      routeState: "setup_gate",
      remoteCacheState: "bypassed",
      lastFetchStatus: "skipped",
      reason: y,
      requestPath: w
    }, p);
    const L = e.buildAdminIndexSetupContent(T, S, g, h, _), U = e.renderAdminHtmlShell(b, R, L);
    return new Response(f.method === "HEAD" ? null : U, { headers: e.buildAdminHtmlResponseHeaders("", "no-store, max-age=0") });
  }
  function n(f) {
    const m = String(new URL(f.url).searchParams.get("setup") || "").trim().toLowerCase();
    return m === "1" || m === "true";
  }
  async function s(f, m, p, g = $e(m), h = {}, y = {}) {
    const _ = e.buildAdminShellState(m, g, y), S = e.buildAdminBootstrapPayload(m, g, y), T = pt(m, y), b = Vr(S), R = Gn(g), w = new URL(f.url).pathname, L = {
      ...h,
      shellState: _,
      initHealth: g,
      indexState: T,
      remoteShellIndexUrl: h.remoteShellIndexUrl || _.remoteShellIndexUrl || T.indexUrl || "",
      mode: "remote_error",
      sourceType: h.sourceType || "remote_error",
      routeState: h.routeState || "remote_error",
      remoteCacheState: h.remoteCacheState || "bypassed",
      lastFetchStatus: h.lastFetchStatus || "failed",
      reason: h.reason || "remote_shell_render_failed",
      requestPath: w
    }, U = e.buildAdminRemoteShellErrorContent(S, _, g, L);
    await e.patchAdminShellRuntimeStatus(m, L, p);
    const E = e.renderAdminHtmlShell(b, R, U);
    return new Response(f.method === "HEAD" ? null : E, { headers: e.buildAdminHtmlResponseHeaders("", "no-store, max-age=0") });
  }
  async function i(f, m, p, g = $e(m), h = e.resolveAdminShellIndexUrl(m), y = {}) {
    const _ = ur(), S = e.buildAdminShellState(m, g, y), T = e.buildAdminBootstrapPayload(m, g, y), b = pt(m, y), R = {
      releaseTag: b.assetRevision || b.releaseTag,
      assetRevision: b.assetRevision || b.releaseTag,
      adminPath: T.adminPath,
      ...b.isLocalUpload ? { loadLocalIndexRecord: () => t.getAdminIndexUploadRecord(t.getKV(m), b.localUploadRevision) } : {}
    }, w = e.buildAdminRemoteShellCacheKeyRequest(f, h, T), L = e.buildAdminRemoteShellLegacyCacheKeyRequest(f, h), U = new URL(f.url).pathname;
    if (_ && typeof _.match == "function") {
      const x = await Kt(ct(["admin_remote_shell_cache_read", w.url]), async () => {
        const v = await _.match(w);
        if (v) {
          const I = await e.materializeAdminRemoteShellCachedResponse(v);
          if (I) return {
            storedResponse: I,
            legacyCacheMigrated: !1
          };
        }
        const P = await _.match(L);
        if (!P) return null;
        const C = await pe(e.migrateLegacyAdminRemoteShellStoredResponse(P, h, T, g), "admin.remote_shell_legacy_cache_read", {
          path: U,
          remoteShellIndexUrl: h
        }, null);
        return C ? await jn(w.url, async () => {
          const I = await _.match(w);
          if (I) {
            const M = await e.materializeAdminRemoteShellCachedResponse(I);
            if (M) return {
              storedResponse: M,
              legacyCacheMigrated: !1
            };
          }
          return typeof _.put == "function" && await pe(_.put(w, C.clone()), "admin.remote_shell_legacy_cache_migrate", {
            path: U,
            remoteShellIndexUrl: h
          }, null), {
            storedResponse: C,
            legacyCacheMigrated: !0
          };
        }) : null;
      }), O = x === null ? null : x.storedResponse.clone(), N = x !== null && x.legacyCacheMigrated;
      if (O) {
        const v = e.shouldRevalidateAdminRemoteShell(O);
        let P = null;
        if (v) {
          const M = O.clone();
          P = Kt(ct(["admin_remote_shell_revalidate", w.url]), async () => pe(jn(w.url, () => e.revalidateAdminRemoteShellCache(f, _, w, h, T, g, M, R, p)), "admin.remote_shell_revalidate", {
            path: U,
            remoteShellIndexUrl: h
          }, null));
        }
        const C = e.patchAdminShellRuntimeStatus(m, {
          shellState: S,
          initHealth: g,
          indexState: b,
          remoteShellIndexUrl: h,
          mode: "remote",
          sourceType: N ? "remote_legacy_cache" : "remote_cache",
          routeState: "remote_active",
          remoteCacheState: N ? v ? "legacy_stale_hit" : "legacy_hit" : v ? "stale_hit" : "hit",
          revalidateDue: v,
          lastFetchStatus: "cached",
          reason: N ? v ? "migrated_legacy_remote_shell_and_scheduled_revalidate" : "migrated_legacy_remote_shell" : v ? "served_cached_remote_shell_and_scheduled_revalidate" : "served_cached_remote_shell",
          requestPath: U,
          throttleStableWrites: !0
        }, null), I = P ? Promise.all([P, C]) : C;
        return p && typeof p.waitUntil == "function" && p.waitUntil(I), e.requestMatchesAdminHtmlResponse(f, O) ? e.buildConditionalNotModifiedResponseFromStoredResponse(O, e.ADMIN_REMOTE_SHELL_BROWSER_CACHE_CONTROL) : e.buildAdminRemoteShellClientResponse(O, f.method);
      }
    }
    const E = await e.loadAdminRemoteShellColdCache(_, w, h, T, g, R), D = (E?.storedResponse ? {
      ...E,
      storedResponse: E.storedResponse.clone()
    } : E)?.storedResponse || null;
    if (!D) throw new Error("remote admin shell payload missing");
    const A = Kt(ct(["admin_remote_shell_cold_status", w.url]), () => e.patchAdminShellRuntimeStatus(m, {
      shellState: S,
      initHealth: g,
      indexState: b,
      remoteShellIndexUrl: h,
      mode: "remote",
      sourceType: E?.loadedFromCache ? "remote_cache" : "remote_fetch",
      routeState: "remote_active",
      remoteCacheState: E?.loadedFromCache ? "filled_while_waiting" : "miss",
      lastFetchStatus: E?.loadedFromCache ? "cached" : "fetched",
      reason: E?.loadedFromCache ? "served_cache_filled_while_waiting" : "fetched_remote_shell_index",
      requestPath: U
    }, null));
    return p && typeof p.waitUntil == "function" ? p.waitUntil(A) : await A, e.requestMatchesAdminHtmlResponse(f, D) ? e.buildConditionalNotModifiedResponseFromStoredResponse(D, e.ADMIN_REMOTE_SHELL_BROWSER_CACHE_CONTROL) : e.buildAdminRemoteShellClientResponse(D, f.method);
  }
  function c(f = "Release vendor asset unavailable", m = 502) {
    const p = new Headers({
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "no-store, max-age=0"
    });
    return Ce(p), new Response(String(f || "Release vendor asset unavailable"), {
      status: m,
      headers: p
    });
  }
  var l = /(?:\/\/[#@]\s*sourceMappingURL=[^\r\n]*|\/\*[#@]\s*sourceMappingURL=[^*]*\*\/)\s*$/;
  function d(f) {
    const m = new TextDecoder().decode(f);
    if (!m.includes("sourceMappingURL")) return f;
    const p = m.replace(l, "");
    return p === m ? f : new TextEncoder().encode(p);
  }
  async function u(f, m, p, g = null, h = {}) {
    const y = mt(g?.releaseTag), _ = String(g?.assetKey || "").trim();
    if (!y || !_) return c("Release vendor asset not found", 404);
    const S = ur(), T = Lu(y);
    if (!T) return c("Local index vendor asset not found", 404);
    const b = T ? await t.getAdminIndexUploadRecord(t.getKV(m), T) : null;
    if (T && !b) return c("Local index vendor asset not found", 404);
    const R = b?.sourceUrl || "";
    if (!R) return c("Release vendor asset not found", 404);
    let w = null;
    b?.manifest ? (w = await e.readAdminReleaseVendorManifestFromCache(S, y, R), w || (w = await e.cacheAdminReleaseVendorManifest(S, b.manifest, p))) : w = await e.getOrCreateAdminReleaseVendorManifest(S, y, R, p);
    const L = e.resolveAdminReleaseVendorManifestEntry(w, _);
    if (!L?.upstreamUrl) return c("Release vendor asset not found", 404);
    const U = e.isMutableJsdelivrGithubAssetUrl(L.upstreamUrl), E = U ? e.ADMIN_RELEASE_VENDOR_MUTABLE_CACHE_CONTROL : e.ADMIN_RELEASE_VENDOR_CACHE_CONTROL, D = e.buildAdminReleaseVendorAssetCacheKeyRequest(y, _, L.upstreamUrl);
    if (!U && S && typeof S.match == "function") {
      const F = await S.match(D);
      if (F)
        return e.requestMatchesAdminHtmlResponse(f, F) ? e.buildConditionalNotModifiedResponseFromStoredResponse(F, E) : e.buildAdminReleaseVendorClientResponse(F, f.method);
    }
    let A = null;
    try {
      A = await Be(L.upstreamUrl, {
        method: "GET",
        headers: { Accept: L.assetKind === "css" ? "text/css, text/plain;q=0.9, */*;q=0.1" : "application/javascript, text/javascript, text/plain;q=0.9, */*;q=0.1" }
      });
    } catch (F) {
      return c(`Release vendor asset fetch failed: ${String(F?.message || F || "unknown_error").trim() || "unknown_error"}`, 502);
    }
    if (!A.ok) return c(A.status === 404 ? "Release vendor asset not found" : `Release vendor asset fetch failed (HTTP ${A.status})`, A.status === 404 ? 404 : 502);
    const x = String(A.headers.get("Content-Type") || "").trim();
    if (!e.isAcceptedAdminReleaseVendorContentType(x, L.assetKind)) return c(`Release vendor asset content-type invalid: ${x || "unknown"}`, 502);
    const O = Number.parseInt(String(A.headers.get("Content-Length") || ""), 10);
    if (Number.isFinite(O) && O > e.ADMIN_RELEASE_VENDOR_MAX_BYTES) return c(`Release vendor asset too large: ${O} bytes`, 502);
    const N = await ei(A, e.ADMIN_RELEASE_VENDOR_MAX_BYTES), v = N.bytes;
    if (N.exceeded || !v || v > e.ADMIN_RELEASE_VENDOR_MAX_BYTES) return c(`Release vendor asset payload invalid: ${v} bytes`, 502);
    const P = new Headers({ "Cache-Control": E }), C = e.normalizeEtagToken(A.headers.get("ETag") || ""), I = e.normalizeAdminHttpDateHeader(A.headers.get("Last-Modified") || "");
    x && P.set("Content-Type", x), C && P.set("ETag", e.formatAdminHtmlEtag(C)), I && P.set("Last-Modified", I), P.set(e.ADMIN_RELEASE_VENDOR_CACHED_AT_HEADER, String(H())), P.set(e.ADMIN_RELEASE_VENDOR_SOURCE_HASH_HEADER, ne(L.upstreamUrl));
    const M = new Response(d(N.bodyBytes), {
      status: 200,
      headers: P
    });
    if (!U && S && typeof S.put == "function") {
      const F = pe(S.put(D, M.clone()), "admin.release_vendor_cache_write", {
        releaseTag: y,
        assetKey: _
      }, null);
      p && typeof p.waitUntil == "function" ? p.waitUntil(F) : await F;
    }
    return e.requestMatchesAdminHtmlResponse(f, M) ? e.buildConditionalNotModifiedResponseFromStoredResponse(M, E) : e.buildAdminReleaseVendorClientResponse(M, f.method);
  }
  return {
    renderBundledAdminPage: r,
    renderAdminIndexSetupPage: a,
    isAdminIndexSetupForced: n,
    renderAdminRemoteShellErrorPage: s,
    renderRemoteAdminPage: i,
    buildAdminReleaseVendorErrorResponse: c,
    renderAdminReleaseVendorAsset: u
  };
}
function fd(o = {}) {
  return {
    ...ci,
    ...ia,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    ...o
  };
}
function Q(o, e = 200, t = {}) {
  return new Response(JSON.stringify(o), {
    status: e,
    headers: fd(t)
  });
}
function z(o, e, t = 400, r = null, a = {}) {
  const n = {
    ok: !1,
    error: {
      code: o,
      message: e
    }
  };
  return r != null && (n.error.details = r), Q(n, t, a);
}
async function md(o) {
  const e = new Headers(o.headers || {});
  if (e.set("Content-Type", "application/json; charset=utf-8"), e.set("Cache-Control", "no-store, max-age=0"), Object.entries(ia).forEach(([c, l]) => e.set(c, l)), Ce(e), o.ok) return new Response(o.body, {
    status: o.status,
    headers: e
  });
  const t = await Ne(o, sn);
  let r = null;
  const a = t.text;
  try {
    r = JSON.parse(a);
  } catch {
  }
  const n = r?.error?.code || (typeof r?.error == "string" ? r.error.toUpperCase() : `HTTP_${o.status}`), s = r?.error?.message || r?.message || (typeof r?.error == "string" ? r.error : a || o.statusText || "request_failed"), i = r?.error?.details ?? r?.details ?? null;
  return z(n, s, o.status || 500, i);
}
function Pr(o = "") {
  return String(o || "").trim().toLowerCase() === "simplified" ? "simplified" : "legacy";
}
function zi(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "balanced" ? "balanced" : e === "aggressive" ? "aggressive" : "compat";
}
function Mo(o = {}) {
  const e = o?.enableH2 === !0, t = o?.enableH3 === !0;
  return !e && !t ? "compat" : o?.peakDowngrade === !1 ? "aggressive" : "balanced";
}
var Wi = Object.freeze([
  {
    kind: "summary",
    configKey: "tgDailyReportSummaryEnabled"
  },
  {
    kind: "kv",
    configKey: "tgDailyReportKvEnabled"
  },
  {
    kind: "d1",
    configKey: "tgDailyReportD1Enabled"
  }
]);
function Gi(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "summary" || e === "kv" || e === "d1" ? e : "";
}
function pd(o = []) {
  const e = [], t = /* @__PURE__ */ new Set();
  for (const r of Array.isArray(o) ? o : [o]) {
    const a = Gi(r);
    !a || t.has(a) || (t.add(a), e.push(a));
  }
  return e;
}
function gd(o = {}) {
  return Wi.some(({ configKey: e }) => da(o, e));
}
function ji(o = {}, e = o) {
  const t = o && typeof o == "object" ? o : {}, r = e && typeof e == "object" ? e : {};
  return t.tgDailyReportEnabled === !0 && !gd(r);
}
function hd(o = {}, e = {}) {
  const t = o && typeof o == "object" ? o : {};
  return ji(t, e && typeof e == "object" ? e : {}) ? (t.tgDailyReportSummaryEnabled = !0, t.tgDailyReportKvEnabled = !1, t.tgDailyReportD1Enabled = !1, t) : (t.tgDailyReportSummaryEnabled = t.tgDailyReportSummaryEnabled === !0, t.tgDailyReportKvEnabled = t.tgDailyReportKvEnabled === !0, t.tgDailyReportD1Enabled = t.tgDailyReportD1Enabled === !0, t);
}
function Vi(o = {}, e = o, t = {}) {
  const r = o && typeof o == "object" ? o : {}, a = pd(t?.reportKinds);
  if (a.length > 0) return a;
  const n = Wi.filter(({ configKey: s }) => r[s] === !0).map(({ kind: s }) => s);
  return n.length > 0 ? n : t?.fallbackAllWhenLegacy === !0 && ji(r, e) ? ["summary"] : [];
}
function yd(o = {}) {
  return Pr(o?.routingDecisionMode);
}
function xr(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "legacy" || e === "simplified" ? e : "inherit";
}
function Sd(o = {}, e = {}) {
  const t = xr(o?.routingDecisionMode);
  return t === "inherit" ? yd(e) : t;
}
function ir(o) {
  const e = String(o ?? "").trim();
  if (!e) return "";
  if (!/^\d{1,5}$/.test(e)) return null;
  const t = Number(e);
  return !Number.isInteger(t) || t < 1 || t > 65535 ? null : String(t);
}
function _d(o) {
  return o === "http:" ? "80" : o === "https:" ? "443" : "";
}
function bd(o) {
  const e = String(o?.username || ""), t = String(o?.password || "");
  return !e && !t ? "" : `${e}${t ? `:${t}` : ""}@`;
}
function Ed(o, e = "") {
  if (!(o instanceof URL)) return "";
  const t = String(o.protocol || "").trim().toLowerCase();
  if (!["http:", "https:"].includes(t)) return "";
  const r = ir(e);
  if (r === null) return "";
  const a = String(o.hostname || "").trim();
  if (!a) return "";
  const n = String(o.pathname || "/") || "/", s = String(o.search || ""), i = String(o.hash || "");
  return `${t}//${bd(o)}${a}${r ? `:${r}` : ""}${n}${s}${i}`.replace(/\/$/, "");
}
function ps(o, e = "", t = "") {
  const r = String(o || "").trim();
  if (!r) return null;
  try {
    const a = new URL(r);
    if (!["http:", "https:"].includes(a.protocol)) return null;
    const n = ir(a.port), s = ir(e), i = ir(t);
    return n === null || s === null || i === null ? null : Ed(a, n || s || i || _d(a.protocol)) || null;
  } catch {
    return null;
  }
}
function Td(o = "") {
  const e = String(o || "").trim();
  if (!e) return !1;
  try {
    const t = new URL(e);
    if (!["http:", "https:"].includes(t.protocol)) return !1;
    const r = e.match(/^[a-z][a-z0-9+.-]*:\/\/([^/?#]*)/i);
    if (!r) return !1;
    let a = String(r[1] || "");
    const n = a.lastIndexOf("@");
    if (n >= 0 && (a = a.slice(n + 1)), !a) return !1;
    if (a.startsWith("[")) {
      const s = a.indexOf("]");
      return s < 0 ? !1 : /^:\d+$/.test(a.slice(s + 1));
    }
    return /:\d+$/.test(a);
  } catch {
    return !1;
  }
}
function gs(o = "") {
  const e = String(o || "").trim();
  if (!e) return !1;
  try {
    const t = new URL(e);
    return ["http:", "https:"].includes(t.protocol) ? !Td(e) : !1;
  } catch {
    return !1;
  }
}
function _e(o) {
  return JSON.stringify(String(o ?? ""));
}
function Pt(o = "/") {
  const e = Y(o || "/");
  return e === "/" ? "" : e.replace(/\/+$/, "");
}
function pn(o) {
  try {
    const e = o instanceof URL ? o : new URL(String(o || ""));
    if (!["http:", "https:"].includes(e.protocol)) return null;
    const t = String(e.origin || "").trim();
    if (!t) return null;
    const r = Pt(e.pathname);
    return {
      targetUrl: e,
      originText: t,
      normalizedBasePath: r,
      absoluteBasePrefix: `${t}${r}`
    };
  } catch {
    return null;
  }
}
function je(o) {
  return Ze(o) ? String(o.absoluteBasePrefix || o.originText || "").trim() : "";
}
function Rd(o = []) {
  return ne(ee((Array.isArray(o) ? o : []).map((e) => je(e)).filter(Boolean)));
}
function Ad(o = []) {
  return new Set((Array.isArray(o) ? o : []).map((e) => je(e)).filter(Boolean)).size;
}
function Na(o = "", e = k.Defaults.HedgeProbePath) {
  const t = String(o || e || "").trim() || String(e || "/emby/system/ping").trim() || "/emby/system/ping";
  try {
    return Y(new URL(t, "https://hedge-probe.invalid").pathname || "/");
  } catch {
    return Y(t);
  }
}
function la(o = "") {
  const e = String(o || "").trim();
  return e ? Na(e, k.Defaults.HedgeProbePath) : "";
}
function Ze(o) {
  return !!o && typeof o == "object" && o.targetUrl instanceof URL && typeof o.originText == "string" && typeof o.normalizedBasePath == "string" && typeof o.absoluteBasePrefix == "string";
}
function hs(o = "") {
  const e = String(o || "");
  return e ? e.startsWith("?") ? e : `?${e}` : "";
}
function Cd(o = "GET", e = {}, t = {}) {
  const r = String(o || "GET").toUpperCase();
  return !(r !== "GET" && r !== "HEAD" || e?.isSegment !== !0 || e?.isWsUpgrade === !0 || t.playbackRelayTargetUrl instanceof URL || t.protocolFallbackRetry === !0 || t.isExternalRedirect === !0);
}
var Po = ["proxyMode", "mode"], xo = [
  "direct",
  "sourceDirect",
  "directSource",
  "direct2xx"
], wd = [
  "wangpanMode",
  "videoThrottling",
  "interceptMs"
], qi = "__playback-relay", Xi = "__pb_target", Vn = "__pb_abs", qn = Object.freeze({
  main: "",
  proxy_a: "__proxy-a",
  proxy_b: "__proxy-b"
});
function Ld(o = {}) {
  const e = o && typeof o == "object" && !Array.isArray(o) ? o : {}, t = [];
  let r = !1;
  const a = ir(e.port), n = Array.isArray(e.lines) ? e.lines.reduce((i, c) => i + (ir(c?.port) ? 1 : 0), 0) : 0, s = Array.isArray(e.lines) && e.lines.length ? e.lines.reduce((i, c) => ir(c?.port) || a ? i : i + (gs(c?.target) ? 1 : 0), 0) : a ? 0 : String(e.target || "").split(",").map((i) => i.trim()).filter(Boolean).reduce((i, c) => i + (gs(c) ? 1 : 0), 0);
  for (const i of Po) {
    if (!Object.prototype.hasOwnProperty.call(e, i)) continue;
    t.push(i);
    const c = String(e[i] || "").trim().toLowerCase();
    [
      "direct",
      "source-direct",
      "origin-direct",
      "node-direct"
    ].includes(c) && (r = !0);
  }
  for (const i of xo)
    Object.prototype.hasOwnProperty.call(e, i) && (t.push(i), e[i] === !0 && (r = !0));
  for (const i of wd)
    Object.prototype.hasOwnProperty.call(e, i) && t.push(i);
  return {
    legacyKeysPresent: Zt(t),
    shouldAddToSourceDirectNodes: r,
    topLevelPortPresent: a !== null && a !== "",
    linePortCount: n,
    defaultPortNodePresent: s > 0,
    defaultPortLineCount: s
  };
}
function Nd(o, e = {}) {
  const t = Hr(o);
  return {
    mode: t,
    forceVideoDirect: t === "direct",
    forceVideoProxy: t === "proxy"
  };
}
function Dd(o = {}) {
  return ui(o?.defaultMediaAuthMode);
}
function Va(o = {}) {
  return da(o, "defaultPlaybackInfoMode") ? Gt(o?.defaultPlaybackInfoMode) : Reflect.get(o, "playbackInfoAutoProxy") !== void 0 ? Reflect.get(o, "playbackInfoAutoProxy") !== !1 ? "rewrite" : "passthrough" : Reflect.get(o, "playbackInfoBlockWangpanProxy") !== void 0 ? "rewrite" : k.Defaults.DefaultPlaybackInfoMode;
}
function Id(o = {}) {
  return Gt(Va(o));
}
function Md(o = {}) {
  return So(o?.defaultRealClientIpMode);
}
function Pd(o = {}, e = {}) {
  const t = o || {}, r = o && typeof o == "object" && Object.prototype.hasOwnProperty.call(o, "mediaAuthMode") ? Bt(t.mediaAuthMode) : "auto";
  return r === "inherit" ? Dd(e) : r;
}
function xd(o = {}, e = {}) {
  const t = o || {}, r = o && typeof o == "object" && Object.prototype.hasOwnProperty.call(o, "playbackInfoMode") ? Dr(t.playbackInfoMode) : "inherit";
  return r === "inherit" ? Id(e) : r;
}
function Od(o = {}, e = {}) {
  const t = o || {}, r = o && typeof o == "object" && Object.prototype.hasOwnProperty.call(o, "realClientIpMode") ? Nr(t.realClientIpMode) : "forward";
  return r === "inherit" ? Md(e) : r;
}
function vd(o = {}, e = {}) {
  const t = o || {};
  return (o && typeof o == "object" && Object.prototype.hasOwnProperty.call(o, "hedgeProbePath") ? la(t.hedgeProbePath) : "") || Na(e?.hedgeProbePath, k.Defaults.HedgeProbePath);
}
function Fd(o) {
  const e = So(typeof o == "string" ? o : o?.realClientIpMode);
  return e === "forward" ? "full" : e === "strip" ? "real-ip-only" : e === "disable" ? "none" : "full";
}
function Yi(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "proxy_a" || e === "__proxy-a" ? "proxy_a" : e === "proxy_b" || e === "__proxy-b" ? "proxy_b" : "main";
}
function Ud(o = "main") {
  return qn[Yi(o)] || "";
}
function Ji(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e ? e === qn.proxy_a ? "proxy_a" : e === qn.proxy_b ? "proxy_b" : "main" : "main";
}
function sa(o = "") {
  const e = String(o || "");
  if (!e) return {
    linkVariant: "main",
    remaining: "",
    needsTrailingSlashRedirect: !1
  };
  const t = e.startsWith("/") ? e : "/" + e, r = t.split("/"), a = Ji(It(r[1] || ""));
  return a === "main" ? {
    linkVariant: a,
    remaining: Y(t),
    needsTrailingSlashRedirect: !1
  } : {
    linkVariant: a,
    remaining: Y("/" + r.slice(2).join("/")),
    needsTrailingSlashRedirect: r.length === 2 && !t.endsWith("/")
  };
}
function Da(o = {}) {
  return o.ENI_KV || o.KV || o.EMBY_KV || o.EMBY_PROXY || null;
}
function kd(o = {}) {
  return o.DB || o.D1 || o.PROXY_LOGS || null;
}
var Hd = 16 * 1024;
async function gt(o, e) {
  const t = new TextEncoder(), r = Date.now();
  let a = te.CryptoKeyCache.get(o);
  for ((!a || a.exp <= r) && (a = {
    key: await Fn().importKey("raw", t.encode(o), {
      name: "HMAC",
      hash: "SHA-256"
    }, !1, ["sign"]),
    exp: r + k.Defaults.CryptoKeyCacheTTL * 1e3
  }), te.CryptoKeyCache.has(o) && te.CryptoKeyCache.delete(o), te.CryptoKeyCache.set(o, a); te.CryptoKeyCache.size > k.Defaults.CryptoKeyCacheMax; ) {
    const s = te.CryptoKeyCache.keys().next().value;
    if (s === void 0) break;
    te.CryptoKeyCache.delete(s);
  }
  const n = await Fn().sign("HMAC", a.key, t.encode(e));
  return btoa(String.fromCharCode(...new Uint8Array(n))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var $d = class {
  constructor({ actionHandlers: o, bindingService: e, configReader: t, repository: r, requestModel: a, shellService: n }) {
    this.actionHandlers = Object.freeze({ ...o }), this.bindingService = e, this.configReader = t, this.repository = r, this.requestModel = a, this.shellService = n, this.actionAliases = Object.freeze({
      import: "saveOrImport",
      save: "saveOrImport"
    }), this.#t();
  }
  async handle(o, e, t) {
    const r = this.#c(o, e), { requestHost: a, configuredHost: n, configuredLegacyHost: s } = r, i = o.method, c = i === "GET" || i === "HEAD";
    if (c && r.pathnameLower === "/favicon.ico") return this.#_(i);
    const l = await this.configReader.getRuntimeConfig(e), d = !!(s && s !== n && a === s), u = l.enableHostPrefixProxy === !0 && !!n && !d, f = u ? Eo(a, n) : null, m = !!(u && a !== n && a.endsWith(`.${n}`));
    if (f || m) return null;
    if (i === "GET" && r.normalizedPathname === "/") return this.#m(e, r.initHealth);
    const p = c ? this.#b(r.normalizedPathname, r.adminPath) : null;
    if (p)
      return await this.#a(o, e) ? this.#y(o, e, t, p, l) : this.#T("Unauthorized", 401);
    if (c && this.#E(r.normalizedPathname, r.adminPath))
      return await this.#a(o, e) ? this.#S(o, e, r.initHealth, l) : this.#g(o, r.adminLoginPath);
    if (c && Ar(r.pathnameLower, r.adminLoginPathLower))
      return await this.#a(o, e) ? this.#g(o, r.adminPath) : this.#p(o, e, r.initHealth);
    if (c && Ar(r.pathnameLower, r.adminPathLower))
      return await this.#a(o, e) ? this.#h(o, e, t, r.initHealth) : this.#g(o, r.adminLoginPath);
    if (i === "OPTIONS" && this.#r(r)) return this.#i(o, e, null);
    if (i === "POST" && (Ar(r.pathnameLower, r.adminLoginPathLower) || this.#n(r))) return this.#l(o, e);
    if (i !== "POST" || !Ar(r.pathnameLower, r.adminPathLower)) return null;
    if (!await this.#a(o, e)) return z("UNAUTHORIZED", "未授权", 401);
    try {
      return await md(await this.#s(o, e, t));
    } catch (g) {
      const h = Ul(g, {
        code: "INTERNAL_ERROR",
        message: "Server Error",
        status: 500
      });
      return Ae("admin_api.unhandled_error", g, {
        path: r.pathnameLower,
        method: i,
        responseCode: h.code,
        responseStatus: h.status
      }, "error"), z(h.code, h.message, h.status, h.details);
    }
  }
  #t() {
    for (const [o, e] of Object.entries(this.actionHandlers)) {
      if (!this.#e(o)) throw new TypeError("Admin action names cannot be empty");
      if (typeof e != "function") throw new TypeError(`Admin action ${o} is not a function`);
    }
    for (const [o, e] of Object.entries(this.actionAliases)) if (!this.actionHandlers[e]) throw new Error(`Admin action alias ${o} targets missing action ${e}`);
  }
  #e(o) {
    return String(o || "").trim();
  }
  #o(o) {
    const e = this.#e(o), t = this.actionAliases[e] || e;
    return this.actionHandlers[t] || null;
  }
  async #s(o, e, t) {
    const r = this.bindingService.getKV(e);
    if (!r) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
    let a;
    try {
      const i = await Ne(o, vi);
      if (i.exceeded) return z("REQUEST_TOO_LARGE", "请求体过大", 413);
      a = JSON.parse(i.text || "");
    } catch {
      return z("INVALID_JSON", "请求 JSON 无效", 400);
    }
    const n = this.requestModel.normalizeAdminActionRequest(a);
    if (!n) return z("INVALID_REQUEST", "请求体必须是 JSON 对象", 400);
    const s = this.#o(n.action);
    return s ? s(n.data, {
      action: n.action,
      meta: n.meta,
      request: o,
      env: e,
      ctx: t,
      kv: r,
      db: this.bindingService.getDB(e)
    }) : z("INVALID_ACTION", "未知的管理动作", 400, { action: n.action || null });
  }
  #n(o) {
    return o.adminPathLower === "/admin" && o.pathnameLower === "/api/auth/login" && o.root === "api" && o.segments[1] === "auth" && o.segments[2] === "login";
  }
  #r(o) {
    return Hi(o.pathnameLower, o.adminPathLower) || Ar(o.pathnameLower, o.adminLoginPathLower) || this.#n(o);
  }
  #i(o, e, t, r = 200) {
    return this.shellService.buildEdgeCorsResponse(Yr(e, o), t, r, { mergeOriginVary: !0 });
  }
  #c(o, e) {
    const t = new URL(o.url), r = re(t.hostname), a = Y(t.pathname), n = a.toLowerCase(), s = it(e), i = s.toLowerCase(), c = dn(s), l = c.toLowerCase(), d = Bi(e, {
      adminPath: s,
      loginPath: c
    }), u = a.split("/").filter(Boolean), f = u[0] || "", m = It(f).toLowerCase();
    return {
      initHealth: d,
      requestUrl: t,
      requestHost: r,
      configuredHost: ze(e),
      configuredLegacyHost: Kr(e),
      normalizedPathname: a,
      pathnameLower: n,
      adminPath: s,
      adminPathLower: i,
      adminLoginPath: c,
      adminLoginPathLower: l,
      segments: u,
      rootRaw: f,
      root: m
    };
  }
  async #l(o, e) {
    const t = o.headers.get("cf-connecting-ip") || "unknown", r = this.repository.getDB(e), a = nd(e), n = await this.configReader.getRuntimeConfig(e), s = Math.max(1, parseInt(n.jwtExpiryDays) || 30) * 86400;
    try {
      const i = await pe(this.repository.getAuthFailureEntry(r, t), "auth.login.read_auth_failure", { ip: t }, null), c = Math.max(0, Number(i?.failCount) || 0);
      if (c >= k.Defaults.MaxLoginAttempts) return z("TOO_MANY_ATTEMPTS", "账户已锁定，请稍后再试", 429);
      let l = "";
      if ((o.headers.get("content-type") || "").includes("application/json")) {
        const u = await Ne(o, Hd);
        if (u.exceeded) return z("REQUEST_TOO_LARGE", "请求体过大", 413);
        const f = JSON.parse(u.text || "{}");
        l = typeof f.password == "string" ? f.password : "";
      }
      if (!e.JWT_SECRET) return z("SERVER_MISCONFIGURED", "JWT_SECRET 未配置", 503);
      if (!e.ADMIN_PASS) return z("SERVER_MISCONFIGURED", "ADMIN_PASS 未配置", 503);
      if (l && l === e.ADMIN_PASS) {
        i && await pe(this.repository.deleteAuthFailureEntry(r, t), "auth.login.clear_auth_failure", { ip: t }, !1);
        const u = await this.#u(e.JWT_SECRET, s);
        return Q({
          ok: !0,
          expiresIn: s
        }, 200, { "Set-Cookie": `auth_token=${u}; Path=${a}; Max-Age=${s}; HttpOnly; Secure; SameSite=Strict` });
      }
      const d = c + 1;
      return await pe(this.repository.upsertAuthFailureEntry(r, t, {
        failCount: d,
        expiresAt: H() + k.Defaults.LoginLockDuration * 1e3
      }), "auth.login.write_auth_failure", {
        ip: t,
        nextFailCount: d
      }, null), Q({
        ok: !1,
        error: {
          code: "INVALID_PASSWORD",
          message: "密码错误"
        },
        remain: Math.max(0, k.Defaults.MaxLoginAttempts - d)
      }, 401);
    } catch (i) {
      return z("INVALID_REQUEST", "请求无效", 400, { reason: i.message });
    }
  }
  async #a(o, e) {
    try {
      const t = e.JWT_SECRET;
      if (!t) return !1;
      const r = o.headers.get("Authorization") || "";
      let a = r.startsWith("Bearer ") ? r.slice(7) : null;
      if (!a) {
        const n = (o.headers.get("Cookie") || "").match(/(?:^|;\s*)auth_token=([^;]+)/);
        a = n ? n[1] : null;
      }
      return a ? await this.#d(a, t) : !1;
    } catch {
      return !1;
    }
  }
  async #u(o, e) {
    const t = btoa(JSON.stringify({
      alg: "HS256",
      typ: "JWT"
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), r = btoa(JSON.stringify({
      sub: "admin",
      exp: Math.floor(Date.now() / 1e3) + e
    })).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `${t}.${r}.${await this.#f(o, `${t}.${r}`)}`;
  }
  async #d(o, e) {
    const t = o.split(".");
    if (t.length !== 3 || t[2] !== await this.#f(e, `${t[0]}.${t[1]}`)) return !1;
    try {
      return JSON.parse(atob(t[1].replace(/-/g, "+").replace(/_/g, "/"))).exp > Math.floor(Date.now() / 1e3);
    } catch {
      return !1;
    }
  }
  async #f(o, e) {
    return gt(o, e);
  }
  #m(o, e) {
    return this.shellService.renderLandingPage(o, e);
  }
  #p(o, e, t) {
    return this.shellService.renderAdminLoginPage(o, e, t);
  }
  #h(o, e, t, r) {
    return this.shellService.renderAdminPage(o, e, t, r);
  }
  #y(o, e, t, r, a) {
    return this.shellService.renderAdminReleaseVendorAsset(o, e, t, r, a);
  }
  #S(o, e, t, r) {
    return this.shellService.renderAdminWarmResponse(o, e, t, r);
  }
  #_(o) {
    return this.shellService.renderFaviconResponse(o);
  }
  #b(o, e) {
    return this.shellService.resolveAdminReleaseVendorRouteMatch(o, e);
  }
  #E(o, e) {
    return this.shellService.isAdminWarmRoute(o, e);
  }
  #g(o, e) {
    return this.shellService.buildRequestPathRedirectResponse(o, e);
  }
  #T(...o) {
    return this.shellService.buildAdminReleaseVendorErrorResponse(...o);
  }
};
function Qi(o = "", e = "") {
  const t = String(o || "").trim().toLowerCase(), r = String(e || "").trim().toLowerCase();
  return r === "image" || t.includes("/images/") || t.includes("/emby/covers/") || /\.(jpe?g|png|webp|gif)(?:$|[?#])/.test(t) ? "image_poster" : t.includes("/sessions/playing") || t.includes("/playbackinfo") ? "playback_info" : t.includes("/users/authenticate") ? "auth" : t.includes("/items/") || t.includes("/shows/") || t.includes("/movies/") || t.includes("/users/") ? "media_metadata" : r || "api";
}
function Bd(o = "", e = "") {
  return Qi(o, e) === "playback_info";
}
function Kd(o = "", e = "") {
  const t = String(o || "").trim().toLowerCase(), r = String(e || "").trim().toLowerCase();
  return r === "stream" || r === "segment" || r === "manifest" ? !0 : /\/stream(?:$|[/?])/.test(t) || t.includes("/master.m3u8") || /\/videos\/[^/]+\/(?:original|download|file)(?:$|[/?])/.test(t) || /\/items\/[^/]+\/download(?:$|[/?])/.test(t) || t.includes("static=true") || t.includes("download=true");
}
function Zi(o) {
  return String(o || "").trim().toLowerCase().replace(/[\s-]+/g, "_") === "poster_manifest" ? "poster_manifest" : "poster";
}
function ec(o) {
  const e = String(o || "").trim().toLowerCase();
  return e === "fts" ? "fts" : e === "like" ? "like" : k.Defaults.LogSearchMode;
}
function tc(o) {
  return String(o || "").trim().toLowerCase() === "error" ? "error" : k.Defaults.LogWriteMode;
}
function zd(o) {
  const e = String(o || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return e === "playback" || e === "playback_info" ? "playback_info" : e === "image" ? "image" : e === "api" ? "api" : e === "auth" ? "auth" : "";
}
function Wd(o) {
  const e = String(o || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return e === "4xx" || e === "status_4xx" ? "4xx" : e === "5xx" || e === "status_5xx" ? "5xx" : "";
}
function ys(o) {
  const e = String(o || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return e === "direct" ? "direct" : e === "proxy" || e === "proxied" ? "proxy" : "";
}
function Gd(o = "") {
  const e = String(o || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return e === "connect_timeout" ? "connect_timeout" : e === "idle_timeout" ? "idle_timeout" : e === "tls_handshake_failed" ? "tls_handshake_failed" : e === "http_version_fallback" ? "http_version_fallback" : e === "redirect_loop" ? "redirect_loop" : e === "redirect_limit_exceeded" ? "redirect_limit_exceeded" : e === "range_unsatisfied" ? "range_unsatisfied" : e === "upstream_4xx" ? "upstream_4xx" : e === "upstream_5xx" ? "upstream_5xx" : e === "unknown_fetch_error" ? "unknown_fetch_error" : "";
}
var jd = Object.freeze({
  400: Object.freeze({
    code: "bad_request",
    text: "请求格式无效或参数不符合上游要求"
  }),
  401: Object.freeze({
    code: "unauthorized",
    text: "请求缺少有效身份凭证，或当前登录态已失效"
  }),
  403: Object.freeze({
    code: "forbidden",
    text: "请求已被识别，但当前账号、策略或源站规则拒绝访问"
  }),
  404: Object.freeze({
    code: "not_found",
    text: "请求路径或目标资源不存在"
  }),
  405: Object.freeze({
    code: "method_not_allowed",
    text: "当前请求方法不被目标接口允许"
  }),
  429: Object.freeze({
    code: "too_many_requests",
    text: "请求频率超过当前限流阈值，服务暂时拒绝继续处理"
  }),
  500: Object.freeze({
    code: "internal_server_error",
    text: "源站或代理在处理请求时发生内部错误"
  }),
  501: Object.freeze({
    code: "not_implemented",
    text: "源站或上游链路尚未实现当前请求所需能力"
  }),
  502: Object.freeze({
    code: "bad_gateway",
    text: "网关无法从上游获得有效响应，或源站当前不可达"
  }),
  503: Object.freeze({
    code: "service_unavailable",
    text: "源站暂时不可用，可能处于维护、重启或过载状态"
  }),
  504: Object.freeze({
    code: "gateway_timeout",
    text: "网关等待上游响应超时"
  }),
  505: Object.freeze({
    code: "http_version_not_supported",
    text: "目标链路不支持当前请求所使用的 HTTP 版本"
  }),
  520: Object.freeze({
    code: "cf_unknown_origin_error",
    text: "Cloudflare 已到达源站，但源站返回了无法归类的异常响应"
  }),
  521: Object.freeze({
    code: "cf_web_server_down",
    text: "Cloudflare 已到达源站网络，但源站拒绝连接或未监听目标端口"
  }),
  522: Object.freeze({
    code: "cf_connection_timed_out",
    text: "Cloudflare 与源站建立连接超时"
  }),
  523: Object.freeze({
    code: "cf_origin_unreachable",
    text: "Cloudflare 无法路由到源站网络，或源站 DNS/网络不可达"
  }),
  524: Object.freeze({
    code: "cf_origin_timeout",
    text: "Cloudflare 已与源站建立连接，但源站在超时窗口内未返回完整响应"
  }),
  525: Object.freeze({
    code: "cf_ssl_handshake_failed",
    text: "Cloudflare 与源站的 TLS 握手失败"
  }),
  526: Object.freeze({
    code: "cf_invalid_ssl_certificate",
    text: "Cloudflare 校验源站证书时判定该证书无效"
  }),
  530: Object.freeze({
    code: "cf_origin_dns_error",
    text: "源站 DNS 解析或 Cloudflare 到源站的访问链路存在致命错误"
  })
});
function Vd(o) {
  const e = Math.trunc(Number(o) || 0);
  if (!Number.isFinite(e) || e <= 0) return {
    code: null,
    text: null
  };
  const t = jd[e];
  return t ? {
    code: t.code,
    text: t.text
  } : {
    code: null,
    text: null
  };
}
function qd(o) {
  const e = String(o || "").trim();
  return e ? /\b(?:AND|OR|NOT|NEAR)\b/i.test(e) || /(?:^|\s)(?:node_name|request_path|user_agent|error_detail)\s*:/i.test(e) || /(?:^|\s)[^\s"]+\*/.test(e) ? !0 : /^"(?:[^"]|"")+"$/.test(e) : !1;
}
function rc(o) {
  return `"${String(o || "").replace(/"/g, '""')}"`;
}
function Xd(o) {
  return `${rc(o)}*`;
}
function Yd(o) {
  return String(o || "").replace(/(^|\s)((?:node_name|request_path|user_agent|error_detail)\s*:\s*)([^"\s()]+)(?=\s|$)/gi, (e, t, r, a) => `${t}${r}${rc(a)}`);
}
function Jd(o) {
  const e = String(o || "").trim();
  return e ? qd(e) ? Yd(e) : e.split(/\s+/).filter(Boolean).map((t) => Xd(t)).join(" AND ") : "";
}
function ac(o = null) {
  if (!o || typeof o != "object") return null;
  const e = Math.floor(Number(o.timestamp)), t = Math.floor(Number(o.id));
  return !Number.isFinite(e) || !Number.isFinite(t) || e < 0 || t < 0 ? null : {
    timestamp: e,
    id: t
  };
}
function Qd(o = null) {
  return ac({
    timestamp: Number(o?.timestamp),
    id: Number(o?.id)
  });
}
function ce(o) {
  return `"${String(o || "").replace(/"/g, '""')}"`;
}
function Cr(o) {
  return String(o || "").toLowerCase().replace(/["`[\]]/g, "").replace(/\s+/g, " ").trim();
}
function Oo(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "paid" ? "paid" : e === "free" ? "free" : "";
}
function gr(o = "") {
  const e = String(o || "").trim().toUpperCase();
  return e === "A" || e === "AAAA" || e === "CNAME";
}
function ka(o, e, t = {}) {
  const r = String(o || "").trim().toUpperCase(), a = String(e || "").trim(), n = t.allowCname !== !1;
  if (!gr(r)) return "Type 仅允许 A / AAAA / CNAME";
  if (!n && r === "CNAME") return "A 模式仅允许 A / AAAA";
  if (!a) return "Content 不能为空";
  if (r === "A" && !wa(a)) return "A 记录 Content 必须是合法 IPv4 地址";
  if (r === "AAAA" && !ln(a)) return "AAAA 记录 Content 必须是合法 IPv6 地址";
  if (r === "CNAME") {
    if (/\s/.test(a)) return "CNAME 记录 Content 不能包含空格";
    if (a.length > 255) return "CNAME 记录 Content 过长";
  }
  return "";
}
function Zd(o = "") {
  const e = String(o || "").trim();
  return e ? ka("CNAME", e) ? "" : e : "";
}
var ef = [
  "logIncludeClientIp",
  "logIncludeColo",
  "logIncludeUa"
], tf = [
  "playbackInfoAutoProxy",
  "playbackInfoBlockWangpanProxy",
  "sameOriginRedirectProxy",
  "externalRedirectProxy",
  "clientVisibleSameOriginRedirects",
  "clientVisibleExternalRedirects",
  "clientVisibleRedirects",
  "enableWangpanDirect",
  "wangpandirect",
  "tgDailyReportTime"
], nc = ["directSourceNodes", "nodeDirectList"], rf = ["sourceSameOriginProxy", "forceExternalProxy"], oc = [
  "enableH2",
  "enableH3",
  "peakDowngrade"
], Ss = [
  ...ef,
  ...tf,
  ...nc,
  ...rf,
  ...oc
], sc = {
  allowedFields: [
    "uiRadiusPx",
    "settingsExperienceMode",
    "indexUrl",
    "cfQuotaPlanOverride",
    "protocolStrategy",
    "protocolFallback",
    "enableHostPrefixProxy",
    "enablePrewarm",
    "prewarmDepth",
    "prewarmCacheTtl",
    "prewarmPrefetchBytes",
    "disablePrewarmPrefetch",
    "routingDecisionMode",
    "playbackInfoCacheEnabled",
    "playbackInfoCacheTtlSec",
    "videoProgressForwardEnabled",
    "videoProgressForwardIntervalSec",
    "defaultPlaybackInfoMode",
    "defaultRealClientIpMode",
    "defaultMediaAuthMode",
    "directStaticAssets",
    "directHlsDash",
    "multiLinkCopyPanelEnabled",
    "dashboardShowD1WriteHotspot",
    "dashboardShowKvD1Status",
    "sourceDirectNodes",
    "dnsDefaultFallbackCname",
    "defaultHostPrefixCnameTarget",
    "pingTimeout",
    "pingCacheMinutes",
    "hedgeFailoverEnabled",
    "hedgeProbePreferGet",
    "hedgeProbePath",
    "hedgeProbeTimeoutMs",
    "hedgeProbeParallelism",
    "hedgeWaitTimeoutMs",
    "hedgeLockTtlMs",
    "hedgePreferredTtlSec",
    "hedgeFailureCooldownSec",
    "hedgeWakeJitterMs",
    "upstreamTimeoutMs",
    "upstreamRetryAttempts",
    "geoAllowlist",
    "geoBlocklist",
    "ipBlacklist",
    "rateLimitRpm",
    "cacheTtlImages",
    "corsOrigins",
    "logEnabled",
    "logSearchMode",
    "logWriteMode",
    "logWriteClientIp",
    "logWriteColo",
    "logWriteUa",
    "logDisplayClientIp",
    "logDisplayColo",
    "logDisplayUa",
    "logWriteImagePoster",
    "logWriteMediaMetadata",
    "logRetentionDays",
    "logWriteDelayMinutes",
    "logFlushCountThreshold",
    "logBatchChunkSize",
    "logBatchRetryCount",
    "logBatchRetryBackoffMs",
    "scheduledLeaseMs",
    "scheduleUtcOffsetMinutes",
    "tgDailyReportEnabled",
    "tgDailyReportSummaryEnabled",
    "tgDailyReportKvEnabled",
    "tgDailyReportD1Enabled",
    "tgDailyReportClockTimes",
    "tgBotToken",
    "tgChatId",
    "tgAlertDroppedBatchThreshold",
    "tgAlertFlushRetryThreshold",
    "tgAlertOnScheduledFailure",
    "tgAlertKvUsageEnabled",
    "tgAlertKvUsageThresholdPercent",
    "tgAlertD1UsageEnabled",
    "tgAlertD1UsageThresholdPercent",
    "tgAlertCooldownMinutes",
    "jwtExpiryDays",
    "cfAccountId",
    "cfZoneId",
    "cfApiToken",
    "cfKvNamespaceId",
    "cfD1DatabaseId",
    "cfQuotaPlanCacheMinutes",
    "tmdbApiReadToken",
    "tmdbApiV3Key",
    "tmdbLanguage"
  ],
  aliasFields: {},
  trimFields: [
    "tgBotToken",
    "tgChatId",
    "cfAccountId",
    "cfZoneId",
    "cfApiToken",
    "cfKvNamespaceId",
    "cfD1DatabaseId",
    "tmdbApiReadToken",
    "tmdbApiV3Key",
    "tmdbLanguage",
    "indexUrl",
    "cfQuotaPlanOverride",
    "corsOrigins",
    "geoAllowlist",
    "geoBlocklist",
    "ipBlacklist",
    "dnsDefaultFallbackCname",
    "defaultHostPrefixCnameTarget",
    "prewarmDepth",
    "hedgeProbePath",
    "logSearchMode",
    "logWriteMode",
    "routingDecisionMode",
    "protocolStrategy",
    "defaultPlaybackInfoMode",
    "defaultRealClientIpMode",
    "defaultMediaAuthMode"
  ],
  arrayNormalizers: { sourceDirectNodes: "nodeNameList" },
  integerFields: {
    logRetentionDays: {
      fallback: k.Defaults.LogRetentionDays,
      min: 1,
      max: k.Defaults.LogRetentionDaysMax
    },
    logFlushCountThreshold: {
      fallback: k.Defaults.LogFlushCountThreshold,
      min: 1,
      max: 5e3
    },
    logBatchChunkSize: {
      fallback: k.Defaults.LogBatchChunkSize,
      min: 1,
      max: 100
    },
    logBatchRetryCount: {
      fallback: k.Defaults.LogBatchRetryCount,
      min: 0,
      max: 5
    },
    logBatchRetryBackoffMs: {
      fallback: k.Defaults.LogBatchRetryBackoffMs,
      min: 0,
      max: 5e3
    },
    scheduledLeaseMs: {
      fallback: k.Defaults.ScheduledLeaseMs,
      min: k.Defaults.ScheduledLeaseMinMs,
      max: 900 * 1e3
    },
    uiRadiusPx: {
      fallback: k.Defaults.UiRadiusPx,
      min: 0,
      max: 48
    },
    tgAlertDroppedBatchThreshold: {
      fallback: k.Defaults.TgAlertDroppedBatchThreshold,
      min: 0,
      max: 5e3
    },
    tgAlertFlushRetryThreshold: {
      fallback: k.Defaults.TgAlertFlushRetryThreshold,
      min: 0,
      max: 10
    },
    tgAlertKvUsageThresholdPercent: {
      fallback: k.Defaults.TgAlertKvUsageThresholdPercent,
      min: 1,
      max: 100
    },
    tgAlertD1UsageThresholdPercent: {
      fallback: k.Defaults.TgAlertD1UsageThresholdPercent,
      min: 1,
      max: 100
    },
    tgAlertCooldownMinutes: {
      fallback: k.Defaults.TgAlertCooldownMinutes,
      min: 1,
      max: 1440
    },
    cacheTtlImages: {
      fallback: k.Defaults.CacheTtlImagesDays,
      min: 0,
      max: 365
    },
    pingTimeout: {
      fallback: k.Defaults.PingTimeoutMs,
      min: 1e3,
      max: 18e4
    },
    pingCacheMinutes: {
      fallback: k.Defaults.PingCacheMinutes,
      min: 0,
      max: 1440
    },
    hedgeProbeTimeoutMs: {
      fallback: k.Defaults.HedgeProbeTimeoutMs,
      min: 250,
      max: 1e4
    },
    hedgeProbeParallelism: {
      fallback: k.Defaults.HedgeProbeParallelism,
      min: 1,
      max: 2
    },
    hedgeWaitTimeoutMs: {
      fallback: k.Defaults.HedgeWaitTimeoutMs,
      min: 250,
      max: 1e4
    },
    hedgeLockTtlMs: {
      fallback: k.Defaults.HedgeLockTtlMs,
      min: 1e3,
      max: 1e4
    },
    hedgePreferredTtlSec: {
      fallback: k.Defaults.HedgePreferredTtlSec,
      min: 30,
      max: 3600
    },
    hedgeFailureCooldownSec: {
      fallback: k.Defaults.HedgeFailureCooldownSec,
      min: 1,
      max: 300
    },
    hedgeWakeJitterMs: {
      fallback: k.Defaults.HedgeWakeJitterMs,
      min: 0,
      max: 1e3
    },
    cfQuotaPlanCacheMinutes: {
      fallback: k.Defaults.CfQuotaPlanCacheMinutes,
      min: 1,
      max: 1440
    },
    upstreamTimeoutMs: {
      fallback: k.Defaults.UpstreamTimeoutMs,
      min: 0,
      max: 18e4
    },
    upstreamRetryAttempts: {
      fallback: k.Defaults.UpstreamRetryAttempts,
      min: 0,
      max: 3
    },
    prewarmCacheTtl: {
      fallback: k.Defaults.PrewarmCacheTtl,
      min: 0,
      max: 3600
    },
    prewarmPrefetchBytes: {
      fallback: k.Defaults.PrewarmPrefetchBytes,
      min: 0,
      max: Lo
    },
    playbackInfoCacheTtlSec: {
      fallback: k.Defaults.PlaybackInfoCacheTtlSec,
      min: 0,
      max: 60
    },
    videoProgressForwardIntervalSec: {
      fallback: k.Defaults.VideoProgressForwardIntervalSec,
      min: 0,
      max: 60
    },
    scheduleUtcOffsetMinutes: {
      fallback: k.Defaults.ScheduleUtcOffsetMinutes,
      min: -720,
      max: 840
    }
  },
  numberFields: { logWriteDelayMinutes: {
    fallback: k.Defaults.LogFlushDelayMinutes,
    min: 0,
    max: 1440
  } },
  booleanTrueFields: [
    "protocolFallback",
    "enablePrewarm",
    "playbackInfoCacheEnabled",
    "videoProgressForwardEnabled",
    "hedgeProbePreferGet",
    "logEnabled",
    "logWriteClientIp",
    "logWriteColo",
    "logWriteUa",
    "logDisplayClientIp",
    "logDisplayColo",
    "logDisplayUa"
  ],
  booleanFalseFields: [
    "tgAlertOnScheduledFailure",
    "tgAlertKvUsageEnabled",
    "tgAlertD1UsageEnabled",
    "tgDailyReportEnabled",
    "tgDailyReportSummaryEnabled",
    "tgDailyReportKvEnabled",
    "tgDailyReportD1Enabled",
    "directStaticAssets",
    "directHlsDash",
    "multiLinkCopyPanelEnabled",
    "dashboardShowD1WriteHotspot",
    "dashboardShowKvD1Status",
    "enableHostPrefixProxy",
    "hedgeFailoverEnabled",
    "disablePrewarmPrefetch",
    "logWriteImagePoster",
    "logWriteMediaMetadata"
  ]
};
function af(o = {}, e = {}) {
  for (const [t, r] of Object.entries(e.aliasFields || {}))
    if (!(o[t] !== void 0 && o[t] !== null) && Array.isArray(r)) {
      for (const a of r)
        if (!(o[a] === void 0 || o[a] === null)) {
          o[t] = o[a];
          break;
        }
    }
  return o;
}
function nf(o = {}, e = {}) {
  const t = Array.isArray(e.allowedFields) ? e.allowedFields : [];
  if (!t.length) return o;
  const r = {};
  for (const a of t)
    Object.prototype.hasOwnProperty.call(o, a) && (r[a] = o[a]);
  return r;
}
function of(o = {}, e = sc, t = {}) {
  let r = o && typeof o == "object" && !Array.isArray(o) ? { ...o } : {};
  r = af(r, e);
  for (const a of e.trimFields || [])
    r[a] === void 0 || r[a] === null || (r[a] = String(r[a]).trim());
  for (const [a, n] of Object.entries(e.arrayNormalizers || {}))
    Array.isArray(r[a]) && n === "nodeNameList" && typeof t.normalizeNodeNameList == "function" && (r[a] = t.normalizeNodeNameList(r[a]));
  for (const [a, n] of Object.entries(e.integerFields || {})) r[a] = le(r[a], n.fallback, n.min, n.max);
  for (const [a, n] of Object.entries(e.numberFields || {})) r[a] = hl(r[a], n.fallback, n.min, n.max);
  for (const a of e.booleanTrueFields || []) r[a] = r[a] !== !1;
  for (const a of e.booleanFalseFields || []) r[a] = r[a] === !0;
  return nf(r, e);
}
function ic(o = {}) {
  const e = o && typeof o == "object" && !Array.isArray(o) ? o : {}, t = { ...e };
  let r = !1;
  const a = [], n = [], s = {};
  for (const c of Ss)
    Object.prototype.hasOwnProperty.call(e, c) && a.push(c);
  const i = (c, l) => {
    const d = String(c || "").trim(), u = String(l || "").trim();
    !d || !u || (n.push(u), s[d] || (s[d] = []), s[d].push(u));
  };
  if (!Object.prototype.hasOwnProperty.call(t, "sourceDirectNodes")) {
    for (const c of nc)
      if (Object.prototype.hasOwnProperty.call(e, c)) {
        t.sourceDirectNodes = ht(e[c]), r = !0, i(c, "sourceDirectNodes");
        break;
      }
  }
  if (!Object.prototype.hasOwnProperty.call(t, "logWriteClientIp") && Reflect.get(e, "logIncludeClientIp") !== void 0 && (t.logWriteClientIp = e.logIncludeClientIp !== !1, r = !0, i("logIncludeClientIp", "logWriteClientIp")), !Object.prototype.hasOwnProperty.call(t, "logDisplayClientIp") && Reflect.get(e, "logIncludeClientIp") !== void 0 && (t.logDisplayClientIp = e.logIncludeClientIp !== !1, r = !0, i("logIncludeClientIp", "logDisplayClientIp")), !Object.prototype.hasOwnProperty.call(t, "logWriteColo") && Reflect.get(e, "logIncludeColo") !== void 0 && (t.logWriteColo = e.logIncludeColo !== !1, r = !0, i("logIncludeColo", "logWriteColo")), !Object.prototype.hasOwnProperty.call(t, "logDisplayColo") && Reflect.get(e, "logIncludeColo") !== void 0 && (t.logDisplayColo = e.logIncludeColo !== !1, r = !0, i("logIncludeColo", "logDisplayColo")), !Object.prototype.hasOwnProperty.call(t, "logWriteUa") && Reflect.get(e, "logIncludeUa") !== void 0 && (t.logWriteUa = e.logIncludeUa !== !1, r = !0, i("logIncludeUa", "logWriteUa")), !Object.prototype.hasOwnProperty.call(t, "logDisplayUa") && Reflect.get(e, "logIncludeUa") !== void 0 && (t.logDisplayUa = e.logIncludeUa !== !1, r = !0, i("logIncludeUa", "logDisplayUa")), !Object.prototype.hasOwnProperty.call(t, "protocolStrategy")) {
    let c = !1;
    for (const l of oc)
      Object.prototype.hasOwnProperty.call(e, l) && (i(l, "protocolStrategy"), c = !0);
    c && (t.protocolStrategy = Mo(e), r = !0);
  }
  Object.prototype.hasOwnProperty.call(t, "defaultPlaybackInfoMode") || (Reflect.get(e, "playbackInfoAutoProxy") !== void 0 ? (t.defaultPlaybackInfoMode = Va(e), r = !0, i("playbackInfoAutoProxy", "defaultPlaybackInfoMode")) : Reflect.get(e, "playbackInfoBlockWangpanProxy") !== void 0 && (t.defaultPlaybackInfoMode = Va(e), r = !0, i("playbackInfoBlockWangpanProxy", "defaultPlaybackInfoMode"))), Object.prototype.hasOwnProperty.call(t, "tgDailyReportClockTimes") || (t.tgDailyReportClockTimes = Nt(Object.prototype.hasOwnProperty.call(e, "tgDailyReportTime") ? e.tgDailyReportTime : e.tgDailyReportClockTimes, k.Defaults.TgDailyReportClockTimes), Object.prototype.hasOwnProperty.call(e, "tgDailyReportTime") && (r = !0, i("tgDailyReportTime", "tgDailyReportClockTimes")));
  for (const c of Ss)
    Object.prototype.hasOwnProperty.call(t, c) && (delete t[c], r = !0);
  return {
    config: t,
    migrated: r,
    legacyKeysPresent: Zt(a),
    deletedLegacyFieldCount: Zt(a).length,
    migratedConfigKeys: Zt(n),
    migratedKeyMap: Object.fromEntries(Object.entries(s).map(([c, l]) => [c, Zt(l)]))
  };
}
function ae(o = {}) {
  const { config: e } = ic(o && typeof o == "object" && !Array.isArray(o) ? o : {});
  return cc(e);
}
function cc(o = {}) {
  const e = of({
    ...o,
    defaultPlaybackInfoMode: da(o, "defaultPlaybackInfoMode") ? Reflect.get(o, "defaultPlaybackInfoMode") : Va(o),
    protocolStrategy: da(o, "protocolStrategy") ? Reflect.get(o, "protocolStrategy") : Mo(o)
  }, sc, { normalizeNodeNameList: ht });
  e.prewarmDepth = Zi(e.prewarmDepth), e.hedgeProbePath = Na(e.hedgeProbePath, k.Defaults.HedgeProbePath), e.dnsDefaultFallbackCname = Zd(e.dnsDefaultFallbackCname), e.defaultHostPrefixCnameTarget = jt(e.defaultHostPrefixCnameTarget), e.settingsExperienceMode = String(e.settingsExperienceMode || "").trim().toLowerCase() === "expert" ? "expert" : "novice", e.cfQuotaPlanOverride = Oo(e.cfQuotaPlanOverride), e.logSearchMode = ec(e.logSearchMode), e.logWriteMode = tc(e.logWriteMode), e.routingDecisionMode = Pr(e.routingDecisionMode), e.protocolStrategy = zi(e.protocolStrategy), e.defaultPlaybackInfoMode = Gt(e.defaultPlaybackInfoMode), e.defaultRealClientIpMode = So(e.defaultRealClientIpMode), e.defaultMediaAuthMode = ui(e.defaultMediaAuthMode), e.scheduleUtcOffsetMinutes = Oe(e.scheduleUtcOffsetMinutes), e.tgDailyReportClockTimes = Nt(e.tgDailyReportClockTimes, k.Defaults.TgDailyReportClockTimes);
  const t = Je(e.indexUrl);
  return e.indexUrl = t ? zr(t) : "", hd(e, o), e;
}
var lc = [
  "cfApiToken",
  "tgBotToken",
  "tmdbApiReadToken",
  "tmdbApiV3Key"
];
function _s(o = {}) {
  const e = ae(o);
  for (const t of lc) delete e[t];
  return e;
}
function Ct(o = {}) {
  return ae(o);
}
function uc(o = {}, e = {}) {
  const t = $(o) ? { ...o } : {}, r = ae(e);
  for (const a of lc)
    Object.prototype.hasOwnProperty.call(t, a) || String(r[a] || "").length > 0 && (t[a] = r[a]);
  return t;
}
function Nn(o = {}, e = {}) {
  const t = uc(o, e), r = Je(ae(e).indexUrl);
  return t.indexUrl = r ? zr(r) : "", t;
}
function sf(o = "", e = {}) {
  const t = String(o || "").trim();
  if (!t) return;
  const r = t.split(".").pop() || "", a = ne(ee(ae(e)));
  if (r !== a)
    throw we("CONFIG_REVISION_CONFLICT", "配置版本已变化，请刷新设置后重新提交", 409, {
      expectedRevision: t,
      currentHash: a
    });
}
function cf(o = {}) {
  const e = ic(o);
  return {
    cleanedConfig: cc(e.config),
    legacyKeysPresent: e.legacyKeysPresent,
    deletedLegacyFieldCount: e.deletedLegacyFieldCount,
    migratedConfigKeys: e.migratedConfigKeys,
    migratedKeyMap: e.migratedKeyMap
  };
}
function Ht(o = "", e = "") {
  const t = String(o || "").trim() || "empty";
  return `${String(e || "").trim() || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()}.${t}`;
}
function Xn(o, e = {}) {
  const t = ne(ee(o)), r = String(e.updatedAt || "").trim() || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
  return {
    ...e,
    hash: t,
    updatedAt: r,
    revision: Ht(t, r)
  };
}
function lf(o = {}, e = {}) {
  const t = ae(o), r = ae(e), a = [.../* @__PURE__ */ new Set([...Object.keys(t), ...Object.keys(r)])].sort(), n = [];
  for (const s of a)
    ee(t[s]) !== ee(r[s]) && n.push({
      key: s,
      previousValue: t[s],
      nextValue: r[s]
    });
  return n;
}
function uf(o = [], e = 20) {
  const t = Math.max(1, Number(e) || 20);
  return [...new Set((Array.isArray(o) ? o : [o]).map((r) => String(r ?? "").trim()).filter(Boolean))].slice(0, t);
}
function ft(o = "", e = "", t = [], r = {}) {
  const a = uf(t, r.limit), n = Number(r.count), s = Number.isFinite(n) ? Math.max(0, Math.floor(n)) : a.length, i = String(r.note || "").trim();
  return {
    key: String(o || "").trim(),
    label: String(e || "").trim(),
    count: s,
    countIsLowerBound: r.countIsLowerBound === !0,
    samples: a,
    truncated: s > a.length,
    note: i
  };
}
function be(o, e, t = "", r = "", a = [], n = 0, s = "") {
  return e && o.push(ft(t, r, a, {
    count: n,
    note: s
  })), o;
}
function df(o = {}) {
  const e = [], t = Zt(o.configFieldTargets || []);
  if (t.length > 0) {
    const i = [];
    o.sourceDirectNodesFromLegacyNodes === !0 && i.push("包含节点遗留直连标记折叠进 sourceDirectNodes"), e.push(ft("config_current_fields", "全局设置当前字段", t, {
      count: t.length,
      note: i.join("；") || "会把旧版配置别名收敛到当前 schema。"
    }));
  }
  const r = Math.max(0, Math.floor(Number(o.migratedTopLevelPortNodeCount) || 0)), a = Math.max(0, Math.floor(Number(o.migratedLinePortCount) || 0)), n = Math.max(0, Math.floor(Number(o.migratedDefaultPortNodeCount) || 0)), s = Math.max(0, Math.floor(Number(o.migratedDefaultPortLineCount) || 0));
  if (r > 0 || a > 0 || n > 0 || s > 0) {
    const i = [];
    r > 0 && i.push(`旧版顶层 node.port 节点 ${r} 个`), a > 0 && i.push(`旧版 lines[].port 线路 ${a} 条`), n > 0 && i.push(`隐式默认端口节点 ${n} 个`), s > 0 && i.push(`按协议补齐默认端口线路 ${s} 条`), e.push(ft("node_current_fields", "节点当前字段", ["lines[].target"], {
      count: 1,
      note: `会把端口统一收敛到当前字段。${i.join("，")}。`
    }));
  }
  return e;
}
function ff(o = []) {
  return (Array.isArray(o) ? o : []).map((e) => e?.name || e?.id);
}
async function xe(o, e, t = {}) {
  if (!o) return null;
  const r = String(e || "").trim(), a = $(t) ? t : {};
  try {
    return Object.prototype.hasOwnProperty.call(a, "type") ? await o.get(r, { type: a.type }) : await o.get(r);
  } catch (n) {
    throw si("get", { key: r }, se(n));
  }
}
async function mf(o, e = {}) {
  if (!o || typeof o.list != "function") return {
    keys: [],
    list_complete: !0,
    cursor: ""
  };
  const t = $(e) ? e : {}, r = String(t.prefix || "").trim(), a = String(t.cursor || "").trim();
  try {
    return a ? await o.list({
      prefix: r,
      cursor: a
    }) : await o.list({ prefix: r });
  } catch (n) {
    throw si("list", { prefix: r }, se(n));
  }
}
var pf = "sys:theme";
function dc(o, e = {}) {
  const t = String(o || "").trim(), r = t.toLowerCase(), a = String(e.zoneId || "").trim(), n = {
    status: "CF 查询失败",
    hint: "Cloudflare 查询失败，请检查 Zone ID、API 令牌与资源范围",
    detail: t || (a ? `当前查询的 Zone ID: ${a}` : "")
  };
  return t ? r.includes("unknown field") || r.includes("unknown enum") || r.includes("error parsing args") ? {
    status: "Schema 不兼容",
    hint: "当前账号可用的 GraphQL schema 与脚本查询字段不一致",
    detail: t
  } : r.includes("cf_graphql_http_429") || r.includes("rate limit") || r.includes("too many requests") ? {
    status: "请求过于频繁",
    hint: "Cloudflare GraphQL 已限流，请稍后再试",
    detail: t
  } : r.includes("invalid token") || r.includes("authentication") || r.includes("cf_graphql_http_401") ? {
    status: "令牌无效",
    hint: "Cloudflare API 令牌无效，或未启用 GraphQL Analytics 访问",
    detail: t
  } : r.includes("not authorized") || r.includes("permission") || r.includes("forbidden") || r.includes("unauthorized") || r.includes("cf_graphql_http_403") ? {
    status: "权限或范围不匹配",
    hint: "令牌权限不足，或 Account / Zone Resources 未覆盖当前查询",
    detail: t + (a ? ` | Zone ID: ${a}` : "")
  } : r.includes("zone") && (r.includes("not found") || r.includes("invalid") || r.includes("unknown")) ? {
    status: "Zone ID 无效",
    hint: "Zone ID 无效，或当前令牌无法访问这个 Zone",
    detail: t + (a ? ` | Zone ID: ${a}` : "")
  } : r.includes("cf_graphql_http_400") ? {
    status: "请求参数无效",
    hint: "GraphQL 请求参数无效，请检查 Zone ID 与筛选条件",
    detail: t + (a ? ` | Zone ID: ${a}` : "")
  } : n : n;
}
async function fc(o) {
  return ae(await o.get("sys:theme", { type: "json" }) || {});
}
async function Re(o) {
  const e = Da(o);
  if (!e) return {};
  const t = Io(o), r = mn(o), a = r.ConfigCache;
  if (a?.exp > H() && a.data) return a.data;
  const n = r.RuntimeConfigCacheGeneration;
  return await fn(r.SingleFlightTasks, ct([
    "runtime_config",
    t,
    n
  ]), async () => {
    const s = r.ConfigCache;
    if (s?.exp > H() && s.data) return s.data;
    const i = s?.data && typeof s.data == "object" ? s.data : a?.data && typeof a.data == "object" ? a.data : null;
    let c = i || {};
    try {
      c = await fc(e);
    } catch (l) {
      const d = i && typeof i == "object";
      Ae("runtime_config.load_failed", l, {
        cacheNamespace: t,
        configKey: pf,
        usedCachedConfig: d === !0
      }), c = d ? i : ae({});
    }
    return r.RuntimeConfigCacheGeneration === n && (r.ConfigCache = {
      data: c,
      exp: H() + k.Defaults.CacheTTL,
      namespace: t
    }), c;
  });
}
async function ue(o) {
  const e = Da(o);
  return e ? await fc(e) : {};
}
function gf(o = {}, e = {}) {
  const { indexRepository: t } = o;
  async function r(f, m, p, g = $e(m), h = null) {
    const y = $(h) ? ae(h) : ae(await ue(m)), _ = await t.getAdminActiveIndexRecord(t.getKV(m)), S = _ ? ae({
      ...y,
      indexUrl: _.sourceUrl
    }) : y;
    if (e.isAdminIndexSetupForced(f)) return e.renderAdminIndexSetupPage(f, m, p, g, S, "manual_setup_requested");
    const T = pt(m, S);
    if (!T.indexUrl) {
      try {
        const R = await e.renderBundledAdminPage(f, m, p, g, S);
        if (R) return R;
      } catch (R) {
        return Ae("admin.bundled_shell_render", R, { path: new URL(f.url).pathname }), e.renderAdminIndexSetupPage(f, m, p, g, S, "bundled_shell_render_failed");
      }
      return e.renderAdminIndexSetupPage(f, m, p, g, S);
    }
    const b = T.indexUrl;
    if (b) try {
      const R = await e.renderRemoteAdminPage(f, m, p, g, b, S);
      if (R) return R;
    } catch (R) {
      return Ae("admin.remote_shell_render", R, {
        path: new URL(f.url).pathname,
        remoteShellIndexUrl: b
      }), e.renderAdminRemoteShellErrorPage(f, m, p, g, {
        indexState: T,
        remoteShellIndexUrl: b,
        sourceType: "remote_error",
        routeState: "remote_error",
        remoteCacheState: "bypassed",
        lastFetchStatus: "failed",
        reason: `remote_shell_render_failed: ${String(R?.message || R || "unknown_error").trim()}`
      }, S);
    }
    return e.renderAdminIndexSetupPage(f, m, p, g, S, "index_url_not_configured");
  }
  async function a(f = [], m) {
    const p = Array.isArray(f) ? f : [];
    if (typeof m != "function" || p.length === 0) return [];
    const g = Array.from({ length: p.length });
    let h = 0;
    const y = async () => {
      for (; h < p.length; ) {
        const _ = h;
        h += 1, g[_] = await m(p[_], _);
      }
    };
    return await Promise.all(Array.from({ length: Math.min(e.ADMIN_WARM_VENDOR_CONCURRENCY, p.length) }, () => y())), g;
  }
  function n(f) {
    return new Request(f, {
      method: "HEAD",
      headers: { Accept: "*/*" },
      cache: "no-store"
    });
  }
  function s(f) {
    return f?.ok === !0 || Number(f?.status) === 304;
  }
  async function i(f, m, p = $e(m), g = null) {
    const h = $(g) ? ae(g) : ae(await ue(m)), y = pt(m, h);
    if (!y.indexUrl) return z("ADMIN_INDEX_NOT_CONFIGURED", "管理台 index.html 尚未配置", 409);
    const _ = [], S = { waitUntil(P) {
      _.push(Promise.resolve(P));
    } }, T = it(m), b = new URL(f.url);
    b.pathname = T, b.search = "";
    const R = await e.renderRemoteAdminPage(n(b), m, S, p, y.indexUrl, h);
    await Promise.all(_.splice(0));
    const w = ur(), L = y.assetRevision || y.releaseTag, U = y.isLocalUpload ? await t.getAdminIndexUploadRecord(t.getKV(m), y.localUploadRevision) : null;
    let E = null;
    U?.manifest ? (E = await e.readAdminReleaseVendorManifestFromCache(w, L, y.indexUrl), E || (E = await e.cacheAdminReleaseVendorManifest(w, U.manifest, S))) : E = await e.getOrCreateAdminReleaseVendorManifest(w, L, y.indexUrl, S);
    const D = (Array.isArray(E?.entries) ? E.entries : []).filter((P) => P?.assetKey && !e.isMutableJsdelivrGithubAssetUrl(P.upstreamUrl)), A = await a(D, async (P) => {
      const C = e.buildAdminReleaseVendorProxyPath(T, L, P.assetKey), I = new URL(f.url);
      return I.pathname = C, I.search = "", e.renderAdminReleaseVendorAsset(n(I), m, S, {
        releaseTag: L,
        assetKey: P.assetKey
      }, h);
    });
    await Promise.all(_.splice(0));
    const x = A.filter((P) => !s(P)).length, O = s(R), N = JSON.stringify({
      ok: O && x === 0,
      shellStatus: Number(R?.status) || 0,
      warmedAssetCount: D.length - x,
      failedAssetCount: x
    }), v = new Headers({
      "Content-Type": "application/json;charset=UTF-8",
      "Cache-Control": "no-store, max-age=0"
    });
    return Ce(v), new Response(f.method === "HEAD" ? null : N, {
      status: O && x === 0 ? 200 : 502,
      headers: v
    });
  }
  function c(f, m = $e(f)) {
    const p = it(f), g = m.ok ? "" : `<div class="landing-banner"><div class="landing-banner-title">系统未初始化</div><div class="landing-banner-text">缺少关键环境变量：${m.missing.map((_) => Te(_)).join("、")}</div></div>`, h = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><title>Emby Proxy V19.6</title>${e.LANDING_PAGE_STYLE_HTML}</head><body><main class="landing-shell"><section class="landing-card"><div class="landing-grid"><div class="landing-primary">${g}<div class="landing-pill">Headless Edge Relay</div><h1 class="landing-title">Emby Proxy V19.6</h1><p class="landing-text">为了极致优化视频代理性能，根路径默认只保留无头中继与说明壳；真正的管理台入口固定收口到 <span class="landing-highlight">${Te(p)}</span>，并由 Worker 读取随部署发布或已上传的 <code>index.html</code> 返回。</p><div class="landing-actions"><a href="${Te(p)}" class="landing-btn landing-btn-primary">访问 ${Te(p)}</a><a href="https://github.com/axuitomo/CF-EMBY-PROXY-UI" target="_blank" rel="noopener noreferrer" class="landing-btn landing-btn-secondary">查看项目说明</a></div></div><div class="landing-side"><div class="landing-notes"><div class="landing-notes-title">Routing Notes</div><ul class="landing-note-list"><li>根路径仅提供静态说明页，不承载实时配置数据。</li><li><code>${Te(p)}</code> 只负责返回管理台壳与 bootstrap，动态数据继续走 <code>POST ${Te(p)}</code> API。</li><li>正式真相源固定为 <code>frontend/</code>、<code>worker.js</code> 与 <code>worker.md</code>。</li><li>媒体代理、日志与 KV / D1 逻辑保持原 Worker 主链路不变。</li></ul></div></div></div></section></main></body></html>`, y = new Headers({
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    });
    return Ce(y), y.set("X-Frame-Options", "DENY"), new Response(h, { headers: y });
  }
  function l(f, m = "/", p = 302) {
    const g = new URL(f.url);
    g.pathname = Y(m || "/"), g.search = "", g.hash = "";
    const h = new Headers({
      Location: g.toString(),
      "Cache-Control": "no-store, max-age=0"
    });
    return Ce(h), new Response(null, {
      status: p,
      headers: h
    });
  }
  async function d(f, m, p = $e(m)) {
    const g = it(m), h = Do(m), y = Gn(p), _ = Vr({
      adminPath: g,
      loginPath: h,
      initHealth: p,
      contract: e.buildAdminUiContract()
    }), S = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/favicon.ico" sizes="any"><title>Worker 管理台登录</title><style>
        :root {
          color-scheme: light;
          font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
          --bg-a: #091428;
          --bg-b: #123055;
          --panel: rgba(8, 20, 38, 0.88);
          --panel-border: rgba(148, 163, 184, 0.24);
          --text-main: #e5eefc;
          --text-muted: rgba(226, 232, 240, 0.8);
          --accent: #6ee7f9;
          --accent-strong: #2dd4bf;
          --danger-bg: rgba(248, 113, 113, 0.14);
          --danger-border: rgba(248, 113, 113, 0.3);
          --danger-text: #fecaca;
          --success-bg: rgba(74, 222, 128, 0.12);
          --success-border: rgba(74, 222, 128, 0.28);
          --success-text: #bbf7d0;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          min-height: 100vh;
          color: var(--text-main);
          background:
            radial-gradient(circle at top left, rgba(96, 165, 250, 0.32), transparent 38%),
            radial-gradient(circle at 85% 15%, rgba(45, 212, 191, 0.2), transparent 22%),
            linear-gradient(135deg, var(--bg-a), var(--bg-b));
        }
        a { color: inherit; }
        .login-shell {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 20px;
        }
        .login-card {
          width: min(100%, 960px);
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          box-shadow: 0 28px 120px rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(22px);
        }
        .login-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(320px, 420px);
        }
        .login-hero {
          padding: 42px 42px 36px;
          border-right: 1px solid rgba(148, 163, 184, 0.18);
        }
        .login-form {
          padding: 42px 32px 36px;
          background: rgba(2, 6, 23, 0.18);
        }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(229, 238, 252, 0.78);
          background: rgba(15, 23, 42, 0.36);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }
        .title {
          margin: 18px 0 12px;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 1.05;
        }
        .subtitle, .hint, .meta-item, .status {
          color: var(--text-muted);
          line-height: 1.7;
        }
        .meta-grid {
          margin-top: 26px;
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .meta-card {
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.32);
          border: 1px solid rgba(148, 163, 184, 0.14);
        }
        .meta-label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.88);
        }
        .meta-value {
          margin-top: 8px;
          font-size: 15px;
          color: var(--text-main);
          word-break: break-all;
        }
        .actions {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .action-link, .submit-btn {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          text-decoration: none;
          padding: 12px 18px;
          font-size: 14px;
          font-weight: 600;
          transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
        }
        .action-link:hover, .submit-btn:hover { transform: translateY(-1px); }
        .action-link.primary, .submit-btn {
          background: linear-gradient(135deg, var(--accent-strong), var(--accent));
          color: #082032;
          border-color: transparent;
        }
        .action-link.secondary {
          background: rgba(15, 23, 42, 0.38);
          color: var(--text-main);
        }
        .form-panel {
          display: grid;
          gap: 18px;
        }
        .form-title {
          margin: 0;
          font-size: 24px;
          line-height: 1.2;
        }
        .field {
          display: grid;
          gap: 10px;
        }
        .field-label {
          font-size: 13px;
          color: rgba(226, 232, 240, 0.82);
        }
        .field-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: rgba(15, 23, 42, 0.58);
          color: var(--text-main);
          font-size: 15px;
          outline: none;
        }
        .field-input:focus {
          border-color: rgba(110, 231, 249, 0.72);
          box-shadow: 0 0 0 4px rgba(110, 231, 249, 0.14);
        }
        .submit-btn {
          width: 100%;
          cursor: pointer;
        }
        .submit-btn[disabled] {
          cursor: wait;
          opacity: 0.72;
          transform: none;
        }
        .status {
          min-height: 48px;
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(15, 23, 42, 0.36);
          font-size: 14px;
        }
        .status.is-error {
          color: var(--danger-text);
          background: var(--danger-bg);
          border-color: var(--danger-border);
        }
        .status.is-success {
          color: var(--success-text);
          background: var(--success-bg);
          border-color: var(--success-border);
        }
        .hint {
          font-size: 13px;
          margin: 0;
        }
        .noscript {
          margin-top: 18px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid var(--danger-border);
          background: var(--danger-bg);
          color: var(--danger-text);
          font-size: 13px;
          line-height: 1.7;
        }
        @media (max-width: 860px) {
          .login-grid { grid-template-columns: 1fr; }
          .login-hero { border-right: none; border-bottom: 1px solid rgba(148, 163, 184, 0.18); padding: 34px 24px 24px; }
          .login-form { padding: 28px 24px 30px; }
          .meta-grid { grid-template-columns: 1fr; }
        }
      </style></head><body><main class="login-shell"><section class="login-card"><div>${y}</div><div class="login-grid"><section class="login-hero"><div class="eyebrow">Worker Admin Access</div><h1 class="title">登录管理台壳层</h1><p class="subtitle">这个入口只负责建立 Worker 的同源登录态。登录成功后会直接返回主控制台，后续的节点治理、日志诊断、DNS/IP 池与发布操作继续复用同一份 Cookie。</p><div class="meta-grid"><article class="meta-card"><div class="meta-label">Admin Path</div><div class="meta-value">${Te(g)}</div></article><article class="meta-card"><div class="meta-label">Login Endpoint</div><div class="meta-value">POST ${Te(h)}</div></article><article class="meta-card"><div class="meta-label">Init Health</div><div class="meta-value">${p.ok ? "已通过" : `未通过：${Te((Array.isArray(p.missing) ? p.missing : []).join(" / ") || "请检查环境变量")}`}</div></article><article class="meta-card"><div class="meta-label">Current Mode</div><div class="meta-value">独立登录壳，不再复用 /admin 远端 shell</div></article></div><div class="actions"><a href="${Te(g)}" class="action-link secondary">返回管理台</a><a href="/" class="action-link primary">回到根路径说明页</a></div></section><section class="login-form"><form id="admin-login-form" class="form-panel" action="${Te(h)}" method="post" novalidate><div><p class="form-title">输入管理密码</p><p class="hint">页面会继续调用已有的 <code>POST ${Te(h)}</code> JSON 登录接口，不会新增第二套鉴权协议。</p></div><label class="field" for="admin-login-password"><span class="field-label">管理密码</span><input id="admin-login-password" name="password" type="password" class="field-input" autocomplete="current-password" placeholder="请输入 ADMIN_PASS" required /></label><button id="admin-login-submit" type="submit" class="submit-btn">登录并进入控制台</button><div id="admin-login-status" class="status" role="status" aria-live="polite">等待输入密码。登录成功后会跳转到 ${Te(g)}。</div></form><noscript><div class="noscript">当前登录壳需要浏览器启用 JavaScript，因为 Worker 现阶段继续复用原有 JSON 登录接口来写入 Cookie。</div></noscript></section></div></section></main><script>
        const ADMIN_LOGIN_RUNTIME = ${_};
        const form = document.getElementById("admin-login-form");
        const passwordInput = document.getElementById("admin-login-password");
        const submitButton = document.getElementById("admin-login-submit");
        const statusNode = document.getElementById("admin-login-status");

        function updateStatus(message, tone) {
          if (!statusNode) return;
          statusNode.textContent = message || "";
          statusNode.classList.remove("is-error", "is-success");
          if (tone === "error") statusNode.classList.add("is-error");
          if (tone === "success") statusNode.classList.add("is-success");
        }

        form?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const password = String(passwordInput?.value || "");
          if (!password) {
            updateStatus("请输入管理密码。", "error");
            passwordInput?.focus();
            return;
          }
          if (submitButton) submitButton.disabled = true;
          updateStatus("正在验证密码并建立 Cookie 会话...", "");
          try {
            const response = await fetch(ADMIN_LOGIN_RUNTIME.loginPath, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              credentials: "same-origin",
              body: JSON.stringify({ password })
            });
            const payload = await response.json().catch(() => ({}));
            if (response.ok && payload && payload.ok === true) {
              updateStatus("登录成功，正在进入控制台...", "success");
              void fetch((ADMIN_LOGIN_RUNTIME.adminPath || "/admin").replace(/\\/+$/, "") + "/__warm", {
                method: "HEAD",
                credentials: "same-origin",
                cache: "no-store",
                keepalive: true
              }).catch(() => null);
              window.location.assign(ADMIN_LOGIN_RUNTIME.adminPath || "/admin");
              return;
            }
            const baseErrorMessage = payload?.error?.message || payload?.message || (response.status ? ("登录失败（HTTP " + response.status + "）") : "登录失败");
            const remainingAttempts = Number.isFinite(Number(payload?.remain))
              ? Math.max(0, Number(payload.remain))
              : null;
            const errorMessage = remainingAttempts === null
              ? baseErrorMessage
              : remainingAttempts > 0
                ? baseErrorMessage + "，还可尝试 " + remainingAttempts + " 次。"
                : baseErrorMessage + "，已达到失败次数上限，请稍后重试。";
            updateStatus(errorMessage, "error");
          } catch (error) {
            updateStatus(error?.message ? ("登录请求失败：" + error.message) : "登录请求失败，请稍后重试。", "error");
          } finally {
            if (submitButton) submitButton.disabled = false;
          }
        });

        passwordInput?.focus();
      <\/script></body></html>`;
    return new Response(f?.method === "HEAD" ? null : S, { headers: e.buildAdminHtmlResponseHeaders("", "no-store, max-age=0") });
  }
  function u(f, m, p = 200, g = {}) {
    const h = new Headers(f);
    return Ce(h), g.mergeOriginVary === !0 && h.get("Access-Control-Allow-Origin") !== "*" && Ur(h, "Origin"), new Response(m, {
      status: p,
      headers: h
    });
  }
  return {
    renderAdminPage: r,
    warmAdminReleaseVendorEntries: a,
    buildAdminWarmSubrequest: n,
    isAdminWarmResponseSuccessful: s,
    renderAdminWarmResponse: i,
    renderLandingPage: c,
    buildRequestPathRedirectResponse: l,
    renderAdminLoginPage: d,
    buildEdgeCorsResponse: u
  };
}
function vo(o = "") {
  return /(?:^|\/)smartstrm(?:$|[/?])/i.test(String(o || ""));
}
function ya(o = "") {
  return qa(o) || /\/audio\/[^/]+(?:\/|$)/i.test(String(o || "")) || /\/livetv\/[^/]+(?:\/|$)/i.test(String(o || "")) || vo(o);
}
function hf(o = "") {
  const e = String(o || "").trim();
  return /^[a-z][a-z0-9+.-]*:/i.test(e) || e.startsWith("//");
}
function mc(o = "") {
  return /\/playbackinfo(?:$|[/?])/i.test(String(o || ""));
}
function qa(o = "") {
  const e = Y(o);
  return mc(e) || vo(e) || St.test(e) || Ui.test(e) ? !0 : /\/videos\/[^/]+\/(?:stream|original|download|file)\b/i.test(e) || /\/items\/[^/]+\/download\b/i.test(e);
}
function pc(o = "") {
  return /\/sessions\/playing\/progress(?:$|[/?])/i.test(String(o || ""));
}
function gc(o = "") {
  return /\/sessions\/playing\/stopped(?:$|[/?])/i.test(String(o || ""));
}
function yf(o = "") {
  return /\/sessions\/playing\/ping(?:$|[/?])/i.test(String(o || ""));
}
function Sf(o = "") {
  const e = String(o || "");
  return pc(e) || gc(e) || yf(e) ? !1 : /\/sessions\/playing(?:\/started)?(?:$|[/?])/i.test(e);
}
function _f(o = {}, e = {}) {
  function t(r, a) {
    let n = a;
    const s = It(r[n]);
    let i = Ji(s) === "main" ? "/" + s : "";
    for (n += 1; n < r.length; n += 1) i += "/" + It(r[n]);
    return qa(i || "/");
  }
  return { isPlaybackCriticalSegments: t };
}
function bf(o = {}) {
  const e = {};
  for (const [t, r] of Object.entries(id(o, e))) e[t] = r;
  for (const [t, r] of Object.entries(cd(o, e))) e[t] = r;
  for (const [t, r] of Object.entries(ud(o, e))) e[t] = r;
  for (const [t, r] of Object.entries(dd(o, e))) e[t] = r;
  for (const [t, r] of Object.entries(gf(o, e))) e[t] = r;
  for (const [t, r] of Object.entries(_f(o, e))) e[t] = r;
  return e;
}
function Xa(o) {
  if (!o || o === 0) return "0 B";
  const e = 1024, t = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB"
  ], r = Math.floor(Math.log(o) / Math.log(e));
  return parseFloat((o / Math.pow(e, r)).toFixed(2)) + " " + t[r];
}
var hc = 1024 * 1024 * 1024, Ef = 500 * 1024 * 1024, Tf = 10 * 1024 * 1024 * 1024, Fo = Object.freeze({
  planClass: "free",
  planLabel: "FREE",
  periodLabel: "今日",
  kv: {
    read: 1e5,
    write: 1e3,
    delete: 1e3,
    list: 1e3,
    storageBytes: hc
  },
  d1: {
    rowsRead: 5e6,
    rowsWritten: 1e5,
    storageBytes: Ef
  }
}), yc = Object.freeze({
  planClass: "paid",
  planLabel: "PAID",
  periodLabel: "本月",
  kv: {
    read: 1e7,
    write: 1e6,
    delete: 1e6,
    list: 1e6,
    storageBytes: hc
  },
  d1: {
    rowsRead: 25e9,
    rowsWritten: 5e7,
    storageBytes: Tf
  }
}), Rf = Object.freeze({
  free: Fo,
  paid: yc
});
function ye(o) {
  const e = Number(o);
  return Number.isFinite(e) ? Math.max(0, Math.round(e)).toLocaleString("en-US") : "0";
}
function Sa(o) {
  const e = Number(o);
  return !Number.isFinite(e) || e <= 0 ? 0 : e >= 100 ? 100 : Math.max(0, Math.round(e * 10) / 10);
}
function Af(o = 0) {
  const e = Number(o);
  return !Number.isFinite(e) || e <= 0 ? "slate" : e >= 90 ? "danger" : e >= 70 ? "warning" : "success";
}
function _a(o = "") {
  return String(o || "").trim().toLowerCase() || "bundled";
}
function Sc(o = "") {
  const e = _a(o);
  return e === "standard" || e === "unbound" ? {
    ...yc,
    usageModel: e
  } : {
    ...Fo,
    usageModel: e
  };
}
function Yn(o = {}) {
  const e = Oo(o?.override);
  return e ? {
    ...ba(e),
    usageModel: _a(o?.usageModel),
    override: e
  } : {
    ...Sc(o?.usageModel),
    override: ""
  };
}
function ba(o = "free") {
  return Rf[String(o || "").trim().toLowerCase() === "paid" ? "paid" : "free"] || Fo;
}
async function Cf(o = {}) {
  const e = ae($(o) ? o : {}), t = Oo(e.cfQuotaPlanOverride);
  if (t) return Yn({ override: t });
  const r = String(e.cfAccountId || "").trim(), a = String(e.cfApiToken || "").trim();
  if (!r || !a) return {
    ...ba("free"),
    usageModel: _a("bundled"),
    override: ""
  };
  try {
    return Yn({ usageModel: await Rc(r, a) });
  } catch {
    return {
      ...ba("free"),
      usageModel: _a("bundled"),
      override: ""
    };
  }
}
function wf(o = {}) {
  const e = $(o) ? o : {}, t = Math.max(1, Math.floor(Number(e.writeLimit) || 0)), r = Math.max(0, Math.floor(Number(e.estimatedPutCount) || 0)), a = Math.max(0, Math.floor(Number(e.estimatedRollbackWriteCount) || 0)), n = Math.max(0, Math.floor(Number(e.estimatedWorstCaseWriteCount) || 0)), s = Math.max(0, n - t), i = String(e.planLabel || "").trim() || "FREE", c = String(e.periodLabel || "").trim() || "今日";
  return n <= t ? "" : `KV 整理已拦截：当前 ${i} 计划 · ${c} 写入上限为 ${ye(t)}，本次预计写入 ${ye(r)} 次，最坏回滚写回 ${ye(a)} 次，最坏共 ${ye(n)} 次，超出 ${ye(s)} 次。`;
}
function Lf(o = {}) {
  const e = $(o) ? o : {}, t = String(e.planLabel || "").trim() || "FREE", r = String(e.periodLabel || "").trim() || "今日", a = Math.max(1, Math.floor(Number(e.writeLimit) || 0)), n = Math.max(0, Math.floor(Number(e.estimatedPutCount) || 0)), s = Math.max(0, Math.floor(Number(e.estimatedDeleteCount) || 0)), i = Math.max(0, Math.floor(Number(e.estimatedRollbackWriteCount) || 0)), c = Math.max(0, Math.floor(Number(e.estimatedWorstCaseWriteCount) || 0));
  return `KV 配额预算：${t} 计划 · ${r}，预计 put ${ye(n)} 次，delete ${ye(s)} 次，最坏回滚写回 ${ye(i)} 次，最坏写入 ${ye(c)} / ${ye(a)}。`;
}
function Nf(o = "free", e = /* @__PURE__ */ new Date()) {
  const t = String(o || "").trim().toLowerCase() === "paid" ? "paid" : "free", r = e instanceof Date ? new Date(e.getTime()) : new Date(e || Date.now()), a = r.toISOString();
  if (t === "paid") {
    const i = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), 1, 0, 0, 0, 0)), c = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 1, 0, 0, 0, 0));
    return {
      planClass: t,
      periodLabel: "本月",
      startIso: i.toISOString(),
      endIso: a,
      resetAtIso: c.toISOString(),
      cacheBucketKey: `${r.getUTCFullYear()}-${String(r.getUTCMonth() + 1).padStart(2, "0")}`
    };
  }
  const n = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate(), 0, 0, 0, 0)), s = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate() + 1, 0, 0, 0, 0));
  return {
    planClass: t,
    periodLabel: "今日",
    startIso: n.toISOString(),
    endIso: a,
    resetAtIso: s.toISOString(),
    cacheBucketKey: n.toISOString().slice(0, 10)
  };
}
function kt(o, e = "cloudflare_runtime_error") {
  return String(o?.message || o || e).trim().replace(/\s+/g, " ").slice(0, 240) || e;
}
function bs(o, e = "count") {
  return e === "bytes" ? Xa(Math.max(0, Number(o) || 0)) : ye(o);
}
function Es(o = 0, e = H()) {
  const t = Math.max(0, Number(o) || 0), r = Math.max(t, Number(e) || H());
  if (t <= 0) return "";
  const a = Math.max(0, r - t);
  return a < 60 * 1e3 ? "缓存年龄：不到 1 分钟" : a < 3600 * 1e3 ? `缓存年龄：${Math.max(1, Math.round(a / (60 * 1e3)))} 分钟` : `缓存年龄：${Math.max(1, Math.round(a / (3600 * 1e3)))} 小时`;
}
function Er({ key: o = "", label: e = "", used: t = 0, limit: r = 0, kind: a = "count" } = {}) {
  const n = Math.max(0, Number(t) || 0), s = Math.max(0, Number(r) || 0), i = s > 0 ? n / s * 100 : 0, c = Sa(i);
  return {
    key: String(o || "").trim(),
    label: String(e || "").trim(),
    usedValue: n,
    limitValue: s,
    usedText: bs(n, a),
    limitText: bs(s, a),
    percent: c,
    percentText: `${c % 1 === 0 ? Math.round(c) : c}%`,
    tone: Af(i),
    rawPercent: i
  };
}
function Ts(o = []) {
  return (Array.isArray(o) ? o : []).filter((e) => Number(e?.rawPercent) > 100).map((e) => String(e?.label || "").trim()).filter(Boolean);
}
function Ya(o = {}, e = {}) {
  const t = (Array.isArray(o.metrics) ? o.metrics : []).map((r) => ({
    key: String(r?.key || "").trim(),
    label: String(r?.label || "").trim(),
    usedText: String(r?.usedText || "").trim(),
    limitText: String(r?.limitText || "").trim(),
    percent: Sa(r?.percent),
    percentText: String(r?.percentText || `${Sa(r?.percent)}%`).trim(),
    tone: String(r?.tone || "slate").trim() || "slate"
  })).filter((r) => r.key && r.label);
  return {
    title: String(o.title || e.title || "Cloudflare").trim() || "Cloudflare",
    status: String(o.status || e.status || "idle").trim() || "idle",
    summary: String(o.summary || e.summary || "暂无运行记录").trim() || "暂无运行记录",
    detail: String(o.detail || e.detail || "").trim(),
    lines: (Array.isArray(o.lines) ? o.lines : Array.isArray(e.lines) ? e.lines : []).map((r) => String(r || "").trim()).filter(Boolean),
    planLabel: String(o.planLabel || e.planLabel || "").trim(),
    periodLabel: String(o.periodLabel || e.periodLabel || "").trim(),
    resourceLabel: String(o.resourceLabel || e.resourceLabel || "").trim(),
    metrics: t
  };
}
function Tr(o = "", e = "", t = "") {
  return Ya({
    title: o,
    status: "skipped",
    summary: e,
    detail: t
  });
}
function Rr(o = "", e = "", t = "") {
  return Ya({
    title: o,
    status: "failed",
    summary: e,
    detail: t
  });
}
function Df(o = "", e = {}, t = 0, r = []) {
  const a = Math.max(1, Math.min(100, Math.round(Number(t) || 0))), n = e && typeof e == "object" ? e : {}, s = (Array.isArray(r) ? r : []).map((p) => ({
    label: String(p?.label || "").trim(),
    percentText: String(p?.percentText || `${Sa(p?.percent)}%`).trim()
  })).filter((p) => p.label), i = String(n.resourceLabel || "").trim() || String(o || "").trim(), c = String(n.planLabel || "").trim(), l = String(n.periodLabel || "").trim(), d = [i], u = [c, l].filter(Boolean);
  u.length > 0 && d.push(`（${u.join(" / ")}）`);
  const f = s.map((p) => `${p.label} ${p.percentText}`).join("、"), m = String(n.status || "").trim().toLowerCase() === "partial_failure" ? "（使用缓存数据）" : "";
  return `${String(o || "Cloudflare").trim() || "Cloudflare"} 使用量达到阈值：${d.join("")}，${f}（阈值 ${a}%）${m}`;
}
function Dn(o = [], e = []) {
  const t = new Set((Array.isArray(e) ? e : [e]).map((r) => String(r || "").trim()).filter(Boolean));
  for (const r of Array.isArray(o) ? o : []) {
    const a = String(r?.key || "").trim();
    if (!t.has(a)) continue;
    const n = String(r?.percentText || "").trim();
    if (n) return n;
    if (r?.percent !== void 0 && r?.percent !== null) return `${Sa(r.percent)}%`;
  }
  return "暂不可用";
}
function If(o = {}, e = {}) {
  const t = o && typeof o == "object" ? o : {}, r = e && typeof e == "object" ? e : {}, a = String(t.requestCountDisplay || "").trim() || (t.todayRequests === null || t.todayRequests === void 0 ? "暂不可用" : String(Number(t.todayRequests) || 0)), n = String(t.todayTraffic || "").trim() || "暂不可用", s = String(t.monthlyTraffic || "").trim() || "暂不可用", i = Math.max(0, Number(t.playCount) || 0), c = Math.max(0, Number(t.infoCount) || 0);
  return [
    `📊 EMBY-PROXY每日报表${r.dateKey ? ` (${r.dateKey})` : ""}`,
    "",
    `请求数: ${a}`,
    `视频流量 (CF 总计): ${n}`,
    `本月流量 (CF 总计): ${s}`,
    `请求: 播放请求 ${ye(i)} 次 | 获取播放信息 ${ye(c)} 次`,
    "#Cloudflare #Emby #日报"
  ].map((l) => String(l || "").trim()).filter((l, d, u) => !(l === "" && (d === 0 || u[d - 1] === ""))).join(`
`);
}
function Mf(o = "", e = {}, t = {}) {
  const r = Gi(o);
  if (r === "summary") return If(e, t);
  const a = r === "d1" ? "d1" : "kv", n = e && typeof e == "object" ? e : {}, s = t && typeof t == "object" ? t : {}, i = a === "d1" ? "D1 数据库每日消耗报告" : "KV 数据库每日消耗报告", c = a === "d1" ? "#D1" : "#KV", l = Array.isArray(n.metrics) ? n.metrics : [], d = s.dateKey ? ` (${s.dateKey})` : "", u = String(n.planLabel || "").trim(), f = String(n.periodLabel || "").trim(), m = u || f ? `${u || "未知"} 计划 X ${f || "当前"}配额` : String(n.summary || "").trim() || "暂不可用", p = Dn(l, a === "d1" ? ["rowsRead", "read"] : ["read", "rowsRead"]), g = Dn(l, a === "d1" ? ["rowsWritten", "write"] : ["write", "rowsWritten"]), h = Dn(l, ["storage"]);
  return [
    `📊 ${i}${d}`,
    `配额口径：${m}`,
    `读取使用率：${p}`,
    `写入使用率：${g}`,
    `存储使用率：${h}`,
    `#Cloudflare ${c} #日报`
  ].map((y) => String(y || "").trim()).filter((y, _, S) => !(y === "" && (_ === 0 || S[_ - 1] === ""))).join(`
`);
}
function Rs(o = null, e = "") {
  const t = (Array.isArray(o?.errors) ? o.errors : []).map((a) => {
    const n = String(a?.code || "").trim(), s = String(a?.message || "").trim();
    return n && s ? `${n}: ${s}` : s || n;
  }).filter(Boolean);
  if (t.length > 0) return t.join("; ");
  const r = String(e || "").trim();
  return r ? r.replace(/\s+/g, " ").slice(0, 300) : "";
}
async function Ee(o, e, t = {}) {
  const r = t && typeof t == "object" ? t : {};
  let a = {};
  const n = r?.headers;
  n && (n instanceof Headers ? a = Object.fromEntries(n.entries()) : typeof n == "object" && (a = n));
  const s = typeof FormData < "u" && r?.body instanceof FormData, i = await Be(o, {
    ...r,
    headers: {
      Authorization: `Bearer ${e}`,
      ...s ? {} : { "Content-Type": "application/json" },
      ...a
    }
  }), c = await Ne(i, ii);
  if (c.exceeded) throw new Error("cf_api_response_too_large");
  const l = c.text;
  let d = null;
  if (l) try {
    d = JSON.parse(l);
  } catch {
  }
  if (!i.ok) {
    const u = Number(i.status) || 0, f = Rs(d, l), m = /* @__PURE__ */ new Error(f ? `cf_api_http_${u}: ${f}` : `cf_api_http_${u}`);
    throw m.status = u, m;
  }
  if (!d || typeof d != "object") return {};
  if (d?.success === !1) {
    const u = Rs(d, l);
    throw new Error(u || "cf_api_error");
  }
  return d;
}
async function _c(o, e, t) {
  const r = t && typeof t == "object" ? {
    query: e,
    variables: t
  } : { query: e }, a = await Be("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${o}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(r)
  });
  if (!a.ok) throw new Error(`cf_graphql_http_${a.status}`);
  const n = await Ne(a, ii);
  if (n.exceeded) throw new Error("cf_graphql_response_too_large");
  const s = JSON.parse(n.text);
  if (Array.isArray(s?.errors) && s.errors.length) throw new Error(s.errors.map((i) => i?.message).filter(Boolean).join("; ") || "cf_graphql_error");
  return s;
}
async function bc(o, e, t, r) {
  return (await _c(e, t, r))?.data?.viewer?.zones?.[0] || null;
}
async function As(o, e, t, r) {
  const a = await bc(o, e, `
            query {
              viewer {
                zones(filter: { zoneTag: ${_e(o)} }) {
                  series: httpRequestsAdaptiveGroups(limit: 10000, filter: { datetime_geq: ${_e(new Date(t).toISOString())}, datetime_leq: ${_e(new Date(r).toISOString())} }) {
                    sum { edgeResponseBytes }
                  }
                }
              }
            }`);
  if (!a) throw new Error("cf_graphql_empty_zone");
  return (Array.isArray(a.series) ? a.series : []).reduce((n, s) => n + Math.max(0, Number(s?.sum?.edgeResponseBytes) || 0), 0);
}
async function gn(o, e, t, r) {
  return (await _c(e, t, r))?.data?.viewer?.accounts?.[0] || null;
}
async function Ec(o, e) {
  return !o || !e ? null : (await Ee(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(String(o).trim())}`, e))?.result || null;
}
async function Tc(o, e, t = {}) {
  const r = String(o || "").trim();
  return await pe(Ec(r, e), String(t?.scope || "cloudflare.zone_lookup"), {
    zoneId: r,
    ...$(t?.context) ? t.context : {}
  }, null);
}
async function Uo(o, e, t = {}) {
  const r = await Ec(o, e), a = String(r?.name || "").trim();
  if (r && a) return r;
  const n = /* @__PURE__ */ new Error("cf_zone_context_missing");
  throw n.code = "CF_ZONE_CONTEXT_MISSING", n.status = 400, n.details = {
    zoneId: String(o || "").trim(),
    scope: String(t?.scope || "").trim()
  }, n;
}
async function Rc(o, e) {
  const t = String(o || "").trim(), r = String(e || "").trim();
  return !t || !r ? "" : _a((await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(t)}/workers/account-settings`, r))?.result?.default_usage_model);
}
async function Pf(o, e, t) {
  const r = String(o || "").trim(), a = String(e || "").trim(), n = String(t || "").trim();
  return !r || !a || !n ? null : (await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(r)}/storage/kv/namespaces/${encodeURIComponent(a)}`, n))?.result || null;
}
async function Cs(o, e, t) {
  const r = String(o || "").trim(), a = String(e || "").trim(), n = String(t || "").trim();
  return !r || !a || !n ? null : (await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(r)}/d1/database/${encodeURIComponent(a)}`, n))?.result || null;
}
async function xf({ accountId: o, apiToken: e, namespaceId: t, startIso: r, endIso: a }) {
  const n = String(o || "").trim(), s = String(e || "").trim(), i = String(t || "").trim();
  if (!n || !s || !i) return null;
  const c = await gn(n, s, `
    query {
      viewer {
        accounts(filter: { accountTag: ${_e(n)} }) {
          kvOperationsAdaptiveGroups(
            limit: 1000
            filter: {
              namespaceId: ${_e(i)}
              datetime_geq: ${_e(String(r || "").trim())}
              datetime_leq: ${_e(String(a || "").trim())}
            }
          ) {
            dimensions { actionType }
            sum { requests }
          }
          kvStorageAdaptiveGroups(
            limit: 1000
            filter: {
              namespaceId: ${_e(i)}
              datetime_geq: ${_e(String(r || "").trim())}
              datetime_leq: ${_e(String(a || "").trim())}
            }
          ) {
            max { byteCount }
          }
        }
      }
    }`);
  if (!c) throw new Error("cf_graphql_empty_account");
  const l = Array.isArray(c?.kvOperationsAdaptiveGroups) ? c.kvOperationsAdaptiveGroups : [], d = Array.isArray(c?.kvStorageAdaptiveGroups) ? c.kvStorageAdaptiveGroups : [], u = {
    readCount: 0,
    writeCount: 0,
    deleteCount: 0,
    listCount: 0,
    storageBytes: 0
  };
  for (const f of l) {
    const m = String(f?.dimensions?.actionType || "").trim().toLowerCase(), p = Math.max(0, Number(f?.sum?.requests) || 0);
    m === "read" ? u.readCount += p : m === "write" ? u.writeCount += p : m === "delete" ? u.deleteCount += p : m === "list" && (u.listCount += p);
  }
  for (const f of d) u.storageBytes = Math.max(u.storageBytes, Math.max(0, Number(f?.max?.byteCount) || 0));
  return u;
}
async function Of({ accountId: o, apiToken: e, databaseId: t, startIso: r, endIso: a }) {
  const n = String(o || "").trim(), s = String(e || "").trim(), i = String(t || "").trim();
  if (!n || !s || !i) return null;
  const c = await gn(n, s, `
    query {
      viewer {
        accounts(filter: { accountTag: ${_e(n)} }) {
          d1AnalyticsAdaptiveGroups(
            limit: 1000
            filter: {
              databaseId: ${_e(i)}
              datetime_geq: ${_e(String(r || "").trim())}
              datetime_leq: ${_e(String(a || "").trim())}
            }
          ) {
            sum { rowsRead rowsWritten readQueries writeQueries }
          }
        }
      }
    }`);
  if (!c) throw new Error("cf_graphql_empty_account");
  return (Array.isArray(c?.d1AnalyticsAdaptiveGroups) ? c.d1AnalyticsAdaptiveGroups : []).reduce((l, d) => ({
    rowsRead: l.rowsRead + Math.max(0, Number(d?.sum?.rowsRead) || 0),
    rowsWritten: l.rowsWritten + Math.max(0, Number(d?.sum?.rowsWritten) || 0),
    readQueries: l.readQueries + Math.max(0, Number(d?.sum?.readQueries) || 0),
    writeQueries: l.writeQueries + Math.max(0, Number(d?.sum?.writeQueries) || 0)
  }), {
    rowsRead: 0,
    rowsWritten: 0,
    readQueries: 0,
    writeQueries: 0
  });
}
async function vf({ accountId: o, apiToken: e, databaseId: t, startIso: r, endIso: a, utcOffsetMinutes: n = k.Defaults.ScheduleUtcOffsetMinutes }) {
  const s = String(o || "").trim(), i = String(e || "").trim(), c = String(t || "").trim();
  if (!s || !i || !c) return [];
  const l = await gn(s, i, `
    query {
      viewer {
        accounts(filter: { accountTag: ${_e(s)} }) {
          d1AnalyticsAdaptiveGroups(
            limit: 10000
            filter: {
              databaseId: ${_e(c)}
              datetime_geq: ${_e(String(r || "").trim())}
              datetime_leq: ${_e(String(a || "").trim())}
            }
          ) {
            dimensions { datetimeHour }
            sum { rowsWritten writeQueries }
          }
        }
      }
    }`);
  if (!l) throw new Error("cf_graphql_empty_account");
  const d = Array.isArray(l?.d1AnalyticsAdaptiveGroups) ? l.d1AnalyticsAdaptiveGroups : [], u = /* @__PURE__ */ new Map();
  for (const f of d) {
    const m = String(f?.dimensions?.datetimeHour || "").trim();
    if (!m) continue;
    const p = Date.parse(m);
    if (!Number.isFinite(p)) continue;
    const g = ot(new Date(p), n), h = `${g.dateKey}:${g.hour}`, y = u.get(h) || {
      dateKey: g.dateKey,
      hour: g.hour,
      rowsWritten: 0,
      writeQueries: 0
    };
    y.rowsWritten += Math.max(0, Number(f?.sum?.rowsWritten) || 0), y.writeQueries += Math.max(0, Number(f?.sum?.writeQueries) || 0), u.set(h, y);
  }
  return [...u.values()].sort((f, m) => f.dateKey !== m.dateKey ? String(f.dateKey).localeCompare(String(m.dateKey)) : Number(f.hour) - Number(m.hour));
}
async function Ff({ cfAccountId: o, cfZoneId: e, cfApiToken: t, startIso: r, endIso: a, utcOffsetMinutes: n = k.Defaults.ScheduleUtcOffsetMinutes }) {
  if (!o || !t) return null;
  const s = await gn(o, t, `
  query {
    viewer {
      accounts(filter: { accountTag: ${_e(o)} }) {
        workersInvocationsAdaptive(limit: 10000, filter: { datetime_geq: ${_e(r)}, datetime_leq: ${_e(a)} }) {
          dimensions { datetime scriptName status }
          sum { requests }
        }
      }
    }
  }`), i = Array.isArray(s?.workersInvocationsAdaptive) ? s.workersInvocationsAdaptive : [], c = Array.from({ length: 24 }, (d, u) => ({
    label: String(u).padStart(2, "0") + ":00",
    total: 0
  }));
  let l = 0;
  for (const d of i) {
    const u = Number(d?.sum?.requests) || 0;
    l += u;
    const f = d?.dimensions?.datetime;
    if (!f) continue;
    const m = new Date(f);
    if (Number.isNaN(m.getTime())) continue;
    const p = ot(m, n).hour;
    c[p] && (c[p].total += u);
  }
  return {
    totalRequests: l,
    hourlySeries: c
  };
}
async function Uf({ cfAccountId: o, cfZoneId: e, cfApiToken: t, zoneNameFallback: r = "" }) {
  const a = [], n = (s, i = {}) => {
    const c = lo(s);
    if (!c) return;
    const l = i.wildcard === !0 || c.wildcard === !0;
    a.push({
      hostname: c.hostname,
      path: String(i.path || ""),
      wildcard: l,
      score: To(c.hostname, {
        wildcard: l,
        path: i.path || ""
      })
    });
  };
  if (o && e) try {
    const s = await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(String(o).trim())}/workers/domains?zone_id=${encodeURIComponent(String(e).trim())}`, t);
    for (const i of s?.result || []) n(i?.hostname);
  } catch (s) {
    console.log("CF Workers domains lookup failed, will try routes", s);
  }
  if (!a.length && e) try {
    let s = 1, i = 1;
    do {
      const c = await Ee(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(String(e).trim())}/workers/routes?page=${s}&per_page=100`, t);
      i = Number(c?.result_info?.total_pages || c?.result_info?.totalPages || 1);
      for (const l of c?.result || []) {
        const d = Ri(l?.pattern);
        d && n(d.hostname, {
          wildcard: d.wildcard,
          path: d.path
        });
      }
      s += 1;
    } while (s <= i && s <= 5);
  } catch (s) {
    console.log("CF Workers routes lookup failed", s);
  }
  return a.length ? (a.sort((s, i) => i.score - s.score || s.hostname.length - i.hostname.length || s.hostname.localeCompare(i.hostname)), a[0].hostname) : r || "未知域名 (请配置 CF 联动)";
}
function qt(o = "") {
  const e = String(o || "").trim();
  return /^[a-z0-9_][a-z0-9-_]*$/i.test(e) ? e : "";
}
function hn(o) {
  if (o !== void 0)
    try {
      return JSON.parse(JSON.stringify(o));
    } catch {
      return null;
    }
}
function He(o, e = [], t = {}) {
  if (typeof o == "string") return String(o).trim();
  if (!o || typeof o != "object") return "";
  const r = Array.isArray(e) ? e : [], a = [
    "id",
    "value",
    "name",
    "region",
    "provider",
    "providerId",
    "hostname",
    "host"
  ], n = r.length ? r : a, s = t?.allowFallback !== !1, i = [n];
  s && r.length && i.push(a);
  const c = /* @__PURE__ */ new Set();
  for (const l of i) for (const d of l) {
    if (c.has(d)) continue;
    c.add(d);
    const u = o?.[d];
    if (typeof u == "string" && u.trim()) return u.trim();
    if (!(!u || typeof u != "object"))
      for (const f of l) {
        const m = u?.[f];
        if (typeof m == "string" && m.trim()) return m.trim();
      }
  }
  return "";
}
function kf(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e ? e === "aws" ? "AWS" : e === "gcp" || e === "google" ? "GCP" : e === "azure" ? "Azure" : e.toUpperCase() : "";
}
function Hf(o = "", e = "") {
  const t = String(o || "").trim().toLowerCase().replace(/_/g, "-"), r = String(e || "").trim().toLowerCase(), a = `${r}:${t}`;
  if (!t && !r) return {
    key: "other",
    label: "其他",
    sortOrder: 9
  };
  const n = (s = []) => s.some((i) => a.includes(String(i || "").trim().toLowerCase()));
  return n([
    "wnam",
    "enam",
    "americas",
    "latam",
    "northamerica",
    "southamerica",
    "canada",
    "brazil",
    "mexico",
    "chile",
    "argentina",
    "eastus",
    "westus",
    "centralus",
    "northcentralus",
    "southcentralus",
    "us-east",
    "us-west",
    "us-central",
    "us-south",
    "ca-central",
    "ca-east",
    "sa-east",
    "na-",
    "sa-",
    "us-",
    "ca-"
  ]) ? {
    key: "americas",
    label: "美洲",
    sortOrder: 0
  } : n([
    "apac",
    "asia",
    "ap-",
    "australia",
    "japan",
    "korea",
    "singapore",
    "taiwan",
    "hongkong",
    "india",
    "jakarta",
    "sydney",
    "melbourne",
    "tokyo",
    "osaka",
    "seoul",
    "mumbai",
    "delhi",
    "perth",
    "newzealand"
  ]) ? {
    key: "asia-pacific",
    label: "亚太",
    sortOrder: 1
  } : n([
    "weur",
    "eeur",
    "europe",
    "eu-",
    "france",
    "germany",
    "italy",
    "spain",
    "poland",
    "sweden",
    "norway",
    "switzerland",
    "netherlands",
    "belgium",
    "ireland",
    "westeurope",
    "northeurope",
    "finland",
    "uk",
    "london"
  ]) ? {
    key: "europe",
    label: "欧洲",
    sortOrder: 2
  } : n([
    "mea",
    "middleeast",
    "me-",
    "af-",
    "africa",
    "uae",
    "qatar",
    "saudi",
    "israel",
    "bahrain",
    "kuwait",
    "southafrica",
    "johannesburg",
    "capetown",
    "doha",
    "telaviv"
  ]) ? {
    key: "middle-east-africa",
    label: "中东与非洲",
    sortOrder: 3
  } : {
    key: "other",
    label: "其他",
    sortOrder: 9
  };
}
function $f(o) {
  return Array.isArray(o) ? o : o && typeof o == "object" ? [o] : typeof o == "string" && o.trim() ? [{ value: o }] : [];
}
function Bf(o = []) {
  const e = [], t = /* @__PURE__ */ new Set();
  for (const r of Array.isArray(o) ? o : []) {
    const a = String(r?.id || r?.provider || r?.providerId || "").trim().toLowerCase();
    if (!a) continue;
    const n = kf(a);
    for (const s of Array.isArray(r?.regions) ? r.regions : []) {
      const i = String(s?.id || s?.region || s?.value || "").trim();
      if (!i) continue;
      const c = `${a}:${i}`;
      if (t.has(c)) continue;
      t.add(c);
      const l = Hf(i, a);
      e.push({
        provider: a,
        region: i,
        value: c,
        providerLabel: n,
        regionLabel: i,
        geoKey: l.key,
        geoLabel: l.label,
        geoSortOrder: l.sortOrder
      });
    }
  }
  return e.sort((r, a) => String(r.providerLabel || r.provider || "").localeCompare(String(a.providerLabel || a.provider || "")) || Number(r.geoSortOrder || 0) - Number(a.geoSortOrder || 0) || String(r.regionLabel || r.region || "").localeCompare(String(a.regionLabel || a.region || "")) || String(r.value || "").localeCompare(String(a.value || "")));
}
function Or(o, e = "", t = []) {
  const r = He(o, [
    "region",
    "value",
    "id"
  ]);
  if (!r) return "";
  if (r.includes(":")) return r;
  const a = He(e, [
    "provider",
    "providerId",
    "id",
    "value"
  ]).toLowerCase();
  if (a) return `${a}:${r}`;
  const n = (Array.isArray(t) ? t : []).filter((s) => String(s?.region || "").trim() === r || String(s?.value || "").trim() === r);
  return n.length === 1 ? String(n[0]?.value || "").trim() : r;
}
function Ea(o = {}, e = []) {
  const t = o && typeof o == "object" ? o : {}, r = String(t?.mode || "").trim().toLowerCase(), a = $f(t?.target), n = Or(t?.region, t?.provider || t?.providerId || "", e), s = a.find((_) => !!Or(He(_, [
    "region",
    "value",
    "id"
  ]), He(_, ["provider", "providerId"]), e)), i = s ? Or(He(s, [
    "region",
    "value",
    "id"
  ]), He(s, ["provider", "providerId"]), e) : "", c = He(t?.hostname, ["hostname"], { allowFallback: !1 }) || He(t, ["hostname"], { allowFallback: !1 }), l = He(a.find((_) => He(_, ["hostname"], { allowFallback: !1 })), ["hostname"], { allowFallback: !1 }), d = He(t?.host, ["host"], { allowFallback: !1 }) || He(t, ["host"], { allowFallback: !1 }), u = He(a.find((_) => He(_, ["host"], { allowFallback: !1 })), ["host"], { allowFallback: !1 }), f = He(a[0], ["value", "id"]);
  let m = "default", p = "__default__", g = "", h = "default", y = "";
  return r === "smart" ? (m = "smart", p = "__smart__", h = "smart") : r === "targeted" ? c || l ? (m = "hostname", p = "", g = c || l, h = "") : d || u ? (m = "host", p = "", g = d || u, h = "") : (m = "targeted", p = i || n || "", g = p || f || "", h = "") : n ? (m = "region", p = n, h = "region", y = n) : c ? (m = "hostname", p = "", g = c, h = "") : d ? (m = "host", p = "", g = d, h = "") : (i || a.length > 0) && (m = "targeted", p = i || "", g = p || f || "", h = ""), {
    currentMode: m,
    currentValue: p,
    currentTarget: g,
    selectedMode: h,
    selectedRegion: y,
    isTargetedOverride: m === "hostname" || m === "host" || m === "targeted"
  };
}
function Ac(o = []) {
  return (Array.isArray(o) ? o : []).filter((e) => e && typeof e == "object").map((e) => {
    const t = String(e.scope || "").trim(), r = String(e.permission || "").trim(), a = String(e.alternative || "").trim(), n = String(e.note || "").trim(), s = [];
    return t && s.push(`${t}级`), r && s.push(`"${r}"`), a && s.push(`（若当前令牌仅授予写权限，可改用 "${a}"）`), n && s.push(`：${n}`), s.join("");
  }).filter(Boolean);
}
function Cc(o = "", e = {}) {
  const t = String(o || "").trim().toLowerCase();
  if (t === "discovery") {
    const r = e?.includeRouteFallback !== !1, a = [{
      scope: "账号",
      permission: "Workers Scripts Read",
      alternative: "Workers Scripts Write",
      note: "用于读取 Workers Domains，按当前 host 自动识别脚本"
    }];
    return r && a.push({
      scope: "Zone",
      permission: "Workers Routes Read",
      alternative: "Workers Routes Write",
      note: "当 Domains 未命中时，允许继续从 Workers Routes 回退识别脚本"
    }), a;
  }
  return t === "settings_read" ? [{
    scope: "账号",
    permission: "Workers Scripts Read",
    alternative: "Workers Scripts Write",
    note: "用于读取 Worker Settings"
  }] : t === "regions_read" ? [{
    scope: "账号",
    permission: "Workers Scripts Read",
    alternative: "Workers Scripts Write",
    note: "用于读取 Placement 区域列表"
  }] : t === "settings_write" ? [{
    scope: "账号",
    permission: "Workers Scripts Write",
    alternative: "",
    note: "用于写入 Worker Settings / Placement"
  }] : [];
}
function Kf(o = "", e = "读取", t = {}) {
  const r = Ac(Cc(o, t));
  return r.length <= 0 ? `Cloudflare Worker 放置${e}失败：API Token 权限不足` : `Cloudflare Worker 放置${e}失败：API Token 权限不足。至少需要：${r.join("；")}`;
}
function yn(o = "WORKER_PLACEMENT_FORBIDDEN", e = "", t = "读取", r = {}) {
  return we(o, Kf(e, t, r), 403, {
    permissionKind: String(e || "").trim(),
    requiredPermissions: Cc(e, r)
  });
}
function Jn(o = {}) {
  const e = o && typeof o == "object" && !Array.isArray(o) ? o : {}, t = Object.prototype.hasOwnProperty.call(e, "currentValue"), r = Object.prototype.hasOwnProperty.call(e, "selectedMode");
  return {
    configured: e.configured === !0,
    scriptName: String(e.scriptName || "").trim(),
    requestHost: re(e.requestHost || ""),
    currentMode: String(e.currentMode || "default").trim().toLowerCase() || "default",
    currentValue: t ? String(e.currentValue ?? "").trim() : "__default__",
    currentTarget: String(e.currentTarget || "").trim(),
    selectedMode: r ? String(e.selectedMode ?? "").trim().toLowerCase() : "default",
    selectedRegion: String(e.selectedRegion || "").trim(),
    options: Array.isArray(e.options) ? e.options : [],
    warning: String(e.warning || "").trim(),
    error: String(e.error || "").trim()
  };
}
function zf(o = "", e = "", t = !1) {
  const r = re(o), a = re(e);
  return !r || !a ? !1 : t ? r === a || r.endsWith(`.${a}`) : r === a;
}
function Wf(o = "", e = "/") {
  const t = String(o || "").trim(), r = String(e || "/").trim() || "/";
  return !t || t === "/" || t === "/*" ? !0 : t.endsWith("*") ? r.startsWith(t.slice(0, -1)) : r === t;
}
function Gf(o = {}) {
  const e = re(o?.hostname || ""), t = qt(o?.service || o?.script || o?.name || "");
  return !e || !t ? null : {
    source: "domains",
    hostname: e,
    wildcard: !1,
    path: "/",
    scriptName: t,
    score: To(e, {
      wildcard: !1,
      path: "/"
    })
  };
}
function jf(o = {}) {
  const e = Ri(o?.pattern), t = qt(o?.script || o?.service || o?.name || "");
  return !e || !t ? null : {
    source: "routes",
    hostname: e.hostname,
    wildcard: e.wildcard === !0,
    path: e.path || "/",
    pattern: e.pattern,
    scriptName: t,
    score: To(e.hostname, {
      wildcard: e.wildcard === !0,
      path: e.path || "/"
    })
  };
}
function ws(o = [], e = "", t = "/") {
  const r = re(e), a = String(t || "/").trim() || "/", n = [];
  for (const s of Array.isArray(o) ? o : [])
    !s?.scriptName || !s?.hostname || zf(r, s.hostname, s.wildcard === !0) && Wf(s.path || "/", a) && n.push({
      ...s,
      exactHostname: r === re(s.hostname),
      exactPath: String(s.path || "/") === a
    });
  return n.length > 0 ? (n.sort((s, i) => Number(i.exactHostname) - Number(s.exactHostname) || Number(i.exactPath) - Number(s.exactPath) || Number(i.score || 0) - Number(s.score || 0) || String(s.hostname || "").length - String(i.hostname || "").length || String(s.scriptName || "").localeCompare(String(i.scriptName || ""))), n[0]) : null;
}
async function wc(o, e) {
  const t = String(o || "").trim(), r = String(e || "").trim();
  if (!t || !r) return [];
  let a = null;
  try {
    a = await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(t)}/workers/placement/regions`, r);
  } catch (n) {
    throw Number(n?.status) === 403 ? yn("WORKER_PLACEMENT_REGIONS_FORBIDDEN", "regions_read", "读取") : n;
  }
  return Bf(a?.result?.providers);
}
async function Vf(o, e, t = {}) {
  const r = String(o || "").trim(), a = String(e || "").trim();
  if (!r || !a) return [];
  const n = new URL(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(r)}/workers/domains`), s = String(t?.zoneId || "").trim(), i = re(t?.hostname || ""), c = qt(t?.service || "");
  s && n.searchParams.set("zone_id", s), i && n.searchParams.set("hostname", i), c && n.searchParams.set("service", c);
  const l = await Ee(n.toString(), a);
  return Array.isArray(l?.result) ? l.result : [];
}
async function qf(o, e) {
  const t = String(o || "").trim(), r = String(e || "").trim();
  if (!t || !r) return [];
  const a = [];
  let n = 1, s = 1;
  do {
    const i = await Ee(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(t)}/workers/routes?page=${n}&per_page=100`, r);
    Array.isArray(i?.result) && a.push(...i.result), s = Number(i?.result_info?.total_pages || i?.result_info?.totalPages || 1), n += 1;
  } while (n <= s && n <= 10);
  return a;
}
async function ko({ cfAccountId: o, cfZoneId: e, cfApiToken: t, request: r }) {
  const a = new URL(r?.url || "https://invalid.local/"), n = re(a.hostname), s = String(a.pathname || "/").trim() || "/";
  if (!n) throw we("WORKER_PLACEMENT_HOST_INVALID", "当前请求 host 无效，无法识别 Worker 脚本", 400);
  const i = [], c = /* @__PURE__ */ new Set();
  let l = null, d = !1, u = !1;
  const f = [{
    zoneId: e,
    hostname: n
  }, { hostname: n }];
  for (const m of f) {
    const p = JSON.stringify({
      zoneId: String(m?.zoneId || "").trim(),
      hostname: re(m?.hostname || "")
    });
    if (!c.has(`query:${p}`)) {
      c.add(`query:${p}`);
      try {
        const g = await Vf(o, t, m);
        for (const y of g) {
          const _ = Gf(y);
          if (!_) continue;
          const S = `${_.source}|${_.scriptName}|${_.hostname}|${_.path}`;
          c.has(S) || (c.add(S), i.push(_));
        }
        const h = ws(i, n, s);
        if (h?.scriptName) return {
          requestHost: n,
          requestPath: s,
          scriptName: h.scriptName,
          resolvedBy: h.source
        };
      } catch (g) {
        l = g, Number(g?.status) === 403 && (d = !0), console.warn("[worker_placement.resolve_script.domains_failed]", {
          requestHost: n,
          zoneId: String(m?.zoneId || "").trim(),
          hostname: re(m?.hostname || ""),
          reason: se(g)
        });
      }
    }
  }
  try {
    const m = ws(await qf(e, t).then((p) => p.map((g) => jf(g)).filter(Boolean)), n, s);
    if (m?.scriptName) return {
      requestHost: n,
      requestPath: s,
      scriptName: m.scriptName,
      resolvedBy: m.source
    };
  } catch (m) {
    l = m, Number(m?.status) === 403 && (u = !0), console.warn("[worker_placement.resolve_script.routes_failed]", {
      requestHost: n,
      zoneId: String(e || "").trim(),
      reason: se(m)
    });
  }
  throw d || u ? yn("WORKER_PLACEMENT_SCRIPT_DISCOVERY_FORBIDDEN", "discovery", "读取", { includeRouteFallback: u }) : l || we("WORKER_PLACEMENT_SCRIPT_UNRESOLVED", "未能根据当前站点自动识别 Worker 脚本，请确认当前 host 已绑定到该 Zone 的 Workers Domain 或 Workers Route", 400, { requestHost: n });
}
async function Ja(o, e, t) {
  let r = null;
  try {
    r = await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(String(o || "").trim())}/workers/scripts/${encodeURIComponent(String(e || "").trim())}/settings`, String(t || "").trim());
  } catch (a) {
    throw Number(a?.status) === 403 ? yn("WORKER_PLACEMENT_SETTINGS_READ_FORBIDDEN", "settings_read", "读取") : a;
  }
  return $(r?.result) ? r.result : {};
}
async function qr(o, e, t, r = {}) {
  const a = new FormData();
  a.append("settings", new Blob([JSON.stringify(r && typeof r == "object" ? r : {})], { type: "application/json" }), "settings.json");
  let n = null;
  try {
    n = await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(String(o || "").trim())}/workers/scripts/${encodeURIComponent(String(e || "").trim())}/settings`, String(t || "").trim(), {
      method: "PATCH",
      body: a
    });
  } catch (s) {
    throw Number(s?.status) === 403 ? yn("WORKER_PLACEMENT_SETTINGS_WRITE_FORBIDDEN", "settings_write", "保存") : s;
  }
  return $(n?.result) ? n.result : {};
}
function Qa(o, e = "read") {
  const t = e === "write" ? "保存" : e === "default" ? "恢复默认" : "读取", r = String(o?.message || o || "").trim() || `Worker 放置${t}失败`, a = Number(o?.status) || Number(/cf_api_http_(\d+)/i.exec(r)?.[1] || 0), n = String(o?.code || "").trim().toUpperCase();
  return n.startsWith("WORKER_PLACEMENT_") && String(o?.message || "").trim() ? o.message : a === 401 ? `Cloudflare Worker 放置${t}失败：API Token 无效` : a === 403 ? `Cloudflare Worker 放置${t}失败：API Token 权限不足` : a === 404 && e !== "read" ? "Cloudflare Worker 放置保存失败：未找到目标 Worker 脚本" : a === 404 ? "Cloudflare Worker 放置读取失败：未找到目标 Worker 脚本" : n === "WORKER_PLACEMENT_SCRIPT_UNRESOLVED" || n === "WORKER_PLACEMENT_HOST_INVALID" || n === "WORKER_PLACEMENT_CONFIG_REQUIRED" ? o.message : r;
}
function Ho(o = {}) {
  const e = String(o?.cfAccountId || "").trim(), t = String(o?.cfZoneId || "").trim(), r = String(o?.cfApiToken || "").trim(), a = [];
  if (e || a.push("cfAccountId"), t || a.push("cfZoneId"), r || a.push("cfApiToken"), a.length <= 0) return {
    cfAccountId: e,
    cfZoneId: t,
    cfApiToken: r
  };
  throw we("WORKER_PLACEMENT_CONFIG_REQUIRED", "请先在账号设置中填写并保存 Cloudflare Account ID、Zone ID 与 API Token", 400, { missingFields: a });
}
function $o(o = "") {
  const e = qt(o);
  return e ? `sys:worker_placement_region:v1:${e}` : "";
}
function zt(o = "WORKER_PLACEMENT_KV_FAILED", e = "Worker 放置 KV 持久化失败", t = null) {
  return we(o, e, 503, t);
}
function Xf(o) {
  return on(o) && String(o?.code || "").trim().toUpperCase().startsWith("WORKER_PLACEMENT_") && String(o?.details?.dependency || "").trim().toUpperCase() === "KV";
}
function Lc(o = {}, e = "") {
  const t = qt(e);
  if (!t || !$(o)) return null;
  const r = Or(o?.region, o?.provider || o?.providerId || "", []);
  return r ? {
    scriptName: t,
    region: r,
    updatedAt: String(o?.updatedAt || "").trim()
  } : null;
}
async function Nc(o, e = "") {
  if (!o) return null;
  const t = $o(e);
  return t ? Lc(await xe(o, t, { type: "json" }), e) : null;
}
async function Dc(o, e = "", t = "") {
  if (!o) throw zt("WORKER_PLACEMENT_REGION_OVERRIDE_WRITE_FAILED", "Worker 放置 Region 持久化失败：KV 未配置", {
    dependency: "KV",
    operation: "put",
    reason: "kv_not_configured"
  });
  const r = $o(e), a = qt(e), n = Or(t, "", []);
  if (!r || !a || !n) throw zt("WORKER_PLACEMENT_REGION_OVERRIDE_WRITE_FAILED", "Worker 放置 Region 持久化失败：Region 数据无效", {
    dependency: "KV",
    operation: "put",
    key: r,
    scriptName: a,
    region: n,
    reason: "invalid_region_override"
  });
  const s = {
    scriptName: a,
    region: n,
    updatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await o.put(r, JSON.stringify(s));
  } catch (i) {
    throw zt("WORKER_PLACEMENT_REGION_OVERRIDE_WRITE_FAILED", "Worker 放置 Region 持久化失败：KV 写入异常", {
      dependency: "KV",
      operation: "put",
      key: r,
      scriptName: a,
      region: n,
      reason: se(i)
    });
  }
  return s;
}
async function Ls(o, e = "") {
  if (!o) throw zt("WORKER_PLACEMENT_REGION_OVERRIDE_DELETE_FAILED", "Worker 放置 Region 清理失败：KV 未配置", {
    dependency: "KV",
    operation: "delete",
    reason: "kv_not_configured"
  });
  const t = $o(e), r = qt(e);
  if (!t || !r) return !1;
  try {
    await o.delete(t);
  } catch (a) {
    throw zt("WORKER_PLACEMENT_REGION_OVERRIDE_DELETE_FAILED", "Worker 放置 Region 清理失败：KV 删除异常", {
      dependency: "KV",
      operation: "delete",
      key: t,
      scriptName: r,
      reason: se(a)
    });
  }
  return !0;
}
function Yf(o = "") {
  const e = String(o || "").trim();
  return e ? `当前已保存的 Worker Placement Region（${e}）已不在 Cloudflare 可选区域列表中，请重新选择并保存` : "当前已保存的 Worker Placement Region 已不在 Cloudflare 可选区域列表中，请重新选择并保存";
}
function Ns(o = "", e = "", t = "", r = [], a = {}) {
  const n = Or(t, "", r), s = Array.isArray(r) ? r : [], i = s.find((d) => String(d?.value || "").trim() === n) || null, c = a?.regionError || null;
  let l = String(a?.error || "").trim();
  return !l && c ? l = Qa(c, "read") : !l && n && s.length > 0 && !i && (l = Yf(n)), Jn({
    configured: a?.configured !== !1,
    scriptName: o,
    requestHost: e,
    currentMode: "region",
    currentValue: n,
    currentTarget: "",
    selectedMode: "region",
    selectedRegion: n,
    options: s,
    warning: "",
    error: l
  });
}
async function In(o, e, t, r = {}) {
  let a = !1, n = !1, s = "";
  try {
    const i = Lc(r?.previousOverride, e), c = r?.originalState && typeof r.originalState == "object" ? r.originalState : Ea(r?.originalPlacement, r?.regionOptions);
    if (i?.region)
      return a = !0, await qr(o, e, t, { placement: { region: i.region } }), n = !0, {
        rollbackAttempted: a,
        rollbackSucceeded: n,
        rollbackError: s
      };
    a = !0, String(c?.currentMode || "").trim().toLowerCase() === "default" ? await Ic(o, e, t, r?.regionOptions) : await qr(o, e, t, { placement: hn(r?.originalPlacement) }), n = !0;
  } catch (i) {
    n = !1, s = se(i);
  }
  return {
    rollbackAttempted: a,
    rollbackSucceeded: n,
    rollbackError: s
  };
}
async function Ds(o = {}, e, t = {}) {
  let r = "", a = "";
  try {
    const n = Ho(o), s = await ko({
      ...n,
      request: e
    });
    r = s.scriptName, a = s.requestHost;
    const i = await Nc(t?.kv, s.scriptName);
    let c = [], l = null;
    try {
      c = await wc(n.cfAccountId, n.cfApiToken);
    } catch (u) {
      l = u;
    }
    if (i?.region) return Ns(s.scriptName, s.requestHost, i.region, c, {
      configured: !l,
      regionError: l
    });
    const d = Ea(hn((await Ja(n.cfAccountId, s.scriptName, n.cfApiToken))?.placement), c);
    return d.currentMode === "region" && d.currentValue ? (await Dc(t?.kv, s.scriptName, d.currentValue), Ns(s.scriptName, s.requestHost, d.currentValue, c, {
      configured: !l,
      regionError: l
    })) : Jn({
      configured: !l,
      scriptName: s.scriptName,
      requestHost: s.requestHost,
      currentMode: d.currentMode,
      currentValue: d.currentValue,
      currentTarget: d.currentTarget,
      selectedMode: d.selectedMode,
      selectedRegion: d.selectedRegion,
      options: c,
      warning: "",
      error: l ? Qa(l, "read") : ""
    });
  } catch (n) {
    if (ho(n) || Xf(n) || t?.softFail !== !0) throw n;
    return Jn({
      configured: !1,
      scriptName: r,
      requestHost: a,
      selectedMode: "",
      currentMode: "default",
      currentValue: "__default__",
      error: Qa(n, "read")
    });
  }
}
async function Ic(o, e, t, r = []) {
  const a = await Ja(o, e, t), n = hn(a?.placement), s = Ea(n, r);
  if (s.currentMode === "default") return {
    settings: a,
    placementState: s,
    clearedBy: "already_default"
  };
  for (const d of [{
    tag: "empty_object",
    patch: { placement: {} }
  }, {
    tag: "null",
    patch: { placement: null }
  }]) {
    await qr(o, e, t, d.patch);
    const u = await Ja(o, e, t), f = Ea(u?.placement, r);
    if (f.currentMode === "default") return {
      settings: u,
      placementState: f,
      clearedBy: d.tag
    };
  }
  let i = !1, c = !1, l = "";
  if (n !== void 0) {
    i = !0;
    try {
      await qr(o, e, t, { placement: n }), c = !0;
    } catch (d) {
      c = !1, l = se(d);
    }
  }
  throw we("WORKER_PLACEMENT_DEFAULT_BLOCKED", "Cloudflare 当前接口未验证出可安全恢复 Default Placement；本次已停止，未使用近似映射", 409, {
    scriptName: e,
    rollbackAttempted: i,
    rollbackSucceeded: c,
    rollbackError: l
  });
}
function Jf(o = {}, e = {}) {
  const { kernel: t } = o, { CacheManager: r, buildAdminShellState: a, buildAdminUiContract: n, withAdminShellRuntimeStatus: s } = o;
  return {
    async getDashboardSnapshot(i, { env: c, ctx: l, kv: d, db: u }) {
      const f = await ue(c);
      return Q(await t.getDashboardSnapshotPayload(c, {
        ctx: l,
        kv: d,
        db: u,
        config: f,
        forceRefresh: i?.forceRefresh === !0
      }));
    },
    async getDashboardStats(i, { env: c, ctx: l, kv: d, db: u }) {
      const f = await ue(c), m = await t.getDashboardSnapshotPayload(c, {
        ctx: l,
        kv: d,
        db: u,
        config: f,
        forceRefresh: i?.forceRefresh === !0
      });
      return Q({
        ...m?.stats && typeof m.stats == "object" ? m.stats : {},
        cacheMeta: m?.cacheMeta && typeof m.cacheMeta == "object" ? m.cacheMeta : {}
      });
    },
    async getMonthlyTrafficStats(i, { env: c, ctx: l }) {
      const d = await ue(c);
      return Q(await t.getDashboardMonthlyTrafficPayload(c, {
        ctx: l,
        config: d,
        forceRefresh: i?.forceRefresh === !0
      }));
    },
    async getRuntimeStatus(i, { env: c, db: l }) {
      const d = await ue(c), u = await t.getRuntimeStatusPayload(c, {
        db: l,
        config: d,
        forceRefresh: i?.forceRefresh === !0
      });
      return Q({
        status: u?.status && typeof u.status == "object" ? u.status : {},
        cacheMeta: u?.cacheMeta && typeof u.cacheMeta == "object" ? u.cacheMeta : {}
      });
    },
    async getAdminBootstrap(i, { env: c, ctx: l, kv: d, db: u }) {
      try {
        const f = await ue(c), m = $e(c), [p, g] = await Promise.all([r.getNodesListStrict(c, l), t.getRuntimeStatusPayload(c, {
          ctx: l,
          kv: d,
          db: u,
          config: f
        })]), h = await t.getAdminRevisionsForRead({
          env: c,
          kv: d,
          db: u
        }, {
          ctx: l,
          config: f,
          nodes: p
        });
        return Q({
          adminPath: it(c),
          loginPath: Do(c),
          initHealth: m,
          config: Ct(f),
          hostDomain: ze(c),
          legacyHost: Kr(c),
          contract: n(),
          nodes: p,
          shell: a(c, m, f),
          runtimeStatus: g?.status && typeof g.status == "object" ? g.status : s({}, c, f, m),
          revisions: h,
          generatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (f) {
        throw wt(f, "ADMIN_BOOTSTRAP_READ_FAILED", "管理台启动数据加载失败：KV 读取异常", "admin.read.bootstrap");
      }
    },
    async getSettingsBootstrap(i, { env: c, ctx: l, kv: d, db: u }) {
      let f;
      try {
        f = await ue(c);
      } catch (h) {
        throw wt(h, "SETTINGS_BOOTSTRAP_READ_FAILED", "设置页加载失败：KV 读取异常", "admin.read.settings_bootstrap");
      }
      let m = [], p = {}, g = {};
      try {
        m = await r.getNodesListStrict(c, l);
      } catch (h) {
        console.warn("[settings_bootstrap.nodes_degraded]", se(h));
      }
      try {
        const h = await t.getRuntimeStatusPayload(c, {
          ctx: l,
          kv: d,
          db: u,
          config: f
        });
        p = h?.status && typeof h.status == "object" ? h.status : {};
      } catch (h) {
        console.warn("[settings_bootstrap.runtime_status_degraded]", se(h));
      }
      try {
        g = await t.getAdminRevisionsForRead({
          env: c,
          kv: d,
          db: u
        }, {
          ctx: l,
          config: f,
          nodes: m
        });
      } catch (h) {
        console.warn("[settings_bootstrap.revisions_degraded]", se(h));
      }
      return Q({
        config: Ct(f),
        hostDomain: ze(c),
        legacyHost: Kr(c),
        contract: n(),
        nodes: m,
        runtimeStatus: s(p, c, f, $e(c)),
        revisions: g,
        generatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      });
    },
    async getWorkerPlacementStatus(i, { env: c, request: l, kv: d }) {
      try {
        return Q(await Ds(await ue(c), l, {
          softFail: !0,
          kv: d
        }));
      } catch (u) {
        throw wt(u, "WORKER_PLACEMENT_READ_FAILED", "Worker 放置状态读取失败：KV 读取异常", "admin.read.worker_placement");
      }
    },
    async saveWorkerPlacement(i, { env: c, request: l, kv: d }) {
      let u;
      try {
        u = await ue(c);
      } catch (m) {
        throw wt(m, "WORKER_PLACEMENT_SAVE_FAILED", "Worker 放置保存失败：KV 读取异常", "admin.write.worker_placement");
      }
      const f = String(i?.mode || "").trim().toLowerCase();
      if (f !== "default" && f !== "smart" && f !== "region") return z("WORKER_PLACEMENT_MODE_INVALID", "请选择有效的 Worker 放置模式");
      try {
        const m = Ho(u), p = await ko({
          ...m,
          request: l
        }), g = await Nc(d, p.scriptName), h = await wc(m.cfAccountId, m.cfApiToken), y = hn((await Ja(m.cfAccountId, p.scriptName, m.cfApiToken))?.placement), _ = Ea(y, h);
        if (f === "region") {
          const S = String(i?.region || "").trim(), T = h.find((b) => String(b?.value || "").trim() === S);
          if (!T) return z("WORKER_PLACEMENT_REGION_INVALID", "所选 Placement 区域已失效，请刷新后重试");
          await qr(m.cfAccountId, p.scriptName, m.cfApiToken, { placement: { region: T.value } });
          try {
            await Dc(d, p.scriptName, T.value);
          } catch (b) {
            const R = await In(m.cfAccountId, p.scriptName, m.cfApiToken, {
              previousOverride: g,
              originalPlacement: y,
              originalState: _,
              regionOptions: h
            });
            throw zt(b?.code || "WORKER_PLACEMENT_REGION_OVERRIDE_WRITE_FAILED", String(b?.message || "Worker 放置 Region 持久化失败：KV 写入异常"), {
              ...$(b?.details) ? b.details : {},
              requestedMode: f,
              dependency: "KV",
              region: T.value,
              rollbackAttempted: R.rollbackAttempted,
              rollbackSucceeded: R.rollbackSucceeded,
              rollbackError: R.rollbackError
            });
          }
        } else if (f === "smart") {
          if (await qr(m.cfAccountId, p.scriptName, m.cfApiToken, { placement: { mode: "smart" } }), g) try {
            await Ls(d, p.scriptName);
          } catch (S) {
            const T = await In(m.cfAccountId, p.scriptName, m.cfApiToken, {
              previousOverride: g,
              originalPlacement: y,
              originalState: _,
              regionOptions: h
            });
            throw zt(S?.code || "WORKER_PLACEMENT_REGION_OVERRIDE_DELETE_FAILED", String(S?.message || "Worker 放置 Region 清理失败：KV 删除异常"), {
              ...$(S?.details) ? S.details : {},
              requestedMode: f,
              dependency: "KV",
              rollbackAttempted: T.rollbackAttempted,
              rollbackSucceeded: T.rollbackSucceeded,
              rollbackError: T.rollbackError
            });
          }
        } else if (await Ic(m.cfAccountId, p.scriptName, m.cfApiToken, h), g) try {
          await Ls(d, p.scriptName);
        } catch (S) {
          const T = await In(m.cfAccountId, p.scriptName, m.cfApiToken, {
            previousOverride: g,
            originalPlacement: y,
            originalState: _,
            regionOptions: h
          });
          throw zt(S?.code || "WORKER_PLACEMENT_REGION_OVERRIDE_DELETE_FAILED", String(S?.message || "Worker 放置 Region 清理失败：KV 删除异常"), {
            ...$(S?.details) ? S.details : {},
            requestedMode: f,
            dependency: "KV",
            rollbackAttempted: T.rollbackAttempted,
            rollbackSucceeded: T.rollbackSucceeded,
            rollbackError: T.rollbackError
          });
        }
        return Q(await Ds(u, l, {
          softFail: !1,
          kv: d
        }));
      } catch (m) {
        return z("WORKER_PLACEMENT_SAVE_FAILED", Qa(m, f === "default" ? "default" : "write"), De(m?.status, f === "default" ? 409 : 400), $(m?.details) ? m.details : null);
      }
    }
  };
}
var Mc = 600 * 1e3, Qf = Mc;
function nt(o = "", e = "manual") {
  const t = String(e || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", r = String(o || "").trim().toLowerCase();
  return t !== "manual" ? "smart" : r === "full" ? "full" : "smart";
}
function Zf(o = "", e = "manual") {
  return nt(o, e) === "full";
}
function Bo(o = "worker.js") {
  const e = String(o || "").trim().split(/[\\/]+/).pop() || "";
  return e && /\.js$/i.test(e) ? e : "";
}
function Pc(o = "") {
  const e = String(o || "");
  return e && (/(^|\n)\s*export\s+/m.test(e) || /(^|\n)\s*import\s+(?:[\w*{]|["'])/m.test(e)) ? "module" : "service-worker";
}
function em(o = "", e = "worker.js") {
  const t = Bo(e);
  if (t.toLowerCase() !== "worker.js") throw we("WORKER_UPLOAD_FILE_NAME_INVALID", "Worker 文件名必须是 worker.js", 400, { fileName: t || String(e || "").trim() });
  const r = String(o || ""), a = new TextEncoder().encode(r).length;
  if (!r.trim()) throw we("WORKER_UPLOAD_EMPTY", "worker.js 不能为空", 400);
  if (a > 3145728) throw we("WORKER_UPLOAD_TOO_LARGE", `worker.js 体积超过限制（${a} bytes）`, 400, {
    contentLength: a,
    maxBytes: om
  });
  return {
    fileName: t,
    scriptContent: r,
    contentLength: a,
    syntax: Pc(r)
  };
}
function tm(o = "", e = "module") {
  const t = Bo(o) || "worker.js";
  return e === "module" ? { main_module: t } : { body_part: t };
}
function rm(o = "module") {
  return o === "module" ? "application/javascript+module" : "application/javascript";
}
function xc() {
  return [{
    scope: "账号",
    permission: "Workers Scripts Write",
    alternative: "",
    note: "这是账号级 Worker 脚本编辑权限，用于上传 .js 文件并仅更新脚本代码，不修改 bindings 或 settings"
  }];
}
function Oc(o = "更新") {
  const e = Ac(xc());
  return e.length > 0 ? `Cloudflare Worker 脚本${o}失败：API Token 权限不足。至少需要：${e.join("；")}` : `Cloudflare Worker 脚本${o}失败：API Token 权限不足`;
}
function am(o = "WORKER_SCRIPT_UPDATE_FORBIDDEN", e = "更新") {
  return we(o, Oc(e), 403, { requiredPermissions: xc() });
}
async function nm(o, e, t, r, a = {}) {
  const n = String(o || "").trim(), s = qt(e), i = String(t || "").trim(), c = Bo(a?.fileName) || "worker.js", l = String(r || ""), d = Pc(l), u = new FormData();
  u.append("metadata", new Blob([JSON.stringify(tm(c, d))], { type: "application/json" }), "metadata.json"), u.append("files", new Blob([l], { type: rm(d) }), c);
  let f = null;
  try {
    f = await Ee(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(n)}/workers/scripts/${encodeURIComponent(s)}/content`, i, {
      method: "PUT",
      body: u
    });
  } catch (m) {
    throw Number(m?.status) === 403 ? am("WORKER_SCRIPT_UPDATE_FORBIDDEN", "更新") : m;
  }
  return {
    syntax: d,
    fileName: c,
    result: $(f?.result) ? f.result : {}
  };
}
function Is(o) {
  const e = String(o?.message || o || "").trim() || "Worker 脚本更新失败", t = Number(o?.status) || Number(/cf_api_http_(\d+)/i.exec(e)?.[1] || 0), r = String(o?.code || "").trim().toUpperCase();
  return r === "WORKER_SCRIPT_UPDATE_FORBIDDEN" && String(o?.message || "").trim() ? o.message : r === "WORKER_PLACEMENT_SCRIPT_DISCOVERY_FORBIDDEN" ? String(o?.message || "").replace("Cloudflare Worker 放置读取失败", "Cloudflare Worker 脚本定位失败").trim() : r === "WORKER_PLACEMENT_SCRIPT_UNRESOLVED" || r === "WORKER_PLACEMENT_HOST_INVALID" || r === "WORKER_PLACEMENT_CONFIG_REQUIRED" ? e : t === 401 ? "Cloudflare Worker 和 HTML 更新失败：API Token 无效" : t === 403 ? Oc("更新") : t === 404 ? "Cloudflare Worker 和 HTML 更新失败：未找到目标 Worker 脚本" : e;
}
var om = 3 * 1024 * 1024;
function sm(o = {}, e = {}) {
  const { kernel: t } = o, { buildAdminLocalIndexUploadRecord: r } = o;
  return {
    async loadConfig(a, { env: n, kv: s, db: i, ctx: c }) {
      try {
        const l = await ue(n), d = await t.getAdminRevisionsForRead({
          env: n,
          kv: s,
          db: i
        }, {
          ctx: c,
          config: l
        });
        return Q({
          config: Ct(l),
          revisions: d
        });
      } catch (l) {
        throw wt(l, "CONFIG_READ_FAILED", "设置读取失败：KV 读取异常", "admin.read.config");
      }
    },
    async previewConfig(a, { env: n, kv: s, ctx: i }) {
      const c = a?.config && typeof a.config == "object" && !Array.isArray(a.config) ? a.config : {};
      if (!s) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
      const l = await ue(n), d = await t.prepareRuntimeConfigPersistence(Nn(c, l), {
        env: n,
        kv: s,
        ctx: i
      });
      return Q({
        config: Ct(d.nextConfig),
        hostPrefixDnsSyncCount: d.dnsPlans.length
      });
    },
    async previewTidyData(a, { env: n, kv: s, db: i }) {
      const c = String(a?.scope || "kv").trim().toLowerCase() === "d1" ? "d1" : "kv";
      try {
        if (c === "d1") {
          if (!i) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库");
          const u = await t.buildD1TidyPlan(n, {
            db: i,
            kv: s,
            maintenanceMode: nt(a?.maintenanceMode, "manual")
          }), f = u.schemaStatus?.schemaReady !== !0, m = f ? "" : await t.createD1TidyPlanToken(n, u);
          return Q({
            success: !0,
            scope: "d1",
            planHash: f ? "" : u.planHash,
            planToken: m,
            planExpiresAt: m ? new Date(H() + Qf).toISOString() : "",
            requiresSchemaInitialization: f,
            summary: u.summary,
            ...u.preview
          });
        }
        if (!s) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace");
        const l = await t.buildKvTidyPlan(n, {
          kv: s,
          db: i
        }), d = await t.createKvTidyPlanToken(n, l);
        return Q({
          success: !0,
          scope: "kv",
          planHash: l.planHash,
          planToken: d,
          planExpiresAt: new Date(H() + Mc).toISOString(),
          summary: l.summary,
          ...l.preview
        });
      } catch (l) {
        const d = l?.message || String(l);
        return z(String(l?.code || "TIDY_PREVIEW_FAILED"), d, De(l?.status, 500), {
          scope: c,
          ...$(l?.details) ? l.details : {}
        });
      }
    },
    async updateWorkerAndAdminIndex(a, { env: n, request: s, kv: i, ctx: c }) {
      if (!i) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
      let l;
      try {
        l = await ue(n);
      } catch (S) {
        throw wt(S, "WORKER_HTML_UPDATE_FAILED", "Worker 和 HTML 更新失败：KV 读取异常", "admin.write.worker_html");
      }
      const d = typeof a?.workerScriptContent == "string" ? a.workerScriptContent : "", u = typeof a?.indexHtml == "string" ? a.indexHtml : "";
      if (!d.trim() || !u.trim()) return z("WORKER_HTML_FILES_REQUIRED", "必须同时上传 worker.js 和 index.html，缺一不可", 400, {
        workerFileProvided: !!d.trim(),
        indexFileProvided: !!u.trim()
      });
      let f, m;
      try {
        f = em(d, a?.workerFileName);
        const S = String(a?.indexFileName || "").trim().split(/[\\/]+/).pop() || "";
        if (S.toLowerCase() !== "index.html") return z("ADMIN_INDEX_UPLOAD_FILE_NAME_INVALID", "HTML 文件名必须是 index.html", 400, { fileName: S || String(a?.indexFileName || "").trim() });
        m = await r(u, S);
      } catch (S) {
        return z(String(S?.code || "WORKER_HTML_VALIDATION_FAILED"), se(S, "Worker 或 HTML 文件校验失败"), De(S?.status, 400), $(S?.details) ? S.details : null);
      }
      let p, g;
      try {
        p = Ho(l), g = await ko({
          ...p,
          request: s
        });
      } catch (S) {
        return z(String(S?.code || "WORKER_SCRIPT_CONTEXT_FAILED"), Is(S), De(S?.status, 400), $(S?.details) ? S.details : null);
      }
      let h;
      try {
        h = await t.persistAdminIndexUpload(m, {
          env: n,
          kv: i,
          ctx: c
        });
      } catch (S) {
        return z(String(S?.code || "ADMIN_INDEX_UPLOAD_FAILED"), se(S, "index.html 激活失败"), De(S?.status, 500), $(S?.details) ? S.details : null);
      }
      let y;
      try {
        y = await nm(p.cfAccountId, g.scriptName, p.cfApiToken, f.scriptContent, { fileName: f.fileName });
      } catch (S) {
        let T = !1, b = !1, R = "", w = "";
        try {
          const L = await t.rollbackAdminIndexUploadActivation(h.previousConfig, h.config, {
            env: n,
            kv: i,
            ctx: c
          });
          T = !0, b = L.skipped === !0, R = String(L.reason || "").trim();
        } catch (L) {
          w = se(L, "rollback_failed");
        }
        return z(String(S?.code || "WORKER_HTML_UPDATE_FAILED"), Is(S), De(S?.status, 400), {
          ...$(S?.details) ? S.details : {},
          htmlRollbackAttempted: !0,
          htmlRollbackSucceeded: T,
          htmlRollbackSkipped: b,
          htmlRollbackReason: R,
          htmlRollbackError: w
        });
      }
      const _ = y.result;
      return Q({
        success: !0,
        scriptName: g.scriptName,
        requestHost: g.requestHost,
        worker: {
          fileName: y.fileName,
          bytes: f.contentLength,
          syntax: y.syntax,
          modifiedOn: String(_?.modified_on || _?.modifiedOn || "").trim(),
          etag: String(_?.etag || "").trim(),
          handlers: Array.isArray(_?.handlers) ? _.handlers : [],
          hasModules: _?.has_modules === !0 || _?.hasModules === !0
        },
        html: {
          fileName: h.record.fileName,
          bytes: h.record.bytes,
          revision: h.record.revision,
          uploadedAt: h.record.uploadedAt
        },
        config: Ct(h.config),
        revisions: await t.getAdminRevisions(n, {
          ctx: c,
          config: h.config
        })
      });
    },
    async saveConfig(a, { env: n, ctx: s, kv: i }) {
      if (!i) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
      const c = await ue(n), l = a.config ? await t.persistRuntimeConfig(Nn(a.config, c), {
        env: n,
        kv: i,
        ctx: s,
        expectedConfigRevision: a?.expectedConfigRevision,
        mutationId: a?.mutationId,
        forceKvCommit: !0
      }) : c, d = await t.getAdminRevisions(n, {
        ctx: s,
        config: l
      });
      return Q({
        success: !0,
        committed: !0,
        config: Ct(l),
        revision: String(d.configRevision || ""),
        revisions: d
      });
    },
    async uploadAdminIndex(a, { env: n, ctx: s, kv: i }) {
      if (!i) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
      try {
        const c = String(a?.fileName || "").trim().split(/[\\/]+/).pop() || "";
        if (c.toLowerCase() !== "index.html") return z("ADMIN_INDEX_UPLOAD_FILE_NAME_INVALID", "HTML 文件名必须是 index.html", 400, { fileName: c || String(a?.fileName || "").trim() });
        const l = await r(a?.indexHtml, c), d = await t.persistAdminIndexUpload(l, {
          env: n,
          kv: i,
          ctx: s
        });
        return Q({
          success: !0,
          source: "local_upload",
          revision: d.record.revision,
          assetRevision: d.record.assetRevision,
          sourceUrl: d.record.sourceUrl,
          fileName: d.record.fileName,
          bytes: d.record.bytes,
          uploadedAt: d.record.uploadedAt,
          config: Ct(d.config),
          revisions: await t.getAdminRevisions(n, {
            ctx: s,
            config: d.config
          })
        });
      } catch (c) {
        return z(String(c?.code || "ADMIN_INDEX_UPLOAD_FAILED"), se(c, "本地 index.html 上传失败"), De(c?.status, 500), $(c?.details) ? c.details : null);
      }
    },
    async exportConfig(a, { env: n, ctx: s, request: i }) {
      const c = t.getKV(n), l = a?.includeSecrets === !0;
      if (l && String(i.headers.get("X-Admin-Confirm") || "").trim() !== "exportConfig") return z("CONFIRMATION_REQUIRED", "Exporting secrets requires explicit confirmation", 428);
      const d = await ue(n), u = pt(n, d), f = c && u.localUploadRevision ? await t.getAdminIndexUploadRecord(c, u.localUploadRevision) : null, m = c ? (await t.loadAllNodeEntitiesFromKvStrict(c, { ctx: s })).filter(Boolean) : [], p = {
        version: k.Defaults.Version,
        exportTime: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        nodes: m,
        config: l ? d : _s(d),
        adminIndexUpload: f ? {
          version: f.version,
          revision: f.revision,
          fileName: f.fileName,
          uploadedAt: f.uploadedAt,
          bytes: f.bytes,
          html: f.html
        } : null,
        secretsRedacted: l !== !0,
        containsSecrets: l === !0
      }, g = new TextEncoder().encode(JSON.stringify({
        action: "importFull",
        ...p
      })).length;
      return g > 12517376 ? z("FULL_BACKUP_TOO_LARGE", "完整备份超过安全回导上限，请先分别导出节点与设置并精简超大节点字段", 413, {
        importRequestBytes: g,
        maxBytes: Ku,
        nodeCount: p.nodes.length,
        adminIndexBytes: Number(f?.bytes) || 0
      }) : Q(p);
    },
    async exportSettings(a, { env: n, request: s }) {
      const i = a?.includeSecrets === !0;
      if (i && String(s.headers.get("X-Admin-Confirm") || "").trim() !== "exportSettings") return z("CONFIRMATION_REQUIRED", "导出完整密钥需要显式确认", 428);
      const c = await ue(n);
      return Q({
        version: k.Defaults.Version,
        type: "settings-only",
        exportTime: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        config: i ? c : _s(c),
        secretsRedacted: i !== !0,
        containsSecrets: i === !0
      });
    },
    async importSettings(a, { env: n, ctx: s, kv: i }) {
      if (!i) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace", 503);
      const c = a?.config && typeof a.config == "object" && !Array.isArray(a.config) ? a.config : a?.settings && typeof a.settings == "object" && !Array.isArray(a.settings) ? a.settings : null;
      if (!c) return z("INVALID_SETTINGS_BACKUP", "设置备份文件无效，缺少 config/settings 对象");
      const l = await ue(n), d = await t.persistRuntimeConfig(Nn(c, l), {
        env: n,
        kv: i,
        ctx: s,
        forceKvCommit: !0
      }), u = await t.getAdminRevisions(n, {
        ctx: s,
        config: d
      });
      return Q({
        success: !0,
        config: Ct(d),
        revisions: u,
        generatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  };
}
function im(o = {}, e = {}) {
  const { kernel: t } = o, { CacheManager: r } = o;
  return {
    async list(a, { env: n, ctx: s, kv: i, db: c }) {
      try {
        const l = await r.getNodesListStrict(n, s);
        return Q({
          nodes: l,
          revisions: await t.getAdminRevisionsForRead({
            env: n,
            kv: i,
            db: c
          }, {
            ctx: s,
            nodes: l
          })
        });
      } catch (l) {
        throw wt(l, "NODE_LIST_READ_FAILED", "节点列表读取失败：KV 读取异常", "admin.read.nodes");
      }
    },
    async getDashboardD1WriteHotspot(a, { env: n, ctx: s }) {
      const i = await ue(n);
      return Q(await t.buildDashboardD1WriteHotspotPayload(n, {
        config: i,
        nowMs: H()
      }));
    },
    async getDashboardCoreStats(a, { env: n, ctx: s, kv: i, db: c }) {
      const l = await ue(n);
      return Q(await t.buildDashboardStatsPayload(n, {
        ctx: s,
        kv: i,
        db: c,
        config: l,
        skipD1WriteHotspot: !0
      }));
    },
    async getDashboardCachedSnapshot(a, { env: n, db: s }) {
      const i = await ue(n);
      return Q({ snapshot: await t.getDashboardCachedSnapshotPayload(n, {
        db: s,
        config: i
      }) });
    },
    async getNode(a, { env: n, ctx: s, kv: i, db: c }) {
      const l = String(a?.name || "").trim();
      if (!l) return z("NODE_NAME_REQUIRED", "请提供节点路径");
      const d = await t.getNodeForRead(l, n);
      if (!d) return z("NODE_NOT_FOUND", "节点不存在", 404);
      const u = {
        name: l.toLowerCase(),
        ...d
      }, f = Zm(l, d);
      return Q({
        success: !0,
        node: u,
        warnings: f ? [f] : [],
        revisions: await t.getAdminRevisionsForRead({
          env: n,
          kv: i,
          db: c
        }, { ctx: s })
      });
    }
  };
}
function Qn(o = [], e = {}) {
  const t = e.renameMap instanceof Map ? e.renameMap : new Map(Object.entries(e.renameMap && typeof e.renameMap == "object" ? e.renameMap : {})), r = /* @__PURE__ */ new Map();
  for (const [l, d] of t.entries()) {
    const u = String(l || "").trim().toLowerCase(), f = String(d || "").trim();
    !u || !f || r.set(u, f);
  }
  const a = new Set(ht(e.removedNames || []).map((l) => String(l || "").trim().toLowerCase()).filter(Boolean)), n = e.allowedNames === void 0 ? null : ht(e.allowedNames || []).map((l) => [String(l || "").trim().toLowerCase(), String(l || "").trim()]).filter(([l, d]) => l && d), s = n ? new Map(n) : null, i = [], c = /* @__PURE__ */ new Set();
  for (const l of ht(o)) {
    const d = String(l || "").trim().toLowerCase();
    if (!d || a.has(d)) continue;
    const u = r.get(d) || String(l || "").trim(), f = u.toLowerCase();
    !f || a.has(f) || s && !s.has(f) || c.has(f) || (c.add(f), i.push(s?.get(f) || u));
  }
  return i;
}
function cm(o, e = null, t = "") {
  const r = String(o?.proxyMode || o?.mode || "").trim().toLowerCase();
  if ([
    "direct",
    "source-direct",
    "origin-direct",
    "node-direct"
  ].includes(r) || o?.direct === !0 || o?.sourceDirect === !0 || o?.directSource === !0 || o?.direct2xx === !0) return !0;
  const a = `${$r(o?.tags, o?.tag).join(" ")} ${o?.remark || ""}`;
  return /(?:^|[\s[(【])(?:直连|source-direct|origin-direct|node-direct)(?:$|[\s\])】])/i.test(a);
}
function lm(o, e = null, t = "") {
  const r = Hr(o);
  return r === "direct" ? !0 : r === "proxy" ? !1 : cm(o, e, t);
}
function Ta(o, e) {
  if (!o) return null;
  try {
    return new URL(o, e instanceof URL ? e : String(e || ""));
  } catch {
    return null;
  }
}
function um(o, e = "GET") {
  const t = String(e || "GET").toUpperCase();
  return o === 303 && t !== "GET" && t !== "HEAD" || (o === 301 || o === 302) && t === "POST" ? "GET" : t;
}
function dm(o = {}, e = {}) {
  const t = zi(da(o, "protocolStrategy") ? o?.protocolStrategy : Mo(o)), r = Number.isFinite(Number(e.hourUtc8)) ? Number(e.hourUtc8) : (/* @__PURE__ */ (/* @__PURE__ */ new Date()).getUTCHours() + 8) % 24, a = r >= 20 && r < 24;
  return t === "aggressive" ? {
    strategy: t,
    enableH2: !0,
    enableH3: !0,
    peakDowngrade: !1,
    forceH1: !1,
    isPeakHour: a
  } : t === "balanced" ? {
    strategy: t,
    enableH2: !0,
    enableH3: !0,
    peakDowngrade: !0,
    forceH1: a,
    isPeakHour: a
  } : {
    strategy: "compat",
    enableH2: !1,
    enableH3: !1,
    peakDowngrade: !0,
    forceH1: !0,
    isPeakHour: a
  };
}
function fm(o = {}, e = {}) {
  const { kernel: t } = o, { CacheManager: r, buildAdminLocalIndexUploadRecord: a } = o;
  return {
    async saveOrImport(n, { action: s, ctx: i, kv: c, env: l }) {
      const d = s === "save" ? [n] : n.nodes, u = us(d, l);
      if (u) return z("NODE_NAME_RESERVED", "节点路径与系统保留路由冲突，请更换后重试", 409, u);
      const f = ds(d, l);
      return f ? z(f.code, f.message, 400, f) : await er(c)(async () => {
        const m = [], p = /* @__PURE__ */ new Map(), g = [], h = ze(l), y = await ue(l);
        for (const b of d) {
          if (!b.name || !b.target && !(Array.isArray(b.lines) && b.lines.length)) continue;
          const R = String(b.name).toLowerCase(), w = b.originalName ? String(b.originalName).toLowerCase() : null, L = !!(w && w !== R);
          if (s === "save" && (!w || w !== R) && await c.get(`${t.PREFIX}${R}`, { type: "json" }))
            return z("NODE_NAME_CONFLICT", "节点路径已存在，请更换后重试", 409, { name: R });
          let U = {};
          L ? U = await c.get(`${t.PREFIX}${w}`, { type: "json" }) || {} : U = await c.get(`${t.PREFIX}${R}`, { type: "json" }) || {};
          const E = t.buildPreparedNodeMutation(b, U, {
            previousName: w || R,
            nextName: R
          });
          if (!E) continue;
          const D = Qe(R, E.nextNode);
          if (D) return z("NODE_RESOURCE_LIMIT_EXCEEDED", "节点配置超过 Worker 资源限制", 400, D);
          E.dnsPlan = t.buildHostPrefixDnsSyncPlan(E.previousName, E.previousNode, E.nextName, E.nextNode, h, {
            config: y,
            forceUpsert: !0
          }), g.push(E), E.isRename && p.set(E.previousName, E.nextName), m.push(R);
        }
        if (s === "save" && m.length === 0) return z("INVALID_TARGET", "目标源站必须是有效的 http/https URL");
        An(g, y, l);
        const _ = m.length > 0 || p.size > 0;
        let S = !1, T = null;
        try {
          await t.applyPreparedNodeMutations(g, {
            env: l,
            kv: c,
            ctx: i,
            requestHost: h
          }), S = g.some((E) => E?.nodeChanged === !0);
          const b = _ ? await t.rebuildNodeIndexesFromKv(c, {
            ctx: i,
            syncLegacyIndex: s === "import"
          }) : null, R = Array.isArray(b?.summaries) ? b.summaries : await r.getNodesList(l, i), w = new Map((Array.isArray(R) ? R : []).map((E) => [String(E?.name || "").toLowerCase().trim(), E])), L = m.map((E) => w.get(String(E || "").toLowerCase().trim()) || null).filter(Boolean), U = Array.isArray(b?.index) ? b.index : Array.isArray(R) ? R.map((E) => E?.name) : [];
          if ((p.size > 0 || s === "save" && L.length === 1) && (T = await t.captureRuntimeConfigRollbackState(l, c), p.size > 0 && await t.commitSourceDirectNodesConfigWithinMutation(l, c, i, {
            renameMap: p,
            allowedNames: U,
            source: s === "import" ? "node_import" : "node_save",
            note: [...p.entries()].map(([E, D]) => `${E}->${D}`).join(",")
          }), s === "save" && L.length === 1)) {
            const E = L[0];
            await t.commitSingleNodeMainVideoStreamShortcutShadowWithinMutation(l, c, i, {
              originalName: n.originalName,
              nodeName: E?.name,
              mode: E?.mainVideoStreamMode,
              source: "node_save",
              note: String(E?.name || "").trim()
            });
          }
          return Q({
            success: !0,
            node: s === "save" ? L[0] : void 0,
            nodes: R,
            importedNodes: s === "import" ? L : void 0,
            revisions: await t.getAdminRevisions(l, {
              ctx: i,
              nodes: R
            })
          });
        } catch (b) {
          let R = "", w = "";
          if (T) try {
            await t.restoreCapturedRuntimeConfigState(T, {
              env: l,
              kv: c,
              ctx: i
            });
          } catch (L) {
            R = se(L, "config_restore_failed");
          }
          if (S) try {
            await t.rollbackPreparedNodeMutations(g, {
              env: l,
              kv: c,
              ctx: i,
              requestHost: h,
              rebuildIndexes: !0
            });
          } catch (L) {
            w = se(L, "rollback_failed");
          }
          throw b && typeof b == "object" && (String(b.code || "").trim() || (b.code = "NODE_MUTATION_FAILED"), b.status = De(b.status, 500), (T || S) && (b.details = {
            ...$(b.details) ? b.details : {},
            rollbackAttempted: !0,
            configRollbackError: R,
            nodeRollbackError: w
          })), b;
        }
      });
    },
    async saveMainVideoStreamPolicyShortcuts(n, { env: s, ctx: i, kv: c }) {
      return c ? await er(c)(async () => {
        const l = await t.loadAllNodeEntitiesFromKvStrict(c, { ctx: i }), d = Array.isArray(l) ? l.map((R) => R?.name) : [], u = Qn(n?.selectedNodeNames || [], { allowedNames: d }), f = new Set(u.map((R) => String(R || "").trim().toLowerCase()).filter(Boolean));
        let m = 0;
        const p = ze(s), g = await ue(s), h = [];
        for (const R of Array.isArray(l) ? l : []) {
          if (!$(R)) continue;
          const w = String(R.name || "").trim().toLowerCase();
          if (!w) continue;
          const L = Hr(R);
          let U = L;
          if (f.has(w) ? U = "direct" : L === "direct" && (U = "inherit"), U !== L) {
            const { name: E, ...D } = R, A = {
              name: w,
              ...D,
              mainVideoStreamMode: U
            }, x = t.buildPreparedNodeMutation(A, R, {
              previousName: w,
              nextName: w
            });
            if (!x) continue;
            x.nextNode = t.normalizeNode(w, x.nextNode || A, { dropLegacyDirectRouting: !0 }).data, x.dnsPlan = t.buildHostPrefixDnsSyncPlan(x.previousName, x.previousNode, x.nextName, x.nextNode, p, {
              config: g,
              forceUpsert: !0
            }), h.push(x), m += 1;
          }
        }
        An(h, g, s);
        const y = ee(g.sourceDirectNodes || []) !== ee(u), _ = m > 0 || y ? await t.captureRuntimeConfigRollbackState(s, c) : null;
        let S = null, T = g;
        try {
          m > 0 && (await t.applyPreparedNodeMutations(h, {
            env: s,
            kv: c,
            ctx: i,
            requestHost: p
          }), S = await t.rebuildNodeIndexesFromKv(c, { ctx: i })), y && (T = await t.commitRuntimeConfig({
            ...g,
            sourceDirectNodes: u
          }, {
            env: s,
            kv: c,
            ctx: i
          }));
        } catch (R) {
          let w = "", L = "";
          if (_) try {
            await t.restoreCapturedRuntimeConfigState(_, {
              env: s,
              kv: c,
              ctx: i
            });
          } catch (U) {
            w = se(U, "config_restore_failed");
          }
          if (m > 0) try {
            await t.rollbackPreparedNodeMutations(h, {
              env: s,
              kv: c,
              ctx: i,
              requestHost: p,
              rebuildIndexes: !0
            });
          } catch (U) {
            L = se(U, "rollback_failed");
          }
          throw R && typeof R == "object" && (String(R.code || "").trim() || (R.code = "NODE_MUTATION_FAILED"), R.status = De(R.status, 500), R.details = {
            ...$(R.details) ? R.details : {},
            rollbackAttempted: !0,
            configRollbackError: w,
            nodeRollbackError: L
          }), R;
        }
        const b = Array.isArray(S?.summaries) ? S.summaries : await r.getNodesList(s, i);
        return Q({
          success: !0,
          selectedNodeNames: u,
          updatedNodeCount: m,
          config: Ct(T),
          nodes: b,
          revisions: await t.getAdminRevisions(s, {
            ctx: i,
            config: T,
            nodes: b
          })
        });
      }) : z("KV_UNAVAILABLE", "KV 未绑定或不可用", 500);
    },
    async importFull(n, { env: s, ctx: i, kv: c }) {
      const l = us(n?.nodes, s);
      if (l) return z("NODE_NAME_RESERVED", "节点路径与系统保留路由冲突，请更换后重试", 409, l);
      const d = ds(n?.nodes, s);
      if (d) return z(d.code, d.message, 400, d);
      const u = Je(n?.config?.indexUrl || "");
      let f = null;
      if ($(n?.adminIndexUpload)) {
        const m = String(n.adminIndexUpload.fileName || "").trim().split(/[\\/]+/).pop() || "";
        if (m.toLowerCase() !== "index.html") return z("ADMIN_INDEX_BACKUP_INVALID", "完整备份中的 HTML 文件名必须是 index.html", 400);
        try {
          f = await a(n.adminIndexUpload.html, m);
        } catch (p) {
          return z(String(p?.code || "ADMIN_INDEX_BACKUP_INVALID"), se(p, "完整备份中的 index.html 无效"), De(p?.status, 400), $(p?.details) ? p.details : null);
        }
        if (u && f.revision !== u) return z("ADMIN_INDEX_BACKUP_REVISION_MISMATCH", "完整备份中的 index.html 与配置版本不一致", 400, {
          expectedRevision: u,
          actualRevision: f.revision
        });
      }
      return u && !f && !await t.getAdminIndexUploadRecord(c, u) ? z("ADMIN_INDEX_BACKUP_MISSING", "完整备份缺少当前配置引用的 index.html", 400, { revision: u }) : await er(c)(async () => {
        const m = await ue(s), p = n.config ? await t.captureRuntimeConfigRollbackState(s, c) : null, g = n.config ? uc(n.config, m) : null, h = g ? ae(g) : m, y = ze(s), _ = f ? t.buildAdminIndexUploadKey(f.revision) : "", S = _ ? await c.get(_) : null, T = n.config ? await c.get(t.ADMIN_ACTIVE_INDEX_KEY) : null, b = u ? f || await t.getAdminIndexUploadRecord(c, u) : null, R = [];
        if (Array.isArray(n.nodes)) for (const D of n.nodes) {
          if (!D.name || !D.target && !(Array.isArray(D.lines) && D.lines.length)) continue;
          const A = String(D.name).toLowerCase(), x = await c.get(`${t.PREFIX}${A}`, { type: "json" }) || {}, O = t.buildPreparedNodeMutation(D, x, {
            previousName: A,
            nextName: A
          });
          O && (O.dnsPlan = t.buildHostPrefixDnsSyncPlan(O.previousName, O.previousNode, O.nextName, O.nextNode, y, {
            previousConfig: m,
            nextConfig: h,
            forceUpsert: !0
          }), R.push(O));
        }
        An(R, h, s);
        let w = null, L = !1;
        try {
          _ && await c.put(_, JSON.stringify(f)), g && (b ? await c.put(t.ADMIN_ACTIVE_INDEX_KEY, JSON.stringify(b)) : await c.delete(t.ADMIN_ACTIVE_INDEX_KEY)), g && (w = await t.commitRuntimeConfig(g, {
            env: s,
            kv: c,
            ctx: i
          })), R.length > 0 && (await t.applyPreparedNodeMutations(R, {
            env: s,
            kv: c,
            ctx: i,
            requestHost: y
          }), L = !0, await t.rebuildNodeIndexesFromKv(c, {
            ctx: i,
            syncLegacyIndex: !0
          }));
        } catch (D) {
          let A = "", x = "", O = "";
          if (L) try {
            await t.rollbackPreparedNodeMutations(R, {
              env: s,
              kv: c,
              ctx: i,
              requestHost: y,
              rebuildIndexes: !0
            });
          } catch (N) {
            x = se(N, "rollback_failed");
          }
          if (p) try {
            await t.restoreCapturedRuntimeConfigAndDnsState(p, {
              env: s,
              kv: c,
              ctx: i
            });
          } catch (N) {
            A = se(N, "config_restore_failed");
          }
          if (_) try {
            S === null ? await c.delete(_) : await c.put(_, S);
          } catch (N) {
            O = se(N, "admin_index_restore_failed");
          }
          if (n.config) try {
            T === null ? await c.delete(t.ADMIN_ACTIVE_INDEX_KEY) : await c.put(t.ADMIN_ACTIVE_INDEX_KEY, T);
          } catch (N) {
            O = [O, se(N, "active_admin_index_restore_failed")].filter(Boolean).join("; ");
          }
          throw D && typeof D == "object" && (String(D.code || "").trim() || (D.code = "IMPORT_FULL_FAILED"), D.status = De(D.status, 500), D.details = {
            ...$(D.details) ? D.details : {},
            rollbackAttempted: !!p || L || !!_,
            configRollbackError: A,
            nodeRollbackError: x,
            adminIndexRollbackError: O
          }), D;
        }
        const U = w || await Re(s), E = await r.getNodesList(s, i);
        return Q({
          success: !0,
          config: U,
          nodes: E,
          adminIndexUpload: f ? {
            revision: f.revision,
            fileName: f.fileName,
            bytes: f.bytes
          } : null,
          revisions: await t.getAdminRevisions(s, {
            ctx: i,
            config: U,
            nodes: E
          })
        });
      });
    },
    async delete(n, { ctx: s, kv: i, env: c }) {
      return await er(i)(async () => {
        if (n.name) {
          const l = String(n.name).toLowerCase(), d = await ue(c), u = await i.get(`${t.PREFIX}${l}`, { type: "json" }) || null, f = u ? t.normalizeNode(l, u || {}).data : null, m = {
            previousName: l,
            previousNode: f,
            nextName: l,
            nextNode: null,
            isRename: !1,
            nodeChanged: !!f,
            isSemanticNoop: !f,
            dnsPlan: t.buildHostPrefixDnsSyncPlan(l, f, "", null, ze(c), { config: d })
          }, p = ze(c);
          let g = !1, h = null;
          try {
            await t.applyPreparedNodeMutations([m], {
              env: c,
              kv: i,
              ctx: s,
              requestHost: p
            }), g = m.nodeChanged === !0;
            const y = await t.rebuildNodeIndexesFromKv(i, { ctx: s });
            h = await t.captureRuntimeConfigRollbackState(c, i), await t.commitSourceDirectNodesConfigWithinMutation(c, i, s, {
              removedNames: [l],
              allowedNames: Array.isArray(y?.index) ? y.index : [],
              source: "node_delete",
              note: l
            });
          } catch (y) {
            let _ = "", S = "";
            if (h) try {
              await t.restoreCapturedRuntimeConfigState(h, {
                env: c,
                kv: i,
                ctx: s
              });
            } catch (T) {
              _ = se(T, "config_restore_failed");
            }
            if (g) try {
              await t.rollbackPreparedNodeMutations([m], {
                env: c,
                kv: i,
                ctx: s,
                requestHost: p,
                rebuildIndexes: !0
              });
            } catch (T) {
              S = se(T, "rollback_failed");
            }
            throw y && typeof y == "object" && (String(y.code || "").trim() || (y.code = "NODE_DELETE_FAILED"), y.status = De(y.status, 500), (h || g) && (y.details = {
              ...$(y.details) ? y.details : {},
              rollbackAttempted: !0,
              configRollbackError: _,
              nodeRollbackError: S
            })), y;
          }
        }
        return Q({
          success: !0,
          revisions: await t.getAdminRevisions(c, { ctx: s })
        });
      });
    },
    async purgeCache(n, { kv: s, request: i }) {
      if (i.headers.get("X-Admin-Confirm") !== "purgeCache") return z("CONFIRMATION_REQUIRED", "敏感操作需要显式确认头", 428);
      const c = await s.get(t.CONFIG_KEY, { type: "json" }) || {};
      if (!c.cfZoneId || !c.cfApiToken) return z("CF_API_ERROR", "请在账号设置中完善 Zone ID 和 API 令牌");
      try {
        return (await Be(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(String(c.cfZoneId).trim())}/purge_cache`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${c.cfApiToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ purge_everything: !0 })
        })).ok ? Q({ success: !0 }) : z("PURGE_FAILED", "清理失败，请检查密钥权限");
      } catch (l) {
        return z("PURGE_ERROR", l.message);
      }
    }
  };
}
function mm(o = {}, e = {}) {
  const { kernel: t } = o;
  return {
    async tidyKvData(r, { env: a, ctx: n, kv: s, db: i }) {
      if (!s) return z("KV_NOT_CONFIGURED", "请先绑定 ENI_KV / KV Namespace");
      try {
        const c = await t.tidyKvData(a, {
          kv: s,
          db: i,
          ctx: n,
          planToken: String(r?.planToken || "").trim()
        }), l = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
        return await pe(t.patchOpsStatus(a, { scheduled: { kvTidy: {
          status: "success",
          lastSuccessAt: l,
          lastTriggeredBy: "manual",
          summary: c.summary
        } } }), "manual.tidy_kv.patch_success_status", null, null), Q({
          success: !0,
          ...c
        });
      } catch (c) {
        const l = c?.message || String(c);
        return await pe(t.patchOpsStatus(a, { scheduled: { kvTidy: {
          status: "failed",
          lastErrorAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastError: l,
          lastTriggeredBy: "manual"
        } } }), "manual.tidy_kv.patch_failed_status", { message: l }, null), z(String(c?.code || "KV_TIDY_FAILED"), l, De(c?.status, 500), $(c?.details) ? c.details : null);
      }
    },
    async tidyD1Data(r, { env: a, ctx: n, kv: s, db: i }) {
      if (!i) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库");
      try {
        const c = nt(r?.maintenanceMode, "manual"), l = await t.tidyD1Data(a, {
          db: i,
          kv: s,
          ctx: n,
          maintenanceMode: c,
          planToken: String(r?.planToken || "").trim()
        }), d = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), u = t.buildD1TidyStatusPayload(l.summary, {
          mode: "manual",
          maintenanceMode: c,
          triggeredBy: "manual",
          timestamp: d
        });
        return await pe(t.patchOpsStatus({
          kv: s,
          db: i
        }, { scheduled: { ...u } }), "manual.tidy_d1.patch_success_status", null, null), Q({
          success: !0,
          ...l
        });
      } catch (c) {
        const l = c?.message || String(c), d = t.buildD1TidyStatusPayload({
          status: "failed",
          lastError: l,
          maintenanceMode: nt(r?.maintenanceMode, "manual")
        }, {
          mode: "manual",
          maintenanceMode: nt(r?.maintenanceMode, "manual"),
          triggeredBy: "manual",
          timestamp: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        });
        return await pe(t.patchOpsStatus({
          kv: s,
          db: i
        }, { scheduled: { ...d } }), "manual.tidy_d1.patch_failed_status", { message: l }, null), z("D1_TIDY_FAILED", l, 500);
      }
    }
  };
}
function pm(o = "") {
  return String(o || "").trim().toLowerCase() === "a" ? "a" : "cname";
}
function Wt(o = {}) {
  return {
    id: String(o?.id || "").trim(),
    type: String(o?.type || "").trim().toUpperCase(),
    name: re(o?.name),
    content: String(o?.content || "").trim(),
    ttl: Number(o?.ttl) || 1,
    proxied: o?.proxied === !0,
    comment: typeof o?.comment == "string" ? o.comment : void 0,
    tags: Array.isArray(o?.tags) ? o.tags.map((e) => String(e)) : void 0
  };
}
async function vr(o, e, t = {}) {
  const r = [];
  let a = 1, n = 1;
  const s = 100, i = re(t?.nameExact || "");
  do {
    const c = new URL(`https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(o)}/dns_records`);
    c.searchParams.set("page", String(a)), c.searchParams.set("per_page", String(s)), i && c.searchParams.set("name.exact", i);
    const l = await Ee(c.toString(), e);
    Array.isArray(l?.result) && r.push(...l.result.map((d) => Wt(d)).filter((d) => d.id && d.name)), n = Number(l?.result_info?.total_pages || l?.result_info?.totalPages || 1), a += 1;
  } while (a <= n && a <= 20);
  return r;
}
function ua(o = {}, e = {}) {
  const t = {
    type: String(e.type || o?.type || "A").trim().toUpperCase(),
    name: re(e.host || o?.name),
    content: String(e.content || "").trim(),
    ttl: Number(o?.ttl) || 1,
    proxied: o?.proxied === !0
  };
  return typeof o?.comment == "string" && (t.comment = o.comment), Array.isArray(o?.tags) && (t.tags = o.tags.map((r) => String(r))), t;
}
function gm(o = "", e = "") {
  const t = String(o || "").trim().toUpperCase(), r = String(e || "").trim();
  return r ? t === "A" ? r : r.toLowerCase() : "";
}
function Fr(o = "", e = "") {
  const t = String(o || "").trim().toUpperCase(), r = gm(t, e);
  return !t || !r ? "" : `${t}|${r}`;
}
function hm(o = []) {
  const e = [], t = /* @__PURE__ */ new Set();
  let r = 0;
  for (const a of Array.isArray(o) ? o : []) {
    const n = String(a?.type || "").trim().toUpperCase(), s = String(a?.content || "").trim(), i = Fr(n, s);
    if (i) {
      if (t.has(i)) {
        r += 1;
        continue;
      }
      t.add(i), e.push({
        type: n,
        content: s,
        ttl: Number(a?.ttl) || 1,
        proxied: a?.proxied === !0,
        comment: typeof a?.comment == "string" ? a.comment : void 0,
        tags: Array.isArray(a?.tags) ? a.tags.map((c) => String(c)) : void 0
      });
    }
  }
  return {
    records: e,
    duplicateCount: r
  };
}
function Ms(o = "", e = 0) {
  return {
    type: String(o || "").trim().toUpperCase(),
    desiredCount: Math.max(0, Number(e) || 0),
    identicalCount: 0,
    updatedCount: 0,
    createdCount: 0,
    deletedCount: 0
  };
}
function ym(o = "a", e = {}, t = {}) {
  const r = {};
  let a = 0, n = 0, s = 0, i = 0, c = 0;
  for (const d of [
    "A",
    "AAAA",
    "CNAME"
  ]) {
    const u = e?.[d];
    !u || typeof u != "object" || (r[d] = {
      type: d,
      desiredCount: Math.max(0, Number(u.desiredCount) || 0),
      identicalCount: Math.max(0, Number(u.identicalCount) || 0),
      updatedCount: Math.max(0, Number(u.updatedCount) || 0),
      createdCount: Math.max(0, Number(u.createdCount) || 0),
      deletedCount: Math.max(0, Number(u.deletedCount) || 0)
    }, a += r[d].desiredCount, n += r[d].identicalCount, s += r[d].updatedCount, i += r[d].createdCount, c += r[d].deletedCount);
  }
  const l = s + i + c;
  return {
    mode: String(o || "a").trim().toLowerCase(),
    desiredCount: a,
    identicalCount: n,
    updatedCount: s,
    createdCount: i,
    deletedCount: c,
    changedCount: l,
    dedupedDesiredCount: Math.max(0, Number(t?.dedupedDesiredCount) || 0),
    familySummaries: r,
    unchangedOnly: l === 0 && n > 0
  };
}
async function Sm(o = {}, e) {
  const t = String(o?.cfZoneId || "").trim(), r = String(o?.cfApiToken || "").trim();
  if (!t || !r) throw new Error("cf_api_missing");
  const a = re(new URL(e.url).hostname), n = await Tc(t, r, {
    scope: "dns.resolve_admin_context.zone_lookup",
    context: { requestHost: a }
  }), s = await vr(t, r), i = String(n?.name || "").trim() || "", c = i || re(s[0]?.name || "");
  let l = a;
  ma(l, c || i) || (l = re(await Uf({
    cfAccountId: o.cfAccountId,
    cfZoneId: t,
    cfApiToken: r,
    zoneNameFallback: c || i || a
  })));
  const d = s.filter((f) => gr(f.type)), u = l ? d.filter((f) => re(f.name) === l) : d;
  return {
    cfZoneId: t,
    cfApiToken: r,
    zone: n,
    zoneName: i,
    currentHost: l,
    requestHost: a,
    totalRecords: s.length,
    editableRecords: d,
    currentHostRecords: u
  };
}
function _m(o = {}) {
  const e = ae(o), t = String(e.cfZoneId || "").trim(), r = String(e.cfApiToken || "").trim();
  if (!t || !r) {
    const a = /* @__PURE__ */ new Error("请在账号设置中完善 Zone ID 和 API 令牌");
    throw a.code = "CF_API_ERROR", a.status = 400, a;
  }
  return {
    cfZoneId: t,
    cfApiToken: r
  };
}
function bm(o = []) {
  return {
    A: Ms("A", o.filter((e) => e.type === "A").length),
    AAAA: Ms("AAAA", o.filter((e) => e.type === "AAAA").length)
  };
}
function Em(o = "", e = [], t = []) {
  const r = /* @__PURE__ */ new Map(), a = [];
  let n = 0;
  for (const i of e) {
    const c = Fr(o, i?.content);
    c && r.set(c, (r.get(c) || 0) + 1);
  }
  for (const i of t) {
    const c = Fr(o, i?.content), l = r.get(c) || 0;
    if (l > 0) {
      n += 1, r.set(c, l - 1);
      continue;
    }
    a.push(i);
  }
  const s = [];
  for (const i of e) {
    const c = Fr(o, i?.content), l = r.get(c) || 0;
    l <= 0 || (s.push(i), r.set(c, l - 1));
  }
  return {
    identicalCount: n,
    reusableCurrentRecords: a,
    pendingDesiredRecords: s
  };
}
function vc(o = "", e = "", t = "", r = "", a = {}) {
  const n = async () => (await vr(o, e, { nameExact: t })).filter((s) => re(s.name) === t && gr(s.type));
  return {
    async deleteRecord(s) {
      s?.id && await Ee(`${r}/${encodeURIComponent(s.id)}`, e, { method: "DELETE" });
    },
    async updateRecord(s, i, c) {
      const l = ua(s, {
        host: t,
        type: i,
        content: c
      });
      return Wt((await Ee(`${r}/${encodeURIComponent(s.id)}`, e, {
        method: "PUT",
        body: JSON.stringify(l)
      }))?.result || {
        id: s.id,
        ...l
      });
    },
    async createRecord(s, i, c = a) {
      const l = ua(c, {
        host: t,
        type: s,
        content: i
      });
      try {
        return {
          record: Wt((await Ee(r, e, {
            method: "POST",
            body: JSON.stringify(l)
          }))?.result || l),
          reusedExisting: !1
        };
      } catch (d) {
        if (String(d?.message || d || "").includes("81058")) {
          const u = (await n()).find((f) => re(f?.name) === t && String(f?.type || "").toUpperCase() === String(s || "").trim().toUpperCase() && Fr(f?.type, f?.content) === Fr(s, i));
          if (u) return {
            record: Wt(u),
            reusedExisting: !0
          };
        }
        throw d;
      }
    },
    async listCurrentHostRecords() {
      return await n();
    }
  };
}
async function Ps(o = "", e = [], t = [], r = {}, a = {}) {
  const n = Em(o, e, t);
  r.identicalCount += n.identicalCount;
  const { reusableCurrentRecords: s, pendingDesiredRecords: i } = n;
  for (let c = 0; c < i.length; c += 1) {
    const l = i[c], d = s[c];
    if (d) {
      await a.updateRecord(d, o, l.content), r.updatedCount += 1;
      continue;
    }
    (await a.createRecord(o, l.content, t[0]))?.reusedExisting === !0 ? r.identicalCount += 1 : r.createdCount += 1;
  }
  for (let c = i.length; c < s.length; c += 1)
    await a.deleteRecord(s[c]), r.deletedCount += 1;
}
async function Tm({ env: o, kv: e, dnsHistoryRepository: t, config: r, host: a, mode: n = "a", desiredRecords: s = [], requestHost: i = "", skipHistory: c = !1, includeAllRecords: l = !0, includeHistory: d = !0 }) {
  const { cfZoneId: u, cfApiToken: f } = _m(r || await Re(o));
  let m = !1, p = !1, g = "";
  const h = hm(s), y = h.records, _ = bm(y);
  try {
    const S = await Uo(u, f, { scope: "dns.persist_records.zone_lookup" }), T = String(S?.name || "").trim() || "";
    if (T && !ma(a, T)) {
      const P = /* @__PURE__ */ new Error("当前站点不在该 Zone 下");
      throw P.code = "INVALID_HOST", P.status = 400, P;
    }
    const b = (await vr(u, f, { nameExact: a })).filter((P) => re(P.name) === a && gr(P.type)), R = {
      baseRecord: b[0] || {
        name: a,
        ttl: 1,
        proxied: !1
      },
      zoneRecordsUrl: `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(u)}/dns_records`
    }, w = vc(u, f, a, R.zoneRecordsUrl, R.baseRecord), L = b.map((P) => Wt(P));
    let U = !1;
    const E = {
      ...w,
      async deleteRecord(P) {
        return U = !0, await w.deleteRecord(P);
      },
      async updateRecord(P, C, I) {
        return U = !0, await w.updateRecord(P, C, I);
      },
      async createRecord(P, C, I) {
        return U = !0, await w.createRecord(P, C, I);
      }
    };
    let D = [], A = null;
    try {
      if (n === "cname") {
        const P = b.filter((j) => j.type === "CNAME"), C = b.filter((j) => j.type === "A" || j.type === "AAAA");
        for (const j of C) await E.deleteRecord(j);
        for (let j = 1; j < P.length; j += 1) await E.deleteRecord(P[j]);
        const I = P[0] || null, M = y[0], F = Number(M?.ttl) || 1, V = M?.proxied === !0;
        if (I) {
          const j = String(I.content || "").trim() !== M.content, K = Number(I.ttl) !== F, q = I.proxied === !0 !== V;
          (j || K || q) && await E.updateRecord({
            ...I,
            ttl: F,
            proxied: V
          }, "CNAME", M.content);
        } else await E.createRecord("CNAME", M.content, {
          ...R.baseRecord,
          ttl: F,
          proxied: V
        });
        D = await vr(u, f, { nameExact: a }), c || (A = await t.recordDnsHostHistory(e, u, a, {
          name: a,
          type: "CNAME",
          content: M.content,
          actor: "admin",
          source: "ui",
          requestHost: i,
          savedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        }));
      } else {
        const P = b.filter((C) => C.type === "CNAME");
        for (const C of P) await E.deleteRecord(C);
        await Ps("A", y.filter((C) => C.type === "A"), b.filter((C) => C.type === "A"), _.A, E), await Ps("AAAA", y.filter((C) => C.type === "AAAA"), b.filter((C) => C.type === "AAAA"), _.AAAA, E), D = await vr(u, f, { nameExact: a });
      }
    } catch (P) {
      if (U) {
        m = !0;
        try {
          const C = await w.listCurrentHostRecords();
          for (const I of C) await w.deleteRecord(I);
          for (const I of L) await w.createRecord(I.type, I.content, I);
          p = !0;
        } catch (C) {
          p = !1, g = String(C?.message || C || "unknown_rollback_error");
        }
      }
      throw P;
    }
    const x = D.filter((P) => gr(P.type)), O = x.filter((P) => re(P.name) === a), N = d === !0 ? A || await t.getDnsHostHistory(e, u, a) : [], v = n === "a" ? ym(n, _, { dedupedDesiredCount: h.duplicateCount }) : null;
    return {
      ok: !0,
      zoneId: u,
      zoneName: T,
      currentHost: a,
      totalRecords: D.length,
      editableRecordCount: x.length,
      filteredCount: O.length,
      records: O,
      ...l === !0 ? { allRecords: x } : {},
      allRecordsIncluded: l === !0,
      history: N,
      mode: n,
      syncSummary: v,
      rollbackAttempted: m,
      rollbackSucceeded: p,
      rollbackError: g
    };
  } catch (S) {
    throw S.details = {
      ...S?.details && typeof S.details == "object" ? S.details : {},
      rollbackAttempted: m,
      rollbackSucceeded: p,
      rollbackError: g
    }, S;
  }
}
function Rm(o = {}, e = {}) {
  const { kernel: t } = o, { persistCloudflareDnsRecordsForHost: r } = o;
  return {
    async listDnsRecords(a, { env: n, kv: s, request: i }) {
      const c = ae(await Re(n)), l = String(c.cfZoneId || "").trim(), d = String(c.cfApiToken || "").trim(), u = a?.includeAllRecords !== !1;
      if (!l || !d) return z("CF_API_ERROR", "请在账号设置中完善 Zone ID 和 API 令牌");
      try {
        const f = await Sm(c, i), m = f.currentHostRecords, p = f.currentHost ? await t.getDnsHostHistory(s, l, f.currentHost) : [];
        return Q({
          ok: !0,
          zoneId: l,
          zoneName: f.zoneName,
          currentHost: f.currentHost,
          totalRecords: f.totalRecords,
          editableRecordCount: f.editableRecords.length,
          filteredCount: m.length,
          records: m,
          ...u === !0 ? { allRecords: f.editableRecords } : {},
          allRecordsIncluded: u === !0,
          history: p
        });
      } catch (f) {
        const m = String(f?.message || f || "unknown_error");
        return z("CF_DNS_LIST_FAILED", m.includes("cf_api_http_403") ? "Cloudflare DNS 读取失败：API 令牌权限不足（需要 Zone.DNS:Read）" : m.includes("cf_api_http_401") ? "Cloudflare DNS 读取失败：API 令牌无效" : "Cloudflare DNS 读取失败", 400, { reason: m });
      }
    },
    async setDnsHistoryFallback(a, { env: n, kv: s }) {
      const i = re(a?.host || ""), c = String(a?.entryId || "").trim(), l = a?.enabled !== !1;
      if (!i) return z("MISSING_PARAMS", "host 不能为空");
      if (l && !c) return z("MISSING_PARAMS", "entryId 不能为空");
      const d = ae(await Re(n)), u = String(d.cfZoneId || "").trim();
      if (!u) return z("CF_API_ERROR", "请先在账号设置中保存 Zone ID");
      try {
        return Q({
          ok: !0,
          history: await t.setDnsHostHistoryPreferredFallback(s, u, i, c, l)
        });
      } catch (f) {
        const m = String(f?.message || f || "unknown_error");
        return m.includes("dns_history_entry_not_found") ? z("DNS_HISTORY_ENTRY_NOT_FOUND", "指定的 DNS 历史记录不存在", 404) : z("DNS_HISTORY_FALLBACK_UPDATE_FAILED", "设置 DNS 默认回退值失败", 400, { reason: m });
      }
    },
    async createDnsRecord(a, n) {
      return e.updateDnsRecord(a, n);
    },
    async updateDnsRecord(a, { env: n, kv: s, request: i }) {
      const c = String(i.headers.get("X-Admin-Confirm") || "").trim();
      if (c !== "updateDnsRecord" && c !== "createDnsRecord") return z("CONFIRMATION_REQUIRED", "敏感 DNS 操作需要显式确认头", 428);
      const l = String(a?.recordId || a?.id || "").trim(), d = re(a?.host || a?.name || ""), u = String(a?.type || "").trim().toUpperCase(), f = String(a?.content || "").trim(), m = a?.skipHistory === !0;
      if (!gr(u)) return z("INVALID_TYPE", "Type 仅允许 A / AAAA / CNAME");
      const p = ka(u, f);
      if (p) return z("INVALID_CONTENT", p);
      if (!l && !d) return z("MISSING_PARAMS", "host 不能为空");
      const g = ae(await Re(n)), h = String(g.cfZoneId || "").trim(), y = String(g.cfApiToken || "").trim();
      if (!h || !y) return z("CF_API_ERROR", "请在账号设置中完善 Zone ID 和 API 令牌");
      let _ = null, S = !1, T = !1, b = "";
      try {
        const R = await Uo(h, y, { scope: "dns.update_record.zone_lookup" }), w = String(R?.name || "").trim(), L = re(new URL(i.url).hostname);
        let U = null;
        if (l) {
          const D = `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(h)}/dns_records/${encodeURIComponent(l)}`, A = Wt((await Ee(D, y))?.result || null);
          if (!A?.id) return z("NOT_FOUND", "DNS 记录不存在", 404);
          const x = String(A?.type || "").toUpperCase();
          if (!gr(x)) return z("UNSUPPORTED_RECORD_TYPE", "该 DNS 记录类型不支持编辑", 400, { currentType: x });
          const O = d || A.name;
          if (!O) return z("MISSING_PARAMS", "host 不能为空");
          if (w && !ma(O, w)) return z("INVALID_HOST", "记录名称必须位于当前 Zone 下");
          const N = ua(A, {
            host: O,
            type: u,
            content: f
          });
          U = Wt((await Ee(D, y, {
            method: "PUT",
            body: JSON.stringify(N)
          }))?.result || {
            id: l,
            ...N
          }), _ = async () => {
            const v = ua(A, {
              host: A.name,
              type: A.type,
              content: A.content
            });
            await Ee(D, y, {
              method: "PUT",
              body: JSON.stringify(v)
            });
          };
        } else {
          if (w && !ma(d, w)) return z("INVALID_HOST", "记录名称必须位于当前 Zone 下");
          const D = `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(h)}/dns_records`, A = ua({
            name: d,
            ttl: 1,
            proxied: !1
          }, {
            host: d,
            type: u,
            content: f
          });
          U = Wt((await Ee(D, y, {
            method: "POST",
            body: JSON.stringify(A)
          }))?.result || A), _ = async () => {
            if (!U?.id) throw new Error("created_dns_record_id_missing");
            await Ee(`${D}/${encodeURIComponent(U.id)}`, y, { method: "DELETE" });
          };
        }
        let E;
        try {
          E = U.type === "CNAME" && !m ? await t.recordDnsHostHistory(s, h, U.name, {
            name: U.name,
            type: U.type,
            content: U.content,
            actor: "admin",
            source: "ui",
            requestHost: L,
            savedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
          }) : await t.getDnsHostHistory(s, h, U.name);
        } catch (D) {
          if (S = typeof _ == "function", S) try {
            await _(), T = !0;
          } catch (A) {
            b = se(A, "dns_rollback_failed");
          }
          throw D;
        }
        return Q({
          ok: !0,
          record: U,
          history: E
        });
      } catch (R) {
        const w = String(R?.message || R || "unknown_error");
        return z("CF_DNS_UPDATE_FAILED", w.includes("cf_api_http_403") ? "Cloudflare DNS 更新失败：API 令牌权限不足（需要 Zone.DNS:Edit）" : w.includes("cf_api_http_401") ? "Cloudflare DNS 更新失败：API 令牌无效" : "Cloudflare DNS 更新失败", 400, {
          reason: w,
          rollbackAttempted: S,
          rollbackSucceeded: T,
          rollbackError: b
        });
      }
    },
    async saveDnsRecords(a, { env: n, kv: s, request: i }) {
      if (i.headers.get("X-Admin-Confirm") !== "saveDnsRecords") return z("CONFIRMATION_REQUIRED", "敏感 DNS 操作需要显式确认头", 428);
      const c = pm(a?.mode), l = re(a?.host || ""), d = a?.includeAllRecords === !0, u = Array.isArray(a?.records) ? a.records : [];
      if (!l) return z("MISSING_PARAMS", "host 不能为空");
      const f = [];
      if (c === "cname") {
        const h = String(u[0]?.content || "").trim(), y = ka("CNAME", h);
        if (y) return z("INVALID_CONTENT", y);
        f.push({
          type: "CNAME",
          content: h
        });
      } else {
        const h = u.map((y) => ({
          type: String(y?.type || "").trim().toUpperCase(),
          content: String(y?.content || "").trim()
        })).filter((y) => y.type || y.content);
        if (!h.length) return z("INVALID_CONTENT", "A 模式至少保留 1 条 A / AAAA 记录");
        for (const y of h) {
          if (!["A", "AAAA"].includes(y.type)) return z("INVALID_TYPE", "A 模式仅允许 A / AAAA");
          const _ = ka(y.type, y.content, { allowCname: !1 });
          if (_) return z("INVALID_CONTENT", _);
          f.push(y);
        }
      }
      const m = ae(await Re(n)), p = String(m.cfZoneId || "").trim(), g = String(m.cfApiToken || "").trim();
      if (!p || !g) return z("CF_API_ERROR", "请在账号设置中完善 Zone ID 和 API 令牌");
      try {
        const h = re(new URL(i.url).hostname);
        return Q(await r({
          env: n,
          kv: s,
          config: m,
          host: l,
          mode: c,
          desiredRecords: f,
          requestHost: h,
          skipHistory: !1,
          includeAllRecords: d
        }));
      } catch (h) {
        const y = String(h?.message || h || "unknown_error");
        return z("CF_DNS_SAVE_FAILED", y.includes("cf_api_http_403") ? "Cloudflare DNS 保存失败：API 令牌权限不足（需要 Zone.DNS:Edit）" : y.includes("cf_api_http_401") ? "Cloudflare DNS 保存失败：API 令牌无效" : "Cloudflare DNS 保存失败", 400, {
          reason: y,
          rollbackAttempted: h?.details?.rollbackAttempted === !0,
          rollbackSucceeded: h?.details?.rollbackSucceeded === !0,
          rollbackError: String(h?.details?.rollbackError || "")
        });
      }
    }
  };
}
async function Xr(o, e, t) {
  const r = Array.isArray(o) ? o : [];
  if (r.length === 0) return [];
  if (typeof t != "function") throw new TypeError("worker must be a function");
  const a = Number(e), n = Number.isFinite(a) && a > 0 ? Math.min(r.length, Math.max(1, Math.floor(a))) : 1, s = Array.from({ length: r.length });
  let i = 0;
  const c = Array.from({ length: n }, async () => {
    for (; i < r.length; ) {
      const l = i;
      i += 1;
      const d = Promise.resolve().then(() => t(r[l]));
      s[l] = d, await d.catch(() => {
      });
    }
  });
  return await Promise.all(c), Promise.all(s);
}
var Am = Object.freeze([{
  id: "cloudflare",
  label: "Cloudflare",
  endpoint: "https://cloudflare-dns.com/dns-query"
}]), Fc = 30 * 1e3, Cm = Fc, wm = "emby-proxy-ui-dns-probe/1.0", Lm = 2400 * 1e3, Nm = 35 * 1e3, Dm = "dns_ip_pool_fetch_lock:", Im = "sys:dns_ip_pool_fetch_lock:v1:";
function Mm(o = {}, e = [], t = {}) {
  const r = /* @__PURE__ */ new Set(), a = [];
  for (const s of Array.isArray(e) ? e : []) {
    const i = fr(s);
    if (!i) continue;
    const c = String(i.ip || "").trim().toLowerCase();
    !c || r.has(c) || (r.add(c), a.push(i));
  }
  const n = a.slice(0, kr(o?.ipLimit));
  return {
    id: String(o?.id || ""),
    name: String(o?.name || ""),
    sourceType: bt(o?.sourceType || o?.source_type || ""),
    status: n.length > 0 ? "success" : "empty",
    count: n.length,
    items: n,
    lastFetchAt: String(t.lastFetchAt || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString())
  };
}
async function Pm(o = {}, e = k.Defaults.DnsIpSourceFetchMaxBytes) {
  const t = String(o?.url || "").trim();
  if (!t) throw new Error("empty_source_url");
  const r = new AbortController(), a = setTimeout(() => r.abort(), Fc);
  try {
    const n = await Be(t, {
      headers: { "User-Agent": vu },
      redirect: "follow",
      signal: r.signal
    });
    if (!n.ok) throw new Error(`HTTP_${n.status}`);
    const s = await Ne(n, e);
    if (s.exceeded) throw new Error("SOURCE_TOO_LARGE");
    const i = s.text, c = hi(o?.builtinId || o?.builtin_id || "");
    return (c === "all" ? au(i) : c === "preferred" ? nu(i, { limit: kr(o?.ipLimit) }) : _o(i, { limit: kr(o?.ipLimit) })).map((l) => ({
      ...l,
      sourceKind: "api",
      sourceLabel: o?.name || t
    }));
  } catch (n) {
    throw $t(n) ? new Error("FETCH_TIMEOUT") : n;
  } finally {
    clearTimeout(a);
  }
}
function xm(o = {}, e = "", t = "A") {
  const r = new URL(String(o?.endpoint || ""));
  return r.searchParams.set("name", re(e)), r.searchParams.set("type", String(t || "A").toUpperCase()), r;
}
async function Om(o = {}, e = "", t = "A") {
  const r = new AbortController(), a = setTimeout(() => r.abort(), Cm);
  try {
    const n = await Be(xm(o, e, t).toString(), {
      headers: { accept: "application/dns-json" },
      redirect: "follow",
      signal: r.signal
    });
    if (!n.ok) throw new Error(`DOH_HTTP_${n.status}`);
    const s = await Ne(n, sn);
    return eu(s.exceeded ? null : JSON.parse(s.text || "null")).map((i) => ({
      ...i,
      sourceKind: "domain",
      sourceLabel: String(e || "").trim()
    }));
  } catch (n) {
    throw $t(n) ? new Error("DOH_TIMEOUT") : n;
  } finally {
    clearTimeout(a);
  }
}
function vm(o = []) {
  const e = (Array.isArray(o) ? o : []).map((n) => Array.isArray(n) ? [...n] : []).filter((n) => n.length > 0), t = [], r = /* @__PURE__ */ new Set();
  let a = e.length > 0;
  for (; a; ) {
    a = !1;
    for (const n of e) {
      for (; n.length; ) {
        const s = n.shift(), i = String(s?.ip || "").trim().toLowerCase();
        if (!(!i || r.has(i))) {
          r.add(i), t.push(s);
          break;
        }
      }
      n.length && (a = !0);
    }
  }
  return t;
}
async function Fm(o = {}) {
  const e = re(o?.domain || "");
  if (!e) throw new Error("empty_source_domain");
  const t = [], r = [], a = [];
  for (const i of ["A", "AAAA"]) for (const c of Am) a.push({
    resolver: c,
    recordType: i
  });
  const n = await Xr(a, Math.min(2, Math.max(1, a.length)), async ({ resolver: i, recordType: c }) => {
    try {
      return {
        resolver: i,
        recordType: c,
        items: await Om(i, e, c),
        error: ""
      };
    } catch (l) {
      return {
        resolver: i,
        recordType: c,
        items: [],
        error: String(l?.message || l || "unknown_doh_error")
      };
    }
  });
  for (const i of n) {
    const c = Array.isArray(i?.items) ? i.items : [];
    if (c.length) {
      t.push(c);
      continue;
    }
    String(i?.error || "").trim() && r.push(`${String(i?.resolver?.id || "resolver")}:${String(i?.recordType || "A")}=${String(i?.error || "unknown_doh_error")}`);
  }
  const s = vm(t);
  if (!s.length && n.length > 0 && r.length === n.length) {
    const i = r.every((c) => String(c || "").includes("DOH_TIMEOUT"));
    throw new Error(i ? "DOH_TIMEOUT" : r.join("; "));
  }
  return s.map((i) => ({
    ...i,
    sourceKind: "domain",
    sourceLabel: o?.name || e
  }));
}
async function Um(o = {}, e = k.Defaults.DnsIpSourceFetchMaxBytes) {
  const t = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), r = Dt(o);
  try {
    return Mm(r, r.sourceType === "domain" ? await Fm(r) : await Pm(r, e), { lastFetchAt: t });
  } catch (a) {
    return {
      id: String(r?.id || ""),
      name: String(r?.name || ""),
      sourceType: bt(r?.sourceType || r?.source_type || ""),
      status: "failed",
      count: 0,
      items: [],
      error: String(a?.message || a || "unknown_error"),
      lastFetchAt: t
    };
  }
}
async function xs(o, e = "", t = "UNKNOWN", r = {}) {
  const { probeRepository: a } = r, n = String(e || "").trim(), s = qe(n), i = String(t || "UNKNOWN").trim().toUpperCase() || "UNKNOWN";
  if (!n || !s) return {
    ip: n,
    entryColo: i,
    probeStatus: "network_error",
    latencyMs: null,
    cfRay: "",
    coloCode: "",
    cityName: "",
    countryCode: "UNKNOWN",
    countryName: "未知",
    probedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
    expiresAt: H()
  };
  if (o && r.forceRefresh !== !0 && r.skipCacheRead !== !0) {
    const m = await a.getDnsIpProbeCacheEntry(o, n, i);
    if (m) return m;
  }
  const c = new AbortController(), l = setTimeout(() => c.abort(), le(r.probeTimeoutMs ?? r.timeoutMs, k.Defaults.DnsIpProbeTimeoutMs, 250, 3e4)), d = H(), u = s === "IPv6" ? `http://[${n}]/` : `http://${n}/`, f = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
  try {
    const m = await Be(u, {
      headers: Ao(wm),
      method: "HEAD",
      redirect: "manual",
      signal: c.signal
    }), p = Math.max(0, H() - d), g = String(m.headers.get("CF-RAY") || m.headers.get("cf-ray") || "").trim(), h = String(m.headers.get("Server") || m.headers.get("server") || "").trim(), y = mi(g), _ = y ? "ok" : /cloudflare/i.test(h) ? "cf_header_missing" : "non_cloudflare", S = ou(y), T = {
      ip: n,
      entryColo: i,
      probeStatus: _,
      latencyMs: p,
      cfRay: g,
      coloCode: S.coloCode,
      cityName: S.cityName,
      countryCode: S.countryCode,
      countryName: S.countryName,
      probedAt: f,
      expiresAt: H() + k.Defaults.DnsIpProbeCacheTtlSec * 1e3
    };
    return o && r.skipCacheWrite !== !0 && await a.upsertDnsIpProbeCacheEntry(o, T), T;
  } catch (m) {
    const p = {
      ip: n,
      entryColo: i,
      probeStatus: $t(m) ? "timeout" : "network_error",
      latencyMs: null,
      cfRay: "",
      coloCode: "",
      cityName: "",
      countryCode: "UNKNOWN",
      countryName: "未知",
      probedAt: f,
      expiresAt: H() + k.Defaults.DnsIpProbeCacheTtlSec * 1e3
    };
    return o && r.skipCacheWrite !== !0 && await a.upsertDnsIpProbeCacheEntry(o, p), p;
  } finally {
    clearTimeout(l);
  }
}
async function Uc(o = [], e, t = "UNKNOWN", r = {}) {
  const a = [], n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set(), i = String(t || "UNKNOWN").trim().toUpperCase() || "UNKNOWN";
  for (const S of Array.isArray(o) ? o : []) {
    const T = String(S?.ip || S?.content || "").trim(), b = qe(T) || fi(S?.ipType || S?.ip_type || S?.type || "");
    if (!T || !b) continue;
    const R = {
      id: String(S?.id || S?.recordId || `${r.scope || "dns"}-${ne(`${T}|${S?.sourceKind || S?.source_kind || ""}`)}`),
      ip: T,
      ipType: b,
      recordId: String(S?.recordId || S?.id || ""),
      host: String(S?.host || S?.name || r.host || ""),
      sourceKind: String(S?.sourceKind || S?.source_kind || r.scope || "shared_pool"),
      sourceLabel: String(S?.sourceLabel || S?.source_label || r.sourceLabel || ""),
      lineLabel: Br(S?.lineLabel || S?.line_label || ""),
      remark: String(S?.remark || ""),
      createdAt: String(S?.createdAt || S?.created_at || ""),
      updatedAt: String(S?.updatedAt || S?.updated_at || ""),
      probeStatus: Ua(S?.probeStatus || S?.probe_status || ""),
      latencyMs: Number.isFinite(Number(S?.latencyMs ?? S?.latency_ms)) ? Math.max(0, Math.round(Number(S?.latencyMs ?? S?.latency_ms))) : null,
      cfRay: String(S?.cfRay || S?.cf_ray || ""),
      coloCode: String(S?.coloCode || S?.colo_code || "").trim().toUpperCase(),
      cityName: String(S?.cityName || S?.city_name || ""),
      countryCode: String(S?.countryCode || S?.country_code || "").trim().toUpperCase() || "UNKNOWN",
      countryName: String(S?.countryName || S?.country_name || "") || "未知",
      probedAt: String(S?.probedAt || S?.probed_at || "")
    };
    a.push(R), n.set(T.toLowerCase(), T);
  }
  if (!a.length) return {
    items: [],
    probeEntryColo: i,
    probeDataSource: "cache"
  };
  const c = /* @__PURE__ */ new Map(), l = [], d = [...n.values()], u = e ? await r.probeRepository.getDnsIpProbeCacheEntries(e, d, i) : [];
  for (const S of Array.isArray(u) ? u : []) {
    const T = String(S?.ip || "").trim().toLowerCase();
    T && c.set(T, S);
  }
  for (const S of d)
    c.has(String(S || "").toLowerCase()) && r.forceRefresh !== !0 || l.push(S);
  const f = r.deferProbe === !0 && !!r.ctx?.waitUntil, m = le(r.syncProbeLimit, k.Defaults.DnsIpWorkspaceSyncProbeLimit, 0, 64), p = f && l.length > m ? l.slice(0, m) : l, g = f && l.length > m ? l.slice(m) : [], h = le(r.probeConcurrency, k.Defaults.DnsIpProbeConcurrency, 1, 4);
  let y = "cache";
  p.length > 0 && (y = "live_sync"), g.length > 0 && (y = "live_deferred");
  const _ = await Xr(p, h, async (S) => {
    const T = await xs(e, S, t, {
      ...r,
      skipCacheRead: !0,
      skipCacheWrite: !0
    });
    return c.set(String(S || "").toLowerCase(), T), T;
  });
  return e && _.length && await r.probeRepository.upsertDnsIpProbeCacheEntries(e, _), g.length && (g.forEach((S) => s.add(String(S || "").toLowerCase())), r.ctx.waitUntil((async () => {
    const S = await Xr(g, h, (T) => xs(e, T, t, {
      ...r,
      skipCacheRead: !0,
      skipCacheWrite: !0
    }));
    e && S.length && await r.probeRepository.upsertDnsIpProbeCacheEntries(e, S);
  })().catch((S) => {
    console.warn("[DNS IP Workspace] Deferred probe failed:", S?.message || S);
  }))), {
    items: a.map((S) => {
      const T = c.get(S.ip.toLowerCase());
      return T ? {
        ...S,
        probeStatus: T.probeStatus,
        latencyMs: T.latencyMs,
        cfRay: T.cfRay,
        coloCode: T.coloCode,
        cityName: T.cityName,
        countryCode: T.countryCode,
        countryName: T.countryName,
        probedAt: T.probedAt
      } : S;
    }).map((S) => !s.has(String(S.ip || "").toLowerCase()) || String(S.probedAt || "").trim() ? S : {
      ...S,
      probeStatus: "pending"
    }),
    probeEntryColo: i,
    probeDataSource: Zn(y)
  };
}
function km(o = {}) {
  const e = bo(o?.items || []);
  return {
    sourceResults: bi(o?.sourceResults || []),
    importedCount: Math.max(0, Number(o?.importedCount) || e.length),
    items: e,
    enabledSourceCount: Math.max(0, Number(o?.enabledSourceCount) || 0),
    cachedAt: za(o?.cachedAtMs),
    expiresAt: za(o?.expiresAtMs)
  };
}
async function Hm(o = [], e, t = "UNKNOWN", r = null, a = {}) {
  const n = r && typeof r.waitUntil == "function" ? r : { waitUntil() {
  } }, s = await Uc(o, e, t, {
    probeRepository: a.probeRepository,
    forceRefresh: !1,
    scope: "shared_pool",
    ctx: n,
    deferProbe: !0,
    syncProbeLimit: le(a?.syncProbeLimit, 0, 0, 64),
    probeTimeoutMs: le(a?.probeTimeoutMs, 500, 250, 3e4)
  });
  return Array.isArray(s?.items) ? s.items : [];
}
function Zn(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "live_deferred" ? "live_deferred" : e === "live_sync" ? "live_sync" : "cache";
}
function $m(o = "", e = "") {
  const t = Zn(o), r = Zn(e), a = {
    cache: 0,
    live_sync: 1,
    live_deferred: 2
  };
  return (a[r] || 0) > (a[t] || 0) ? r : t;
}
function Bm(o = {}) {
  const e = [];
  Array.isArray(o?.localPoolItems) && e.push(...o.localPoolItems), Array.isArray(o?.poolItems) && e.push(...o.poolItems), Array.isArray(o?.sharedPoolItems) && e.push(...o.sharedPoolItems);
  const t = [], r = /* @__PURE__ */ new Set();
  for (const a of e) {
    const n = fr(a);
    if (!n) continue;
    const s = String(n.ip || "").trim().toLowerCase();
    !s || r.has(s) || (r.add(s), t.push({
      ...a,
      ...n
    }));
  }
  return t;
}
function Km(o = [], e = []) {
  const t = /* @__PURE__ */ new Map(), r = (a) => {
    for (const n of Array.isArray(a) ? a : []) {
      const s = fr(n);
      s && t.set(String(s.ip || "").trim().toLowerCase(), {
        ...n,
        ...s
      });
    }
  };
  return r(o), r(e), [...t.values()];
}
function zm(o = "") {
  return `${Dm}${String(o || "").trim()}`;
}
async function Wm({ kv: o = null, db: e = null, leaseRepository: t = null } = {}, r = "") {
  const a = zm(r);
  if (!a || a === "dns_ip_pool_fetch_lock:") return {
    acquired: !1,
    reason: "empty_signature"
  };
  const n = `${H()}-${Math.random().toString(36).slice(2, 10)}`;
  return e ? {
    ...await t.tryAcquireScheduledLeaseWithDb(e, {
      scope: a,
      token: n,
      owner: "dns_ip_pool_fetch",
      leaseMs: Nm
    }),
    token: n,
    key: a
  } : {
    acquired: !1,
    reason: "db_unavailable",
    backend: "d1",
    token: n,
    key: a
  };
}
async function Gm({ kv: o = null, db: e = null, leaseRepository: t = null } = {}, r = null) {
  if (!r?.token) return !1;
  const a = String(r?.key || "").trim();
  return e && a ? await t.releaseScheduledLeaseWithDb(e, r.token, { scope: a }) : !1;
}
async function jm({ kv: o = null, db: e = null, ctx: t = null, sourceList: r = [], maxBytes: a = k.Defaults.DnsIpSourceFetchMaxBytes, poolRepository: n = null } = {}) {
  const s = (Array.isArray(r) ? r : []).map((S, T) => Dt(S, T)), i = s.filter((S) => S.enabled === !0 && or(S)), c = le(k.Defaults.DnsIpSourceConcurrency, k.Defaults.DnsIpSourceConcurrency, 1, 4), l = await Xr(i, i.some((S) => bt(S?.sourceType) === "domain") ? Math.min(c, 2) : c, async (S) => Um(S, a)), d = [], u = /* @__PURE__ */ new Map();
  for (const S of l)
    u.set(String(S?.id || ""), S), Array.isArray(S?.items) && d.push(...S.items);
  const f = s.map((S, T) => {
    const b = u.get(String(S?.id || ""));
    return Dt(b ? {
      ...S,
      lastFetchAt: b.lastFetchAt,
      lastFetchStatus: b.status,
      lastFetchCount: b.count
    } : S, T);
  }), m = await pe(n.persistDnsIpPoolSources({
    kv: o,
    db: e
  }, f, null), "dns_ip_pool.refresh.persist_source_state", {
    sourceCount: f.length,
    enabledSourceCount: i.length
  }, f), p = mr(d), g = bo(p), h = bi(l);
  let y = "", _ = "";
  if (e) {
    const S = Fa(s, a);
    if (S && gu(l)) {
      const T = H(), b = T + Lm, R = await n.upsertDnsIpPoolFetchCacheEntry(e, {
        signature: S,
        items: p,
        sourceResults: l,
        importedCount: g.length,
        enabledSourceCount: i.length,
        cachedAtMs: T,
        expiresAtMs: b,
        createdAt: new Date(T).toISOString(),
        updatedAt: new Date(T).toISOString()
      });
      y = za(R?.cachedAtMs), _ = za(R?.expiresAtMs);
    }
  }
  return i.length && await pe(n.bumpDnsIpPoolRevision({
    kv: o,
    db: e
  }, {
    lastFetchAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
    lastFetchSourceCount: i.length,
    lastFetchImportedCount: g.length
  }, null), "dns_ip_pool.refresh.bump_revision", {
    enabledSourceCount: i.length,
    importedCount: g.length
  }, null), {
    sourceList: m,
    sourceResults: h,
    importedCount: g.length,
    items: g,
    enabledSourceCount: i.length,
    cachedAt: y,
    expiresAt: _
  };
}
function Vm(o = {}, e = {}) {
  const { kernel: t } = o, { buildDnsIpPoolWorkspacePreviewItems: r, buildDnsIpWorkspaceItems: a, releaseDnsIpPoolFetchRefreshLock: n, runDnsIpPoolSourcesLiveRefresh: s, tryAcquireDnsIpPoolFetchRefreshLock: i } = o;
  return {
    async getDnsIpWorkspace(c, { env: l, kv: d, db: u, request: f, ctx: m }) {
      try {
        const p = c?.forceRefresh === !0;
        u && await t.ensureDnsIpWorkspaceSchema(u);
        const g = await ue(l), h = oa(f), y = sd(f);
        let _ = await t.getDnsIpPoolSourcesForRead({
          kv: d,
          db: u
        });
        const S = Bm(c), T = k.Defaults.DnsIpSourceFetchMaxBytes, b = _.filter((N) => N.enabled === !0 && or(N));
        let R = [], w = "empty", L = !1;
        if (p && b.length > 0) {
          const N = await s({
            kv: d,
            db: u,
            ctx: m,
            sourceList: _,
            maxBytes: T
          });
          _ = Array.isArray(N?.sourceList) ? N.sourceList : _, R = Array.isArray(N?.items) ? N.items : [], w = "live_sync";
        } else {
          const N = Fa(_, T), v = u && N ? await t.getDnsIpPoolFetchCacheEntry(u, N) : null;
          if (v)
            R = Array.isArray(v?.items) ? v.items : [], w = "cache";
          else if (b.length > 0 && m?.waitUntil && N) {
            const P = await i({
              kv: d,
              db: u
            }, N);
            P?.acquired === !0 && (L = !0, w = "live_deferred", m.waitUntil((async () => {
              try {
                await s({
                  kv: d,
                  db: u,
                  sourceList: _,
                  maxBytes: T
                });
              } catch (C) {
                console.warn("[DNS IP Workspace] background source snapshot refresh failed:", C?.message || C);
              } finally {
                await n({
                  kv: d,
                  db: u
                }, P);
              }
            })()));
          }
        }
        const U = Km(R, S), E = await a(U, u, h, {
          forceRefresh: p,
          scope: "shared_pool",
          ctx: m,
          deferProbe: !0,
          syncProbeLimit: 0,
          probeTimeoutMs: 500
        }), D = [], A = Array.isArray(E?.items) ? E.items : [], x = await t.getOpsStatusSection({
          kv: d,
          db: u
        }, "dnsIpPool"), O = /* @__PURE__ */ new Map();
        for (const N of A) {
          const v = String(N?.countryCode || "").trim().toUpperCase();
          if (!v) continue;
          const P = O.get(v) || {
            code: v,
            name: String(N?.countryName || "未知"),
            count: 0
          };
          P.count += 1, O.set(v, P);
        }
        return Q({
          zoneId: String(g.cfZoneId || "").trim(),
          zoneName: "",
          host: "",
          requestColo: h,
          probeEntryColo: h,
          probeDataSource: $m("cache", E?.probeDataSource),
          sourceSnapshotStatus: w,
          backgroundRefreshQueued: L,
          requestCountryCode: y.countryCode,
          requestCountryName: y.countryName,
          currentHostItems: D,
          sharedPoolItems: A,
          sourceList: _,
          availableCountries: [...O.values()].sort((N, v) => String(N.code || "").localeCompare(String(v.code || ""))),
          summary: Su(D, A),
          dnsIpPoolRevision: t.getDnsIpPoolRevisionFromStatus(x),
          generatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          ..._r(),
          revisions: await t.getAdminRevisionsForRead({
            env: l,
            kv: d,
            db: u
          }, {
            ctx: m,
            config: g
          })
        });
      } catch (p) {
        throw wt(p, "DNS_IP_WORKSPACE_READ_FAILED", "独立 IP 池工作区读取失败：KV 读取异常", "admin.read.dns_ip_workspace");
      }
    },
    async importDnsIpPoolItems(c, { env: l, kv: d, db: u, request: f }) {
      const m = String(c?.text || c?.content || "").trim();
      if (!m) return z("EMPTY_IMPORT_TEXT", "请先提供要导入的文本内容");
      const p = String(c?.sourceKind || "manual").trim().toLowerCase() || "manual", g = String(c?.sourceLabel || "").trim() || (p === "file" ? "文件导入" : "手动导入"), h = _o(m).map((S) => ({
        ...S,
        sourceKind: p,
        sourceLabel: g
      })), y = await a(h, u, oa(f), {
        scope: "shared_pool",
        forceRefresh: !1
      }), _ = Array.isArray(y?.items) ? y.items : [];
      return Q({
        success: !0,
        importedCount: _.length,
        items: _,
        revisions: await t.getAdminRevisions({
          env: l,
          kv: d,
          db: u
        })
      });
    },
    async saveDnsIpPoolSources(c, { env: l, kv: d, db: u, ctx: f }) {
      if (!u) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库");
      const m = await t.persistDnsIpPoolSources({
        kv: d,
        db: u
      }, c?.sources || [], f);
      return await t.bumpDnsIpPoolRevision({
        kv: d,
        db: u
      }, {
        lastSourceConfigAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        sourceCount: m.length
      }, f), Q({
        success: !0,
        sourceList: m,
        dnsIpPoolRevision: await t.getOpsStatusSection({
          kv: d,
          db: u
        }, "dnsIpPool").then((p) => t.getDnsIpPoolRevisionFromStatus(p)).catch(() => ""),
        ..._r(),
        revisions: await t.getAdminRevisions({
          env: l,
          kv: d,
          db: u
        })
      });
    },
    async getDnsIpPoolSources(c, { env: l, kv: d, db: u }) {
      try {
        if (!u) return Q({
          success: !0,
          sourceList: [],
          dnsIpPoolRevision: "",
          ..._r(),
          revisions: await t.getAdminRevisionsForRead({
            env: l,
            kv: d,
            db: u
          }, { config: await ue(l) })
        });
        u && await t.ensureDnsIpWorkspaceSchema(u);
        const [f, m, p] = await Promise.all([
          ue(l),
          t.getDnsIpPoolSourcesForRead({
            kv: d,
            db: u
          }),
          t.getOpsStatusSection({
            kv: d,
            db: u
          }, "dnsIpPool")
        ]);
        return Q({
          success: !0,
          sourceList: m,
          dnsIpPoolRevision: t.getDnsIpPoolRevisionFromStatus(p),
          ..._r(),
          revisions: await t.getAdminRevisionsForRead({
            env: l,
            kv: d,
            db: u
          }, { config: f })
        });
      } catch (f) {
        throw wt(f, "DNS_IP_POOL_SOURCES_READ_FAILED", "独立 IP 池抓取源读取失败：D1 读取异常", "admin.read.dns_ip_pool_sources");
      }
    },
    async refreshDnsIpPoolFromSources(c, { env: l, kv: d, db: u, ctx: f, request: m }) {
      try {
        if (!u) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库");
        u && await t.ensureDnsIpWorkspaceSchema(u);
        const p = le(c?.maxBytes, k.Defaults.DnsIpSourceFetchMaxBytes, 1024, 8 * 1024 * 1024), g = await t.getDnsIpPoolSources({
          kv: d,
          db: u
        }), h = Fa(g, p), y = u && h ? await t.getDnsIpPoolFetchCacheEntry(u, h) : null;
        if (y) {
          let T = !1;
          if (f?.waitUntil) {
            const w = await i({
              kv: d,
              db: u
            }, h);
            w?.acquired === !0 && (T = !0, f.waitUntil((async () => {
              try {
                await s({
                  kv: d,
                  db: u,
                  sourceList: g,
                  maxBytes: p
                });
              } catch (L) {
                console.warn("[DNS IP Pool] background refresh failed:", L?.message || L);
              } finally {
                await n({
                  kv: d,
                  db: u
                }, w);
              }
            })()));
          }
          const b = km(y), R = await r(b.items, u, oa(m), f, { syncProbeLimit: 0 });
          return Q({
            success: !0,
            sourceResults: b.sourceResults,
            sourceList: g,
            importedCount: b.importedCount,
            items: R,
            cacheStatus: "d1",
            backgroundRefreshQueued: T,
            cachedAt: b.cachedAt,
            expiresAt: b.expiresAt,
            dnsIpPoolRevision: await t.getOpsStatusSection({
              kv: d,
              db: u
            }, "dnsIpPool").then((w) => t.getDnsIpPoolRevisionFromStatus(w)).catch(() => ""),
            ..._r(),
            revisions: await t.getAdminRevisions({
              env: l,
              kv: d,
              db: u
            })
          });
        }
        const _ = await s({
          kv: d,
          db: u,
          ctx: f,
          sourceList: g,
          maxBytes: p
        }), S = await r(_.items, u, oa(m), f, {
          syncProbeLimit: 0,
          probeTimeoutMs: 500
        });
        return Q({
          success: !0,
          sourceResults: _.sourceResults,
          sourceList: _.sourceList,
          importedCount: _.importedCount,
          items: S,
          cacheStatus: "live",
          backgroundRefreshQueued: !1,
          cachedAt: _.cachedAt,
          expiresAt: _.expiresAt,
          dnsIpPoolRevision: await t.getOpsStatusSection({
            kv: d,
            db: u
          }, "dnsIpPool").then((T) => t.getDnsIpPoolRevisionFromStatus(T)).catch(() => ""),
          ..._r(),
          revisions: await t.getAdminRevisions({
            env: l,
            kv: d,
            db: u
          })
        });
      } catch (p) {
        if (on(p)) throw p;
        const g = se(p, "unknown_error"), h = /* @__PURE__ */ new Error(`更新服务端共享快照失败: ${g}`);
        throw h.code = "DNS_IP_POOL_REFRESH_FAILED", h.status = 500, h.details = { reason: g }, h;
      }
    },
    async deleteDnsIpPoolItems(c, { env: l, kv: d, db: u, ctx: f }) {
      u && await t.ensureDnsIpWorkspaceSchema(u);
      const m = hu(c?.target);
      if (m === "shared_snapshot") {
        if (!u) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库");
        const g = await t.getDnsIpPoolSourcesForRead({
          kv: d,
          db: u
        }), h = Fa(g, k.Defaults.DnsIpSourceFetchMaxBytes), y = h ? await t.getDnsIpPoolFetchCacheEntry(u, h) : null, _ = yu(y, c?.ips || []);
        if (y && h && _.deletedCount > 0) {
          const S = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), T = Math.max(0, Number(y?.cachedAtMs) || 0), b = Math.max(T, Number(y?.expiresAtMs) || T), R = Math.max(0, Number(y?.enabledSourceCount) || (Array.isArray(g) ? g.filter((w) => w?.enabled === !0 && or(w)).length : 0));
          await t.upsertDnsIpPoolFetchCacheEntry(u, {
            signature: h,
            items: _.items,
            sourceResults: _.sourceResults,
            importedCount: _.items.length,
            enabledSourceCount: R,
            cachedAtMs: T,
            expiresAtMs: b,
            createdAt: String(y?.createdAt || S),
            updatedAt: S
          }), await t.bumpDnsIpPoolRevision({
            kv: d,
            db: u
          }, {
            lastSnapshotDeleteAt: S,
            lastSnapshotDeleteCount: _.deletedCount
          }, f);
        }
        return Q({
          success: !0,
          target: m,
          deletedCount: _.deletedCount,
          deletedIps: _.deletedIps,
          revisions: await t.getAdminRevisions({
            env: l,
            kv: d,
            db: u
          })
        });
      }
      const p = Ei(c?.ips || []).normalizedIps;
      return Q({
        success: !0,
        target: m,
        deletedCount: u ? await t.deleteDnsIpPoolItems(u, p) : p.length,
        revisions: await t.getAdminRevisions({
          env: l,
          kv: d,
          db: u
        })
      });
    },
    async fillDnsDraftFromIpPool(c) {
      const l = [];
      for (const f of Array.isArray(c?.ips) ? c.ips : []) {
        const m = String(f?.ip || f || "").trim(), p = qe(m);
        !m || !p || l.push({
          type: p === "IPv6" ? "AAAA" : "A",
          content: m
        });
      }
      if (!l.length) return z("EMPTY_IP_SELECTION", "请先选择至少一个可用 IP");
      const d = [], u = /* @__PURE__ */ new Set();
      for (const f of l) {
        const m = `${f.type}:${f.content.toLowerCase()}`;
        u.has(m) || (u.add(m), d.push(f));
      }
      return d.sort((f, m) => f.type !== m.type ? f.type.localeCompare(m.type) : f.content.localeCompare(m.content)), Q({
        success: !0,
        mode: "a",
        records: d
      });
    }
  };
}
function qm(o = {}, e = {}) {
  const { kernel: t } = o;
  return {
    async testTelegram(r) {
      const { tgBotToken: a, tgChatId: n } = r;
      if (!a || !n) return z("MISSING_PARAMS", "请先填写 Bot Token 和 Chat ID");
      try {
        return await t.sendTelegramMessage({
          tgBotToken: a,
          tgChatId: n,
          text: `✅ Emby Proxy: Telegram 机器人测试通知成功！
如果您能看到这条消息，说明您的通知配置完全正确。`
        }), Q({ success: !0 });
      } catch (s) {
        return z("NETWORK_ERROR", s.message);
      }
    },
    async sendDailyReport(r, { env: a }) {
      try {
        const n = await t.sendDailyTelegramReport(a);
        return Q({
          success: !0,
          sentCount: Number(n?.sentCount) || 0,
          reportKinds: Array.isArray(n?.reportKinds) ? n.reportKinds : []
        });
      } catch (n) {
        return z("REPORT_FAILED", n.message);
      }
    },
    async sendPredictedAlert(r, { env: a }) {
      try {
        const n = await t.maybeSendRuntimeAlerts(a, null, {
          ignoreCooldown: !0,
          persistState: !1,
          triggeredBy: "manual_predict"
        });
        return Q({
          success: !0,
          sent: n?.sent === !0,
          issueCount: Number(n?.issueCount) || 0,
          reason: String(n?.reason || "").trim()
        });
      } catch (n) {
        return z("ALERT_PREDICT_FAILED", n.message);
      }
    },
    async pingNode(r, { env: a, ctx: n, request: s }) {
      const i = String(s?.headers?.get("User-Agent") || "").trim(), c = await Re(a), l = le(r.timeout, c.pingTimeout ?? Iu, 1e3, 18e4);
      if (r.target) {
        const T = t.normalizeSingleTarget(r.target);
        if (!T) return z("INVALID_TARGET", "目标源站必须是有效的 http/https URL");
        const b = await t.pingTarget(T, l, { userAgent: i });
        return Q({
          ...b.ok ? { ms: b.elapsedMs } : {},
          probe: b,
          target: T,
          usedCache: !1,
          scope: "target"
        });
      }
      const d = String(r.name || "").trim(), u = await t.getNode(d, a, n);
      if (!u || !Array.isArray(u.lines) || !u.lines.length) return z("NOT_FOUND", "节点不存在");
      const f = String(r.lineId || "").trim(), m = f ? u.lines.filter((T) => T.id === f) : u.lines.slice();
      if (f && !m.length) return z("LINE_NOT_FOUND", "线路不存在", 404);
      const p = await Promise.all(m.map(async (T) => {
        const b = await t.pingTarget(T.target, l, { userAgent: i });
        return {
          id: String(T?.id || "").trim(),
          name: String(T?.name || "").trim(),
          target: String(T?.target || "").trim(),
          latencyMs: b.ok ? b.elapsedMs : null,
          probe: b,
          latencyUpdatedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        };
      })), g = u.lines.map((T) => {
        const b = p.find((R) => R.id === T.id);
        return b ? {
          id: b.id,
          name: b.name,
          target: b.target,
          latencyMs: b.latencyMs,
          probe: b.probe,
          latencyUpdatedAt: b.latencyUpdatedAt
        } : {
          id: String(T?.id || "").trim(),
          name: String(T?.name || "").trim(),
          target: String(T?.target || "").trim()
        };
      }), h = t.resolveActiveLineId(u.activeLineId, g, g), y = t.getActiveNodeLine({
        ...u,
        lines: g,
        activeLineId: h
      }), _ = f ? g.find((T) => T.id === f) : y, S = t.buildNodeSummary(d.toLowerCase(), u).summary || { name: d.toLowerCase() };
      return Q({
        ..._?.probe?.ok ? { ms: _.probe.elapsedMs } : {},
        probe: _?.probe || null,
        usedCache: !1,
        sorted: !1,
        activeLineId: h,
        activeLineName: y?.name || "",
        line: _ || null,
        node: {
          ...S,
          lines: g,
          activeLineId: h
        }
      });
    }
  };
}
function Xm(o = {}, e = {}) {
  const { kernel: t } = o, { LogQueryPlanner: r } = o;
  return {
    async getLogs(a, { db: n, env: s }) {
      if (!n) return Q({ error: "D1 not configured" }, 500);
      const i = r.normalizeRequest(a), { filters: c } = i, l = s ? await Re(s) : {}, d = await t.resolveLogsReadiness({
        db: n,
        kv: t.getKV(s)
      }), u = r.resolveSearch(c, l, d);
      if (u.errorResponse) return u.errorResponse;
      const { effectiveSearchMode: f, searchFallbackReason: m } = u;
      if (l.logEnabled === !1) return r.buildDisabledResponse(i, d, f, m);
      if (d.schemaReady !== !0) return z("LOG_SCHEMA_NOT_READY", "日志表尚未初始化，请先点击“初始化日志表”", 400, {
        effectiveSearchMode: f,
        searchFallbackReason: m,
        revisions: { logsRevision: d.revision }
      });
      const p = r.buildSqlPlan(c, i, l, f);
      if (p.errorResponse) return p.errorResponse;
      const g = await r.executeSqlPlan(n, i, p);
      return g.errorResponse ? g.errorResponse : r.buildSuccessResponse(i, d, {
        logs: g.logs,
        total: g.total,
        totalPages: g.totalPages,
        searchMode: g.searchMode,
        effectiveSearchMode: f,
        searchFallbackReason: m,
        hasPrevPage: g.hasPrevPage,
        hasNextPage: g.hasNextPage,
        nextCursor: g.nextCursor
      });
    },
    async clearLogs(a, { db: n, env: s, ctx: i, request: c }) {
      if (c.headers.get("X-Admin-Confirm") !== "clearLogs") return z("CONFIRMATION_REQUIRED", "敏感操作需要显式确认头", 428);
      if (!n) return Q({ error: "D1 not configured" }, 500);
      await t.ensureLogsBaseSchema(n), await t.ensureStatsHourlySchema(n);
      const l = H(), d = ar.get(n);
      d.LogClearEpochMs = Math.max(d.LogClearEpochMs || 0, l), await t.patchOpsStatus(s || n, { log: {
        clearEpochMs: l,
        clearEpochAt: new Date(l).toISOString()
      } }, i);
      const u = d.LogFlushTask;
      if (u) try {
        await u;
      } catch {
      }
      d.LogQueue.length = 0, d.LogDedupe.clear(), d.LogLastFlushAt = 0, await n.prepare(`DELETE FROM ${t.LOGS_TABLE}`).run(), await t.clearStatsHourly(n).catch(() => !1);
      let f = !1;
      try {
        f = await t.rebuildLogsFts(n);
      } catch (h) {
        console.warn("clearLogs FTS rebuild failed", h);
      }
      const m = await t.isLogsFtsReady(n), p = await t.hasStatsHourlyTable(n), g = await t.bumpLogsRevision(s || { db: n }, {
        schemaReady: !0,
        ftsReady: m,
        statsReady: p,
        clearEpochMs: l,
        clearEpochAt: new Date(l).toISOString(),
        lastClearAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      }, i);
      return Q({
        success: !0,
        ftsRebuilt: f,
        revisions: { logsRevision: t.getLogsRevisionFromStatus(g?.log || g) }
      });
    },
    async getD1SchemaStatus(a, { db: n, env: s }) {
      if (!n) return z("D1_NOT_CONFIGURED", "请先绑定 D1 / PROXY_LOGS 数据库", 503);
      const i = await t.buildD1SchemaRepairPlan(n);
      let c = {
        token: "",
        expiresAt: 0
      };
      return i.phase === "destructive" && i.blockingIssues.length === 0 && (c = await t.createD1SchemaRepairToken(s, i)), Q({
        success: !0,
        status: {
          ...i.status,
          repairableIssues: i.repairableIssues,
          highRiskIssues: i.highRiskIssues,
          blockingIssues: i.blockingIssues
        },
        repairPlan: {
          version: i.version,
          phase: i.phase,
          contractVersion: i.contractVersion,
          contractHash: i.contractHash,
          schemaCookie: i.schemaCookie,
          planHash: i.planHash,
          risk: i.risk,
          repairableIssues: i.repairableIssues,
          highRiskIssues: i.highRiskIssues,
          blockingIssues: i.blockingIssues,
          steps: i.steps,
          repairToken: c.token,
          expiresAt: c.expiresAt ? (/* @__PURE__ */ new Date(c.expiresAt * 1e3)).toISOString() : ""
        }
      });
    },
    async initLogsDb(a, { db: n, env: s, request: i }) {
      if (!n) return z("D1_NOT_CONFIGURED", "D1 database is not configured", 503);
      const c = await t.initializeD1Database(n, {
        includeFts: !0,
        env: s,
        repairMode: String(a?.repairMode || "safe").trim() || "safe",
        repairToken: String(a?.repairToken || "").trim(),
        confirmHighRisk: String(i?.headers?.get("X-Admin-Confirm") || "").trim() === "repairD1Schema"
      }), l = c.status, d = l.ftsReady === !0, u = l.tables?.[t.STATS_HOURLY_TABLE] === !0, f = l.schemaReady === !0 ? await t.bumpLogsRevision(n, {
        schemaReady: !0,
        ftsReady: d,
        statsReady: u,
        categoryEnabled: !0
      }) : null;
      return Q({
        success: c.completed === !0 || c.pendingHighRisk === !0,
        schemaReady: l.schemaReady === !0,
        pendingHighRisk: c.pendingHighRisk === !0,
        categoryEnabled: !0,
        ftsReady: d,
        statsReady: u,
        initialization: c,
        steps: c.steps,
        status: l,
        revisions: f ? { logsRevision: t.getLogsRevisionFromStatus(f?.log || f) } : {}
      });
    }
  };
}
function Ym(o = {}) {
  const { kernel: e } = o, t = {}, r = El([
    {
      name: "dashboard",
      handlers: Jf({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "config",
      handlers: sm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "backup",
      handlers: im({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "nodes",
      handlers: fm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "maintenance",
      handlers: mm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "dns-records",
      handlers: Rm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "dns-pool",
      handlers: Vm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "notifications",
      handlers: qm({
        ...o,
        kernel: e
      }, t)
    },
    {
      name: "database",
      handlers: Xm({
        ...o,
        kernel: e
      }, t)
    }
  ], { aliases: {
    import: "saveOrImport",
    save: "saveOrImport"
  } });
  for (const [a, n] of Object.entries(r.handlers)) t[a] = n;
  return r;
}
function Jm(o = {}) {
  return { adminActionHandlers: Ym(o).handlers };
}
function Ve(o, e) {
  const t = $(o) ? o : {}, r = $(e) ? e : {}, a = { ...t };
  for (const [n, s] of Object.entries(r))
    s !== void 0 && ($(s) && $(t[n]) ? a[n] = Ve(t[n], s) : $(s) ? a[n] = Ve({}, s) : a[n] = s);
  return a;
}
function Ie(o, e, t, r) {
  o.has(e) && o.delete(e), o.set(e, t);
  const a = Math.floor(Number(r));
  if (!(!Number.isFinite(a) || a < 1))
    for (; o.size > a; ) {
      const n = o.keys().next().value;
      if (n === void 0) break;
      o.delete(n);
    }
}
function Za(o, e) {
  if (!o.has(e)) return;
  const t = o.get(e);
  return o.delete(e), o.set(e, t), t;
}
function cr(o = void 0) {
  const e = o === void 0 ? yt.current() : Se(o);
  e.NodesRevisionCacheGeneration += 1, e.NodesRevisionCache = null;
}
function Os(o, e = null) {
  const t = Se(e);
  t.NodesRevisionCacheGeneration += 1, t.NodesRevisionCache = {
    loaded: !0,
    revision: String(o || "").trim(),
    exp: Date.now() + k.Defaults.NodesRevisionCacheTtlMs
  };
}
function Pe(o, e = yt.current()) {
  const t = String(o || "").trim().toLowerCase(), r = t && Number(e.NodeCacheGenerations.get(t)) || 0, a = r ? `node:${r}` : `missing:${e.NodeCacheGenerationEvictionEpoch}`;
  return `${e.NodeCacheResetGeneration}:${a}`;
}
function Qm(o = [], e = yt.current()) {
  for (const t of Array.isArray(o) ? o : [o]) {
    const r = String(t || "").trim().toLowerCase();
    if (!r) continue;
    !e.NodeCacheGenerations.has(r) && e.NodeCacheGenerations.size >= k.Defaults.NodeCacheMax && (e.NodeCacheGenerationEvictionEpoch += 1);
    const a = ++e.NodeCacheGenerationNonce;
    Ie(e.NodeCacheGenerations, r, a, k.Defaults.NodeCacheMax);
  }
}
function vs(o = yt.current()) {
  o.NodeCacheResetGeneration += 1, o.NodeCacheGenerations.clear();
}
function Fe(o) {
  return new TextEncoder().encode(String(o ?? "")).byteLength;
}
function kc(o, e, t = {}) {
  const r = Fe(e), a = Math.max(1, Number(t.limitBytes) || Vt), n = /* @__PURE__ */ new Error(`D1 value exceeds the ${a}-byte compatibility budget`);
  return n.code = "D1_VALUE_TOO_LARGE", n.status = 400, n.details = {
    field: String(o || "value"),
    actualBytes: r,
    limitBytes: a,
    platformLimitBytes: zu
  }, n;
}
function Ha(o, e, t = {}) {
  if (Fe(e) > Math.max(1, Number(t.limitBytes) || Vt)) throw kc(o, e, t);
  return e;
}
function Qe(o, e = {}) {
  const t = String(o || "").trim().toLowerCase(), r = $(e) ? e : {}, a = Array.isArray(r.lines) ? r.lines : [];
  if (a.length > zn) return {
    nodeName: t,
    field: "lines",
    actual: a.length,
    limit: zn
  };
  const n = $(r.headers) ? r.headers : {}, s = Object.entries(n);
  if (s.length > os) return {
    nodeName: t,
    field: "headers.count",
    actual: s.length,
    limit: os
  };
  let i = 0;
  for (const [l, d] of s) {
    const u = Fe(l), f = Fe(d);
    if (u > is) return {
      nodeName: t,
      field: `headers.${l}.keyBytes`,
      actual: u,
      limit: is
    };
    if (f > cs) return {
      nodeName: t,
      field: `headers.${l}.valueBytes`,
      actual: f,
      limit: cs
    };
    i += u + f;
  }
  if (i > ss) return {
    nodeName: t,
    field: "headers.bytes",
    actual: i,
    limit: ss
  };
  for (const l of Gu) {
    const d = Fe(r[l]);
    if (d > br) return {
      nodeName: t,
      field: l,
      actual: d,
      limit: br
    };
  }
  for (let l = 0; l < (Array.isArray(r.tags) ? r.tags.length : 0); l += 1) {
    const d = Fe(r.tags[l]);
    if (d > br) return {
      nodeName: t,
      field: `tags.${l}`,
      actual: d,
      limit: br
    };
  }
  for (let l = 0; l < a.length; l += 1) for (const d of [
    "id",
    "name",
    "target"
  ]) {
    const u = Fe(a[l]?.[d]);
    if (u > br) return {
      nodeName: t,
      field: `lines.${l}.${d}`,
      actual: u,
      limit: br
    };
  }
  let c = 0;
  try {
    c = Fe(JSON.stringify(r));
  } catch {
    return {
      nodeName: t,
      field: "record",
      actual: null,
      limit: Cn
    };
  }
  return c > Cn ? {
    nodeName: t,
    field: "record.bytes",
    actual: c,
    limit: Cn
  } : null;
}
function Zm(o, e = {}) {
  const t = Qe(o, e);
  return t ? {
    code: "NODE_RESOURCE_LIMIT_EXCEEDED",
    ...t
  } : null;
}
async function wr(o, e = null) {
  const t = Se(e), r = t.NodeIndexMutationChain.catch(() => null).then(async () => {
    t.NodesListCache = null, t.NodesIndexCache = null, cr(e);
    try {
      return await o();
    } catch (a) {
      throw t.NodesListCache = null, t.NodesIndexCache = null, cr(e), a;
    }
  });
  return t.NodeIndexMutationChain = r.catch(() => null), await r;
}
var ep = "cf_dashboard_cache:", Hc = "sys:cf_dash_cache", tp = 1800 * 1e3, Fs = 1440 * 60 * 1e3, rp = "sys:cf_daily_traffic", $a = 7, ap = 1080 * 60 * 60, np = $a;
function eo(o, e = "") {
  return `${ep}${encodeURIComponent(String(o || "default").trim() || "default")}:${encodeURIComponent(String(e || "current").trim() || "current")}`;
}
function Us(o, e = "") {
  return `${Hc}:${encodeURIComponent(String(o || "default").trim() || "default")}:${encodeURIComponent(String(e || "current").trim() || "current")}`;
}
function ks(o = /* @__PURE__ */ new Date(), e = k.Defaults.ScheduleUtcOffsetMinutes) {
  const t = Ca(o, e), r = t.shiftedDate.getUTCFullYear(), a = t.shiftedDate.getUTCMonth(), n = Date.UTC(r, a, 1) - t.utcOffsetMinutes * 60 * 1e3, s = Date.UTC(r, a + 1, 1) - t.utcOffsetMinutes * 60 * 1e3, i = t.now.getTime();
  return {
    ...t,
    monthKey: `${r}-${String(a + 1).padStart(2, "0")}`,
    periodLabel: `${r}年${a + 1}月`,
    startTs: n,
    endTs: Math.min(Math.max(n, i), s - 1),
    nextMonthTs: s
  };
}
function op(o = "", e = "", t = 0) {
  return [
    "dashboard_monthly_traffic",
    1,
    encodeURIComponent(String(o || "default").trim() || "default"),
    encodeURIComponent(String(e || "current").trim() || "current"),
    Oe(t)
  ].join(":");
}
function sp(o = "") {
  const e = String(o || "").trim();
  return e ? new Request(`https://dashboard-monthly-traffic-cache.invalid/${encodeURIComponent(e)}`) : null;
}
function $c(o = "", e = "") {
  return `${rp}:${encodeURIComponent(String(o || "default").trim() || "default")}:${encodeURIComponent(String(e || "current").trim() || "current")}`;
}
async function Hs(o, e, t) {
  if (!o || typeof o.get != "function" || !t) return null;
  const r = $c(e, t);
  try {
    const a = await o.get(r, { type: "json" }), n = Number(a?.bytes);
    return Number.isFinite(n) && n >= 0 ? n : null;
  } catch (a) {
    return Ae("dashboard.daily_traffic_archive_read_failed", a, { cacheKey: r }), null;
  }
}
async function $s(o, e, { dateKey: t = "", bytes: r = 0, dayEndTs: a = 0 } = {}) {
  if (!o || typeof o.put != "function" || !t) return !1;
  const n = $c(e, t);
  try {
    return await o.put(n, JSON.stringify({
      bytes: Math.max(0, Number(r) || 0),
      dateKey: t,
      dayEndTs: Math.max(0, Number(a) || 0)
    }), { expirationTtl: ap }), !0;
  } catch (s) {
    return Ae("dashboard.daily_traffic_archive_write_failed", s, { cacheKey: n }), !1;
  }
}
function Jt(o = {}) {
  const e = o && typeof o == "object" ? { ...o } : {};
  return {
    period: "month",
    periodKey: String(e.periodKey || "").trim(),
    periodLabel: String(e.periodLabel || "本月").trim() || "本月",
    traffic: String(e.traffic || "0 B").trim() || "0 B",
    totalBytes: Math.max(0, Number(e.totalBytes) || 0),
    cfAnalyticsLoaded: e.cfAnalyticsLoaded === !0,
    cfAnalyticsStatus: String(e.cfAnalyticsStatus || "").trim(),
    cfAnalyticsError: String(e.cfAnalyticsError || "").trim(),
    cfAnalyticsDetail: String(e.cfAnalyticsDetail || "").trim(),
    trafficSourceText: String(e.trafficSourceText || "本月视频流量口径：CF Zone 总流量（edgeResponseBytes）").trim(),
    generatedAt: String(e.generatedAt || "").trim(),
    cacheStatus: String(e.cacheStatus || "live").trim().toLowerCase() || "live",
    warning: String(e.warning || "").trim()
  };
}
function ip(o = "", e = "") {
  const t = String(o || "").trim();
  return t ? String(e || "").trim().toLowerCase() === "workers_usage" && t.includes("Cloudflare Workers Usage") ? "今日请求量口径：Cloudflare Workers Usage" : t : "";
}
function cp(o = "") {
  const e = String(o || "").trim();
  return e ? e.includes("请求数已对齐 Workers Usage") ? "Cloudflare 统计正常" : e : "";
}
function lp(o = "", e = "") {
  const t = String(o || "").trim();
  if (!t) return "";
  const r = String(e || "").trim().toLowerCase();
  return t.includes("已对齐脚本") || r === "workers_usage" && t.includes("脚本:") ? "" : t;
}
var up = [
  "周日",
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六"
];
function Bc() {
  return Array.from({ length: 24 }, (o, e) => String(e).padStart(2, "0"));
}
function to(o = "") {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(o || "").trim());
  if (!e) return String(o || "").trim() || "-";
  const t = up[new Date(Date.UTC(Number(e[1]), Number(e[2]) - 1, Number(e[3]))).getUTCDay()] || "";
  return `${e[2]}-${e[3]}${t ? ` ${t}` : ""}`;
}
function Kc(o = "", e = 0, t = 0, r = 0, a = 0) {
  const n = Math.max(0, Math.min(23, Number(e) || 0)), s = Math.max(0, Number(t) || 0), i = Math.max(0, Number(r) || 0), c = Math.max(0, Math.min(1, Number(a) || 0)), l = `${String(n).padStart(2, "0")}:00`, d = s > 0 ? Math.min(0.88, Number((0.12 + c * 0.68).toFixed(3))) : 0.04;
  return {
    key: `${o}:${n}`,
    hour: n,
    hourLabel: l,
    rowsWritten: s,
    writeQueries: i,
    intensity: c,
    className: s > 0 ? "d1-heat-cell is-active" : "d1-heat-cell is-empty",
    style: `--d1-heat-alpha:${d}`,
    title: `${o} ${l} · 写入 ${ye(s)} 行 · SQL 写 ${ye(i)} 次`
  };
}
function en(o = {}) {
  const e = Oe(o.utcOffsetMinutes), t = Math.max(0, Number(o.nowMs) || H()), r = st(new Date(t), e).startTs - 8640 * 60 * 1e3, a = Array.from({ length: 7 }, (n, s) => {
    const i = ot(r + s * 24 * 60 * 60 * 1e3, e);
    return {
      key: i.dateKey,
      dateKey: i.dateKey,
      label: to(i.dateKey),
      cells: Array.from({ length: 24 }, (c, l) => Kc(i.dateKey, l))
    };
  });
  return {
    title: "D1 写入热点图",
    status: String(o.status || "idle").trim().toLowerCase() || "idle",
    source: String(o.source || "").trim(),
    summary: String(o.summary || "D1 写入热点尚未加载").trim() || "D1 写入热点尚未加载",
    detail: String(o.detail || "").trim(),
    periodLabel: String(o.periodLabel || `最近 7 天 · ${yo(e)}`).trim(),
    hourLabels: Bc(),
    rows: a,
    available: !1,
    totalRowsWritten: 0,
    totalWriteQueries: 0,
    peakLabel: "",
    legendMaxLabel: "0"
  };
}
function dp(o = {}) {
  const e = o && typeof o == "object" ? { ...o } : {}, t = en({ status: "idle" });
  return {
    ...t,
    ...e,
    title: String(e.title || t.title).trim() || t.title,
    status: String(e.status || t.status).trim().toLowerCase() || t.status,
    source: String(e.source || t.source).trim(),
    summary: String(e.summary || t.summary).trim() || t.summary,
    detail: String(e.detail || t.detail).trim(),
    periodLabel: String(e.periodLabel || t.periodLabel).trim() || t.periodLabel,
    hourLabels: Array.isArray(e.hourLabels) && e.hourLabels.length ? e.hourLabels.map((r) => String(r || "").trim()).filter(Boolean) : t.hourLabels,
    rows: Array.isArray(e.rows) ? e.rows : t.rows,
    available: e.available === !0,
    totalRowsWritten: Math.max(0, Number(e.totalRowsWritten) || 0),
    totalWriteQueries: Math.max(0, Number(e.totalWriteQueries) || 0),
    peakLabel: String(e.peakLabel || "").trim(),
    legendMaxLabel: String(e.legendMaxLabel || "0").trim() || "0"
  };
}
function Ko(o = {}) {
  const e = o && typeof o == "object" ? { ...o } : {}, t = String(e.requestSource || "").trim().toLowerCase();
  return e.requestSourceText = ip(e.requestSourceText, t), e.cfAnalyticsStatus = cp(e.cfAnalyticsStatus), e.cfAnalyticsDetail = lp(e.cfAnalyticsDetail, t), e.d1WriteHotspot = dp(e.d1WriteHotspot), e;
}
function zo(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e === "cache" || e === "stale" || e === "live" ? e : "live";
}
function zc(o, e = "dashboard_snapshot_failed") {
  const t = kt(o, e);
  return t.length <= 220 ? t : `${t.slice(0, 217)}...`;
}
function Wo(o = {}) {
  const e = zo(o.cacheStatus || o.status), t = Math.max(0, Number(o.cachedAt) || 0);
  return {
    cacheStatus: e,
    cachedAt: t,
    expiresAt: Math.max(t, Number(o.expiresAt) || t),
    updatedAt: Math.max(t, Number(o.updatedAt) || t),
    generatedAt: String(o.generatedAt || "").trim(),
    warning: String(o.warning || "").trim(),
    partial: o.partial === !0 || e === "stale"
  };
}
function ro(o = {}) {
  const e = o && typeof o == "object" ? { ...o } : {}, t = Ko(!$(e.stats) && (Array.isArray(e.hourlySeries) || Object.prototype.hasOwnProperty.call(e, "todayRequests") || Object.prototype.hasOwnProperty.call(e, "todayTraffic")) ? e : $(e.stats) ? e.stats : {}), r = $(e.runtimeStatus) ? { ...e.runtimeStatus } : {}, a = $(e.cacheMeta) ? e.cacheMeta : {}, n = Wo({
    cacheStatus: a.cacheStatus || t.cacheStatus || "live",
    cachedAt: a.cachedAt,
    expiresAt: a.expiresAt,
    updatedAt: a.updatedAt,
    generatedAt: a.generatedAt || t.generatedAt || "",
    warning: a.warning,
    partial: a.partial === !0
  });
  return t.cacheStatus = zo(t.cacheStatus || n.cacheStatus), {
    stats: t,
    runtimeStatus: r,
    cacheMeta: n
  };
}
function ra(o = {}, e = "live", t = {}) {
  const r = ro(o), a = zo(e || r.cacheMeta.cacheStatus);
  return {
    stats: Ko({
      ...r.stats,
      cacheStatus: a
    }),
    runtimeStatus: $(r.runtimeStatus) ? { ...r.runtimeStatus } : {},
    cacheMeta: Wo({
      ...r.cacheMeta,
      ...t,
      cacheStatus: a,
      generatedAt: String(t.generatedAt || r.cacheMeta.generatedAt || r.stats.generatedAt || "").trim()
    })
  };
}
function ao(o) {
  if (!(!o || typeof o != "object")) {
    try {
      o.cancelScheduledDelay?.();
    } catch {
    }
    o.cancelScheduledDelay = null, o.pendingSnapshot = null, o.scheduledFlushAt = 0, o.scheduledPromise = null, o.waitUntilCtx = null;
  }
}
function tr(o) {
  const e = te.PlaybackProgressRelay;
  if (!(e instanceof Map)) return !1;
  const t = e.get(o);
  return t && ao(t), e.delete(o);
}
function Bs(o, e) {
  const t = te.PlaybackProgressRelay;
  if (!(t instanceof Map)) return !1;
  const r = Math.max(1, Number(k.Defaults.VideoProgressForwardSessionMax) || 1);
  if (!t.has(o) && t.size >= r) {
    let a = "";
    for (const [n, s] of t) if (!s?.activeFlushPromise) {
      a = n;
      break;
    }
    if (!a) return !1;
    tr(a);
  }
  return t.has(o) && t.delete(o), t.set(o, e), !0;
}
function hr(o, e = "/") {
  const t = Ze(o) ? new URL(o.targetUrl.toString()) : o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), r = Ze(o) ? o.normalizedBasePath : Pt(t.pathname), a = Y(e);
  return t.pathname = (a === "/" ? r ? `${r}/` : "/" : `${r}${a}`) || "/", t.search = "", t.hash = "", t;
}
var fp = /* @__PURE__ */ new Set(["emby", "mediabrowser"]);
function Ks(o = "/") {
  return Y(o).split("/").filter(Boolean);
}
function mp(o = "/", e = "") {
  const t = Y(o), r = String(e || "").trim();
  if (!r || r === "/") return null;
  const a = t.toLowerCase(), n = r.toLowerCase();
  return a !== n && !a.startsWith(`${n}/`) ? null : Y(t.slice(r.length) || "/");
}
function pp(o = "/", e = "") {
  const t = Ks(e), r = Ks(o);
  if (!t.length || !r.length) return null;
  const a = String(t[t.length - 1] || "").toLowerCase(), n = String(r[0] || "").toLowerCase();
  return !a || a !== n || !fp.has(a) ? null : Y(`/${r.slice(1).join("/")}`);
}
function gp(o, e = "/") {
  const t = Ze(o) ? o : pn(o);
  if (!t) return null;
  const r = Y(e), a = t.normalizedBasePath;
  let n = r;
  if (a) {
    const s = mp(r, a);
    if (s !== null) n = s;
    else {
      const i = pp(r, a);
      i !== null && (n = i);
    }
  }
  return hr(t, n);
}
var hp = /^\/(?:emby|mediabrowser)(?=\/)/i, yp = /^\/(?:emby|mediabrowser)$/i;
function Sp(o = "/") {
  const e = Y(o);
  if (!e || e === "/") return [e || "/"];
  if (yp.test(e)) return [e, "/"];
  const t = e.replace(hp, "");
  return t && t !== e ? [e, t] : [e, `/emby${e}`];
}
function Wc(o, e = []) {
  const t = /* @__PURE__ */ new Set(), r = [];
  for (const a of Array.isArray(e) ? e : [e]) for (const n of Sp(a)) {
    const s = gp(o, n);
    if (!s) continue;
    const i = s.toString();
    t.has(i) || (t.add(i), r.push({
      probePath: n,
      probeUrl: s
    }));
  }
  return r;
}
function _p(o, e = "/", t = "") {
  if (!Ze(o)) {
    const s = hr(o, e);
    return s.search = hs(t), s.toString();
  }
  const r = Y(e), a = hs(t), n = o.absoluteBasePrefix || o.originText;
  return `${(r === "/" ? `${n}/` : `${n}${r}`) || `${o.originText}/`}${a}`;
}
function Ia(o, e) {
  try {
    const t = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), r = e instanceof URL ? new URL(e.toString()) : new URL(String(e || ""));
    if (t.origin !== r.origin) return {
      resolvedUrl: t,
      proxyPath: null
    };
    const a = Pt(r.pathname);
    let n = t.pathname || "/";
    if (a) if (n === a || n === `${a}/`) n = "/";
    else if (n.startsWith(`${a}/`)) n = n.slice(a.length);
    else return {
      resolvedUrl: t,
      proxyPath: null
    };
    return {
      resolvedUrl: t,
      proxyPath: Y(n)
    };
  } catch {
    return {
      resolvedUrl: null,
      proxyPath: null
    };
  }
}
function zs(o, e, t, r, a = {}) {
  try {
    const { resolvedUrl: n, proxyPath: s } = Ia(o, e);
    return n ? s ? `${_t(t, r, a)}${s === "/" ? "/" : s}${n.search}${n.hash}` : n.toString() : null;
  } catch {
    return null;
  }
}
function Gc(o = "") {
  const e = Y(o), t = e.toLowerCase();
  let r = -1;
  for (const a of [
    "/items/",
    "/videos/",
    "/audio/",
    "/livetv/"
  ]) {
    const n = t.indexOf(a);
    n > 0 && (r === -1 || n < r) && (r = n);
  }
  return r <= 0 ? "" : Pt(e.slice(0, r));
}
function Go(o = "", e = "") {
  const t = Y(o), r = Pt(e);
  if (!r) return t;
  const a = t.toLowerCase(), n = r.toLowerCase();
  return a === n ? "/" : a.startsWith(`${n}/`) ? Y(t.slice(r.length) || "/") : t;
}
function no(o = "", e = "") {
  const t = Pt(e);
  if (!t) return Y(o);
  let r = Y(o);
  for (; ; ) {
    if (r === t || r === `${t}/`) return "/";
    if (!r.startsWith(`${t}/`)) return r;
    r = Y(r.slice(t.length) || "/");
  }
}
function bp(o = "", e = null, t = "") {
  let r = Y(o);
  return r = no(r, t), r = no(r, e instanceof URL ? e.pathname : "/"), r;
}
function Ep(o = "", e = "", t = null, r = null, a = "") {
  const n = String(o || "").trim();
  if (!n) return null;
  let s = null;
  if (r) try {
    s = r instanceof URL ? new URL(r.toString()) : new URL(String(r || ""));
  } catch {
    s = null;
  }
  let i;
  try {
    if (hf(n)) {
      i = new URL(n, s || "https://playback-info.local/");
      const d = String(i.protocol || "").toLowerCase(), u = String(s?.origin || "").trim().toLowerCase();
      if (!["http:", "https:"].includes(d) || !u || i.origin.toLowerCase() !== u) return null;
    } else i = new URL(n, "https://playback-info.local/");
  } catch {
    return null;
  }
  const c = bp(i.pathname || "/", t, a), l = Go(c, Gc(c));
  return ya(l) ? {
    proxyPath: Y(l),
    search: i.search || "",
    hash: i.hash || ""
  } : null;
}
function Tp(o = "", e = "", t = null) {
  let r = Y(o);
  const a = Gc(e);
  if (a) {
    const d = no(r, a);
    d !== r && ya(d) && (r = d);
  }
  const n = Pt(t instanceof URL ? t.pathname : "/");
  if (!a || !n) return r;
  const s = `${a}${n}`, i = r.toLowerCase(), c = s.toLowerCase();
  if (i !== c && !i.startsWith(`${c}/`)) return r;
  const l = Y(`${a}${r.slice(s.length) || "/"}`);
  return ya(l) ? l : r;
}
function Rp(o = "") {
  return Gt(o) === "rewrite" ? "relative" : "";
}
function jc(o) {
  [
    "Age",
    "Accept-Ranges",
    "Content-Disposition",
    "Content-Encoding",
    "Content-Language",
    "Content-Length",
    "Content-Location",
    "Content-Range",
    "Content-Type",
    "ETag",
    "Expires",
    "Last-Modified",
    "Set-Cookie",
    "Transfer-Encoding"
  ].forEach((e) => o.delete(e));
}
function Ap(o = "/", e = null) {
  const t = Y(e instanceof URL ? e.pathname : o), r = new URLSearchParams(e instanceof URL ? e.search : String(e || ""));
  for (; r.has(Vn); ) r.delete(Vn);
  const a = r.toString();
  return `${t}${a ? `?${a}` : ""}`;
}
function _t(o, e, t = {}) {
  const r = Ud(t?.linkVariant), a = r ? "/" + encodeURIComponent(r) : "";
  if (Ye(t?.entryMode)) return a;
  const n = encodeURIComponent(String(o || "")), s = e ? "/" + encodeURIComponent(String(e)) : "";
  return "/" + n + s + a;
}
function Vc(o, e, t, r = "/", a = {}) {
  const n = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), s = Y(r), i = new URL(n.origin);
  return i.pathname = `${_t(e, t, {
    linkVariant: a.linkVariant,
    entryMode: a.entryMode
  })}${s === "/" ? "/" : s}`, i.search = String(a.search || ""), i.hash = String(a.hash || ""), i;
}
function Cp(o, e, t, r, a = {}) {
  const n = r instanceof URL ? new URL(r.toString()) : new URL(String(r || "")), s = new URL(o instanceof URL ? o.origin : String(o || ""));
  return s.pathname = `${_t(e, t, {
    linkVariant: a.linkVariant,
    entryMode: a.entryMode
  })}/${qi}${n.pathname || "/"}`, s.search = n.search || "", s.searchParams.append(Xi, ha(n.toString())), s.hash = "", s;
}
function wp(o = "", e = "", t = "", r = {}) {
  let a = Y(o);
  const n = String(e || "").trim();
  if (!n && !Ye(r?.entryMode)) return a;
  const s = [...new Set([
    "proxy_a",
    "proxy_b",
    "main"
  ].map((c) => _t(n, t, {
    linkVariant: c,
    entryMode: r.entryMode
  })).filter((c) => c && c !== "/"))].sort((c, l) => l.length - c.length);
  if (!s.length) return a;
  let i = !0;
  for (; i; ) {
    i = !1;
    for (const c of s) {
      const l = Go(a, c);
      if (l !== a) {
        a = l, i = !0;
        break;
      }
    }
  }
  return a;
}
function Lp(o = null) {
  const e = String(o?.routeContextDiagnostics?.routeKind || "").trim();
  return e !== "host_prefix_path_compat" && e !== "legacy_host_prefix_path_compat" ? "" : _t(o?.nodeName, o?.nodeKey, {
    linkVariant: o?.linkVariant,
    entryMode: "kv_route"
  });
}
function Np(o = "", e = "") {
  const t = Y(o), r = Pt(e);
  if (!r || r === "/") return t;
  const a = t.toLowerCase(), n = r.toLowerCase();
  return a === n || a.startsWith(`${n}/`) ? t : `${r}${t === "/" ? "/" : t}`;
}
function Dp(o = "", e = null) {
  const t = Y(o), r = `/${qi}`;
  if (!t.startsWith(r)) return null;
  const a = e instanceof URL && [...e.searchParams.getAll("__pb_target")].pop() || "";
  if (!a) return { error: "missing_target" };
  let n;
  try {
    n = new URL(jr(a));
  } catch {
    return { error: "invalid_target" };
  }
  return ["http:", "https:"].includes(String(n.protocol || "").toLowerCase()) ? {
    targetUrl: n,
    visibleProxyPath: Y(t.slice(r.length) || "/")
  } : { error: "unsupported_target" };
}
function Ws(o = "", e = null, t = "") {
  const r = Y(o), a = r.search(/https?:\/\//i);
  if (a <= 0) return null;
  let n;
  try {
    n = e instanceof URL ? new URL(e.toString()) : new URL(String(e || ""));
  } catch {
    return null;
  }
  let s;
  try {
    s = new URL(r.slice(a));
  } catch {
    return null;
  }
  if (String(s.origin || "").toLowerCase() !== String(n.origin || "").toLowerCase()) return null;
  const i = Pt(t), c = Y(s.pathname || "/"), l = i ? Go(c, i) : c;
  if (i && l === c && c.toLowerCase() !== i.toLowerCase()) return null;
  const d = Y(r.slice(0, a) || "/"), u = [l];
  if (d !== "/") {
    const f = d.toLowerCase(), m = l.toLowerCase();
    m !== f && !m.startsWith(`${f}/`) && u.unshift(Y(`${d}${l === "/" ? "/" : l}`));
  }
  for (const f of u)
    if (ya(Y(sa(f).remaining || f)))
      return {
        kind: "embedded_absolute",
        originalPath: r,
        normalizedPath: Y(f),
        embeddedUrl: s.toString()
      };
  return null;
}
function Ra(o) {
  const e = /* @__PURE__ */ new Map();
  if (!o || typeof o != "string") return e;
  for (const t of o.split(";")) {
    const r = t.trim();
    if (!r) continue;
    const a = r.indexOf("="), n = (a === -1 ? r : r.slice(0, a)).trim(), s = a === -1 ? "" : r.slice(a + 1).trim();
    n && e.set(n, s);
  }
  return e;
}
function qc(o) {
  const e = [];
  for (const [t, r] of o.entries()) e.push(r === "" ? t : `${t}=${r}`);
  return e.join("; ");
}
function jo(o, e = []) {
  const t = new Set((Array.isArray(e) ? e : [e]).map((a) => String(a || "").trim().toLowerCase()).filter(Boolean)), r = Ra(o);
  if (t.size > 0)
    for (const a of r.keys()) t.has(String(a).trim().toLowerCase()) && r.delete(a);
  return qc(r) || null;
}
function Gs(o, e, t = ["auth_token"]) {
  const r = new Set(t.map((s) => String(s || "").trim().toLowerCase()).filter(Boolean)), a = Ra(o);
  for (const s of a.keys()) r.has(String(s).trim().toLowerCase()) && a.delete(s);
  const n = Ra(e);
  for (const [s, i] of n.entries())
    r.has(String(s).trim().toLowerCase()) || a.set(s, i);
  return qc(a) || null;
}
function js(o = "") {
  const e = Y(o).split("/").filter(Boolean);
  if (e.length === 0) return !1;
  const t = It(e[0]).toLowerCase();
  return ed.has(t);
}
async function Ip(o = "", e = "", t = null, r = {}) {
  const a = String(o || "").trim().toLowerCase(), n = re(e), s = String(t?.JWT_SECRET || "").trim();
  if (!a || !n || !s) return "";
  const i = Math.max(0, Math.floor(Number(r.nowMs ?? H()) / 1e3)), c = Math.max(1, Math.trunc(Number(r.maxAgeSec) || 86400)), l = ha(JSON.stringify({
    v: 1,
    node: a,
    host: n,
    iat: i,
    exp: i + c
  }));
  if (!l) return "";
  const d = await gt(s, l);
  return d ? `${l}.${d}` : "";
}
async function Mp(o = "", e = null, t = {}) {
  const r = String(o || "").trim(), a = String(e?.JWT_SECRET || "").trim();
  if (!r) return {
    ok: !1,
    reason: "missing_cookie"
  };
  if (!a) return {
    ok: !1,
    reason: "missing_secret"
  };
  const n = r.indexOf(".");
  if (n <= 0 || n === r.length - 1) return {
    ok: !1,
    reason: "malformed_cookie"
  };
  const s = r.slice(0, n), i = r.slice(n + 1), c = await gt(a, s);
  if (!c || i !== c) return {
    ok: !1,
    reason: "bad_signature"
  };
  let l = null;
  try {
    l = JSON.parse(jr(s));
  } catch {
    return {
      ok: !1,
      reason: "malformed_payload"
    };
  }
  const d = {
    v: Number(l?.v) || 0,
    node: String(l?.node || "").trim().toLowerCase(),
    host: re(l?.host || ""),
    iat: Math.max(0, Math.floor(Number(l?.iat) || 0)),
    exp: Math.max(0, Math.floor(Number(l?.exp) || 0))
  };
  if (d.v !== 1 || !d.node || !d.host || !d.iat || !d.exp || d.exp <= d.iat) return {
    ok: !1,
    reason: "invalid_payload",
    payload: d
  };
  const u = re(t.requestHost || "");
  if (u && d.host !== u) return {
    ok: !1,
    reason: "host_mismatch",
    payload: d
  };
  const f = Math.max(0, Math.floor(Number(t.nowMs ?? H()) / 1e3));
  return d.exp <= f ? {
    ok: !1,
    reason: "expired",
    payload: d
  } : {
    ok: !0,
    payload: d
  };
}
function Pp(o = "") {
  const e = String(o || "").trim();
  return e ? `${No}=${e}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Zu}` : Xc();
}
function Xc() {
  return `${No}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
function Sn(o = "GET", e = null) {
  const t = e ? new Headers(e) : new Headers();
  return t.set("Content-Type", "text/plain; charset=utf-8"), t.set("Cache-Control", "no-store, max-age=0"), Ce(t), t.get("Access-Control-Allow-Origin") !== "*" && Ur(t, "Origin"), new Response(o === "HEAD" ? null : "Not Found", {
    status: 404,
    headers: t
  });
}
function Ma(o = "") {
  return String(o || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}
var Yc = /* @__PURE__ */ new Set([
  "authorization",
  "x-emby-authorization",
  "x-mediabrowser-authorization"
]), xp = /* @__PURE__ */ new Set(["x-emby-token", "x-mediabrowser-token"]), Op = /* @__PURE__ */ new Set(["x-emby-device-id", "x-mediabrowser-device-id"]), Jc = /* @__PURE__ */ new Set([
  ...Yc,
  ...xp,
  ...Op
]);
function _n(o) {
  if (o instanceof Headers) return [...o.entries()];
  if (o && typeof o == "object" && typeof o.entries == "function") try {
    return [...o.entries()].filter((e) => Array.isArray(e) && e.length >= 2).map((e) => [String(e[0] || ""), String(e[1] ?? "")]);
  } catch {
  }
  if (o && typeof o == "object" && typeof o[Symbol.iterator] == "function") try {
    return [...o].filter((e) => Array.isArray(e) && e.length >= 2).map((e) => [String(e[0] || ""), String(e[1] ?? "")]);
  } catch {
  }
  return Array.isArray(o) ? o.filter((e) => Array.isArray(e) && e.length >= 2).map((e) => [String(e[0] || ""), String(e[1] ?? "")]) : o && typeof o == "object" ? Object.entries(o).map(([e, t]) => [String(e || ""), String(t ?? "")]) : [];
}
var Qc = [
  "authorization",
  "api-key",
  "apikey",
  "access-key",
  "accesskey",
  "access-token",
  "accesstoken",
  "session",
  "credential",
  "signature",
  "secret",
  "auth",
  "token"
], vp = [
  "emby",
  "jellyfin",
  "mediabrowser",
  "api_key",
  ...Qc
];
function Zc(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return !e || Jc.has(e) || e === "cookie" ? !1 : Qc.some((t) => e.includes(t));
}
function Fp(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e ? vp.some((t) => e.includes(t)) : !1;
}
var el = /* @__PURE__ */ new Set([
  "apikey",
  "accesstoken",
  "token",
  "authorization",
  "xembytoken",
  "xembyauthorization",
  "xmediabrowsertoken",
  "xmediabrowserauthorization",
  "deviceid",
  "xembydeviceid",
  "xembydevicename",
  "xembyclient",
  "xembyclientversion",
  "xmediabrowserdeviceid",
  "xmediabrowserdevicename",
  "xmediabrowserclient",
  "xmediabrowserclientversion",
  "client",
  "clientid",
  "devicename",
  "userid",
  "playsessionid",
  "sessionid"
]), tl = "identity-http-v2", Up = Object.freeze([
  "Range",
  "If-None-Match",
  "If-Modified-Since"
]), kp = [
  /^\/Videos\/[^/]+\/(?:main|master|stream)\.m3u8$/i,
  /^\/Videos\/[^/]+\/(?:manifest|main|master|stream)\.mpd$/i,
  /^\/Audio\/[^/]+\/(?:main|master|stream)\.m3u8$/i
], Hp = /* @__PURE__ */ new Set([
  "mediasourceid",
  "static",
  "tag",
  "audiostreamindex",
  "subtitlestreamindex",
  "subtitlemethod",
  "starttimeticks"
]);
function rl(o = "") {
  return el.has(Ma(o));
}
function $p(o) {
  const e = o instanceof URL ? new URL(o.toString()) : new URL(String(o || ""));
  e.hash = "";
  const t = [];
  for (const [r, a] of e.searchParams.entries())
    rl(r) || t.push([r, a]);
  t.sort((r, a) => {
    const n = r[0].localeCompare(a[0]);
    return n !== 0 ? n : String(r[1]).localeCompare(String(a[1]));
  }), e.search = "";
  for (const [r, a] of t) e.searchParams.append(r, a);
  return e;
}
function al(o) {
  const e = o instanceof Request ? new URL(o.url) : new URL(String(o || "")), t = [];
  for (const [s, i] of e.searchParams.entries()) {
    const c = Ma(s);
    el.has(c) && t.push([c, String(i)]);
  }
  t.sort((s, i) => {
    const c = s[0].localeCompare(i[0]);
    return c !== 0 ? c : s[1].localeCompare(i[1]);
  });
  const r = o instanceof Request ? o.headers : new Headers(), a = [];
  for (const [s, i] of r.entries()) {
    const c = String(s || "").trim().toLowerCase();
    !c || !Jc.has(c) && !Zc(c) || a.push([c, String(i)]);
  }
  const n = jo(r.get("Cookie") || "", ["auth_token", ...pa]);
  return n && a.push(["cookie", n]), a.sort((s, i) => {
    const c = s[0].localeCompare(i[0]);
    return c !== 0 ? c : s[1].localeCompare(i[1]);
  }), {
    queryEntries: t,
    headerEntries: a
  };
}
function Bp(o) {
  const e = al(o);
  return e.queryEntries.length > 0 || e.headerEntries.length > 0;
}
async function nl(o) {
  const e = al(o), t = await Fn().digest("SHA-256", new TextEncoder().encode(ee(e)));
  return [...new Uint8Array(t)].map((r) => r.toString(16).padStart(2, "0")).join("");
}
async function Kp(o, e) {
  return await nl(new Request(e instanceof URL ? e.toString() : String(e || ""), { headers: o.headers }));
}
function ol(o = "", e = {}) {
  const t = St.test(String(o || ""));
  return ne(`${tl}:${t ? "manifest" : "asset"}:${t ? Math.max(0, Number(e.prewarmCacheTtl) || 0) : Math.max(0, Number(e.imageCacheMaxAge) || 0)}`);
}
function zp(o, e) {
  if (!(o instanceof Request) || !(e instanceof Request) || e.headers.has("If-Range")) return null;
  const t = new Headers();
  for (const r of Up) {
    const a = e.headers.get(r);
    a && t.set(r, a);
  }
  return new Request(o.url, {
    method: "GET",
    headers: t
  });
}
function Wp(o = "") {
  const e = String(o || ""), t = /\/(?:Videos|Audio)\/.+$/i.exec(e);
  return t ? t[0] : e;
}
function Gp(o) {
  try {
    return new Request($p(o).toString(), { method: "GET" });
  } catch {
    return null;
  }
}
function jp(o = {}) {
  const e = Array.isArray(o?.lines) ? o.lines.slice() : [];
  if (e.length > 1) {
    const t = String(o?.activeLineId || "").trim();
    if (t) {
      const r = e.findIndex((a) => String(a?.id || "").trim() === t);
      if (r > 0) {
        const [a] = e.splice(r, 1);
        e.unshift(a);
      }
    }
  }
  return e.length > 0 ? e.map((t) => String(t?.target || "").trim()).filter(Boolean) : String(o?.target || "").split(",").map((t) => t.trim()).filter(Boolean);
}
function oo(o = "", e = {}) {
  const t = String(o || "").trim().toLowerCase(), r = nr(e?.entryMode), a = _n(e?.headers).map(([n, s]) => [String(n || "").trim().toLowerCase(), String(s ?? "").trim()]).filter(([n]) => !!n).sort((n, s) => {
    const i = n[0].localeCompare(s[0]);
    return i !== 0 ? i : n[1].localeCompare(s[1]);
  });
  return ne(ee({
    nodeName: t,
    entryMode: r,
    secret: r === "host_prefix" ? "" : String(e?.secret || "").trim(),
    tags: $r(e?.tags, e?.tag),
    remark: String(e?.remark || "").trim(),
    activeLineId: String(e?.activeLineId || "").trim(),
    orderedTargets: jp(e),
    headers: a,
    playbackInfoMode: String(e?.playbackInfoMode || "").trim().toLowerCase(),
    mediaAuthMode: String(e?.mediaAuthMode || "").trim().toLowerCase(),
    realClientIpMode: String(e?.realClientIpMode || "").trim().toLowerCase(),
    routingDecisionMode: String(e?.routingDecisionMode || "").trim().toLowerCase(),
    mainVideoStreamMode: String(e?.mainVideoStreamMode || e?.wangpanDirectMode || e?.wangpanMode || "").trim().toLowerCase()
  }));
}
function sl(o = []) {
  const e = /* @__PURE__ */ new Set();
  for (const t of Array.isArray(o) ? o : [o]) {
    const r = String(t || "").trim().toLowerCase();
    r && e.add(r);
  }
  return e;
}
function il(o = []) {
  const e = sl(o);
  if (!e.size) return;
  const t = te.PlaybackInfoResponseCache;
  if (t instanceof Map) for (const [r, a] of t.entries()) {
    const n = String(a?.nodeName || "").trim().toLowerCase();
    e.has(n) && t.delete(r);
  }
}
function cl(o = []) {
  const e = sl(o);
  if (!e.size) return;
  const t = te.PlaybackProgressRelay;
  if (!(!(t instanceof Map) || t.size <= 0))
    for (const [r, a] of t.entries()) {
      const n = String(a?.nodeName || a?.pendingSnapshot?.nodeName || "").trim().toLowerCase();
      !n || !e.has(n) || tr(r);
    }
}
function ll(o, e, t, r = "/", a = {}) {
  try {
    const n = String(a.identityPartition || "").trim(), s = String(a.cachePolicyRevision || "").trim();
    if (!n || !s) return null;
    const i = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), c = Y(r), l = new URL(i.origin);
    l.pathname = `${_t(e, t, {
      linkVariant: "main",
      entryMode: a.entryMode
    })}${c === "/" ? "/" : c}`, l.search = String(a.search || "");
    const d = String(a.nodeCacheRevision || "").trim();
    return d && l.searchParams.set("__proxyrev", d), l.searchParams.set("__metadatarev", tl), l.searchParams.set("__identity", n), l.searchParams.set("__policy", s), l.hash = "", Gp(l);
  } catch {
    return null;
  }
}
function Vp(o) {
  try {
    const e = o instanceof URL ? new URL(o.toString()) : new URL(String(o || ""));
    for (const [t, r] of e.searchParams.entries()) {
      const a = String(t || "").toLowerCase(), n = String(r || "").toLowerCase();
      if (a.includes("transcod") || n.includes("transcod")) return !0;
    }
    return !1;
  } catch {
    return !0;
  }
}
function qp(o) {
  try {
    const e = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), t = Wp(e.pathname || "");
    if (!St.test(t) || Vp(e) || !kp.some((r) => r.test(t))) return !1;
    for (const [r] of e.searchParams.entries())
      if (!rl(r) && !Hp.has(Ma(r)))
        return !1;
    return !0;
  } catch {
    return !1;
  }
}
function so(o) {
  try {
    const e = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), t = e.pathname || "";
    return Gr.test(t) || Wr.test(t) || pr.test(t) ? !0 : St.test(t) ? qp(e) : !1;
  } catch {
    return !1;
  }
}
function Xp(o = "") {
  const e = String(o || "").toLowerCase();
  return e ? /\.(?:mp4|m4v|mkv|mov|avi|wmv|flv|ts|m4s)(?:$|[?#])/.test(e) ? !0 : St.test(e) || pr.test(e) ? !1 : /\/videos\/[^/]+\/(?:stream|original|download|file)\b/.test(e) || /\/items\/[^/]+\/download\b/.test(e) : !1;
}
function io(o, e = /* @__PURE__ */ new Set(), t = 0) {
  if (o == null || t > 5) return e;
  if (typeof o == "string") {
    const r = o.trim();
    if (r && /^(?:https?:\/\/|\/)/i.test(r)) {
      const a = r.toLowerCase(), n = a.split(/[?#]/, 1)[0] || a;
      (St.test(n) || pr.test(n) || Gr.test(a) || Wr.test(n)) && e.add(r);
    }
    return e;
  }
  return Array.isArray(o) ? (o.slice(0, 24).forEach((r) => io(r, e, t + 1)), e) : (typeof o == "object" && Object.values(o).slice(0, 32).forEach((r) => io(r, e, t + 1)), e);
}
function Yp(o = "") {
  const e = /^\/Items\/([^/]+)(?:\/|$)/i.exec(String(o || ""));
  return e ? It(e[1]) : "";
}
function Vs(o = "") {
  const e = String(o || "").toLowerCase();
  return Gr.test(e) || Wr.test(e) ? 0 : St.test(e) ? 1 : pr.test(e) ? 2 : 3;
}
function Jp(o = {}, e = {}) {
  return {
    async createKvTidyPlanToken(t, r = {}, a = {}) {
      const n = String(t?.JWT_SECRET || "").trim();
      if (!n) {
        const l = /* @__PURE__ */ new Error("JWT_SECRET is required to sign the KV tidy plan");
        throw l.code = "SERVER_MISCONFIGURED", l.status = 503, l;
      }
      const s = Math.max(0, Math.floor(Number(a.nowMs ?? H()) / 1e3)), i = s + Math.max(60, Math.floor(Number(a.ttlMs) || 6e5) / 1e3), c = ha(JSON.stringify({
        version: 1,
        scope: "kv",
        planHash: String(r?.planHash || e.buildKvTidyPlanHash(r)).trim(),
        issuedAt: s,
        expiresAt: i
      }));
      return `${c}.${await gt(n, c)}`;
    },
    async verifyKvTidyPlanToken(t, r = "", a = {}) {
      const n = String(t?.JWT_SECRET || "").trim(), s = String(r || "").trim();
      if (!n) {
        const u = /* @__PURE__ */ new Error("JWT_SECRET is required to verify the KV tidy plan");
        throw u.code = "SERVER_MISCONFIGURED", u.status = 503, u;
      }
      const i = s.indexOf(".");
      if (i <= 0 || i === s.length - 1) {
        const u = /* @__PURE__ */ new Error("KV tidy plan token is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      const c = s.slice(0, i);
      if (s.slice(i + 1) !== await gt(n, c)) {
        const u = /* @__PURE__ */ new Error("KV tidy plan token signature is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      let l = null;
      try {
        l = JSON.parse(jr(c));
      } catch {
        l = null;
      }
      const d = Math.max(0, Math.floor(Number(a.nowMs ?? H()) / 1e3));
      if (!$(l) || l.version !== 1 || l.scope !== "kv" || !String(l.planHash || "").trim()) {
        const u = /* @__PURE__ */ new Error("KV tidy plan token payload is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      if (Number(l.expiresAt) <= d) {
        const u = /* @__PURE__ */ new Error("KV tidy plan has expired");
        throw u.code = "TIDY_PLAN_STALE", u.status = 409, u.details = {
          reason: "expired",
          expiresAt: Number(l.expiresAt) || 0
        }, u;
      }
      return l;
    },
    buildD1TidyPlanHash(t = {}) {
      const r = $(t?.schemaStatus) ? t.schemaStatus : {};
      return ne(ee({
        scope: "d1",
        mode: String(t?.mode || "manual"),
        maintenanceMode: String(t?.maintenanceMode || "smart"),
        nowMs: Number(t?.nowMs) || 0,
        retentionDays: Number(t?.retentionDays) || 0,
        retentionCutoffMs: Number(t?.retentionCutoffMs) || 0,
        utcOffsetMinutes: Number(t?.utcOffsetMinutes) || 0,
        scheduledNowMs: Number(t?.scheduledNowMs) || 0,
        dayWindow: $(t?.dayWindow) ? t.dayWindow : {},
        statsBucketDate: String(t?.statsBucketDate || ""),
        statsStartTs: Number(t?.statsStartTs) || 0,
        statsEndTs: Number(t?.statsEndTs) || 0,
        statsUtcOffsetMinutes: Number(t?.statsUtcOffsetMinutes) || 0,
        schemaStatus: {
          schemaReady: r.schemaReady === !0,
          tables: $(r.tables) ? r.tables : {},
          columns: $(r.columns) ? r.columns : {},
          indexes: $(r.indexes) ? r.indexes : {},
          constraints: $(r.constraints) ? r.constraints : {},
          ftsReady: r.ftsReady === !0,
          issues: Array.isArray(r.issues) ? r.issues : []
        },
        flags: $(t?.flags) ? t.flags : {},
        summary: $(t?.summary) ? t.summary : {},
        preview: $(t?.preview) ? t.preview : {},
        d1DnsIpPoolSources: Array.isArray(t?.d1DnsIpPoolSources) ? t.d1DnsIpPoolSources : []
      }));
    },
    async createD1TidyPlanToken(t, r = {}, a = {}) {
      const n = String(t?.JWT_SECRET || "").trim();
      if (!n) {
        const l = /* @__PURE__ */ new Error("JWT_SECRET is required to sign the D1 tidy plan");
        throw l.code = "SERVER_MISCONFIGURED", l.status = 503, l;
      }
      const s = Math.max(0, Math.floor(Number(a.issuedAtMs ?? H()) / 1e3)), i = s + Math.max(60, Math.floor(Number(a.ttlMs) || 6e5) / 1e3), c = ha(JSON.stringify({
        version: 1,
        scope: "d1",
        planHash: String(r?.planHash || e.buildD1TidyPlanHash(r)).trim(),
        planNowMs: Number(r?.nowMs) || 0,
        scheduledNowMs: Number(r?.scheduledNowMs) || Number(r?.nowMs) || 0,
        maintenanceMode: String(r?.maintenanceMode || "smart"),
        statsBucketDate: String(r?.statsBucketDate || ""),
        statsStartTs: Number(r?.statsStartTs) || 0,
        statsEndTs: Number(r?.statsEndTs) || 0,
        statsUtcOffsetMinutes: Number(r?.statsUtcOffsetMinutes) || 0,
        issuedAt: s,
        expiresAt: i
      }));
      return `${c}.${await gt(n, c)}`;
    },
    async verifyD1TidyPlanToken(t, r = "", a = {}) {
      const n = String(t?.JWT_SECRET || "").trim(), s = String(r || "").trim();
      if (!n) {
        const u = /* @__PURE__ */ new Error("JWT_SECRET is required to verify the D1 tidy plan");
        throw u.code = "SERVER_MISCONFIGURED", u.status = 503, u;
      }
      const i = s.indexOf(".");
      if (i <= 0 || i === s.length - 1) {
        const u = /* @__PURE__ */ new Error("D1 tidy plan token is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      const c = s.slice(0, i);
      if (s.slice(i + 1) !== await gt(n, c)) {
        const u = /* @__PURE__ */ new Error("D1 tidy plan token signature is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      let l = null;
      try {
        l = JSON.parse(jr(c));
      } catch {
        l = null;
      }
      const d = Math.max(0, Math.floor(Number(a.nowMs ?? H()) / 1e3));
      if (!$(l) || l.version !== 1 || l.scope !== "d1" || !String(l.planHash || "").trim() || !(Number(l.planNowMs) > 0)) {
        const u = /* @__PURE__ */ new Error("D1 tidy plan token payload is invalid");
        throw u.code = "TIDY_PLAN_INVALID", u.status = 409, u;
      }
      if (Number(l.expiresAt) <= d) {
        const u = /* @__PURE__ */ new Error("D1 tidy plan has expired");
        throw u.code = "TIDY_PLAN_STALE", u.status = 409, u.details = {
          reason: "expired",
          expiresAt: Number(l.expiresAt) || 0
        }, u;
      }
      return l;
    },
    async resolveKvTidyQuotaBudget(t, r = [], a = {}) {
      const n = a.kv || e.getKV(t), s = await Cf(ae(a.config || {})), i = Math.max(1, Math.floor(Number(s?.kv?.write) || 0)), c = (Array.isArray(r) ? r : []).map((h) => ({
        type: String(h?.type || "put").trim().toLowerCase() === "delete" ? "delete" : "put",
        key: String(h?.key || "").trim()
      })).filter((h) => h.key), l = c.filter((h) => h.type === "put").length, d = c.filter((h) => h.type === "delete").length, u = n ? await e.captureRawKvEntries(n, c.map((h) => h.key)) : [], f = u.filter((h) => h?.exists === !0).length, m = u.filter((h) => h?.exists !== !0).length, p = l + d + f + m, g = {
        planClass: String(s?.planClass || "free").trim().toLowerCase() === "paid" ? "paid" : "free",
        planLabel: String(s?.planLabel || "").trim() || "FREE",
        periodLabel: String(s?.periodLabel || "").trim() || "今日",
        writeLimit: i,
        estimatedPutCount: l,
        estimatedDeleteCount: d,
        estimatedRollbackWriteCount: f,
        estimatedRollbackDeleteCount: m,
        estimatedWorstCaseWriteCount: p,
        blocked: p > i,
        reason: ""
      };
      return g.reason = g.blocked === !0 ? wf(g) : "", g;
    },
    async buildKvTidyPlan(t, r = {}) {
      const a = r.kv || e.getKV(t);
      if (!a) throw new Error("KV not configured");
      const n = (await e.listKvKeysStrict(a)).sort(), s = n.filter((W) => W.startsWith(e.ADMIN_INDEX_UPLOAD_PREFIX)), { rawStoredSummaryIndexText: i, storedSummaryIndexState: c, previousFullIndexBytes: l } = await e.readStoredNodesSummaryState(a), { nodeNames: d, removableKeys: u, untouchedOtherKeyCount: f, opsStatusKeyCount: m, dnsRecordHistoryKeyCount: p, dnsIpPoolSourceKeyCount: g, configMetaKeyCount: h, snapshotMetaKeyCount: y, nodeIndexMetaKeyCount: _, telegramAlertStateKeyCount: S, loginFailureKeyCount: T, dnsFetchLockKeyCount: b } = await e.classifyKvTidyKeys(a, n), R = await e.readRepairableRuntimeConfig(a), w = $(R.rawConfig) ? R.rawConfig : {}, L = cf(w);
      let U = L.cleanedConfig;
      const E = [...L.migratedConfigKeys], D = await e.captureRawKvEntries(a, [
        e.CONFIG_KEY,
        e.NODES_INDEX_KEY,
        e.NODES_SUMMARY_INDEX_KEY
      ]), A = String(D.find((W) => W?.key === e.NODES_INDEX_KEY)?.value || ""), { nextTidyConfig: x, rewrittenNodes: O, fullEntityNodes: N, rewrittenNodeCount: v, deletedLegacyNodeFieldCount: P, migratedTopLevelPortNodeCount: C, migratedLinePortCount: I, migratedDefaultPortNodeCount: M, migratedDefaultPortLineCount: F } = await e.collectKvTidyNodeMutations(a, d, U, D), V = ee(U) !== ee(x);
      V && (U = x, E.push("sourceDirectNodes"));
      const j = await e.readRevisionMetaForRead(a, e.CONFIG_META_KEY), K = {
        configRevision: String(j?.revision || ""),
        configContentHash: ne(ee(w))
      }, q = n.includes(e.CONFIG_SNAPSHOTS_KEY), de = R.hadMalformedValue || ee(w) !== ee(U), he = lf(R.config, U), fe = e.collectUnreferencedAdminIndexUploadKeys(U, [], s);
      for (const W of fe) u.add(W);
      n.includes(e.CONFIG_SNAPSHOTS_KEY) && u.add(e.CONFIG_SNAPSHOTS_KEY), n.includes(e.CONFIG_SNAPSHOTS_META_KEY) && u.add(e.CONFIG_SNAPSHOTS_META_KEY);
      const ie = e.normalizeNodeSummaryIndex(N).nodes, me = e.normalizeNodeIndex(ie.map((W) => W?.name)), Me = JSON.stringify(me), Ue = JSON.stringify(ie), et = new TextEncoder().encode(Ue).length, Et = l - et, Jr = e.buildLegacyConfigCacheKeys(R.config, U), Le = [...u].sort(), Qr = [.../* @__PURE__ */ new Set([...Jr, ...Le])].filter(Boolean).sort(), tt = [];
      de && tt.push({
        type: "put",
        key: e.CONFIG_KEY,
        value: JSON.stringify(U)
      });
      for (const W of O) tt.push({
        type: "put",
        key: `${e.PREFIX}${W.name}`,
        value: JSON.stringify(W.data)
      });
      A !== Me && tt.push({
        type: "put",
        key: e.NODES_INDEX_KEY,
        value: Me
      }), i !== Ue && tt.push({
        type: "put",
        key: e.NODES_SUMMARY_INDEX_KEY,
        value: Ue
      });
      for (const W of Qr) tt.push({
        type: "delete",
        key: W,
        value: ""
      });
      const rt = await e.resolveKvTidyQuotaBudget(t, tt, {
        kv: a,
        config: U
      }), yr = {
        scannedKeyCount: n.length,
        preservedNodeKeyCount: d.length,
        rebuiltNodeCount: me.length,
        rewrittenNodeCount: v,
        configWasMalformed: R.hadMalformedValue,
        configReadSource: R.source,
        configRewritten: de,
        migratedConfigKeys: Zt(E),
        deletedLegacyFieldCount: L.deletedLegacyFieldCount + P,
        deletedLegacyConfigFieldCount: L.deletedLegacyFieldCount,
        deletedLegacyNodeFieldCount: P,
        migratedTopLevelPortNodeCount: C,
        migratedLinePortCount: I,
        migratedDefaultPortNodeCount: M,
        migratedDefaultPortLineCount: F,
        deletedKeyCount: Le.length,
        deletedCacheKeyCount: Le.filter((W) => W === "sys:cf_dash_cache" || W.startsWith("sys:cf_dash_cache:")).length,
        deletedScheduledLockKeyCount: Le.filter((W) => W === e.LEGACY_SCHEDULED_LOCK_KEY).length,
        deletedLoginFailureKeyCount: T,
        deletedDnsIpPoolSourceKeyCount: g,
        deletedOpsStatusKeyCount: m,
        deletedTelegramAlertStateKeyCount: S,
        deletedDnsFetchLockKeyCount: b,
        deletedAdminIndexUploadCount: fe.length,
        untouchedOtherKeyCount: f,
        previousFullIndexBytes: l,
        nextSummaryIndexBytes: et,
        savedBytes: Et
      }, Zr = df({
        configFieldTargets: yr.migratedConfigKeys,
        sourceDirectNodesFromLegacyNodes: V,
        migratedTopLevelPortNodeCount: C,
        migratedLinePortCount: I,
        migratedDefaultPortNodeCount: M,
        migratedDefaultPortLineCount: F
      }), ke = [], Xt = Le.filter((W) => W === "sys:cf_dash_cache" || W.startsWith("sys:cf_dash_cache:")), lt = Le.filter((W) => W.startsWith("fail:")), ut = Le.filter((W) => W === e.LEGACY_DNS_IP_POOL_SOURCES_KEY), xt = Le.filter((W) => W === e.LEGACY_OPS_STATUS_KEY || Object.values(e.LEGACY_OPS_STATUS_SECTION_KEYS).includes(W)), Tt = Le.filter((W) => W === e.LEGACY_TELEGRAM_ALERT_STATE_KEY), Ot = Le.filter((W) => W === e.LEGACY_SCHEDULED_LOCK_KEY), Yt = Le.filter((W) => W.startsWith(Im)), Rt = Le.filter((W) => W.startsWith(e.ADMIN_INDEX_UPLOAD_PREFIX)), Sr = O.map((W) => W.name);
      be(ke, Xt.length > 0, "cf_dash_cache", "Cloudflare 仪表盘缓存", Xt, Xt.length, "会删除遗留的 sys:cf_dash_cache 及其按日期 / Zone 生成的缓存键。"), be(ke, lt.length > 0, "login_failures", "旧版登录失败计数", lt, lt.length, "会删除旧版 fail:* 登录失败计数键，后续仅保留 D1 auth_failures。"), be(ke, ut.length > 0, "dns_ip_pool_sources", "旧版 DNS IP 池源配置", ut, ut.length, "会删除旧版 sys:dns_ip_pool_sources:v1，后续只保留 D1 dns_ip_pool_sources。"), be(ke, xt.length > 0, "ops_status", "旧版运维状态键", xt, xt.length, "会删除 sys:ops_status:v1 与 sys:ops_status:*，后续只保留 D1 sys_status。"), be(ke, Tt.length > 0, "telegram_alert_state", "旧版 Telegram 告警冷却状态", Tt, Tt.length, "会删除 sys:telegram_alert_state:v1，后续只保留 D1 sys_status scope。"), be(ke, Ot.length > 0, "scheduled_lock", "旧版定时租约键", Ot, Ot.length, "会删除 sys:scheduled_lock:v1，后续只保留 D1 sys_locks。"), be(ke, Yt.length > 0, "dns_fetch_lock", "旧版 DNS 抓取锁键", Yt, Yt.length, "会删除 sys:dns_ip_pool_fetch_lock:v1:*，后续只保留 D1 sys_locks。"), be(ke, q || y > 0, "legacy_config_snapshot_keys", "停用的设置历史键", [e.CONFIG_SNAPSHOTS_KEY, e.CONFIG_SNAPSHOTS_META_KEY], Number(q) + +(y > 0), "会删除已停用的设置历史键及其元数据。"), be(ke, Rt.length > 0, "admin_index_uploads", "未引用的本地 HTML 版本", Rt, Rt.length, "只保留当前配置引用的内容寻址 index.html。");
      const vt = [];
      if (de && be(vt, !0, "runtime_config", "全局设置 sys:theme", [...L.legacyKeysPresent, ...he.map((W) => W.key)], 1, "会把旧版设置字段吸收到当前 schema，并以后端 sanitizeRuntimeConfig() 结果回写。"), v > 0) {
        const W = [];
        C > 0 && W.push(`旧版顶层 node.port 节点 ${C} 个`), I > 0 && W.push(`旧版 lines[].port 线路 ${I} 条`), M > 0 && W.push(`隐式默认端口节点 ${M} 个`), F > 0 && W.push(`按协议补齐默认端口线路 ${F} 条`), be(vt, !0, "node_entities", "节点实体 node:* 标准化重写", Sr, v, W.length ? `会把端口并入 lines[].target，并移除旧版节点字段。${W.join("，")}。` : "会移除旧版节点字段，并统一回写当前节点 schema。");
      }
      be(vt, !0, "node_indexes", "节点索引 / 节点摘要索引", [e.NODES_INDEX_KEY, e.NODES_SUMMARY_INDEX_KEY], 2, `会按当前 node:* 实体重新生成轻量 name 索引与节点摘要索引，并把旧镜像压缩收敛为摘要格式（${l} -> ${et} bytes，节省 ${Et} bytes）。`);
      const Ft = [ft("node_entities_preserved", "node:* 节点实体", d, {
        count: d.length,
        note: "不会整批删除 node:*，只会按需重写必要节点。"
      })];
      p > 0 && be(Ft, !0, "dns_record_history", "DNS 历史记录", n.filter((W) => W.startsWith(e.DNS_RECORD_HISTORY_PREFIX)), p, "不会删除 sys:dns_record_history:v1:*。");
      const B = h + _;
      B > 0 && be(Ft, !0, "meta_keys", "配置 / 索引元信息", [e.CONFIG_META_KEY, e.NODES_INDEX_META_KEY], B, "不会删除这些 revision / meta 键。");
      const G = [];
      R.hadMalformedValue && G.push(`检测到异常 sys:theme（来源: ${R.source}），整理时会按当前 schema 修复。`), C > 0 && G.push(`检测到 ${C} 个旧节点仍使用顶层 node.port；整理后会把端口并入 lines[].target。`), I > 0 && G.push(`检测到 ${I} 条旧线路仍使用独立 lines[].port；整理后会把端口并入 lines[].target。`), (M > 0 || F > 0) && G.push(`检测到 ${M} 个节点 / ${F} 条线路仍未显式写端口；整理后会按协议补齐为 :443 / :80。`), c?.legacyMirrorDetected === !0 && G.push(`检测到旧版 sys:nodes_index_full:v2 仍保存完整节点镜像；本次会按 node:* 重建并收敛为摘要索引（${l} -> ${et} bytes）。`), f > 0 && G.push(`发现 ${f} 个未列入整理白名单的 KV 键，本次不会自动删除。`), ke.length === 0 && !de && v === 0 && G.push("当前没有检测到需要执行的 KV 清理动作；本次更多是一轮一致性巡检。"), G.push(Lf(rt)), rt.blocked === !0 && rt.reason && G.push(rt.reason);
      const X = {
        scope: "kv",
        scannedKeys: n,
        config: U,
        nodesIndex: me,
        rebuiltNodeSummaries: ie,
        revisions: K,
        summary: yr,
        quotaBudget: rt,
        mutationPlan: tt,
        preview: {
          scope: "kv",
          quotaBudget: rt,
          fieldGroups: Zr,
          deleteGroups: ke,
          rewriteGroups: vt,
          preserveGroups: Ft,
          warnings: G
        }
      };
      return X.planHash = e.buildKvTidyPlanHash(X), X;
    },
    async applyKvTidyPlan(t, r = {}) {
      const a = r.kv || e.getKV(r.env);
      if (!a) throw new Error("KV not configured");
      const n = Se(a), s = Array.isArray(t?.mutationPlan) ? t.mutationPlan : [];
      try {
        await e.applyKvMutationsWithRollback(a, s);
      } catch (i) {
        throw ja(r.env), n.NodesListCache = null, n.NodesIndexCache = null, cr(a), vs(n), n.NodeCache.clear(), n.PlaybackRouteHotCache.clear(), i;
      }
      return ja(r.env), vs(n), n.NodeCache.clear(), n.PlaybackRouteHotCache.clear(), Array.isArray(t?.nodesIndex) && t.nodesIndex.length > 0 && (il(t.nodesIndex), cl(t.nodesIndex)), e.primeNodeSummaryCaches(Array.isArray(t?.rebuiltNodeSummaries) ? t.rebuiltNodeSummaries : [], a), n.NodesIndexCache = {
        data: Array.isArray(t?.nodesIndex) ? t.nodesIndex : [],
        exp: H() + 6e4
      }, e.buildTidyResult(t, { ...t?.summary }, "kv", {
        config: t?.config || {},
        nodesIndex: Array.isArray(t?.nodesIndex) ? t.nodesIndex : []
      });
    },
    async tidyKvData(t, r = {}) {
      return await Ol(r.kv || e.getKV(t))(async () => {
        const a = await e.verifyKvTidyPlanToken(t, r.planToken), n = await e.buildKvTidyPlan(t, r);
        if (String(n.planHash || "") !== String(a.planHash || "")) {
          const s = /* @__PURE__ */ new Error("KV tidy data changed after preview");
          throw s.code = "TIDY_PLAN_STALE", s.status = 409, s.details = {
            reason: "plan_changed",
            previewPlanHash: String(a.planHash || ""),
            currentPlanHash: String(n.planHash || "")
          }, s;
        }
        if (n?.quotaBudget?.blocked === !0) {
          const s = String(n?.quotaBudget?.reason || "KV tidy write budget exceeded").trim() || "KV tidy write budget exceeded", i = new Error(s);
          throw i.code = "KV_TIDY_WRITE_LIMIT_EXCEEDED", i.status = 409, i.details = { quotaBudget: n.quotaBudget }, i;
        }
        return await e.applyKvTidyPlan(n, {
          ...r,
          env: t
        });
      });
    }
  };
}
function Qp(o = {}, e = {}) {
  const { D1TidyExecutor: t, D1TidyPlanner: r } = o;
  return {
    async readD1Count(a, n, s = []) {
      if (!a || !n) return 0;
      try {
        let i = a.prepare(n);
        Array.isArray(s) && s.length && (i = i.bind(...s));
        const c = await i.first();
        return Math.max(0, Math.floor(Number(c?.total ?? c?.count ?? c?.c ?? c?.value) || 0));
      } catch {
        return 0;
      }
    },
    getPreviousD1TidyState(a = {}, n = null) {
      const s = $(a) ? a : {}, i = $(s.d1Tidy) ? s.d1Tidy : {};
      return Ve($(n) ? n : $(s.cleanup) ? s.cleanup : {}, i);
    },
    buildD1TidyStatusPayload(a = {}, n = {}) {
      const s = String(n.mode || a.mode || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", i = nt(n.maintenanceMode || a.maintenanceMode, s), c = String(n.triggeredBy || (s === "scheduled" ? "scheduled" : "manual")).trim() || (s === "scheduled" ? "scheduled" : "manual"), l = String(n.timestamp || a.finishedAt || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()).trim() || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), d = String(n.status || a.status || "success").trim() || "success", u = String(n.lastError || a.lastError || "").trim(), f = d === "failed" || d === "partial_failure", m = d === "skipped" || d === "deferred", p = {
        status: d,
        lastSuccessAt: !f && !m ? l : "",
        lastSkippedAt: m ? l : "",
        lastErrorAt: f ? l : "",
        lastError: f ? u : "",
        lastTriggeredBy: c,
        mode: s,
        maintenanceMode: i
      }, g = Math.max(0, Number(a.logRetentionDays ?? a.retentionDays) || 0);
      return {
        d1Tidy: {
          ...p,
          retentionDays: g,
          deletedExpiredLogCount: Math.max(0, Number(a.deletedExpiredLogCount) || 0),
          deletedExpiredLockCount: Math.max(0, Number(a.deletedExpiredLockCount) || 0),
          deletedExpiredFetchCacheCount: Math.max(0, Number(a.deletedExpiredFetchCacheCount) || 0),
          deletedExpiredProbeCacheCount: Math.max(0, Number(a.deletedExpiredProbeCacheCount) || 0),
          deletedExpiredAuthFailureCount: Math.max(0, Number(a.deletedExpiredAuthFailureCount) || 0),
          deletedExpiredDashboardCacheCount: Math.max(0, Number(a.deletedExpiredDashboardCacheCount) || 0),
          preservedLogCount: Math.max(0, Number(a.preservedLogCount) || 0),
          rebuiltStatsHourly: a.rebuiltStatsHourly === !0,
          rebuiltLogsFts: a.rebuiltLogsFts === !0,
          alignedStatsWindow: a.alignedStatsWindow === !0,
          dnsIpPoolSourceAction: String(a.dnsIpPoolSourceAction || "").trim(),
          ftsRebuildStatus: String(a.ftsRebuildStatus || "").trim(),
          optimizeStatus: String(a.optimizeStatus || "").trim(),
          statsRebuildStatus: String(a.statsRebuildStatus || "").trim(),
          reason: String(a.reason || "").trim(),
          summary: a
        },
        cleanup: {
          ...p,
          retentionDays: g,
          ftsRebuildStatus: String(a.ftsRebuildStatus || (a.rebuiltLogsFts === !0 ? "success" : "")).trim(),
          ftsRebuildRecovered: a.ftsRebuildRecovered === !0,
          lastFtsRebuildAt: String(a.lastFtsRebuildAt || "").trim(),
          ftsRebuildError: String(a.ftsRebuildError || "").trim(),
          optimizeStatus: String(a.optimizeStatus || (a.optimizedDb === !0 ? "success" : "")).trim(),
          lastOptimizeAt: String(a.lastOptimizeAt || "").trim(),
          optimizeError: String(a.optimizeError || "").trim(),
          statsAlignStatus: String(a.statsAlignStatus || "").trim(),
          statsAlignError: String(a.statsAlignError || "").trim(),
          statsRebuildStatus: String(a.statsRebuildStatus || (a.rebuiltStatsHourly === !0 ? "success" : "")).trim(),
          statsRebuildError: String(a.statsRebuildError || "").trim(),
          reason: String(a.reason || "").trim()
        }
      };
    },
    buildTidyResult(a = {}, n = {}, s = "kv", i = {}) {
      const c = $(a?.preview) ? a.preview : e.createEmptyTidyPreview(s);
      return {
        ...i,
        summary: n,
        preview: c,
        quotaBudget: $(a?.quotaBudget) ? a.quotaBudget : $(c?.quotaBudget) ? c.quotaBudget : null,
        fieldGroups: Array.isArray(c?.fieldGroups) ? c.fieldGroups : [],
        deleteGroups: Array.isArray(c?.deleteGroups) ? c.deleteGroups : [],
        rewriteGroups: Array.isArray(c?.rewriteGroups) ? c.rewriteGroups : [],
        preserveGroups: Array.isArray(c?.preserveGroups) ? c.preserveGroups : [],
        warnings: Array.isArray(c?.warnings) ? c.warnings : []
      };
    },
    async buildD1TidyPlan(a, n = {}) {
      const s = n.db || e.getDB(a), i = n.kv || e.getKV(a) || null;
      if (!s) throw new Error("D1 not configured");
      const c = n.schemaStatus?.schemaReady === !0 ? n.schemaStatus : await e.getD1SchemaReadiness(s, {
        allowAttestedFastPath: !0,
        env: a
      });
      if (c.schemaReady !== !0) {
        const S = e.createEmptyTidyPreview("d1");
        return S.warnings.push("D1 结构尚未通过运行时兼容检查；本预览不授权删除，必须先完成统一“初始化 DB”并重新预览。"), {
          scope: "d1",
          mode: "manual",
          maintenanceMode: nt(n.maintenanceMode, "manual"),
          schemaStatus: c,
          flags: {},
          summary: {
            status: "blocked",
            schemaReady: !1,
            requiresSchemaInitialization: !0,
            issues: c.issues
          },
          preview: S,
          planHash: ""
        };
      }
      const l = ae(n.config || (a ? await Re(a) : {})), d = r.buildContext(l, n), u = r.attachPreviousState(e, d, n.previousCleanupStatus);
      u.schemaStatus = c, u.logQueuePendingCount = ar.get(s).LogQueue.length;
      const f = await r.readFacts(e, s, i, u), m = r.buildSourcePolicy(f.d1DnsIpPoolSources), p = r.buildFlags(e, u, f, m), g = r.buildSummary(u, f, m, p), h = c.schemaReady === !0;
      g.schemaReady = h, g.requiresSchemaInitialization = !h;
      const y = r.buildPreview(u, f, m, p);
      h || y.warnings.unshift("D1 结构尚未通过运行时兼容检查；本预览不授权删除，必须先完成统一“初始化 DB”并重新预览。");
      const _ = {
        scope: "d1",
        mode: u.mode,
        maintenanceMode: u.maintenanceMode,
        config: l,
        nowMs: u.nowTimestamp,
        retentionDays: u.retentionDays,
        retentionCutoffMs: u.retentionCutoffMs,
        utcOffsetMinutes: u.utcOffsetMinutes,
        scheduledNowMs: u.scheduledNow.getTime(),
        dayWindow: u.dayWindow,
        statsBucketDate: u.statsBucketDate,
        statsStartTs: u.statsStartTs,
        statsEndTs: u.statsEndTs,
        statsUtcOffsetMinutes: u.statsUtcOffsetMinutes,
        statsRetentionBoundaryDate: f.statsRetentionBoundaryDate,
        d1DnsIpPoolSources: f.d1DnsIpPoolSources,
        kvDnsIpPoolSources: f.kvDnsIpPoolSources,
        dnsIpPoolSourceAction: m.dnsIpPoolSourceAction,
        skipDnsIpPoolSourceCleanup: m.skipDnsIpPoolSourceCleanup,
        previousD1State: u.previousD1State,
        schemaStatus: c,
        flags: p,
        summary: g,
        preview: y
      };
      return _.planHash = e.buildD1TidyPlanHash(_), _;
    },
    async applyD1TidyPlan(a, n = {}) {
      const s = n.env, i = n.db || e.getDB(s), c = n.kv || e.getKV(s) || null;
      if (!i) throw new Error("D1 not configured");
      const l = n.schemaStatus?.schemaReady === !0 ? n.schemaStatus : a?.schemaStatus?.schemaReady === !0 ? a.schemaStatus : await e.getD1SchemaReadiness(i, {
        allowAttestedFastPath: !0,
        env: s
      });
      if (l.schemaReady !== !0) {
        const E = /* @__PURE__ */ new Error("D1 schema must pass runtime compatibility checks before tidy execution");
        throw E.code = "D1_SCHEMA_INCOMPATIBLE", E.status = 409, E.details = {
          issues: l.issues,
          autoRepairPolicy: l.autoRepairPolicy
        }, E;
      }
      const d = a || await e.buildD1TidyPlan(s, {
        ...n,
        db: i,
        kv: c
      }), u = String(d?.mode || n.mode || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", f = nt(d?.maintenanceMode || n.maintenanceMode, u), m = $(d?.flags) ? d.flags : {}, p = typeof n.beforeEachStep == "function" ? n.beforeEachStep : async () => {
      }, g = {
        kv: c,
        db: i
      }, h = u === "scheduled", y = t.createSummary(d, u, m);
      y.maintenanceMode = f;
      let _ = !1;
      const S = (E, D, A, x) => {
        const O = A?.message || String(A);
        if (E && (y[E] = "failed"), D && (y[D] = O), y.lastError = O, y.status = y.status === "failed" ? "failed" : "partial_failure", console.error(`${x}: `, A), !h) throw A;
        return !1;
      }, T = ar.get(i);
      T.LogFlushTask && await Promise.resolve(T.LogFlushTask).catch(() => {
      });
      const b = H(), R = t.buildDeleteScopes(e, d, m, i), w = await t.runBudgetedDeleteScopes(R, y, p, { startedAt: b });
      if (y.hasMore = w.hasMore, y.remainingScopes = w.remainingScopes, y.budget = w.budget, _ = w.budget.processedRows > 0, m.rebuildStatsHourly === !0 && H() - b < Mr) try {
        await p("resetStatsHourly"), await e.clearStatsHourly(i), y.alignedStatsWindow = !0, y.statsAlignStatus = "success", y.statsRebuildStatus = "reset_for_new_logs", _ = !0;
      } catch (E) {
        S("statsRebuildStatus", "statsRebuildError", E, "D1 stats reset Error");
      }
      else
        y.statsAlignStatus = m.rebuildStatsHourly === !0 ? "deferred_budget" : "skipped", y.statsRebuildStatus = m.rebuildStatsHourly === !0 ? "deferred_budget" : "skipped";
      const L = () => H() - b < Mr;
      if (m.rebuildLogsFtsDeferred === !0) y.ftsRebuildStatus = m.ftsRebuildDeferredReason || "deferred_size_guard";
      else if (m.rebuildLogsFts === !0 && (y.hasMore || !L())) y.ftsRebuildStatus = "deferred_budget";
      else if (m.rebuildLogsFts === !0) try {
        await p("rebuildLogsFts");
        let E = !1;
        await e.hasLogsFtsTable(i) ? E = await e.rebuildLogsFts(i) : E = (await e.ensureLogsFtsSchema(i)).rebuilt === !0, y.rebuiltLogsFts = E === !0, y.ftsRebuildStatus = E === !0 ? "success" : "skipped", y.lastFtsRebuildAt = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), _ = _ || E === !0;
      } catch (E) {
        S("ftsRebuildStatus", "ftsRebuildError", E, "D1 logs FTS rebuild Error");
      }
      if (m.optimizeDb === !0 && !y.hasMore && L()) try {
        await p("optimizeLogsDb"), await e.optimizeLogsDb(i), y.optimizedDb = !0, y.optimizeStatus = "success", y.lastOptimizeAt = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), _ = !0;
      } catch (E) {
        S("optimizeStatus", "optimizeError", E, u === "scheduled" ? "Scheduled DB optimize Error" : "D1 optimize Error");
      }
      else m.optimizeDb === !0 && (y.optimizeStatus = "deferred_budget");
      y.budget.durationMs = Math.max(0, H() - b), y.budget.durationMs >= Mr && !y.budget.exhaustedBy && (y.budget.exhaustedBy = "time_limit"), await p("patchLogStatus");
      const U = await t.patchLogStatus(e, i, g, d, y, m, n);
      if (y.status !== "partial_failure" && y.status !== "failed") if (y.hasMore)
        y.status = "success", y.reason = "maintenance_budget_exhausted";
      else if (u === "scheduled") {
        const E = m.rebuildLogsFtsDeferred === !0 || m.optimizeDbDeferred === !0;
        _ ? y.status = "success" : (y.status = "skipped", y.reason = E ? "maintenance_deferred" : "no_expired_data");
      } else y.status = "success";
      return y.finishedAt = U, e.buildTidyResult(d, y, "d1");
    },
    async tidyD1Data(a, n = {}) {
      const s = String(n.mode || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", i = nt(n.maintenanceMode, s), c = n.db || e.getDB(a);
      if (!c) throw new Error("D1 not configured");
      if (s === "manual") {
        const u = await e.verifyD1TidyPlanToken(a, n.planToken), f = await e.getD1SchemaReadiness(c, {
          allowAttestedFastPath: !0,
          env: a
        });
        if (f.schemaReady !== !0) {
          const p = /* @__PURE__ */ new Error("D1 schema changed after preview; initialize and preview again");
          throw p.code = "TIDY_PLAN_STALE", p.status = 409, p.details = {
            reason: "schema_changed",
            issues: f.issues
          }, p;
        }
        const m = await e.buildD1TidyPlan(a, {
          ...n,
          db: c,
          mode: s,
          maintenanceMode: nt(u.maintenanceMode, s),
          nowMs: Number(u.planNowMs),
          scheduledNow: new Date(Number(u.scheduledNowMs) || Number(u.planNowMs)),
          statsBucketDate: String(u.statsBucketDate || ""),
          statsStartTs: Number(u.statsStartTs) || 0,
          statsEndTs: Number(u.statsEndTs) || 0,
          statsUtcOffsetMinutes: Number(u.statsUtcOffsetMinutes) || 0,
          schemaStatus: f
        });
        if (String(m.planHash || "") !== String(u.planHash || "")) {
          const p = /* @__PURE__ */ new Error("D1 tidy data changed after preview");
          throw p.code = "TIDY_PLAN_STALE", p.status = 409, p.details = {
            reason: "plan_changed",
            previewPlanHash: String(u.planHash || ""),
            currentPlanHash: String(m.planHash || "")
          }, p;
        }
        return {
          ...await e.applyD1TidyPlan(m, {
            ...n,
            db: c,
            env: a,
            mode: s,
            maintenanceMode: m.maintenanceMode,
            schemaStatus: f
          }),
          schema: f
        };
      }
      let l = await e.getD1SchemaReadiness(c, {
        allowAttestedFastPath: !0,
        env: a
      });
      if (l.schemaReady !== !0 && (await e.buildD1SchemaRepairPlan(c)).phase === "safe" && (await e.initializeD1Database(c, {
        includeFts: !0,
        env: a,
        repairMode: "safe"
      }), l = await e.getD1SchemaReadiness(c, {
        allowAttestedFastPath: !0,
        env: a
      })), l.schemaReady !== !0) {
        const u = /* @__PURE__ */ new Error("D1 schema is not initialized");
        throw u.code = "D1_SCHEMA_NOT_READY", u.status = 409, u.details = { issues: l.issues }, u;
      }
      const d = n.plan || await e.buildD1TidyPlan(a, {
        ...n,
        db: c,
        mode: s,
        maintenanceMode: i,
        schemaStatus: l
      });
      return {
        ...await e.applyD1TidyPlan(d, {
          ...n,
          db: c,
          env: a,
          schemaStatus: l
        }),
        schema: l
      };
    },
    shouldRunLogsOptimize(a, n = {}) {
      const s = Number(n.nowMs) || H(), i = Math.max(0, Number(n.minIntervalMs) || k.Defaults.LogVacuumMinIntervalMs);
      if (n.force === !0) return !0;
      const c = typeof a == "string" ? new Date(a).getTime() : NaN;
      return Number.isFinite(c) ? s - c >= i : !0;
    },
    shouldRunLogsFtsRebuild(a, n = {}) {
      return e.shouldRunLogsOptimize(a, {
        ...n,
        minIntervalMs: Math.max(0, Number(n.minIntervalMs) || k.Defaults.LogFtsRebuildMinIntervalMs)
      });
    },
    async optimizeLogsDb(a) {
      return a ? (await a.prepare("PRAGMA optimize").run(), !0) : !1;
    }
  };
}
function Zp(o = {}, e = {}) {
  const { buildAdminReleaseVendorManifest: t, normalizeAdminReleaseVendorManifestRecord: r, validateAdminShellHtmlSource: a } = o;
  return {
    async readLegacyConfigSnapshotRecordsStrict(n) {
      if (!n) return [];
      const s = await xe(n, e.CONFIG_SNAPSHOTS_KEY, { type: "json" });
      if (s == null) return [];
      if (Array.isArray(s)) return s;
      const i = /* @__PURE__ */ new Error("Stored legacy config snapshot records are invalid");
      throw i.code = "CONFIG_SNAPSHOTS_INVALID", i.status = 409, i;
    },
    buildAdminIndexUploadKey(n = "") {
      const s = Lt(n);
      return s ? `${e.ADMIN_INDEX_UPLOAD_PREFIX}${s}` : "";
    },
    normalizeAdminIndexUploadRecord(n = {}, s = "") {
      if (!$(n)) return null;
      const i = Lt(n.revision), c = Lt(s);
      if (!i || c && i !== c) return null;
      const l = zr(i), d = Ro(i), u = String(n.html || "");
      return u ? {
        version: Number(n.version) || 1,
        revision: i,
        assetRevision: d,
        sourceUrl: l,
        fileName: String(n.fileName || "index.html").trim() || "index.html",
        uploadedAt: String(n.uploadedAt || "").trim(),
        bytes: Number(n.bytes) || new TextEncoder().encode(u).length,
        html: u,
        manifest: r(n.manifest || {})
      } : null;
    },
    async validateAdminIndexUploadRecord(n = {}, s = "") {
      const i = e.normalizeAdminIndexUploadRecord(n, s);
      if (!i || await vn(i.html) !== i.revision) return null;
      try {
        const c = a(i.html, i.sourceUrl, {
          sourceLabel: "local admin index",
          contentType: "text/html"
        });
        return {
          ...i,
          bytes: c.bytes,
          manifest: r(t(c.html, {
            releaseTag: i.assetRevision,
            sourceUrl: i.sourceUrl
          }))
        };
      } catch {
        return null;
      }
    },
    async getAdminActiveIndexRecord(n) {
      return n ? e.validateAdminIndexUploadRecord(await xe(n, e.ADMIN_ACTIVE_INDEX_KEY, { type: "json" })) : null;
    },
    async getAdminIndexUploadRecord(n, s = "") {
      const i = e.buildAdminIndexUploadKey(s);
      if (!n || !i) return null;
      const c = await e.validateAdminIndexUploadRecord(await xe(n, i, { type: "json" }), s);
      return c || e.validateAdminIndexUploadRecord(await xe(n, e.ADMIN_ACTIVE_INDEX_KEY, { type: "json" }), s);
    },
    collectReferencedAdminIndexUploadRevisions(n = {}, s = []) {
      const i = /* @__PURE__ */ new Set(), c = (l) => {
        const d = Je(l?.indexUrl || "");
        d && i.add(d);
      };
      c(n);
      for (const l of Array.isArray(s) ? s : []) c(l?.config);
      return i;
    },
    collectUnreferencedAdminIndexUploadKeys(n = {}, s = [], i = []) {
      const c = e.collectReferencedAdminIndexUploadRevisions(n, s);
      return (Array.isArray(i) ? i : []).filter((l) => {
        const d = String(l || "").trim();
        if (!d.startsWith(e.ADMIN_INDEX_UPLOAD_PREFIX)) return !1;
        const u = Lt(d.slice(e.ADMIN_INDEX_UPLOAD_PREFIX.length));
        return u && !c.has(u);
      });
    },
    async persistAdminIndexUpload(n = {}, s = {}) {
      const { env: i, kv: c, ctx: l } = s;
      if (!c) {
        const u = /* @__PURE__ */ new Error("KV namespace is required to persist the local admin index");
        throw u.code = "KV_NOT_CONFIGURED", u.status = 503, u;
      }
      const d = e.normalizeAdminIndexUploadRecord(n, n?.revision);
      if (!d) {
        const u = /* @__PURE__ */ new Error("本地 index.html 上传记录无效");
        throw u.code = "ADMIN_INDEX_UPLOAD_INVALID", u.status = 400, u;
      }
      return await er(c)(async () => {
        const u = e.buildAdminIndexUploadKey(d.revision), f = await xe(c, u, { type: "json" }), m = await xe(c, e.ADMIN_ACTIVE_INDEX_KEY, { type: "json" });
        let p = e.normalizeAdminIndexUploadRecord(f, d.revision);
        p && await vn(p.html) !== d.revision && (p = null);
        const g = p || d;
        p || await c.put(u, JSON.stringify(d)), await c.put(e.ADMIN_ACTIVE_INDEX_KEY, JSON.stringify(g));
        try {
          const h = i ? await ue(i) : ae(await xe(c, e.CONFIG_KEY, { type: "json" }) || {});
          return {
            config: await e.commitRuntimeConfig({
              ...h,
              indexUrl: g.sourceUrl
            }, {
              env: i,
              kv: c,
              ctx: l
            }),
            previousConfig: h,
            record: g
          };
        } catch (h) {
          throw await pe(m ? c.put(e.ADMIN_ACTIVE_INDEX_KEY, JSON.stringify(m)) : c.delete(e.ADMIN_ACTIVE_INDEX_KEY), "admin.active_index_upload_rollback", { revision: d.revision }, null), p || await pe(f ? c.put(u, JSON.stringify(f)) : c.delete(u), "admin.local_index_upload_rollback", { revision: d.revision }, null), h;
        }
      });
    },
    async rollbackAdminIndexUploadActivation(n = {}, s = {}, i = {}) {
      const { env: c, kv: l, ctx: d } = i;
      if (!l) {
        const u = /* @__PURE__ */ new Error("KV namespace is required to roll back the local admin index");
        throw u.code = "KV_NOT_CONFIGURED", u.status = 503, u;
      }
      return await er(l)(async () => {
        const u = c ? await ue(c) : ae(await xe(l, e.CONFIG_KEY, { type: "json" }) || {}), f = Je(s?.indexUrl || ""), m = Je(u?.indexUrl || "");
        if (!f || m !== f) return {
          config: u,
          skipped: !0,
          reason: m ? "superseded_by_newer_admin_index" : "admin_index_already_restored"
        };
        const p = Je(n?.indexUrl || ""), g = await xe(l, e.ADMIN_ACTIVE_INDEX_KEY, { type: "json" }), h = p ? await e.getAdminIndexUploadRecord(l, p) : null;
        h ? await l.put(e.ADMIN_ACTIVE_INDEX_KEY, JSON.stringify(h)) : await l.delete(e.ADMIN_ACTIVE_INDEX_KEY);
        try {
          return {
            config: await e.commitRuntimeConfig({
              ...u,
              indexUrl: p ? zr(p) : ""
            }, {
              env: c,
              kv: l,
              ctx: d
            }),
            skipped: !1,
            reason: ""
          };
        } catch (y) {
          throw await pe(g ? l.put(e.ADMIN_ACTIVE_INDEX_KEY, JSON.stringify(g)) : l.delete(e.ADMIN_ACTIVE_INDEX_KEY), "admin.active_index_rollback_restore", { revision: f }, null), y;
        }
      });
    },
    async captureRuntimeConfigRollbackState(n, s) {
      if (!s) return {
        config: ae(n ? await Re(n) : {}),
        kvEntries: []
      };
      const i = n ? await ue(n) : ae(await xe(s, e.CONFIG_KEY, { type: "json" }) || {}), c = [
        e.CONFIG_KEY,
        e.CONFIG_META_KEY,
        e.CONFIG_SNAPSHOTS_KEY,
        e.CONFIG_SNAPSHOTS_META_KEY,
        ...e.buildLegacyConfigCacheKeys(i)
      ];
      return {
        config: i,
        kvEntries: await e.captureRawKvEntries(s, c)
      };
    },
    async restoreCapturedRuntimeConfigState(n = {}, s = {}) {
      const i = s.kv, c = ae(n?.config || {});
      if (!i) return c;
      const l = Array.isArray(n?.kvEntries) ? n.kvEntries : [];
      if (l.length > 0) {
        const d = l.map((u) => u?.exists === !0 ? {
          type: "put",
          key: String(u?.key || "").trim(),
          value: String(u?.value ?? "")
        } : {
          type: "delete",
          key: String(u?.key || "").trim(),
          value: ""
        });
        await e.applyKvMutationsWithRollback(i, d);
      }
      return ja(s.env), s.env ? await Re(s.env) : c;
    },
    async restoreCapturedRuntimeConfigAndDnsState(n = {}, s = {}) {
      const i = ae(n?.config || {});
      let c = null, l = null, d = i;
      try {
        await e.commitRuntimeConfig(i, {
          env: s.env,
          kv: s.kv,
          ctx: s.ctx
        });
      } catch (u) {
        c = u;
      }
      try {
        d = await e.restoreCapturedRuntimeConfigState(n, s);
      } catch (u) {
        l = u;
      }
      if (c || l) {
        const u = new Error([c ? `dns:${se(c, "restore_failed")}` : "", l ? `kv:${se(l, "restore_failed")}` : ""].filter(Boolean).join("; "));
        throw u.code = "CONFIG_DNS_RESTORE_FAILED", u.status = 500, u.details = {
          dnsRestoreError: c ? se(c, "restore_failed") : "",
          kvRestoreError: l ? se(l, "restore_failed") : ""
        }, u;
      }
      return d;
    }
  };
}
function eg(o = {}, e = {}) {
  return {
    async persistRuntimeConfig(t, r = {}) {
      return await er(r.kv || Da(r.env))(() => e.commitRuntimeConfig(t, {
        ...r,
        forceKvCommit: !0
      }));
    },
    async prepareRuntimeConfigPersistence(t, r = {}) {
      const { env: a, kv: n, ctx: s } = r;
      if (!n) {
        const u = /* @__PURE__ */ new Error("KV namespace is required to persist runtime config");
        throw u.code = "KV_NOT_CONFIGURED", u.status = 503, u;
      }
      Eu(t?.defaultHostPrefixCnameTarget);
      const i = a ? await ue(a) : ae(await xe(n, e.CONFIG_KEY, { type: "json" }) || {}), c = ae(t);
      Nu(t), Du(c, a);
      const l = ze(a), d = Wa(null, i, l) !== Wa(null, c, l) ? (await e.loadAllNodeEntitiesFromKvStrict(n, { ctx: s })).filter((u) => Ye(u?.entryMode) && !jt(u?.hostPrefixCnameTarget)) : [];
      return d.length > 0 && ca(c, a), {
        prevConfig: i,
        nextConfig: c,
        configuredHost: l,
        dnsPlans: d.map((u) => e.buildHostPrefixDnsSyncPlan(u.name, u, u.name, u, l, {
          previousConfig: i,
          nextConfig: c
        })).filter((u) => u.changed === !0),
        ctx: s,
        kv: n,
        env: a
      };
    },
    async buildRuntimeConfigMutationPlan(t, r, a) {
      const n = await e.readLegacyConfigSnapshotRecordsStrict(t), s = e.normalizeRevisionMeta(Xn(a)), i = [
        {
          type: "delete",
          key: e.CONFIG_SNAPSHOTS_KEY,
          value: ""
        },
        {
          type: "delete",
          key: e.CONFIG_SNAPSHOTS_META_KEY,
          value: ""
        },
        {
          type: "put",
          key: e.CONFIG_KEY,
          value: JSON.stringify(a)
        },
        {
          type: "put",
          key: e.CONFIG_META_KEY,
          value: JSON.stringify(s)
        }
      ];
      for (const d of e.buildLegacyConfigCacheKeys(r, a)) i.push({
        type: "delete",
        key: d,
        value: ""
      });
      const c = e.collectReferencedAdminIndexUploadRevisions(r, n), l = e.collectReferencedAdminIndexUploadRevisions(a, []);
      for (const d of c)
        l.has(d) || i.push({
          type: "delete",
          key: e.buildAdminIndexUploadKey(d),
          value: ""
        });
      return i;
    },
    async commitRuntimeConfig(t, r = {}) {
      const { prevConfig: a, nextConfig: n, configuredHost: s, dnsPlans: i, ctx: c, kv: l, env: d } = await e.prepareRuntimeConfigPersistence(t, r);
      if (sf(r.expectedConfigRevision, a), ee(a) === ee(n))
        return await e.ensureConfigMeta(l, n, { ctx: c }), n;
      const u = [];
      let f = null, m = !1;
      try {
        for (const g of i)
          f = g, await e.persistHostPrefixDnsSyncPlan(g, {
            env: d,
            kv: l,
            ctx: c,
            config: n,
            requestHost: s
          }), u.push(g), f = null;
        m = !0;
        const p = await e.buildRuntimeConfigMutationPlan(l, a, n);
        return await e.applyKvMutationsWithRollback(l, p), d ? ld(d, n) : ja(), await e.invalidateDashboardSnapshotCacheForConfigChange(d, {
          prevConfig: a,
          nextConfig: n
        }), n;
      } catch (p) {
        const g = [], h = f ? [...u, f] : u;
        for (let y = h.length - 1; y >= 0; y -= 1) try {
          await e.persistHostPrefixDnsSyncPlan({ steps: h[y].rollbackSteps }, {
            env: d,
            kv: l,
            ctx: c,
            config: n,
            requestHost: s,
            skipHistory: !0
          });
        } catch (_) {
          g.push(se(_, "dns_rollback_failed"));
        }
        if (p && typeof p == "object") {
          const y = Array.isArray(p?.details?.rollbackConflicts) ? p.details.rollbackConflicts : [], _ = Array.isArray(p?.details?.rollbackFailures) ? p.details.rollbackFailures : [];
          p.details = {
            ...$(p.details) ? p.details : {},
            hostPrefixDnsSyncAttempted: i.length > 0,
            hostPrefixDnsSyncedCount: u.length,
            failedHostPrefixDnsHost: String(f?.nextDnsHost || f?.previousDnsHost || ""),
            rollbackAttempted: h.length > 0 || m,
            rollbackSucceeded: g.length === 0 && y.length === 0 && _.length === 0,
            rollbackError: [...g, ..._].join("; "),
            rollbackConflicts: y
          };
        }
        throw p;
      }
    },
    async commitSourceDirectNodesConfigWithinMutation(t, r, a, n = {}) {
      if (!r) return null;
      const s = t ? await ue(t) : ae(await r.get(e.CONFIG_KEY, { type: "json" }) || {}), i = ht(s.sourceDirectNodes || []), c = Qn(i, {
        renameMap: n.renameMap,
        removedNames: n.removedNames,
        allowedNames: n.allowedNames
      });
      return ee(i) === ee(c) ? s : e.commitRuntimeConfig({
        ...s,
        sourceDirectNodes: c
      }, {
        env: t,
        kv: r,
        ctx: a
      });
    },
    async commitSingleNodeMainVideoStreamShortcutShadowWithinMutation(t, r, a, n = {}) {
      if (!r) return null;
      const s = t ? await ue(t) : ae(await r.get(e.CONFIG_KEY, { type: "json" }) || {}), i = String(n.originalName || "").trim().toLowerCase(), c = String(n.nodeName || "").trim().toLowerCase(), l = cn(n.mode);
      let d = ht(s.sourceDirectNodes || []);
      return i && i !== c && (d = Qn(d, { renameMap: { [i]: c } })), d = d.filter((u) => String(u || "").trim().toLowerCase() !== c), c && l === "direct" && d.push(c), d = ht(d), ee(s.sourceDirectNodes || []) === ee(d) ? s : e.commitRuntimeConfig({
        ...s,
        sourceDirectNodes: d
      }, {
        env: t,
        kv: r,
        ctx: a
      });
    }
  };
}
function tg(o = {}, e = {}) {
  return {
    async sendTelegramMessage({ tgBotToken: t, tgChatId: r, text: a }) {
      const n = String(t || "").trim(), s = String(r || "").trim();
      if (!n || !s) throw new Error("请先完善 Telegram Bot Token 和 Chat ID 配置");
      const i = await Ne(await Be(`https://api.telegram.org/bot${n}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: s,
          text: String(a || "")
        })
      }), sn);
      if (i.exceeded) throw new Error("Telegram API response too large");
      const c = JSON.parse(i.text);
      if (!c.ok) throw new Error(c.description || "Telegram API 返回错误");
      return c;
    },
    async buildDailyTelegramSummaryPayload(t, r = {}) {
      const a = ae(r?.config || await ue(t)), n = r?.now instanceof Date ? new Date(r.now.getTime()) : new Date(r?.now || /* @__PURE__ */ new Date()), s = r?.dayWindow && typeof r.dayWindow == "object" ? r.dayWindow : st(n, a.scheduleUtcOffsetMinutes), [i, c] = await Promise.all([e.buildDashboardStatsPayload(t, {
        config: a,
        dayWindow: s,
        nowMs: n.getTime(),
        skipD1WriteHotspot: !0
      }), e.getDashboardMonthlyTrafficPayload(t, {
        config: a,
        ctx: r?.ctx || null,
        nowMs: n.getTime()
      })]);
      return {
        zoneName: String(i?.zoneName || "").trim(),
        requestCountDisplay: String(i?.requestCountDisplay || "").trim() || (i?.todayRequests === null || i?.todayRequests === void 0 ? "暂不可用" : String(Number(i?.todayRequests) || 0)),
        requestSourceText: String(i?.requestSourceText || "").trim(),
        todayTraffic: String(i?.todayTraffic || "").trim() || "暂不可用",
        monthlyTraffic: String(c?.traffic || "").trim() || "暂不可用",
        trafficSourceText: String(i?.trafficSourceText || "").trim(),
        playCount: Math.max(0, Number(i?.playCount) || 0),
        infoCount: Math.max(0, Number(i?.infoCount) || 0),
        nodeCount: Math.max(0, Number(i?.nodeCount) || 0),
        todayRequests: i?.todayRequests ?? null
      };
    },
    async sendDailyTelegramReport(t, r = {}) {
      const a = e.getDB(t), n = e.getKV(t);
      if (!a || !n) throw new Error("Database or KV not configured");
      const s = await n.get(e.CONFIG_KEY, { type: "json" }) || {}, i = ae(s), c = String(i.tgBotToken || "").trim(), l = String(i.tgChatId || "").trim();
      if (!c || !l) throw new Error("请先完善 Telegram Bot Token 和 Chat ID 配置");
      const d = r?.now instanceof Date ? new Date(r.now.getTime()) : new Date(r?.now || /* @__PURE__ */ new Date()), u = st(d, i.scheduleUtcOffsetMinutes), f = Vi(i, s, {
        reportKinds: r?.reportKinds,
        fallbackAllWhenLegacy: !0
      });
      if (!f.length) throw new Error("请先至少启用一个日报类型");
      const m = f.includes("summary") ? await e.buildDailyTelegramSummaryPayload(t, {
        config: i,
        now: d,
        dayWindow: u
      }) : null, p = f.some((h) => h !== "summary") ? await e.getCloudflareRuntimeQuotaStatus(t, {
        config: i,
        db: a
      }) : null, g = [];
      for (const h of f) {
        const y = Mf(h, h === "summary" ? m : p?.[h], u);
        await e.sendTelegramMessage({
          tgBotToken: c,
          tgChatId: l,
          text: y
        }), g.push({
          kind: h,
          text: y
        });
      }
      return {
        success: g.length > 0,
        sentCount: g.length,
        reportKinds: f,
        messages: g
      };
    },
    async maybeSendRuntimeAlerts(t, r = null, a = {}) {
      const n = e.getDB(t);
      if (!n) return {
        sent: !1,
        reason: "db_unavailable"
      };
      if (!await e.ensureSysStatusTable(n)) return {
        sent: !1,
        reason: "db_init_failed"
      };
      const s = ae(await Re(t)), i = a && typeof a == "object" ? a : {}, c = String(s.tgBotToken || "").trim(), l = String(s.tgChatId || "").trim();
      if (!c || !l) return {
        sent: !1,
        reason: "telegram_not_configured"
      };
      const d = le(s.tgAlertDroppedBatchThreshold, k.Defaults.TgAlertDroppedBatchThreshold, 0, 5e3), u = le(s.tgAlertFlushRetryThreshold, k.Defaults.TgAlertFlushRetryThreshold, 0, 10), f = le(s.tgAlertCooldownMinutes, k.Defaults.TgAlertCooldownMinutes, 1, 1440), m = s.tgAlertOnScheduledFailure === !0, p = s.tgAlertKvUsageEnabled === !0, g = s.tgAlertD1UsageEnabled === !0, h = le(s.tgAlertKvUsageThresholdPercent, k.Defaults.TgAlertKvUsageThresholdPercent, 1, 100), y = le(s.tgAlertD1UsageThresholdPercent, k.Defaults.TgAlertD1UsageThresholdPercent, 1, 100);
      if (d <= 0 && u <= 0 && !m && !p && !g) return {
        sent: !1,
        reason: "thresholds_disabled"
      };
      const _ = await e.getOpsStatus(t), S = _ && typeof _.log == "object" ? _.log : {}, T = r && typeof r == "object" && Object.keys(r).length ? r : _ && typeof _.scheduled == "object" ? _.scheduled : {}, b = [], R = Number(S.lastDroppedBatchSize) || 0;
      d > 0 && R >= d && b.push({
        code: "log_drop",
        message: `日志刷盘疑似丢弃批次：${R} 条（阈值 ${d}）`,
        eventAt: S.lastFlushErrorAt || S.lastOverflowAt || S.updatedAt || _.updatedAt || ""
      });
      const w = Number(S.lastFlushRetryCount) || 0;
      u > 0 && w >= u && b.push({
        code: "log_retry",
        message: `D1 写入重试次数偏高：${w} 次（阈值 ${u}）`,
        eventAt: S.lastFlushAt || S.lastFlushErrorAt || S.updatedAt || _.updatedAt || ""
      });
      const L = String(T.status || "").toLowerCase();
      if (m && (L === "failed" || L === "partial_failure")) {
        const N = [];
        for (const [v, P] of Object.entries({
          cleanup: "日志清理",
          tgDailyReport: "每日报表",
          alerts: "异常告警"
        })) {
          const C = T?.[v];
          if (!C || typeof C != "object") continue;
          const I = String(C.status || "").trim(), M = String(C.lastError || "").trim();
          !M && I !== "failed" && I !== "partial_failure" || N.push(`${P}：${I || "failed"}${M ? `，错误：${M}` : ""}`);
        }
        b.push({
          code: "scheduled_failure",
          message: N.length ? `定时任务状态异常：${N.join("；")}` : `定时任务状态异常：${T.status}${T.lastError ? `，错误：${T.lastError}` : ""}`,
          eventAt: T.lastFinishedAt || T.lastErrorAt || T.updatedAt || _.updatedAt || ""
        });
      }
      if (p || g) {
        const N = await e.getCloudflareRuntimeQuotaStatus(t, {
          config: s,
          db: n
        }), v = [{
          enabled: p,
          threshold: h,
          code: "cf_kv_usage",
          title: "KV",
          card: N?.kv
        }, {
          enabled: g,
          threshold: y,
          code: "cf_d1_usage",
          title: "D1",
          card: N?.d1
        }];
        for (const P of v) {
          if (P.enabled !== !0) continue;
          const C = P.card && typeof P.card == "object" ? P.card : {}, I = String(C.status || "").trim().toLowerCase();
          if (I !== "success" && I !== "partial_failure") continue;
          const M = (Array.isArray(C.metrics) ? C.metrics : []).filter((V) => Number(V?.percent) >= P.threshold);
          if (!M.length) continue;
          const F = M.map((V) => `${String(V?.key || "").trim()}:${String(V?.percentText || "").trim()}`).filter(Boolean).join(",");
          b.push({
            code: P.code,
            message: Df(P.title, C, P.threshold, M),
            eventAt: `${String(C.resourceLabel || P.title || "").trim()}|${String(C.planLabel || "").trim()}|${String(C.periodLabel || "").trim()}|${F}|${I}`
          });
        }
      }
      if (!b.length) return {
        sent: !1,
        reason: "no_alerts"
      };
      const U = JSON.stringify(b.map((N) => ({
        code: N.code,
        eventAt: N.eventAt,
        message: N.message
      }))), E = await e.getOpsStatusPayloadFromDb(n, e.TELEGRAM_ALERT_STATE_DB_SCOPE), D = Date.now(), A = f * 60 * 1e3;
      if (i.ignoreCooldown !== !0 && E && E.signature === U && Number(E.sentAtMs) > 0 && D - Number(E.sentAtMs) < A) return {
        sent: !1,
        reason: "cooldown_active"
      };
      const x = Yl(/* @__PURE__ */ new Date(), s.scheduleUtcOffsetMinutes), O = [
        "⚠️ Emby Proxy 运行时异常告警",
        "",
        ...b.map((N) => `- ${N.message}`),
        "",
        `时间：${x.dateKey} ${x.clockTime} (${x.offsetLabel})`,
        "#Emby #Alert"
      ];
      return await e.sendTelegramMessage({
        tgBotToken: c,
        tgChatId: l,
        text: O.join(`
`)
      }), i.persistState !== !1 && (await e.putOpsStatusPayloadToDb(n, e.TELEGRAM_ALERT_STATE_DB_SCOPE, {
        signature: U,
        sentAt: new Date(D).toISOString(),
        sentAtMs: D,
        issues: b
      }, D) || Ae("telegram_alert_state.write_failed", /* @__PURE__ */ new Error("telegram alert cooldown state not persisted"), { issueCount: b.length })), {
        sent: !0,
        issueCount: b.length,
        reason: "alert_sent"
      };
    }
  };
}
function rg(o = {}, e = {}) {
  return {
    ...Jp(o, e),
    ...Qp(o, e),
    ...Zp(o, e),
    ...eg(o, e),
    ...tg(o, e)
  };
}
var ag = class {
  constructor({ logger: o, service: e }) {
    this.logger = o, this.service = e;
  }
  handle(o, e, t) {
    if (!t || typeof t.waitUntil != "function") throw new TypeError("ScheduledMaintenanceFacade.handle requires ctx.waitUntil");
    const r = this.#p(o, e, t);
    t.waitUntil(r);
  }
  #t(o = {}, ...e) {
    for (const t of e) {
      if (!t) continue;
      const r = o?.[t];
      if ($(r)) return r;
    }
    return {};
  }
  #e(o = "success") {
    return o === "success" ? "partial_failure" : o;
  }
  #o(o = {}, e = "") {
    const t = String(e || o?.localDateKey || "");
    return t ? {
      ...o,
      localDateKey: t,
      executedSlots: Nt(o?.executedSlots || [], [])
    } : {
      ...o,
      executedSlots: Nt(o?.executedSlots || [], [])
    };
  }
  #s(o = {}, e = "", t = "") {
    return this.#o({
      ...o,
      executedSlots: [...o?.executedSlots || [], t]
    }, e);
  }
  #n(o = "", e = []) {
    const t = e[e.length - 1] || "";
    return {
      processedSlots: e,
      lastPlannedSlot: t ? `${o} ${t}` : "",
      reason: e.length > 1 ? "clock_slots_processed" : "clock_slot_processed"
    };
  }
  #r(o = {}, e = "", t = "", r = {}) {
    return {
      ...o,
      status: "skipped",
      lastSkippedAt: e,
      reason: t,
      ...r
    };
  }
  #i(o = {}, e = "", t = {}) {
    return {
      ...o,
      status: "success",
      lastSuccessAt: e,
      ...t
    };
  }
  #c(o = {}, e = "", t = "", r = {}) {
    return {
      ...o,
      status: "failed",
      lastErrorAt: e,
      lastError: t,
      ...r
    };
  }
  #l(o = "") {
    return async (e, t, r = null, a = null) => {
      try {
        return await e;
      } catch (n) {
        return this.logger.error(`scheduled.${t}`, n, {
          leaseToken: o,
          ...$(r) ? r : {}
        }), a;
      }
    };
  }
  #a(o, e, t) {
    return { scheduled: {
      lastSkippedAt: o,
      lastSkipReason: t,
      lock: {
        status: "busy",
        reason: t,
        expiresAt: e.lock?.expiresAt || null,
        backend: String(e?.backend || e?.lock?.backend || "").trim() || "d1"
      }
    } };
  }
  #u(o, e, t = "d1") {
    const r = String(e || "scheduled_skipped").trim() || "scheduled_skipped";
    return { scheduled: {
      status: "skipped",
      lastSkippedAt: o,
      lastSkipReason: r,
      lastFinishedAt: o,
      lock: {
        status: "skipped",
        reason: r,
        backend: String(t || "").trim() || "d1"
      }
    } };
  }
  #d(o, e, t, r) {
    return { scheduled: {
      status: "running",
      lastStartedAt: o,
      lock: {
        status: "held",
        token: e,
        expiresAt: t.lock?.expiresAt || H() + r
      }
    } };
  }
  #f(o, e, t) {
    return o.lostReason ? {
      status: "lost",
      reason: o.lostReason,
      lastCheckedAt: e
    } : {
      status: t ? "released" : "release_skipped",
      releasedAt: e
    };
  }
  #m({ leaseStores: o, leaseToken: e, scheduledLeaseMs: t, leaseBackend: r = "", initialLock: a = null }) {
    const n = {
      active: !0,
      lostReason: null,
      lock: a
    }, s = async () => {
      if (!n.active) return null;
      const l = await this.service.renewScheduledLease(o, e, t, { backend: r });
      return l ? (n.lock = l, l) : (n.active = !1, n.lostReason = n.lostReason || "lease_lost", null);
    }, i = async () => {
      if (!n.active) throw new Error(n.lostReason || "scheduled_lease_lost");
      const l = await s();
      if (!l) throw new Error(n.lostReason || "scheduled_lease_lost");
      return l;
    }, c = Math.max(5e3, Math.min(Math.floor(t / 3), 6e4));
    return {
      leaseState: n,
      ensureActive: i,
      keepalivePromise: (async () => {
        for (; n.active; ) {
          let l = c;
          for (; n.active && l > 0; ) {
            const d = Math.min(l, 1e3);
            await li(d), l -= d;
          }
          if (!n.active) break;
          await s();
        }
      })().catch((l) => {
        n.active = !1, n.lostReason = n.lostReason || "lease_renew_failed", this.logger.error("scheduled.lease_keepalive", l, {
          leaseToken: e,
          backend: r || "unknown",
          lostReason: n.lostReason
        });
      })
    };
  }
  async #p(o, e, t) {
    const r = this.service.getDB(e), a = this.service.getKV(e);
    if (!a && !r) return;
    const n = { db: r }, s = await Re(e), i = Oe(s?.scheduleUtcOffsetMinutes), c = o?.scheduledTime !== void 0 ? new Date(o.scheduledTime) : /* @__PURE__ */ new Date(), l = Zo(c, i), d = (w = /* @__PURE__ */ new Date()) => Zo(w, i), u = le(s?.scheduledLeaseMs, k.Defaults.ScheduledLeaseMs, k.Defaults.ScheduledLeaseMinMs, 900 * 1e3), f = `${H()}-${Math.random().toString(36).slice(2, 10)}`, m = this.#l(f), p = async (w) => {
      const L = String(w || "db_unavailable").trim() || "db_unavailable";
      await m(this.service.patchOpsStatus(e, this.#u(l, L, "d1")), "patch_skipped_status", {
        reason: L,
        backend: "d1"
      }, null);
    };
    if (!r) {
      await p("db_not_configured");
      return;
    }
    const g = await this.service.tryAcquireScheduledLeaseWithDb(r, {
      token: f,
      leaseMs: u
    });
    if (!g.acquired) {
      const w = String(g.reason || "lease_not_acquired");
      if (w === "db_not_configured" || w === "db_unavailable" || w === "db_init_failed") {
        await p(w);
        return;
      }
      await m(this.service.patchOpsStatus(e, this.#a(l, g, w)), "patch_busy_status", { reason: w }, null);
      return;
    }
    const h = String(g.backend || g.lock?.backend || "").trim().toLowerCase(), { leaseState: y, ensureActive: _, keepalivePromise: S } = this.#m({
      leaseStores: n,
      leaseToken: f,
      scheduledLeaseMs: u,
      leaseBackend: h,
      initialLock: g.lock || null
    }), T = l;
    await m(this.service.patchOpsStatus(e, this.#d(T, f, y, u)), "patch_running_status", { startedAt: T }, null);
    const b = {
      status: "success",
      lastStartedAt: T,
      lastFinishedAt: null,
      lastSuccessAt: null,
      lastErrorAt: null,
      lastError: null,
      d1Tidy: {},
      cleanup: {},
      kvTidy: {},
      tgDailyReport: {},
      alerts: {}
    }, R = () => d(/* @__PURE__ */ new Date());
    try {
      const w = s || {}, L = await m(this.service.getOpsStatusSection(e, "scheduled"), "read_previous_status", null, {});
      if (r) try {
        await _();
        const P = st(c, w.scheduleUtcOffsetMinutes), C = P.dateKey, I = P.startTs, M = P.endTs, F = Oe(w.scheduleUtcOffsetMinutes), V = this.service.getPreviousD1TidyState(L), j = await this.service.tidyD1Data(e, {
          db: r,
          kv: a,
          ctx: t,
          config: w,
          mode: "scheduled",
          maintenanceMode: "smart",
          previousScheduledState: L,
          previousCleanupStatus: V,
          scheduledNow: c,
          dayWindow: P,
          statsBucketDate: C,
          statsStartTs: I,
          statsEndTs: M,
          statsUtcOffsetMinutes: F,
          beforeEachStep: _
        }), K = R(), q = this.service.buildD1TidyStatusPayload(j.summary, {
          mode: "scheduled",
          maintenanceMode: "smart",
          triggeredBy: "scheduled",
          timestamp: K
        });
        b.d1Tidy = q.d1Tidy, b.cleanup = q.cleanup, (b.d1Tidy.status === "partial_failure" || b.d1Tidy.status === "failed") && (b.status = "partial_failure"), await _();
      } catch (P) {
        b.status = "partial_failure";
        const C = this.service.buildD1TidyStatusPayload({
          status: "failed",
          lastError: P?.message || String(P),
          maintenanceMode: "smart"
        }, {
          mode: "scheduled",
          maintenanceMode: "smart",
          triggeredBy: "scheduled",
          timestamp: R()
        });
        b.d1Tidy = C.d1Tidy, b.cleanup = C.cleanup, this.logger.error("Scheduled DB Cleanup Error: ", P);
      }
      else {
        const P = this.service.buildD1TidyStatusPayload({
          status: "skipped",
          reason: "db_not_configured",
          maintenanceMode: "smart"
        }, {
          mode: "scheduled",
          maintenanceMode: "smart",
          triggeredBy: "scheduled",
          timestamp: R()
        });
        b.d1Tidy = P.d1Tidy, b.cleanup = P.cleanup;
      }
      try {
        await _();
        const P = await this.service.snapshotCfDailyTrafficArchive(e, {
          config: w,
          nowMs: c.getTime()
        });
        b.cfTrafficArchive = {
          status: String(P?.status || "success"),
          storedCount: Math.max(0, Number(P?.storedCount) || 0),
          lastFinishedAt: R()
        }, P?.status === "partial_failure" && (b.status = this.#e(b.status));
      } catch (P) {
        b.status = this.#e(b.status), b.cfTrafficArchive = {
          status: "failed",
          lastError: P?.message || String(P),
          lastFinishedAt: R()
        }, this.logger.error("Scheduled CF traffic archive Error: ", P);
      }
      b.kvTidy = {
        ...this.#t(L, "kvTidy"),
        mode: "manual_only",
        lastAutoSkipAt: R(),
        autoSkipReason: "manual_only"
      };
      const { tgBotToken: U, tgChatId: E } = w, D = this.#t(L, "tgDailyReport", "report"), A = this.#t(L, "alerts"), x = Nt(w.tgDailyReportClockTimes, k.Defaults.TgDailyReportClockTimes), O = Ql(D, x, i, c), N = Vi(w, w), v = {
        ...D,
        clockTimes: x,
        reportKinds: N
      };
      if (w.tgDailyReportEnabled === !0) {
        let P = this.#o(O.fixedQueue);
        if (!N.length) b.tgDailyReport = this.#r(v, R(), "report_kinds_disabled", { fixedQueue: P });
        else if (!U || !E) b.tgDailyReport = this.#r(v, R(), "telegram_not_configured", { fixedQueue: P });
        else if (O.due !== !0) b.tgDailyReport = this.#r(v, R(), O.reason || "time_not_matched", { fixedQueue: P });
        else {
          let C = [], I = null, M = 0;
          for (const F of O.dueSlots) try {
            await _();
            const V = await this.service.sendDailyTelegramReport(e, {
              now: c,
              reportKinds: N
            });
            M += Number(V?.sentCount) || 0, C.push(F), P = this.#s(P, O.context.dateKey, F);
          } catch (V) {
            I = V, this.logger.error("Scheduled Daily Report Error: ", V);
            break;
          }
          I ? (b.status = this.#e(b.status), b.tgDailyReport = this.#c(v, R(), I?.message || String(I), {
            fixedQueue: P,
            processedSlots: C
          })) : b.tgDailyReport = this.#i(v, R(), {
            fixedQueue: P,
            sentCount: M,
            ...this.#n(O.context.dateKey, C)
          });
        }
      } else b.tgDailyReport = this.#r(v, R(), "disabled", { fixedQueue: O.fixedQueue });
      try {
        await _();
        const P = await this.service.maybeSendRuntimeAlerts(e, b), C = R();
        b.alerts = P.sent === !0 ? this.#i(A, C, {
          lastPolledAt: C,
          lastSkippedAt: A.lastSkippedAt || "",
          issueCount: Number(P.issueCount) || 0,
          reason: P.reason || "alert_sent"
        }) : this.#r(A, C, P.reason || "no_alerts", {
          lastPolledAt: C,
          lastSuccessAt: A.lastSuccessAt || "",
          issueCount: Number(P.issueCount) || 0
        });
      } catch (P) {
        b.status = this.#e(b.status);
        const C = R();
        b.alerts = this.#c(A, C, P?.message || String(P), { lastPolledAt: C }), this.logger.error("Scheduled Alert Error: ", P);
      }
    } catch (w) {
      b.status = "failed", b.lastErrorAt = R(), b.lastError = w?.message || String(w), this.logger.error("Scheduled Task Error: ", w);
    } finally {
      y.active = !1, await S;
      const w = R();
      b.lastFinishedAt = w, b.status === "success" && (b.lastSuccessAt = w);
      const L = y.lostReason ? !1 : await m(this.service.releaseScheduledLease(n, f, { backend: h }), "release_lease", { backend: h }, !1);
      b.lock = this.#f(y, w, L), await m(this.service.patchOpsStatus(e, { scheduled: b }), "patch_final_status", {
        finishedAt: w,
        finalStatus: b.status,
        leaseLostReason: y.lostReason || ""
      }, null);
    }
  }
};
function ng(o = {}, e = {}) {
  return {
    sanitizeHeaders(t) {
      if (!t || typeof t != "object" || Array.isArray(t)) return {};
      const r = {};
      for (const [a, n] of Object.entries(t)) {
        const s = String(a || "").trim();
        s && (Wn.has(s.toLowerCase()) || (r[s] = String(n ?? "")));
      }
      return r;
    },
    normalizeTargets(t) {
      const r = String(t || "").split(",").map((n) => n.trim()).filter(Boolean);
      if (!r.length) return null;
      const a = [];
      for (const n of r) {
        const s = ps(n);
        if (!s) return null;
        a.push(s);
      }
      return a.length ? a.join(",") : null;
    },
    normalizeSingleTarget(t) {
      const r = e.normalizeTargets(t);
      if (!r) return null;
      const [a] = r.split(",").map((n) => n.trim()).filter(Boolean);
      return a || null;
    },
    normalizeTargetPort(t) {
      const r = String(t ?? "").trim();
      if (!r) return "";
      if (!/^\d{1,5}$/.test(r)) return null;
      const a = Number(r);
      return !Number.isInteger(a) || a < 1 || a > 65535 ? null : String(a);
    },
    buildTargetWithPort(t, r = "", a = "") {
      return ps(t, r, a);
    },
    buildDefaultLineName(t) {
      return `线路${Number(t) + 1}`;
    },
    normalizeLineId(t, r = 0) {
      return String(t || "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || `line-${Number(r) + 1}`;
    },
    parseLatencyMs(t) {
      if (t === "" || t === null || t === void 0) return null;
      const r = Number(t);
      return !Number.isFinite(r) || r < 0 ? null : Math.round(r);
    },
    normalizeIsoDatetime(t) {
      if (!t) return "";
      const r = new Date(t);
      return Number.isFinite(r.getTime()) ? r.toISOString() : "";
    },
    normalizeLines(t, r = "", a = "") {
      const n = String(e.normalizeTargets(r) || "").split(",").map((u) => u.trim()).filter(Boolean), s = e.normalizeTargetPort(a), i = s === null ? "" : s, c = Array.isArray(t) && t.length ? t : n.map((u, f) => ({
        id: `line-${f + 1}`,
        name: e.buildDefaultLineName(f),
        target: u
      }));
      if (!c.length) return [];
      const l = [], d = /* @__PURE__ */ new Set();
      return c.forEach((u, f) => {
        const m = u && typeof u == "object" && !Array.isArray(u) ? u : { target: u };
        let p = e.normalizeSingleTarget(e.buildTargetWithPort(m?.target, m?.port, i));
        if (!p && n[f] && (p = e.normalizeSingleTarget(e.buildTargetWithPort(n[f], m?.port, i))), !p) return;
        const g = e.normalizeLineId(m?.id, f);
        let h = g, y = 2;
        for (; d.has(h); )
          h = `${g}-${y}`, y += 1;
        d.add(h), l.push({
          id: h,
          name: String(m?.name || "").trim() || e.buildDefaultLineName(f),
          target: p
        });
      }), l;
    },
    resolveActiveLineId(t, r, a = [], n = "") {
      if (!Array.isArray(r) || !r.length) return "";
      const s = String(t || "").trim();
      if (s && r.some((i) => i.id === s)) return s;
      if (Array.isArray(a)) for (const i of a) {
        if (!i || typeof i != "object" || Array.isArray(i) || i.enabled !== !0) continue;
        const c = String(i.id || "").trim();
        if (c && r.some((u) => u.id === c)) return c;
        const l = e.normalizeSingleTarget(e.buildTargetWithPort(i.target, i.port, n));
        if (!l) continue;
        const d = r.find((u) => u.target === l);
        if (d) return d.id;
      }
      return r[0].id;
    },
    buildLegacyTargetFromLines(t = []) {
      return (Array.isArray(t) ? t : []).map((r) => String(r?.target || "").trim()).filter(Boolean).join(",");
    },
    getActiveNodeLine(t) {
      const r = Array.isArray(t?.lines) ? t.lines : [];
      if (!r.length) return null;
      const a = String(t?.activeLineId || "").trim();
      return r.find((n) => n.id === a) || r[0];
    },
    getOrderedNodeLines(t) {
      const r = Array.isArray(t?.lines) ? t.lines.slice() : [];
      if (r.length <= 1) return r;
      const a = e.getActiveNodeLine(t);
      return a ? [a, ...r.filter((n) => n.id !== a.id)] : r;
    },
    sortNodeLinesByLatency(t = []) {
      return (Array.isArray(t) ? t : []).map((r, a) => ({
        line: r,
        index: a
      })).sort((r, a) => {
        const n = Number.isFinite(r.line?.latencyMs) ? r.line.latencyMs : Number.POSITIVE_INFINITY, s = Number.isFinite(a.line?.latencyMs) ? a.line.latencyMs : Number.POSITIVE_INFINITY;
        return n !== s ? n - s : r.index - a.index;
      }).map((r) => r.line);
    },
    isPingCacheFresh(t, r) {
      const a = Number(t?.latencyMs), n = Date.parse(String(t?.latencyUpdatedAt || ""));
      if (!Number.isFinite(a) || !Number.isFinite(n)) return !1;
      const s = Math.max(0, Number(r) || 0) * 60 * 1e3;
      return s <= 0 ? !1 : H() - n < s;
    }
  };
}
function Mn(o = "") {
  const e = String(o || "").trim().toLowerCase();
  return e.startsWith("emby ") ? "emby" : e.startsWith("mediabrowser ") ? "mediabrowser" : "";
}
function og(o = "", e = "") {
  const t = String(o || "").trim();
  if (!t) return "";
  const r = t.replace(/^[^\s]+\s+/i, "").trim();
  return r ? e === "emby" ? `Emby ${r}` : e === "mediabrowser" ? `MediaBrowser ${r}` : t : t;
}
function Vo(o = "") {
  const e = String(o || "").trim();
  if (!e) return {};
  const t = e.replace(/^[^\s]+\s+/i, "").trim();
  if (!t || !t.includes("=")) return {};
  const r = {}, a = /([A-Za-z][A-Za-z0-9_-]*)\s*=\s*(?:"([^"]*)"|([^,]+))/g;
  let n;
  for (; (n = a.exec(t)) !== null; ) {
    const s = String(n[1] || "").trim().toLowerCase(), i = String(n[2] !== void 0 ? n[2] : n[3] || "").trim();
    !s || !i || Object.prototype.hasOwnProperty.call(r, s) || (r[s] = i);
  }
  return r;
}
var sg = /* @__PURE__ */ new Set([
  "apikey",
  "accesstoken",
  "token",
  "authorization",
  "xembytoken",
  "xembyauthorization",
  "xmediabrowsertoken",
  "xmediabrowserauthorization"
]), ul = /* @__PURE__ */ new Set([
  "deviceid",
  "xembydeviceid",
  "xmediabrowserdeviceid"
]);
function ig(o, e) {
  const t = o instanceof URL ? o : null;
  if (!t || !(e instanceof Set)) return !1;
  for (const r of t.searchParams.keys()) if (e.has(Ma(r))) return !0;
  return !1;
}
function ve(o, e = "") {
  if (o instanceof Headers) return o.get(e) || "";
  const t = String(e || "").trim().toLowerCase();
  for (const [r, a] of _n(o))
    if (String(r || "").trim().toLowerCase() === t)
      return String(a ?? "");
  return "";
}
function cg(o = "") {
  const e = String(o ?? "").replace(/[\r\n]+/g, " ").trim();
  if (!e) return "";
  let t = "";
  for (const r of e) {
    const a = r.charCodeAt(0);
    if (a === 9 || a >= 32 && a <= 126 || a >= 160 && a <= 255) {
      t += r;
      continue;
    }
    t += encodeURIComponent(r);
  }
  return t;
}
function lg(o) {
  const e = new Headers();
  for (const [t, r] of _n(o)) {
    const a = String(t || "").trim();
    if (!a) continue;
    const n = String(r ?? "");
    try {
      e.set(a, n);
    } catch {
      const s = cg(n);
      if (!s) continue;
      try {
        e.set(a, s);
      } catch {
      }
    }
  }
  return e;
}
function qo(o) {
  const e = {
    token: "",
    deviceId: ""
  };
  for (const t of ["X-Emby-Token", "X-MediaBrowser-Token"]) {
    const r = ve(o, t).trim();
    if (r) {
      e.token = r;
      break;
    }
  }
  for (const t of [
    "Authorization",
    "X-Emby-Authorization",
    "X-MediaBrowser-Authorization"
  ]) {
    const r = ve(o, t).trim();
    if (!r) continue;
    const a = Vo(r);
    if (!e.token && a.token && (e.token = a.token), !e.deviceId && a.deviceid && (e.deviceId = a.deviceid), !e.token) {
      const n = /^Bearer\s+(.+)$/i.exec(r);
      n?.[1] && (e.token = n[1].trim());
    }
  }
  if (!e.deviceId) for (const t of ["X-Emby-Device-Id"]) {
    const r = ve(o, t).trim();
    if (r) {
      e.deviceId = r;
      break;
    }
  }
  return e;
}
function ug(o = "") {
  const e = String(o || "").trim();
  if (!e || /^Bearer\s+.+$/i.test(e)) return !0;
  const t = Vo(e);
  return !!String(t.token || "").trim();
}
function Aa(o) {
  const e = qo(o), t = [], r = [], a = jo(ve(o, "Cookie"), pa);
  if (a) {
    for (const u of Ra(a).keys())
      if (Fp(u)) {
        r.push("cookie");
        break;
      }
  }
  for (const u of Yc) {
    const f = ve(o, u).trim();
    f && (ug(f) || t.push(u));
  }
  for (const [u, f] of _n(o)) {
    const m = String(u || "").trim().toLowerCase(), p = String(f || "").trim();
    !m || !p || Zc(m) && t.push(m);
  }
  const n = [...new Set(t)], s = [...new Set(r)], i = !!String(e.token || "").trim() || !!String(e.deviceId || "").trim(), c = n.length > 0, l = s.length > 0, d = !c && !l;
  return {
    canDirect: d,
    reason: d ? "" : "direct_transport_incompatible",
    headerAuthHeaders: n,
    cookieAuthHeaders: s,
    hasQueryAuth: i,
    hasHeaderAuth: c,
    hasCookieAuth: l,
    auth: e
  };
}
function Xo(o, e, t = "") {
  const r = o instanceof URL ? new URL(o.toString()) : new URL(String(o || "")), a = (e && typeof e == "object" && "auth" in e ? e : { auth: qo(e) }).auth || {}, n = Bt(t), s = n === "jellyfin" ? ["ApiKey"] : n === "emby" ? ["api_key"] : ["api_key", "ApiKey"];
  if (a.token && !s.some((i) => r.searchParams.has(i))) for (const i of s) r.searchParams.set(i, a.token);
  return a.deviceId && !ig(r, ul) && r.searchParams.set("DeviceId", a.deviceId), r;
}
function dg(o, e = "") {
  const t = String(e || "").trim().replace(/["\\]/g, "");
  return t ? `${o === "emby" ? "Emby" : "MediaBrowser"} Token="${t}"` : "";
}
var fg = [
  "api_key",
  "ApiKey",
  "X-Emby-Token",
  "X-MediaBrowser-Token"
];
function mg(o = "") {
  for (const e of o) {
    const t = e.codePointAt(0);
    if (t < 32 || t > 255) return !1;
  }
  return !0;
}
function pg(o) {
  if (!(o instanceof URL)) return "";
  for (const e of fg) {
    const t = String(o.searchParams.get(e) || "").trim();
    if (t && mg(t)) return t;
  }
  return "";
}
function qs(o, e = "auto", t = "") {
  const r = Bt(e);
  if (r === "passthrough") return o;
  const a = o.get("Authorization")?.trim() || "", n = o.get("X-Emby-Authorization")?.trim() || "", s = o.get("X-MediaBrowser-Authorization")?.trim() || "", i = Mn(a), c = Mn(s), l = Mn(n), d = r === "emby" ? "emby" : r === "jellyfin" ? "mediabrowser" : "", u = d || "mediabrowser";
  let f = i ? a : c ? s : l ? n : "";
  const m = ve(o, "X-Emby-Token").trim() || ve(o, "X-MediaBrowser-Token").trim() || ve(o, "X-Emby-Auth-Token").trim() || ve(o, "X-MediaBrowser-Auth-Token").trim();
  if (f) {
    if (!Vo(f).token) {
      const p = m || String(t || "").trim();
      if (p) {
        const g = p.replace(/["\\]/g, "");
        f = `${f.replace(/,\s*$/, "")}, Token="${g}"`;
      }
    }
  } else {
    const p = /^Bearer\s+(.+)$/i.exec(a);
    f = dg(u, m || (p ? p[1] : "") || String(t || "").trim());
  }
  return f && (f = og(f, d || i || c || l || ""), o.set("Authorization", f), o.set("X-Emby-Authorization", f), o.delete("X-MediaBrowser-Authorization")), o;
}
function Xs(o, e = {}) {
  if (!(o instanceof Headers)) return o;
  const t = e.dropTokenHeaders !== !1;
  return [
    "Authorization",
    "X-Emby-Authorization",
    "X-MediaBrowser-Authorization"
  ].forEach((r) => o.delete(r)), t && [
    "X-Emby-Token",
    "X-MediaBrowser-Token",
    "X-Emby-Auth-Token",
    "X-MediaBrowser-Auth-Token"
  ].forEach((r) => o.delete(r)), o;
}
function gg() {
  const o = {};
  for (const e of ["direct", "proxy"]) {
    o[e] = {};
    for (const t of [
      "none",
      "query",
      "header",
      "cookie"
    ]) {
      o[e][t] = {};
      for (const r of [
        "none",
        "same_origin",
        "external"
      ]) o[e][t][r] = {
        deliveryMode: e,
        authCarrier: t,
        redirectScope: r,
        clientVisibleRedirect: e === "direct" && r !== "none",
        workerFollowRedirect: e === "proxy",
        reasonCode: e === "direct" ? r === "none" ? "entry_direct" : "client_redirect" : "worker_follow_redirect"
      };
    }
  }
  return Object.freeze(o);
}
var hg = gg();
function Ys(o = {}) {
  const e = o && typeof o == "object" ? o : null, t = String(o?.corsOrigins || ""), r = String(o?.ipBlacklist || ""), a = String(o?.geoAllowlist || ""), n = String(o?.geoBlocklist || ""), s = e ? te.ProxyAccessRuleProfileCache.get(e) : null;
  if (s && s.corsOriginsRaw === t && s.ipBlacklistRaw === r && s.geoAllowlistRaw === a && s.geoBlocklistRaw === n) return s;
  const i = (d, u = !1) => {
    const f = [], m = /* @__PURE__ */ new Set();
    for (const p of d.split(",")) {
      const g = p.trim(), h = u ? g.toUpperCase() : g;
      !h || m.has(h) || (m.add(h), f.push(h));
    }
    return {
      values: f,
      valueSet: m
    };
  }, c = i(t), l = {
    corsOriginsRaw: t,
    ipBlacklistRaw: r,
    geoAllowlistRaw: a,
    geoBlocklistRaw: n,
    corsOrigins: c.values,
    corsOriginSet: c.valueSet,
    ipBlacklist: i(r).valueSet,
    geoAllowlist: i(a, !0).valueSet,
    geoBlocklist: i(n, !0).valueSet
  };
  return e && te.ProxyAccessRuleProfileCache.set(e, l), l;
}
function yg(o = {}, e = {}) {
  const { persistCloudflareDnsRecordsForHost: t } = o;
  return {
    normalizeNode(r, a, n = {}) {
      const s = { ...a };
      let i = !1;
      const c = e.normalizeTargetPort(s.port), l = e.normalizeLines(s.lines, s.target, c || ""), d = e.resolveActiveLineId(s.activeLineId, l, Array.isArray(s.lines) ? s.lines : [], c || ""), u = e.buildLegacyTargetFromLines(l);
      JSON.stringify(l) !== JSON.stringify(Array.isArray(s.lines) ? s.lines : []) && (i = !0), String(s.activeLineId || "") !== d && (i = !0), String(s.target || "") !== u && (i = !0), s.lines = l, s.activeLineId = d, s.target = u, Object.prototype.hasOwnProperty.call(s, "port") && (delete s.port, i = !0), s.secret === void 0 && (s.secret = "", i = !0);
      const f = $r(s.tags, s.tag), m = f[0] || "";
      JSON.stringify(f) !== JSON.stringify(Array.isArray(s.tags) ? s.tags : []) && (i = !0), String(s.tag || "") !== m && (i = !0), s.tags = f, s.tag = m;
      const p = [["server", "Record"].join(""), ["media", "Aggregation"].join("")];
      for (const U of Object.keys(s).filter((E) => p.some((D) => E.startsWith(D))))
        delete s[U], i = !0;
      s.remark === void 0 && (s.remark = "", i = !0), s.tagColor === void 0 && (s.tagColor = "", i = !0), s.remarkColor === void 0 && (s.remarkColor = "", i = !0), s.displayName === void 0 && (s.displayName = "", i = !0);
      const g = s.tmdbAggregationEnabled === !0;
      s.tmdbAggregationEnabled !== g && (i = !0), s.tmdbAggregationEnabled = g;
      const h = nr(s.entryMode);
      String(s.entryMode || "") !== h && (i = !0), s.entryMode = h, h === "host_prefix" && String(s.secret ?? "") !== "" && (s.secret = "", i = !0);
      const y = h === "host_prefix" ? jt(s.hostPrefixCnameTarget) : "";
      String(s.hostPrefixCnameTarget || "") !== y && (i = !0), s.hostPrefixCnameTarget = y;
      const _ = Dr(s.playbackInfoMode);
      String(s.playbackInfoMode || "") !== _ && (i = !0), s.playbackInfoMode = _;
      const S = Bt(s.mediaAuthMode);
      String(s.mediaAuthMode || "") !== S && (i = !0), s.mediaAuthMode = S;
      const T = Nr(s.realClientIpMode);
      String(s.realClientIpMode || "") !== T && (i = !0), s.realClientIpMode = T;
      const b = la(s.hedgeProbePath);
      String(s.hedgeProbePath || "") !== b && (i = !0), s.hedgeProbePath = b;
      const R = Hr(s);
      String(s.mainVideoStreamMode || "") !== R && (i = !0), s.mainVideoStreamMode = R;
      const w = xr(s.routingDecisionMode);
      if (String(s.routingDecisionMode || "") !== w && (i = !0), s.routingDecisionMode = w, Object.prototype.hasOwnProperty.call(s, "wangpanDirectMode") && (delete s.wangpanDirectMode, i = !0), Object.prototype.hasOwnProperty.call(s, "wangpanMode") && (delete s.wangpanMode, i = !0), n && typeof n == "object" && "dropLegacyDirectRouting" in n && n.dropLegacyDirectRouting === !0) for (const U of [...Po, ...xo])
        Object.prototype.hasOwnProperty.call(s, U) && (delete s[U], i = !0);
      const L = e.sanitizeHeaders(s.headers);
      return JSON.stringify(L) !== JSON.stringify(s.headers || {}) && (i = !0), s.headers = L, delete s.videoThrottling, delete s.interceptMs, s.schemaVersion !== 6 && (s.schemaVersion = 6, i = !0), Object.prototype.hasOwnProperty.call(s, "createdAt") && (delete s.createdAt, i = !0), Object.prototype.hasOwnProperty.call(s, "updatedAt") && (delete s.updatedAt, i = !0), {
        data: s,
        changed: i
      };
    },
    buildComparableNodePayload(r = {}, a = {}) {
      if (!$(r)) return null;
      const n = { ...r };
      a.includeName !== !0 && delete n.name, delete n.createdAt, delete n.updatedAt;
      const s = (i) => {
        if (Array.isArray(i)) return i.map((c) => s(c));
        if ($(i)) {
          const c = {};
          for (const l of Object.keys(i).sort()) c[l] = s(i[l]);
          return c;
        }
        return i;
      };
      return s(n);
    },
    areNodePayloadsEquivalent(r = {}, a = {}, n = {}) {
      const s = e.buildComparableNodePayload(r, n), i = e.buildComparableNodePayload(a, n);
      return ee(s) === ee(i);
    },
    buildNodeRecord(r, a, n = {}) {
      let s = a?.headers !== void 0 ? a.headers : n.headers;
      if (typeof s == "string") try {
        s = JSON.parse(s);
      } catch {
        s = {};
      }
      const i = {};
      for (const p of ["proxyMode", "mode"]) {
        const g = a?.[p] !== void 0 ? a[p] : n[p];
        g !== void 0 && (i[p] = String(g || "").trim());
      }
      for (const p of [
        "direct",
        "sourceDirect",
        "directSource",
        "direct2xx"
      ]) a?.[p] !== void 0 ? i[p] = a[p] === !0 : n[p] !== void 0 && (i[p] = n[p] === !0);
      const c = Array.isArray(a?.lines) ? a.lines : a?.target !== void 0 ? [] : n.lines, l = a?.target !== void 0 ? a.target : n.target, d = a?.port !== void 0 ? a.port : n.port, u = e.normalizeLines(c, l, d);
      if (!u.length) return null;
      const f = e.resolveActiveLineId(a?.activeLineId !== void 0 ? a.activeLineId : n.activeLineId, u, Array.isArray(a?.lines) ? a.lines : n.lines, d), m = a?.mainVideoStreamMode !== void 0 ? a.mainVideoStreamMode : a?.wangpanDirectMode !== void 0 ? a.wangpanDirectMode : a?.wangpanMode;
      return e.normalizeNode(r, {
        target: e.buildLegacyTargetFromLines(u),
        lines: u,
        activeLineId: f,
        ...i,
        entryMode: a?.entryMode !== void 0 ? nr(a.entryMode) : nr(n.entryMode),
        hostPrefixCnameTarget: a?.hostPrefixCnameTarget !== void 0 ? a.hostPrefixCnameTarget : n.hostPrefixCnameTarget,
        secret: a?.secret !== void 0 ? a.secret : n.secret || "",
        tag: a?.tag !== void 0 ? a.tag : n.tag || "",
        tags: a?.tags !== void 0 ? a.tags : a?.tag !== void 0 ? [a.tag, ...$r(n.tags, n.tag).filter((p) => p.toLowerCase() !== String(n.tag || "").trim().toLowerCase())] : n.tags,
        remark: a?.remark !== void 0 ? a.remark : n.remark || "",
        tagColor: a?.tagColor !== void 0 ? String(a.tagColor || "").trim() : n.tagColor || "",
        remarkColor: a?.remarkColor !== void 0 ? String(a.remarkColor || "").trim() : n.remarkColor || "",
        displayName: a?.displayName !== void 0 ? String(a.displayName || "").trim() : n.displayName || "",
        tmdbAggregationEnabled: a?.tmdbAggregationEnabled !== void 0 ? a.tmdbAggregationEnabled === !0 : n.tmdbAggregationEnabled === !0,
        playbackInfoMode: a?.playbackInfoMode !== void 0 ? Dr(a.playbackInfoMode) : Dr(n.playbackInfoMode),
        mediaAuthMode: a?.mediaAuthMode !== void 0 ? Bt(a.mediaAuthMode) : Bt(n.mediaAuthMode),
        realClientIpMode: a?.realClientIpMode !== void 0 ? Nr(a.realClientIpMode) : Nr(n.realClientIpMode),
        hedgeProbePath: a?.hedgeProbePath !== void 0 ? la(a.hedgeProbePath) : la(n.hedgeProbePath),
        routingDecisionMode: a?.routingDecisionMode !== void 0 ? xr(a.routingDecisionMode) : xr(n.routingDecisionMode),
        mainVideoStreamMode: m !== void 0 ? cn(m) : Hr(n),
        headers: e.sanitizeHeaders(s),
        schemaVersion: 6
      }).data;
    },
    buildHostPrefixDnsRecordHost(r = "", a = "") {
      const n = String(r || "").trim().toLowerCase(), s = re(a);
      return !s || !La(n) ? "" : `${n}.${s}`;
    },
    buildHostPrefixDnsSyncPlan(r = "", a = null, n = "", s = null, i = "", c = {}) {
      const l = re(i), d = a && Ye(a?.entryMode) ? e.buildHostPrefixDnsRecordHost(r, l) : "", u = s && Ye(s?.entryMode) ? e.buildHostPrefixDnsRecordHost(n, l) : "", f = d ? Wa(a, c.previousConfig || c.config || {}, l) : "", m = u ? Wa(s, c.nextConfig || c.config || {}, l) : "", p = [], g = [];
      return d && d !== u && p.push({
        type: "delete",
        host: d
      }), u && (c.forceUpsert === !0 || u !== d || m !== f) && p.push({
        type: "upsert",
        host: u,
        cnameTarget: m
      }), u && u !== d && g.push({
        type: "delete",
        host: u
      }), d && d !== u ? g.push({
        type: "upsert",
        host: d,
        cnameTarget: f
      }) : d && m !== f && g.push({
        type: "upsert",
        host: d,
        cnameTarget: f
      }), {
        hostRoot: l,
        previousDnsHost: d,
        nextDnsHost: u,
        previousCnameTarget: f,
        nextCnameTarget: m,
        steps: p,
        rollbackSteps: g,
        changed: p.length > 0
      };
    },
    buildPreparedNodeMutation(r = {}, a = {}, n = {}) {
      const s = String(n.nextName || r?.name || "").trim().toLowerCase();
      if (!s) return null;
      const i = String(n.previousName || r?.originalName || s).trim().toLowerCase() || s, c = e.buildNodeRecord(s, r, a);
      if (!c) return null;
      const l = $(a) && Object.keys(a).length ? e.normalizeNode(i, a || {}).data : null, d = i !== s, u = !d && !!l && e.areNodePayloadsEquivalent(l, c);
      return {
        previousName: i,
        previousNode: l,
        nextName: s,
        nextNode: c,
        isRename: d,
        nodeChanged: d || !u,
        isSemanticNoop: u,
        dnsPlan: null
      };
    },
    async upsertHostPrefixDnsRecord(r = "", a = {}) {
      const n = re(r);
      if (!n) return null;
      const s = a.config || await Re(a.env), i = ca(s, a.env), c = jt(a.cnameTarget) || re(i.host);
      return await t({
        env: a.env,
        kv: a.kv,
        config: s,
        host: n,
        mode: "cname",
        desiredRecords: [{
          type: "CNAME",
          content: c,
          ttl: 1,
          proxied: !1
        }],
        requestHost: re(a.requestHost || i.host),
        skipHistory: a.skipHistory === !0,
        includeAllRecords: !1
      });
    },
    async deleteHostPrefixDnsRecord(r = "", a = {}) {
      const n = re(r);
      if (!n) return null;
      const s = ca(a.config || await Re(a.env), a.env), i = String(s.cfZoneId || "").trim(), c = String(s.cfApiToken || "").trim(), l = await Uo(i, c, { scope: "node.host_prefix_dns_delete.zone_lookup" }), d = String(l?.name || "").trim();
      if (d && !ma(n, d)) throw we("INVALID_HOST", "当前子域不在 Cloudflare Zone 下", 400, {
        host: n,
        zoneName: d
      });
      const u = (await vr(i, c, { nameExact: n })).filter((m) => re(m?.name) === n && String(m?.type || "").trim().toUpperCase() === "CNAME");
      if (!u.length) return {
        ok: !0,
        deletedCount: 0,
        host: n
      };
      const f = vc(i, c, n, `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(i)}/dns_records`, u[0] || {
        name: n,
        ttl: 1,
        proxied: !1
      });
      for (const m of u) await f.deleteRecord(m);
      return {
        ok: !0,
        deletedCount: u.length,
        host: n
      };
    },
    async persistHostPrefixDnsSyncPlan(r = {}, a = {}) {
      const n = Array.isArray(r?.steps) ? r.steps : [];
      if (!n.length) return null;
      ca(a.config || await Re(a.env), a.env);
      for (const s of n) {
        if (String(s?.type || "").trim().toLowerCase() === "delete") {
          await e.deleteHostPrefixDnsRecord(s.host, a);
          continue;
        }
        String(s?.type || "").trim().toLowerCase() === "upsert" && await e.upsertHostPrefixDnsRecord(s.host, {
          ...a,
          cnameTarget: s.cnameTarget
        });
      }
      return {
        changed: !0,
        stepCount: n.length
      };
    },
    async applyPreparedNodeMutation(r = {}, a = {}) {
      const n = a.kv;
      if (!n || r?.nodeChanged !== !0) return !1;
      const s = String(r?.previousName || "").trim().toLowerCase(), i = String(r?.nextName || "").trim().toLowerCase();
      return r?.nextNode ? await n.put(`${e.PREFIX}${i}`, JSON.stringify(r.nextNode)) : i && await n.delete(`${e.PREFIX}${i}`), s && i && s !== i && await n.delete(`${e.PREFIX}${s}`), e.invalidateNodeCaches([s, i], {
        invalidateList: !0,
        kv: n
      }), !0;
    },
    async rollbackPreparedNodeMutation(r = {}, a = {}) {
      const n = a.kv;
      if (!n || r?.nodeChanged !== !0) return !1;
      const s = String(r?.previousName || "").trim().toLowerCase(), i = String(r?.nextName || "").trim().toLowerCase();
      return s && (r?.previousNode ? await n.put(`${e.PREFIX}${s}`, JSON.stringify(r.previousNode)) : await n.delete(`${e.PREFIX}${s}`)), i && i !== s && await n.delete(`${e.PREFIX}${i}`), e.invalidateNodeCaches([s, i], {
        invalidateList: !0,
        kv: n
      }), !0;
    },
    async rollbackPreparedNodeMutations(r = [], a = {}) {
      const n = a.kv;
      if (!n) return { rolledBackNodeCount: 0 };
      const s = (Array.isArray(r) ? r : []).filter(Boolean);
      if (!s.length) return { rolledBackNodeCount: 0 };
      const i = s.some((d) => d?.dnsPlan?.changed === !0) ? a.config || await Re(a.env) : null;
      let c = 0;
      const l = [];
      for (let d = s.length - 1; d >= 0; d -= 1) {
        const u = s[d];
        if (u?.dnsPlan?.changed === !0) try {
          await e.persistHostPrefixDnsSyncPlan({ steps: u?.dnsPlan?.rollbackSteps || [] }, {
            ...a,
            config: i,
            skipHistory: !0
          });
        } catch (f) {
          l.push(`dns:${se(f, "rollback_failed")}`);
        }
        if (u?.nodeChanged === !0) try {
          await e.rollbackPreparedNodeMutation(u, a), c += 1;
        } catch (f) {
          l.push(`node:${se(f, "rollback_failed")}`);
        }
      }
      if (a.rebuildIndexes === !0) try {
        await e.rebuildNodeIndexesFromKv(n, {
          ctx: a.ctx,
          syncLegacyIndex: !0
        });
      } catch (d) {
        l.push(`rebuild_indexes:${se(d, "rollback_failed")}`);
      }
      if (l.length > 0) throw new Error(l.join("; "));
      return { rolledBackNodeCount: c };
    },
    async applyPreparedNodeMutations(r = [], a = {}) {
      if (!a.kv) return { mutatedNodeCount: 0 };
      const n = (Array.isArray(r) ? r : []).filter(Boolean);
      if (!n.length) return { mutatedNodeCount: 0 };
      const s = n.some((f) => f?.dnsPlan?.changed === !0) ? await Re(a.env) : null;
      let i = 0;
      const c = [];
      let l = !1, d = !0, u = "";
      try {
        for (const f of n)
          c.push(f), f?.nodeChanged === !0 && (await e.applyPreparedNodeMutation(f, a), i += 1), f?.dnsPlan?.changed === !0 && await e.persistHostPrefixDnsSyncPlan(f.dnsPlan, {
            ...a,
            config: s
          });
        return { mutatedNodeCount: i };
      } catch (f) {
        l = c.length > 0;
        try {
          await e.rollbackPreparedNodeMutations(c, {
            ...a,
            config: s,
            rebuildIndexes: !1
          });
        } catch (m) {
          d = !1, u = se(m, "rollback_failed");
        }
        throw f && typeof f == "object" && (String(f.code || "").trim() || (f.code = "NODE_MUTATION_FAILED"), f.status = De(f.status, 500), f.details = {
          ...$(f.details) ? f.details : {},
          rollbackAttempted: l,
          rollbackSucceeded: d,
          rollbackError: u
        }), f;
      }
    }
  };
}
function Sg(o = {}, e = {}) {
  return {
    async pingTarget(t, r, a = {}) {
      const n = H(), s = "GET", i = (f = {}) => ({
        ok: f.ok === !0,
        reason: String(f.reason || "network_error"),
        statusCode: Number.isInteger(f.statusCode) ? f.statusCode : null,
        elapsedMs: Number.isFinite(f.elapsedMs) ? Math.max(0, Math.round(f.elapsedMs)) : Math.max(0, H() - n),
        methodUsed: f.methodUsed === "HEAD" || f.methodUsed === "GET" ? f.methodUsed : null,
        probePath: String(f.probePath || as)
      }), c = pn(String(t || "").trim());
      if (!c) return i({ reason: "invalid_target" });
      let l = null, d = null;
      const u = Wc(c, [as, Pu]);
      if (!u.length) return i({ reason: "invalid_target" });
      for (const { probePath: f, probeUrl: m } of u) {
        const p = H(), g = new AbortController();
        let h = !1;
        const y = setTimeout(() => {
          h = !0, g.abort();
        }, r);
        let _ = null;
        try {
          const S = await Be(m.toString(), {
            method: s,
            headers: Ao(a?.userAgent),
            signal: g.signal
          }), T = Number(S.status);
          try {
            S.body?.cancel?.();
          } catch {
          }
          const b = T >= 200 && T < 400;
          _ = {
            ok: b,
            reason: b ? T < 300 ? "ok" : "redirect" : "http_error",
            statusCode: T,
            methodUsed: s
          };
        } catch (S) {
          const T = [
            S?.name,
            S?.message,
            S?.cause?.name,
            S?.cause?.message
          ].map((R) => String(R || "")).join(" "), b = /\b(?:tls|ssl|x509|certificate|handshake)\b/i.test(T);
          _ = {
            ok: !1,
            reason: h ? "timeout" : b ? "tls_error" : "network_error",
            statusCode: null,
            methodUsed: s
          };
        } finally {
          clearTimeout(y);
        }
        if (_.probePath = f, _.elapsedMs = H() - p, _.ok) return i(_);
        if (_.statusCode === 403) {
          l || (l = _);
          continue;
        }
        if (d = _, _.statusCode === null) break;
      }
      return i(l ? {
        ...l,
        ok: !0,
        reason: "ok"
      } : d || { reason: "network_error" });
    },
    async getNode(t, r, a) {
      t = String(t).toLowerCase();
      const n = e.getKV(r);
      if (!n) return null;
      const s = Se(n), i = Pe(t, s), c = s.NodeCache.get(t);
      if (c && c.exp > Date.now()) {
        const d = await e.getNodesRevision(n), u = String(c?.nodesRevision || "").trim();
        if (Pe(t, s) === i && (!u || !d || u === d))
          return Za(s.NodeCache, t), c.data;
        Pe(t, s) === i && s.NodeCache.delete(t);
      }
      const l = Pe(t, s);
      return await fn(s.SingleFlightTasks, ct([
        "proxy_node",
        t,
        l
      ]), async () => {
        try {
          const d = await n.get(`${e.PREFIX}${t}`, { type: "json" });
          if (Pe(t, s) !== l) return null;
          if (!d) {
            const g = await e.getNodesSummaryIndex(n, { ctx: a });
            if (Array.isArray(g)) if (g.some((h) => String(h?.name || "").toLowerCase().trim() === t)) {
              const h = e.rebuildNodeIndexesFromKv(n, { ctx: a });
              a ? a.waitUntil(h) : await h;
            } else {
              const h = await e.getNodesRevision(n);
              Pe(t, s) === l && Ie(s.NodeCache, t, {
                data: null,
                exp: Date.now() + k.Defaults.NodeMissCacheTtlMs,
                nodesRevision: h
              }, k.Defaults.NodeCacheMax);
            }
            return null;
          }
          const { data: u, changed: f } = e.normalizeNode(t, d);
          if (Qe(t, u))
            return s.NodeCache.delete(t), s.PlaybackRouteHotCache.delete(t), u;
          if (f) {
            const g = n.put(`${e.PREFIX}${t}`, JSON.stringify(u));
            a ? a.waitUntil(g) : await g;
          }
          const m = e.upsertNodeSummaryEntry(t, u, {
            kv: n,
            ctx: a
          });
          let p = await e.getNodesRevision(n);
          return p ? a ? a.waitUntil(m) : await m : (await m, p = await e.getNodesRevision(n)), Pe(t, s) !== l ? null : (Ie(s.NodeCache, t, {
            data: u,
            exp: Date.now() + k.Defaults.CacheTTL,
            nodesRevision: p
          }, k.Defaults.NodeCacheMax), u);
        } catch {
          return null;
        }
      });
    },
    async getNodeForRead(t, r) {
      t = String(t).toLowerCase();
      const a = e.getKV(r);
      if (!a) return null;
      const n = Se(a), s = Pe(t, n), i = n.NodeCache.get(t);
      if (i?.data === null) n.NodeCache.delete(t);
      else if (i && i.exp > Date.now()) {
        const l = await e.getNodesRevision(a), d = String(i?.nodesRevision || "").trim();
        if (Pe(t, n) === s && (!d || !l || d === l))
          return Za(n.NodeCache, t), i.data;
        Pe(t, n) === s && n.NodeCache.delete(t);
      }
      const c = Pe(t, n);
      try {
        const l = await a.get(`${e.PREFIX}${t}`, { type: "json" });
        if (Pe(t, n) !== c || !l) return null;
        const d = e.normalizeNode(t, l).data;
        if (Qe(t, d))
          return n.NodeCache.delete(t), n.PlaybackRouteHotCache.delete(t), d;
        const u = await e.getNodesRevision(a);
        return Pe(t, n) !== c ? null : (Ie(n.NodeCache, t, {
          data: d,
          exp: Date.now() + k.Defaults.CacheTTL,
          nodesRevision: u
        }, k.Defaults.NodeCacheMax), d);
      } catch {
        return null;
      }
    },
    normalizeAdminActionRequest(t) {
      if (!t || typeof t != "object" || Array.isArray(t)) return null;
      const r = t.payload && typeof t.payload == "object" && !Array.isArray(t.payload) ? { ...t.payload } : null, a = String(t.action ?? r?.action ?? "").trim(), n = t.meta && typeof t.meta == "object" && !Array.isArray(t.meta) ? { ...t.meta } : {};
      return {
        action: a,
        data: r ? {
          ...r,
          action: a,
          meta: n
        } : {
          ...t,
          action: a,
          meta: n
        },
        meta: n
      };
    }
  };
}
function _g(o = {}, e = {}) {
  return {
    ...ng(o, e),
    ...yg(o, e),
    ...Sg(o, e)
  };
}
var Pn = "proxy_logs_fts";
function bg(o = {}) {
  const e = {
    buildResponse(t = {}) {
      return Q(t);
    },
    buildRange(t, r) {
      return {
        startDate: new Date(t).toISOString(),
        endDate: new Date(r).toISOString()
      };
    },
    normalizeRequest(t = {}) {
      const { page: r = 1, pageSize: a = 50, filters: n = {} } = t, s = Math.max(1, parseInt(r, 10) || 1), i = Math.min(200, Math.max(1, parseInt(a, 10) || 50)), c = String(t?.paginationMode || "").trim().toLowerCase(), l = ac(t?.pageCursor), d = c !== "offset" && (s === 1 || !!l), u = (s - 1) * i, f = Date.now(), m = k.Defaults.LogQueryDefaultDays * 24 * 60 * 60 * 1e3, p = (_) => {
        if (!_) return null;
        const S = new Date(String(_)).getTime();
        return Number.isFinite(S) ? S : null;
      }, g = (_) => {
        if (!_) return null;
        const S = /* @__PURE__ */ (/* @__PURE__ */ new Date(String(_) + "T23:59:59.999")).getTime();
        return Number.isFinite(S) ? S : null;
      };
      let h = p(n.startDate), y = g(n.endDate);
      return Number.isFinite(y) || (y = f), Number.isFinite(h) || (h = Math.max(0, y - m)), h > y && ([h, y] = [Math.max(0, y - m), y]), {
        filters: n,
        safePage: s,
        safePageSize: i,
        requestedPageCursor: l,
        useSeekPagination: d,
        offset: u,
        startTs: h,
        endTs: y
      };
    },
    resolveSearch(t = {}, r = {}, a = {}) {
      const n = String(t.searchMode || "").trim().toLowerCase(), s = n === "fts" || n === "like";
      let i = ec(t.searchMode || r.logSearchMode), c = "";
      if (i === "fts" && a.ftsReady !== !0) {
        if (s) return { errorResponse: z("LOG_FTS_NOT_READY", "FTS5 虚拟表尚未初始化，请先点击“初始化日志表”", 400, {
          searchMode: "fts",
          effectiveSearchMode: "fts",
          searchFallbackReason: ""
        }) };
        i = "like", c = "fts_not_ready";
      }
      return {
        effectiveSearchMode: i,
        searchFallbackReason: c
      };
    },
    buildBasePayload(t = {}, r = {}, a = {}) {
      return {
        page: t.safePage,
        pageSize: t.safePageSize,
        paginationMode: t.useSeekPagination ? "seek" : "offset",
        pageCursor: t.requestedPageCursor,
        revisions: { logsRevision: r.revision },
        range: e.buildRange(t.startTs, t.endTs),
        ...a
      };
    },
    buildDisabledResponse(t = {}, r = {}, a = "", n = "") {
      return e.buildResponse(e.buildBasePayload(t, r, {
        logs: [],
        total: 0,
        totalPages: 1,
        searchMode: a,
        effectiveSearchMode: a,
        searchFallbackReason: n,
        totalExact: !0,
        hasPrevPage: !1,
        hasNextPage: !1,
        nextCursor: null,
        disabled: !0
      }));
    },
    buildSuccessResponse(t = {}, r = {}, a = {}) {
      return e.buildResponse(e.buildBasePayload(t, r, {
        logs: a.logs,
        total: a.total,
        totalPages: a.totalPages,
        searchMode: a.searchMode,
        effectiveSearchMode: a.effectiveSearchMode,
        searchFallbackReason: a.searchFallbackReason,
        totalExact: t.useSeekPagination !== !0,
        hasPrevPage: a.hasPrevPage,
        hasNextPage: a.hasNextPage,
        nextCursor: a.nextCursor
      }));
    },
    buildDisplayState(t = {}) {
      return {
        displayClientIp: t.logDisplayClientIp !== !1,
        displayColo: t.logDisplayColo !== !1,
        displayUa: t.logDisplayUa !== !1
      };
    },
    buildSqlPlan(t = {}, r = {}, a = {}, n = "") {
      const { startTs: s, endTs: i } = r, c = e.buildDisplayState(a), l = zd(t.requestGroup), d = Wd(t.statusGroup), u = ["proxy_logs.timestamp >= ?", "proxy_logs.timestamp <= ?"], f = [s, i], m = (b, ...R) => {
        u.push(b), R.length > 0 && f.push(...R);
      }, p = "LOWER(proxy_logs.request_path)", g = String(t.keyword || "").trim();
      let h = !1;
      if (g) {
        const b = k.Defaults.LogKeywordMaxWindowDays * 24 * 60 * 60 * 1e3;
        if (i - s > b) return { errorResponse: z("LOG_QUERY_RANGE_TOO_WIDE", `关键词搜索必须限制在 ${k.Defaults.LogKeywordMaxWindowDays} 天内`, 400, { maxWindowDays: k.Defaults.LogKeywordMaxWindowDays }) };
        if (/^\d{3}$/.test(g)) m("proxy_logs.status_code = ?", Number(g));
        else if (yl(g) || Jo(g)) {
          const R = [], w = [];
          if (c.displayClientIp && (R.push("proxy_logs.client_ip = ?"), w.push(g)), c.displayColo) {
            const L = Jo(g) ? g.toUpperCase() : g;
            R.push("COALESCE(proxy_logs.inbound_colo, proxy_logs.inbound_ip, '') = ?"), w.push(L), R.push("COALESCE(proxy_logs.outbound_colo, proxy_logs.outbound_ip, '') = ?"), w.push(L);
          }
          m(R.length ? `(${R.join(" OR ")})` : "1 = 0", ...w);
        } else if (n === "fts")
          m(`${Pn} MATCH ?`, Jd(g)), h = !0;
        else {
          const R = `%${Pa(g)}%`;
          if (Fe(R) > ns) return { errorResponse: z("LOG_QUERY_KEYWORD_TOO_LONG", "LIKE 搜索关键词过长", 400, { maxPatternBytes: ns }) };
          const w = [
            "proxy_logs.node_name LIKE ? ESCAPE '\\'",
            "proxy_logs.request_path LIKE ? ESCAPE '\\'",
            "proxy_logs.detail_json LIKE ? ESCAPE '\\'"
          ];
          f.push(R, R, R), c.displayClientIp && (w.push("proxy_logs.client_ip LIKE ? ESCAPE '\\'"), f.push(R)), c.displayUa && (w.push("proxy_logs.user_agent LIKE ? ESCAPE '\\'"), f.push(R)), w.push("proxy_logs.error_detail LIKE ? ESCAPE '\\'"), f.push(R), m(`(${w.join(" OR ")})`);
        }
      }
      t.category && m("proxy_logs.category = ?", String(t.category)), l === "playback_info" ? (m("proxy_logs.category = ?", "api"), m(`(${p} LIKE ? ESCAPE '\\' OR ${p} LIKE ? ESCAPE '\\')`, "%/playbackinfo%", "%/sessions/playing%")) : l === "image" ? m("proxy_logs.category = ?", "image") : l === "api" ? (m("proxy_logs.category = ?", "api"), m(`${p} NOT LIKE ? ESCAPE '\\'`, "%/playbackinfo%"), m(`${p} NOT LIKE ? ESCAPE '\\'`, "%/sessions/playing%"), m(`${p} NOT LIKE ? ESCAPE '\\'`, "%/users/authenticate%")) : l === "auth" && (m("proxy_logs.category = ?", "api"), m(`${p} LIKE ? ESCAPE '\\'`, "%/users/authenticate%")), d === "4xx" ? m("proxy_logs.status_code >= ? AND proxy_logs.status_code < ?", 400, 500) : d === "5xx" && m("proxy_logs.status_code >= ? AND proxy_logs.status_code < ?", 500, 600);
      const y = ys(t.deliveryMode || "");
      if (y) {
        const b = "LOWER(COALESCE(CAST(json_extract(proxy_logs.detail_json, '$.deliveryMode') AS TEXT), ''))", R = y === "direct" ? ["Direct=entry_307", "Redirect=client_redirect"] : [
          "Redirect=proxied_follow",
          "Flow=managed",
          "Flow=passthrough"
        ];
        m(`(
          ${b} = ?
          OR (
            COALESCE(proxy_logs.detail_json, '') = ''
            AND (${R.map(() => "proxy_logs.error_detail LIKE ? ESCAPE '\\'").join(" OR ")})
          )
        )`, y, ...R.map((w) => `%${Pa(w)}%`));
      }
      const _ = Gd(t.protocolFailureReason || "");
      if (_ && m(`(
          LOWER(COALESCE(CAST(json_extract(proxy_logs.detail_json, '$.protocolFailureReason') AS TEXT), '')) = ?
          OR (
            COALESCE(proxy_logs.detail_json, '') = ''
            AND proxy_logs.error_detail LIKE ? ESCAPE '\\'
          )
        )`, _, `%${Pa(_)}%`), t.playbackMode) {
        const b = String(t.playbackMode || "").trim();
        ys(b) || m("proxy_logs.error_detail LIKE ? ESCAPE '\\'", `%${Pa(`Playback=${b}`)}%`);
      }
      const S = h ? `FROM proxy_logs INNER JOIN ${Pn} ON ${Pn}.rowid = proxy_logs.id` : "FROM proxy_logs", T = `SELECT proxy_logs.*,
          ${c.displayClientIp ? "NULLIF(proxy_logs.client_ip, '') AS client_ip" : "NULL AS client_ip"},
          ${c.displayColo ? `COALESCE(proxy_logs.inbound_colo, proxy_logs.inbound_ip, proxy_logs.client_ip, '') AS inbound_colo,
        COALESCE(proxy_logs.outbound_colo, proxy_logs.outbound_ip, '') AS outbound_colo` : `'' AS inbound_colo,
        '' AS outbound_colo`},
          ${c.displayUa ? "proxy_logs.user_agent AS user_agent" : "NULL AS user_agent"},
          proxy_logs.detail_json AS detail_json`;
      return {
        searchMode: n,
        useFtsKeyword: h,
        whereClause: u,
        params: f,
        fromClause: S,
        selectClause: T,
        orderByClause: "ORDER BY proxy_logs.timestamp DESC, proxy_logs.id DESC"
      };
    },
    async executeSqlPlan(t, r = {}, a = {}) {
      const { safePage: n, safePageSize: s, requestedPageCursor: i, useSeekPagination: c, offset: l } = r, { whereClause: d = [], params: u = [], fromClause: f = "", selectClause: m = "", orderByClause: p = "", useFtsKeyword: g = !1, searchMode: h = "" } = a, y = "WHERE " + d.join(" AND ");
      let _ = 0, S = 1, T = n > 1, b = !1, R = null, w = [];
      try {
        if (c) {
          const L = d.slice(), U = u.slice();
          i && (L.push("(proxy_logs.timestamp < ? OR (proxy_logs.timestamp = ? AND proxy_logs.id < ?))"), U.push(i.timestamp, i.timestamp, i.id));
          const E = "WHERE " + L.join(" AND "), D = await t.prepare(`${m} ${f} ${E} ${p} LIMIT ?`).bind(...U, s + 1).all(), A = Array.isArray(D?.results) ? D.results : [];
          b = A.length > s, w = b ? A.slice(0, s) : A, R = b ? Qd(w[w.length - 1]) : null, _ = null, S = b ? n + 1 : n;
        } else {
          _ = (await t.prepare(`SELECT COUNT(*) as total ${f} ${y}`).bind(...u).first())?.total || 0;
          const L = await t.prepare(`${m} ${f} ${y} ${p} LIMIT ? OFFSET ?`).bind(...u, s, l).all();
          w = Array.isArray(L?.results) ? L.results : [], S = Math.ceil(_ / s) || 1, T = n > 1, b = n < S;
        }
      } catch (L) {
        const U = String(L?.message || L || "");
        if (g && /no such table:\s*proxy_logs_fts/i.test(U)) return { errorResponse: z("LOG_FTS_NOT_READY", "FTS5 虚拟表尚未初始化，请先点击“初始化日志表”", 400, { searchMode: h }) };
        if (g && /fts5/i.test(U)) return { errorResponse: z("LOG_FTS_QUERY_INVALID", "FTS 查询语法无效，请检查引号、布尔表达式或前缀写法", 400, { detail: U }) };
        throw L;
      }
      return {
        logs: w,
        total: _,
        totalPages: S,
        hasPrevPage: T,
        hasNextPage: b,
        nextCursor: R,
        searchMode: h
      };
    }
  };
  return e;
}
var Eg = "sys_status";
function Tg(o = {}) {
  const { logRepository: e } = o, t = {
    error(r, a, n = null) {
      Ae(r, a, n, "error");
    },
    scheduleFlush(r, a) {
      const n = e.getDB(r), s = ar.get(n);
      if (!n || !a || s.LogFlushPending) return null;
      s.LogFlushPending = !0;
      const i = t.flush(r).finally(() => {
        s.LogFlushTask === i && (s.LogFlushTask = null), s.LogFlushPending = !1, s.LogLastFlushAt = H();
      });
      return s.LogFlushTask = i, a.waitUntil(i), i;
    },
    record(r, a, n) {
      const s = e.getDB(r);
      if (!s || !a) return;
      const i = ar.get(s);
      if (n.requestMethod === "OPTIONS") return;
      const c = $(n.runtimeConfig) ? n.runtimeConfig : ms(r) || {};
      if (i.runtimeConfig = c, c.logEnabled === !1) {
        i.LogQueue.length > 0 && (i.LogQueue.length = 0), i.LogDedupe.clear();
        return;
      }
      const l = Number(n.statusCode) || 0, d = tc(c.logWriteMode);
      if (d === "error" && (l < 400 || l >= 600)) return;
      const u = Qi(n.requestPath, n.category);
      if (u === "image_poster" && c.logWriteImagePoster !== !0 || u === "media_metadata" && c.logWriteMediaMetadata !== !0) return;
      const f = c.logWriteClientIp !== !1, m = c.logWriteColo !== !1, p = c.logWriteUa !== !1, g = (x, O) => String(x || "").slice(0, O), h = g(n.inboundColo || n.inboundIp || n.clientIp || "unknown", 32), y = g(n.outboundColo || n.outboundIp || "", 32), _ = f ? g(n.clientIp || "unknown", 128) : "", S = g(n.nodeName || "unknown", 128) || "unknown", T = g(n.requestPath || "/", 2048) || "/", b = H(), R = Math.max(0, Number(i.LogClearEpochMs) || 0), w = b <= R ? R + 1 : b;
      let L = 0;
      if (n.requestMethod === "HEAD" ? L = 3e5 : (n.category === "segment" || n.category === "prewarm") && (L = 3e4), L > 0) {
        const x = [
          S,
          n.requestMethod || "GET",
          l,
          T,
          _,
          y
        ].join("|"), O = i.LogDedupe.get(x);
        if (O && b - O < L) return;
        if (i.LogDedupe.set(x, b), i.LogDedupe.size > k.Defaults.LogDedupeMax) {
          for (const [N, v] of i.LogDedupe)
            if (i.LogDedupe.has(N) && ((b - v > L || i.LogDedupe.size > k.Defaults.LogDedupeTrimTarget) && i.LogDedupe.delete(N), i.LogDedupe.size <= k.Defaults.LogDedupeTrimTarget))
              break;
        }
      }
      if (i.LogQueue.push({
        timestamp: w,
        nodeName: S,
        requestPath: T,
        requestMethod: n.requestMethod || "GET",
        statusCode: l,
        responseTime: Number(n.responseTime) || 0,
        clientIp: _,
        inboundColo: m ? h : null,
        outboundColo: m ? y : null,
        userAgent: p && g(n.userAgent, 512) || null,
        referer: g(n.referer, 1024) || null,
        category: n.category || "api",
        errorDetail: g(n.errorDetail, 2048) || null,
        detailJson: n.detailJson ? gl(n.detailJson) : null,
        createdAt: new Date(w).toISOString()
      }), i.LogQueue.length > k.Defaults.LogQueueMax) {
        const x = Math.min(k.Defaults.LogQueueOverflowDropCount, i.LogQueue.length);
        i.LogQueue.splice(0, x), e.patchOpsStatus(r, { log: {
          lastOverflowAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastOverflowDropCount: x,
          queueLengthAfterDrop: i.LogQueue.length
        } }, a), console.error(`Log queue overflow, dropping ${x} logs to preserve isolate headroom.`);
      }
      i.LogLastFlushAt || (i.LogLastFlushAt = b);
      const U = Number(c.logWriteDelayMinutes), E = Number(c.logFlushCountThreshold), D = Math.max(0, Number.isFinite(U) ? U * 6e4 : k.Defaults.LogFlushDelayMinutes * 6e4), A = Math.max(1, Number.isFinite(E) ? Math.floor(E) : k.Defaults.LogFlushCountThreshold);
      (d === "error" || i.LogQueue.length >= A || D === 0 || b - i.LogLastFlushAt >= D) && t.scheduleFlush(r, a);
    },
    async flush(r) {
      const a = e.getDB(r), n = ar.get(a);
      if (!a || n.LogQueue.length === 0) return;
      const s = $(n.runtimeConfig) ? n.runtimeConfig : ms(r) || {}, i = Oe(s.scheduleUtcOffsetMinutes);
      if (s.logEnabled === !1) {
        n.LogQueue.length = 0, n.LogDedupe.clear();
        return;
      }
      await e.ensureSysStatusTable(a);
      const c = await e.resolveLogsReadiness({
        db: a,
        kv: e.getKV(r)
      });
      if (c.schemaReady !== !0) {
        const R = n.LogQueue.length;
        n.LogQueue.length = 0, n.LogDedupe.clear(), await e.patchOpsStatus(r, { log: {
          schemaReady: !1,
          ftsReady: c.ftsReady === !0,
          statsReady: c.statsReady === !0,
          lastFlushAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastFlushStatus: "schema_not_ready",
          lastFlushError: "proxy_logs schema not initialized",
          lastFlushErrorAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastFlushRetryCount: 0,
          lastDroppedBatchSize: R,
          lastFlushWrittenBeforeError: 0,
          queueLengthAfterFlush: 0
        } });
        return;
      }
      const l = Number(s.logBatchChunkSize), d = Number(s.logBatchRetryCount), u = Number(s.logBatchRetryBackoffMs), f = le(l, k.Defaults.LogBatchChunkSize, 1, 100), m = le(d, k.Defaults.LogBatchRetryCount, 0, 5), p = le(u, k.Defaults.LogBatchRetryBackoffMs, 0, 5e3), g = e.getOpsStatusDbScope("log");
      let h = 0, y = 0, _ = 0, S = 0;
      const T = /* @__PURE__ */ new Map(), b = (R = []) => {
        const w = e.summarizeStatsHourlyEntries(R, { utcOffsetMinutes: i });
        for (const L of w) {
          const U = `${L.bucketDate}:${L.bucketHour}`, E = T.get(U) || {
            bucketDate: L.bucketDate,
            bucketHour: L.bucketHour,
            requestCount: 0,
            playCount: 0,
            playbackInfoCount: 0
          };
          E.requestCount += Math.max(0, Number(L.requestCount) || 0), E.playCount += Math.max(0, Number(L.playCount) || 0), E.playbackInfoCount += Math.max(0, Number(L.playbackInfoCount) || 0), T.set(U, E);
        }
      };
      try {
        const R = Math.max(n.LogClearEpochMs || 0, await e.getLogClearEpochMs(r));
        for (; n.LogQueue.length > 0; ) {
          const L = n.LogQueue.splice(0, f).filter((A) => (Number(A?.timestamp) || 0) > R);
          if (!L.length) continue;
          _ = L.length, S = 0;
          const U = JSON.stringify(L);
          if (Fe(U) > Vt) throw kc("proxy_logs.batch", U);
          const E = a.prepare(`INSERT INTO proxy_logs (timestamp, node_name, request_path, request_method, status_code, response_time, client_ip, inbound_colo, outbound_colo, user_agent, referer, category, error_detail, detail_json, created_at)
						SELECT
							CAST(json_extract(entry.value, '$.timestamp') AS INTEGER),
							json_extract(entry.value, '$.nodeName'), json_extract(entry.value, '$.requestPath'), json_extract(entry.value, '$.requestMethod'),
							CAST(json_extract(entry.value, '$.statusCode') AS INTEGER), CAST(json_extract(entry.value, '$.responseTime') AS INTEGER),
							json_extract(entry.value, '$.clientIp'), json_extract(entry.value, '$.inboundColo'), json_extract(entry.value, '$.outboundColo'),
							json_extract(entry.value, '$.userAgent'), json_extract(entry.value, '$.referer'), json_extract(entry.value, '$.category'),
							json_extract(entry.value, '$.errorDetail'), json_extract(entry.value, '$.detailJson'), json_extract(entry.value, '$.createdAt')
						FROM json_each(?) AS entry
						WHERE CAST(json_extract(entry.value, '$.timestamp') AS INTEGER) > COALESCE((
							SELECT CAST(json_extract(payload, '$.clearEpochMs') AS INTEGER)
							FROM ${Eg}
							WHERE scope = ?
							LIMIT 1
						), 0)`).bind(U, g);
          let D = 0;
          for (; ; ) try {
            await E.run();
            break;
          } catch (A) {
            if (D >= m) throw A;
            D += 1, y += 1, p > 0 && await li(p * D);
          }
          c.statsReady === !0 && b(L), h += L.length, S += L.length;
        }
        if (c.statsReady === !0 && T.size > 0) try {
          await e.upsertStatsHourlyBuckets(a, [...T.values()], { useBatch: !0 });
        } catch (L) {
          console.warn("upsertStatsHourlyBuckets failed", L);
        }
        const w = {
          schemaReady: !0,
          ftsReady: c.ftsReady === !0,
          statsReady: c.statsReady === !0,
          statsUtcOffsetMinutes: i,
          lastFlushAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastFlushCount: h,
          lastFlushStatus: "success",
          lastFlushRetryCount: y,
          queueLengthAfterFlush: n.LogQueue.length,
          lastFlushError: null,
          lastFlushErrorAt: null,
          lastDroppedBatchSize: 0,
          lastFlushWrittenBeforeError: 0
        };
        h > 0 ? await e.bumpLogsRevision(r, w) : await e.patchOpsStatus(r, { log: w });
      } catch (R) {
        await e.patchOpsStatus(r, { log: {
          schemaReady: c.schemaReady === !0,
          ftsReady: c.ftsReady === !0,
          statsReady: c.statsReady === !0,
          statsUtcOffsetMinutes: i,
          lastFlushErrorAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
          lastFlushStatus: "failed",
          lastFlushError: R?.message || String(R),
          lastFlushRetryCount: y,
          lastDroppedBatchSize: Math.max(0, _ - S),
          lastFlushWrittenBeforeError: h,
          queueLengthAfterFlush: n.LogQueue.length
        } }), console.log("Log flush failed, dropping batch.", R);
      }
    }
  };
  return t;
}
var xn = "sys_status", Qt = "sys_locks", aa = "scheduled", Js = Object.freeze({
  log: "ops_status:log",
  scheduled: "ops_status:scheduled",
  dnsIpPool: "ops_status:dns_ip_pool"
});
function Rg(o = {}) {
  const { bindingPort: e, schemaReadinessPort: t, statusPersistence: r } = o, a = {
    async getOpsStatusPayloadFromDb(n, s) {
      if (!n || !s) return null;
      const i = r.getOpsStatusPayloadCache(n), c = i?.get(String(s));
      if (c && Number(c.expiresAt) > H()) return c.payload;
      if (c && i.delete(String(s)), !await r.ensureSysStatusTable(n)) return null;
      try {
        const l = await n.prepare(`SELECT payload FROM ${xn} WHERE scope = ? LIMIT 1`).bind(s).first(), d = l?.payload ? typeof l.payload == "string" ? JSON.parse(l.payload) : l.payload : null;
        return r.cacheOpsStatusPayload(n, s, d), d;
      } catch {
        return i?.delete(String(s)), null;
      }
    },
    async getOpsStatusPayloadFromDbStrict(n, s) {
      if (!n || !s) throw new Error("D1 status scope is not configured");
      if (!await r.ensureSysStatusTable(n)) {
        const c = /* @__PURE__ */ new Error("D1 sys_status table is unavailable");
        throw c.code = "D1_COMPATIBILITY_REQUIRED", c.status = 409, c;
      }
      const i = await n.prepare(`SELECT payload FROM ${xn} WHERE scope = ? LIMIT 1`).bind(s).first();
      return i?.payload ? typeof i.payload == "string" ? JSON.parse(i.payload) : i.payload : null;
    },
    async putOpsStatusPayloadToDb(n, s, i, c) {
      if (!n || !s || !i || typeof i != "object" || !await r.ensureSysStatusTable(n)) return !1;
      const l = JSON.stringify(i);
      return Fe(l) > Vt ? !1 : (await n.prepare(`INSERT INTO ${xn} (scope, payload, updated_at) VALUES (?, ?, ?)
		ON CONFLICT(scope) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`).bind(s, l, Number(c) || H()).run(), r.cacheOpsStatusPayload(n, s, i), !0);
    },
    getOpsStatusSectionEntries() {
      return Object.entries(Js);
    },
    async getOpsStatusRootFromStores(n) {
      const s = n?.db || null;
      if (!s) return {};
      const i = await a.getOpsStatusPayloadFromDb(s, r.getOpsStatusDbScope()), c = i && typeof i == "object" ? i : {}, l = r.getOpsStatusShadowPatch(s);
      return Ve(c, l && typeof l == "object" ? l : {});
    },
    async getOpsStatusRoot(n) {
      return a.getOpsStatusRootFromStores(r.resolveOpsStatusStores(n));
    },
    async getOpsStatusSectionFromStores(n, s) {
      const i = n?.db || null;
      if (!s) return {};
      if (!Js[s]) return {};
      const c = async () => {
        if (!i) return null;
        const f = await a.getOpsStatusPayloadFromDb(i, r.getOpsStatusDbScope(s));
        return f && typeof f == "object" ? f : null;
      }, [l, d] = await Promise.all([a.getOpsStatusRootFromStores(n), c()]), u = l && typeof l[s] == "object" ? l[s] : {};
      return Ve(d && typeof d == "object" ? d : {}, u);
    },
    async getOpsStatusSection(n, s) {
      return a.getOpsStatusSectionFromStores(r.resolveOpsStatusStores(n), s);
    },
    async getOpsStatusFromStores(n) {
      const s = n?.db || null;
      if (!s) return {};
      const i = await a.getOpsStatusRootFromStores(n), c = i && typeof i == "object" ? { ...i } : {};
      let l = typeof c.updatedAt == "string" ? c.updatedAt : "";
      const d = await Promise.all(a.getOpsStatusSectionEntries().map(async ([u]) => {
        const f = await a.getOpsStatusPayloadFromDb(s, r.getOpsStatusDbScope(u)), m = i && typeof i[u] == "object" ? i[u] : {};
        return [u, Ve(f && typeof f == "object" ? f : {}, m)];
      }));
      for (const [u, f] of d)
        !f || typeof f != "object" || Object.keys(f).length && (c[u] = Ve(c[u], f), typeof f.updatedAt == "string" && f.updatedAt > l && (l = f.updatedAt));
      return l && (c.updatedAt = l), c;
    },
    async getOpsStatus(n) {
      return a.getOpsStatusFromStores(r.resolveOpsStatusStores(n));
    },
    getLogClearEpochMsFromStatus(n) {
      const s = Number(n?.clearEpochMs);
      return Number.isFinite(s) && s > 0 ? Math.floor(s) : 0;
    },
    async getLogClearEpochMs(n) {
      const s = await a.getOpsStatusSection(n, "log"), i = a.getLogClearEpochMsFromStatus(s), c = ar.get(r.resolveOpsStatusStores(n).db);
      return i > c.LogClearEpochMs && (c.LogClearEpochMs = i), i;
    },
    async patchOpsStatus(n, s, i = null) {
      const c = r.resolveOpsStatusStores(n);
      if (!c.db) return {};
      const l = s && typeof s == "object" ? s : {}, d = Object.keys(l);
      if (!d.length) return await a.getOpsStatusFromStores(c);
      const u = r.buildOpsStatusRootPatch(l);
      if (!Object.keys(u).length) return await a.getOpsStatusFromStores(c);
      const f = r.getOpsStatusShadowState(c.db);
      f && (f.pendingPatch = Ve(f.pendingPatch && typeof f.pendingPatch == "object" ? f.pendingPatch : {}, u));
      const m = async () => await r.flushOpsStatusShadow(c, { patchKeys: d }), p = Promise.resolve(We.OpsStatusWriteChain).catch((g) => {
        Ae("ops_status.write_chain.previous_failure", g, { patchKeys: d });
      }).then(m);
      return We.OpsStatusWriteChain = p.catch((g) => {
        Ae("ops_status.write_chain.current_failure", g, { patchKeys: d });
      }), i ? i.waitUntil(p) : await p, p;
    },
    resolveScheduledLeaseStores(n) {
      return n && typeof n == "object" && !Array.isArray(n) && ("db" in n || "kv" in n) ? {
        db: n.db || null,
        kv: n.kv || null
      } : n && typeof n.prepare == "function" ? {
        db: n,
        kv: null
      } : n && typeof n.get == "function" ? {
        db: null,
        kv: n
      } : {
        db: e.getDB(n),
        kv: e.getKV(n)
      };
    },
    async ensureScheduledLeaseTable(n) {
      if (!n || typeof n.prepare != "function") return !1;
      if (t.isD1SchemaReadyCached(n, "scheduledLeaseTable")) return !0;
      let s = J.ScheduledLeaseDbReady.get(n);
      s || (s = (async () => {
        try {
          return await n.prepare(`CREATE TABLE IF NOT EXISTS ${Qt} (scope TEXT PRIMARY KEY, token TEXT NOT NULL, owner TEXT NOT NULL, acquired_at INTEGER NOT NULL, renewed_at INTEGER, expires_at INTEGER NOT NULL)`).run(), await n.prepare(`CREATE INDEX IF NOT EXISTS idx_sys_locks_expires_at ON ${Qt} (expires_at DESC)`).run(), t.markD1SchemaReady(n, "scheduledLeaseTable"), !0;
        } catch (i) {
          return console.warn("scheduled lease table init failed", i), !1;
        }
      })(), J.ScheduledLeaseDbReady.set(n, s));
      try {
        return await s;
      } finally {
        J.ScheduledLeaseDbReady.get(n) === s && J.ScheduledLeaseDbReady.delete(n);
      }
    },
    normalizeScheduledLeaseLock(n, s = "") {
      if (!n || typeof n != "object") return null;
      const i = String(n.token || "").trim();
      if (!i) return null;
      const c = String(n.owner || "scheduled").trim() || "scheduled", l = Number(n.expiresAt ?? n.expires_at ?? 0), d = Number(n.acquiredAtMs ?? n.acquired_at), u = Number(n.renewedAtMs ?? n.renewed_at);
      return {
        token: i,
        owner: c,
        acquiredAt: typeof n.acquiredAt == "string" ? n.acquiredAt : Number.isFinite(d) && d > 0 ? new Date(d).toISOString() : "",
        renewedAt: typeof n.renewedAt == "string" ? n.renewedAt : Number.isFinite(u) && u > 0 ? new Date(u).toISOString() : "",
        expiresAt: Number.isFinite(l) ? l : 0,
        backend: s || String(n.backend || "").trim() || ""
      };
    },
    async getScheduledLeaseLockFromDb(n, s = aa) {
      if (!n || !await a.ensureScheduledLeaseTable(n)) return null;
      try {
        const i = await n.prepare(`SELECT token, owner, acquired_at, renewed_at, expires_at FROM ${Qt} WHERE scope = ? LIMIT 1`).bind(String(s || aa)).first();
        return a.normalizeScheduledLeaseLock(i, "d1");
      } catch {
        return null;
      }
    },
    async tryAcquireScheduledLeaseWithDb(n, s = {}) {
      if (!n) return {
        acquired: !1,
        reason: "db_unavailable",
        backend: "d1"
      };
      if (!await a.ensureScheduledLeaseTable(n)) return {
        acquired: !1,
        reason: "db_init_failed",
        backend: "d1"
      };
      const i = H(), c = Math.max(k.Defaults.ScheduledLeaseMinMs, Number(s.leaseMs) || k.Defaults.ScheduledLeaseMs), l = String(s.token || `${i}-${Math.random().toString(36).slice(2, 10)}`), d = String(s.owner || "scheduled"), u = String(s.scope || aa), f = i + c;
      try {
        await n.prepare(`INSERT INTO ${Qt} (scope, token, owner, acquired_at, renewed_at, expires_at)
          VALUES (?, ?, ?, ?, NULL, ?)
          ON CONFLICT(scope) DO UPDATE SET
            token = excluded.token,
            owner = excluded.owner,
            acquired_at = excluded.acquired_at,
            renewed_at = NULL,
            expires_at = excluded.expires_at
          WHERE ${Qt}.expires_at <= ?`).bind(u, l, d, i, f, i).run();
        const m = await a.getScheduledLeaseLockFromDb(n, u);
        return m && m.token === l ? {
          acquired: !0,
          leaseMs: c,
          backend: "d1",
          lock: m
        } : m && Number(m.expiresAt) > i ? {
          acquired: !1,
          reason: "lease_held",
          backend: "d1",
          lock: m
        } : {
          acquired: !1,
          reason: "lease_contended",
          backend: "d1",
          lock: m
        };
      } catch (m) {
        return console.warn("scheduled lease acquire failed", m), {
          acquired: !1,
          reason: "db_unavailable",
          backend: "d1"
        };
      }
    },
    async tryAcquireScheduledLease(n, s = {}) {
      const i = a.resolveScheduledLeaseStores(n);
      return i.db ? await a.tryAcquireScheduledLeaseWithDb(i.db, s) : {
        acquired: !1,
        reason: "db_not_configured",
        backend: "d1"
      };
    },
    async renewScheduledLeaseWithDb(n, s, i, c = {}) {
      if (!n || !s || !await a.ensureScheduledLeaseTable(n)) return null;
      const l = H(), d = Math.max(k.Defaults.ScheduledLeaseMinMs, Number(i) || k.Defaults.ScheduledLeaseMs), u = String(c.scope || aa);
      try {
        await n.prepare(`UPDATE ${Qt}
          SET owner = ?, renewed_at = ?, expires_at = ?
          WHERE scope = ? AND token = ?`).bind(String(c.owner || "scheduled"), l, l + d, u, String(s)).run();
        const f = await a.getScheduledLeaseLockFromDb(n, u);
        return f && f.token === String(s) ? f : null;
      } catch {
        return null;
      }
    },
    async renewScheduledLease(n, s, i, c = {}) {
      const l = a.resolveScheduledLeaseStores(n);
      return l.db ? await a.renewScheduledLeaseWithDb(l.db, s, i, c) : null;
    },
    async releaseScheduledLeaseWithDb(n, s, i = {}) {
      if (!n || !s || !await a.ensureScheduledLeaseTable(n)) return !1;
      const c = String(i.scope || aa);
      try {
        return await n.prepare(`DELETE FROM ${Qt} WHERE scope = ? AND token = ?`).bind(c, String(s)).run(), !0;
      } catch {
        return !1;
      }
    },
    async releaseScheduledLease(n, s, i = {}) {
      const c = a.resolveScheduledLeaseStores(n);
      return c.db ? await a.releaseScheduledLeaseWithDb(c.db, s, i) : !1;
    }
  };
  return a;
}
function lr(o, e = "") {
  const t = String(o || "request_aborted").trim() || "request_aborted", r = new Error(e ? `${t}_${e}` : t);
  return t === "client_aborted" ? r.code = "CLIENT_ABORTED" : t === "downstream_cancelled" ? r.code = "DOWNSTREAM_CANCELLED" : t === "stream_idle_timeout" ? r.code = "STREAM_IDLE_TIMEOUT" : r.code = "REQUEST_ABORTED", r;
}
function dl(o) {
  const e = new AbortController();
  let t = "", r = null, a = null, n = null;
  const s = /* @__PURE__ */ new Set(), i = (l) => {
    if (s.size)
      for (const d of [...s]) try {
        d(l);
      } catch {
      }
  }, c = (l = "request_aborted") => {
    const d = String(l || "request_aborted").trim() || "request_aborted";
    if (t || (t = d), a && !a.signal.aborted) try {
      a.abort(t);
    } catch {
    }
    if (!e.signal.aborted) try {
      e.abort(t);
    } catch {
    }
    i(t);
  };
  if (o && typeof o.addEventListener == "function") {
    const l = () => c("client_aborted");
    o.aborted ? l() : (o.addEventListener("abort", l, { once: !0 }), r = () => o.removeEventListener("abort", l));
  }
  return {
    signal: e.signal,
    abort: c,
    isAborted() {
      return e.signal.aborted === !0 || !!t;
    },
    getAbortReason() {
      return t;
    },
    onAbort(l) {
      if (typeof l != "function") return () => {
      };
      if (t || e.signal.aborted) {
        try {
          l(t || "request_aborted");
        } catch {
        }
        return () => {
        };
      }
      return s.add(l), () => s.delete(l);
    },
    setActiveFetchController(l) {
      if (n && (n(), n = null), a = l || null, !l) return () => {
      };
      const d = () => {
        try {
          l.abort(t || "request_aborted");
        } catch {
        }
      };
      return t || e.signal.aborted ? d() : e.signal.addEventListener("abort", d, { once: !0 }), n = () => {
        e.signal.removeEventListener("abort", d), a === l && (a = null);
      }, () => {
        if (!n) return;
        const u = n;
        n = null, u();
      };
    },
    dispose() {
      if (r && (r(), r = null), n) {
        const l = n;
        n = null, l();
      } else a = null;
      s.clear();
    }
  };
}
function Ag(o = []) {
  const e = new AbortController(), t = [], r = (a = "linked_abort") => {
    if (!e.signal.aborted)
      try {
        e.abort(a);
      } catch {
      }
  };
  for (const a of Array.isArray(o) ? o : [o]) {
    if (!a || typeof a.addEventListener != "function") continue;
    const n = () => r(a.reason || "linked_abort");
    if (a.aborted) {
      n();
      continue;
    }
    a.addEventListener("abort", n, { once: !0 }), t.push(() => a.removeEventListener("abort", n));
  }
  return {
    signal: e.signal,
    abort(a = "linked_abort") {
      r(a);
    },
    dispose() {
      for (const a of t.splice(0)) try {
        a();
      } catch {
      }
    }
  };
}
async function Cg(o, e, t = null) {
  return await new Promise((r, a) => {
    let n = !1, s = null, i = () => {
    };
    const c = (d) => {
      if (!n) {
        n = !0, s !== null && clearTimeout(s);
        try {
          i();
        } catch {
        }
        r(d);
      }
    }, l = (d) => {
      if (!n) {
        n = !0, s !== null && clearTimeout(s);
        try {
          i();
        } catch {
        }
        a(d);
      }
    };
    t?.onAbort && (i = t.onAbort((d) => l(lr(d)))), Number(e) > 0 && (s = setTimeout(() => c({
      timedOut: !0,
      value: null
    }), Math.max(0, Number(e) || 0))), Promise.resolve(o).then((d) => c({
      timedOut: !1,
      value: d
    }), l);
  });
}
async function wg(o, e = null) {
  const t = Math.max(0, Number(o) || 0);
  if (!(t <= 0))
    return await new Promise((r, a) => {
      let n = !1, s = () => {
      };
      const i = setTimeout(() => {
        if (!n) {
          n = !0;
          try {
            s();
          } catch {
          }
          r();
        }
      }, t);
      e?.onAbort && (s = e.onAbort((c) => {
        n || (n = !0, clearTimeout(i), a(lr(c)));
      }));
    });
}
function Lg(o = {}, e = {}) {
  return {
    async tryServeMetadataCache(t) {
      if (!t.metadataCache || !t.metadataCacheKey) return null;
      try {
        const r = zp(t.metadataCacheKey, t.request);
        if (!r) return null;
        const a = await t.metadataCache.match(r);
        if (!a) return null;
        const n = e.buildProxyResponseHeaders(a, t.request, t.dynamicCors, t.finalOrigin, t.requestTraits, {
          enableH3: t.enableH3,
          forceH1: t.forceH1,
          imageCacheMaxAge: t.imageCacheMaxAge
        });
        return e.recordAccessLog(t, {
          statusCode: a.status,
          category: e.classifyProxyLogCategory(t.requestTraits),
          errorDetail: e.appendLogDiagnosticDetail(e.extractProxyErrorDetail(a), e.buildStreamDiagnosticDetail(t, a, {
            flow: "cache_hit",
            source: "worker_cache",
            cacheStatus: "WORKER_CACHE"
          })),
          detailJson: e.buildStructuredLogDetail(t, { statusCode: a.status }, {
            deliveryMode: "proxy",
            redirectMode: "worker_cache",
            decisionReason: "worker_cache_hit",
            protocolFailureReason: Number(a.status) >= 400 ? e.classifyProtocolFailureReason(e.extractProxyErrorDetail(a) || a.statusText || "", { upstreamStatus: a.status }) : null,
            upstreamStatus: a.status
          }),
          outboundColo: ""
        }), new Response(a.body, {
          status: a.status,
          statusText: a.statusText,
          headers: n
        });
      } catch {
        return null;
      }
    },
    async resolveEarlyResponse(t) {
      if (t.requestMethod === "OPTIONS") return e.buildOptionsResponse(t);
      const r = e.evaluateFirewall(t.currentConfig, t.clientIp, t.country, t.finalOrigin);
      if (r) return r;
      const a = e.applyRateLimit(t.currentConfig, t.clientIp, t.requestTraits, t.startTime, t.finalOrigin);
      return a || await e.tryServeMetadataCache(t);
    },
    shouldGuardClientDirectForRequest(t = {}, r = {}) {
      return String(r?.action || "").trim().toUpperCase() !== "DIRECT" || String(r?.reason || "").trim() === "stream_body_direct" ? !1 : t?.isBigStream === !0 || t?.isManifest === !0 || t?.isSegment === !0;
    },
    enforceStrictClientDirectAuthPolicy(t, r, a, n = {}) {
      if (!e.shouldGuardClientDirectForRequest(t?.requestTraits, r)) return r;
      const s = a?.clientRedirectAuthPolicy || Aa(a?.newHeaders);
      return a && typeof a == "object" && (a.clientRedirectAuthPolicy = s), t.directRedirectAuthReason = s.reason || "", r;
    },
    createDirectTransportIncompatibleError(t, r = {}) {
      const a = /* @__PURE__ */ new Error("direct_transport_incompatible");
      return a.code = "DIRECT_TRANSPORT_INCOMPATIBLE", a.redirectTrace = r.redirectTrace || t?.redirectTrace || null, a;
    },
    async maybeProbeEntryDirectRangeRedirectResponse(t, r, a, n) {
      if (typeof a != "function") return null;
      const s = e.resolveEntryDirectTargetUrl(t, r);
      let i = null, c = () => {
      };
      const l = dl(t?.request?.signal);
      try {
        const h = await e.performFetchWithTimeout(s, a, {
          method: "HEAD",
          timeoutMs: t.upstreamTimeoutMs,
          requestLifecycle: l
        });
        i = h.response, c = typeof h.releaseFetchController == "function" ? h.releaseFetchController : () => {
        };
      } catch {
        return c(), l.dispose(), null;
      }
      if (!(i.status >= 300 && i.status < 400)) {
        try {
          i.body?.cancel?.();
        } catch {
        }
        return c(), l.dispose(), null;
      }
      const d = Ta(i.headers.get("Location"), s);
      if (!d) {
        try {
          i.body?.cancel?.();
        } catch {
        }
        return c(), l.dispose(), null;
      }
      const u = t.playbackRelayTargetUrl instanceof URL ? t.playbackRelayTargetUrl : r, f = Ia(d, u).proxyPath || (d.origin === u?.origin ? d.pathname : null);
      if (f && ga(f)) {
        const h = e.createRedirectTrace(t.requestUrl);
        e.recordRedirectTraceHop(h, i.status, d, {
          isSameOriginRedirect: !0,
          traceAction: "blocked_web"
        }), e.finalizeRedirectTrace(h, {
          terminalMode: "web_proxy_disabled",
          finalStatus: 404,
          finalHost: d.hostname || ""
        }), t.redirectTrace = h, t.defaultOutboundColo = Ga(i) || "";
        try {
          i.body?.cancel?.();
        } catch {
        }
        return c(), l.dispose(), e.recordAccessLog(t, e.buildDirectAccessLogPayload(t, 404, t.defaultOutboundColo, {
          redirectTrace: h,
          decisionReason: "web_proxy_disabled"
        })), Sn(t.requestMethod, t.dynamicCors);
      }
      const m = e.buildClientVisibleRedirectUrl(d, t.playbackRelayTargetUrl || r, t.nodeName, t.nodeKey, t.requestUrl, { entryMode: t.entryMode }) || d, p = e.createRedirectTrace(t.requestUrl);
      e.recordRedirectTraceHop(p, i.status, d, {
        isSameOriginRedirect: d.origin === s.origin,
        traceAction: "direct",
        dataPlaneMode: n?.dataPlaneMode
      }), e.finalizeRedirectTrace(p, {
        terminalMode: "client_redirect",
        finalStatus: i.status,
        finalHost: String(d.hostname || "").trim().toLowerCase()
      }), t.redirectTrace = p, t.defaultOutboundColo = Ga(i) || "";
      const g = e.buildProxyResponseHeaders(i, t.request, t.dynamicCors, t.finalOrigin, t.requestTraits, {
        enableH3: t.enableH3,
        forceH1: t.forceH1,
        imageCacheMaxAge: t.imageCacheMaxAge
      });
      return e.applyProxyRedirectHeaders(g, i, r, t.nodeName, t.nodeKey, m, s, {
        linkVariant: t.linkVariant,
        entryMode: t.entryMode
      }), e.recordAccessLog(t, e.buildDirectAccessLogPayload(t, i.status, t.defaultOutboundColo || "", {
        directRedirectUrl: m,
        redirectTrace: p,
        decisionReason: String(n?.reason || n?.traceLabel || "").trim()
      })), c(), l.dispose(), new Response(t.requestMethod === "HEAD" ? null : i.body, {
        status: i.status,
        statusText: i.statusText,
        headers: g
      });
    },
    async maybeBuildEntryDirectResponse(t, r, a = null, n = null) {
      if (t?.forceWorkerProxy === !0) return null;
      const s = e.enforceStrictClientDirectAuthPolicy(t, t.entryRoutingDecision, a, {
        redirectStatus: t.entryRoutingDecision?.redirectStatus || 307,
        redirectMethod: t.requestMethod
      });
      if (t.entryRoutingDecision = s, s?.phase !== "entry" || s?.action !== "DIRECT") return null;
      const i = (Ze(r[0]) ? r[0] : null)?.targetUrl || null;
      if (!(i instanceof URL)) return null;
      const c = a?.clientRedirectAuthPolicy || Aa(a?.newHeaders || t.request.headers);
      if (a && typeof a == "object" && (a.clientRedirectAuthPolicy = c), t?.requestTraits?.isBigStream === !0 && t?.requestTraits?.rangeHeader && c.hasQueryAuth !== !0 && c.hasHeaderAuth !== !0 && c.hasCookieAuth !== !0) {
        const f = await e.maybeProbeEntryDirectRangeRedirectResponse(t, i, n, s);
        if (f) return f;
      }
      if (c.canDirect !== !0)
        throw t.directRedirectAuthReason = c.reason || "direct_transport_incompatible", e.createDirectTransportIncompatibleError(t);
      const l = Xo(e.resolveEntryDirectTargetUrl(t, i), c, t.effectiveMediaAuthMode), d = new Response(null, {
        status: 307,
        statusText: "Temporary Redirect"
      }), u = e.buildProxyResponseHeaders(d, t.request, t.dynamicCors, t.finalOrigin, t.requestTraits, {
        enableH3: t.enableH3,
        forceH1: t.forceH1,
        imageCacheMaxAge: t.imageCacheMaxAge
      });
      return e.applyProxyRedirectHeaders(u, d, i, t.nodeName, t.nodeKey, l, l, {
        linkVariant: t.linkVariant,
        entryMode: t.entryMode
      }), e.recordAccessLog(t, e.buildDirectAccessLogPayload(t, 307, "")), new Response(null, {
        status: 307,
        statusText: "Temporary Redirect",
        headers: u
      });
    },
    createBuildFetchOptions(t, r) {
      const { requestMethod: a, requestTraits: n, protocolFallback: s } = t, { newHeaders: i, adminCustomHeaders: c, preparedBody: l, preparedBodyMode: d } = r, u = r?.transportTemplate || null, f = Array.isArray(u?.baseHeaderEntries) ? u.baseHeaderEntries : [...i.entries()], m = u ? u.adminCustomHasOrigin === !0 : c.has("origin"), p = u ? u.adminCustomHasReferer === !0 : c.has("referer"), g = u ? u.hasOriginHeader === !0 : i.has("Origin"), h = u ? u.hasRefererHeader === !0 : i.has("Referer"), y = String(u?.refererOrigin || "").trim(), _ = String(u?.refererPathAndSearch || "/") || "/";
      return async (S, T = {}) => {
        const b = new Headers(f), R = (S instanceof URL ? S : new URL(String(S))).origin, w = T.method || a, L = T.bodyMode || d, U = T.body !== void 0 ? T.body : l, E = T.isExternalRedirect === !0, D = T.protocolFallbackRetry === !0, A = T.stripAuthOnProtocolFallback === !0;
        if (g && !m && b.set("Origin", R), h && !p)
          if (u) y ? y !== R && b.set("Referer", `${R}${_}`) : b.set("Referer", R + "/");
          else try {
            const O = new URL(b.get("Referer") || "");
            if (O.origin !== R) {
              const N = new URL(`${O.pathname || "/"}${O.search || ""}`, R);
              b.set("Referer", N.toString());
            }
          } catch {
            b.set("Referer", R + "/");
          }
        if (E) {
          const O = [];
          if (c instanceof Set) for (const N of c) {
            if (N === "cookie") continue;
            const v = i.get(N);
            v !== null && O.push([N, v]);
          }
          Xs(b), b.delete("Cookie"), u?.adminCookie && b.set("Cookie", u.adminCookie);
          for (const [N, v] of O) b.set(N, v);
          m || b.delete("Origin"), p || b.delete("Referer");
        }
        D && s && (A && Xs(b), b.set("Connection", "keep-alive")), (n.isBigStream || n.isSmartStrmMedia || n.isManifest || n.isSegment) && n.rangeHeader && !b.has("Range") && b.set("Range", n.rangeHeader), (n.isBigStream || n.isSmartStrmMedia || n.isManifest || n.isSegment) && n.ifRangeHeader && !b.has("If-Range") && b.set("If-Range", n.ifRangeHeader), (w === "GET" || w === "HEAD") && b.delete("Content-Length");
        const x = {
          method: w,
          headers: b,
          redirect: "manual"
        };
        return n.isMetadataCacheable && (x.cache = "no-store"), w !== "GET" && w !== "HEAD" && (L === "buffered" && U !== null && U !== void 0 ? x.body = U.slice(0) : L === "stream" && (x.body = U)), x;
      };
    }
  };
}
function Ng(o = {}, e = {}) {
  return {
    async executeUpstreamFlow(t, r, a) {
      const n = /* @__PURE__ */ new Set([
        500,
        502,
        503,
        504,
        522,
        523,
        524,
        525,
        526,
        530
      ]), s = t.requestTraits?.isSmartStrmMedia === !0 ? {
        mode: "proxy",
        forceVideoDirect: !1,
        forceVideoProxy: !1
      } : Nd(t.node, t.currentConfig), i = e.createRedirectTrace(t.requestUrl), c = Cd(t.requestMethod, t.requestTraits, { playbackRelayTargetUrl: t.playbackRelayTargetUrl });
      t.redirectTrace = i;
      const l = t.playbackRelayTargetUrl ? await e.fetchAbsoluteWithRetryLoop({
        execution: t,
        absoluteUrl: t.playbackRelayTargetUrl,
        buildFetchOptions: a,
        fetchOptions: {
          method: t.requestMethod,
          bodyMode: r.preparedBodyMode,
          body: r.preparedBody,
          isExternalRedirect: !0
        },
        retryableStatuses: n,
        protocolFallback: t.protocolFallback,
        preparedBodyMode: r.preparedBodyMode,
        allowAutomaticRetry: r.allowAutomaticRetry,
        stripAuthOnProtocolFallback: t.requestTraits.canStripAuthOnProtocolFallback,
        upstreamTimeoutMs: t.upstreamTimeoutMs,
        maxExtraAttempts: r.allowAutomaticRetry && r.allowSameTargetRetry !== !1 ? t.upstreamRetryAttempts : 0,
        isRetry: !1,
        requestLifecycle: t.requestLifecycle
      }) : await e.fetchUpstreamWithRetryLoop({
        execution: t,
        retryTargetRecords: r.retryTargetRecords,
        proxyPath: t.proxyPath,
        requestUrl: t.requestUrl,
        buildFetchOptions: a,
        retryableStatuses: n,
        protocolFallback: t.protocolFallback,
        preparedBodyMode: r.preparedBodyMode,
        allowAutomaticRetry: r.allowAutomaticRetry,
        stripAuthOnProtocolFallback: t.requestTraits.canStripAuthOnProtocolFallback,
        upstreamTimeoutMs: t.upstreamTimeoutMs,
        maxExtraAttempts: r.allowAutomaticRetry && r.allowSameTargetRetry !== !1 ? t.upstreamRetryAttempts : 0,
        isRetry: !1,
        requestLifecycle: t.requestLifecycle,
        segmentFastPathEnabled: c
      });
      let d = l.response, u = l.targetRecord || null, f = u?.targetUrl || (t.playbackRelayTargetUrl instanceof URL ? new URL(t.playbackRelayTargetUrl.toString()) : null), m = l.finalUrl, p = l.releaseFetchController, g = l.protocolFallbackRetry === !0, h = l.protocolFallbackRetryFailed === !0, y = !1, _ = null, S = 0, T = t.requestMethod, b = r.preparedBodyMode, R = r.preparedBody;
      for (t.defaultOutboundColo = Ga(d) || ""; d.status >= 300 && d.status < 400 && S < 8; ) {
        const w = Number(d.status) || 0, L = Ta(d.headers.get("Location"), m || f);
        if (!L) {
          e.finalizeRedirectTrace(i, {
            terminalMode: "invalid_redirect_target",
            finalStatus: w,
            finalHost: m?.hostname || f?.hostname || ""
          });
          break;
        }
        const U = Ia(L, f).proxyPath || (L.origin === f?.origin ? L.pathname : null);
        if (U && ga(U)) {
          e.recordRedirectTraceHop(i, w, L, {
            isSameOriginRedirect: !0,
            traceAction: "blocked_web"
          }), e.finalizeRedirectTrace(i, {
            terminalMode: "web_proxy_disabled",
            finalStatus: 404,
            finalHost: L.hostname || ""
          });
          try {
            d.body?.cancel?.();
          } catch {
          }
          try {
            p?.();
          } catch {
          }
          d = Sn(t.requestMethod, t.dynamicCors), m = L, p = null, S += 1;
          break;
        }
        const E = e.enforceStrictClientDirectAuthPolicy(t, e.getRoutingDecision({
          phase: "redirect",
          nextUrl: L,
          activeTargetBase: f,
          redirectMethod: T,
          redirectBodyMode: b,
          forceWorkerProxy: t.forceWorkerProxy === !0,
          forceWorkerProxyReason: t.forceWorkerProxyReason,
          currentStatus: d.status,
          policy: {
            forceVideoDirect: s.forceVideoDirect === !0,
            forceVideoProxy: s.forceVideoProxy === !0,
            currentStatus: d.status
          },
          routingDecisionMode: t.routingDecisionMode
        }), r, {
          redirectStatus: d.status,
          redirectMethod: T,
          redirectBodyMode: b
        });
        if (e.recordRedirectTraceHop(i, w, L, E), E.action === "DIRECT") {
          const N = r.clientRedirectAuthPolicy || Aa(r.newHeaders);
          if (N.canDirect !== !0)
            throw t.directRedirectAuthReason = N.reason || "direct_transport_incompatible", e.finalizeRedirectTrace(i, {
              terminalMode: "direct_incompatible",
              finalStatus: 409,
              finalHost: L.hostname || ""
            }), e.createDirectTransportIncompatibleError(t, { redirectTrace: i });
          const v = e.buildClientVisibleRedirectUrl(L, f, t.nodeName, t.nodeKey, t.requestUrl, {
            preserveWorkerProxy: E.preserveWorkerProxy === !0,
            linkVariant: t.linkVariant,
            entryMode: t.entryMode
          }) || L;
          _ = E.preserveWorkerProxy === !0 ? v : Xo(v, r.clientRedirectAuthPolicy || r.newHeaders, t.effectiveMediaAuthMode), e.finalizeRedirectTrace(i, {
            terminalMode: "client_redirect",
            finalStatus: w,
            finalHost: _.hostname || L.hostname || ""
          });
          break;
        }
        const D = E.nextMethod, A = E.nextBodyMode, x = A === "none" ? null : R;
        try {
          d.body?.cancel?.();
        } catch {
        }
        try {
          p?.();
        } catch {
        }
        let O;
        try {
          O = await e.fetchAbsoluteWithRetryLoop({
            absoluteUrl: L,
            buildFetchOptions: a,
            fetchOptions: {
              method: D,
              bodyMode: A,
              body: x,
              isExternalRedirect: !E.isSameOriginRedirect
            },
            retryableStatuses: n,
            protocolFallback: t.protocolFallback,
            preparedBodyMode: A,
            allowAutomaticRetry: r.allowAutomaticRetry,
            stripAuthOnProtocolFallback: t.requestTraits.canStripAuthOnProtocolFallback,
            upstreamTimeoutMs: t.upstreamTimeoutMs,
            maxExtraAttempts: r.allowAutomaticRetry && r.allowSameTargetRetry !== !1 ? t.upstreamRetryAttempts : 0,
            isRetry: !1,
            requestLifecycle: t.requestLifecycle
          });
        } catch (N) {
          if (t.requestTraits?.isImage && !E.isSameOriginRedirect) {
            _ = e.buildClientVisibleRedirectUrl(L, f, t.nodeName, t.nodeKey, t.requestUrl, {
              preserveWorkerProxy: !1,
              linkVariant: t.linkVariant,
              entryMode: t.entryMode
            }) || L, e.finalizeRedirectTrace(i, {
              terminalMode: "client_redirect",
              finalStatus: w || 301,
              finalHost: _.hostname || L.hostname || ""
            }), d = new Response(null, {
              status: w || 301,
              statusText: "Moved Permanently"
            }), m = L, p = null;
            break;
          }
          throw e.finalizeRedirectTrace(i, {
            terminalMode: "proxy_error_after_redirect",
            finalStatus: w,
            finalHost: L.hostname || ""
          }), N && typeof N == "object" && (N.redirectTrace = i), N;
        }
        if (d = O.response, m = O.finalUrl, p = O.releaseFetchController, g = g || O.protocolFallbackRetry === !0, h = h || O.protocolFallbackRetryFailed === !0, T = D, b = A, R = x, t.defaultOutboundColo = Ga(d) || "", E.isSameOriginRedirect || (y = !0), S += 1, t.requestTraits?.isImage && !E.isSameOriginRedirect && d.status >= 400) {
          try {
            d.body?.cancel?.();
          } catch {
          }
          try {
            O.releaseFetchController?.();
          } catch {
          }
          _ = e.buildClientVisibleRedirectUrl(L, f, t.nodeName, t.nodeKey, t.requestUrl, {
            preserveWorkerProxy: !1,
            linkVariant: t.linkVariant,
            entryMode: t.entryMode
          }) || L, e.finalizeRedirectTrace(i, {
            terminalMode: "client_redirect",
            finalStatus: w || 301,
            finalHost: _.hostname || L.hostname || ""
          }), d = new Response(null, {
            status: w || 301,
            statusText: "Moved Permanently"
          }), m = L, p = null;
          break;
        }
      }
      if (!i.terminalMode && (i.hops.length > 0 || i.finalStatus > 0)) {
        const w = Number(d?.status) || 0;
        if (w >= 300 && w < 400) {
          const L = Ta(d.headers.get("Location"), m || f);
          e.finalizeRedirectTrace(i, {
            terminalMode: S >= 8 ? "redirect_limit" : "upstream_redirect_passthrough",
            finalStatus: w,
            finalHost: L?.hostname || m?.hostname || f?.hostname || ""
          });
        } else e.finalizeRedirectTrace(i, {
          terminalMode: i.hops.length > 0 ? "proxied_follow" : "no_redirect",
          finalStatus: w,
          finalHost: m?.hostname || f?.hostname || ""
        });
      }
      return {
        response: d,
        finalUrl: m,
        activeTargetRecord: u,
        activeTargetBase: f,
        releaseFetchController: p,
        proxiedExternalRedirect: y,
        directRedirectUrl: _,
        protocolFallbackRetry: g,
        protocolFallbackRetryFailed: h,
        redirectTrace: i
      };
    },
    async buildSuccessResponse(t, r, a, n = null) {
      let s = await e.guardApiResponseMime(t, a);
      t?.requestTraits?.isPlaybackInfoRequest === !0 && (s = await e.guardPlaybackInfoResponseContract(t, s), rr(s.playbackInfoRepresentation) && (s = await e.maybeRewritePlaybackInfoResponse(t, s)));
      const i = String(s.redirectTrace?.terminalMode || t?.redirectTrace?.terminalMode || ""), c = t?.playbackAbsoluteFallbackEligible === !0 && !s.directRedirectUrl && i !== "web_proxy_disabled" && Number(s.response.status) === 404;
      c && (t.playbackFallback = "relative_307");
      const l = e.shouldLogDirectAccess(t, { directRedirectUrl: s.directRedirectUrl }), d = l ? "" : e.buildRedirectDiagnosticDetail(s.redirectTrace || t.redirectTrace), u = s.response.status, f = c ? 307 : s.directRedirectUrl && Number(s.redirectTrace?.finalStatus) || u, m = c ? "Temporary Redirect" : s.response.statusText;
      e.markFailoverBusinessSuccess(t, s.activeTargetRecord, { status: u });
      const p = e.buildProxyResponseHeaders(s.response, t.request, t.dynamicCors, t.finalOrigin, t.requestTraits, {
        enableH3: t.enableH3,
        forceH1: t.forceH1,
        proxiedExternalRedirect: s.proxiedExternalRedirect,
        imageCacheMaxAge: t.imageCacheMaxAge
      });
      e.applyProxyRedirectHeaders(p, s.response, s.activeTargetBase, t.nodeName, t.nodeKey, s.directRedirectUrl, s.finalUrl, {
        linkVariant: t.linkVariant,
        entryMode: t.entryMode
      }), c && (jc(p), p.set("Location", t.playbackAbsoluteFallbackLocation || "/"), p.set("Cache-Control", "no-store"));
      const g = !c && e.shouldManageProxyResponseBody(t, s), h = t.defaultOutboundColo || "", y = e.buildRuntimeDiagnosticDetail(t), _ = l ? e.buildDirectAccessDiagnosticDetail(t, {
        directRedirectUrl: s.directRedirectUrl,
        redirectTrace: s.redirectTrace || t.redirectTrace
      }) : e.appendLogDiagnosticDetail(e.appendLogDiagnosticDetail(e.extractProxyErrorDetail(s.response), e.buildStreamDiagnosticDetail(t, s.response, {
        flow: g ? "managed" : "passthrough",
        source: "upstream",
        upstreamHost: s.finalUrl?.hostname || s.activeTargetBase?.hostname || "",
        protocolFallbackRetry: s.protocolFallbackRetry === !0,
        idleTimeoutMs: g ? e.resolveResponseStreamIdleTimeoutMs(t.requestTraits, t.upstreamTimeoutMs) : 0
      })), e.appendLogDiagnosticDetail(y, d)), S = l ? e.buildDirectAccessLogPayload(t, f, h, {
        directRedirectUrl: s.directRedirectUrl,
        redirectTrace: s.redirectTrace || t.redirectTrace
      }) : {
        statusCode: c ? f : u,
        category: e.classifyProxyLogCategory(t.requestTraits),
        errorDetail: _,
        detailJson: e.buildStructuredLogDetail(t, { statusCode: c ? f : u }, {
          transport: null,
          deliveryMode: "proxy",
          redirectTrace: s.redirectTrace || t.redirectTrace,
          redirectMode: c ? "playback_relative_fallback" : s.redirectTrace?.terminalMode || "proxied_follow",
          redirectUrl: s.finalUrl,
          decisionReason: c ? "playback_relative_fallback" : s.redirectTrace?.terminalMode || "proxied_follow",
          protocolFailureReason: s.protocolFallbackRetry === !0 || s.protocolFallbackRetryFailed === !0 ? e.classifyProtocolFailureReason("protocol_fallback", {
            upstreamStatus: u,
            protocolFallbackRetry: !0
          }) : Number(u) >= 400 ? e.classifyProtocolFailureReason(_ || s.response.statusText || "", {
            upstreamStatus: u,
            protocolFallbackRetry: s.protocolFallbackRetry === !0
          }) : null,
          protocolFallbackRetry: s.protocolFallbackRetry === !0,
          playbackInfoCache: t.playbackInfoCacheState,
          playbackInfoCacheTtlSec: t.playbackInfoCacheTtlSec,
          progressRelayMode: t.progressForwardMode,
          progressIntervalSec: t.videoProgressForwardIntervalSec,
          upstreamHost: s.finalUrl?.hostname || s.activeTargetBase?.hostname || "",
          upstreamStatus: u
        }),
        outboundColo: h
      };
      if (g || e.recordAccessLog(t, S), t.metadataCacheKey && t.ctx && s.response.status === 200) {
        const R = s.response.clone();
        t.ctx.waitUntil(e.storeMetadataCache(t.metadataCacheKey, R, t.requestTraits, {
          sourceUrl: t.requestUrl,
          prewarmCacheTtl: t.requestTraits.prewarmCacheTtl,
          imageCacheMaxAge: t.imageCacheMaxAge,
          proxiedExternalRedirect: s.proxiedExternalRedirect === !0
        }));
      }
      t.requestTraits.isPlaybackInfoRequest === !0 && await e.storePlaybackInfoResponseCache(t, s.response, null, s.playbackInfoRepresentation), e.scheduleMetadataPrewarmResponse(t.request, s.response, t.requestTraits, s.activeTargetBase, r, t.nodeName, t.nodeKey, t.requestUrl, t.ctx, {
        proxyPath: t.proxyPath,
        prewarmCacheTtl: t.requestTraits.prewarmCacheTtl,
        imageCacheMaxAge: t.imageCacheMaxAge,
        nodeCacheRevision: t.nodeDerivedCacheRevision,
        entryMode: t.entryMode,
        identityPartition: t.metadataCacheIdentityPartition
      }), e.maybeScheduleBackgroundFailoverRefresh(t, s);
      const T = s.response;
      if (c) {
        try {
          s.response.body?.cancel?.();
        } catch {
        }
        try {
          s.releaseFetchController?.();
        } catch {
        }
        return t.requestLifecycle?.dispose?.(), new Response(null, {
          status: f,
          statusText: m,
          headers: p
        });
      }
      if (s.response.status === 101 && T.webSocket) {
        try {
          s.releaseFetchController?.();
        } catch {
        }
        t.requestLifecycle?.dispose?.();
        const R = {
          status: 101,
          statusText: s.response.statusText,
          headers: p,
          webSocket: T.webSocket
        };
        return new Response(null, R);
      }
      let b;
      return g ? b = e.buildManagedProxyResponseBody(t, s, S) : b = e.buildPassthroughProxyResponseBody(t, s), new Response(b, {
        status: f,
        statusText: m,
        headers: p
      });
    }
  };
}
function Dg(o = {}, e = {}) {
  return {
    buildErrorResponse(t, r) {
      const a = r?.message || String(r || "网关或 CF Workers 内部崩溃"), n = String(r?.code || "").toUpperCase(), s = e.buildRedirectDiagnosticDetail(r?.redirectTrace || t.redirectTrace), i = e.buildRuntimeDiagnosticDetail(t);
      let c = 502, l = "Bad Gateway", d = {
        error: "Bad Gateway",
        code: 502,
        message: "All proxy attempts failed."
      };
      n === "UPSTREAM_TIMEOUT" || n === "STREAM_IDLE_TIMEOUT" ? (c = 504, l = "Gateway Timeout", d = {
        error: "Gateway Timeout",
        code: 504,
        message: "Upstream response timed out."
      }) : n === "DIRECT_TRANSPORT_INCOMPATIBLE" ? (c = 409, l = "Conflict", d = {
        error: "Conflict",
        code: 409,
        message: "DIRECT mode is strict and will not fall back to proxy when custom auth headers or cookies are required."
      }) : (n === "CLIENT_ABORTED" || n === "DOWNSTREAM_CANCELLED" || n === "REQUEST_ABORTED") && (c = 499, l = "Client Closed Request", d = {
        error: "Client Closed Request",
        code: 499,
        message: "Client closed request."
      });
      try {
        t.requestLifecycle?.abort?.(n ? n.toLowerCase() : "proxy_error");
      } catch {
      }
      t.requestLifecycle?.dispose?.(), n === "DIRECT_TRANSPORT_INCOMPATIBLE" ? e.recordAccessLog(t, e.buildDirectAccessLogPayload(t, c, t.defaultOutboundColo || "", { redirectTrace: r?.redirectTrace || t.redirectTrace })) : e.recordAccessLog(t, {
        statusCode: c,
        category: c === 499 ? e.classifyProxyLogCategory(t.requestTraits || {}) : "error",
        errorDetail: e.appendLogDiagnosticDetail(e.appendLogDiagnosticDetail(a, e.buildStreamDiagnosticDetail(t, null, {
          flow: "proxy_error",
          source: "upstream_pending",
          upstreamHost: r?.lastFinalUrl?.hostname || r?.lastTargetBase?.hostname || "",
          idleTimeoutMs: e.resolveResponseStreamIdleTimeoutMs(t.requestTraits || {}, t.upstreamTimeoutMs)
        })), e.appendLogDiagnosticDetail(i, s)),
        detailJson: e.buildStructuredLogDetail(t, { statusCode: c }, {
          deliveryMode: "proxy",
          redirectTrace: r?.redirectTrace || t.redirectTrace,
          redirectMode: "proxy_error",
          redirectUrl: r?.lastFinalUrl,
          decisionReason: n || "proxy_error",
          protocolFailureReason: e.classifyProtocolFailureReason(r, {
            errorCode: n,
            message: a,
            protocolFallbackRetry: !1,
            upstreamStatus: c
          }),
          playbackInfoCache: t.playbackInfoCacheState,
          playbackInfoCacheTtlSec: t.playbackInfoCacheTtlSec,
          progressRelayMode: t.progressForwardMode,
          progressIntervalSec: t.videoProgressForwardIntervalSec,
          upstreamHost: r?.lastFinalUrl?.hostname || r?.lastTargetBase?.hostname || "",
          upstreamStatus: c
        }),
        outboundColo: t.defaultOutboundColo || ""
      });
      const u = new Headers({
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": t.finalOrigin || "*",
        "Cache-Control": "no-store"
      });
      return t.finalOrigin !== "*" && Ur(u, "Origin"), Ce(u), new Response(JSON.stringify(d), {
        status: c,
        statusText: l,
        headers: u
      });
    },
    async handle(t, r, a, n, s, i, c, l = {}) {
      if (ga(a)) {
        const y = $(l.runtimeConfig) ? l.runtimeConfig : {}, _ = Yr(i, t, e.resolveCorsOrigin(y, t));
        return Sn(t.method, _);
      }
      const d = await Nh(t, i, r, n, a);
      if (d) return d;
      let u = await e.prepareExecutionContext(t, r, a, n, s, i, c, l);
      if (u.invalidResponse) return u.invalidResponse;
      const f = await e.resolveEarlyResponse(u);
      if (f) return f;
      let { targetRecords: m, invalidResponse: p } = e.parseTargetRecords(u.node, u.finalOrigin, { cachedTargetRecords: u.playbackRouteHotTargetRecords });
      if (p) return p;
      let g = e.prepareFailoverOverlay(u, m);
      u.defaultOutboundColo = "";
      let h = null;
      try {
        h = await e.buildProxyRequestState(u.request, u.node, u.proxyPath, u.requestUrl, u.clientIp, u.requestTraits, u.forceH1, g, {
          effectiveRealClientIpMode: u.effectiveRealClientIpMode,
          effectiveMediaAuthMode: u.effectiveMediaAuthMode
        });
        const y = await e.tryServePlaybackInfoResponseCache(u, h);
        if (y) return y;
        const _ = e.createBuildFetchOptions(u, h), S = await e.maybeBuildEntryDirectResponse(u, m, h, _);
        if (S) return S;
        const T = await e.maybeHandlePlaybackProgressRelay(u, h, _, h.retryTargetRecords);
        if (T) return T;
        u.requestLifecycle = dl(u.request?.signal);
        const b = await e.executeUpstreamFlow(u, h, _);
        return await e.buildSuccessResponse(u, _, b, h);
      } catch (y) {
        return e.buildErrorResponse(u, y);
      }
    }
  };
}
function Ig(o = {}, e = {}) {
  return {
    ...Lg(o, e),
    ...Ng(o, e),
    ...Dg(o, e)
  };
}
function Mg(o = {}, e = {}) {
  return {
    resolveEntryDirectTargetUrl(t, r) {
      if (t?.playbackRelayTargetUrl instanceof URL) return new URL(t.playbackRelayTargetUrl.toString());
      const a = hr(r, t?.proxyPath || "/");
      return a.search = String(t?.requestUrl?.search || ""), a;
    },
    classifyProxyLogCategory(t) {
      return t.isSegment ? "segment" : t.isManifest ? "manifest" : t.isBigStream || t.isSmartStrmMedia ? "stream" : t.isImage ? "image" : t.isSubtitle ? "subtitle" : t.isStaticFile ? "asset" : t.isWsUpgrade ? "websocket" : "api";
    },
    extractProxyErrorDetail(t) {
      if (t.status < 400) return null;
      const r = [], a = t.headers.get("Server");
      a && r.push(`Server: ${a}`);
      const n = t.headers.get("CF-Ray");
      n && r.push(`CF-Ray: ${n}`);
      const s = t.headers.get("X-Application-Error-Code") || t.headers.get("X-Emby-Error") || t.headers.get("X-MediaBrowser-Error");
      s && r.push(`Media-Server-Error: ${s}`);
      const i = t.headers.get("CF-Cache-Status");
      return i && r.push(`CF-Cache: ${i}`), r.length > 0 ? r.join(" | ") : t.statusText;
    },
    appendLogDiagnosticDetail(t, r) {
      const a = [], n = (i) => {
        const c = String(i || "").trim();
        c && (a.includes(c) || a.push(c));
      };
      if (n(t), n(r), !a.length) return null;
      const s = a.join(" | ");
      return s.length > 1200 ? s.slice(0, 1197) + "..." : s;
    },
    shouldLogDirectAccess(t, r = {}) {
      return !!(e.isEntryDirectDataPlaneMode(t?.entryRoutingDecision?.dataPlaneMode) || r.directRedirectUrl);
    },
    buildDirectAccessDiagnosticDetail(t, r = {}) {
      let a = "直连";
      a = e.appendLogDiagnosticDetail(a, `RoutingMode=${Pr(t?.routingDecisionMode)}`), a = e.appendLogDiagnosticDetail(a, e.buildTargetHotCacheDiagnosticDetail(t));
      const n = t?.entryRoutingDecision;
      return e.isEntryDirectDataPlaneMode(n?.dataPlaneMode) && (a = e.appendLogDiagnosticDetail(a, `Direct=entry_307 | Reason=${String(n?.reason || n?.traceLabel || "entry_direct").trim() || "entry_direct"}`)), a = e.appendLogDiagnosticDetail(a, e.buildPlaybackUrlDiagnosticDetail(t)), a = e.appendLogDiagnosticDetail(a, t?.directRedirectAuthReason ? `DirectAuth=${t.directRedirectAuthReason}` : ""), a = e.appendLogDiagnosticDetail(a, e.buildRouteContextDiagnosticDetail(t)), a = e.appendLogDiagnosticDetail(a, e.buildStreamDiagnosticDetail(t, null, {
        force: !0,
        flow: r.directRedirectUrl ? "client_redirect" : "entry_direct",
        source: "client_visible_redirect"
      })), (r.directRedirectUrl || r.redirectTrace) && (a = e.appendLogDiagnosticDetail(a, e.buildRedirectDiagnosticDetail(r.redirectTrace || t?.redirectTrace))), a;
    },
    buildDirectAccessLogPayload(t, r, a = "", n = {}) {
      return {
        statusCode: r,
        category: e.classifyProxyLogCategory(t.requestTraits),
        errorDetail: e.buildDirectAccessDiagnosticDetail(t, n),
        detailJson: e.buildStructuredLogDetail(t, { statusCode: r }, {
          ...n,
          deliveryMode: "direct",
          redirectMode: n.directRedirectUrl ? "client_redirect" : "entry_307",
          decisionReason: String(n.decisionReason || t?.directRedirectAuthReason || t?.entryRoutingDecision?.reason || t?.entryRoutingDecision?.traceLabel || "").trim()
        }),
        outboundColo: a
      };
    },
    buildStreamDiagnosticDetail(t, r, a = {}) {
      const n = t?.requestTraits || {};
      if (!(a.force === !0 || n.isBigStream === !0 || n.isSmartStrmMedia === !0 || n.isSegment === !0 || n.isManifest === !0)) return "";
      const s = r?.headers, i = [], c = (l, d) => {
        const u = String(d || "").trim();
        u && i.push(`${l}=${u.length > 160 ? u.slice(0, 157) + "..." : u}`);
      };
      return c("Flow", a.flow || "passthrough"), c("Kind", e.classifyProxyLogCategory(n)), c("Source", a.source || "upstream"), c("Range", n.rangeHeader || t?.request?.headers?.get("Range")), c("Content-Range", s?.get("Content-Range")), c("Length", s?.get("Content-Length")), c("Accept-Ranges", s?.get("Accept-Ranges")), c("Cache", a.cacheStatus || s?.get("CF-Cache-Status")), c("Upstream", a.upstreamHost || a.upstreamUrlHost), c("RoutingMode", Pr(t?.routingDecisionMode)), c("DirectAuth", t?.directRedirectAuthReason), a.protocolFallbackRetry === !0 && c("Retry", "protocol_fallback"), Number(a.idleTimeoutMs) > 0 && c("Idle", `${Number(a.idleTimeoutMs)}ms`), i.join(" | ");
    },
    buildPlaybackInfoCacheDiagnosticDetail(t) {
      if (t?.requestTraits?.isPlaybackInfoRequest !== !0) return "";
      const r = Gt(t?.effectivePlaybackInfoMode), a = String(t?.playbackInfoCacheState || "").trim(), n = String(t?.playbackInfoRewrite || "").trim(), s = [`PlaybackInfoMode=${r}`];
      return n && s.push(`PlaybackInfoRewrite=${n}`), a && s.push(`PlaybackInfoCache=${a}`), Number(t?.playbackInfoCacheTtlSec) > 0 && s.push(`PlaybackInfoCacheTtl=${Number(t.playbackInfoCacheTtlSec)}s`), s.join(" | ");
    },
    buildPlaybackUrlDiagnosticDetail(t) {
      const r = String(t?.playbackUrlMode || "").trim(), a = String(t?.playbackFallback || "").trim(), n = String(t?.playbackPathFix || "").trim(), s = String(t?.rewritePlaybackEntry || "").trim(), i = [];
      return r && i.push(`PlaybackUrlMode=${r}`), a && i.push(`PlaybackFallback=${a}`), n && i.push(`PlaybackPathFix=${n}`), s && i.push(`RewritePlaybackEntry=${s}`), i.join(" | ");
    },
    buildTargetHotCacheDiagnosticDetail(t) {
      const r = String(t?.nodeCacheState || t?.targetHotCacheState || "").trim();
      return r ? t?.nodeCacheState ? `NodeCacheState=${r}` : `TargetHotCache=${r}` : "";
    },
    buildRouteContextDiagnosticDetail(t) {
      const r = t?.routeContextDiagnostics && typeof t.routeContextDiagnostics == "object" ? t.routeContextDiagnostics : null;
      if (!r) return "";
      const a = [], n = (s, i) => {
        const c = String(i || "").trim();
        c && a.push(`${s}=${c}`);
      };
      return n("RouteKind", r.routeKind), n("RequestHost", r.requestHost), n("ConfiguredHost", r.configuredHost), n("ConfiguredLegacyHost", r.configuredLegacyHost), a.push(`LegacyHostRequest=${r.isLegacyHostRequest === !0 ? "true" : "false"}`), a.join(" | ");
    },
    buildRuntimeDiagnosticDetail(t) {
      return e.appendLogDiagnosticDetail(e.appendLogDiagnosticDetail(e.appendLogDiagnosticDetail(e.appendLogDiagnosticDetail(e.buildTargetHotCacheDiagnosticDetail(t), e.buildPlaybackInfoCacheDiagnosticDetail(t)), e.buildFailoverDiagnosticDetail(t)), e.buildPlaybackUrlDiagnosticDetail(t)), e.appendLogDiagnosticDetail(e.buildProgressRelayDiagnosticDetail(t), e.buildRouteContextDiagnosticDetail(t)));
    },
    buildProgressRelayDiagnosticDetail(t) {
      if (t?.requestTraits?.isPlaybackSessionControlRequest !== !0) return "";
      const r = String(t?.progressForwardMode || "").trim();
      if (!r) return "";
      const a = [`ProgressRelay=${r}`];
      Number(t?.videoProgressForwardIntervalSec) > 0 && a.push(`ProgressInterval=${Number(t.videoProgressForwardIntervalSec)}s`);
      const n = String(t?.progressForwardSessionKey || "").trim();
      return n && a.push(`ProgressSession=${ne(n)}`), a.join(" | ");
    },
    collectLogAuthKinds(t, r = null) {
      const a = /* @__PURE__ */ new Set(), n = t?.requestUrl instanceof URL ? t.requestUrl : null;
      if (n) for (const c of n.searchParams.keys()) {
        const l = Ma(c);
        if (sg.has(l) || ul.has(l)) {
          a.add("query");
          break;
        }
      }
      const s = r?.newHeaders || t?.request?.headers || new Headers(), i = r?.clientRedirectAuthPolicy || Aa(s);
      return i.hasQueryAuth && a.add("query"), i.hasHeaderAuth && a.add("header"), i.hasCookieAuth && a.add("cookie"), [...a];
    },
    pickPrimaryAuthCarrier(t = []) {
      return (t || []).includes("query") ? "query" : (t || []).includes("header") ? "header" : (t || []).includes("cookie") ? "cookie" : "none";
    },
    resolveRedirectScope(t, r) {
      if (!t) return "none";
      try {
        const a = t instanceof URL ? t : new URL(String(t || "")), n = r instanceof URL ? r : new URL(String(r || ""));
        return a.origin === n.origin ? "same_origin" : "external";
      } catch {
        return "external";
      }
    },
    resolveRoutingCapability(t = "proxy", r = [], a = "none") {
      const n = String(t || "").trim().toLowerCase() === "direct" ? "direct" : "proxy", s = e.pickPrimaryAuthCarrier(r), i = a === "same_origin" || a === "external" ? a : "none";
      return hg?.[n]?.[s]?.[i] || {
        deliveryMode: n,
        authCarrier: s,
        redirectScope: i,
        clientVisibleRedirect: n === "direct" && i !== "none",
        workerFollowRedirect: n !== "direct",
        reasonCode: n === "direct" ? "client_redirect" : "worker_follow_redirect"
      };
    },
    classifyProtocolFailureReason(t, r = {}) {
      const a = String(r.errorCode || t?.code || "").trim().toUpperCase(), n = String(r.message || t?.message || t || "").trim().toLowerCase(), s = Number(r.upstreamStatus) || 0;
      return String(r.abortReason || "").trim().toLowerCase() === "stream_idle_timeout" || a === "STREAM_IDLE_TIMEOUT" ? "idle_timeout" : a === "UPSTREAM_TIMEOUT" || n.includes("timed out") || n.includes("timeout") ? "connect_timeout" : n.includes("redirect loop") ? "redirect_loop" : n.includes("too many redirects") || n.includes("redirect limit") ? "redirect_limit_exceeded" : n.includes("tls") || n.includes("ssl") || n.includes("certificate") ? "tls_handshake_failed" : r.protocolFallbackRetry === !0 || n.includes("protocol_fallback") ? "http_version_fallback" : s === 416 || n.includes("range") && (n.includes("416") || n.includes("unsatisfied") || n.includes("satisfiable")) ? "range_unsatisfied" : s >= 400 && s < 500 ? "upstream_4xx" : s >= 500 ? "upstream_5xx" : "unknown_fetch_error";
    },
    buildStructuredLogDetail(t, r = {}, a = {}) {
      const n = String(a.deliveryMode || (e.shouldLogDirectAccess(t, { directRedirectUrl: a.directRedirectUrl }) ? "direct" : "proxy")).trim().toLowerCase() === "direct" ? "direct" : "proxy", s = e.collectLogAuthKinds(t, a.transport), i = a.redirectScope || e.resolveRedirectScope(a.directRedirectUrl || a.redirectUrl || a.finalUrl, t?.requestUrl), c = e.resolveRoutingCapability(n, s, i), l = Number(a.upstreamStatus || r.statusCode || 0) || 0, d = Vd(l), u = t?.routeContextDiagnostics && typeof t.routeContextDiagnostics == "object" ? t.routeContextDiagnostics : null, f = Array.isArray(a.authKindsForwarded) ? [...new Set(a.authKindsForwarded.map((p) => String(p || "").trim().toLowerCase()).filter(Boolean))] : n === "direct" ? s.filter((p) => p === "query") : s, m = e.ensureFailoverTelemetry(t);
      return {
        routingMode: Pr(t?.routingDecisionMode),
        entryDecision: t?.entryRoutingDecision ? {
          dataPlaneMode: String(t.entryRoutingDecision.dataPlaneMode || "").trim(),
          reason: String(t.entryRoutingDecision.reason || t.entryRoutingDecision.traceLabel || "").trim()
        } : null,
        redirectDecision: a.redirectDecision && typeof a.redirectDecision == "object" ? a.redirectDecision : {
          mode: String(a.redirectMode || a.redirectTrace?.terminalMode || c.reasonCode || "").trim(),
          reason: String(a.decisionReason || t?.directRedirectAuthReason || c.reasonCode || "").trim()
        },
        deliveryMode: n,
        redirectScope: i,
        authKindsPresent: s,
        authKindsForwarded: f,
        decisionReason: String(a.decisionReason || t?.directRedirectAuthReason || c.reasonCode || "").trim(),
        routeKind: String(u?.routeKind || "").trim() || null,
        requestHost: String(u?.requestHost || "").trim() || null,
        configuredHost: String(u?.configuredHost || "").trim() || null,
        configuredLegacyHost: String(u?.configuredLegacyHost || "").trim() || null,
        isLegacyHostRequest: u?.isLegacyHostRequest === !0,
        statusReasonCode: d.code,
        statusReasonText: d.text,
        protocolFailureReason: String(a.protocolFailureReason || "").trim() || null,
        protocolFallbackRetry: a.protocolFallbackRetry === !0,
        failoverState: e.buildFailoverStateSummary(t),
        probeReason: String(a.probeReason || m.probeReason || "").trim() || null,
        probeWinner: String(a.probeWinner || m.probeWinner || "").trim() || null,
        probeElapsedMs: Math.max(0, Math.round(Number(a.probeElapsedMs ?? m.probeElapsedMs) || 0)) || null,
        waitJoinMs: Math.max(0, Math.round(Number(a.waitJoinMs ?? m.waitJoinMs) || 0)) || null,
        demotedTarget: String(a.demotedTarget || m.demotedTarget || "").trim() || null,
        preferredTarget: String(a.preferredTarget || m.preferredTarget || "").trim() || null,
        fastFailReason: String(a.fastFailReason || m.fastFailReason || "").trim() || null,
        targetHotCache: String(a.targetHotCache || t?.targetHotCacheState || "").trim() || null,
        nodeCacheState: String(a.nodeCacheState || t?.nodeCacheState || "").trim() || null,
        playbackInfoCache: String(a.playbackInfoCache || t?.playbackInfoCacheState || "").trim() || null,
        playbackInfoCacheTtlSec: Number.isFinite(Number(a.playbackInfoCacheTtlSec)) ? Math.max(0, Math.trunc(Number(a.playbackInfoCacheTtlSec))) : Math.max(0, Math.trunc(Number(t?.playbackInfoCacheTtlSec) || 0)),
        playbackInfoMode: t?.requestTraits?.isPlaybackInfoRequest === !0 ? Gt(a.playbackInfoMode || t?.effectivePlaybackInfoMode) : null,
        playbackInfoRewrite: t?.requestTraits?.isPlaybackInfoRequest === !0 && String(a.playbackInfoRewrite || t?.playbackInfoRewrite || "").trim() || null,
        playbackUrlMode: String(a.playbackUrlMode || t?.playbackUrlMode || "").trim() || null,
        playbackFallback: String(a.playbackFallback || t?.playbackFallback || "").trim() || null,
        playbackPathFix: String(a.playbackPathFix || t?.playbackPathFix || "").trim() || null,
        rewritePlaybackEntry: String(a.rewritePlaybackEntry || t?.rewritePlaybackEntry || "").trim() || null,
        progressRelayMode: String(a.progressRelayMode || t?.progressForwardMode || "").trim() || null,
        progressIntervalSec: Number.isFinite(Number(a.progressIntervalSec)) ? Math.max(0, Math.trunc(Number(a.progressIntervalSec))) : Math.max(0, Math.trunc(Number(t?.videoProgressForwardIntervalSec) || 0)),
        rangeRequest: !!String(t?.request?.headers?.get("Range") || "").trim(),
        upstreamHost: String(a.upstreamHost || a.upstreamUrlHost || a.finalUrl?.hostname || "").trim(),
        upstreamStatus: l
      };
    },
    createRedirectTrace(t) {
      return {
        initialUrl: t ? String(t) : "",
        hops: [],
        terminalMode: "",
        finalStatus: 0,
        finalHost: ""
      };
    },
    recordRedirectTraceHop(t, r, a, n = {}) {
      !t || !a || t.hops.push({
        status: Number(r) || 0,
        kind: n.isSameOriginRedirect === !0 ? "same" : "external",
        action: String(n.traceAction || (e.isEntryDirectDataPlaneMode(n.dataPlaneMode) ? "direct" : "proxy")).trim() || "proxy",
        host: String(a.hostname || "").trim().toLowerCase()
      });
    },
    finalizeRedirectTrace(t, r = {}) {
      if (!t || typeof t != "object") return null;
      const a = String(r.terminalMode || t.terminalMode || "").trim();
      a && (t.terminalMode = a);
      const n = Number(r.finalStatus);
      Number.isFinite(n) && n > 0 && (t.finalStatus = n);
      const s = String(r.finalHost || "").trim().toLowerCase();
      return s && (t.finalHost = s), t;
    },
    buildRedirectDiagnosticDetail(t) {
      if (!t || typeof t != "object") return "";
      const r = Array.isArray(t.hops) ? t.hops : [], a = r.length, n = String(t.terminalMode || "").trim(), s = Number(t.finalStatus) || 0, i = String(t.finalHost || "").trim().toLowerCase();
      if (!a && !n && s <= 0 && !i) return "";
      const c = [];
      n && c.push(`Redirect=${n}`), c.push(`RedirectHops=${a}`);
      const l = r.map((d) => {
        const u = Number(d?.status) || 0, f = String(d?.kind || "").trim() || "unknown", m = String(d?.action || "").trim() || "proxy", p = String(d?.host || "").trim().toLowerCase();
        return [
          u || "0",
          f,
          m,
          p
        ].filter(Boolean).join(":");
      }).filter(Boolean).join(">");
      return l && c.push(`RedirectChain=${l.length > 240 ? l.slice(0, 237) + "..." : l}`), s > 0 && c.push(`RedirectFinal=${s}`), i && c.push(`RedirectFinalHost=${i}`), c.join(" | ");
    }
  };
}
function Pg(o = {}, e = {}) {
  return {
    buildProxyErrorState: Un,
    async guardApiResponseMime(t, r) {
      return wl(t, r, {
        sanitizePath: Y,
        buildErrorState: Un
      });
    },
    buildMetadataCacheStorageResponse(t, r, a = {}) {
      const n = new Headers(t.headers);
      return n.delete("Set-Cookie"), r.isImage || r.isSubtitle ? n.set("Cache-Control", `public, max-age=${Math.max(0, Number(a.imageCacheMaxAge) || 0)}`) : r.isManifest && n.set("Cache-Control", `public, max-age=${Math.max(0, Number(a.prewarmCacheTtl) || 0)}`), new Response(t.body, {
        status: t.status,
        statusText: t.statusText,
        headers: n
      });
    },
    async storeMetadataCache(t, r, a, n = {}) {
      const s = ur();
      if (!s || !t || !r || r.status !== 200 || n.proxiedExternalRedirect === !0 || a.isManifest && !so(n.sourceUrl)) return !1;
      try {
        return await s.put(t, e.buildMetadataCacheStorageResponse(r, a, n)), !0;
      } catch {
        return !1;
      }
    },
    resolveMetadataTarget(t, r, a, n) {
      const s = String(t || "").trim();
      if (!s) return null;
      let i;
      try {
        if (/^https?:\/\//i.test(s)) i = new URL(s);
        else {
          const d = new URL(s, "https://metadata-prewarm.invalid");
          i = hr(r, d.pathname || "/"), i.search = d.search || "", i.hash = d.hash || "";
        }
      } catch {
        return null;
      }
      if (Xp(i.pathname)) return null;
      const { proxyPath: c } = Ia(i, r);
      if (!c) return null;
      const l = c || "/";
      return Gr.test(l) || Wr.test(l) || St.test(l) || pr.test(l) ? {
        upstreamUrl: i,
        proxyPath: l,
        proxySearch: i.search || ""
      } : null;
    },
    buildMetadataPrewarmTargets(t, r, a, n, s, i) {
      const c = /* @__PURE__ */ new Map(), l = Yp(t);
      if (l) {
        const d = e.resolveMetadataTarget(`/Items/${encodeURIComponent(l)}/Images/Primary`, a, n, s);
        d && c.set(`${d.proxyPath}${d.proxySearch}`, d);
      }
      return i !== "poster" && io(r).forEach((d) => {
        const u = e.resolveMetadataTarget(d, a, n, s);
        u && c.set(`${u.proxyPath}${u.proxySearch}`, u);
      }), [...c.values()].sort((d, u) => Vs(d.proxyPath) - Vs(u.proxyPath)).slice(0, 4);
    },
    buildBudgetedPrewarmResponse(t, r) {
      const a = Math.max(0, Math.floor(Number(r) || 0)), n = tn(t?.headers?.get("Content-Length"));
      if (a <= 0 || Number.isFinite(n) && n > a) {
        try {
          Promise.resolve(t?.body?.cancel?.()).catch(() => {
          });
        } catch {
        }
        return null;
      }
      if (!t?.body) return {
        response: t,
        getBytes: () => 0
      };
      const s = t.body.getReader();
      let i = 0, c = !1;
      const l = () => {
        if (!c) {
          c = !0;
          try {
            s.releaseLock();
          } catch {
          }
        }
      }, d = new ReadableStream({
        async pull(u) {
          try {
            const { done: f, value: m } = await s.read();
            if (f) {
              l(), u.close();
              return;
            }
            const p = m instanceof Uint8Array ? m : new Uint8Array(m || 0);
            if (i + p.byteLength > a) {
              try {
                await s.cancel("metadata_prewarm_budget_exceeded");
              } catch {
              }
              l(), u.error(/* @__PURE__ */ new Error("metadata_prewarm_budget_exceeded"));
              return;
            }
            i += p.byteLength, u.enqueue(p);
          } catch (f) {
            l(), u.error(f);
          }
        },
        async cancel(u) {
          try {
            await s.cancel(u);
          } catch {
          }
          l();
        }
      });
      return {
        response: new Response(d, {
          status: t.status,
          statusText: t.statusText,
          headers: t.headers
        }),
        getBytes: () => i
      };
    },
    async runMetadataPrewarmSingleFlight(t, r) {
      const a = te.MetadataPrewarmTasks, n = t instanceof Request ? t.url : String(t || "");
      if (!n) return {
        skipped: !0,
        result: null
      };
      const s = a.get(n);
      if (s) return {
        joined: !0,
        result: await s
      };
      if (a.size >= Wu) return {
        skipped: !0,
        result: null
      };
      const i = Promise.resolve().then(r).finally(() => {
        a.get(n) === i && a.delete(n);
      });
      return a.set(n, i), {
        joined: !1,
        result: await i
      };
    },
    scheduleMetadataPrewarmResponse(t, r, a, n, s, i, c, l, d, u = {}) {
      if (!d || t.method !== "GET" || a.enablePrewarm !== !0 || a.isPlaybackInfoRequest === !0 || a.isImage || a.isSubtitle || a.isManifest || a.isSegment || a.isBigStream || !(r.status >= 200 && r.status < 300) || !an(r.headers.get("Content-Type"))) return;
      let f;
      try {
        f = r.clone();
      } catch {
        return;
      }
      const m = (async () => {
        const p = await Ne(f, Fi);
        if (p.exceeded) return;
        let g;
        try {
          g = JSON.parse(p.text);
        } catch {
          return;
        }
        const h = e.buildMetadataPrewarmTargets(u.proxyPath, g, n, i, c, a.prewarmDepth);
        if (!h.length) return;
        const y = ur();
        if (!y) return;
        let _ = le(a.prewarmPrefetchBytes, k.Defaults.PrewarmPrefetchBytes, 0, Lo);
        for (const S of h) {
          if (_ <= 0) break;
          if (!so(S.upstreamUrl)) continue;
          const T = await Kp(t, S.upstreamUrl), b = ll(l, i, c, S.proxyPath, {
            search: S.proxySearch,
            nodeCacheRevision: u.nodeCacheRevision,
            entryMode: u.entryMode,
            identityPartition: T,
            cachePolicyRevision: ol(S.proxyPath, u)
          });
          if (b) {
            if (y && b) try {
              if (await y.match(b)) continue;
            } catch {
            }
            try {
              const R = await e.runMetadataPrewarmSingleFlight(b, async () => {
                const w = await s(S.upstreamUrl, { method: "GET" });
                w.cache = "no-store";
                const L = new Headers(w.headers);
                L.delete("Range"), L.delete("If-Modified-Since"), L.delete("If-None-Match"), L.set("X-Metadata-Prewarm", "1"), w.headers = L;
                const U = new AbortController();
                w.signal = U.signal;
                const E = le(u.prewarmTimeoutMs, Fu, 250, 1e4), D = setTimeout(() => U.abort(), E);
                try {
                  const A = await Be(S.upstreamUrl.toString(), w);
                  if (A.status !== 200) {
                    try {
                      await A.body?.cancel?.();
                    } catch {
                    }
                    return {
                      cached: !1,
                      bytes: 0
                    };
                  }
                  const x = e.buildBudgetedPrewarmResponse(A, _);
                  if (!x) return {
                    cached: !1,
                    bytes: 0
                  };
                  const O = {
                    isImage: Gr.test(S.proxyPath) || Wr.test(S.proxyPath),
                    isSubtitle: pr.test(S.proxyPath),
                    isManifest: St.test(S.proxyPath)
                  };
                  return {
                    cached: await e.storeMetadataCache(b, x.response, O, {
                      ...u,
                      sourceUrl: S.upstreamUrl
                    }),
                    bytes: x.getBytes()
                  };
                } finally {
                  clearTimeout(D), U.abort();
                }
              });
              !R.joined && R.result && (_ = Math.max(0, _ - (Number(R.result.bytes) || 0)));
            } catch {
            }
          }
        }
      })().catch(() => {
      });
      return d.waitUntil(m), m;
    },
    shouldRetryWithProtocolFallback(t, r = {}) {
      return !(t.status !== 403 || r.isRetry !== !1 || r.protocolFallback !== !0 || r.allowAutomaticRetry !== !0 || r.preparedBodyMode === "stream" || r.stripAuthOnProtocolFallback !== !0);
    },
    async resolveProtocolFallbackRetry(t, r, a) {
      let n = null, s = null;
      try {
        n = await a();
      } catch (l) {
        s = l;
      }
      if (s && $t(s)) {
        try {
          r.body?.cancel?.();
        } catch {
        }
        try {
          t.releaseFetchController?.();
        } catch {
        }
        throw s;
      }
      const i = n?.response || null;
      if (!s && i && (i.status === 101 || i.status < 400)) {
        try {
          r.body?.cancel?.();
        } catch {
        }
        try {
          t.releaseFetchController?.();
        } catch {
        }
        return n;
      }
      if (i) try {
        i.body?.cancel?.();
      } catch {
      }
      try {
        n?.releaseFetchController?.();
      } catch {
      }
      const c = Number(i?.status) || 0;
      return Ae("proxy.protocol_fallback_retry_failed", s || /* @__PURE__ */ new Error(`protocol fallback retry returned ${c || "no_response"}`), {
        upstreamStatus: Number(r?.status) || 0,
        protocolFallbackRetryStatus: c
      }), {
        ...t,
        protocolFallbackRetry: !1,
        protocolFallbackRetryFailed: !0
      };
    },
    resolveResponseStreamIdleTimeoutMs(t) {
      return t?.isManifest === !0 ? k.Defaults.ProxyPlaylistIdleTimeoutMs : t?.isSegment === !0 ? k.Defaults.ProxyStreamIdleTimeoutMs : 0;
    },
    shouldManageProxyResponseBody(t, r) {
      return (t.requestTraits.isSegment === !0 || t.requestTraits.isManifest === !0) && t.requestMethod !== "HEAD" && r.response.status !== 101 && !!r.response.body;
    },
    buildPassthroughProxyResponseBody(t, r) {
      const a = t.requestMethod === "HEAD" ? null : r.response.body;
      try {
        r.releaseFetchController?.();
      } catch {
      }
      return t.requestLifecycle?.dispose?.(), a;
    },
    buildManagedProxyResponseBody(t, r, a) {
      const n = r.response.body, s = t.requestLifecycle, i = a && typeof a == "object" ? a : {
        statusCode: r.response.status,
        category: e.classifyProxyLogCategory(t.requestTraits),
        errorDetail: null,
        detailJson: e.buildStructuredLogDetail(t, { statusCode: r.response.status }, {
          deliveryMode: "proxy",
          redirectMode: "proxied_follow",
          decisionReason: "proxied_follow",
          upstreamHost: r.finalUrl?.hostname || r.activeTargetBase?.hostname || "",
          upstreamStatus: r.response.status
        })
      };
      if (!n || t.requestMethod === "HEAD" || !s) {
        try {
          r.releaseFetchController?.();
        } catch {
        }
        return s?.dispose?.(), t.requestMethod === "HEAD" ? null : n;
      }
      const c = n.getReader(), l = e.resolveResponseStreamIdleTimeoutMs(t.requestTraits, t.upstreamTimeoutMs), d = {
        ...i,
        detailJson: i?.detailJson || e.buildStructuredLogDetail(t, { statusCode: r.response.status }, {
          deliveryMode: "proxy",
          redirectMode: "proxied_follow",
          decisionReason: "proxied_follow",
          protocolFailureReason: r.protocolFallbackRetry === !0 || r.protocolFallbackRetryFailed === !0 ? e.classifyProtocolFailureReason("protocol_fallback", {
            protocolFallbackRetry: !0,
            upstreamStatus: r.response.status
          }) : Number(r.response.status) >= 400 ? e.classifyProtocolFailureReason(i?.errorDetail || r.response.statusText || "", { upstreamStatus: r.response.status }) : null,
          upstreamHost: r.finalUrl?.hostname || r.activeTargetBase?.hostname || "",
          upstreamStatus: r.response.status
        }),
        errorDetail: e.appendLogDiagnosticDetail(i.errorDetail, e.buildStreamDiagnosticDetail(t, r.response, {
          flow: "managed",
          source: "upstream",
          upstreamHost: r.finalUrl?.hostname || r.activeTargetBase?.hostname || "",
          idleTimeoutMs: l
        }))
      };
      let u = !1, f = null, m = null, p = () => {
      }, g = !1;
      const h = (T = {}) => {
        if (g) return;
        g = !0;
        const b = {
          ...d,
          ...$(T) ? T : {}
        };
        b.errorDetail = e.appendLogDiagnosticDetail(T.errorDetail, d.errorDetail), b.detailJson = {
          ...d.detailJson,
          ...T.detailJson && typeof T.detailJson == "object" ? T.detailJson : {},
          protocolFailureReason: T?.detailJson?.protocolFailureReason || (Number(b.statusCode) >= 400 ? e.classifyProtocolFailureReason(b.errorDetail, {
            upstreamStatus: b.statusCode,
            protocolFallbackRetry: d?.detailJson?.protocolFallbackRetry === !0
          }) : d?.detailJson?.protocolFailureReason || null),
          upstreamStatus: Number(b.statusCode) || 0
        }, e.recordAccessLog(t, b);
      }, y = () => {
        m !== null && (clearTimeout(m), m = null);
      }, _ = () => {
        if (!u) {
          u = !0, y();
          try {
            p();
          } catch {
          }
          p = () => {
          };
          try {
            c.releaseLock();
          } catch {
          }
          try {
            r.releaseFetchController?.();
          } catch {
          }
          s.dispose();
        }
      }, S = () => {
        u || l <= 0 || (y(), m = setTimeout(() => s.abort("stream_idle_timeout"), l));
      };
      return p = s.onAbort((T) => {
        u || (y(), T === "stream_idle_timeout" ? h({
          statusCode: 504,
          category: "error",
          errorDetail: `stream_idle_timeout_${l}ms`
        }) : T === "client_aborted" || T === "downstream_cancelled" ? h({
          statusCode: 499,
          category: e.classifyProxyLogCategory(t.requestTraits),
          errorDetail: T
        }) : T && h({
          statusCode: 502,
          category: "error",
          errorDetail: String(T)
        }), Promise.resolve(c.cancel(T)).catch(() => {
        }).finally(() => {
          u || _();
        }));
      }), new ReadableStream({
        pull: async (T) => {
          if (!u)
            return f || (S(), f = (async () => {
              try {
                const { done: b, value: R } = await c.read();
                if (y(), b) {
                  const w = s.getAbortReason();
                  if (_(), w === "stream_idle_timeout") {
                    try {
                      T.error(lr(w, `${l}ms`));
                    } catch {
                    }
                    return;
                  }
                  h(), T.close();
                  return;
                }
                T.enqueue(R), S();
              } catch (b) {
                y();
                const R = s.getAbortReason(), w = R === "stream_idle_timeout" ? lr(R, `${l}ms`) : R ? lr(R) : b;
                if (_(), R === "client_aborted" || R === "downstream_cancelled") {
                  h({
                    statusCode: 499,
                    category: e.classifyProxyLogCategory(t.requestTraits),
                    errorDetail: R
                  });
                  try {
                    T.close();
                  } catch {
                  }
                  return;
                }
                h(R === "stream_idle_timeout" ? {
                  statusCode: 504,
                  category: "error",
                  errorDetail: `stream_idle_timeout_${l}ms`
                } : {
                  statusCode: 502,
                  category: "error",
                  errorDetail: b?.message || String(b)
                });
                try {
                  T.error(w);
                } catch {
                }
              } finally {
                f = null;
              }
            })(), f);
        },
        cancel: async (T) => {
          if (!u) {
            s.abort("downstream_cancelled"), y();
            try {
              await c.cancel(T);
            } catch {
            }
            h({
              statusCode: 499,
              category: e.classifyProxyLogCategory(t.requestTraits),
              errorDetail: "downstream_cancelled"
            }), _();
          }
        }
      });
    }
  };
}
function xg(o = {}, e = {}) {
  return {
    async performFetchWithTimeout(t, r, a = {}) {
      const n = await r(t, a), s = Math.max(0, Number(a.timeoutMs) || 0), i = a.requestLifecycle || null;
      let c = null, l = null, d = !1, u = () => {
      };
      (s > 0 || i) && (l = new AbortController(), n.signal = l.signal, i && (u = i.setActiveFetchController(l)), s > 0 && (c = setTimeout(() => {
        d = !0, l.abort(`upstream_timeout_${s}ms`);
      }, s)));
      try {
        return {
          response: await Be(t.toString(), n),
          finalUrl: t,
          releaseFetchController: u
        };
      } catch (f) {
        if (u(), d) {
          const m = /* @__PURE__ */ new Error(`upstream_timeout_${s}ms`);
          throw m.code = "UPSTREAM_TIMEOUT", m;
        }
        if (i && $t(f)) {
          const m = i.getAbortReason();
          if (m) throw lr(m);
        }
        throw f;
      } finally {
        c !== null && clearTimeout(c);
      }
    },
    async performUpstreamFetch(t, r, a, n, s = {}) {
      const i = s.useFastSegmentBuilder === !0, c = i ? new URL(_p(t, r, a?.search || "")) : hr(t, r);
      return i || (c.search = a.search), {
        ...await e.performFetchWithTimeout(c, n, s),
        targetRecord: t
      };
    },
    async fetchAbsoluteWithRetryLoop(t) {
      let r = null;
      const a = t.absoluteUrl instanceof URL ? new URL(t.absoluteUrl.toString()) : new URL(String(t.absoluteUrl || "")), n = Math.max(1, le(t.maxExtraAttempts, Bn, 0, 3) + 1);
      for (let s = 0; s < n; s++) {
        const i = t.isRetry === !0 || s > 0;
        try {
          const c = await e.performFetchWithTimeout(a, t.buildFetchOptions, {
            ...t.fetchOptions,
            isRetry: i,
            protocolFallbackRetry: t.protocolFallbackRetry === !0,
            stripAuthOnProtocolFallback: t.stripAuthOnProtocolFallback === !0,
            timeoutMs: t.upstreamTimeoutMs,
            requestLifecycle: t.requestLifecycle
          }), l = c.response;
          if (l.status === 101) return {
            ...c,
            protocolFallbackRetry: t.protocolFallbackRetry === !0
          };
          if (e.shouldRetryWithProtocolFallback(l, {
            ...t,
            isRetry: i
          })) return await e.resolveProtocolFallbackRetry(c, l, () => e.fetchAbsoluteWithRetryLoop({
            ...t,
            isRetry: !0,
            protocolFallbackRetry: !0
          }));
          const d = s === n - 1;
          if (t.allowAutomaticRetry !== !0 || !t.retryableStatuses.has(l.status) || d) return {
            ...c,
            protocolFallbackRetry: t.protocolFallbackRetry === !0
          };
          try {
            l.body?.cancel?.();
          } catch {
          }
          try {
            c.releaseFetchController?.();
          } catch {
          }
        } catch (c) {
          r = c;
          const l = s === n - 1;
          if (t.allowAutomaticRetry !== !0 || l)
            throw c && typeof c == "object" && (c.lastFinalUrl = a), c;
        }
      }
      throw r && typeof r == "object" && (r.lastFinalUrl = a), r || /* @__PURE__ */ new Error("redirect_fetch_failed");
    },
    async fetchUpstreamWithRetryLoop(t) {
      let r = null, a = Array.isArray(t.retryTargetRecords) ? t.retryTargetRecords.slice() : [], n = a[0], s = hr(n, t.proxyPath);
      s.search = t.requestUrl.search;
      const i = Math.max(1, le(t.maxExtraAttempts, Bn, 0, 3) + 1);
      for (let c = 0; c < i; c++) for (let l = 0; l < a.length; l++) {
        const d = a[l];
        n = d;
        const u = t.isRetry === !0 || c > 0;
        try {
          const f = await e.performUpstreamFetch(d, t.proxyPath, t.requestUrl, t.buildFetchOptions, {
            isRetry: u,
            protocolFallbackRetry: t.protocolFallbackRetry === !0,
            stripAuthOnProtocolFallback: t.stripAuthOnProtocolFallback === !0,
            timeoutMs: t.upstreamTimeoutMs,
            requestLifecycle: t.requestLifecycle,
            useFastSegmentBuilder: t.segmentFastPathEnabled === !0 && u !== !0 && t.protocolFallbackRetry !== !0
          });
          s = f.finalUrl;
          const m = f.response;
          if (m.status === 101) return {
            ...f,
            protocolFallbackRetry: t.protocolFallbackRetry === !0
          };
          if (e.shouldRetryWithProtocolFallback(m, {
            ...t,
            isRetry: u
          })) return await e.resolveProtocolFallbackRetry(f, m, () => e.fetchUpstreamWithRetryLoop({
            ...t,
            isRetry: !0,
            protocolFallbackRetry: !0
          }));
          const p = l === a.length - 1, g = c === i - 1;
          if (t.allowAutomaticRetry !== !0 || !t.retryableStatuses.has(m.status) || p && g) return {
            ...f,
            protocolFallbackRetry: t.protocolFallbackRetry === !0
          };
          const h = await e.maybeRunForegroundFailoverWait(t, {
            targetRecord: d,
            responseStatus: m.status,
            reason: `upstream_status_${m.status}`
          });
          if (h?.upstream) {
            const y = h.upstream;
            n = y.targetRecord || d, s = y.finalUrl || s;
            const _ = y.response;
            if (_.status === 101) return {
              ...y,
              protocolFallbackRetry: t.protocolFallbackRetry === !0
            };
            if (!t.retryableStatuses.has(_.status)) return {
              ...y,
              protocolFallbackRetry: t.protocolFallbackRetry === !0
            };
          } else h?.error && (r = h.error);
          try {
            m.body?.cancel?.();
          } catch {
          }
          try {
            f.releaseFetchController?.();
          } catch {
          }
          if (t.execution?.failoverContext?.eligible) {
            const y = e.getFailoverStateSnapshot(t.execution.failoverContext.cacheKey, t.execution.failoverContext.preferredTtlMs);
            a = e.reorderRetryTargetsForFailover(t.execution.failoverContext.originalTargetRecords, y);
          }
        } catch (f) {
          r = f;
          const m = String(f?.code || "").trim().toUpperCase();
          if (![
            "CLIENT_ABORTED",
            "DOWNSTREAM_CANCELLED",
            "REQUEST_ABORTED"
          ].includes(m)) {
            const h = await e.maybeRunForegroundFailoverWait(t, {
              targetRecord: d,
              reason: m || "network_error"
            });
            if (h?.upstream) {
              const y = h.upstream;
              n = y.targetRecord || d, s = y.finalUrl || s;
              const _ = y.response;
              if (_.status === 101) return {
                ...y,
                protocolFallbackRetry: t.protocolFallbackRetry === !0
              };
              if (!t.retryableStatuses.has(_.status)) return {
                ...y,
                protocolFallbackRetry: t.protocolFallbackRetry === !0
              };
            } else h?.error && (r = h.error);
            if (t.execution?.failoverContext?.eligible) {
              const y = e.getFailoverStateSnapshot(t.execution.failoverContext.cacheKey, t.execution.failoverContext.preferredTtlMs);
              a = e.reorderRetryTargetsForFailover(t.execution.failoverContext.originalTargetRecords, y);
            }
          }
          const p = l === a.length - 1, g = c === i - 1;
          if (p && g)
            throw f && typeof f == "object" && (f.lastFinalUrl = s, f.lastTargetRecord = n, f.lastTargetBase = n?.targetUrl || null), f;
        }
      }
      throw r && typeof r == "object" && (r.lastFinalUrl = s, r.lastTargetRecord = n, r.lastTargetBase = n?.targetUrl || null), r || /* @__PURE__ */ new Error("upstream_fetch_failed");
    }
  };
}
function Og(o = {}, e = {}) {
  const { Logger: t } = o;
  return {
    recordAccessLog(r, a = {}) {
      const n = {
        nodeName: r.nodeName,
        requestPath: r.proxyPath,
        requestMethod: r.requestMethod,
        responseTime: Date.now() - r.startTime,
        clientIp: r.clientIp || "unknown",
        inboundColo: r.logInboundColo || "UNKNOWN",
        outboundColo: a.outboundColo || a.outboundIp || r.defaultOutboundColo || "",
        userAgent: r.request.headers.get("User-Agent"),
        referer: r.request.headers.get("Referer"),
        runtimeConfig: r.currentConfig,
        ...a
      };
      t.record(r.env, r.ctx, n);
    },
    buildOptionsResponse(r) {
      const a = new Headers(r.dynamicCors);
      return Ce(a), r.finalOrigin !== "*" && Ur(a, "Origin"), new Response(null, { headers: a });
    }
  };
}
function vg(o = {}, e = {}) {
  return {
    ...Mg(o, e),
    ...Pg(o, e),
    ...xg(o, e),
    ...Og(o, e)
  };
}
var Qs = 4096, Fg = 1440 * 60 * 1e3, Ug = 60 * 1e3;
function Zs(o, e, t) {
  const r = new URL(o.toString());
  return r.searchParams.delete("AnyProviderIdEquals"), r.searchParams.set("SearchTerm", e), /^\d{4}$/.test(t) ? r.searchParams.set("Years", t) : r.searchParams.delete("Years"), r;
}
async function kg(o, e = {}, t = {}) {
  const r = o?.searchParams?.get?.("AnyProviderIdEquals")?.match(/tmdb\.(\d+)/i);
  if (!r) return null;
  const a = String(t?.tmdbApiReadToken || "").trim(), n = String(t?.tmdbApiV3Key || "").trim(), s = String(e?.TMDB_API_READ_TOKEN || "").trim(), i = String(e?.TMDB_API_KEY || "").trim(), c = !!(a || n), l = c ? a : s, d = c ? n : i;
  if (!l && !d) return null;
  c && (s || i) && We.TmdbCredentialOverrideWarned !== !0 && (We.TmdbCredentialOverrideWarned = !0, Ae("tmdb.credentials_override", "account settings TMDB credentials override TMDB_* environment variables", {
    configReadToken: a ? "set" : "unset",
    configApiKey: n ? "set" : "unset",
    envReadToken: s ? "set" : "unset",
    envApiKey: i ? "set" : "unset"
  }));
  const u = String(o.searchParams.get("IncludeItemTypes") || "").toLowerCase();
  if (u.includes("episode") || u.includes("season")) return null;
  const f = u.includes("movie"), m = f ? "movie" : "tv", p = String(t?.tmdbLanguage || e?.TMDB_LANGUAGE || "zh-CN").trim() || "zh-CN", g = `${p}:${m}:${r[1]}`, h = te.TmdbLookupCache.get(g);
  if (h && Number(h.expiresAt) > H())
    return h.failed === !0 ? null : Zs(o, h.title, h.year);
  const y = () => Ie(te.TmdbLookupCache, g, {
    failed: !0,
    expiresAt: H() + Ug
  }, Qs), _ = new URL(`https://api.themoviedb.org/3/${m}/${r[1]}`);
  _.searchParams.set("language", p), d && !l && _.searchParams.set("api_key", d);
  const S = new Headers({ accept: "application/json" });
  l && S.set("Authorization", `Bearer ${l}`);
  const T = new AbortController(), b = setTimeout(() => T.abort("tmdb_timeout"), 5e3);
  try {
    const R = await fetch(_, {
      headers: S,
      signal: T.signal
    });
    if (!R.ok)
      return console.warn(`TMDB ${m} lookup failed: ${R.status}`), y(), null;
    const w = await R.json(), L = String(f ? w?.title || "" : w?.name || "").trim(), U = String(f ? w?.release_date || "" : w?.first_air_date || "").slice(0, 4);
    return L ? (Ie(te.TmdbLookupCache, g, {
      title: L,
      year: U,
      expiresAt: H() + Fg
    }, Qs), Zs(o, L, U)) : (y(), null);
  } catch (R) {
    return console.warn("TMDB request conversion failed:", R?.message || R), y(), null;
  } finally {
    clearTimeout(b);
  }
}
function Hg(o = {}, e = {}) {
  const { CacheManager: t } = o, r = new Pl({
    entries: te.PlaybackInfoResponseCache,
    now: H,
    maxEntries: k.Defaults.PlaybackInfoCacheMax,
    maxEntryBytes: wo,
    maxTotalBytes: Hu
  });
  return {
    async prepareExecutionContext(a, n, s, i, c, l, d, u = {}) {
      const f = Date.now(), m = a.method;
      if (t.maybeCleanup(l), !n || !n.target) return { invalidResponse: new Response("Invalid Node", {
        status: 502,
        headers: Ce(new Headers())
      }) };
      const p = $(u.runtimeConfig) ? u.runtimeConfig : await Re(l), g = u.requestUrl || new URL(a.url), h = u.runtimeRouteContext && typeof u.runtimeRouteContext == "object" ? u.runtimeRouteContext : null, y = typeof h?.requestHost == "string" ? h.requestHost : re(g.hostname), _ = typeof h?.configuredHost == "string" ? h.configuredHost : ze(l), S = typeof h?.configuredLegacyHost == "string" ? h.configuredLegacyHost : Kr(l), T = nr(u.entryMode || n?.entryMode), b = String(u.routeKindOverride || "").trim(), R = !!(S && S !== _ && y && y === S), w = {
        requestHost: y,
        configuredHost: _,
        configuredLegacyHost: S,
        isLegacyHostRequest: R,
        routeKind: b || (R ? "legacy_host_kv_route" : T === "host_prefix" ? "host_prefix" : "kv_route")
      }, L = Y(s), U = String(u?.pathNormalizationState?.kind || "").trim(), E = a.headers.get("cf-connecting-ip") || "unknown", D = oa(a), A = E, x = a.cf?.country || "UNKNOWN", O = e.resolveCorsOrigin(p, a), N = Yr(l, a, O), v = Yi(u.linkVariant), P = Dp(L, g);
      if (P?.error) return { invalidResponse: new Response("Invalid Playback Relay", {
        status: 400,
        headers: Ce(new Headers(N))
      }) };
      const C = g.searchParams.has("__pb_abs") && (!!P || ya(L));
      let I = g;
      const M = P?.visibleProxyPath || L, F = P?.targetUrl instanceof URL ? P.targetUrl.pathname : "";
      if (ga(M) || F && ga(F)) return { invalidResponse: Sn(m, N) };
      if ((P || C) && (I = new URL(g)), P) {
        I.searchParams.delete(Xi);
        const ge = Vc(g, i, c, M, {
          linkVariant: v,
          entryMode: u.entryMode
        });
        I.pathname = ge.pathname;
      }
      if (C && I.searchParams.delete(Vn), n.tmdbAggregationEnabled === !0 && (m === "GET" || m === "HEAD")) {
        const ge = await kg(I, l, p);
        ge && (I = ge);
      }
      const V = lm(n, p, i), j = e.classifyRequest(a, M, I, p, {
        nodeDirectSource: V,
        directStaticAssets: p.directStaticAssets === !0,
        directHlsDash: p.directHlsDash === !0
      }), K = xd(n, p), q = Rp(K), de = K === "rewrite" && P?.targetUrl instanceof URL ? "proxy" : "", he = v !== "main" ? "link_variant_force_proxy" : de ? "rewrite_playback_entry_proxy" : "", fe = !!he, ie = fe ? {
        ...j,
        nodeDirectMedia: !1,
        directStaticAssets: !1,
        directHlsDash: !1,
        legacyEntryOffloadEnabled: !1,
        legacyEntryOffloadReason: "",
        direct307Mode: !1,
        enablePrewarm: p.enablePrewarm !== !1,
        isMetadataCacheable: m === "GET" && j.isWsUpgrade !== !0 && (j.isImage === !0 || j.isSubtitle === !0 || j.isManifest === !0)
      } : j, me = dm(p), Me = p.protocolFallback !== !1, Ue = le(p.upstreamTimeoutMs, Mu, 0, 18e4), et = le(p.upstreamRetryAttempts, Bn, 0, 3), Et = p.hedgeFailoverEnabled === !0, Jr = p.hedgeProbePreferGet !== !1, Le = vd(n, p), Qr = le(p.hedgeProbeTimeoutMs, Co, 250, 1e4), tt = le(p.hedgeProbeParallelism, Li, 1, 2), rt = le(p.hedgeWaitTimeoutMs, Ni, 250, 1e4), yr = le(p.hedgeLockTtlMs, Di, 1e3, 1e4), Zr = le(p.hedgePreferredTtlSec, na, 30, 3600), ke = le(p.hedgeFailureCooldownSec, Ii, 1, 300), Xt = le(p.hedgeWakeJitterMs, Mi, 0, 1e3), lt = le(p.cacheTtlImages, Oi, 0, 365) * 86400, ut = me.enableH3 === !0, xt = me.forceH1 === !0, Tt = p.playbackInfoCacheEnabled !== !1, Ot = le(p.playbackInfoCacheTtlSec, ku, 0, 60), Yt = p.videoProgressForwardEnabled !== !1, Rt = le(p.videoProgressForwardIntervalSec, xi, 0, 60), Sr = Od(n, p), vt = Pd(n, p), Ft = String(u.nodeCacheRevision || "").trim() || oo(i, n), B = ie.isMetadataCacheable ? await nl(a) : "", G = ie.isMetadataCacheable ? ol(M, {
        imageCacheMaxAge: lt,
        prewarmCacheTtl: ie.prewarmCacheTtl
      }) : "", X = ie.isMetadataCacheable && so(I) ? ll(I, i, c, M, {
        search: I.search,
        nodeCacheRevision: Ft,
        entryMode: u.entryMode,
        identityPartition: B,
        cachePolicyRevision: G
      }) : null, W = X ? ur() : null, Z = Sd(n, p), oe = e.getRoutingDecision({
        phase: "entry",
        request: a,
        requestUrl: I,
        proxyPath: M,
        requestTraits: ie,
        currentConfig: p,
        node: n,
        nodeName: i,
        nodeKey: c,
        linkVariant: v,
        forceWorkerProxy: fe,
        forceWorkerProxyReason: he,
        routingDecisionMode: Z
      });
      return {
        request: a,
        requestMethod: m,
        node: n,
        nodeName: i,
        nodeKey: c,
        entryMode: T,
        env: l,
        ctx: d,
        startTime: f,
        currentConfig: p,
        rawRequestUrl: g,
        requestUrl: I,
        requestOrigin: g.origin,
        rawProxyPath: L,
        proxyPath: M,
        linkVariant: v,
        forceWorkerProxy: fe,
        forceWorkerProxyReason: he,
        clientIp: A,
        inboundIp: E,
        logInboundColo: D,
        country: x,
        finalOrigin: O,
        dynamicCors: N,
        routeContextDiagnostics: w,
        requestTraits: ie,
        protocolStrategy: me.strategy,
        routingDecisionMode: Z,
        entryRoutingDecision: oe,
        enableH3: ut,
        forceH1: xt,
        protocolFallback: Me,
        upstreamTimeoutMs: Ue,
        upstreamRetryAttempts: et,
        hedgeFailoverEnabled: Et,
        hedgeProbePreferGet: Jr,
        hedgeProbePath: Le,
        hedgeProbeTimeoutMs: Qr,
        hedgeProbeParallelism: tt,
        hedgeWaitTimeoutMs: rt,
        hedgeLockTtlMs: yr,
        hedgePreferredTtlSec: Zr,
        hedgeFailureCooldownSec: ke,
        hedgeWakeJitterMs: Xt,
        playbackInfoCacheEnabled: Tt,
        playbackInfoCacheTtlSec: Ot,
        effectivePlaybackInfoMode: K,
        playbackInfoRewriteUrlMode: q,
        playbackInfoCacheState: ie.isPlaybackInfoRequest === !0 ? Tt && Ot > 0 ? "miss" : "skip" : "",
        playbackInfoCacheKey: "",
        playbackInfoRewrite: ie.isPlaybackInfoRequest === !0 && K === "passthrough" ? "passthrough" : "",
        playbackAbsoluteFallbackEligible: C,
        playbackAbsoluteFallbackLocation: C ? Ap(L, g) : "",
        playbackUrlMode: C ? "absolute" : ie.isPlaybackInfoRequest === !0 && K === "rewrite" ? String(q || "relative") : "",
        playbackFallback: C ? "none" : "",
        playbackPathFix: U,
        rewritePlaybackEntry: de,
        playbackRelayTargetUrl: P?.targetUrl instanceof URL ? P.targetUrl : null,
        targetHotCacheState: String(u.targetHotCacheState || "").trim() || (ie.isPlaybackCriticalRequest === !0 ? "miss" : "skip"),
        nodeCacheState: String(u.nodeCacheState || "").trim(),
        playbackRouteHotTargetRecords: Array.isArray(u.cachedTargetRecords) ? u.cachedTargetRecords : null,
        videoProgressForwardEnabled: Yt,
        videoProgressForwardIntervalSec: Rt,
        effectiveRealClientIpMode: Sr,
        effectiveMediaAuthMode: vt,
        nodeDerivedCacheRevision: Ft,
        failoverContext: null,
        failoverTelemetry: null,
        failoverForegroundWaitUsed: !1,
        progressForwardMode: "",
        progressForwardSessionKey: "",
        imageCacheMaxAge: lt,
        metadataCacheKey: X,
        metadataCache: W,
        metadataCacheIdentityPartition: B,
        metadataCachePolicyRevision: G,
        redirectTrace: null
      };
    },
    cleanupPlaybackInfoResponseCache(a = H()) {
      r.cleanup(a);
    },
    buildPlaybackInfoAuthSignature(a, n = null) {
      const s = a?.requestUrl instanceof URL ? a.requestUrl : null, i = n?.newHeaders || a?.request?.headers || null, c = qo(i), l = jo(ve(i, "Cookie"), pa);
      return Yo([
        s ? ne(s.searchParams.get("api_key") || s.searchParams.get("ApiKey") || s.searchParams.get("X-Emby-Token") || s.searchParams.get("X-MediaBrowser-Token") || "") : "",
        c?.token ? ne(c.token) : "",
        c?.deviceId ? ne(c.deviceId) : "",
        ve(i, "Authorization") ? ne(ve(i, "Authorization")) : "",
        ve(i, "X-Emby-Authorization") ? ne(ve(i, "X-Emby-Authorization")) : "",
        ve(i, "X-MediaBrowser-Authorization") ? ne(ve(i, "X-MediaBrowser-Authorization")) : "",
        l ? ne(l) : ""
      ]);
    },
    buildPlaybackInfoCacheKey(a, n = null) {
      if (a?.requestTraits?.isPlaybackInfoRequest !== !0) return "";
      if (a.playbackInfoCacheEnabled !== !0 || Number(a.playbackInfoCacheTtlSec) <= 0)
        return a.playbackInfoCacheState = "skip", a.playbackInfoCacheKey = "", "";
      const s = a.requestMethod;
      if (s !== "GET" && s !== "HEAD" && n?.preparedBodyMode !== "buffered")
        return a.playbackInfoCacheState = "skip", a.playbackInfoCacheKey = "", "";
      const i = n?.preparedBodyMode === "buffered" ? String(n?.preparedBodyText || co(n?.preparedBody)) : "", c = `playback-info:${Yo([
        String(a?.nodeName || "").trim(),
        String(a?.nodeDerivedCacheRevision || "").trim(),
        s,
        String(a?.proxyPath || "").trim(),
        String(a?.requestUrl?.search || "").trim(),
        i ? ne(i) : "",
        e.buildPlaybackInfoAuthSignature(a, n),
        Gt(a?.effectivePlaybackInfoMode),
        String(a?.playbackInfoRewriteUrlMode || "relative")
      ])}`;
      return a.playbackInfoCacheKey = c, c;
    },
    async storePlaybackInfoResponseCache(a, n, s = null, i = null) {
      if (a?.requestTraits?.isPlaybackInfoRequest !== !0) return !1;
      const c = a.playbackInfoCacheKey || e.buildPlaybackInfoCacheKey(a, s);
      return !c || !rr(i) || i.response !== n ? !1 : r.set(c, i, {
        nodeName: String(a?.nodeName || "").trim().toLowerCase(),
        nodeRevision: String(a?.nodeDerivedCacheRevision || "").trim(),
        playbackInfoRewrite: String(a?.playbackInfoRewrite || "").trim(),
        ttlMs: Math.max(0, Number(a?.playbackInfoCacheTtlSec) || 0) * 1e3
      });
    },
    async tryServePlaybackInfoResponseCache(a, n = null) {
      if (a?.requestTraits?.isPlaybackInfoRequest !== !0) return null;
      const s = e.buildPlaybackInfoCacheKey(a, n);
      if (!s) return null;
      const i = r.get(s);
      if (!i)
        return a.playbackInfoCacheState = a.playbackInfoCacheState === "skip" ? "skip" : "miss", null;
      const c = i.metadata, l = i.representation, d = l.response, u = l.bodyText;
      a.playbackInfoCacheState = "hit", a.playbackInfoRewrite = String(c?.playbackInfoRewrite || a?.playbackInfoRewrite || "").trim();
      const f = e.buildProxyResponseHeaders(d, a.request, a.dynamicCors, a.finalOrigin, a.requestTraits, {
        enableH3: a.enableH3,
        forceH1: a.forceH1,
        imageCacheMaxAge: a.imageCacheMaxAge
      }), m = e.appendLogDiagnosticDetail(e.extractProxyErrorDetail(d), e.buildRuntimeDiagnosticDetail(a));
      return e.recordAccessLog(a, {
        statusCode: d.status,
        category: e.classifyProxyLogCategory(a.requestTraits),
        errorDetail: m,
        detailJson: e.buildStructuredLogDetail(a, { statusCode: d.status }, {
          deliveryMode: "proxy",
          redirectMode: "playback_info_cache",
          decisionReason: "playback_info_cache_hit",
          playbackInfoCache: a.playbackInfoCacheState,
          playbackInfoCacheTtlSec: a.playbackInfoCacheTtlSec,
          upstreamStatus: d.status
        }),
        outboundColo: ""
      }), new Response(a.requestMethod === "HEAD" ? null : u, {
        status: d.status,
        statusText: d.statusText,
        headers: f
      });
    }
  };
}
function $g(o = {}, e = {}) {
  return {
    parsePlaybackSessionControlPayload(t, r = null) {
      if (t?.playbackSessionControlPayload) return t.playbackSessionControlPayload;
      const a = t?.requestUrl instanceof URL ? t.requestUrl : null, n = {};
      if (a) for (const [d, u] of a.searchParams.entries()) {
        const f = String(d || "").trim().toLowerCase();
        !f || n[f] !== void 0 || (n[f] = u);
      }
      const s = {
        query: n,
        body: {},
        parseError: !1,
        parseMode: "query_only",
        parseErrorReason: ""
      }, i = t.requestMethod;
      if (i === "GET" || i === "HEAD")
        return t && (t.playbackSessionControlPayload = s), s;
      if (r?.preparedBodyMode === "stream")
        return s.parseError = !0, s.parseMode = "stream", s.parseErrorReason = "unbuffered_body", t && (t.playbackSessionControlPayload = s), s;
      const c = String(r?.preparedBodyText || co(r?.preparedBody));
      if (!c.trim())
        return t && (t.playbackSessionControlPayload = s), s;
      const l = String(r?.newHeaders?.get("Content-Type") || t?.request?.headers?.get("Content-Type") || "").toLowerCase().split(";", 1)[0].trim();
      try {
        if (l === "application/json" || l === "text/json" || l === "text/plain" || /^application\/[a-z0-9!#$&^_.+-]+\+json$/i.test(l)) {
          const d = JSON.parse(c);
          if (!$(d)) throw new TypeError("playback_control_body_not_object");
          s.body = Ki(d), s.parseMode = l === "text/plain" ? "text_plain_json" : "json";
        } else if (l === "application/x-www-form-urlencoded") {
          const d = {};
          for (const [u, f] of new URLSearchParams(c).entries()) {
            const m = String(u || "").trim().toLowerCase();
            !m || d[m] !== void 0 || (d[m] = f);
          }
          s.body = d, s.parseMode = "form";
        } else
          s.parseError = !0, s.parseMode = "unsupported", s.parseErrorReason = "unsupported_content_type";
      } catch {
        s.parseError = !0, s.parseMode = l === "text/plain" ? "text_plain_invalid" : "invalid", s.parseErrorReason = "invalid_body";
      }
      return t && (t.playbackSessionControlPayload = s), s;
    },
    resolvePlaybackProgressSessionKey(t, r = null) {
      const a = e.parsePlaybackSessionControlPayload(t, r), n = (g = []) => {
        const h = fs(a.query, g);
        if (String(h || "").trim()) return String(h).trim();
        const y = fs(a.body, g);
        return String(y || "").trim();
      }, s = n(["SessionId"]), i = n(["PlaySessionId"]), c = n(["DeviceId"]), l = n(["ItemId"]), d = String(t?.nodeName || "unknown").trim().toLowerCase() || "unknown";
      let u = "", f = "", m = "weak";
      if (s)
        u = `session:${s}`, f = `session:${s}`, m = "strong";
      else if (i)
        u = `play:${i}`, f = `play:${i}`, m = "strong";
      else if (c)
        u = `device-item:${c}:${l}`, f = `device:${c}`;
      else {
        const g = t?.request?.headers;
        u = `fallback:${bn([
          g?.get?.("Authorization"),
          g?.get?.("X-Emby-Token"),
          g?.get?.("X-MediaBrowser-Token"),
          g?.get?.("X-Emby-Device-Id"),
          c,
          t?.clientIp,
          l
        ].map((h) => String(h || "").trim()).join("|"))}`, f = u;
      }
      const p = bn(`${d}|${f}`);
      return {
        sessionKey: `${d}|${u}`,
        sessionIdentityFingerprint: p,
        sessionFingerprint: bn(`${p}|${l}`),
        sessionStrength: m,
        itemId: l,
        parseError: a.parseError === !0
      };
    }
  };
}
function Bg(o = {}, e = {}) {
  return {
    buildPlaybackProgressRelayEntry(t = 0, r = null) {
      return {
        lastForwardAt: 0,
        lastTouchedAt: H(),
        intervalMs: Math.max(0, Number(t) || 0),
        waitUntilCtx: r || null,
        nodeName: "",
        nodeRevision: "",
        pendingSnapshot: null,
        scheduledFlushAt: 0,
        scheduledPromise: null,
        cancelScheduledDelay: null,
        activeFlushPromise: null,
        terminalState: "",
        terminalAt: 0,
        terminalTombstoneUntil: 0
      };
    },
    getPlaybackProgressRelayTerminalTtlMs(t = 0) {
      return Math.max(600 * 1e3, Math.max(1, Number(t) || 0) * 20);
    },
    isPlaybackProgressRelayTerminal(t, r = H()) {
      return !t || String(t.terminalState || "").trim().toLowerCase() !== "stopped" ? !1 : Number(t.terminalTombstoneUntil || 0) > r;
    },
    markPlaybackProgressRelayStopped(t, r) {
      const a = te.PlaybackProgressRelay;
      if (!(a instanceof Map) || !t) return null;
      const n = Math.max(0, Number(r?.videoProgressForwardIntervalSec) || 0) * 1e3, s = a.get(t) || e.buildPlaybackProgressRelayEntry(n, r?.ctx || null), i = H();
      s.intervalMs = n > 0 ? n : Math.max(0, Number(s.intervalMs) || 0), s.waitUntilCtx = r?.ctx || s.waitUntilCtx || null, s.nodeName = String(r?.nodeName || s.nodeName || "").trim().toLowerCase(), s.nodeRevision = String(r?.nodeDerivedCacheRevision || s.nodeRevision || "").trim();
      try {
        s.cancelScheduledDelay?.();
      } catch {
      }
      return s.cancelScheduledDelay = null, s.scheduledPromise = null, s.pendingSnapshot = null, s.scheduledFlushAt = 0, s.terminalState = "stopped", s.terminalAt = i, s.terminalTombstoneUntil = i + e.getPlaybackProgressRelayTerminalTtlMs(s.intervalMs), s.lastTouchedAt = i, Bs(t, s) ? s : (ao(s), null);
    },
    cleanupPlaybackProgressRelay(t = H()) {
      const r = te.PlaybackProgressRelay;
      if (!(r instanceof Map) || r.size <= 0) return;
      const a = Math.max(3e4, Math.max(1, Number(xi) || 1) * 2e4);
      for (const [s, i] of r) {
        const c = Number(i?.lastTouchedAt || i?.lastForwardAt || 0) || 0, l = !!i?.pendingSnapshot || !!i?.activeFlushPromise, d = Number(i?.terminalTombstoneUntil || 0) || 0;
        if (d > 0) {
          !l && d <= t && tr(s);
          continue;
        }
        !l && c > 0 && c + a <= t && tr(s);
      }
      const n = Math.max(1, Number(k.Defaults.VideoProgressForwardSessionMax) || 1);
      for (; r.size > n; ) {
        let s = "";
        for (const [i, c] of r) if (!c?.activeFlushPromise) {
          s = i;
          break;
        }
        if (!s) break;
        tr(s);
      }
    },
    buildPlaybackProgressSnapshot(t, r, a, n) {
      if (!t || !r || typeof a != "function" || !Ze(n) || (r.preparedBodyMode === "buffered" && Number(r.preparedBody?.byteLength) || 0) > $u) return null;
      const s = r.preparedBodyMode === "buffered" && r.preparedBody ? r.preparedBody.slice(0) : r.preparedBody;
      return {
        ctx: t.ctx,
        nodeName: String(t.nodeName || "").trim().toLowerCase(),
        nodeRevision: String(t.nodeDerivedCacheRevision || "").trim(),
        targetRecord: n,
        proxyPath: String(t.proxyPath || "/"),
        requestUrl: new URL(t.requestUrl.toString()),
        buildFetchOptions: a,
        requestMethod: String(t.request?.method || "POST").toUpperCase(),
        preparedBodyMode: r.preparedBodyMode,
        preparedBody: s,
        upstreamTimeoutMs: t.upstreamTimeoutMs
      };
    },
    schedulePlaybackProgressRelayFlush(t, r) {
      if (!r?.pendingSnapshot || r?.scheduledFlushAt > 0 || e.isPlaybackProgressRelayTerminal(r)) return;
      const a = Math.max(0, Number(r.intervalMs) || 0);
      if (a <= 0) return;
      const n = Math.max(H(), Number(r.lastForwardAt) || 0) + a;
      r.scheduledFlushAt = n, r.lastTouchedAt = H();
      const s = Hl(Math.max(0, n - H())), i = (async () => {
        if (!await s.promise) return;
        const l = te.PlaybackProgressRelay.get(t);
        !l || l !== r || Number(l.scheduledFlushAt) !== n || (l.scheduledFlushAt = 0, await e.flushPlaybackProgressRelayEntry(t, {
          background: !0,
          attachToCtx: !1
        }));
      })().finally(() => {
        r.scheduledPromise === i && (r.scheduledPromise = null, r.cancelScheduledDelay = null);
      });
      r.scheduledPromise = i, r.cancelScheduledDelay = s.cancel;
      const c = r.waitUntilCtx || r.pendingSnapshot?.ctx || null;
      c?.waitUntil && c.waitUntil(i);
    },
    async forwardPlaybackProgressSnapshot(t) {
      if (!t) return null;
      const r = await e.performUpstreamFetch(t.targetRecord, t.proxyPath, t.requestUrl, t.buildFetchOptions, {
        method: t.requestMethod,
        bodyMode: t.preparedBodyMode,
        body: t.preparedBody,
        timeoutMs: t.upstreamTimeoutMs
      });
      try {
        try {
          await r.response.body?.cancel?.();
        } catch {
        }
      } finally {
        try {
          r.releaseFetchController?.();
        } catch {
        }
      }
      return r.response;
    },
    async flushPlaybackProgressRelayEntry(t, r = {}) {
      const a = te.PlaybackProgressRelay, n = a.get(t);
      if (!n || e.isPlaybackProgressRelayTerminal(n)) return !1;
      if (n.activeFlushPromise) {
        if (r.background === !0) return !1;
        try {
          await n.activeFlushPromise;
        } catch {
        }
      }
      if (!n.pendingSnapshot) return !1;
      const s = n.pendingSnapshot;
      n.pendingSnapshot = null;
      try {
        n.cancelScheduledDelay?.();
      } catch {
      }
      n.cancelScheduledDelay = null, n.scheduledPromise = null, n.scheduledFlushAt = 0, n.lastForwardAt = H(), n.lastTouchedAt = n.lastForwardAt;
      const i = (async () => {
        try {
          return await e.forwardPlaybackProgressSnapshot(s), !0;
        } catch {
          const c = a.get(t);
          return c && c === n && !c.pendingSnapshot && (c.pendingSnapshot = s, c.lastForwardAt = H(), c.lastTouchedAt = c.lastForwardAt), !1;
        } finally {
          const c = a.get(t);
          c && c === n && (c.activeFlushPromise = null, c.lastTouchedAt = H(), c.pendingSnapshot && e.schedulePlaybackProgressRelayFlush(t, c));
        }
      })();
      return n.activeFlushPromise = i, r.attachToCtx === !0 && n.waitUntilCtx?.waitUntil && n.waitUntilCtx.waitUntil(i), await i === !0;
    },
    async flushPlaybackProgressBeforeStopped(t) {
      const r = String(t?.progressForwardSessionKey || "").trim();
      if (!r) return !1;
      const a = te.PlaybackProgressRelay.get(r);
      if (!a) return !1;
      if (a.activeFlushPromise) try {
        await a.activeFlushPromise;
      } catch {
      }
      if (!a.pendingSnapshot) return !1;
      try {
        a.cancelScheduledDelay?.();
      } catch {
      }
      return a.cancelScheduledDelay = null, a.scheduledPromise = null, a.scheduledFlushAt = 0, await e.flushPlaybackProgressRelayEntry(r, {
        background: !1,
        attachToCtx: !1
      });
    },
    buildPlaybackProgressThrottleResponse(t) {
      const r = e.buildEdgeResponseHeaders(t.finalOrigin), a = e.buildProgressRelayDiagnosticDetail(t);
      return e.recordAccessLog(t, {
        statusCode: 204,
        category: e.classifyProxyLogCategory(t.requestTraits),
        errorDetail: a,
        detailJson: e.buildStructuredLogDetail(t, { statusCode: 204 }, {
          deliveryMode: "proxy",
          redirectMode: "progress_relay",
          decisionReason: t.progressForwardMode || "progress_relay_throttled",
          progressRelayMode: t.progressForwardMode,
          progressIntervalSec: t.videoProgressForwardIntervalSec,
          upstreamStatus: 204
        }),
        outboundColo: t.defaultOutboundColo || ""
      }), new Response(null, {
        status: 204,
        statusText: "No Content",
        headers: r
      });
    },
    async maybeHandlePlaybackProgressRelay(t, r, a, n = []) {
      if (t?.requestTraits?.isPlaybackSessionControlRequest !== !0) return null;
      const s = Math.max(0, Number(t?.videoProgressForwardIntervalSec) || 0);
      if (t?.videoProgressForwardEnabled !== !0 || s <= 0 || !t?.ctx?.waitUntil)
        return t.progressForwardMode = "pass_through", null;
      const i = e.resolvePlaybackProgressSessionKey(t, r);
      if (t.progressForwardSessionKey = String(i.sessionKey || "").trim(), i.parseError)
        return t.progressForwardMode = "parse_bypass", null;
      if (t.requestTraits.isPlaybackStartedRequest === !0)
        return t.progressForwardMode = "started_passthrough", t.progressForwardSessionKey && tr(t.progressForwardSessionKey), null;
      if (t.requestTraits.isPlaybackStoppedRequest === !0)
        return t.progressForwardMode = await e.flushPlaybackProgressBeforeStopped(t) ? "flush_before_stopped" : "stopped_passthrough", t.progressForwardSessionKey && e.markPlaybackProgressRelayStopped(t.progressForwardSessionKey, t), null;
      if (t.requestTraits.isPlaybackProgressRequest !== !0) return null;
      const c = Ze(n[0]) ? n[0] : null;
      if (!c)
        return t.progressForwardMode = "pass_through", null;
      if (t.requestMethod !== "GET" && t.requestMethod !== "HEAD" && r?.preparedBodyMode !== "buffered")
        return t.progressForwardMode = "unbuffered_bypass", null;
      const l = te.PlaybackProgressRelay;
      e.cleanupPlaybackProgressRelay();
      const d = t.progressForwardSessionKey || `fallback:${t.clientIp}:${t.proxyPath}`;
      let u = l.get(d);
      u || (u = e.buildPlaybackProgressRelayEntry(s * 1e3, t.ctx)), u.intervalMs = s * 1e3, u.waitUntilCtx = t.ctx, u.nodeName = String(t.nodeName || "").trim().toLowerCase(), u.nodeRevision = String(t.nodeDerivedCacheRevision || "").trim();
      const f = H();
      if (u.lastTouchedAt = f, e.isPlaybackProgressRelayTerminal(u, f))
        return t.progressForwardMode = "late_progress_dropped_after_stopped", e.buildPlaybackProgressThrottleResponse(t);
      if (u.terminalState = "", u.terminalAt = 0, u.terminalTombstoneUntil = 0, !Bs(d, u))
        return ao(u), t.progressForwardMode = "capacity_bypass", null;
      if (!(u.lastForwardAt > 0 && f - u.lastForwardAt < u.intervalMs) && !u.activeFlushPromise && !u.pendingSnapshot)
        return u.pendingSnapshot = null, u.scheduledFlushAt = 0, u.lastForwardAt = f, t.progressForwardMode = "forward_now", null;
      const m = e.buildPlaybackProgressSnapshot(t, r, a, c);
      return m ? (u.pendingSnapshot = m, u.lastTouchedAt = f, t.progressForwardMode = "throttled_204", e.schedulePlaybackProgressRelayFlush(d, u), e.buildPlaybackProgressThrottleResponse(t)) : (t.progressForwardMode = "snapshot_bypass", null);
    }
  };
}
function Kg(o = {}, e = {}) {
  return {
    ...Hg(o, e),
    ...$g(o, e),
    ...Bg(o, e)
  };
}
function zg(o = {}, e = {}) {
  const { nodeRepository: t } = o;
  return {
    resolveCorsOrigin(r, a) {
      const n = a.headers.get("Origin"), s = Ys(r);
      return s.corsOrigins.length > 0 ? n && s.corsOriginSet.has(n) ? n : s.corsOrigins[0] : n || "*";
    },
    buildEdgeResponseHeaders(r, a = {}) {
      const n = new Headers({
        "Access-Control-Allow-Origin": r,
        "Cache-Control": "no-store",
        ...a
      });
      return Ce(n), n;
    },
    classifyRequest(r, a, n, s, i = {}) {
      const c = r.method, l = r.headers.get("Range"), d = r.headers.get("If-Range"), u = Gr.test(a) || Wr.test(a), f = Xu.test(a), m = pr.test(a), p = St.test(a), g = Ui.test(a), h = vo(a), y = r.headers.get("Upgrade")?.toLowerCase() === "websocket", _ = mc(a), S = pc(a), T = gc(a), b = Sf(a), R = S || T || b, w = Yu.test(a) || /\/videos\/[^/]+\/(stream|original|download|file)/i.test(a) || /\/items\/[^/]+\/download/i.test(a) || n.searchParams.get("Static") === "true" || n.searchParams.get("Download") === "true", L = c === "GET" || c === "HEAD", U = w && !p && !g && !m && !u, E = _ || h || U || p || g, D = !u && !f && !m && !p && !g && !h && !U && !y, A = i.nodeDirectSource === !0 && L && U, x = i.directStaticAssets === !0 && L && f, O = i.directHlsDash === !0 && L && (p || g), N = A ? "entry_direct_media" : x ? "entry_direct_static_asset" : O ? "entry_direct_hls_dash" : "", v = !!N, P = v;
      return {
        rangeHeader: l,
        ifRangeHeader: d,
        enablePrewarm: s.enablePrewarm !== !1 && !v,
        prewarmCacheTtl: le(s.prewarmCacheTtl, Uu, 0, 3600),
        prewarmDepth: Zi(s.prewarmDepth),
        prewarmPrefetchBytes: s.disablePrewarmPrefetch === !0 ? 0 : le(s.prewarmPrefetchBytes, k.Defaults.PrewarmPrefetchBytes, 0, Lo),
        isImage: u,
        isStaticFile: f,
        isSubtitle: m,
        isManifest: p,
        isSegment: g,
        isSmartStrmMedia: h,
        isWsUpgrade: y,
        looksLikeVideoRoute: w,
        isBigStream: U,
        isPlaybackCriticalRequest: E,
        isApiRequest: D,
        isPlaybackInfoRequest: _,
        isPlaybackProgressRequest: S,
        isPlaybackStoppedRequest: T,
        isPlaybackStartedRequest: b,
        isPlaybackSessionControlRequest: R,
        isMetadataCacheable: c === "GET" && !y && !v && (u || m || p),
        isCacheableAsset: c === "GET" && !y && (u || f || m || g || p),
        nodeDirectMedia: A,
        directStaticAssets: x,
        directHlsDash: O,
        legacyEntryOffloadEnabled: v,
        legacyEntryOffloadReason: N,
        canStripAuthOnProtocolFallback: L && !D && (h || U || p || g),
        direct307Mode: P
      };
    },
    isEntryDirectDataPlaneMode(r) {
      const a = String(r || "").trim();
      return a === "entry_direct" || a === "legacy_entry_offload";
    },
    buildRoutingDecision(r = {}) {
      const a = String(r.action || "PROXY").trim().toUpperCase() === "DIRECT" ? "DIRECT" : "PROXY", n = String(r.phase || "unknown").trim() || "unknown", s = String(r.reason || "").trim() || (a === "DIRECT" ? "direct" : "proxy"), i = String(r.traceAction || (a === "DIRECT" ? "direct" : "proxy")).trim() || (a === "DIRECT" ? "direct" : "proxy"), c = String(r.traceLabel || s).trim() || s, l = Number(r.redirectStatus);
      return {
        phase: n,
        action: a,
        dataPlaneMode: String(r.dataPlaneMode || "").trim() || (a === "DIRECT" ? "redirect_direct" : "worker_proxy"),
        nextMethod: r.nextMethod || null,
        nextBodyMode: r.nextBodyMode || "none",
        isSameOriginRedirect: r.isSameOriginRedirect === !0,
        preserveWorkerProxy: r.preserveWorkerProxy === !0,
        reason: s,
        traceAction: i,
        redirectStatus: Number.isFinite(l) && l > 0 ? Math.floor(l) : 0,
        traceLabel: c
      };
    },
    buildLegacyEntryRoutingDecision(r = {}) {
      if (r.legacyEntryOffloadEnabled === !0) {
        const a = String(r.legacyEntryOffloadReason || "entry_direct").trim() || "entry_direct";
        return e.buildRoutingDecision({
          phase: "entry",
          action: "DIRECT",
          dataPlaneMode: "entry_direct",
          reason: a,
          traceAction: "direct",
          redirectStatus: 307,
          traceLabel: a
        });
      }
      return e.buildRoutingDecision({
        phase: "entry",
        action: "PROXY",
        dataPlaneMode: "worker_proxy",
        reason: "worker_proxy",
        traceAction: "proxy",
        traceLabel: "worker_proxy"
      });
    },
    buildSimplifiedEntryRoutingDecision(r = {}) {
      const a = r.requestTraits || {}, n = a.nodeDirectMedia ? "entry_direct_media" : a.directStaticAssets ? "entry_direct_static_asset" : a.directHlsDash ? "entry_direct_hls_dash" : "";
      return n ? e.buildRoutingDecision({
        phase: "entry",
        action: "DIRECT",
        dataPlaneMode: "entry_direct",
        reason: n,
        traceAction: "direct",
        redirectStatus: 307,
        traceLabel: n
      }) : e.buildRoutingDecision({
        phase: "entry",
        action: "PROXY",
        dataPlaneMode: "worker_proxy",
        reason: "worker_proxy",
        traceAction: "proxy",
        traceLabel: "worker_proxy"
      });
    },
    getRoutingDecision(r = {}) {
      const a = String(r.phase || "").trim().toLowerCase();
      return a === "entry" ? e.getEntryRoutingDecision(r) : a === "redirect" ? e.getRedirectRoutingDecision(r) : e.buildRoutingDecision({
        phase: a || "unknown",
        action: "PROXY",
        dataPlaneMode: "worker_proxy",
        reason: "unsupported_phase",
        traceAction: "proxy",
        traceLabel: "unsupported_phase"
      });
    },
    getEntryRoutingDecision(r = {}) {
      if (r.forceWorkerProxy === !0) {
        const a = String(r.forceWorkerProxyReason || "").trim() || "link_variant_force_proxy";
        return e.buildRoutingDecision({
          phase: "entry",
          action: "PROXY",
          dataPlaneMode: "worker_proxy",
          reason: a,
          traceAction: "proxy",
          traceLabel: a
        });
      }
      return Pr(r.routingDecisionMode) === "legacy" ? e.buildLegacyEntryRoutingDecision(r.requestTraits) : e.buildSimplifiedEntryRoutingDecision(r);
    },
    buildSimplifiedRedirectRoutingDecision(r, a, n, s, i = {}, c = {}) {
      const l = r.origin === a.origin, d = i.forceVideoDirect === !0, u = i.forceVideoProxy === !0, f = um(i.currentStatus, n);
      let m = s;
      if ((f === "GET" || f === "HEAD") && (m = "none"), c.forceWorkerProxy === !0) {
        const p = String(c.forceWorkerProxyReason || "").trim() || "link_variant_force_proxy";
        return e.buildRoutingDecision({
          phase: c.phase || "redirect",
          action: "PROXY",
          dataPlaneMode: "worker_proxy_follow",
          nextMethod: f,
          nextBodyMode: m,
          isSameOriginRedirect: l,
          preserveWorkerProxy: !1,
          reason: p,
          traceAction: "proxy",
          redirectStatus: c.redirectStatus || i.currentStatus,
          traceLabel: p
        });
      }
      return d ? e.buildRoutingDecision({
        phase: c.phase || "redirect",
        action: "DIRECT",
        dataPlaneMode: "redirect_direct",
        nextBodyMode: s,
        isSameOriginRedirect: l,
        preserveWorkerProxy: !1,
        reason: "node_video_direct",
        traceAction: "direct",
        redirectStatus: c.redirectStatus || i.currentStatus,
        traceLabel: "node_video_direct"
      }) : s === "stream" ? e.buildRoutingDecision({
        phase: c.phase || "redirect",
        action: "DIRECT",
        dataPlaneMode: "redirect_direct",
        nextBodyMode: s,
        isSameOriginRedirect: l,
        preserveWorkerProxy: !1,
        reason: "stream_body_direct",
        traceAction: "direct",
        redirectStatus: c.redirectStatus || i.currentStatus,
        traceLabel: "stream_body_direct"
      }) : e.buildRoutingDecision({
        phase: c.phase || "redirect",
        action: "PROXY",
        dataPlaneMode: "worker_proxy_follow",
        nextMethod: f,
        nextBodyMode: m,
        isSameOriginRedirect: l,
        preserveWorkerProxy: !1,
        reason: "proxy_follow",
        traceAction: "proxy",
        redirectStatus: c.redirectStatus || i.currentStatus,
        traceLabel: u ? "node_video_proxy" : "proxy_follow"
      });
    },
    getRedirectRoutingDecision(r = {}) {
      return e.buildSimplifiedRedirectRoutingDecision(r.nextUrl, r.activeTargetBase, r.redirectMethod, r.redirectBodyMode, r.policy, {
        phase: "redirect",
        forceWorkerProxy: r.forceWorkerProxy === !0,
        forceWorkerProxyReason: r.forceWorkerProxyReason,
        redirectStatus: r.currentStatus || r.policy?.currentStatus
      });
    },
    evaluateFirewall(r, a, n, s) {
      const i = Ys(r);
      return i.ipBlacklist.has(a) ? new Response("Forbidden by IP Firewall", {
        status: 403,
        headers: e.buildEdgeResponseHeaders(s)
      }) : i.geoAllowlist.size > 0 && !i.geoAllowlist.has(n) || i.geoBlocklist.size > 0 && i.geoBlocklist.has(n) ? new Response("Forbidden by Geo Firewall", {
        status: 403,
        headers: e.buildEdgeResponseHeaders(s)
      }) : null;
    },
    applyRateLimit(r, a, n, s, i) {
      const c = parseInt(r.rateLimitRpm) || 0;
      if (!(c > 0 && n.isPlaybackCriticalRequest !== !0)) return null;
      let l = We.RateLimitCache.get(a);
      return (!l || s > l.resetAt) && (l = {
        count: 0,
        resetAt: s + 6e4
      }), l.count += 1, Ie(We.RateLimitCache, a, l, k.Defaults.RateLimitCacheMax), l.count > c ? new Response("Rate Limit Exceeded", {
        status: 429,
        headers: e.buildEdgeResponseHeaders(i)
      }) : null;
    },
    parseTargetRecords(r, a, n = {}) {
      const s = Array.isArray(n.cachedTargetRecords) ? n.cachedTargetRecords : [];
      if (s.length > 0 && s.every(Ze)) return {
        targetRecords: s,
        invalidResponse: null
      };
      const i = t.getOrderedNodeLines(r), c = (i.length ? i.map((l) => l.target) : String(r.target || "").split(",").map((l) => l.trim()).filter(Boolean)).map((l) => pn(l)).filter(Ze);
      return c.length ? {
        targetRecords: c,
        invalidResponse: null
      } : {
        targetRecords: c,
        invalidResponse: new Response("Invalid Node Target", {
          status: 502,
          headers: e.buildEdgeResponseHeaders(a)
        })
      };
    }
  };
}
function Wg(o) {
  if (!o || !o.body) return !0;
  const e = tn(o?.headers?.get("Content-Length"));
  return Number.isFinite(e) && e >= 0 && e <= Pi;
}
function Gg(o = {}, e = {}) {
  const { nodeRepository: t } = o;
  return {
    ensureFailoverTelemetry(r) {
      const a = r?.failoverTelemetry && typeof r.failoverTelemetry == "object" ? r.failoverTelemetry : {};
      return a.overlay = String(a.overlay || "").trim(), a.probeReason = String(a.probeReason || "").trim(), a.probeWinner = String(a.probeWinner || "").trim(), a.probeElapsedMs = Math.max(0, Math.round(Number(a.probeElapsedMs) || 0)), a.waitJoinMs = Math.max(0, Math.round(Number(a.waitJoinMs) || 0)), a.demotedTarget = String(a.demotedTarget || "").trim(), a.preferredTarget = String(a.preferredTarget || "").trim(), a.fastFailReason = String(a.fastFailReason || "").trim(), r && typeof r == "object" && (r.failoverTelemetry = a), a;
    },
    isFailoverEligible(r, a = []) {
      if (r?.hedgeFailoverEnabled !== !0) return {
        eligible: !1,
        reason: "disabled"
      };
      if (r.requestMethod !== "GET" && r.requestMethod !== "HEAD") {
        if (r?.requestTraits?.isPlaybackInfoRequest !== !0) return {
          eligible: !1,
          reason: "non_idempotent"
        };
        if (!Wg(r.request)) return {
          eligible: !1,
          reason: "non_replayable_body"
        };
      }
      return r?.requestTraits?.isWsUpgrade === !0 ? {
        eligible: !1,
        reason: "websocket"
      } : r?.playbackRelayTargetUrl instanceof URL ? {
        eligible: !1,
        reason: "absolute_target"
      } : Ad(a) < 2 ? {
        eligible: !1,
        reason: "single_target"
      } : {
        eligible: !0,
        reason: "eligible"
      };
    },
    buildFailoverCacheKey(r, a, n) {
      return [
        String(r || "").toLowerCase().trim(),
        String(a || "").trim(),
        String(n || "").trim()
      ].filter(Boolean).join(":");
    },
    pruneFailoverStateEntry(r, a = na * 1e3, n = H()) {
      if (!r || typeof r != "object") return null;
      r.failingTargets instanceof Map || (r.failingTargets = /* @__PURE__ */ new Map());
      for (const [u, f] of r.failingTargets) Number(f) <= n && r.failingTargets.delete(u);
      Number(r.preferredTargetExpiresAt) <= n && (r.preferredTargetKey = "", r.preferredTargetExpiresAt = 0);
      const s = Number(r.lastProbeResult?.completedAt) || 0;
      r.lastProbeResult && s > 0 && s + Math.max(1e3, Number(a) || 0) <= n && (r.lastProbeResult = null), r.inFlightProbe && Number(r.inFlightProbe.expiresAt) <= n && (r.inFlightProbe = null);
      const i = !!String(r.preferredTargetKey || "").trim(), c = r.failingTargets.size > 0, l = !!r.inFlightProbe, d = !!r.lastProbeResult;
      return i || c || l || d ? r : null;
    },
    getOrCreateFailoverStateEntry(r, a = na * 1e3) {
      const n = String(r || "").trim();
      if (!n) return null;
      const s = te.ProxyFailoverStateCache;
      let i = s.get(n);
      (!i || typeof i != "object") && (i = {
        preferredTargetKey: "",
        preferredTargetExpiresAt: 0,
        failingTargets: /* @__PURE__ */ new Map(),
        inFlightProbe: null,
        lastProbeResult: null
      });
      const c = e.pruneFailoverStateEntry(i, a, H()) || i;
      return Ie(s, n, c, sr), c;
    },
    getFailoverStateSnapshot(r, a = na * 1e3) {
      const n = String(r || "").trim();
      if (!n) return null;
      const s = te.ProxyFailoverStateCache, i = s.get(n);
      if (!i) return null;
      const c = e.pruneFailoverStateEntry(i, a, H());
      return c ? (Za(s, n), {
        preferredTargetKey: String(c.preferredTargetKey || "").trim(),
        failingTargetKeys: [...c.failingTargets.keys()].map((l) => String(l || "").trim()).filter(Boolean),
        probeWinnerTargetKey: String(c.lastProbeResult?.status || "") === "ok" ? String(c.lastProbeResult?.winnerTargetKey || "").trim() : "",
        lastProbeResult: c.lastProbeResult && typeof c.lastProbeResult == "object" ? { ...c.lastProbeResult } : null,
        inFlightProbe: c.inFlightProbe ? {
          startedAt: Number(c.inFlightProbe.startedAt) || 0,
          reason: String(c.inFlightProbe.reason || "").trim()
        } : null
      }) : (s.delete(n), null);
    },
    buildFailoverStateSummary(r) {
      const a = r?.failoverContext && typeof r.failoverContext == "object" ? r.failoverContext : null, n = e.ensureFailoverTelemetry(r), s = a?.cacheKey ? e.getFailoverStateSnapshot(a.cacheKey, a.preferredTtlMs) : null;
      return {
        enabled: a?.enabled === !0,
        eligible: a?.eligible === !0,
        cacheKey: String(a?.cacheKey || "").trim() || null,
        reason: String(a?.eligibilityReason || "").trim() || null,
        overlay: String(n.overlay || "").trim() || null,
        preferredTarget: String(n.preferredTarget || s?.preferredTargetKey || "").trim() || null,
        probeWinner: String(n.probeWinner || s?.probeWinnerTargetKey || "").trim() || null,
        demotedTargets: Array.isArray(s?.failingTargetKeys) ? s.failingTargetKeys : [],
        inFlight: s?.inFlightProbe ? { reason: String(s.inFlightProbe.reason || "").trim() || null } : null
      };
    },
    buildFailoverDiagnosticDetail(r) {
      const a = r?.failoverContext && typeof r.failoverContext == "object" ? r.failoverContext : null;
      if (!a?.enabled) return "";
      const n = e.ensureFailoverTelemetry(r), s = e.buildFailoverStateSummary(r), i = [`Failover=${String(n.overlay || a.eligibilityReason || "ready").trim() || "ready"}`];
      return s.preferredTarget && i.push(`PreferredTarget=${s.preferredTarget}`), n.demotedTarget && i.push(`DemotedTarget=${n.demotedTarget}`), n.probeWinner && i.push(`ProbeWinner=${n.probeWinner}`), n.waitJoinMs > 0 && i.push(`WaitJoin=${n.waitJoinMs}ms`), n.fastFailReason && i.push(`FastFail=${n.fastFailReason}`), i.join(" | ");
    },
    reorderRetryTargetsForFailover(r, a = {}) {
      const n = Array.isArray(r) ? r.slice() : [];
      if (n.length <= 1) return n;
      const s = new Set((Array.isArray(a?.failingTargetKeys) ? a.failingTargetKeys : []).map((m) => String(m || "").trim()).filter(Boolean)), i = String(a?.preferredTargetKey || "").trim(), c = String(a?.probeWinnerTargetKey || "").trim(), l = i && !s.has(i) ? i : c && !s.has(c) ? c : "";
      if (!l && s.size <= 0) return n;
      const d = [], u = [], f = [];
      for (const m of n) {
        const p = je(m);
        if (l && p === l && d.length <= 0 && !s.has(p)) {
          d.push(m);
          continue;
        }
        if (s.has(p)) {
          f.push(m);
          continue;
        }
        u.push(m);
      }
      return [
        ...d,
        ...u,
        ...f
      ];
    },
    prepareFailoverOverlay(r, a = []) {
      const n = e.ensureFailoverTelemetry(r), s = Rd(a), i = Math.max(1e3, (Number(r?.hedgePreferredTtlSec) || na) * 1e3), c = e.isFailoverEligible(r, a), l = e.buildFailoverCacheKey(r?.nodeName, s, r?.nodeDerivedCacheRevision), d = c.eligible ? e.getFailoverStateSnapshot(l, i) : null, u = c.eligible ? e.reorderRetryTargetsForFailover(a, d) : Array.isArray(a) ? a.slice() : [];
      let f = "disabled";
      return r?.hedgeFailoverEnabled === !0 && (c.eligible ? d?.preferredTargetKey ? f = "preferred_reordered" : d?.probeWinnerTargetKey ? f = "probe_hint_reordered" : Array.isArray(d?.failingTargetKeys) && d.failingTargetKeys.length > 0 ? f = "failure_demoted" : f = "ready" : f = c.reason || "ineligible"), n.overlay = f, n.preferredTarget = String(d?.preferredTargetKey || "").trim(), r.failoverContext = {
        enabled: r?.hedgeFailoverEnabled === !0,
        eligible: c.eligible,
        eligibilityReason: c.reason,
        cacheKey: l,
        orderedTargetSignature: s,
        preferredTtlMs: i,
        probePath: Na(r?.hedgeProbePath, wi),
        probePreferGet: r?.hedgeProbePreferGet !== !1,
        probeTimeoutMs: Math.max(250, Number(r?.hedgeProbeTimeoutMs) || Co),
        probeParallelism: Math.max(1, Math.min(2, Number(r?.hedgeProbeParallelism) || Li)),
        waitTimeoutMs: Math.max(250, Number(r?.hedgeWaitTimeoutMs) || Ni),
        lockTtlMs: Math.max(1e3, Number(r?.hedgeLockTtlMs) || Di),
        failureCooldownMs: Math.max(1e3, (Number(r?.hedgeFailureCooldownSec) || Ii) * 1e3),
        wakeJitterMs: Math.max(0, Number(r?.hedgeWakeJitterMs) || Mi),
        originalTargetRecords: Array.isArray(a) ? a.slice() : [],
        retryTargetRecords: u.slice(),
        snapshot: d
      }, u;
    },
    maybeInvalidateHotSnapshotOnFailover(r, a) {
      if (String(r?.targetHotCacheState || "").trim() !== "hit") return;
      const n = je(a);
      n && (Array.isArray(r?.playbackRouteHotTargetRecords) ? r.playbackRouteHotTargetRecords : []).map((s) => je(s)).filter(Boolean).includes(n) && t.invalidatePlaybackRouteHotCache(r?.nodeName, r?.env);
    },
    markFailoverTargetFailure(r, a, n = "", s = {}) {
      const i = r?.failoverContext;
      if (!i?.eligible) return;
      const c = je(a);
      if (!c) return;
      const l = e.ensureFailoverTelemetry(r), d = e.getOrCreateFailoverStateEntry(i.cacheKey, i.preferredTtlMs);
      d && (d.failingTargets.set(c, H() + i.failureCooldownMs), String(d.preferredTargetKey || "").trim() === c && (d.preferredTargetKey = "", d.preferredTargetExpiresAt = 0), Ie(te.ProxyFailoverStateCache, i.cacheKey, d, sr), l.overlay = String(s.overlay || "target_demoted").trim() || "target_demoted", l.demotedTarget = c, l.fastFailReason = String(n || s.fastFailReason || l.fastFailReason || "").trim(), e.maybeInvalidateHotSnapshotOnFailover(r, a));
    },
    markFailoverBusinessSuccess(r, a, n = {}) {
      const s = r?.failoverContext;
      if (!s?.eligible) return;
      const i = Number(n.status) || 0;
      if (!(i >= 200 && i < 300 || i === 206 || i >= 300 && i < 400)) return;
      const c = je(a);
      if (!c) return;
      const l = e.ensureFailoverTelemetry(r), d = e.getOrCreateFailoverStateEntry(s.cacheKey, s.preferredTtlMs);
      d && (d.failingTargets.delete(c), d.preferredTargetKey = c, d.preferredTargetExpiresAt = H() + s.preferredTtlMs, Ie(te.ProxyFailoverStateCache, s.cacheKey, d, sr), l.overlay = String(n.overlay || "preferred_promoted").trim() || "preferred_promoted", l.preferredTarget = c);
    },
    getFailoverProbeCandidates(r, a = {}) {
      const n = r?.failoverContext;
      if (!n?.eligible) return [];
      const s = e.getFailoverStateSnapshot(n.cacheKey, n.preferredTtlMs), i = e.reorderRetryTargetsForFailover(n.originalTargetRecords, s), c = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), d = je(a.failedTargetRecord), u = je(a.activeTargetRecord), f = String(a.excludeTargetKey || "").trim();
      return d && c.add(d), u && c.add(u), f && c.add(f), i.filter((m) => {
        const p = je(m);
        return !p || c.has(p) || l.has(p) ? !1 : (l.add(p), !0);
      }).slice(0, n.probeParallelism);
    }
  };
}
function jg(o = {}, e = {}) {
  return {
    buildFailoverProbeHeaders(t = "") {
      return new Headers(Ao(t));
    },
    async performFailoverProbeRequest(t, r, a, n, s = null, i = null) {
      const c = Ag([
        t?.request?.signal,
        t?.requestLifecycle?.signal,
        s
      ]);
      let l = null, d = !1;
      try {
        return n > 0 && (l = setTimeout(() => {
          d = !0, c.abort(`probe_timeout_${n}ms`);
        }, n)), await Be(r.toString(), {
          method: a,
          headers: e.buildFailoverProbeHeaders(i ?? t?.request?.headers?.get("User-Agent")),
          redirect: "manual",
          signal: c.signal
        });
      } catch (u) {
        if (d) {
          const f = /* @__PURE__ */ new Error(`probe_timeout_${n}ms`);
          throw f.code = "UPSTREAM_TIMEOUT", f;
        }
        throw t?.requestLifecycle?.getAbortReason?.() && $t(u) ? lr(t.requestLifecycle.getAbortReason()) : u;
      } finally {
        l !== null && clearTimeout(l), c.dispose();
      }
    },
    async runFailoverProbeCandidate(t, r, a = {}) {
      const n = t?.failoverContext, s = n?.probePath || Na(t?.hedgeProbePath, wi), i = Math.max(250, Number(n?.probeTimeoutMs) || Co), c = je(r), l = Wc(r, [s]);
      if (!l.length) return {
        ok: !1,
        status: 0,
        targetRecord: r,
        targetKey: c,
        reason: "invalid_probe_target",
        elapsedMs: 0
      };
      const d = H(), u = n?.probePreferGet !== !1;
      for (let f = 0; f < l.length; f += 1) {
        const m = l[f].probeUrl, p = f < l.length - 1;
        let g = null, h = u ? "GET" : "HEAD";
        try {
          if (g = await e.performFailoverProbeRequest(t, m, h, i, a.parentSignal || null), !u && (g.status === 405 || g.status === 501)) {
            try {
              g.body?.cancel?.();
            } catch {
            }
            h = "GET", g = await e.performFailoverProbeRequest(t, m, "GET", i, a.parentSignal || null);
          }
          const y = String(t?.request?.headers?.get("User-Agent") || "").trim();
          if (g.status === 403 && y && y !== Kn) {
            const T = Number(n?.waitTimeoutMs) || 0, b = T > 0 ? Math.min(i, T - (H() - d)) : i;
            if (b >= 250) {
              try {
                g.body?.cancel?.();
              } catch {
              }
              g = await e.performFailoverProbeRequest(t, m, h, b, a.parentSignal || null, Kn);
            }
          }
          const _ = Math.max(0, H() - d), S = Number(g.status) || 0;
          if (S >= 200 && S < 400 || S === 403) {
            const T = g.status;
            try {
              g.body?.cancel?.();
            } catch {
            }
            return {
              ok: !0,
              status: T,
              targetRecord: r,
              targetKey: c,
              methodUsed: h,
              elapsedMs: _
            };
          }
          try {
            g.body?.cancel?.();
          } catch {
          }
          if (p && (S === 404 || S === 405)) continue;
          return {
            ok: !1,
            status: g.status,
            targetRecord: r,
            targetKey: c,
            reason: `probe_status_${Number(g.status) || 0}`,
            elapsedMs: _
          };
        } catch (y) {
          const _ = Math.max(0, H() - d), S = String(y?.code || "").trim().toUpperCase(), T = String(t?.requestLifecycle?.getAbortReason?.() || "").trim();
          return T ? {
            ok: !1,
            targetRecord: r,
            targetKey: c,
            reason: T.toLowerCase(),
            elapsedMs: _,
            aborted: !0
          } : String(a.parentSignal?.reason || "").trim() === "probe_winner" && $t(y) ? {
            ok: !1,
            targetRecord: r,
            targetKey: c,
            reason: "probe_winner_aborted",
            elapsedMs: _,
            aborted: !0
          } : {
            ok: !1,
            targetRecord: r,
            targetKey: c,
            reason: S === "UPSTREAM_TIMEOUT" ? "probe_timeout" : "probe_network_error",
            elapsedMs: _,
            aborted: $t(y)
          };
        }
      }
    },
    async runFailoverProbeTask(t, r, a = {}) {
      const n = t?.failoverContext;
      if (!n?.eligible) return {
        status: "skipped",
        reason: "ineligible",
        winnerTargetRecord: null,
        winnerTargetKey: "",
        elapsedMs: 0,
        attempts: []
      };
      const s = Array.isArray(r) ? r.slice(0, n.probeParallelism) : [];
      if (!s.length) return {
        status: "skipped",
        reason: "no_candidates",
        winnerTargetRecord: null,
        winnerTargetKey: "",
        elapsedMs: 0,
        attempts: []
      };
      const i = new AbortController(), c = [];
      let l = null;
      const d = H();
      await Promise.all(s.map(async (_) => {
        const S = await e.runFailoverProbeCandidate(t, _, { parentSignal: i.signal });
        if (c.push(S), !l && S?.ok === !0) {
          l = S;
          try {
            i.abort("probe_winner");
          } catch {
          }
        }
      }));
      const u = Math.max(0, H() - d), f = e.getOrCreateFailoverStateEntry(n.cacheKey, n.preferredTtlMs), m = l ? "ok" : "miss", p = l ? String(a.reason || "probe_ok").trim() || "probe_ok" : String(c.find((_) => _?.aborted !== !0 && _?.reason)?.reason || "probe_no_winner").trim() || "probe_no_winner", g = l && typeof l == "object" ? l : null, h = String(g ? g.targetKey : "").trim(), y = g ? g.targetRecord : null;
      return f && (f.lastProbeResult = {
        status: m,
        reason: p,
        winnerTargetKey: h,
        completedAt: H(),
        elapsedMs: u
      }, Ie(te.ProxyFailoverStateCache, n.cacheKey, f, sr)), {
        status: m,
        reason: p,
        winnerTargetRecord: y,
        winnerTargetKey: h,
        elapsedMs: u,
        attempts: c
      };
    },
    startOrJoinFailoverProbe(t, r = {}) {
      const a = t?.failoverContext, n = e.ensureFailoverTelemetry(t);
      if (!a?.eligible) return null;
      const s = e.getOrCreateFailoverStateEntry(a.cacheKey, a.preferredTtlMs), i = H();
      if (s?.inFlightProbe && Number(s.inFlightProbe.expiresAt) > i && s.inFlightProbe.promise)
        return n.overlay = (r.background === !0 ? "background_probe_joined" : "probe_joined").trim(), {
          joined: !0,
          startedAt: Number(s.inFlightProbe.startedAt) || i,
          promise: s.inFlightProbe.promise
        };
      const c = e.getFailoverProbeCandidates(t, r);
      if (!c.length)
        return n.fastFailReason = "no_probe_candidates", n.overlay = "no_probe_candidates", {
          joined: !1,
          startedAt: i,
          promise: Promise.resolve({
            status: "skipped",
            reason: "no_candidates",
            winnerTargetRecord: null,
            winnerTargetKey: "",
            elapsedMs: 0,
            attempts: []
          })
        };
      const l = `${i}-${Math.random().toString(36).slice(2, 10)}`, d = e.runFailoverProbeTask(t, c, r).finally(() => {
        const u = e.getOrCreateFailoverStateEntry(a.cacheKey, a.preferredTtlMs);
        !u?.inFlightProbe || String(u.inFlightProbe.token || "").trim() !== l || (u.inFlightProbe = null, Ie(te.ProxyFailoverStateCache, a.cacheKey, u, sr));
      });
      return s && (s.inFlightProbe = {
        token: l,
        startedAt: i,
        expiresAt: i + a.lockTtlMs,
        reason: String(r.reason || "").trim(),
        promise: d
      }, Ie(te.ProxyFailoverStateCache, a.cacheKey, s, sr)), n.overlay = (r.background === !0 ? "background_probe_started" : "probe_started").trim(), {
        joined: !1,
        startedAt: i,
        promise: d
      };
    },
    async maybeRunForegroundFailoverWait(t, r = {}) {
      const a = t?.execution, n = a?.failoverContext, s = e.ensureFailoverTelemetry(a);
      if (!n?.eligible || a?.failoverForegroundWaitUsed === !0) return null;
      a.failoverForegroundWaitUsed = !0;
      const i = r.targetRecord, c = Number(r.responseStatus) || 0, l = String(r.reason || (c > 0 ? `upstream_status_${c}` : "retryable_failure")).trim() || "retryable_failure";
      e.markFailoverTargetFailure(a, i, l, { overlay: "failure_demoted" });
      const d = e.startOrJoinFailoverProbe(a, {
        reason: l,
        failedTargetRecord: i
      });
      if (!d?.promise) return null;
      const u = await Cg(d.promise, n.waitTimeoutMs, a?.requestLifecycle);
      if (s.waitJoinMs = u.timedOut === !0 ? n.waitTimeoutMs : Math.max(0, H() - Number(d.startedAt || H())), u.timedOut === !0)
        return s.overlay = "probe_wait_timeout", s.fastFailReason = "probe_wait_timeout", null;
      const f = u.value && typeof u.value == "object" ? u.value : null;
      if (s.probeReason = d.joined === !0 ? "join_existing_probe" : l, s.probeElapsedMs = Math.max(0, Number(f?.elapsedMs) || 0), s.probeWinner = String(f?.winnerTargetKey || "").trim(), !f || f.status !== "ok" || !Ze(f.winnerTargetRecord))
        return s.overlay = "probe_miss", s.fastFailReason = String(f?.reason || "probe_no_winner").trim() || "probe_no_winner", null;
      const m = je(i), p = je(f.winnerTargetRecord);
      if (!p || p === m)
        return s.overlay = "probe_miss", s.fastFailReason = "probe_reused_failed_target", null;
      n.wakeJitterMs > 0 && await wg(Math.floor(Math.random() * (n.wakeJitterMs + 1)), a?.requestLifecycle);
      try {
        const g = await e.performUpstreamFetch(f.winnerTargetRecord, t.proxyPath, t.requestUrl, t.buildFetchOptions, {
          isRetry: !0,
          protocolFallbackRetry: t.protocolFallbackRetry === !0,
          stripAuthOnProtocolFallback: t.stripAuthOnProtocolFallback === !0,
          timeoutMs: t.upstreamTimeoutMs,
          requestLifecycle: t.requestLifecycle,
          useFastSegmentBuilder: !1
        });
        if (s.overlay = "wake_retry", g.response.status === 101 || !t.retryableStatuses.has(g.response.status)) return { upstream: g };
        e.markFailoverTargetFailure(a, f.winnerTargetRecord, `upstream_status_${g.response.status}`, { overlay: "wake_retry_failed" }), s.fastFailReason = `wake_retry_status_${g.response.status}`;
        try {
          g.response.body?.cancel?.();
        } catch {
        }
        try {
          g.releaseFetchController?.();
        } catch {
        }
        return null;
      } catch (g) {
        const h = String(g?.code || "").trim().toUpperCase();
        if ([
          "CLIENT_ABORTED",
          "DOWNSTREAM_CANCELLED",
          "REQUEST_ABORTED"
        ].includes(h) || (e.markFailoverTargetFailure(a, f.winnerTargetRecord, h || "wake_retry_error", { overlay: "wake_retry_failed" }), s.fastFailReason = String(h || "wake_retry_error").trim().toLowerCase() || "wake_retry_error"), g && typeof g == "object") {
          const y = hr(f.winnerTargetRecord, t.proxyPath);
          y.search = String(t.requestUrl?.search || ""), g.lastFinalUrl = y, g.lastTargetRecord = f.winnerTargetRecord, g.lastTargetBase = f.winnerTargetRecord?.targetUrl || null;
        }
        if ([
          "CLIENT_ABORTED",
          "DOWNSTREAM_CANCELLED",
          "REQUEST_ABORTED"
        ].includes(h)) throw g;
        return { error: g };
      }
    },
    maybeScheduleBackgroundFailoverRefresh(t, r = {}) {
      const a = t?.failoverContext;
      if (!a?.eligible || !t?.ctx) return;
      const n = e.getFailoverStateSnapshot(a.cacheKey, a.preferredTtlMs);
      if ((Array.isArray(n?.failingTargetKeys) ? n.failingTargetKeys : []).length <= 0) return;
      const s = Number(n?.lastProbeResult?.completedAt) || 0;
      if (s > 0 && s + a.preferredTtlMs > H() || n?.inFlightProbe) return;
      const i = e.startOrJoinFailoverProbe(t, {
        reason: "stale_refresh",
        activeTargetRecord: r?.activeTargetRecord || null,
        background: !0
      });
      i?.promise && t.ctx.waitUntil(Promise.resolve(i.promise).catch(() => {
      }));
    }
  };
}
function Vg(o = {}, e = {}) {
  return {
    ...zg(o, e),
    ...Gg(o, e),
    ...jg(o, e)
  };
}
function qg(o = {}, e = {}) {
  const t = {
    async buildProxyRequestState(r, a, n, s, i, c, l, d, u = {}) {
      const f = lg(r.headers);
      Wn.forEach((v) => f.delete(v));
      const m = /* @__PURE__ */ new Set();
      let p = null;
      if (a.headers && typeof a.headers == "object") for (const [v, P] of Object.entries(a.headers)) {
        const C = String(v).toLowerCase();
        Wn.has(C) || (m.add(C), C === "cookie" ? p = String(P) : f.set(v, String(P)));
      }
      const g = Gs(f.get("Cookie"), p, ["auth_token", ...pa]);
      g ? f.set("Cookie", g) : f.delete("Cookie");
      const h = p ? Gs(null, p, ["auth_token", ...pa]) : null;
      qs(f, u.effectiveMediaAuthMode || a.mediaAuthMode, pg(s));
      const y = Fd(u.effectiveRealClientIpMode || a.realClientIpMode);
      y === "none" && Ju.forEach((v) => f.delete(v)), (y === "full" || y === "real-ip-only") && f.set("X-Real-IP", i), y === "full" && f.set("X-Forwarded-For", i), f.set("X-Forwarded-Host", s.host), f.set("X-Forwarded-Proto", s.protocol.replace(":", "")), c.isWsUpgrade ? (f.set("Upgrade", "websocket"), f.set("Connection", "Upgrade")) : l && f.set("Connection", "keep-alive"), (c.isBigStream || c.isSmartStrmMedia || c.isSegment || c.isManifest) && !m.has("referer") && f.delete("Referer");
      const _ = m.has("origin"), S = m.has("referer"), T = f.has("Origin"), b = f.has("Referer");
      let R = "", w = "/";
      if (b && !S) try {
        const v = new URL(f.get("Referer") || "");
        R = String(v.origin || "").trim(), w = `${v.pathname || "/"}${v.search || ""}` || "/";
      } catch {
        R = "", w = "/";
      }
      const L = {
        baseHeaderEntries: [...f.entries()],
        hasOriginHeader: T,
        hasRefererHeader: b,
        adminCustomHasOrigin: _,
        adminCustomHasReferer: S,
        refererOrigin: R,
        refererPathAndSearch: w,
        adminCookie: h
      }, U = r.method !== "GET" && r.method !== "HEAD";
      let E = null, D = "none", A = "";
      if (U && r.body) {
        const v = tn(r.headers.get("Content-Length"));
        if (Number.isFinite(v) && v >= 0 && v <= Pi) try {
          E = await r.clone().arrayBuffer(), D = "buffered", (c.isPlaybackInfoRequest === !0 || c.isPlaybackSessionControlRequest === !0) && (A = co(E));
        } catch {
          E = r.body, D = "stream";
        }
        else
          E = r.body, D = "stream";
      }
      const x = c?.isPlaybackInfoRequest === !0 && D !== "stream", O = !U || x, N = O ? d : d.slice(0, 1);
      return {
        newHeaders: f,
        adminCustomHeaders: m,
        transportTemplate: L,
        preparedBody: E,
        preparedBodyMode: D,
        preparedBodyText: A,
        retryTargetRecords: N,
        allowAutomaticRetry: O,
        allowSameTargetRetry: !U,
        clientRedirectAuthPolicy: Aa(f)
      };
    },
    buildProxyResponseHeaders(r, a, n, s, i, c = {}) {
      const l = new Headers(r.headers);
      Qu.forEach((f) => l.delete(f)), l.set("Access-Control-Allow-Origin", s), n && n["Access-Control-Expose-Headers"] && l.set("Access-Control-Expose-Headers", n["Access-Control-Expose-Headers"]), n && n["Access-Control-Allow-Methods"] && l.set("Access-Control-Allow-Methods", n["Access-Control-Allow-Methods"]);
      const d = a.headers.get("Access-Control-Request-Headers");
      d ? (l.set("Access-Control-Allow-Headers", d), Ur(l, "Access-Control-Request-Headers")) : n && n["Access-Control-Allow-Headers"] && l.set("Access-Control-Allow-Headers", n["Access-Control-Allow-Headers"]), s !== "*" && Ur(l, "Origin"), (!c.enableH3 || c.forceH1) && l.delete("Alt-Svc");
      const u = le(c.imageCacheMaxAge, Oi * 86400, 0, 365 * 86400);
      if (r.status >= 400 || i.isManifest || i.isBigStream || i.isSmartStrmMedia) l.set("Cache-Control", "no-store");
      else if (c.proxiedExternalRedirect) l.set("Cache-Control", "no-store");
      else if (i.isImage || i.isStaticFile || i.isSubtitle) {
        const f = Bp(a) ? "private" : "public";
        l.set("Cache-Control", `${f}, max-age=${u}`);
      }
      return Ce(l), l;
    },
    applyProxyRedirectHeaders(r, a, n, s, i, c, l, d = {}) {
      if (c) {
        jc(r), r.set("Location", c.toString()), r.set("Cache-Control", "no-store");
        return;
      }
      if (!(a.status >= 300 && a.status < 400)) return;
      const u = r.get("Location");
      if (!u) return;
      const f = zs(Ta(u, l || n), n, s, i, {
        linkVariant: d.linkVariant,
        entryMode: d.entryMode
      });
      f && r.set("Location", f);
    },
    buildClientVisibleRedirectUrl(r, a, n, s, i, c = {}) {
      const l = r instanceof URL ? r : Ta(r, a);
      if (!l) return null;
      if (c.preserveWorkerProxy !== !0) return l;
      const d = zs(l, a, n, s, {
        linkVariant: c.linkVariant,
        entryMode: c.entryMode
      }), u = _t(n, s, {
        linkVariant: c.linkVariant,
        entryMode: c.entryMode
      });
      if (!d || !String(d).startsWith(u)) return l;
      try {
        const f = i instanceof URL ? i : new URL(String(i || ""));
        return new URL(d, f);
      } catch {
        return l;
      }
    },
    buildPlaybackInfoClientVisibleUrl(r, a = "/", n = {}) {
      const s = Y(a), i = String(n.search || ""), c = String(n.hash || "");
      return String(r?.playbackInfoRewriteUrlMode || "").trim() === "absolute" ? Vc(r?.requestUrl || r?.rawRequestUrl || "https://playback-info.local/", r?.nodeName, r?.nodeKey, s, {
        linkVariant: r?.linkVariant,
        entryMode: r?.entryMode,
        search: i,
        hash: c
      }).toString() : `${Np(wp(s, r?.nodeName, r?.nodeKey, { entryMode: r?.entryMode }), Lp(r))}${i}${c}`;
    },
    buildPlaybackInfoProxyUrl(r, a, n, s) {
      const i = String(a || "").trim();
      if (!i) return "";
      const c = Ep(i, r?.proxyPath || "/", n, r?.requestUrl || r?.rawRequestUrl || s, _t(r?.nodeName, r?.nodeKey, {
        linkVariant: r?.linkVariant,
        entryMode: r?.entryMode
      }));
      if (c) return t.buildPlaybackInfoClientVisibleUrl(r, c.proxyPath, {
        search: c.search,
        hash: c.hash
      });
      let l;
      try {
        const u = s instanceof URL ? s : new URL(String(s || ""));
        l = new URL(i, u);
      } catch {
        return i;
      }
      if (!["http:", "https:"].includes(String(l.protocol || "").toLowerCase())) return i;
      if (n) {
        const { resolvedUrl: u, proxyPath: f } = Ia(l, n);
        if (u && f) {
          const m = Tp(f, r?.proxyPath || "/", n);
          return t.buildPlaybackInfoClientVisibleUrl(r, m, {
            search: u.search,
            hash: u.hash
          });
        }
      }
      const d = Cp(r?.requestUrl || r?.rawRequestUrl || "https://playback-info.local/", r?.nodeName, r?.nodeKey, l, {
        linkVariant: r?.linkVariant,
        entryMode: r?.entryMode
      });
      return String(r?.playbackInfoRewriteUrlMode || "").trim() === "absolute" ? d.toString() : t.buildPlaybackInfoClientVisibleUrl(r, d.pathname || "/", {
        search: d.search || "",
        hash: d.hash || ""
      });
    },
    sanitizePlaybackInfoSerializedResponseHeaders: mo,
    parsePlaybackInfoRootObject: nn,
    normalizeMediaAuthHeaders: qs,
    appendMediaRedirectAuthToUrl: Xo,
    buildPlaybackInfoContractErrorState(r, a, n = "invalid_payload", s = null) {
      const i = a?.response;
      return r.playbackInfoRewrite = "rejected", e.buildProxyErrorState(r, a, {
        message: "Upstream PlaybackInfo response must be a JSON object.",
        guardHeader: "X-Proxy-Contract-Guard",
        guardValue: "playback-info",
        details: $(s) ? s : {
          reason: String(n || "invalid_payload"),
          upstreamStatus: Number(i?.status) || 0,
          contentType: dr(i?.headers?.get?.("Content-Type")) || "missing"
        }
      });
    },
    async guardPlaybackInfoResponseContract(r, a) {
      if (r?.requestTraits?.isPlaybackInfoRequest !== !0 || rr(a?.playbackInfoRepresentation) && a.playbackInfoRepresentation.response === a?.response) return a;
      const n = await Dl(a?.response, {
        requestMethod: r.requestMethod,
        maxBytes: wo
      });
      return n.kind === "skip" ? a : n.kind === "invalid" ? n.reason === "body_too_large" ? (r.playbackInfoRewrite = "skipped_oversized", a) : t.buildPlaybackInfoContractErrorState(r, a, n.reason, n.details) : {
        ...a,
        playbackInfoRepresentation: n.representation
      };
    },
    decodePlaybackInfoJsonValue: Ba,
    normalizePlaybackInfoObjectArray: po,
    sanitizePlaybackInfoMediaSource: ai,
    sanitizePlaybackInfoMediaSourcesPayload: go,
    rewritePlaybackInfoPayload(r, a, n, s) {
      return ni(a, { buildProxyUrl: (i) => t.buildPlaybackInfoProxyUrl(r, i, n, s) });
    },
    async maybeRewritePlaybackInfoResponse(r, a) {
      if (r?.requestTraits?.isPlaybackInfoRequest !== !0) return a;
      const n = Gt(r?.effectivePlaybackInfoMode) === "rewrite", s = n ? "not_needed" : "passthrough", i = a?.response;
      if (!i || !(i.status >= 200 && i.status < 300) || r.requestMethod === "HEAD" || i.status === 204 || i.status === 205 || !i.body)
        return r.playbackInfoRewrite !== "rejected" && (r.playbackInfoRewrite = s), a;
      if ((!rr(a?.playbackInfoRepresentation) || a.playbackInfoRepresentation.response !== i) && (a = await t.guardPlaybackInfoResponseContract(r, a), !rr(a?.playbackInfoRepresentation)))
        return a;
      try {
        const c = Il(a.playbackInfoRepresentation, {
          rewriteEnabled: n,
          buildProxyUrl: (l) => t.buildPlaybackInfoProxyUrl(r, l, a?.activeTargetBase, a?.finalUrl || new URL(String(r?.requestUrl || r?.rawRequestUrl || "")))
        });
        return c.kind !== "valid" ? t.buildPlaybackInfoContractErrorState(r, a, c.reason || "normalization_failed") : (r.playbackInfoRewrite = c.rewriteState, {
          ...a,
          response: c.representation.response,
          playbackInfoRepresentation: c.representation
        });
      } catch {
        return t.buildPlaybackInfoContractErrorState(r, a, "normalization_failed");
      }
    }
  };
  return t;
}
function Xg({ configReader: o, nodeRepository: e, logger: t, cachePort: r, fetchPort: a }) {
  const n = {}, s = {
    CacheManager: r,
    Logger: t,
    configReader: o,
    fetchPort: a,
    nodeRepository: e
  }, i = [
    Ig(s, n),
    vg(s, n),
    Kg(s, n),
    Vg(s, n),
    qg(s, n)
  ];
  for (const c of i) for (const [l, d] of Object.entries(c)) n[l] = d;
  return n;
}
function Yg({ configReader: o, nodeRepository: e, logger: t, cachePort: r, fetchPort: a }) {
  const n = Xg({
    configReader: o,
    nodeRepository: e,
    logger: t,
    cachePort: r,
    fetchPort: a
  });
  return Object.freeze({
    handle: (...s) => n.handle(...s),
    testingSupport: n
  });
}
function Jg(o = {}, e = {}) {
  return {
    getStatsBucketParts(t, r = k.Defaults.ScheduleUtcOffsetMinutes) {
      const a = ot(Number(t) || 0, r);
      return {
        bucketDate: a.dateKey,
        bucketHour: a.hour
      };
    },
    summarizeStatsHourlyEntries(t = [], r = {}) {
      const a = Oe(r.utcOffsetMinutes), n = /* @__PURE__ */ new Map();
      for (const s of Array.isArray(t) ? t : []) {
        const i = Number(s?.timestamp) || 0;
        if (i <= 0) continue;
        const { bucketDate: c, bucketHour: l } = e.getStatsBucketParts(i, a), d = `${c}:${l}`, u = n.get(d) || {
          bucketDate: c,
          bucketHour: l,
          requestCount: 0,
          playCount: 0,
          playbackInfoCount: 0
        };
        u.requestCount += 1, Kd(s?.requestPath, s?.category) && (u.playCount += 1), Bd(s?.requestPath, s?.category) && (u.playbackInfoCount += 1), n.set(d, u);
      }
      return [...n.values()].sort((s, i) => s.bucketDate !== i.bucketDate ? String(s.bucketDate).localeCompare(String(i.bucketDate)) : Number(s.bucketHour) - Number(i.bucketHour));
    },
    async incrementStatsHourly(t, r = [], a = {}) {
      if (!t || !await e.hasStatsHourlyTable(t)) return !1;
      const n = e.summarizeStatsHourlyEntries(r, a);
      return n.length ? await e.upsertStatsHourlyBuckets(t, n, a) : !0;
    },
    async upsertStatsHourlyBuckets(t, r = [], a = {}) {
      if (!t || !await e.hasStatsHourlyTable(t)) return !1;
      const n = (Array.isArray(r) ? r : []).map((c) => ({
        bucketDate: String(c?.bucketDate || "").trim(),
        bucketHour: Math.max(0, Number(c?.bucketHour) || 0),
        requestCount: Math.max(0, Number(c?.requestCount) || 0),
        playCount: Math.max(0, Number(c?.playCount) || 0),
        playbackInfoCount: Math.max(0, Number(c?.playbackInfoCount) || 0)
      })).filter((c) => c.bucketDate);
      if (!n.length) return !0;
      const s = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), i = Ha("proxy_stats_hourly.batch", JSON.stringify(n));
      return await t.prepare(`INSERT INTO ${e.STATS_HOURLY_TABLE} (
				bucket_date, bucket_hour, request_count, play_count, playback_info_count, updated_at
			)
			SELECT json_extract(entry.value, '$.bucketDate'), CAST(json_extract(entry.value, '$.bucketHour') AS INTEGER),
				CAST(json_extract(entry.value, '$.requestCount') AS INTEGER), CAST(json_extract(entry.value, '$.playCount') AS INTEGER),
				CAST(json_extract(entry.value, '$.playbackInfoCount') AS INTEGER), ?
			FROM json_each(?) AS entry
			WHERE 1
			ON CONFLICT(bucket_date, bucket_hour) DO UPDATE SET
				request_count = ${e.STATS_HOURLY_TABLE}.request_count + excluded.request_count,
				play_count = ${e.STATS_HOURLY_TABLE}.play_count + excluded.play_count,
				playback_info_count = ${e.STATS_HOURLY_TABLE}.playback_info_count + excluded.playback_info_count,
				updated_at = excluded.updated_at`).bind(s, i).run(), !0;
    },
    async clearStatsHourly(t) {
      return !t || !await e.hasStatsHourlyTable(t) ? !1 : (await t.prepare(`DELETE FROM ${e.STATS_HOURLY_TABLE}`).run(), !0);
    },
    getStatsUtcOffsetMinutesFromStatus(t = {}) {
      const r = Number(t?.statsUtcOffsetMinutes);
      return Number.isFinite(r) ? Oe(r) : null;
    },
    async getDailyStatsHourly(t, r) {
      if (!t || !r || !await e.hasStatsHourlyTable(t)) return [];
      try {
        const a = await t.prepare(`SELECT bucket_hour, request_count, play_count, playback_info_count
              FROM ${e.STATS_HOURLY_TABLE}
              WHERE bucket_date = ?
              ORDER BY bucket_hour ASC`).bind(String(r)).all();
        return Array.isArray(a?.results) ? a.results : [];
      } catch {
        return [];
      }
    },
    async rebuildStatsHourlyForDate(t, r = {}) {
      if (!t) return !1;
      const a = String(r.bucketDate || "").trim();
      return a ? (await e.ensureStatsHourlySchema(t), await t.prepare(`DELETE FROM ${e.STATS_HOURLY_TABLE} WHERE bucket_date = ?`).bind(a).run(), !0) : !1;
    },
    async rebuildStatsHourlyWindow(t, r = {}) {
      return t ? (await e.ensureStatsHourlySchema(t), await e.clearStatsHourly(t), !0) : !1;
    },
    async ensureStatsHourlyWindowAligned(t, r = {}) {
      const a = e.resolveOpsStatusStores(t), n = a?.db || null;
      if (!n || !await e.hasStatsHourlyTable(n)) return {
        rebuilt: !1,
        reason: "stats_unavailable"
      };
      const s = ae(r.config || {}), i = Oe(s.scheduleUtcOffsetMinutes), c = await e.getOpsStatusSection(a, "log");
      if (e.getStatsUtcOffsetMinutesFromStatus(c) === i && r.force !== !0) return {
        rebuilt: !1,
        reason: "already_aligned",
        utcOffsetMinutes: i
      };
      const l = r.now instanceof Date ? r.now : /* @__PURE__ */ new Date(), d = le(s.logRetentionDays, k.Defaults.LogRetentionDays, 1, k.Defaults.LogRetentionDaysMax), u = Math.max(0, l.getTime() - d * 24 * 60 * 60 * 1e3), f = l.getTime();
      return await e.rebuildStatsHourlyWindow(n, {
        startTs: u,
        endTs: f,
        utcOffsetMinutes: i
      }), await e.patchOpsStatus(a, { log: {
        schemaReady: !0,
        statsReady: !0,
        statsUtcOffsetMinutes: i,
        statsAlignedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
        statsAlignedWindowStartAt: new Date(u).toISOString(),
        statsAlignedWindowEndAt: new Date(f).toISOString()
      } }), {
        rebuilt: !0,
        utcOffsetMinutes: i,
        startTs: u,
        endTs: f
      };
    },
    getLegacyLogsFtsTriggerNames() {
      return new Set([
        String(e.LOGS_FTS_INSERT_TRIGGER || "").toLowerCase(),
        `${e.LOGS_TABLE}_ai`,
        `${e.LOGS_TABLE}_au`,
        `${e.LOGS_TABLE}_ad`,
        `${e.LOGS_FTS_TABLE}_ai`,
        `${e.LOGS_FTS_TABLE}_au`,
        `${e.LOGS_FTS_TABLE}_ad`
      ].map((t) => String(t || "").toLowerCase()));
    },
    isLogsFtsSyncTrigger(t) {
      const r = String(t?.name || "").trim();
      return r ? e.getLegacyLogsFtsTriggerNames().has(r.toLowerCase()) ? !0 : Cr(t?.sql || "").includes(e.LOGS_FTS_TABLE.toLowerCase()) : !1;
    },
    async dropLogsFtsSyncTriggers(t) {
      if (!t) return 0;
      let r = 0, a = [];
      try {
        a = (await t.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?").bind(e.LOGS_TABLE).all())?.results || [];
      } catch {
      }
      for (const n of a) {
        const s = String(n?.name || "").trim();
        s && e.isLogsFtsSyncTrigger(n) && (await t.prepare(`DROP TRIGGER IF EXISTS ${ce(s)}`).run(), r += 1);
      }
      return r;
    },
    async rebuildLogsFts(t) {
      return !t || !await e.hasLogsFtsTable(t) ? !1 : (await t.prepare(`INSERT INTO ${e.LOGS_FTS_TABLE}(${e.LOGS_FTS_TABLE}) VALUES('rebuild')`).run(), !0);
    },
    async ensureLogsFtsSchema(t, r = {}) {
      if (!t) return {
        migratedRows: 0,
        droppedTriggers: 0,
        rebuilt: !1,
        recreated: !1
      };
      const a = r.forceRecreate === !0;
      r.baseSchemaReady !== !0 && await e.ensureLogsBaseSchema(t);
      const n = await e.getLogsFtsReadiness(t);
      if (n.ready && !a) return {
        migratedRows: 0,
        droppedTriggers: 0,
        rebuilt: !1,
        recreated: !1
      };
      if (n.tableReady && !a) {
        const l = /* @__PURE__ */ new Error("Existing FTS schema does not match the current contract");
        throw l.code = "D1_SCHEMA_INCOMPATIBLE", l.status = 409, l.details = { phase: "fts_preflight" }, l;
      }
      let s = !1, i = 0;
      a && (i = await e.dropLogsFtsSyncTriggers(t), await t.prepare(`DROP TABLE IF EXISTS ${e.LOGS_FTS_TABLE}`).run(), s = !0), await t.prepare(`CREATE VIRTUAL TABLE IF NOT EXISTS ${e.LOGS_FTS_TABLE} USING fts5(node_name, request_path, user_agent, error_detail, detail_json, content='${e.LOGS_TABLE}', content_rowid='id', tokenize='unicode61')`).run(), a && (i += await e.dropLogsFtsSyncTriggers(t)), await t.prepare(`CREATE TRIGGER IF NOT EXISTS ${e.LOGS_FTS_INSERT_TRIGGER} AFTER INSERT ON ${e.LOGS_TABLE} BEGIN
            INSERT INTO ${e.LOGS_FTS_TABLE}(rowid, node_name, request_path, user_agent, error_detail, detail_json)
            VALUES (new.id, new.node_name, new.request_path, COALESCE(new.user_agent, ''), COALESCE(new.error_detail, ''), COALESCE(new.detail_json, ''));
          END;`).run();
      const c = (await t.prepare(`SELECT COUNT(*) as total FROM ${e.LOGS_TABLE}`).first())?.total || 0;
      return await t.prepare(`INSERT INTO ${e.LOGS_FTS_TABLE}(${e.LOGS_FTS_TABLE}) VALUES('rebuild')`).run(), {
        migratedRows: c,
        droppedTriggers: i,
        rebuilt: !0,
        recreated: s
      };
    }
  };
}
function Qg(o = {}, e = {}) {
  return {
    async ensureDnsIpWorkspaceSchema(t) {
      if (!t) return !1;
      if (e.isD1SchemaReadyCached(t, "dnsIpWorkspaceSchema")) return !0;
      let r = J.DnsIpWorkspaceDbReady.get(t);
      r || (r = (async () => (await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.DNS_IP_POOL_ITEMS_TABLE} (
                id TEXT PRIMARY KEY,
                ip TEXT NOT NULL UNIQUE,
                ip_type TEXT NOT NULL,
                source_kind TEXT NOT NULL,
                source_label TEXT,
                line_label TEXT NOT NULL DEFAULT '',
                remark TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
              )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_dns_ip_pool_items_updated_ip ON ${e.DNS_IP_POOL_ITEMS_TABLE} (updated_at DESC, ip ASC)`).run(), await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.DNS_IP_POOL_SOURCES_TABLE} (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                source_type TEXT NOT NULL DEFAULT 'url',
                domain TEXT,
                source_kind TEXT NOT NULL DEFAULT 'custom',
                preset_id TEXT NOT NULL DEFAULT '',
                builtin_id TEXT NOT NULL DEFAULT '',
                enabled INTEGER NOT NULL DEFAULT 1,
                sort_order INTEGER NOT NULL DEFAULT 0,
                ip_limit INTEGER NOT NULL DEFAULT 5,
                last_fetch_at TEXT,
                last_fetch_status TEXT,
                last_fetch_count INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
              )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_dns_ip_pool_sources_sort ON ${e.DNS_IP_POOL_SOURCES_TABLE} (sort_order ASC, updated_at ASC)`).run(), await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.DNS_IP_POOL_FETCH_CACHE_TABLE} (
                signature TEXT PRIMARY KEY,
                items_json TEXT NOT NULL,
                source_results_json TEXT NOT NULL,
                imported_count INTEGER NOT NULL DEFAULT 0,
                enabled_source_count INTEGER NOT NULL DEFAULT 0,
                cached_at INTEGER NOT NULL,
                expires_at INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
              )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_dns_ip_pool_fetch_cache_expires ON ${e.DNS_IP_POOL_FETCH_CACHE_TABLE} (expires_at)`).run(), await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.DNS_IP_PROBE_CACHE_TABLE} (
                ip TEXT NOT NULL,
                entry_colo TEXT NOT NULL,
                probe_status TEXT NOT NULL,
                latency_ms INTEGER,
                cf_ray TEXT,
                colo_code TEXT,
                city_name TEXT,
                country_code TEXT,
                country_name TEXT,
                probed_at TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                PRIMARY KEY (ip, entry_colo)
              )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_dns_ip_probe_cache_expire ON ${e.DNS_IP_PROBE_CACHE_TABLE} (expires_at)`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_dns_ip_probe_cache_colo_ip_expires ON ${e.DNS_IP_PROBE_CACHE_TABLE} (entry_colo, ip, expires_at)`).run(), e.markD1SchemaReady(t, "dnsIpWorkspaceSchema"), !0))().catch((a) => {
        throw J.DnsIpWorkspaceDbReady.delete(t), a;
      }), J.DnsIpWorkspaceDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.DnsIpWorkspaceDbReady.get(t) === r && J.DnsIpWorkspaceDbReady.delete(t);
      }
    },
    getDnsIpPoolRevisionFromStatus(t = {}) {
      const r = String(t?.revision || "").trim();
      return r || Ht("dns_ip_pool", String(t?.updatedAt || "").trim());
    },
    async bumpDnsIpPoolRevision(t, r = {}, a = null) {
      const n = await e.getOpsStatusSection(t, "dnsIpPool"), s = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), i = ne(`${e.getDnsIpPoolRevisionFromStatus(n)}:${s}:${ee(r)}`);
      return await e.patchOpsStatus(t, { dnsIpPool: {
        ...r,
        revision: Ht(i, s),
        updatedAt: s
      } }, a);
    },
    async getDnsIpPoolItems(t) {
      if (!t) return [];
      await e.ensureDnsIpWorkspaceSchema(t);
      try {
        const r = await t.prepare(`SELECT id, ip, ip_type, source_kind, source_label, line_label, remark, created_at, updated_at
              FROM ${e.DNS_IP_POOL_ITEMS_TABLE}
              ORDER BY updated_at DESC, ip ASC`).all();
        return (Array.isArray(r?.results) ? r.results : []).map((a) => fr(a)).filter(Boolean);
      } catch {
        return [];
      }
    },
    async upsertDnsIpPoolItems(t, r = [], a = {}) {
      if (!t) return [];
      await e.ensureDnsIpWorkspaceSchema(t);
      const n = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), s = /* @__PURE__ */ new Map();
      for (const d of Array.isArray(r) ? r : []) {
        const u = fr(d, {
          createdAt: n,
          updatedAt: n,
          sourceKind: a.sourceKind,
          sourceLabel: a.sourceLabel
        });
        u && s.set(u.ip.toLowerCase(), u);
      }
      const i = [...s.values()];
      if (!i.length) return [];
      const c = JSON.stringify(i.map((d) => ({
        id: d.id,
        ip: d.ip,
        ipType: d.ipType,
        sourceKind: d.sourceKind,
        sourceLabel: d.sourceLabel,
        lineLabel: d.lineLabel,
        remark: d.remark,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      })));
      Ha("dns_ip_pool_items.batch", c);
      const l = t.prepare(`INSERT INTO ${e.DNS_IP_POOL_ITEMS_TABLE} (
            id, ip, ip_type, source_kind, source_label, line_label, remark, created_at, updated_at
          )
          SELECT
            json_extract(entry.value, '$.id'),
            json_extract(entry.value, '$.ip'),
            json_extract(entry.value, '$.ipType'),
            json_extract(entry.value, '$.sourceKind'),
            json_extract(entry.value, '$.sourceLabel'),
            json_extract(entry.value, '$.lineLabel'),
            json_extract(entry.value, '$.remark'),
            json_extract(entry.value, '$.createdAt'),
            json_extract(entry.value, '$.updatedAt')
          FROM json_each(?) AS entry
          WHERE 1
          ON CONFLICT(ip) DO UPDATE SET
            ip_type = excluded.ip_type,
            source_kind = excluded.source_kind,
            source_label = excluded.source_label,
            line_label = CASE WHEN COALESCE(excluded.line_label, '') != '' THEN excluded.line_label ELSE ${e.DNS_IP_POOL_ITEMS_TABLE}.line_label END,
            remark = CASE WHEN COALESCE(excluded.remark, '') != '' THEN excluded.remark ELSE ${e.DNS_IP_POOL_ITEMS_TABLE}.remark END,
            updated_at = excluded.updated_at`).bind(c);
      return await t.batch([l]), i;
    },
    async deleteDnsIpPoolItems(t, r = []) {
      if (!t) return 0;
      await e.ensureDnsIpWorkspaceSchema(t);
      const a = [...new Set((Array.isArray(r) ? r : []).map((s) => String(s || "").trim()).filter((s) => qe(s)))];
      if (!a.length) return 0;
      const n = JSON.stringify(a);
      return Ha("dns_ip_pool_items.delete_batch", n), await t.batch([t.prepare(`DELETE FROM ${e.DNS_IP_POOL_ITEMS_TABLE} WHERE ip IN (SELECT value FROM json_each(?))`).bind(n), t.prepare(`DELETE FROM ${e.DNS_IP_PROBE_CACHE_TABLE} WHERE ip IN (SELECT value FROM json_each(?))`).bind(n)]), a.length;
    },
    async getDnsIpPoolSourcesFromDb(t, r = {}) {
      if (!t) return [];
      r.schemaReady !== !0 && await e.ensureDnsIpWorkspaceSchema(t);
      try {
        const a = await t.prepare(`SELECT id, name, url, source_type, domain, source_kind, preset_id, builtin_id, enabled, sort_order, ip_limit, last_fetch_at, last_fetch_status, last_fetch_count, created_at, updated_at
              FROM ${e.DNS_IP_POOL_SOURCES_TABLE}
              ORDER BY sort_order ASC, updated_at ASC`).all();
        return (Array.isArray(a?.results) ? a.results : []).map((n, s) => Dt(n, s)).filter((n) => or(n));
      } catch {
        return [];
      }
    },
    async getDnsIpPoolSourcesFromDbStrict(t) {
      if (!t) throw new Error("D1 not configured");
      await e.ensureDnsIpWorkspaceSchema(t);
      const r = await t.prepare(`SELECT id, name, url, source_type, domain, source_kind, preset_id, builtin_id, enabled, sort_order, ip_limit, last_fetch_at, last_fetch_status, last_fetch_count, created_at, updated_at
            FROM ${e.DNS_IP_POOL_SOURCES_TABLE}
            ORDER BY sort_order ASC, updated_at ASC`).all();
      return (Array.isArray(r?.results) ? r.results : []).map((a, n) => Dt(a, n)).filter((a) => or(a));
    },
    async getDnsIpPoolSources(t) {
      const r = e.resolveOpsStatusStores(t)?.db || null;
      return await e.getDnsIpPoolSourcesFromDb(r);
    },
    async getDnsIpPoolSourcesForRead(t) {
      const r = e.resolveOpsStatusStores(t)?.db || null;
      return await e.getDnsIpPoolSourcesFromDb(r);
    },
    async persistDnsIpPoolSources(t, r = [], a = null) {
      const n = (Array.isArray(r) ? r : []).map((c, l) => Dt(c, l)).filter((c) => or(c)), s = e.resolveOpsStatusStores(t)?.db || null;
      if (!s) throw new Error("D1 not configured");
      await e.ensureDnsIpWorkspaceSchema(s);
      const i = [s.prepare(`DELETE FROM ${e.DNS_IP_POOL_SOURCES_TABLE}`)];
      if (n.length) {
        const c = JSON.stringify(n.map((l) => ({
          id: l.id,
          name: l.name,
          url: l.url,
          sourceType: l.sourceType,
          domain: l.domain,
          sourceKind: l.sourceKind,
          presetId: l.presetId,
          builtinId: l.builtinId,
          enabled: l.enabled ? 1 : 0,
          sortOrder: l.sortOrder,
          ipLimit: l.ipLimit,
          lastFetchAt: l.lastFetchAt,
          lastFetchStatus: l.lastFetchStatus,
          lastFetchCount: l.lastFetchCount,
          createdAt: l.createdAt,
          updatedAt: l.updatedAt
        })));
        Ha("dns_ip_pool_sources.batch", c), i.push(s.prepare(`INSERT INTO ${e.DNS_IP_POOL_SOURCES_TABLE} (
            id, name, url, source_type, domain, source_kind, preset_id, builtin_id, enabled, sort_order, ip_limit, last_fetch_at, last_fetch_status, last_fetch_count, created_at, updated_at
          ) SELECT
            json_extract(entry.value, '$.id'),
            json_extract(entry.value, '$.name'),
            json_extract(entry.value, '$.url'),
            json_extract(entry.value, '$.sourceType'),
            json_extract(entry.value, '$.domain'),
            json_extract(entry.value, '$.sourceKind'),
            json_extract(entry.value, '$.presetId'),
            json_extract(entry.value, '$.builtinId'),
            json_extract(entry.value, '$.enabled'),
            json_extract(entry.value, '$.sortOrder'),
            json_extract(entry.value, '$.ipLimit'),
            json_extract(entry.value, '$.lastFetchAt'),
            json_extract(entry.value, '$.lastFetchStatus'),
            json_extract(entry.value, '$.lastFetchCount'),
            json_extract(entry.value, '$.createdAt'),
            json_extract(entry.value, '$.updatedAt')
          FROM json_each(?) AS entry`).bind(c));
      }
      return await s.batch(i), n;
    },
    async updateDnsIpPoolSourceFetchState(t, r = "", a = {}) {
      if (!t || !r) return !1;
      await e.ensureDnsIpWorkspaceSchema(t);
      const n = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString();
      return await t.prepare(`UPDATE ${e.DNS_IP_POOL_SOURCES_TABLE}
            SET last_fetch_at = ?, last_fetch_status = ?, last_fetch_count = ?, updated_at = ?
            WHERE id = ?`).bind(String(a.lastFetchAt || n), String(a.lastFetchStatus || ""), Math.max(0, Number(a.lastFetchCount) || 0), n, String(r)).run(), !0;
    },
    async getDnsIpPoolFetchCacheEntry(t, r = "") {
      if (!t || !r) return null;
      await e.ensureDnsIpWorkspaceSchema(t);
      try {
        const a = await t.prepare(`SELECT signature, items_json, source_results_json, imported_count, enabled_source_count, cached_at, expires_at, created_at, updated_at
              FROM ${e.DNS_IP_POOL_FETCH_CACHE_TABLE}
              WHERE signature = ? AND expires_at > ?
              LIMIT 1`).bind(String(r), H()).first();
        if (!a) return null;
        const n = JSON.parse(String(a.items_json || "[]")), s = JSON.parse(String(a.source_results_json || "[]")), i = mr(Array.isArray(n) ? n : []), c = Array.isArray(s) ? s : [];
        return {
          signature: String(a.signature || ""),
          items: i,
          sourceResults: c,
          importedCount: Math.max(0, Number(a.imported_count) || i.length),
          enabledSourceCount: Math.max(0, Number(a.enabled_source_count) || 0),
          cachedAtMs: Math.max(0, Number(a.cached_at) || 0),
          expiresAtMs: Math.max(0, Number(a.expires_at) || 0),
          createdAt: String(a.created_at || ""),
          updatedAt: String(a.updated_at || "")
        };
      } catch {
        return null;
      }
    },
    async upsertDnsIpPoolFetchCacheEntry(t, r = {}) {
      if (!t) return null;
      await e.ensureDnsIpWorkspaceSchema(t);
      const a = String(r?.signature || "").trim();
      if (!a) return null;
      const n = mr(r?.items || []), s = (Array.isArray(r?.sourceResults) ? r.sourceResults : []).map((g) => _i(g, g)), i = Math.max(0, Number(r?.cachedAtMs ?? r?.cached_at ?? H()) || H()), c = Math.max(i, Number(r?.expiresAtMs ?? r?.expires_at ?? i + 24e5) || i + 24e5), l = String(r?.createdAt || r?.created_at || new Date(i).toISOString()), d = String(r?.updatedAt || r?.updated_at || new Date(i).toISOString()), u = Math.max(0, Number(r?.importedCount ?? r?.imported_count) || n.length), f = Math.max(0, Number(r?.enabledSourceCount ?? r?.enabled_source_count) || 0), m = JSON.stringify(n), p = JSON.stringify(s);
      return Fe(m) + Fe(p) > Vt ? null : (await t.prepare(`INSERT INTO ${e.DNS_IP_POOL_FETCH_CACHE_TABLE} (
            signature, items_json, source_results_json, imported_count, enabled_source_count, cached_at, expires_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(signature) DO UPDATE SET
            items_json = excluded.items_json,
            source_results_json = excluded.source_results_json,
            imported_count = excluded.imported_count,
            enabled_source_count = excluded.enabled_source_count,
            cached_at = excluded.cached_at,
            expires_at = excluded.expires_at,
				updated_at = excluded.updated_at`).bind(a, m, p, u, f, i, c, l, d).run(), {
        signature: a,
        items: n,
        sourceResults: s,
        importedCount: u,
        enabledSourceCount: f,
        cachedAtMs: i,
        expiresAtMs: c,
        createdAt: l,
        updatedAt: d
      });
    },
    async getDnsIpProbeCacheEntry(t, r = "", a = "") {
      if (!t || !r || !a) return null;
      await e.ensureDnsIpWorkspaceSchema(t);
      try {
        const n = await t.prepare(`SELECT ip, entry_colo, probe_status, latency_ms, cf_ray, colo_code, city_name, country_code, country_name, probed_at, expires_at
              FROM ${e.DNS_IP_PROBE_CACHE_TABLE}
              WHERE ip = ? AND entry_colo = ? AND expires_at > ?
              LIMIT 1`).bind(String(r), String(a).toUpperCase(), H()).first();
        return n ? {
          ip: String(n.ip || ""),
          entryColo: String(n.entry_colo || "").toUpperCase(),
          probeStatus: Ua(n.probe_status),
          latencyMs: Number.isFinite(Number(n.latency_ms)) ? Math.round(Number(n.latency_ms)) : null,
          cfRay: String(n.cf_ray || ""),
          coloCode: String(n.colo_code || "").toUpperCase(),
          cityName: String(n.city_name || ""),
          countryCode: String(n.country_code || "").toUpperCase(),
          countryName: String(n.country_name || ""),
          probedAt: String(n.probed_at || ""),
          expiresAt: Math.max(0, Number(n.expires_at) || 0)
        } : null;
      } catch {
        return null;
      }
    },
    async getDnsIpProbeCacheEntries(t, r = [], a = "") {
      if (!t || !a) return [];
      const n = [...new Set((Array.isArray(r) ? r : []).map((c) => String(c || "").trim()).filter(Boolean))];
      if (!n.length) return [];
      await e.ensureDnsIpWorkspaceSchema(t);
      const s = [], i = H();
      try {
        for (let c = 0; c < n.length; c += 98) {
          const l = n.slice(c, c + 98);
          if (!l.length) continue;
          const d = l.map(() => "?").join(", "), u = await t.prepare(`SELECT ip, entry_colo, probe_status, latency_ms, cf_ray, colo_code, city_name, country_code, country_name, probed_at, expires_at
                FROM ${e.DNS_IP_PROBE_CACHE_TABLE}
                WHERE entry_colo = ? AND expires_at > ? AND ip IN (${d})`).bind(String(a).toUpperCase(), i, ...l).all();
          s.push(...Array.isArray(u?.results) ? u.results : []);
        }
      } catch {
        return [];
      }
      return s.map((c) => ({
        ip: String(c?.ip || ""),
        entryColo: String(c?.entry_colo || "").toUpperCase(),
        probeStatus: Ua(c?.probe_status),
        latencyMs: Number.isFinite(Number(c?.latency_ms)) ? Math.round(Number(c?.latency_ms)) : null,
        cfRay: String(c?.cf_ray || ""),
        coloCode: String(c?.colo_code || "").toUpperCase(),
        cityName: String(c?.city_name || ""),
        countryCode: String(c?.country_code || "").toUpperCase(),
        countryName: String(c?.country_name || ""),
        probedAt: String(c?.probed_at || ""),
        expiresAt: Math.max(0, Number(c?.expires_at) || 0)
      }));
    },
    async upsertDnsIpProbeCacheEntries(t, r = []) {
      if (!t) return [];
      await e.ensureDnsIpWorkspaceSchema(t);
      const a = (Array.isArray(r) ? r : []).map((s) => ({
        ip: String(s?.ip || "").trim(),
        entryColo: String(s?.entryColo || s?.entry_colo || "").trim().toUpperCase(),
        probeStatus: Ua(s?.probeStatus || s?.probe_status || ""),
        latencyMs: Number.isFinite(Number(s?.latencyMs ?? s?.latency_ms)) ? Math.round(Number(s?.latencyMs ?? s?.latency_ms)) : null,
        cfRay: String(s?.cfRay || s?.cf_ray || ""),
        coloCode: String(s?.coloCode || s?.colo_code || "").toUpperCase(),
        cityName: String(s?.cityName || s?.city_name || ""),
        countryCode: String(s?.countryCode || s?.country_code || "").toUpperCase(),
        countryName: String(s?.countryName || s?.country_name || ""),
        probedAt: String(s?.probedAt || s?.probed_at || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()),
        expiresAt: Math.max(H(), Number(s?.expiresAt ?? s?.expires_at) || 0)
      })).filter((s) => qe(s.ip) && s.entryColo);
      if (!a.length) return [];
      const n = JSON.stringify(a);
      return Fe(n) > Vt ? [] : (await t.prepare(`INSERT INTO ${e.DNS_IP_PROBE_CACHE_TABLE} (
				ip, entry_colo, probe_status, latency_ms, cf_ray, colo_code, city_name, country_code, country_name, probed_at, expires_at
			) SELECT
				json_extract(entry.value, '$.ip'),
				json_extract(entry.value, '$.entryColo'),
				json_extract(entry.value, '$.probeStatus'),
				json_extract(entry.value, '$.latencyMs'),
				json_extract(entry.value, '$.cfRay'),
				json_extract(entry.value, '$.coloCode'),
				json_extract(entry.value, '$.cityName'),
				json_extract(entry.value, '$.countryCode'),
				json_extract(entry.value, '$.countryName'),
				json_extract(entry.value, '$.probedAt'),
				json_extract(entry.value, '$.expiresAt')
			FROM json_each(?) AS entry
			WHERE 1
			ON CONFLICT(ip, entry_colo) DO UPDATE SET
            probe_status = excluded.probe_status,
            latency_ms = excluded.latency_ms,
            cf_ray = excluded.cf_ray,
            colo_code = excluded.colo_code,
            city_name = excluded.city_name,
            country_code = excluded.country_code,
            country_name = excluded.country_name,
            probed_at = excluded.probed_at,
				expires_at = excluded.expires_at`).bind(n).run(), a);
    },
    async upsertDnsIpProbeCacheEntry(t, r = {}) {
      return (await e.upsertDnsIpProbeCacheEntries(t, [r]))[0] || null;
    }
  };
}
function Zg(o = {}, e = {}) {
  return {
    resolveOpsStatusStores(t) {
      return t && typeof t == "object" && !Array.isArray(t) && ("kv" in t || "db" in t) ? {
        kv: t.kv || null,
        db: t.db || null
      } : t && typeof t.prepare == "function" ? {
        kv: null,
        db: t
      } : t && typeof t.get == "function" ? {
        kv: t,
        db: null
      } : {
        kv: e.getKV(t),
        db: e.getDB(t)
      };
    },
    getOpsStatusDbScope(t = "") {
      return t ? e.OPS_STATUS_SECTION_SCOPES[t] || `ops_status:${t}` : e.OPS_STATUS_DB_SCOPE_ROOT;
    },
    getOpsStatusShadowState(t) {
      if (!t || typeof t.prepare != "function") return null;
      let r = J.OpsStatusShadowCache.get(t);
      return r || (r = {
        pendingPatch: {},
        flushPromise: null,
        payloadCache: /* @__PURE__ */ new Map()
      }, J.OpsStatusShadowCache.set(t, r)), r;
    },
    getOpsStatusShadowPatch(t) {
      const r = e.getOpsStatusShadowState(t);
      return $(r?.pendingPatch) ? r.pendingPatch : {};
    },
    getOpsStatusPayloadCache(t) {
      const r = e.getOpsStatusShadowState(t);
      return r ? (r.payloadCache instanceof Map || (r.payloadCache = /* @__PURE__ */ new Map()), r.payloadCache) : null;
    },
    cacheOpsStatusPayload(t, r, a) {
      const n = e.getOpsStatusPayloadCache(t);
      n && Ie(n, String(r || ""), {
        payload: a && typeof a == "object" ? a : null,
        expiresAt: H() + Math.max(1e3, Number(k.Defaults.OpsStatusReadCacheTtlMs) || 1e3)
      }, 8);
    },
    buildOpsStatusRootPatch(t = {}) {
      const r = t && typeof t == "object" ? t : {}, a = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), n = {};
      for (const [s, i] of Object.entries(r)) {
        if (e.OPS_STATUS_SECTION_SCOPES[s]) {
          const c = Ve(n[s], i);
          c.updatedAt = a, n[s] = c;
          continue;
        }
        n[s] = i;
      }
      return n;
    },
    async flushOpsStatusShadow(t, r = {}) {
      const a = t?.db || null;
      if (!a) return {};
      const n = Array.isArray(r.patchKeys) ? r.patchKeys : [], s = e.getOpsStatusShadowState(a);
      if (!s) return {};
      if (s.flushPromise) return s.flushPromise;
      const i = (async () => {
        const c = $(s.pendingPatch) ? s.pendingPatch : {};
        if (!Object.keys(c).length) return await e.getOpsStatusFromStores(t);
        s.pendingPatch = {};
        try {
          const l = H(), d = new Date(l).toISOString();
          if (!await e.ensureSysStatusTable(a))
            return Ae("ops_status.db_unavailable", /* @__PURE__ */ new Error("sys_status table unavailable"), { patchKeys: n }), s.pendingPatch = Ve(c, s.pendingPatch), await e.getOpsStatusFromStores(t);
          const u = await e.getOpsStatusPayloadFromDb(a, e.getOpsStatusDbScope()), f = Ve(u && typeof u == "object" ? u : {}, c);
          return f.updatedAt = d, await e.putOpsStatusPayloadToDb(a, e.getOpsStatusDbScope(), f, l), Ve(f, e.getOpsStatusShadowPatch(a));
        } catch (l) {
          throw s.pendingPatch = Ve(c, s.pendingPatch), l;
        }
      })().finally(() => {
        s.flushPromise === i && (s.flushPromise = null);
      });
      return s.flushPromise = i, i;
    },
    async ensureSysStatusTable(t) {
      if (!t || typeof t.prepare != "function") return !1;
      if (e.isD1SchemaReadyCached(t, "sysStatusTable")) return !0;
      let r = J.OpsStatusDbReady.get(t);
      r || (r = (async () => {
        try {
          return await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.SYS_STATUS_TABLE} (scope TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)`).run(), e.markD1SchemaReady(t, "sysStatusTable"), !0;
        } catch (a) {
          return console.warn("sys_status init failed", a), !1;
        }
      })(), J.OpsStatusDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.OpsStatusDbReady.get(t) === r && J.OpsStatusDbReady.delete(t);
      }
    },
    async ensureAuthFailuresTable(t) {
      if (!t || typeof t.prepare != "function") return !1;
      if (e.isD1SchemaReadyCached(t, "authFailuresTable")) return !0;
      let r = J.AuthFailuresDbReady.get(t);
      r || (r = (async () => {
        try {
          return await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.AUTH_FAILURES_TABLE} (
                  ip TEXT PRIMARY KEY,
                  fail_count INTEGER NOT NULL,
                  expires_at INTEGER NOT NULL,
                  updated_at INTEGER NOT NULL
                )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_auth_failures_expires_at ON ${e.AUTH_FAILURES_TABLE} (expires_at)`).run(), e.markD1SchemaReady(t, "authFailuresTable"), !0;
        } catch (a) {
          return console.warn("auth_failures init failed", a), !1;
        }
      })(), J.AuthFailuresDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.AuthFailuresDbReady.get(t) === r && J.AuthFailuresDbReady.delete(t);
      }
    },
    async getAuthFailureEntry(t, r = "") {
      const a = String(r || "").trim();
      if (!a || !t || !await e.ensureAuthFailuresTable(t)) return null;
      try {
        const n = await t.prepare(`SELECT ip, fail_count, expires_at, updated_at
              FROM ${e.AUTH_FAILURES_TABLE}
              WHERE ip = ?
              LIMIT 1`).bind(a).first();
        if (!n) return null;
        const s = Number(n?.expires_at ?? n?.expiresAt) || 0;
        return s > 0 && s <= H() ? (await e.deleteAuthFailureEntry(t, a).catch(() => !1), null) : {
          ip: a,
          failCount: Math.max(0, Number(n?.fail_count ?? n?.failCount) || 0),
          expiresAt: s,
          updatedAt: Number(n?.updated_at ?? n?.updatedAt) || 0
        };
      } catch (n) {
        return Ae("auth_failures.read_failed", n, { ip: a }), null;
      }
    },
    async upsertAuthFailureEntry(t, r = "", a = {}) {
      const n = String(r || "").trim();
      if (!n || !t || !await e.ensureAuthFailuresTable(t)) return null;
      const s = Math.max(0, Number(a?.failCount) || 0), i = Math.max(0, Number(a?.expiresAt) || 0), c = Math.max(0, Number(a?.updatedAt) || H());
      return await t.prepare(`INSERT INTO ${e.AUTH_FAILURES_TABLE} (ip, fail_count, expires_at, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(ip) DO UPDATE SET
              fail_count = excluded.fail_count,
              expires_at = excluded.expires_at,
              updated_at = excluded.updated_at`).bind(n, s, i, c).run(), {
        ip: n,
        failCount: s,
        expiresAt: i,
        updatedAt: c
      };
    },
    async deleteAuthFailureEntry(t, r = "") {
      const a = String(r || "").trim();
      return !a || !t || !await e.ensureAuthFailuresTable(t) ? !1 : (await t.prepare(`DELETE FROM ${e.AUTH_FAILURES_TABLE} WHERE ip = ?`).bind(a).run(), !0);
    }
  };
}
function eh(o = {}, e = {}) {
  return {
    async ensureCfDashboardCacheTable(t) {
      if (!t || typeof t.prepare != "function") return !1;
      if (e.isD1SchemaReadyCached(t, "cfDashboardCacheTable")) return !0;
      let r = J.CfDashboardCacheDbReady.get(t);
      r || (r = (async () => {
        try {
          return await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.CF_DASH_CACHE_TABLE} (
                  cache_key TEXT PRIMARY KEY,
                  zone_id TEXT NOT NULL,
                  bucket_date TEXT NOT NULL,
                  payload TEXT NOT NULL,
                  version INTEGER NOT NULL,
                  cached_at INTEGER NOT NULL,
                  expires_at INTEGER NOT NULL,
                  updated_at INTEGER NOT NULL
                )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_cf_dashboard_cache_expires_at ON ${e.CF_DASH_CACHE_TABLE} (expires_at)`).run(), e.markD1SchemaReady(t, "cfDashboardCacheTable"), !0;
        } catch (a) {
          return console.warn("cf_dashboard_cache init failed", a), !1;
        }
      })(), J.CfDashboardCacheDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.CfDashboardCacheDbReady.get(t) === r && J.CfDashboardCacheDbReady.delete(t);
      }
    },
    async getCfDashboardCacheEntry(t, r = "", a = {}) {
      const n = String(r || "").trim();
      if (!n || !t || !await e.ensureCfDashboardCacheTable(t)) return null;
      const s = Math.max(0, Number(a.nowMs) || H()), i = a.includeExpired === !0, c = i ? `SELECT cache_key, zone_id, bucket_date, payload, version, cached_at, expires_at, updated_at
                FROM ${e.CF_DASH_CACHE_TABLE}
                WHERE cache_key = ?
                LIMIT 1` : `SELECT cache_key, zone_id, bucket_date, payload, version, cached_at, expires_at, updated_at
                FROM ${e.CF_DASH_CACHE_TABLE}
                WHERE cache_key = ? AND expires_at > ?
                LIMIT 1`;
      try {
        let l = t.prepare(c).bind(n);
        i || (l = t.prepare(c).bind(n, s));
        const d = await l.first();
        if (!d?.payload) return null;
        let u = null;
        try {
          u = JSON.parse(String(d.payload || "{}"));
        } catch {
          return null;
        }
        return {
          cacheKey: n,
          zoneId: String(d?.zone_id || d?.zoneId || ""),
          bucketDate: String(d?.bucket_date || d?.bucketDate || ""),
          payload: ro(u),
          version: Number(d?.version) || 0,
          cachedAt: Number(d?.cached_at ?? d?.cachedAt) || 0,
          expiresAt: Number(d?.expires_at ?? d?.expiresAt) || 0,
          updatedAt: Number(d?.updated_at ?? d?.updatedAt) || 0
        };
      } catch (l) {
        return Ae("cf_dashboard_cache.read_failed", l, { cacheKey: n }), null;
      }
    },
    async putCfDashboardCacheEntry(t, r = {}) {
      if (!t || !await e.ensureCfDashboardCacheTable(t)) return null;
      const a = String(r?.cacheKey || "").trim();
      if (!a) return null;
      const n = String(r?.zoneId || "").trim() || "default", s = String(r?.bucketDate || "").trim() || "current", i = Math.max(0, Number(r?.version) || 0), c = Math.max(0, Number(r?.cachedAt) || H()), l = Math.max(c, Number(r?.expiresAt) || c), d = Math.max(c, Number(r?.updatedAt) || c), u = JSON.stringify(ro(r?.payload || {}));
      return Fe(u) > Vt ? null : (await t.prepare(`INSERT INTO ${e.CF_DASH_CACHE_TABLE} (
            cache_key, zone_id, bucket_date, payload, version, cached_at, expires_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(cache_key) DO UPDATE SET
            zone_id = excluded.zone_id,
            bucket_date = excluded.bucket_date,
            payload = excluded.payload,
            version = excluded.version,
            cached_at = excluded.cached_at,
            expires_at = excluded.expires_at,
            updated_at = excluded.updated_at`).bind(a, n, s, u, i, c, l, d).run(), {
        cacheKey: a,
        zoneId: n,
        bucketDate: s,
        version: i,
        cachedAt: c,
        expiresAt: l,
        updatedAt: d
      });
    },
    async deleteCfDashboardCacheEntry(t, r = "") {
      const a = String(r || "").trim();
      if (!a || !t || !await e.ensureCfDashboardCacheTable(t)) return !1;
      try {
        return await t.prepare(`DELETE FROM ${e.CF_DASH_CACHE_TABLE} WHERE cache_key = ?`).bind(a).run(), !0;
      } catch (n) {
        return Ae("cf_dashboard_cache.delete_failed", n, { cacheKey: a }), !1;
      }
    },
    async invalidateDashboardSnapshotCacheForConfigChange(t, r = {}) {
      const a = r?.db || e.getDB(t);
      if (!a) return 0;
      const n = Math.max(0, Number(r.nowMs) || H()), s = /* @__PURE__ */ new Set();
      for (const i of [r?.prevConfig, r?.nextConfig]) {
        if (!i || typeof i != "object") continue;
        const c = ae(i), l = st(new Date(n), c.scheduleUtcOffsetMinutes);
        s.add(eo(c.cfZoneId, l.dateKey));
      }
      return s.size ? (await pe(Promise.all([...s].map((i) => e.deleteCfDashboardCacheEntry(a, i))), "dashboard.cache_invalidate", { cacheKeys: [...s] }, null), s.size) : 0;
    },
    async ensureCfRuntimeCacheTable(t) {
      if (!t || typeof t.prepare != "function") return !1;
      if (e.isD1SchemaReadyCached(t, "cfRuntimeCacheTable")) return !0;
      let r = J.CfRuntimeCacheDbReady.get(t);
      r || (r = (async () => {
        try {
          return await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.CF_RUNTIME_CACHE_TABLE} (
                  cache_key TEXT PRIMARY KEY,
                  cache_group TEXT NOT NULL,
                  resource_id TEXT NOT NULL,
                  payload TEXT NOT NULL,
                  cached_at INTEGER NOT NULL,
                  expires_at INTEGER NOT NULL,
                  updated_at INTEGER NOT NULL
                )`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_cf_runtime_cache_expires_at ON ${e.CF_RUNTIME_CACHE_TABLE} (expires_at)`).run(), e.markD1SchemaReady(t, "cfRuntimeCacheTable"), !0;
        } catch (a) {
          return console.warn("cf_runtime_cache init failed", a), !1;
        }
      })(), J.CfRuntimeCacheDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.CfRuntimeCacheDbReady.get(t) === r && J.CfRuntimeCacheDbReady.delete(t);
      }
    },
    async getCfRuntimeCacheEntry(t, r = "", a = {}) {
      const n = String(r || "").trim();
      if (!n || !t || !await e.ensureCfRuntimeCacheTable(t)) return null;
      const s = Math.max(0, Number(a.nowMs) || H()), i = a.includeExpired === !0, c = i ? `SELECT cache_key, cache_group, resource_id, payload, cached_at, expires_at, updated_at
                FROM ${e.CF_RUNTIME_CACHE_TABLE}
                WHERE cache_key = ?
                LIMIT 1` : `SELECT cache_key, cache_group, resource_id, payload, cached_at, expires_at, updated_at
                FROM ${e.CF_RUNTIME_CACHE_TABLE}
                WHERE cache_key = ? AND expires_at > ?
                LIMIT 1`;
      try {
        let l = t.prepare(c).bind(n);
        i || (l = t.prepare(c).bind(n, s));
        const d = await l.first();
        if (!d?.payload) return null;
        let u = null;
        try {
          u = JSON.parse(String(d.payload || "{}"));
        } catch {
          return null;
        }
        return {
          cacheKey: n,
          cacheGroup: String(d?.cache_group || d?.cacheGroup || ""),
          resourceId: String(d?.resource_id || d?.resourceId || ""),
          payload: ($(u), u),
          cachedAt: Number(d?.cached_at ?? d?.cachedAt) || 0,
          expiresAt: Number(d?.expires_at ?? d?.expiresAt) || 0,
          updatedAt: Number(d?.updated_at ?? d?.updatedAt) || 0
        };
      } catch (l) {
        return Ae("cf_runtime_cache.read_failed", l, { cacheKey: n }), null;
      }
    },
    async putCfRuntimeCacheEntry(t, r = {}) {
      if (!t || !await e.ensureCfRuntimeCacheTable(t)) return null;
      const a = String(r?.cacheKey || "").trim();
      if (!a) return null;
      const n = String(r?.cacheGroup || "").trim() || "runtime", s = String(r?.resourceId || "").trim() || "default", i = Math.max(0, Number(r?.cachedAt) || H()), c = Math.max(i, Number(r?.expiresAt) || i), l = Math.max(i, Number(r?.updatedAt) || i), d = JSON.stringify(r?.payload ?? {});
      return Fe(d) > Vt ? null : (await t.prepare(`INSERT INTO ${e.CF_RUNTIME_CACHE_TABLE} (
            cache_key, cache_group, resource_id, payload, cached_at, expires_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(cache_key) DO UPDATE SET
            cache_group = excluded.cache_group,
            resource_id = excluded.resource_id,
            payload = excluded.payload,
            cached_at = excluded.cached_at,
            expires_at = excluded.expires_at,
            updated_at = excluded.updated_at`).bind(a, n, s, d, i, c, l).run(), {
        cacheKey: a,
        cacheGroup: n,
        resourceId: s,
        cachedAt: i,
        expiresAt: c,
        updatedAt: l
      });
    },
    async loadCfRuntimeCachePayload(t, r = {}) {
      const a = String(r.cacheKey || "").trim(), n = String(r.cacheGroup || "").trim() || "runtime", s = String(r.resourceId || "").trim() || "default", i = Math.max(1e3, Number(r.ttlMs) || 3e5), c = Math.max(0, Number(r.nowMs) || H()), l = r.skipCacheRead === !0, d = typeof r.loader == "function" ? r.loader : null;
      if (!a || !d) throw new Error("cf_runtime_cache_loader_missing");
      const u = t ? await e.getCfRuntimeCacheEntry(t, a, {
        nowMs: c,
        includeExpired: !0
      }) : null, f = !l && u && u.expiresAt > c ? u : null;
      if (f?.payload !== void 0) return {
        payload: f.payload,
        cachedAt: f.cachedAt,
        expiresAt: f.expiresAt,
        updatedAt: f.updatedAt,
        stale: !1,
        source: "d1_cache",
        error: null
      };
      const m = u;
      try {
        return {
          payload: await Kt(ct([
            "cf_runtime",
            n,
            a
          ]), async () => {
            const p = await d();
            return t && await pe(e.putCfRuntimeCacheEntry(t, {
              cacheKey: a,
              cacheGroup: n,
              resourceId: s,
              payload: p,
              cachedAt: c,
              expiresAt: c + i,
              updatedAt: c
            }), "cf_runtime_cache.write", {
              cacheKey: a,
              cacheGroup: n,
              resourceId: s
            }, null), p;
          }),
          cachedAt: c,
          expiresAt: c + i,
          updatedAt: c,
          stale: !1,
          source: t ? "live_then_cached" : "live",
          error: null
        };
      } catch (p) {
        if (m?.payload !== void 0 && r.allowStale !== !1) return {
          payload: m.payload,
          cachedAt: m.cachedAt,
          expiresAt: m.expiresAt,
          updatedAt: m.updatedAt,
          stale: !0,
          source: "stale_cache",
          error: p
        };
        throw p;
      }
    }
  };
}
function th(o = {}, e = {}) {
  return {
    buildCloudflareKvQuotaCard({ planProfile: t = {}, planState: r = {}, usageState: a = {}, namespaceId: n = "", nowTimestamp: s = H() } = {}) {
      const i = ba(t?.planClass), c = $(a?.payload) ? a.payload : {}, l = String(c.namespaceTitle || t?.resourceMeta?.kv?.namespaceTitle || n || "未命名 Namespace").trim(), d = [
        Er({
          key: "read",
          label: "读",
          used: c.readCount,
          limit: i.kv.read,
          kind: "count"
        }),
        Er({
          key: "write",
          label: "写",
          used: c.writeCount,
          limit: i.kv.write,
          kind: "count"
        }),
        Er({
          key: "storage",
          label: "容量",
          used: c.storageBytes,
          limit: i.kv.storageBytes,
          kind: "bytes"
        })
      ], u = [];
      r?.stale === !0 && u.push("计划信息"), a?.stale === !0 && u.push("实时指标");
      const f = [];
      u.length > 0 && f.push(`${u.join("、")} 使用 stale cache`), f.push(`delete：${ye(c.deleteCount)} / ${ye(i.kv.delete)}`), f.push(`list：${ye(c.listCount)} / ${ye(i.kv.list)}`), f.push(`命名空间：${l}`);
      const m = Es(a?.cachedAt, s);
      m && f.push(m), f.push(i.planClass === "paid" ? "容量条按 1 GB included quota 展示，PAID 下这是 included quota，不是硬停止线" : "容量条按 1 GB included quota 展示");
      const p = Ts(d);
      return p.length > 0 && f.push(`超额项目：${p.join("、")}（进度条按 100% 封顶）`), a?.error && f.push(`Cloudflare 详情：${kt(a.error)}`), Ya({
        title: "KV",
        status: u.length > 0 ? "partial_failure" : "success",
        summary: `${i.planLabel} 计划 · ${i.periodLabel}配额`,
        detail: f.join("；"),
        planLabel: i.planLabel,
        periodLabel: i.periodLabel,
        resourceLabel: l,
        metrics: d
      });
    },
    buildCloudflareD1QuotaCard({ planProfile: t = {}, planState: r = {}, usageState: a = {}, databaseId: n = "", nowTimestamp: s = H() } = {}) {
      const i = ba(t?.planClass), c = $(a?.payload) ? a.payload : {}, l = String(c.databaseName || t?.resourceMeta?.d1?.databaseName || n || "未命名数据库").trim(), d = [
        Er({
          key: "rowsRead",
          label: "读",
          used: c.rowsRead,
          limit: i.d1.rowsRead,
          kind: "count"
        }),
        Er({
          key: "rowsWritten",
          label: "写",
          used: c.rowsWritten,
          limit: i.d1.rowsWritten,
          kind: "count"
        }),
        Er({
          key: "storage",
          label: "容量",
          used: c.fileSizeBytes,
          limit: i.d1.storageBytes,
          kind: "bytes"
        })
      ], u = [];
      r?.stale === !0 && u.push("计划信息"), a?.stale === !0 && u.push("实时指标");
      const f = [];
      u.length > 0 && f.push(`${u.join("、")} 使用 stale cache`), f.push(`SQL 次数：读 ${ye(c.readQueries)} / 写 ${ye(c.writeQueries)}`), f.push(`数据库：${l}`);
      const m = Es(a?.cachedAt, s);
      m && f.push(m), f.push(`容量条按单库硬上限 ${Xa(i.d1.storageBytes)} 展示`);
      const p = Ts(d);
      return p.length > 0 && f.push(`超额项目：${p.join("、")}（进度条按 100% 封顶）`), a?.error && f.push(`Cloudflare 详情：${kt(a.error)}`), Ya({
        title: "D1",
        status: u.length > 0 ? "partial_failure" : "success",
        summary: `${i.planLabel} 计划 · ${i.periodLabel}配额`,
        detail: f.join("；"),
        planLabel: i.planLabel,
        periodLabel: i.periodLabel,
        resourceLabel: l,
        metrics: d
      });
    },
    async buildDashboardD1WriteHotspotPayload(t, r = {}) {
      const a = ae(r?.config || await ue(t)), n = Math.max(0, Number(r?.nowMs) || H()), s = Oe(a.scheduleUtcOffsetMinutes), i = String(a.cfAccountId || "").trim(), c = String(a.cfApiToken || "").trim(), l = String(a.cfD1DatabaseId || "").trim(), d = {
        utcOffsetMinutes: s,
        nowMs: n,
        source: "cloudflare_d1_analytics"
      };
      if (!i || !c || !l) return en({
        ...d,
        status: "unconfigured",
        summary: "D1 写入热点尚未启用",
        detail: "请先在账号设置中填写 Cloudflare 账号 ID、API 令牌与 D1 Database ID。"
      });
      const u = st(new Date(n), s).startTs - 8640 * 60 * 1e3, f = await vf({
        accountId: i,
        apiToken: c,
        databaseId: l,
        startIso: new Date(u).toISOString(),
        endIso: new Date(n).toISOString(),
        utcOffsetMinutes: s
      }), m = new Map(f.map((b) => [`${b.dateKey}:${b.hour}`, b])), p = Bc(), g = [];
      let h = 0, y = 0, _ = 0, S = null;
      for (const b of f)
        h += Math.max(0, Number(b?.rowsWritten) || 0), y += Math.max(0, Number(b?.writeQueries) || 0), (Number(b?.rowsWritten) || 0) > _ && (_ = Math.max(0, Number(b?.rowsWritten) || 0), S = b);
      for (let b = 0; b < 7; b += 1) {
        const R = ot(u + b * 24 * 60 * 60 * 1e3, s).dateKey;
        g.push({
          key: R,
          dateKey: R,
          label: to(R),
          cells: Array.from({ length: 24 }, (w, L) => {
            const U = m.get(`${R}:${L}`) || null, E = Math.max(0, Number(U?.rowsWritten) || 0), D = Math.max(0, Number(U?.writeQueries) || 0), A = _ > 0 ? E / _ : 0;
            return Kc(R, L, E, D, A);
          })
        });
      }
      const T = S ? `峰值：${to(S.dateKey)} ${String(S.hour).padStart(2, "0")}:00 写入 ${ye(S.rowsWritten)} 行 / SQL ${ye(S.writeQueries)} 次` : "";
      return {
        title: "D1 写入热点图",
        status: "success",
        source: "cloudflare_d1_analytics",
        summary: h > 0 ? `最近 7 天累计写入 ${ye(h)} 行` : "最近 7 天未检测到 D1 写入",
        detail: h > 0 ? "热点强度按 rowsWritten 计算；悬停单元格可查看对应小时的 SQL 写次数。" : "Cloudflare D1 Analytics 当前窗口内没有返回 rowsWritten 数据。",
        periodLabel: `最近 7 天 · ${yo(s)}`,
        hourLabels: p,
        rows: g,
        available: h > 0,
        totalRowsWritten: h,
        totalWriteQueries: y,
        peakLabel: T,
        legendMaxLabel: ye(_)
      };
    },
    async buildDashboardMonthlyTrafficPayload(t, r = {}) {
      const a = ae(r?.config || await ue(t)), n = Math.max(0, Number(r.nowMs) || H()), s = r?.monthWindow || ks(new Date(n), a.scheduleUtcOffsetMinutes), i = String(a.cfZoneId || "").trim(), c = String(a.cfApiToken || "").trim(), l = {
        period: "month",
        periodKey: s.monthKey,
        periodLabel: s.periodLabel,
        generatedAt: new Date(n).toISOString(),
        cacheStatus: "live"
      };
      if (!i || !c) return Jt({
        ...l,
        traffic: "未配置",
        cfAnalyticsLoaded: !1,
        cfAnalyticsStatus: "未配置 Cloudflare",
        cfAnalyticsError: "请在账号设置中填写并保存 Cloudflare Zone ID 与 API 令牌",
        trafficSourceText: "本月视频流量：未配置 Cloudflare，无法获取 CF Zone 总流量"
      });
      const d = 1440 * 60 * 1e3, u = Oe(a.scheduleUtcOffsetMinutes), f = r?.kv || e.getKV(t), m = n - $a * d, p = [];
      for (let R = s.startTs; R <= s.endTs; R += d) p.push({
        startTs: R,
        endTs: Math.min(s.endTs, R + d - 1),
        dateKey: ot(new Date(R), u).dateKey
      });
      let g = 0, h = 0, y = 0, _ = 0, S = null;
      const T = 4;
      for (let R = 0; R < p.length; R += T) {
        const w = await Promise.all(p.slice(R, R + T).map(async ({ startTs: L, endTs: U, dateKey: E }) => {
          const D = await Hs(f, i, E);
          let A = null;
          try {
            A = await As(i, c, L, U);
          } catch (x) {
            S = S || x;
          }
          return A === null ? D !== null ? {
            bytes: D,
            source: "archive"
          } : {
            bytes: 0,
            source: "missing"
          } : (U < n && L >= m && D === null && await $s(f, i, {
            dateKey: E,
            bytes: A,
            dayEndTs: U
          }), A === 0 && D !== null ? {
            bytes: D,
            source: "archive"
          } : A === 0 && L < m ? {
            bytes: 0,
            source: "missing"
          } : {
            bytes: A,
            source: "cf"
          });
        }));
        for (const L of w)
          g += Math.max(0, Number(L?.bytes) || 0), L?.source === "archive" ? h += 1 : L?.source === "missing" ? y += 1 : L?.source === "cf" && (_ += 1);
      }
      if (_ === 0 && h === 0 && S) throw S;
      const b = y > 0 ? `本地归档缺失 ${y} 天（免费版 CF Zone 分析仅保留约 ${$a} 天）` : "";
      return Jt({
        ...l,
        traffic: Xa(g),
        totalBytes: g,
        cfAnalyticsLoaded: !0,
        cfAnalyticsStatus: y > 0 ? "Cloudflare 统计正常（部分日期缺失）" : "Cloudflare 统计正常",
        cfAnalyticsError: "",
        cfAnalyticsDetail: b,
        trafficSourceText: `${s.periodLabel}视频流量：CF Zone 总流量（edgeResponseBytes）${h > 0 ? `（本地归档 ${h} 天）` : ""}${b ? `；${b}` : ""}`,
        warning: b
      });
    },
    async snapshotCfDailyTrafficArchive(t, r = {}) {
      const a = ae(r?.config || await ue(t)), n = r?.kv || e.getKV(t), s = String(a.cfZoneId || "").trim(), i = String(a.cfApiToken || "").trim();
      if (!n || !s || !i) return {
        status: "skipped",
        storedCount: 0,
        errors: []
      };
      const c = Math.max(0, Number(r?.nowMs) || H()), l = Oe(a.scheduleUtcOffsetMinutes), d = st(new Date(c), l), u = 1440 * 60 * 1e3, f = c - $a * u;
      let m = 0;
      const p = [];
      for (let g = 1; g <= np; g += 1) {
        const h = d.startTs - g * u, y = h + u - 1, _ = ot(new Date(h), l).dateKey;
        if (!(h < f) && await Hs(n, s, _) === null)
          try {
            await $s(n, s, {
              dateKey: _,
              bytes: await As(s, i, h, y),
              dayEndTs: y
            }) && (m += 1);
          } catch (S) {
            p.push(String(S?.message || S));
          }
      }
      return {
        status: p.length > 0 ? "partial_failure" : "success",
        storedCount: m,
        errors: p
      };
    },
    async getDashboardMonthlyTrafficPayload(t, r = {}) {
      const a = ae(r?.config || await ue(t)), n = r?.ctx || null, s = r?.forceRefresh === !0, i = Math.max(0, Number(r.nowMs) || H()), c = r?.monthWindow || ks(new Date(i), a.scheduleUtcOffsetMinutes), l = String(a.cfZoneId || "").trim();
      if (!l || !String(a.cfApiToken || "").trim()) return await e.buildDashboardMonthlyTrafficPayload(t, {
        config: a,
        monthWindow: c,
        nowMs: i
      });
      const d = op(l, c.monthKey, a.scheduleUtcOffsetMinutes), u = sp(d), f = ur();
      let m = null;
      const p = te.DashboardMonthlyTrafficCache.get(d);
      if (p?.staleUntil > i) {
        if (Ie(te.DashboardMonthlyTrafficCache, d, p, 64), m = p, !s && p.expiresAt > i) return Jt({
          ...p.payload,
          cacheStatus: "cache"
        });
      } else p && te.DashboardMonthlyTrafficCache.delete(d);
      if (f && u) try {
        const g = await f.match(u);
        if (g) {
          const h = await Ne(g, sn), y = h.exceeded ? null : JSON.parse(h.text || "null");
          if (Number(y?.version) === 1 && String(y?.cacheKey || "") === d && Number(y?.staleUntil) > i && (m = {
            payload: Jt(y.payload),
            cachedAt: Number(y.cachedAt) || 0,
            expiresAt: Number(y.expiresAt) || 0,
            staleUntil: Number(y.staleUntil) || 0
          }, Ie(te.DashboardMonthlyTrafficCache, d, m, 64), !s && m.expiresAt > i))
            return Jt({
              ...m.payload,
              cacheStatus: "cache"
            });
        }
      } catch (g) {
        Ae("dashboard.monthly_traffic_cache_read_failed", g, { cacheKey: d });
      }
      try {
        return await Kt(ct([
          "dashboard_monthly_traffic",
          d,
          s ? "force" : "default"
        ]), async () => {
          const g = await e.buildDashboardMonthlyTrafficPayload(t, {
            config: a,
            monthWindow: c,
            nowMs: i
          }), h = i, y = h + tp, _ = h + Fs, S = {
            version: 1,
            cacheKey: d,
            cachedAt: h,
            expiresAt: y,
            staleUntil: _,
            payload: g
          };
          if (Ie(te.DashboardMonthlyTrafficCache, d, {
            payload: g,
            cachedAt: h,
            expiresAt: y,
            staleUntil: _
          }, 64), f && u) {
            const T = f.put(u, new Response(JSON.stringify(S), { headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": `public, max-age=${Math.floor(Fs / 1e3)}`
            } }));
            n ? n.waitUntil(pe(T, "dashboard.monthly_traffic_cache_write", { cacheKey: d }, null)) : await pe(T, "dashboard.monthly_traffic_cache_write", { cacheKey: d }, null);
          }
          return g;
        });
      } catch (g) {
        if (m?.payload && m.staleUntil > i) return Jt({
          ...m.payload,
          cacheStatus: "stale",
          warning: zc(g, "monthly_traffic_refresh_failed")
        });
        const h = dc(g?.message || g, { zoneId: l });
        return Jt({
          periodKey: c.monthKey,
          periodLabel: c.periodLabel,
          traffic: "CF 查询失败",
          cfAnalyticsLoaded: !1,
          cfAnalyticsStatus: h.status,
          cfAnalyticsError: h.hint,
          cfAnalyticsDetail: h.detail,
          trafficSourceText: `${c.periodLabel}视频流量：CF Zone 总流量（edgeResponseBytes）`,
          generatedAt: new Date(i).toISOString(),
          cacheStatus: "live"
        });
      }
    }
  };
}
function rh(o = {}, e = {}) {
  const { CacheManager: t, withAdminShellRuntimeStatus: r } = o;
  return {
    async buildDashboardStatsPayload(a, n = {}) {
      const s = n?.ctx || null, i = n?.kv || e.getKV(a), c = n?.db || e.getDB(a), l = ae(n?.config || await ue(a)), d = Math.max(0, Number(n.nowMs) || H()), u = n?.dayWindow || st(new Date(d), l.scheduleUtcOffsetMinutes), f = n?.skipD1WriteHotspot !== !1, m = f ? null : e.buildDashboardD1WriteHotspotPayload(a, {
        config: l,
        nowMs: d
      });
      let p = null, g = "未配置", h = 0, y = !1, _ = !1, S = "", T = "", b = "", R = "pending", w = "等待数据加载", L = "视频流量口径：CF Zone 总流量", U = new Date(d).toISOString(), E = Array.from({ length: 24 }, (F, V) => ({
        label: String(V).padStart(2, "0") + ":00",
        total: 0
      })), D = 0, A = 0, x = "", O = en({
        utcOffsetMinutes: l.scheduleUtcOffsetMinutes,
        nowMs: d
      });
      h = (await t.getNodesListStrict(a, s)).length || 0;
      const N = u.dateKey, v = u.startTs, P = u.endTs, C = String(l.cfZoneId || "").trim(), I = String(l.cfApiToken || "").trim();
      if (C && I) {
        const F = new Date(v).toISOString(), V = new Date(P).toISOString(), j = `
                query {
                  viewer {
                    zones(filter: { zoneTag: ${_e(C)} }) {
                      series: httpRequestsAdaptiveGroups(limit: 10000, filter: { datetime_geq: ${_e(F)}, datetime_leq: ${_e(V)} }) {
                        count
                        dimensions { datetimeHour }
                        sum { edgeResponseBytes }
                      }
                    }
                  }
                }`;
        try {
          const K = await Tc(C, I, {
            scope: "dashboard.stats.zone_lookup",
            context: { feature: "dashboard_stats" }
          });
          x = String(K?.name || "").trim();
          const q = await bc(C, I, j);
          if (q) {
            let de = 0, he = 0, fe = Array.from({ length: 24 }, (ie, me) => ({
              label: String(me).padStart(2, "0") + ":00",
              total: 0
            }));
            (Array.isArray(q.series) ? [...q.series].sort((ie, me) => String(ie?.dimensions?.datetimeHour || "").localeCompare(String(me?.dimensions?.datetimeHour || ""))) : []).forEach((ie) => {
              const me = Number(ie.count) || 0, Me = Number(ie.sum?.edgeResponseBytes) || 0;
              de += me, he += Me;
              const Ue = ie?.dimensions?.datetimeHour;
              if (Ue && !Number.isNaN(new Date(Ue).getTime())) {
                const et = ot(new Date(Ue), l.scheduleUtcOffsetMinutes).hour;
                fe[et].total += me;
              }
            }), g = Xa(he), y = !0, S = "Cloudflare 统计正常", L = "视频流量当前对齐：CF Zone 总流量（edgeResponseBytes）";
            try {
              const ie = await Ff({
                cfAccountId: String(l.cfAccountId || "").trim(),
                cfZoneId: C,
                cfApiToken: I,
                startIso: F,
                endIso: V,
                utcOffsetMinutes: l.scheduleUtcOffsetMinutes
              });
              ie && Number.isFinite(ie.totalRequests) && (p = ie.totalRequests, E = ie.hourlySeries, _ = !0, R = "workers_usage", w = "今日请求量口径：Cloudflare Workers Usage", S = "Cloudflare 统计正常");
            } catch (ie) {
              console.log("CF workers usage fetch failed", ie);
            }
            _ || (p = de, E = fe, _ = !0, R = "zone_analytics", w = "今日请求量当前对齐：Cloudflare Zone Analytics");
          } else
            S = "Zone 未命中", T = "GraphQL 返回空；请检查 Zone ID 或权限", g = "CF 无统计数据";
        } catch (K) {
          const q = dc(K?.message || K, { zoneId: C });
          S = q.status, T = q.hint, b = q.detail, g = "CF 查询失败";
        }
      } else
        S = "未配置 Cloudflare", T = "请在账号设置中填写并保存 Cloudflare Zone ID 与 API 令牌", L = "视频流量当前对齐：未配置 Cloudflare，无法获取 CF Zone 总流量";
      if (c) try {
        await e.ensureStatsHourlyWindowAligned({
          db: c,
          kv: i
        }, {
          config: l,
          now: u.now
        });
        const F = await e.resolveLogsReadiness({
          db: c,
          kv: i
        }), V = F.statsReady === !0 ? await e.getDailyStatsHourly(c, N) : [];
        if (D = V.reduce((j, K) => j + (Number(K?.play_count || K?.playCount) || 0), 0), A = V.reduce((j, K) => j + (Number(K?.playback_info_count || K?.playbackInfoCount) || 0), 0), !_ && F.statsReady === !0) {
          p = V.reduce((j, K) => j + (Number(K?.request_count || K?.requestCount) || 0), 0), E = Array.from({ length: 24 }, (j, K) => ({
            label: String(K).padStart(2, "0") + ":00",
            total: 0
          }));
          for (const j of V) {
            const K = Number.parseInt(String(j?.bucket_hour ?? j?.bucketHour), 10);
            !Number.isNaN(K) && E[K] && (E[K].total += Number(j?.request_count || j?.requestCount) || 0);
          }
          _ = !0, R = "d1_hourly_stats", w = "今日请求量当前对齐：本地 D1 预聚合";
        }
      } catch (F) {
        console.log("DB aggregated stats read failed:", F);
      }
      if (_ || (p = null, !C || !I ? (R = "unconfigured", w = c ? "今日请求量暂不可用：未配置 Cloudflare 联动，且本地 D1 日志未初始化或不可读" : "今日请求量未配置：未绑定 D1，且未配置 Cloudflare 联动") : (R = "pending", w = c ? "今日请求量暂不可用：Cloudflare 请求数查询失败，且本地 D1 日志未初始化或不可读" : "今日请求量暂不可用：Cloudflare 请求数查询失败，且未绑定 D1")), !f) try {
        O = await m;
      } catch (F) {
        console.log("D1 write hotspot read failed:", F), O = en({
          utcOffsetMinutes: l.scheduleUtcOffsetMinutes,
          nowMs: d,
          status: "failed",
          source: "cloudflare_d1_analytics",
          summary: "D1 写入热点暂不可用",
          detail: kt(F, "d1_write_hotspot_failed")
        });
      }
      const M = p == null ? R === "unconfigured" ? "未配置" : "暂不可用" : String(Number(p) || 0);
      return Ko({
        todayRequests: p,
        requestCountDisplay: M,
        todayTraffic: g,
        hourlySeries: E,
        requestSource: R,
        requestSourceText: w,
        trafficSourceText: L,
        generatedAt: U,
        zoneName: x,
        cfAnalyticsLoaded: y,
        cfAnalyticsStatus: S,
        cfAnalyticsError: T,
        cfAnalyticsDetail: b,
        playCount: D,
        infoCount: A,
        nodeCount: h,
        cacheStatus: "live",
        d1WriteHotspot: O
      });
    },
    async buildDashboardRuntimeStatusPayload(a, n = {}) {
      const s = n?.db || e.getDB(a), i = n?.kv || e.getKV(a), c = ae(n?.config || await ue(a)), l = n?.forceRefresh === !0, d = await e.getOpsStatus({
        kv: i,
        db: s
      });
      let u = {
        kv: Tr("KV", "Cloudflare 配额尚未加载", "等待运行状态接口返回 Cloudflare 配额数据。"),
        d1: Tr("D1", "Cloudflare 配额尚未加载", "等待运行状态接口返回 Cloudflare 配额数据。")
      };
      try {
        u = await e.getCloudflareRuntimeQuotaStatus(a, {
          config: c,
          db: s,
          forceRefresh: l
        });
      } catch (f) {
        const m = kt(f, "runtime_config_read_failed");
        u = {
          kv: Rr("KV", "Cloudflare 配额读取失败", m),
          d1: Rr("D1", "Cloudflare 配额读取失败", m)
        };
      }
      return {
        ...d && typeof d == "object" ? d : {},
        cloudflare: u
      };
    },
    async getRuntimeStatusPayload(a, n = {}) {
      const s = n?.db || e.getDB(a), i = n?.kv || e.getKV(a), c = ae(n?.config || await ue(a)), l = $e(a), d = n?.forceRefresh === !0, u = Math.max(0, Number(n.nowMs) || H()), f = await Kt(ct(["runtime_status", d ? "force" : "default"]), async () => e.buildDashboardRuntimeStatusPayload(a, {
        kv: i,
        db: s,
        config: c,
        forceRefresh: d
      }));
      return {
        status: r(f, a, c, l),
        cacheMeta: Wo({
          cacheStatus: "live",
          cachedAt: u,
          expiresAt: u,
          updatedAt: u,
          generatedAt: new Date(u).toISOString(),
          warning: "",
          partial: !1
        })
      };
    },
    async getDashboardSnapshotPayload(a, n = {}) {
      const s = n?.db || e.getDB(a), i = n?.kv || e.getKV(a), c = n?.ctx || null, l = ae(n?.config || await ue(a)), d = n?.forceRefresh === !0, u = Math.max(0, Number(n.nowMs) || H()), f = n?.dayWindow || st(new Date(u), l.scheduleUtcOffsetMinutes), m = String(l.cfZoneId || "").trim(), p = eo(m, f.dateKey), g = s ? await e.getCfDashboardCacheEntry(s, p, {
        nowMs: u,
        includeExpired: !0
      }) : null;
      if (!d && s) {
        const y = g && g.expiresAt > u ? g : null;
        if (y && y.version === 8) return ra(y.payload, "cache", {
          cachedAt: y.cachedAt,
          expiresAt: y.expiresAt,
          updatedAt: y.updatedAt,
          generatedAt: y.payload?.cacheMeta?.generatedAt || y.payload?.stats?.generatedAt || new Date(y.cachedAt || u).toISOString(),
          warning: ""
        });
      }
      const h = g;
      try {
        const y = await Kt(ct([
          "dashboard_snapshot",
          p,
          d ? "force" : "default"
        ]), async () => {
          const [_, S] = await Promise.all([e.buildDashboardStatsPayload(a, {
            ctx: c,
            kv: i,
            db: s,
            config: l,
            dayWindow: f,
            nowMs: u
          }), e.buildDashboardRuntimeStatusPayload(a, {
            kv: i,
            db: s,
            config: l,
            forceRefresh: d
          })]), T = ra({
            stats: _,
            runtimeStatus: S,
            cacheMeta: { generatedAt: _.generatedAt }
          }, "live", {
            cachedAt: u,
            expiresAt: u + 3600 * 1e3,
            updatedAt: u,
            generatedAt: _.generatedAt,
            warning: ""
          });
          if (s) {
            const b = e.putCfDashboardCacheEntry(s, {
              cacheKey: p,
              zoneId: m || "default",
              bucketDate: f.dateKey,
              payload: T,
              version: 8,
              cachedAt: u,
              expiresAt: u + 36e5,
              updatedAt: u
            });
            c ? c.waitUntil(pe(b, "dashboard.cache_write", { cacheKey: p }, null)) : await pe(b, "dashboard.cache_write", { cacheKey: p }, null);
          }
          return T;
        });
        return ra(y, "live", {
          cachedAt: u,
          expiresAt: u + 3600 * 1e3,
          updatedAt: u,
          generatedAt: y?.stats?.generatedAt || ""
        });
      } catch (y) {
        if (h && h.version === 8) return ra(h.payload, "stale", {
          cachedAt: h.cachedAt,
          expiresAt: h.expiresAt,
          updatedAt: h.updatedAt,
          generatedAt: h.payload?.cacheMeta?.generatedAt || h.payload?.stats?.generatedAt || new Date(h.cachedAt || u).toISOString(),
          warning: zc(y),
          partial: !0
        });
        throw y;
      }
    },
    async getDashboardCachedSnapshotPayload(a, n = {}) {
      const s = n?.db || e.getDB(a);
      if (!s) return null;
      const i = ae(n?.config || await ue(a)), c = Math.max(0, Number(n.nowMs) || H()), l = st(new Date(c), i.scheduleUtcOffsetMinutes), d = eo(String(i.cfZoneId || "").trim(), l.dateKey), u = await e.getCfDashboardCacheEntry(s, d, {
        nowMs: c,
        includeExpired: !0
      });
      return !u || u.version !== 8 ? null : ra(u.payload, u.expiresAt > c ? "cache" : "stale", {
        cachedAt: u.cachedAt,
        expiresAt: u.expiresAt,
        updatedAt: u.updatedAt,
        generatedAt: u.payload?.cacheMeta?.generatedAt || u.payload?.stats?.generatedAt || "",
        warning: u.expiresAt > c ? "" : "dashboard_cache_expired",
        partial: u.expiresAt <= c
      });
    },
    async getCloudflareRuntimeQuotaStatus(a, n = {}) {
      const s = n?.db || e.getDB(a), i = ae(n?.config || {}), c = n?.forceRefresh === !0, l = String(i.cfAccountId || "").trim(), d = String(i.cfApiToken || "").trim(), u = String(i.cfKvNamespaceId || "").trim(), f = String(i.cfD1DatabaseId || "").trim();
      if (!l || !d) return {
        kv: Tr("KV", "未配置 Cloudflare 账号联动", "请先在账号设置中填写 Cloudflare 账号 ID 与 API 令牌。"),
        d1: Tr("D1", "未配置 Cloudflare 账号联动", "请先在账号设置中填写 Cloudflare 账号 ID 与 API 令牌。")
      };
      const m = H(), p = le(i.cfQuotaPlanCacheMinutes, k.Defaults.CfQuotaPlanCacheMinutes, 1, 1440), g = p * 60 * 1e3;
      let h;
      try {
        h = await e.loadCfRuntimeCachePayload(s, {
          cacheKey: `plan_profile:${l}:${u || "-"}:${f || "-"}`,
          cacheGroup: "plan_profile",
          resourceId: l,
          ttlMs: p * 60 * 1e3,
          nowMs: m,
          skipCacheRead: c,
          loader: async () => {
            const R = Sc(await Rc(l, d)), [w, L] = await Promise.all([u ? pe(Pf(l, u, d), "cf_runtime.plan_profile.kv_details", {
              accountId: l,
              namespaceId: u
            }, null) : null, f ? pe(Cs(l, f, d), "cf_runtime.plan_profile.d1_details", {
              accountId: l,
              databaseId: f
            }, null) : null]);
            return {
              planClass: R.planClass,
              planLabel: R.planLabel,
              periodLabel: R.periodLabel,
              usageModel: R.usageModel,
              resourceMeta: {
                kv: { namespaceTitle: String(w?.title || "").trim() },
                d1: { databaseName: String(L?.name || "").trim() }
              }
            };
          }
        });
      } catch (R) {
        const w = kt(R);
        return {
          kv: Rr("KV", "Cloudflare 计划信息读取失败", w),
          d1: Rr("D1", "Cloudflare 计划信息读取失败", w)
        };
      }
      const y = $(h?.payload) ? h.payload : {}, _ = {
        ...Yn({
          usageModel: y.usageModel || y.planClass,
          override: i.cfQuotaPlanOverride
        }),
        resourceMeta: {
          kv: { namespaceTitle: String(y?.resourceMeta?.kv?.namespaceTitle || "").trim() },
          d1: { databaseName: String(y?.resourceMeta?.d1?.databaseName || "").trim() }
        }
      }, S = Nf(_.planClass), [T, b] = await Promise.all([(async () => {
        if (!u) return Tr("KV", "未配置 KV Namespace", "请在账号设置中填写 Cloudflare KV Namespace ID。");
        try {
          const R = await e.loadCfRuntimeCachePayload(s, {
            cacheKey: `usage_metrics:kv:${l}:${u}:${S.cacheBucketKey}`,
            cacheGroup: "usage_metrics",
            resourceId: `kv:${u}`,
            ttlMs: g,
            nowMs: m,
            skipCacheRead: c,
            loader: async () => ({
              ...await xf({
                accountId: l,
                apiToken: d,
                namespaceId: u,
                startIso: S.startIso,
                endIso: S.endIso
              }),
              namespaceTitle: String(_?.resourceMeta?.kv?.namespaceTitle || u).trim()
            })
          });
          return e.buildCloudflareKvQuotaCard({
            planProfile: _,
            planState: h,
            usageState: R,
            namespaceId: u,
            nowTimestamp: m
          });
        } catch (R) {
          return Rr("KV", "KV 指标读取失败", kt(R));
        }
      })(), (async () => {
        if (!f) return Tr("D1", "未配置 D1 数据库", "请在账号设置中填写 Cloudflare D1 Database ID。");
        try {
          const R = await e.loadCfRuntimeCachePayload(s, {
            cacheKey: `usage_metrics:d1:${l}:${f}:${S.cacheBucketKey}`,
            cacheGroup: "usage_metrics",
            resourceId: `d1:${f}`,
            ttlMs: g,
            nowMs: m,
            skipCacheRead: c,
            loader: async () => {
              const [w, L] = await Promise.all([Of({
                accountId: l,
                apiToken: d,
                databaseId: f,
                startIso: S.startIso,
                endIso: S.endIso
              }), Cs(l, f, d)]);
              return {
                ...w,
                databaseName: String(L?.name || _?.resourceMeta?.d1?.databaseName || f).trim(),
                fileSizeBytes: Math.max(0, Number(L?.file_size ?? L?.fileSize) || 0)
              };
            }
          });
          return e.buildCloudflareD1QuotaCard({
            planProfile: _,
            planState: h,
            usageState: R,
            databaseId: f,
            nowTimestamp: m
          });
        } catch (R) {
          return Rr("D1", "D1 指标读取失败", kt(R));
        }
      })()]);
      return {
        kv: T,
        d1: b
      };
    }
  };
}
function ah(o = {}, e = {}) {
  return {
    ...Jg(o, e),
    ...Qg(o, e),
    ...Zg(o, e),
    ...eh(o, e),
    ...th(o, e),
    ...rh(o, e)
  };
}
function nh(o = {}, e = {}) {
  return {
    getKV(t) {
      return Da(t);
    },
    getDB(t) {
      return kd(t);
    },
    buildD1CreateTableSql(t, r = t, a = {}) {
      const n = ce(r), s = `CREATE TABLE${a.ifNotExists === !0 ? " IF NOT EXISTS" : ""}`, i = {
        [e.D1_SCHEMA_META_TABLE]: `${s} ${n} (scope TEXT PRIMARY KEY, contract_version INTEGER NOT NULL, contract_hash TEXT NOT NULL, schema_fingerprint TEXT NOT NULL, schema_cookie INTEGER NOT NULL, last_plan_hash TEXT NOT NULL, verified_at TEXT NOT NULL, attestation TEXT NOT NULL, migration_owner TEXT, lease_expires_at INTEGER)`,
        [e.SYS_STATUS_TABLE]: `${s} ${n} (scope TEXT PRIMARY KEY, payload TEXT NOT NULL, updated_at INTEGER NOT NULL)`,
        [e.SCHEDULED_LOCKS_TABLE]: `${s} ${n} (scope TEXT PRIMARY KEY, token TEXT NOT NULL, owner TEXT NOT NULL, acquired_at INTEGER NOT NULL, renewed_at INTEGER, expires_at INTEGER NOT NULL)`,
        [e.AUTH_FAILURES_TABLE]: `${s} ${n} (ip TEXT PRIMARY KEY, fail_count INTEGER NOT NULL, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
        [e.CF_DASH_CACHE_TABLE]: `${s} ${n} (cache_key TEXT PRIMARY KEY, zone_id TEXT NOT NULL, bucket_date TEXT NOT NULL, payload TEXT NOT NULL, version INTEGER NOT NULL, cached_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
        [e.CF_RUNTIME_CACHE_TABLE]: `${s} ${n} (cache_key TEXT PRIMARY KEY, cache_group TEXT NOT NULL, resource_id TEXT NOT NULL, payload TEXT NOT NULL, cached_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
        [e.DNS_IP_POOL_ITEMS_TABLE]: `${s} ${n} (id TEXT PRIMARY KEY, ip TEXT NOT NULL UNIQUE, ip_type TEXT NOT NULL, source_kind TEXT NOT NULL, source_label TEXT, line_label TEXT NOT NULL DEFAULT '', remark TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
        [e.DNS_IP_POOL_SOURCES_TABLE]: `${s} ${n} (id TEXT PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL, source_type TEXT NOT NULL DEFAULT 'url', domain TEXT, source_kind TEXT NOT NULL DEFAULT 'custom', preset_id TEXT NOT NULL DEFAULT '', builtin_id TEXT NOT NULL DEFAULT '', enabled INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, ip_limit INTEGER NOT NULL DEFAULT 5, last_fetch_at TEXT, last_fetch_status TEXT, last_fetch_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
        [e.DNS_IP_POOL_FETCH_CACHE_TABLE]: `${s} ${n} (signature TEXT PRIMARY KEY, items_json TEXT NOT NULL, source_results_json TEXT NOT NULL, imported_count INTEGER NOT NULL DEFAULT 0, enabled_source_count INTEGER NOT NULL DEFAULT 0, cached_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`,
        [e.DNS_IP_PROBE_CACHE_TABLE]: `${s} ${n} (ip TEXT NOT NULL, entry_colo TEXT NOT NULL, probe_status TEXT NOT NULL, latency_ms INTEGER, cf_ray TEXT, colo_code TEXT, city_name TEXT, country_code TEXT, country_name TEXT, probed_at TEXT NOT NULL, expires_at INTEGER NOT NULL, PRIMARY KEY (ip, entry_colo))`,
        [e.LOGS_TABLE]: `${s} ${n} (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER NOT NULL, node_name TEXT NOT NULL, request_path TEXT NOT NULL, request_method TEXT NOT NULL, status_code INTEGER NOT NULL, response_time INTEGER NOT NULL, client_ip TEXT NOT NULL, inbound_colo TEXT, outbound_colo TEXT, user_agent TEXT, referer TEXT, category TEXT DEFAULT 'api', error_detail TEXT, detail_json TEXT, created_at TEXT NOT NULL, inbound_ip TEXT, outbound_ip TEXT)`,
        [e.STATS_HOURLY_TABLE]: `${s} ${n} (bucket_date TEXT NOT NULL, bucket_hour INTEGER NOT NULL, request_count INTEGER NOT NULL DEFAULT 0, play_count INTEGER NOT NULL DEFAULT 0, playback_info_count INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL, PRIMARY KEY (bucket_date, bucket_hour))`
      }[t];
      if (!i) throw new Error(`Unknown D1 schema table: ${t}`);
      return i;
    },
    getD1LogsFtsContractSql() {
      return {
        createTable: `CREATE VIRTUAL TABLE ${e.LOGS_FTS_TABLE} USING fts5(node_name, request_path, user_agent, error_detail, detail_json, content='${e.LOGS_TABLE}', content_rowid='id', tokenize='unicode61')`,
        createTrigger: `CREATE TRIGGER ${e.LOGS_FTS_INSERT_TRIGGER} AFTER INSERT ON ${e.LOGS_TABLE} BEGIN
          INSERT INTO ${e.LOGS_FTS_TABLE}(rowid, node_name, request_path, user_agent, error_detail, detail_json)
          VALUES (new.id, new.node_name, new.request_path, COALESCE(new.user_agent, ''), COALESCE(new.error_detail, ''), COALESCE(new.detail_json, ''));
        END;`
      };
    },
    getD1ContractHash() {
      const t = e.getD1CurrentSchemaContract();
      return ne(ee({
        version: at,
        createTables: Object.keys(t.columns).sort().map((r) => [r, e.buildD1CreateTableSql(r)]),
        columns: t.columns,
        columnAffinities: t.columnAffinities,
        primaryKeys: t.primaryKeys,
        indexes: t.indexes,
        uniqueIndexes: t.uniqueIndexes,
        fts: e.getD1LogsFtsContractSql(),
        safeColumnAdditions: e.getD1RuntimeColumnAdditions()
      }));
    },
    async getD1SchemaCookie(t) {
      return 0;
    },
    buildD1SchemaAttestationPayload(t = {}) {
      return ee({
        scope: "main",
        contractVersion: Math.max(0, Number(t.contractVersion ?? t.contract_version) || 0),
        contractHash: String((t.contractHash ?? t.contract_hash) || ""),
        schemaFingerprint: String((t.schemaFingerprint ?? t.schema_fingerprint) || ""),
        schemaCookie: Math.max(0, Number(t.schemaCookie ?? t.schema_cookie) || 0),
        lastPlanHash: String((t.lastPlanHash ?? t.last_plan_hash) || ""),
        verifiedAt: String((t.verifiedAt ?? t.verified_at) || "")
      });
    },
    async signD1SchemaAttestation(t, r = {}) {
      const a = String(t?.JWT_SECRET || "").trim();
      return a ? await gt(a, e.buildD1SchemaAttestationPayload(r)) : "";
    },
    async readD1SchemaMeta(t) {
      try {
        return await t.prepare(`SELECT scope, contract_version, contract_hash, schema_fingerprint, schema_cookie, last_plan_hash, verified_at, attestation, migration_owner, lease_expires_at FROM ${ce(e.D1_SCHEMA_META_TABLE)} WHERE scope = 'main' LIMIT 1`).first();
      } catch {
        return null;
      }
    },
    async verifyD1SchemaAttestation(t, r) {
      const a = await e.readD1SchemaMeta(t);
      if (!a) return {
        valid: !1,
        reason: "missing_meta"
      };
      const n = Math.max(0, Number(a.contract_version) || 0);
      if (n > at) return {
        valid: !1,
        blocked: !0,
        reason: "schema_version_ahead",
        meta: a
      };
      if (n !== at) return {
        valid: !1,
        reason: "version_mismatch",
        meta: a
      };
      if (String(a.contract_hash || "") !== e.getD1ContractHash()) return {
        valid: !1,
        reason: "contract_hash_mismatch",
        meta: a
      };
      const s = await e.getD1SchemaCookie(t);
      if (Math.max(0, Number(a.schema_cookie) || 0) !== s) return {
        valid: !1,
        reason: "schema_cookie_changed",
        meta: a,
        schemaCookie: s
      };
      const i = await e.getD1SchemaFingerprint(t);
      if (String(a.schema_fingerprint || "") !== i) return {
        valid: !1,
        reason: "schema_fingerprint_changed",
        meta: a,
        schemaCookie: s,
        schemaFingerprint: i
      };
      const c = await e.signD1SchemaAttestation(r, a);
      return !c || c !== String(a.attestation || "") ? {
        valid: !1,
        reason: "invalid_attestation",
        meta: a,
        schemaCookie: s
      } : {
        valid: !0,
        meta: a,
        schemaCookie: s,
        schemaFingerprint: i
      };
    },
    async writeVerifiedD1SchemaMeta(t, r, a = {}) {
      const n = e.getD1ContractHash(), s = String(a?.schemaFingerprint || "") || await e.getD1SchemaFingerprint(t), i = await e.getD1SchemaCookie(t), c = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), l = {
        contractVersion: at,
        contractHash: n,
        schemaFingerprint: s,
        schemaCookie: i,
        lastPlanHash: String(a?.planHash || ""),
        verifiedAt: c
      }, d = await e.signD1SchemaAttestation(r, l);
      return d ? (await t.prepare(`INSERT INTO ${ce(e.D1_SCHEMA_META_TABLE)} (scope, contract_version, contract_hash, schema_fingerprint, schema_cookie, last_plan_hash, verified_at, attestation, migration_owner, lease_expires_at)
        VALUES ('main', ?, ?, ?, ?, ?, ?, ?, NULL, NULL)
        ON CONFLICT(scope) DO UPDATE SET contract_version = excluded.contract_version, contract_hash = excluded.contract_hash, schema_fingerprint = excluded.schema_fingerprint, schema_cookie = excluded.schema_cookie, last_plan_hash = excluded.last_plan_hash, verified_at = excluded.verified_at, attestation = excluded.attestation, migration_owner = NULL, lease_expires_at = NULL`).bind(at, n, s, i, l.lastPlanHash, c, d).run(), {
        written: !0,
        attestation: d,
        ...l
      }) : {
        written: !1,
        reason: "missing_secret",
        ...l
      };
    },
    async acquireD1SchemaRepairLease(t, r, a = {}) {
      const n = Math.max(0, Number(a.nowMs ?? H()) || 0), s = n + qu, i = await t.prepare(`INSERT INTO ${ce(e.D1_SCHEMA_META_TABLE)} (scope, contract_version, contract_hash, schema_fingerprint, schema_cookie, last_plan_hash, verified_at, attestation, migration_owner, lease_expires_at)
        VALUES ('main', 0, '', '', 0, '', '', '', ?, ?)
        ON CONFLICT(scope) DO UPDATE SET migration_owner = excluded.migration_owner, lease_expires_at = excluded.lease_expires_at
        WHERE ${ce(e.D1_SCHEMA_META_TABLE)}.migration_owner IS NULL OR ${ce(e.D1_SCHEMA_META_TABLE)}.lease_expires_at IS NULL OR ${ce(e.D1_SCHEMA_META_TABLE)}.lease_expires_at < ? OR ${ce(e.D1_SCHEMA_META_TABLE)}.migration_owner = excluded.migration_owner`).bind(r, s, n).run();
      if (Math.max(0, Number(i?.meta?.changes ?? i?.changes) || 0) < 1) {
        const c = /* @__PURE__ */ new Error("D1 schema repair is already running");
        throw c.code = "D1_SCHEMA_REPAIR_IN_PROGRESS", c.status = 409, c.details = { leaseExpiresAt: s }, c;
      }
      return {
        owner: r,
        leaseExpiresAt: s
      };
    },
    async releaseD1SchemaRepairLease(t, r) {
      return r ? (await t.prepare(`UPDATE ${ce(e.D1_SCHEMA_META_TABLE)} SET migration_owner = NULL, lease_expires_at = NULL WHERE scope = 'main' AND migration_owner = ?`).bind(r).run(), !0) : !1;
    },
    getD1UniqueIndexContract() {
      return { ux_dns_ip_pool_items_ip: {
        table: e.DNS_IP_POOL_ITEMS_TABLE,
        columns: ["ip"],
        createSql: `CREATE UNIQUE INDEX ux_dns_ip_pool_items_ip ON ${e.DNS_IP_POOL_ITEMS_TABLE} (ip)`
      } };
    },
    getD1RuntimeIndexContract() {
      return {
        idx_sys_locks_expires_at: {
          table: e.SCHEDULED_LOCKS_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_sys_locks_expires_at ON ${e.SCHEDULED_LOCKS_TABLE} (expires_at DESC)`
        },
        idx_auth_failures_expires_at: {
          table: e.AUTH_FAILURES_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_auth_failures_expires_at ON ${e.AUTH_FAILURES_TABLE} (expires_at)`
        },
        idx_cf_dashboard_cache_expires_at: {
          table: e.CF_DASH_CACHE_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_cf_dashboard_cache_expires_at ON ${e.CF_DASH_CACHE_TABLE} (expires_at)`
        },
        idx_cf_runtime_cache_expires_at: {
          table: e.CF_RUNTIME_CACHE_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_cf_runtime_cache_expires_at ON ${e.CF_RUNTIME_CACHE_TABLE} (expires_at)`
        },
        idx_dns_ip_pool_items_updated_ip: {
          table: e.DNS_IP_POOL_ITEMS_TABLE,
          columns: ["updated_at", "ip"],
          createSql: `CREATE INDEX idx_dns_ip_pool_items_updated_ip ON ${e.DNS_IP_POOL_ITEMS_TABLE} (updated_at DESC, ip ASC)`
        },
        idx_dns_ip_pool_sources_sort: {
          table: e.DNS_IP_POOL_SOURCES_TABLE,
          columns: ["sort_order", "updated_at"],
          createSql: `CREATE INDEX idx_dns_ip_pool_sources_sort ON ${e.DNS_IP_POOL_SOURCES_TABLE} (sort_order ASC, updated_at ASC)`
        },
        idx_dns_ip_pool_fetch_cache_expires: {
          table: e.DNS_IP_POOL_FETCH_CACHE_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_dns_ip_pool_fetch_cache_expires ON ${e.DNS_IP_POOL_FETCH_CACHE_TABLE} (expires_at)`
        },
        idx_dns_ip_probe_cache_expire: {
          table: e.DNS_IP_PROBE_CACHE_TABLE,
          columns: ["expires_at"],
          createSql: `CREATE INDEX idx_dns_ip_probe_cache_expire ON ${e.DNS_IP_PROBE_CACHE_TABLE} (expires_at)`
        },
        idx_dns_ip_probe_cache_colo_ip_expires: {
          table: e.DNS_IP_PROBE_CACHE_TABLE,
          columns: [
            "entry_colo",
            "ip",
            "expires_at"
          ],
          createSql: `CREATE INDEX idx_dns_ip_probe_cache_colo_ip_expires ON ${e.DNS_IP_PROBE_CACHE_TABLE} (entry_colo, ip, expires_at)`
        },
        idx_proxy_logs_timestamp: {
          table: e.LOGS_TABLE,
          columns: ["timestamp"],
          createSql: `CREATE INDEX idx_proxy_logs_timestamp ON ${e.LOGS_TABLE} (timestamp)`
        },
        idx_proxy_logs_client_time: {
          table: e.LOGS_TABLE,
          columns: ["client_ip", "timestamp"],
          createSql: `CREATE INDEX idx_proxy_logs_client_time ON ${e.LOGS_TABLE} (client_ip, timestamp DESC)`
        },
        idx_proxy_logs_status_time: {
          table: e.LOGS_TABLE,
          columns: ["status_code", "timestamp"],
          createSql: `CREATE INDEX idx_proxy_logs_status_time ON ${e.LOGS_TABLE} (status_code, timestamp)`
        },
        idx_proxy_logs_category_time: {
          table: e.LOGS_TABLE,
          columns: ["category", "timestamp"],
          createSql: `CREATE INDEX idx_proxy_logs_category_time ON ${e.LOGS_TABLE} (category, timestamp)`
        }
      };
    },
    getD1RuntimeColumnAdditions() {
      return {
        [e.D1_SCHEMA_META_TABLE]: {
          contract_version: "INTEGER NOT NULL DEFAULT 0",
          contract_hash: "TEXT NOT NULL DEFAULT ''",
          schema_fingerprint: "TEXT NOT NULL DEFAULT ''",
          schema_cookie: "INTEGER NOT NULL DEFAULT 0",
          last_plan_hash: "TEXT NOT NULL DEFAULT ''",
          verified_at: "TEXT NOT NULL DEFAULT ''",
          attestation: "TEXT NOT NULL DEFAULT ''",
          migration_owner: "TEXT",
          lease_expires_at: "INTEGER"
        },
        [e.SYS_STATUS_TABLE]: {
          payload: "TEXT NOT NULL DEFAULT '{}'",
          updated_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.SCHEDULED_LOCKS_TABLE]: {
          token: "TEXT NOT NULL DEFAULT ''",
          owner: "TEXT NOT NULL DEFAULT ''",
          acquired_at: "INTEGER NOT NULL DEFAULT 0",
          renewed_at: "INTEGER",
          expires_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.AUTH_FAILURES_TABLE]: {
          fail_count: "INTEGER NOT NULL DEFAULT 0",
          expires_at: "INTEGER NOT NULL DEFAULT 0",
          updated_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.CF_DASH_CACHE_TABLE]: {
          zone_id: "TEXT NOT NULL DEFAULT ''",
          bucket_date: "TEXT NOT NULL DEFAULT ''",
          payload: "TEXT NOT NULL DEFAULT '{}'",
          version: "INTEGER NOT NULL DEFAULT 0",
          cached_at: "INTEGER NOT NULL DEFAULT 0",
          expires_at: "INTEGER NOT NULL DEFAULT 0",
          updated_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.CF_RUNTIME_CACHE_TABLE]: {
          cache_group: "TEXT NOT NULL DEFAULT ''",
          resource_id: "TEXT NOT NULL DEFAULT ''",
          payload: "TEXT NOT NULL DEFAULT '{}'",
          cached_at: "INTEGER NOT NULL DEFAULT 0",
          expires_at: "INTEGER NOT NULL DEFAULT 0",
          updated_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.DNS_IP_POOL_ITEMS_TABLE]: {
          ip_type: "TEXT NOT NULL DEFAULT ''",
          source_kind: "TEXT NOT NULL DEFAULT ''",
          source_label: "TEXT",
          line_label: "TEXT NOT NULL DEFAULT ''",
          remark: "TEXT",
          created_at: "TEXT NOT NULL DEFAULT ''",
          updated_at: "TEXT NOT NULL DEFAULT ''"
        },
        [e.DNS_IP_POOL_SOURCES_TABLE]: {
          name: "TEXT NOT NULL DEFAULT ''",
          url: "TEXT NOT NULL DEFAULT ''",
          source_type: "TEXT NOT NULL DEFAULT 'url'",
          domain: "TEXT",
          source_kind: "TEXT NOT NULL DEFAULT 'custom'",
          preset_id: "TEXT NOT NULL DEFAULT ''",
          builtin_id: "TEXT NOT NULL DEFAULT ''",
          enabled: "INTEGER NOT NULL DEFAULT 1",
          sort_order: "INTEGER NOT NULL DEFAULT 0",
          ip_limit: "INTEGER NOT NULL DEFAULT 5",
          last_fetch_at: "TEXT",
          last_fetch_status: "TEXT",
          last_fetch_count: "INTEGER NOT NULL DEFAULT 0",
          created_at: "TEXT NOT NULL DEFAULT ''",
          updated_at: "TEXT NOT NULL DEFAULT ''"
        },
        [e.DNS_IP_POOL_FETCH_CACHE_TABLE]: {
          items_json: "TEXT NOT NULL DEFAULT '[]'",
          source_results_json: "TEXT NOT NULL DEFAULT '[]'",
          imported_count: "INTEGER NOT NULL DEFAULT 0",
          enabled_source_count: "INTEGER NOT NULL DEFAULT 0",
          cached_at: "INTEGER NOT NULL DEFAULT 0",
          expires_at: "INTEGER NOT NULL DEFAULT 0",
          created_at: "TEXT NOT NULL DEFAULT ''",
          updated_at: "TEXT NOT NULL DEFAULT ''"
        },
        [e.DNS_IP_PROBE_CACHE_TABLE]: {
          probe_status: "TEXT NOT NULL DEFAULT ''",
          latency_ms: "INTEGER",
          cf_ray: "TEXT",
          colo_code: "TEXT",
          city_name: "TEXT",
          country_code: "TEXT",
          country_name: "TEXT",
          probed_at: "TEXT NOT NULL DEFAULT ''",
          expires_at: "INTEGER NOT NULL DEFAULT 0"
        },
        [e.LOGS_TABLE]: {
          timestamp: "INTEGER NOT NULL DEFAULT 0",
          node_name: "TEXT NOT NULL DEFAULT ''",
          request_path: "TEXT NOT NULL DEFAULT ''",
          request_method: "TEXT NOT NULL DEFAULT ''",
          status_code: "INTEGER NOT NULL DEFAULT 0",
          response_time: "INTEGER NOT NULL DEFAULT 0",
          client_ip: "TEXT NOT NULL DEFAULT ''",
          inbound_colo: "TEXT",
          outbound_colo: "TEXT",
          user_agent: "TEXT",
          referer: "TEXT",
          category: "TEXT DEFAULT 'api'",
          error_detail: "TEXT",
          detail_json: "TEXT",
          created_at: "TEXT NOT NULL DEFAULT ''",
          inbound_ip: "TEXT",
          outbound_ip: "TEXT"
        },
        [e.STATS_HOURLY_TABLE]: {
          request_count: "INTEGER NOT NULL DEFAULT 0",
          play_count: "INTEGER NOT NULL DEFAULT 0",
          playback_info_count: "INTEGER NOT NULL DEFAULT 0",
          updated_at: "TEXT NOT NULL DEFAULT ''"
        }
      };
    },
    getD1RequiredPrimaryKeyContract() {
      return {
        [e.D1_SCHEMA_META_TABLE]: ["scope"],
        [e.SYS_STATUS_TABLE]: ["scope"],
        [e.SCHEDULED_LOCKS_TABLE]: ["scope"],
        [e.AUTH_FAILURES_TABLE]: ["ip"],
        [e.CF_DASH_CACHE_TABLE]: ["cache_key"],
        [e.CF_RUNTIME_CACHE_TABLE]: ["cache_key"],
        [e.DNS_IP_POOL_ITEMS_TABLE]: ["id"],
        [e.DNS_IP_POOL_SOURCES_TABLE]: ["id"],
        [e.DNS_IP_POOL_FETCH_CACHE_TABLE]: ["signature"],
        [e.DNS_IP_PROBE_CACHE_TABLE]: ["ip", "entry_colo"],
        [e.LOGS_TABLE]: ["id"],
        [e.STATS_HOURLY_TABLE]: ["bucket_date", "bucket_hour"]
      };
    },
    getD1SchemaReadyState(t) {
      if (!t || typeof t.prepare != "function") return null;
      let r = J.D1SchemaReadyState.get(t);
      return r instanceof Map || (r = /* @__PURE__ */ new Map(), J.D1SchemaReadyState.set(t, r)), r;
    },
    isD1SchemaReadyCached(t, r) {
      const a = e.getD1SchemaReadyState(t);
      return !!a && (Number(a.get(String(r || ""))) || 0) > H();
    },
    markD1SchemaReady(t, r) {
      const a = e.getD1SchemaReadyState(t);
      a && a.set(String(r || ""), H() + Math.max(1e3, Number(k.Defaults.D1SchemaReadyTtlMs) || 1e3));
    },
    clearD1SchemaReady(t, r = []) {
      const a = J.D1SchemaReadyState.get(t);
      if (!(a instanceof Map)) return;
      const n = (Array.isArray(r) ? r : [r]).map((s) => String(s || "").trim()).filter(Boolean);
      if (!n.length) {
        a.clear();
        return;
      }
      for (const s of n) a.delete(s);
    },
    normalizeRevisionMeta(t, r) {
      const a = $(t) ? t : {}, n = $(r) ? r : {}, s = String(a.updatedAt || n.updatedAt || "").trim(), i = String(a.hash || n.hash || "").trim();
      return {
        ...n,
        ...a,
        updatedAt: s,
        hash: i,
        revision: String(a.revision || n.revision || Ht(i, s)).trim()
      };
    },
    async readRevisionMeta(t, r, a) {
      if (!t || !r) return e.normalizeRevisionMeta({}, a);
      try {
        return e.normalizeRevisionMeta(await t.get(r, { type: "json" }), a);
      } catch {
        return e.normalizeRevisionMeta({}, a);
      }
    },
    async readRevisionMetaForRead(t, r, a) {
      if (!t || !r) return null;
      const n = await xe(t, r, { type: "json" });
      return $(n) ? e.normalizeRevisionMeta(n, a) : null;
    },
    async writeRevisionMeta(t, r, a, n = null) {
      if (!t || !r) return a;
      const s = t.put(r, JSON.stringify(a));
      return n && n.waitUntil(s), await s, a;
    },
    async ensureConfigMeta(t, r = null, a = {}) {
      const n = ae(r ?? (await t?.get(e.CONFIG_KEY, { type: "json" }) || {})), s = e.normalizeRevisionMeta(Xn(n)), i = await e.readRevisionMeta(t, e.CONFIG_META_KEY);
      return i.hash === s.hash && i.revision ? i : await e.writeRevisionMeta(t, e.CONFIG_META_KEY, s, a.ctx);
    },
    buildNodesIndexMeta(t = [], r = [], a = {}) {
      const n = e.normalizeNodeIndex(t), s = e.normalizeNodeSummaryIndex(r).nodes, i = String(a.updatedAt || "").trim() || /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), c = ne(ee(n)), l = ne(ee(s)), d = ne(`${c}:${l}:${n.length}`);
      return {
        revision: Ht(d, i),
        updatedAt: i,
        hash: d,
        count: n.length,
        indexHash: c,
        fullIndexHash: l
      };
    },
    async ensureNodesIndexMeta(t, r = {}) {
      if (!t) return e.buildNodesIndexMeta([], []);
      let a = Array.isArray(r.nodes) ? e.normalizeNodeSummaryIndex(r.nodes).nodes : null;
      if (!a) {
        const c = await e.getNodesSummaryIndex(t, { ctx: r.ctx });
        a = Array.isArray(c) ? c : [];
      }
      const n = Array.isArray(r.index) ? e.normalizeNodeIndex(r.index) : e.normalizeNodeIndex(a.map((c) => c?.name)), s = e.buildNodesIndexMeta(n, a, r), i = await e.readRevisionMeta(t, e.NODES_INDEX_META_KEY, {
        count: 0,
        indexHash: "",
        fullIndexHash: ""
      });
      return i.indexHash === s.indexHash && i.fullIndexHash === s.fullIndexHash && Number(i.count) === Number(s.count) && i.revision ? i : await wr(async () => {
        const c = await e.loadNodeSummariesForMutation(t, { ctx: r.ctx });
        return (await e.commitNodesSummaryIndexMutation(c, {
          kv: t,
          ctx: r.ctx
        })).meta;
      }, t);
    },
    async getNodesRevision(t, r = {}) {
      if (!t) return "";
      const a = Se(t), n = H();
      if (r.forceFresh !== !0 && a.NodesRevisionCache?.loaded === !0 && a.NodesRevisionCache.exp > n) return String(a.NodesRevisionCache.revision || "").trim();
      const s = a.NodesRevisionCacheGeneration;
      return await fn(a.SingleFlightTasks, ct(["nodes_revision", s]), async () => {
        const i = a.NodesRevisionCache;
        if (r.forceFresh !== !0 && i?.loaded === !0 && i.exp > H()) return String(i.revision || "").trim();
        let c = null;
        try {
          c = await t.get(e.NODES_INDEX_META_KEY, { type: "json" });
        } catch {
          return "";
        }
        const l = $(c) ? String(c.revision || "").trim() : "";
        return a.NodesRevisionCacheGeneration === s && (a.NodesRevisionCache = {
          loaded: !0,
          revision: l,
          exp: H() + k.Defaults.NodesRevisionCacheTtlMs
        }), l;
      });
    },
    getLogsRevisionFromStatus(t = {}) {
      const r = String(t?.revision || "").trim();
      return r || Ht("logs", String(t?.updatedAt || "").trim());
    },
    async bumpLogsRevision(t, r = {}, a = null) {
      const n = await e.getOpsStatusSection(t, "log"), s = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), i = ne(`${e.getLogsRevisionFromStatus(n)}:${s}:${ee(r)}`);
      return await e.patchOpsStatus(t, { log: {
        ...r,
        revision: Ht(i, s),
        updatedAt: s
      } }, a);
    },
    async getAdminRevisions(t, r = {}) {
      const a = e.resolveOpsStatusStores(t), n = a.kv, s = a.db, [i, c, l, d] = await Promise.all([
        e.ensureConfigMeta(n, r.config, { ctx: r.ctx }),
        e.ensureNodesIndexMeta(n, {
          ctx: r.ctx,
          index: r.nodes?.map?.((u) => u?.name),
          nodes: r.nodes
        }),
        e.getOpsStatusSection({
          kv: n,
          db: s
        }, "log"),
        e.getOpsStatusSection({
          kv: n,
          db: s
        }, "dnsIpPool")
      ]);
      return {
        configRevision: String(i?.revision || ""),
        nodesRevision: String(c?.revision || ""),
        logsRevision: e.getLogsRevisionFromStatus(l),
        dnsIpPoolRevision: e.getDnsIpPoolRevisionFromStatus(d)
      };
    },
    async getAdminRevisionsForRead(t, r = {}) {
      const a = e.resolveOpsStatusStores(t), n = a.kv, s = a.db, [i, c, l, d] = await Promise.all([
        e.readRevisionMetaForRead(n, e.CONFIG_META_KEY),
        e.readRevisionMetaForRead(n, e.NODES_INDEX_META_KEY, {
          count: 0,
          indexHash: "",
          fullIndexHash: ""
        }),
        e.getOpsStatusSection({
          kv: n,
          db: s
        }, "log"),
        e.getOpsStatusSection({
          kv: n,
          db: s
        }, "dnsIpPool")
      ]), u = r.config !== void 0 ? r.config : await xe(n, e.CONFIG_KEY, { type: "json" }) || {}, f = e.normalizeRevisionMeta(Xn(ae(u), { updatedAt: String(i?.updatedAt || "").trim() })), m = String(i?.revision || "").trim().split(".").pop() || "", p = i?.hash === f.hash && m === f.hash ? i : f;
      let g = c;
      if (!g) {
        const h = Array.isArray(r.nodes) ? r.nodes : await e.getNodesSummaryIndexStrict(n, { ctx: r.ctx });
        g = e.buildNodesIndexMeta((Array.isArray(h) ? h : []).map((y) => y?.name), Array.isArray(h) ? h : []);
      }
      return {
        configRevision: String(p?.revision || ""),
        nodesRevision: String(g?.revision || ""),
        logsRevision: e.getLogsRevisionFromStatus(l),
        dnsIpPoolRevision: e.getDnsIpPoolRevisionFromStatus(d)
      };
    }
  };
}
function oh(o = {}, e = {}) {
  return {
    async hasLogsFtsTable(t) {
      if (!t) return !1;
      try {
        const r = await t.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").bind(e.LOGS_FTS_TABLE).first();
        return String(r?.name || "") === e.LOGS_FTS_TABLE;
      } catch {
        return !1;
      }
    },
    async getLogsFtsReadiness(t) {
      if (!t || !await e.hasLogsFtsTable(t)) return {
        tableReady: !1,
        virtualTableReady: !1,
        columnsReady: !1,
        triggerReady: !1,
        ready: !1
      };
      const r = await e.getTableColumns(t, e.LOGS_FTS_TABLE), a = [
        "node_name",
        "request_path",
        "user_agent",
        "error_detail",
        "detail_json"
      ].every((p) => r.has(p)), [n, s] = await Promise.all([t.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").bind(e.LOGS_FTS_TABLE).first(), t.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'trigger' AND name = ? LIMIT 1").bind(e.LOGS_FTS_INSERT_TRIGGER).first()]), i = Cr(n?.sql || "").replace(/'/g, ""), c = /^create\s+virtual\s+table\b/.test(i) && /\busing\s+fts5\s*\(/.test(i) && new RegExp(`\\bcontent\\s*=\\s*${e.LOGS_TABLE}\\b`).test(i) && /\bcontent_rowid\s*=\s*id\b/.test(i), l = Cr(s?.sql || ""), d = l.replace(/\s+/g, ""), u = `insert into ${e.LOGS_FTS_TABLE} (
            rowid, node_name, request_path, user_agent, error_detail, detail_json
          ) values (
            new.id, new.node_name, new.request_path,
            coalesce(new.user_agent, ''), coalesce(new.error_detail, ''), coalesce(new.detail_json, '')
          )`.replace(/\s+/g, ""), f = d.includes(u), m = String(s?.name || "") === e.LOGS_FTS_INSERT_TRIGGER && String(s?.tbl_name || "") === e.LOGS_TABLE && new RegExp(`\\bafter\\s+insert\\s+on\\s+${e.LOGS_TABLE}\\b`).test(l) && new RegExp(`\\binsert\\s+into\\s+${e.LOGS_FTS_TABLE}\\s*\\(`).test(l) && f;
      return {
        tableReady: !0,
        virtualTableReady: c,
        columnsReady: a,
        triggerReady: m,
        ready: c && a && m
      };
    },
    async isLogsFtsReady(t) {
      return (await e.getLogsFtsReadiness(t)).ready === !0;
    },
    async hasLogsBaseTable(t) {
      if (!t) return !1;
      if (e.isD1SchemaReadyCached(t, "logsTableExists")) return !0;
      try {
        const r = await t.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").bind(e.LOGS_TABLE).first(), a = String(r?.name || "") === e.LOGS_TABLE;
        return a && e.markD1SchemaReady(t, "logsTableExists"), a;
      } catch {
        return !1;
      }
    },
    async hasStatsHourlyTable(t) {
      if (!t) return !1;
      if (e.isD1SchemaReadyCached(t, "statsTableExists")) return !0;
      try {
        const r = await t.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1").bind(e.STATS_HOURLY_TABLE).first(), a = String(r?.name || "") === e.STATS_HOURLY_TABLE;
        return a && e.markD1SchemaReady(t, "statsTableExists"), a;
      } catch {
        return !1;
      }
    },
    async getTableColumnDefinitions(t, r) {
      if (!t || !r) return [];
      try {
        return ((await t.prepare(`PRAGMA table_xinfo(${ce(r)})`).all())?.results || []).map((a) => ({
          name: String(a?.name || "").toLowerCase(),
          type: String(a?.type || "").trim().toUpperCase(),
          affinity: Ln(a?.type),
          primaryKeyOrder: Math.max(0, Number(a?.pk) || 0),
          notNull: Number(a?.notnull) === 1,
          defaultValue: a?.dflt_value ?? null,
          hidden: Math.max(0, Number(a?.hidden) || 0)
        })).filter((a) => a.name);
      } catch (a) {
        const n = /* @__PURE__ */ new Error(`D1 schema inspection failed for ${r}`);
        throw n.code = "D1_SCHEMA_INSPECTION_FAILED", n.status = 503, n.details = {
          tableName: String(r),
          cause: se(a, "d1_pragma_failed")
        }, n;
      }
    },
    async getTableColumns(t, r) {
      const a = await e.getTableColumnDefinitions(t, r);
      return new Set(a.map((n) => n.name));
    },
    async getIndexKeyColumns(t, r) {
      if (!t || !r) return [];
      try {
        return ((await t.prepare(`PRAGMA index_xinfo(${ce(r)})`).all())?.results || []).map((a) => ({
          order: Math.max(0, Number(a?.seqno) || 0),
          name: String(a?.name || "").toLowerCase(),
          key: a?.key === void 0 || Number(a.key) === 1,
          expression: Number(a?.cid) === -2 || !String(a?.name || "").trim()
        })).filter((a) => a.key).sort((a, n) => a.order - n.order).map((a) => a.expression ? "<expression>" : a.name);
      } catch (a) {
        const n = /* @__PURE__ */ new Error(`D1 schema inspection failed for ${r}`);
        throw n.code = "D1_SCHEMA_INSPECTION_FAILED", n.status = 503, n.details = {
          indexName: String(r),
          cause: se(a, "d1_pragma_failed")
        }, n;
      }
    },
    async getTableIndexDefinitions(t, r) {
      if (!t || !r) return [];
      try {
        return ((await t.prepare(`PRAGMA index_list(${ce(r)})`).all())?.results || []).map((a) => ({
          name: String(a?.name || ""),
          unique: Number(a?.unique) === 1,
          partial: Number(a?.partial) === 1
        })).filter((a) => a.name);
      } catch (a) {
        const n = /* @__PURE__ */ new Error(`D1 schema inspection failed for ${r}`);
        throw n.code = "D1_SCHEMA_INSPECTION_FAILED", n.status = 503, n.details = {
          tableName: String(r),
          cause: se(a, "d1_pragma_failed")
        }, n;
      }
    },
    async getD1TableNameSet(t) {
      if (!t) return /* @__PURE__ */ new Set();
      const r = await t.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
      return new Set((r?.results || []).map((a) => String(a?.name || "")).filter(Boolean));
    },
    async getD1SchemaSnapshot(t) {
      if (!t) return {
        objects: [],
        columns: [],
        indexes: []
      };
      const r = Object.keys(e.getD1CurrentSchemaContract().columns), a = [...r, e.LOGS_FTS_TABLE], n = a.map(() => "?").join(", "), s = r.map(() => "?").join(", "), [i, c, l] = await Promise.all([
        t.prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE type IN ('table', 'index', 'trigger') ORDER BY type, name").all(),
        t.prepare(`SELECT schema_table.name AS table_name, column_info.name, column_info.type, column_info."notnull" AS is_not_null,
					column_info.dflt_value, column_info.pk, column_info.hidden
					FROM sqlite_master AS schema_table
					JOIN pragma_table_xinfo(schema_table.name) AS column_info
					WHERE schema_table.type = 'table' AND schema_table.name IN (${n})
					ORDER BY schema_table.name, column_info.cid`).bind(...a).all(),
        t.prepare(`SELECT schema_index.tbl_name AS table_name, index_list.name AS index_name, index_list."unique" AS is_unique,
					index_list.partial, index_list.origin, index_column.seqno, index_column.cid, index_column.name AS column_name, index_column."key" AS is_key
					FROM sqlite_master AS schema_index
					JOIN pragma_index_list(schema_index.tbl_name) AS index_list ON index_list.name = schema_index.name
					JOIN pragma_index_xinfo(index_list.name) AS index_column
					WHERE schema_index.type = 'index' AND schema_index.tbl_name IN (${s})
					ORDER BY schema_index.tbl_name, index_list.name, index_column.seqno`).bind(...r).all()
      ]);
      return {
        objects: i?.results || [],
        columns: c?.results || [],
        indexes: l?.results || []
      };
    },
    getD1CurrentSchemaContract() {
      const t = e.getD1RequiredPrimaryKeyContract(), r = {
        [e.D1_SCHEMA_META_TABLE]: { scope: "TEXT" },
        [e.SYS_STATUS_TABLE]: { scope: "TEXT" },
        [e.SCHEDULED_LOCKS_TABLE]: { scope: "TEXT" },
        [e.AUTH_FAILURES_TABLE]: { ip: "TEXT" },
        [e.CF_DASH_CACHE_TABLE]: { cache_key: "TEXT" },
        [e.CF_RUNTIME_CACHE_TABLE]: { cache_key: "TEXT" },
        [e.DNS_IP_POOL_ITEMS_TABLE]: {
          id: "TEXT",
          ip: "TEXT"
        },
        [e.DNS_IP_POOL_SOURCES_TABLE]: { id: "TEXT" },
        [e.DNS_IP_POOL_FETCH_CACHE_TABLE]: { signature: "TEXT" },
        [e.DNS_IP_PROBE_CACHE_TABLE]: {
          ip: "TEXT",
          entry_colo: "TEXT"
        },
        [e.LOGS_TABLE]: { id: "INTEGER" },
        [e.STATS_HOURLY_TABLE]: {
          bucket_date: "TEXT",
          bucket_hour: "INTEGER"
        }
      }, a = Object.fromEntries(Object.entries(e.getD1RuntimeColumnAdditions()).map(([n, s]) => {
        const i = Object.fromEntries(Object.entries(s).map(([c, l]) => [c, String(l || "").trim().split(/\s+/, 1)[0].toUpperCase()]));
        return [n, {
          ...r[n],
          ...i
        }];
      }));
      return {
        columns: Object.fromEntries(Object.entries(a).map(([n, s]) => [n, Object.keys(s)])),
        columnTypes: a,
        columnAffinities: Object.fromEntries(Object.entries(a).map(([n, s]) => [n, Object.fromEntries(Object.entries(s).map(([i, c]) => [i, Ln(c)]))])),
        primaryKeys: t,
        indexes: e.getD1RuntimeIndexContract(),
        uniqueIndexes: e.getD1UniqueIndexContract()
      };
    },
    async getD1SchemaFingerprint(t) {
      return t ? ne(ee((await t.prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE type IN ('table', 'index', 'trigger') ORDER BY type, name").all())?.results || [])) : "";
    },
    async getD1SchemaStatus(t, r = {}) {
      if (!t) return {
        tables: {},
        columns: {},
        indexes: {},
        constraints: {
          primaryKeys: {},
          uniqueKeys: {}
        },
        ftsReady: !1,
        fts: {},
        schemaReady: !1,
        issues: ["db_not_configured"]
      };
      const a = e.getD1CurrentSchemaContract(), n = r.snapshot || await e.getD1SchemaSnapshot(t), s = n.objects || [], i = new Set(s.filter((E) => E?.type === "table").map((E) => String(E?.name || "")).filter(Boolean)), c = /* @__PURE__ */ new Map();
      for (const E of n.indexes || []) {
        const D = String(E?.index_name || "");
        if (!D) continue;
        let A = c.get(D);
        A || (A = {
          name: D,
          table: String(E?.table_name || ""),
          unique: Number(E?.is_unique) === 1,
          partial: Number(E?.partial) === 1,
          origin: String(E?.origin || ""),
          columns: []
        }, c.set(D, A)), (E?.is_key === void 0 || Number(E.is_key) === 1) && A.columns.push({
          order: Math.max(0, Number(E?.seqno) || 0),
          name: Number(E?.cid) === -2 || !String(E?.column_name || "").trim() ? "<expression>" : String(E.column_name).toLowerCase()
        });
      }
      for (const E of c.values()) E.columns = E.columns.sort((D, A) => D.order - A.order).map((D) => D.name);
      const l = /* @__PURE__ */ new Map();
      for (const E of n.columns || []) {
        const D = String(E?.table_name || "");
        l.has(D) || l.set(D, []), l.get(D).push({
          name: String(E?.name || "").toLowerCase(),
          type: String(E?.type || "").trim().toUpperCase(),
          affinity: Ln(E?.type),
          primaryKeyOrder: Math.max(0, Number(E?.pk) || 0),
          notNull: Number(E?.is_not_null) === 1,
          defaultValue: E?.dflt_value ?? null,
          hidden: Math.max(0, Number(E?.hidden) || 0)
        });
      }
      const d = Object.fromEntries(Object.keys(a.columns).map((E) => [E, i.has(E)])), u = {}, f = {}, m = [];
      for (const [E, D] of Object.entries(a.columns)) {
        if (!i.has(E)) {
          u[E] = Object.fromEntries(D.map((P) => [P, !1])), f[E] = !1, m.push(`missing_table:${E}`);
          continue;
        }
        const A = l.get(E) || [], x = new Map(A.map((P) => [P.name, P]));
        u[E] = Object.fromEntries(D.map((P) => {
          const C = x.get(P), I = String(a.columnAffinities?.[E]?.[P] || "").toUpperCase(), M = E === e.LOGS_TABLE && P === "id";
          return [P, !!C && (!I || C.affinity === I) && (!M || C.type === "INTEGER")];
        }));
        for (const [P, C] of Object.entries(u[E])) if (!C) {
          const I = x.get(P);
          m.push(I ? `invalid_column_affinity:${E}.${P}` : `missing_column:${E}.${P}`);
        }
        const O = A.filter((P) => P.primaryKeyOrder > 0).sort((P, C) => P.primaryKeyOrder - C.primaryKeyOrder).map((P) => P.name), N = E === e.LOGS_TABLE ? A.find((P) => P.name === "id") : null;
        f[E] = ee(O) === ee(a.primaryKeys[E] || []) && (!N || N.type === "INTEGER"), f[E] || m.push(`invalid_primary_key:${E}`);
        const v = A.filter((P) => !D.includes(P.name) && P.notNull && P.defaultValue === null && P.primaryKeyOrder === 0).map((P) => P.name);
        v.length && m.push(`unsupported_required_columns:${E}:${v.join(",")}`);
      }
      let p = !1;
      if (i.has(e.DNS_IP_POOL_ITEMS_TABLE)) {
        for (const E of [...c.values()].filter((D) => D.table === e.DNS_IP_POOL_ITEMS_TABLE && D.unique && !D.partial)) if (ee(E.columns) === ee(["ip"])) {
          p = !0;
          break;
        }
        p || m.push(`missing_unique_key:${e.DNS_IP_POOL_ITEMS_TABLE}.ip`);
      }
      const g = {};
      for (const [E, D] of Object.entries(a.indexes)) {
        const A = c.get(E);
        if (!A) {
          g[E] = !1, m.push(`missing_index:${E}`);
          continue;
        }
        g[E] = A.table === D.table && A.unique === !1 && A.partial === !1 && ee(A.columns) === ee(D.columns), g[E] || m.push(`invalid_index:${E}`);
      }
      for (const E of Object.keys(a.columns)) {
        const D = [a.primaryKeys?.[E] || [], ...Object.values(a.uniqueIndexes || {}).filter((x) => x.table === E).map((x) => x.columns)], A = [...c.values()].filter((x) => x.table === E && x.unique && !x.partial && !D.some((O) => ee(O) === ee(x.columns))).map((x) => x.name);
        A.length && m.push(`unsupported_unique_indexes:${E}:${A.join(",")}`);
      }
      const h = /* @__PURE__ */ new Set([String(e.LOGS_FTS_INSERT_TRIGGER).toLowerCase()]);
      for (const E of Object.keys(a.columns)) {
        const D = [], A = [];
        for (const x of s) {
          if (x?.type !== "trigger" || String(x?.tbl_name || "") !== E) continue;
          const O = String(x?.name || "");
          !O || h.has(O.toLowerCase()) || (E === e.LOGS_TABLE && e.isLogsFtsSyncTrigger(x) ? A.push(O) : D.push(O));
        }
        D.length && m.push(`unsupported_triggers:${E}:${D.join(",")}`), A.length && m.push(`legacy_fts_trigger:${E}:${A.join(",")}`);
      }
      const y = s.find((E) => E?.type === "table" && String(E?.name || "") === e.LOGS_FTS_TABLE), _ = s.find((E) => E?.type === "trigger" && String(E?.name || "") === e.LOGS_FTS_INSERT_TRIGGER), S = new Set((l.get(e.LOGS_FTS_TABLE) || []).map((E) => E.name)), T = Cr(y?.sql || "").replace(/'/g, ""), b = Cr(_?.sql || ""), R = b.replace(/\s+/g, ""), w = `insertinto${e.LOGS_FTS_TABLE}(rowid,node_name,request_path,user_agent,error_detail,detail_json)values(new.id,new.node_name,new.request_path,coalesce(new.user_agent,''),coalesce(new.error_detail,''),coalesce(new.detail_json,''))`, L = {
        tableReady: !!y,
        virtualTableReady: !!y && /^create\s+virtual\s+table\b/.test(T) && /\busing\s+fts5\s*\(/.test(T) && new RegExp(`\\bcontent\\s*=\\s*${e.LOGS_TABLE}\\b`).test(T) && /\bcontent_rowid\s*=\s*id\b/.test(T),
        columnsReady: [
          "node_name",
          "request_path",
          "user_agent",
          "error_detail",
          "detail_json"
        ].every((E) => S.has(E)),
        triggerReady: String(_?.tbl_name || "") === e.LOGS_TABLE && new RegExp(`\\bafter\\s+insert\\s+on\\s+${e.LOGS_TABLE}\\b`).test(b) && R.includes(w)
      };
      L.ready = L.virtualTableReady && L.columnsReady && L.triggerReady, L.ready || m.push(L.tableReady ? "fts_contract_invalid" : `missing_table:${e.LOGS_FTS_TABLE}`);
      const U = m.length === 0 && Object.values(d).every(Boolean) && Object.values(u).every((E) => Object.values(E).every(Boolean)) && Object.values(f).every(Boolean) && p && Object.values(g).every(Boolean) && L.ready;
      return {
        tables: d,
        columns: u,
        indexes: g,
        constraints: {
          primaryKeys: f,
          uniqueKeys: { [`${e.DNS_IP_POOL_ITEMS_TABLE}.ip`]: p }
        },
        ftsReady: L.ready,
        fts: L,
        schemaReady: U,
        issues: m
      };
    },
    async getD1SchemaReadiness(t, r = {}) {
      if (r.allowAttestedFastPath === !0 && r.env) {
        const a = await e.verifyD1SchemaAttestation(t, r.env);
        if (a.blocked) return {
          ...await e.getD1SchemaStatus(t),
          fastPath: !1,
          attested: a
        };
        if (a.valid) return {
          schemaReady: !0,
          fastPath: !0,
          contractVersion: at,
          contractHash: e.getD1ContractHash(),
          schemaFingerprint: String(a.meta?.schema_fingerprint || ""),
          schemaCookie: a.schemaCookie,
          issues: []
        };
      }
      return {
        ...await e.getD1SchemaStatus(t),
        fastPath: !1
      };
    },
    async probeD1UniqueKeyRepair(t, r, a = []) {
      const n = ce(r), s = a.map((d) => ce(d)), i = s.map((d) => `${d} IS NULL OR (typeof(${d}) = 'text' AND trim(${d}) = '')`).join(" OR "), [c, l] = await Promise.all([t.prepare(`SELECT 1 AS present FROM ${n} WHERE ${i} LIMIT 1`).first(), t.prepare(`SELECT 1 AS present FROM ${n} GROUP BY ${s.join(", ")} HAVING COUNT(*) > 1 LIMIT 1`).first()]);
      return {
        empty: !!c,
        duplicate: !!l
      };
    },
    async probeD1PrimaryKeyRepair(t, r, a) {
      const n = await e.getTableColumnDefinitions(t, r), s = r === e.LOGS_TABLE, i = new Set(a.columns?.[r] || []), c = a.primaryKeys?.[r] || [], l = new Map(n.map((h) => [h.name, h])), d = [];
      for (const h of c) {
        const y = l.get(h), _ = a.columnAffinities?.[r]?.[h];
        y ? (y.affinity !== _ || r === e.LOGS_TABLE && h === "id" && y.type !== "INTEGER") && d.push(`invalid_column_affinity:${r}.${h}`) : s || d.push(`missing_key_column:${r}.${h}`);
      }
      const u = n.filter((h) => !i.has(h.name)).map((h) => h.name);
      !s && u.length && d.push(`unsupported_extra_columns:${r}:${u.join(",")}`), !s && n.some((h) => h.hidden > 0) && d.push(`unsupported_hidden_columns:${r}`), ((await t.prepare(`PRAGMA foreign_key_list(${ce(r)})`).all())?.results || []).length && d.push(`unsupported_foreign_keys:${r}`);
      const f = ((await t.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'trigger' AND tbl_name = ?").bind(r).all())?.results || []).filter((h) => {
        if (r !== e.LOGS_TABLE) return !0;
        const y = String(h?.name || "").toLowerCase(), _ = Cr(h?.sql || "");
        return !(y === String(e.LOGS_FTS_INSERT_TRIGGER).toLowerCase() || y === `${e.LOGS_TABLE}_ai` || y === `${e.LOGS_TABLE}_au` || y === `${e.LOGS_TABLE}_ad` || _.includes(String(e.LOGS_FTS_TABLE).toLowerCase()));
      });
      !s && f.length && d.push(`unsupported_triggers:${r}:${f.map((h) => String(h?.name || "")).join(",")}`);
      const m = [`__d1_repair_${r}_`, `__d1_backup_${r}_`], p = await t.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND (name GLOB ? OR name GLOB ?) LIMIT 1").bind(`${m[0]}*`, `${m[1]}*`).first();
      p?.name && d.push(`repair_artifact_present:${r}:${String(p.name)}`);
      let g = null;
      if (!s) {
        const h = ce(r), y = await t.prepare(`SELECT COUNT(*) AS total FROM (SELECT 1 FROM ${h} LIMIT ${wn + 1})`).first();
        g = Math.max(0, Number(y?.total) || 0);
      }
      if (!s && g > wn && d.push(`rebuild_row_limit_exceeded:${r}:${g}`), !s && !d.length) {
        const h = await e.probeD1UniqueKeyRepair(t, r, c);
        h.empty && d.push(`primary_key_empty:${r}`), h.duplicate && d.push(`primary_key_duplicate:${r}`);
      }
      return {
        repairable: d.length === 0,
        rowCount: g,
        estimatedRowsIsLowerBound: g !== null && g > wn,
        rowCountMeasured: g !== null,
        allowsDataLoss: s,
        blockers: d
      };
    },
    async buildD1SchemaRepairPlan(t) {
      const r = await e.getD1SchemaSnapshot(t), a = await e.getD1SchemaStatus(t, { snapshot: r }), n = e.getD1CurrentSchemaContract(), s = ne(ee(r.objects || [])), i = await e.getD1SchemaCookie(t), c = e.getD1ContractHash(), l = await e.readD1SchemaMeta(t), d = [], u = [], f = [], m = [], p = (A, x, O = "low", N = 0, v = {}) => m.push({
        kind: A,
        target: x,
        risk: O,
        estimatedRows: N === null ? null : Math.max(0, Number(N) || 0),
        ...v
      }), g = Math.max(0, Number(l?.contract_version) || 0), h = g > at ? `schema_version_ahead:${g}` : "";
      for (const [A, x] of Object.entries(a.tables || {})) {
        if (!x) {
          const N = `missing_table:${A}`;
          d.push(N), p("create_table", A);
          continue;
        }
        const O = A === e.LOGS_TABLE && a.constraints?.primaryKeys?.[A] !== !0;
        for (const [N, v] of Object.entries(a.columns?.[A] || {})) {
          if (v) continue;
          const P = `${A}.${N}`, C = (a.issues || []).find((I) => String(I).endsWith(P)) || `missing_column:${P}`;
          O && String(C).startsWith("missing_column:") ? u.push(C) : String(C).startsWith("missing_column:") && e.getD1RuntimeColumnAdditions()?.[A]?.[N] ? (d.push(C), p("add_column", P)) : f.push(C);
        }
        if (a.constraints?.primaryKeys?.[A] !== !0) {
          const N = `invalid_primary_key:${A}`, v = await e.probeD1PrimaryKeyRepair(t, A, n);
          v.repairable ? (u.push(N), p(v.allowsDataLoss === !0 ? "recreate_log_table" : "rebuild_table", A, "high", v.rowCount, {
            allowsDataLoss: v.allowsDataLoss === !0,
            willDiscardData: v.allowsDataLoss === !0,
            dataMode: v.allowsDataLoss === !0 ? "discard" : "copy",
            estimatedRowsIsLowerBound: v.estimatedRowsIsLowerBound === !0,
            rowCountMeasured: v.rowCountMeasured === !0
          })) : f.push(N, ...v.blockers);
        }
      }
      for (const A of a.issues || []) if (/^unsupported_(?:required_columns|unique_indexes|triggers):/.test(String(A))) {
        const x = String(A).split(":", 2)[1];
        if (x === e.LOGS_TABLE && a.constraints?.primaryKeys?.[x] !== !0) continue;
        f.push(A);
      }
      for (const A of a.issues || []) {
        const x = /^legacy_fts_trigger:([^:]+):(.+)$/.exec(String(A));
        if (!x) continue;
        const O = x[1];
        for (const N of x[2].split(",")) {
          const v = N.trim();
          v && (d.push(`legacy_fts_trigger:${O}:${v}`), p("drop_trigger", v));
        }
      }
      const y = `${e.DNS_IP_POOL_ITEMS_TABLE}.ip`;
      if (a.tables?.[e.DNS_IP_POOL_ITEMS_TABLE] && a.constraints?.uniqueKeys?.[y] !== !0 && a.columns?.[e.DNS_IP_POOL_ITEMS_TABLE]?.ip === !0) {
        const A = await e.probeD1UniqueKeyRepair(t, e.DNS_IP_POOL_ITEMS_TABLE, ["ip"]);
        A.empty && f.push(`unique_key_empty:${y}`), A.duplicate && f.push(`unique_key_duplicate:${y}`), !A.empty && !A.duplicate && (d.push(`missing_unique_key:${y}`), p("create_unique_index", "ux_dns_ip_pool_items_ip"));
      }
      const _ = m.some((A) => A.kind === "recreate_log_table" && A.target === e.LOGS_TABLE);
      for (const [A, x] of Object.entries(a.indexes || {})) if (!x) {
        const O = (a.issues || []).includes(`invalid_index:${A}`) ? `invalid_index:${A}` : `missing_index:${A}`;
        d.push(O), _ && n.indexes?.[A]?.table === e.LOGS_TABLE || p(O.startsWith("invalid_") ? "repair_index" : "create_index", A);
      }
      if (a.ftsReady !== !0) {
        const A = a.fts?.tableReady ? "fts_contract_invalid" : `missing_table:${e.LOGS_FTS_TABLE}`;
        d.push(A), _ || p(a.fts?.tableReady ? "recreate_fts" : "create_fts", e.LOGS_FTS_TABLE);
      }
      const S = (A) => [...new Set(A.map((x) => String(x || "").trim()).filter(Boolean))], T = S(d), b = S(u), R = S(f);
      h && (R.length || b.length ? R.push(h) : (T.push(h), p("reattest_contract_version", e.D1_SCHEMA_META_TABLE)));
      const w = [...new Map(m.map((A) => [`${A.kind}:${A.target}`, A])).values()].sort((A, x) => `${A.risk}:${A.kind}:${A.target}`.localeCompare(`${x.risk}:${x.kind}:${x.target}`)), L = w.filter((A) => A.risk !== "high"), U = w.filter((A) => A.risk === "high"), E = R.length ? "blocked" : b.length ? "high" : T.length ? "low" : "none", D = R.length ? "blocked" : L.length ? "safe" : U.length ? "destructive" : "ready";
      return {
        version: va,
        phase: D,
        contractVersion: at,
        contractHash: c,
        schemaCookie: i,
        planHash: ne(ee({
          version: va,
          contractVersion: at,
          contractHash: c,
          schemaCookie: i,
          schemaFingerprint: s,
          phase: D,
          repairableIssues: T,
          highRiskIssues: b,
          blockingIssues: R,
          steps: w
        })),
        schemaFingerprint: s,
        risk: E,
        repairableIssues: T,
        highRiskIssues: b,
        blockingIssues: R,
        steps: w,
        status: a
      };
    },
    async createD1SchemaRepairToken(t, r, a = {}) {
      const n = String(t?.JWT_SECRET || "").trim();
      if (!n) {
        const l = /* @__PURE__ */ new Error("JWT_SECRET is required to sign the D1 schema repair plan");
        throw l.code = "SERVER_MISCONFIGURED", l.status = 503, l;
      }
      const s = Math.max(0, Math.floor(Number(a.nowMs ?? H()) / 1e3)), i = s + Math.floor(Vu / 1e3), c = ha(JSON.stringify({
        version: va,
        scope: "d1_schema_repair",
        phase: String(r?.phase || ""),
        contractVersion: Math.max(0, Number(r?.contractVersion) || 0),
        contractHash: String(r?.contractHash || ""),
        schemaCookie: Math.max(0, Number(r?.schemaCookie) || 0),
        planHash: String(r?.planHash || ""),
        schemaFingerprint: String(r?.schemaFingerprint || ""),
        destructiveTargets: (r?.steps || []).filter((l) => l?.risk === "high").map((l) => String(l?.target || "")),
        issuedAt: s,
        expiresAt: i
      }));
      return {
        token: `${c}.${await gt(n, c)}`,
        expiresAt: i
      };
    },
    async verifyD1SchemaRepairToken(t, r, a, n = {}) {
      const s = String(t?.JWT_SECRET || "").trim(), i = String(r || "").trim(), c = (m, p = {}) => {
        const g = /* @__PURE__ */ new Error("D1 schema repair plan is stale");
        return g.code = "D1_SCHEMA_REPAIR_PLAN_STALE", g.status = 409, g.details = {
          reason: m,
          ...p
        }, g;
      };
      if (!s) {
        const m = /* @__PURE__ */ new Error("JWT_SECRET is required to verify the D1 schema repair plan");
        throw m.code = "SERVER_MISCONFIGURED", m.status = 503, m;
      }
      const l = i.indexOf(".");
      if (l <= 0 || l === i.length - 1) throw c("invalid_token");
      const d = i.slice(0, l);
      if (i.slice(l + 1) !== await gt(s, d)) throw c("invalid_signature");
      let u = null;
      try {
        u = JSON.parse(jr(d));
      } catch {
      }
      if (!$(u) || u.version !== va || u.scope !== "d1_schema_repair" || u.phase !== "destructive") throw c("invalid_payload");
      const f = Math.max(0, Math.floor(Number(n.nowMs ?? H()) / 1e3));
      if (Number(u.expiresAt) <= f) throw c("expired", { expiresAt: Number(u.expiresAt) || 0 });
      if (String(u.planHash || "") !== String(a?.planHash || "") || String(u.schemaFingerprint || "") !== String(a?.schemaFingerprint || "") || Number(u.schemaCookie) !== Number(a?.schemaCookie) || String(u.contractHash || "") !== String(a?.contractHash || "") || Number(u.contractVersion) !== Number(a?.contractVersion)) throw c("schema_changed", {
        previewPlanHash: String(u.planHash || ""),
        currentPlanHash: String(a?.planHash || "")
      });
      return u;
    },
    getD1SchemaRepairTokenPlanHash(t) {
      const r = String(t || "").trim().split(".", 1)[0];
      if (!r) return "";
      try {
        const a = JSON.parse(jr(r));
        return a?.scope === "d1_schema_repair" ? String(a?.planHash || "").trim() : "";
      } catch {
        return "";
      }
    },
    async getD1TimeTravelBookmark(t) {
      if (!t || typeof t.withSession != "function") {
        const r = /* @__PURE__ */ new Error("D1 Time Travel bookmark is unavailable on this binding");
        throw r.code = "D1_SCHEMA_REPAIR_RECOVERY_UNAVAILABLE", r.status = 409, r.details = { reason: "sessions_api_unavailable" }, r;
      }
      try {
        const r = t.withSession("first-primary");
        if (!r || typeof r.prepare != "function" || typeof r.getBookmark != "function") throw new Error("invalid_d1_session");
        await r.prepare("SELECT 1 AS bookmark_probe").run();
        const a = String(r.getBookmark() || "").trim();
        if (!a) throw new Error("empty_bookmark");
        return {
          bookmark: a,
          consistency: "first-primary",
          capturedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
        };
      } catch (r) {
        if (String(r?.code || "") === "D1_SCHEMA_REPAIR_RECOVERY_UNAVAILABLE") throw r;
        const a = /* @__PURE__ */ new Error("Unable to capture a D1 Time Travel bookmark");
        throw a.code = "D1_SCHEMA_REPAIR_RECOVERY_UNAVAILABLE", a.status = 409, a.details = {
          reason: "bookmark_failed",
          cause: se(r, "bookmark_failed")
        }, a;
      }
    },
    async ensureD1KnownColumns(t, r = {}) {
      const a = await e.getD1TableNameSet(t), n = new Set(Array.isArray(r.skipTables) ? r.skipTables : []), s = [];
      for (const [i, c] of Object.entries(e.getD1RuntimeColumnAdditions())) {
        if (!a.has(i) || n.has(i)) continue;
        const l = await e.getTableColumns(t, i);
        for (const [d, u] of Object.entries(c))
          l.has(d) || (await t.prepare(`ALTER TABLE ${ce(i)} ADD COLUMN ${ce(d)} ${u}`).run(), l.add(d), s.push(`${i}.${d}`));
      }
      return s;
    },
    async repairD1RuntimeIndexes(t, r = {}) {
      const a = await e.getD1TableNameSet(t), n = new Set(Array.isArray(r.skipTables) ? r.skipTables : []), s = [], i = [];
      for (const [c, l] of Object.entries(e.getD1RuntimeIndexContract())) {
        if (!a.has(l.table) || n.has(l.table)) continue;
        const d = await t.prepare("SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = ? LIMIT 1").bind(c).first();
        let u = !1;
        if (d) {
          const f = (await e.getTableIndexDefinitions(t, l.table)).find((m) => m.name === c);
          u = String(d?.tbl_name || "") === l.table && f?.unique === !1 && f?.partial === !1 && ee(await e.getIndexKeyColumns(t, c)) === ee(l.columns);
        }
        u || (d ? (await t.prepare(`DROP INDEX IF EXISTS ${ce(c)}`).run(), i.push(c)) : s.push(c), await t.prepare(l.createSql).run());
      }
      return {
        createdIndexes: s,
        repairedIndexes: i
      };
    },
    async ensureD1UniqueIndexes(t) {
      const r = [];
      for (const [a, n] of Object.entries(e.getD1UniqueIndexContract())) {
        if (!(await e.getD1TableNameSet(t)).has(n.table)) continue;
        let s = !1;
        for (const i of (await e.getTableIndexDefinitions(t, n.table)).filter((c) => c.unique && !c.partial)) if (ee(await e.getIndexKeyColumns(t, i.name)) === ee(n.columns)) {
          s = !0;
          break;
        }
        s || (await t.prepare("SELECT tbl_name FROM sqlite_master WHERE type = 'index' AND name = ? LIMIT 1").bind(a).first() && await t.prepare(`DROP INDEX IF EXISTS ${ce(a)}`).run(), await t.prepare(n.createSql).run(), r.push(a));
      }
      return r;
    },
    async rebuildD1TableWithShadow(t, r, a) {
      const n = e.getD1CurrentSchemaContract();
      if (!Object.prototype.hasOwnProperty.call(n.columns, r)) throw new Error(`Unknown D1 rebuild table: ${r}`);
      if (r === e.LOGS_TABLE) throw new Error("proxy_logs must use destructive atomic recreation");
      const s = String(a?.planHash || "repair").replace(/[^a-z0-9]/gi, "").slice(0, 12) || "repair", i = `__d1_repair_${r}_${s}`, c = `__d1_backup_${r}_${s}`, l = await e.getD1TableNameSet(t);
      if (l.has(i) || l.has(c)) {
        const m = /* @__PURE__ */ new Error("D1 schema repair temporary table already exists");
        throw m.code = "D1_SCHEMA_REPAIR_BLOCKED", m.status = 409, m.details = {
          phase: "preflight",
          blockingIssues: [`repair_artifact_present:${r}`]
        }, m;
      }
      const d = n.columns[r].map((m) => ce(m)).join(", "), u = (await t.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND sql IS NOT NULL").bind(r).all())?.results || [];
      await t.prepare(e.buildD1CreateTableSql(r, i)).run();
      try {
        await t.batch([
          t.prepare(`INSERT INTO ${ce(i)} (${d}) SELECT ${d} FROM ${ce(r)}`),
          t.prepare(`ALTER TABLE ${ce(r)} RENAME TO ${ce(c)}`),
          t.prepare(`ALTER TABLE ${ce(i)} RENAME TO ${ce(r)}`),
          ...u.map((m) => t.prepare(`DROP INDEX ${ce(m.name)}`)),
          ...u.map((m) => t.prepare(String(m.sql)))
        ]);
      } catch (m) {
        throw await t.prepare(`DROP TABLE IF EXISTS ${ce(i)}`).run().catch(() => {
        }), m;
      }
      const f = await t.prepare(`SELECT COUNT(*) AS total FROM ${ce(r)}`).first();
      return {
        table: r,
        rowCount: Math.max(0, Number(f?.total) || 0),
        allowsDataLoss: !1,
        willDiscardData: !1,
        dataMode: "copy",
        backupTable: c,
        originalIndexes: u
      };
    },
    async recreateD1LogsDestructively(t, r) {
      const a = (r?.steps || []).find((i) => i?.kind === "recreate_log_table" && i?.target === e.LOGS_TABLE);
      if (!a || a.willDiscardData !== !0 || a.dataMode !== "discard") throw new Error("Missing destructive proxy_logs repair step");
      const n = e.getD1LogsFtsContractSql(), s = Object.values(e.getD1RuntimeIndexContract()).filter((i) => i.table === e.LOGS_TABLE);
      return await t.batch([
        t.prepare(`DROP TABLE IF EXISTS ${ce(e.LOGS_FTS_TABLE)}`),
        t.prepare(`DROP TABLE ${ce(e.LOGS_TABLE)}`),
        t.prepare(e.buildD1CreateTableSql(e.LOGS_TABLE)),
        ...s.map((i) => t.prepare(i.createSql)),
        t.prepare(n.createTable),
        t.prepare(n.createTrigger)
      ]), {
        table: e.LOGS_TABLE,
        rowCount: 0,
        rowCountMeasured: !1,
        discardedRows: null,
        discardedRowsIsLowerBound: !1,
        allowsDataLoss: !0,
        willDiscardData: !0,
        dataMode: "discard"
      };
    },
    async rollbackD1RebuiltTables(t, r = []) {
      for (const a of [...r].reverse()) {
        const n = String(a?.table || ""), s = String(a?.backupTable || "");
        if (!(!n || !s || !(await e.getD1TableNameSet(t)).has(s))) {
          n === e.LOGS_TABLE && (await e.dropLogsFtsSyncTriggers(t).catch(() => 0), await t.prepare(`DROP TABLE IF EXISTS ${ce(e.LOGS_FTS_TABLE)}`).run().catch(() => {
          }));
          for (const i of (await t.prepare("SELECT name FROM sqlite_master WHERE type = 'index' AND tbl_name = ? AND sql IS NOT NULL").bind(n).all())?.results || []) await t.prepare(`DROP INDEX IF EXISTS ${ce(i.name)}`).run().catch(() => {
          });
          await t.batch([t.prepare(`DROP TABLE IF EXISTS ${ce(n)}`), t.prepare(`ALTER TABLE ${ce(s)} RENAME TO ${ce(n)}`)]);
          for (const i of a.originalIndexes || []) {
            const c = String(i?.sql || "").replace(/^CREATE\s+(UNIQUE\s+)?INDEX\s+/i, (l, d) => `CREATE ${d || ""}INDEX IF NOT EXISTS `);
            c && await t.prepare(c).run().catch(() => {
            });
          }
          n === e.LOGS_TABLE && await e.ensureLogsFtsSchema(t, { forceRecreate: !0 }).catch(() => {
          });
        }
      }
    },
    async assertD1CurrentSchema(t) {
      const r = await e.buildD1SchemaRepairPlan(t);
      if (r.blockingIssues.length) {
        const a = /* @__PURE__ */ new Error("D1 schema repair is blocked by incompatible data or table shape");
        throw a.code = "D1_SCHEMA_REPAIR_BLOCKED", a.status = 409, a.details = {
          phase: "preflight",
          blockingIssues: r.blockingIssues,
          repairPlan: r
        }, a;
      }
      return r;
    },
    async initializeD1Database(t, r = {}) {
      if (!t) {
        const c = /* @__PURE__ */ new Error("D1 not configured");
        throw c.code = "D1_NOT_CONFIGURED", c.status = 503, c;
      }
      const a = r.includeFts === !1 ? "logs-core" : "logs-fts";
      let n = J.D1DatabaseInitReady.get(t);
      (!n || !(n.inFlight instanceof Map)) && (n = {
        tail: Promise.resolve(),
        inFlight: /* @__PURE__ */ new Map()
      }, J.D1DatabaseInitReady.set(t, n));
      const s = `${a}:${e.getD1SchemaRepairTokenPlanHash(r.repairToken) || "automatic"}`;
      let i = n.inFlight.get(s);
      i || (i = Promise.resolve(n.tail).catch(() => {
      }).then(() => e.runD1DatabaseInitialization(t, {
        ...r,
        profile: a
      })), n.tail = i.catch(() => {
      }), n.inFlight.set(s, i));
      try {
        return await i;
      } finally {
        n.inFlight.get(s) === i && n.inFlight.delete(s);
      }
    },
    async runD1DatabaseInitialization(t, r = {}) {
      const a = r.profile || (r.includeFts === !1 ? "logs-core" : "logs-fts"), n = String(r.repairMode || (String(r.repairToken || "").trim() ? "confirmed-destructive" : "safe"));
      e.invalidateD1SchemaReadiness(t, "all");
      const s = await e.buildD1SchemaRepairPlan(t), i = new Set(Object.entries(s.status?.tables || {}).filter(([, f]) => f === !0).map(([f]) => f));
      if (s.status?.fts?.tableReady === !0 && i.add(e.LOGS_FTS_TABLE), s.blockingIssues.length) {
        const f = /* @__PURE__ */ new Error("D1 schema repair is blocked by incompatible data or table shape");
        throw f.code = "D1_SCHEMA_REPAIR_BLOCKED", f.status = 409, f.details = {
          phase: "preflight",
          blockingIssues: s.blockingIssues,
          repairPlan: s
        }, f;
      }
      let c = null;
      if (s.phase === "safe" && n === "confirmed-destructive") {
        const f = /* @__PURE__ */ new Error("D1 schema repair must complete safe preparation before destructive repair");
        throw f.code = "D1_SCHEMA_REPAIR_PREPARATION_REQUIRED", f.status = 409, f.details = { repairPlan: s }, f;
      }
      if (s.phase === "destructive") {
        if (r.confirmHighRisk !== !0 || !String(r.repairToken || "").trim()) {
          const f = r.env ? await e.createD1SchemaRepairToken(r.env, s) : {
            token: "",
            expiresAt: 0
          }, m = /* @__PURE__ */ new Error("D1 schema repair requires explicit confirmation");
          throw m.code = "D1_SCHEMA_REPAIR_CONFIRMATION_REQUIRED", m.status = 428, m.details = { repairPlan: {
            ...s,
            repairToken: f.token,
            expiresAt: f.expiresAt ? (/* @__PURE__ */ new Date(f.expiresAt * 1e3)).toISOString() : ""
          } }, m;
        }
        await e.verifyD1SchemaRepairToken(r.env, r.repairToken, s), c = await e.getD1TimeTravelBookmark(t);
      }
      const l = [], d = [];
      let u = "";
      try {
        if (s.steps.find((N) => N.kind === "create_table" && N.target === e.D1_SCHEMA_META_TABLE && N.risk !== "high") && (await t.prepare(e.buildD1CreateTableSql(e.D1_SCHEMA_META_TABLE, e.D1_SCHEMA_META_TABLE, { ifNotExists: !0 })).run(), d.push({
          kind: "create_table",
          target: e.D1_SCHEMA_META_TABLE
        })), (s.phase === "safe" || s.phase === "destructive") && (u = String(globalThis.crypto?.randomUUID?.() || `${H()}-${Math.random()}`), await e.acquireD1SchemaRepairLease(t, u)), s.phase === "destructive") {
          const N = await e.buildD1SchemaRepairPlan(t);
          await e.verifyD1SchemaRepairToken(r.env, r.repairToken, N);
        }
        const f = s.phase === "safe" ? s.steps.filter((N) => N.risk !== "high") : s.phase === "destructive" ? s.steps.filter((N) => N.risk === "high") : [], m = f.filter((N) => N.kind === "create_table" && N.target !== e.LOGS_FTS_TABLE && N.target !== e.D1_SCHEMA_META_TABLE).map((N) => N.target);
        for (const N of m)
          await t.prepare(e.buildD1CreateTableSql(N, N, { ifNotExists: !0 })).run(), d.push({
            kind: "create_table",
            target: N
          });
        const p = f.filter((N) => N.kind === "drop_trigger").map((N) => N.target);
        for (const N of p)
          await t.prepare(`DROP TRIGGER IF EXISTS ${ce(N)}`).run(), d.push({
            kind: "drop_trigger",
            target: N
          });
        const g = f.filter((N) => N.kind === "rebuild_table").map((N) => N.target), h = f.find((N) => N.kind === "recreate_log_table" && N.target === e.LOGS_TABLE), y = [];
        for (const N of f.filter((v) => v.kind === "add_column")) {
          const [v, P] = String(N.target || "").split(".", 2), C = e.getD1RuntimeColumnAdditions()?.[v]?.[P];
          if (!C) throw new Error(`Unknown D1 column addition: ${N.target}`);
          await t.prepare(`ALTER TABLE ${ce(v)} ADD COLUMN ${ce(P)} ${C}`).run(), y.push(N.target), d.push({
            kind: "add_column",
            target: N.target
          });
        }
        for (const N of g)
          l.push(await e.rebuildD1TableWithShadow(t, N, s)), d.push({
            kind: "rebuild_table",
            target: N
          });
        h && (l.push(await e.recreateD1LogsDestructively(t, s)), d.push({
          kind: "recreate_log_table",
          target: e.LOGS_TABLE
        }));
        const _ = h ? Object.entries(e.getD1RuntimeIndexContract()).filter(([, N]) => N.table === e.LOGS_TABLE).map(([N]) => N) : [], S = {
          createdIndexes: [],
          repairedIndexes: []
        };
        for (const N of f.filter((v) => v.kind === "create_index" || v.kind === "repair_index")) {
          const v = e.getD1RuntimeIndexContract()?.[N.target];
          if (!v) throw new Error(`Unknown D1 runtime index: ${N.target}`);
          N.kind === "repair_index" && await t.prepare(`DROP INDEX IF EXISTS ${ce(N.target)}`).run(), await t.prepare(v.createSql).run(), S[N.kind === "repair_index" ? "repairedIndexes" : "createdIndexes"].push(N.target), d.push({
            kind: N.kind,
            target: N.target
          });
        }
        const T = [];
        for (const N of f.filter((v) => v.kind === "create_unique_index")) {
          const v = e.getD1UniqueIndexContract()?.[N.target];
          if (!v) throw new Error(`Unknown D1 unique index: ${N.target}`);
          await t.prepare(v.createSql).run(), T.push(N.target), d.push({
            kind: N.kind,
            target: N.target
          });
        }
        let b = {
          rebuilt: !1,
          recreated: !1
        };
        const R = f.find((N) => N.target === e.LOGS_FTS_TABLE);
        R && r.includeFts !== !1 && (b = await e.ensureLogsFtsSchema(t, {
          forceRecreate: !0,
          baseSchemaReady: !0
        })), b?.rebuilt === !0 && d.push({
          kind: String(R?.kind || "create_fts"),
          target: e.LOGS_FTS_TABLE
        }), e.invalidateD1SchemaReadiness(t, "all");
        const w = await e.getD1SchemaSnapshot(t), L = await e.getD1SchemaStatus(t, { snapshot: w }), U = ne(ee(w.objects || [])), E = (L.schemaReady ? null : await e.buildD1SchemaRepairPlan(t))?.phase === "destructive";
        if (!L.schemaReady && !E) {
          const N = /* @__PURE__ */ new Error("D1 schema repair did not produce the current contract");
          throw N.code = "D1_SCHEMA_REPAIR_FAILED", N.status = 503, N.details = {
            phase: "final_status",
            issues: L.issues
          }, N;
        }
        const D = l.filter((N) => N?.backupTable);
        D.length && await t.batch(D.map((N) => t.prepare(`DROP TABLE IF EXISTS ${ce(N.backupTable)}`)));
        let A = {
          written: !1,
          reason: "pending_high_risk"
        };
        L.schemaReady && (s.phase === "ready" ? A = (await e.verifyD1SchemaAttestation(t, r.env)).valid ? {
          written: !1,
          reused: !0,
          contractVersion: at,
          contractHash: s.contractHash
        } : await e.writeVerifiedD1SchemaMeta(t, r.env, {
          ...s,
          schemaFingerprint: U
        }) : A = await e.writeVerifiedD1SchemaMeta(t, r.env, {
          ...s,
          schemaFingerprint: U
        }));
        const x = /* @__PURE__ */ new Set([...Object.keys(e.getD1CurrentSchemaContract().columns), e.LOGS_FTS_TABLE]), O = w.objects.filter((N) => N?.type === "table").map((N) => String(N?.name || "")).filter((N) => x.has(N) && !i.has(N));
        return {
          profile: a,
          phase: s.phase,
          completed: L.schemaReady,
          pendingHighRisk: E,
          schemaReady: L.schemaReady,
          contractVersion: at,
          contractHash: s.contractHash,
          planHash: s.planHash,
          risk: s.risk,
          createdTables: O,
          addedColumns: y,
          createdIndexes: [...S.createdIndexes, ..._],
          repairedIndexes: S.repairedIndexes,
          uniqueIndexesCreated: T,
          droppedTriggers: p,
          rebuiltTables: l.map(({ table: N, rowCount: v, rowCountMeasured: P, discardedRows: C, discardedRowsIsLowerBound: I, willDiscardData: M, dataMode: F }) => M ? {
            table: N,
            rowCount: v,
            rowCountMeasured: P,
            discardedRows: C,
            discardedRowsIsLowerBound: I,
            allowsDataLoss: !0,
            willDiscardData: !0,
            dataMode: F
          } : {
            table: N,
            rowCount: v
          }),
          ftsRebuilt: b?.rebuilt === !0,
          ftsRecreated: h ? !0 : b?.recreated === !0 && s.status?.fts?.tableReady === !0,
          recoveryBookmark: String(c?.bookmark || ""),
          bookmarkCapturedAt: String(c?.capturedAt || ""),
          schemaMeta: A,
          steps: s.steps.map((N) => ({
            ...N,
            ready: d.some((v) => v.kind === N.kind && v.target === N.target) || L.schemaReady
          })),
          status: L
        };
      } catch (f) {
        l.length && await e.rollbackD1RebuiltTables(t, l).catch(() => {
        }), e.invalidateD1SchemaReadiness(t, "all");
        let m = [];
        try {
          m = (await e.getD1SchemaStatus(t))?.issues || [];
        } catch {
        }
        if (f && typeof f == "object" && (f.details = {
          ...$(f.details) ? f.details : {},
          executedSteps: d,
          remainingIssues: m,
          recoveryBookmark: String(c?.bookmark || ""),
          bookmarkCapturedAt: String(c?.capturedAt || "")
        }), String(f?.code || "").startsWith("D1_SCHEMA_REPAIR_")) throw f;
        const p = new Error(se(f, "D1 schema repair failed"));
        throw p.code = "D1_SCHEMA_REPAIR_FAILED", p.status = 503, p.details = {
          ...$(f?.details) ? f.details : {},
          phase: "execution"
        }, p;
      } finally {
        u && await e.releaseD1SchemaRepairLease(t, u).catch(() => {
        });
      }
    },
    async probeLogsReadiness(t, r = {}) {
      if (!t) return {
        schemaReady: !1,
        ftsReady: !1,
        statsReady: !1,
        probedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      };
      const a = te.LogsReadinessProbeCache.get(t), n = Math.max(1e3, Number(r.maxAgeMs) || 15e3);
      if (r.force !== !0 && a && H() - a.ts < n) return a.data;
      const [s, i, c] = await Promise.all([
        e.hasLogsBaseTable(t),
        e.isLogsFtsReady(t),
        e.hasStatsHourlyTable(t)
      ]), l = {
        schemaReady: s,
        ftsReady: i,
        statsReady: c,
        probedAt: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
      };
      return te.LogsReadinessProbeCache.set(t, {
        ts: H(),
        data: l
      }), l;
    },
    async resolveLogsReadiness(t, r = {}) {
      const a = e.resolveOpsStatusStores(t), n = await e.getOpsStatusSection(a, "log"), s = n?.schemaReady === !0, i = n?.ftsReady === !0, c = n?.statsReady === !0;
      return s && c && (i || r.requireFts !== !0) || !a.db ? {
        schemaReady: s,
        ftsReady: i,
        statsReady: c,
        revision: e.getLogsRevisionFromStatus(n),
        source: "status",
        logStatus: n
      } : {
        ...await e.probeLogsReadiness(a.db, r),
        revision: e.getLogsRevisionFromStatus(n),
        source: "probe",
        logStatus: n
      };
    }
  };
}
function sh(o = {}, e = {}) {
  return {
    async ensureLogsBaseSchema(t) {
      if (!t) return !1;
      if (e.isD1SchemaReadyCached(t, "logsBaseSchema")) return !0;
      let r = J.LogsBaseDbReady.get(t);
      r || (r = (async () => (await t.prepare(`CREATE TABLE IF NOT EXISTS ${e.LOGS_TABLE} (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp INTEGER NOT NULL, node_name TEXT NOT NULL, request_path TEXT NOT NULL, request_method TEXT NOT NULL, status_code INTEGER NOT NULL, response_time INTEGER NOT NULL, client_ip TEXT NOT NULL, inbound_colo TEXT, outbound_colo TEXT, user_agent TEXT, referer TEXT, category TEXT DEFAULT 'api', error_detail TEXT, detail_json TEXT, created_at TEXT NOT NULL, inbound_ip TEXT, outbound_ip TEXT)`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_proxy_logs_timestamp ON ${e.LOGS_TABLE} (timestamp)`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_proxy_logs_client_time ON ${e.LOGS_TABLE} (client_ip, timestamp DESC)`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_proxy_logs_status_time ON ${e.LOGS_TABLE} (status_code, timestamp)`).run(), await t.prepare(`CREATE INDEX IF NOT EXISTS idx_proxy_logs_category_time ON ${e.LOGS_TABLE} (category, timestamp)`).run(), e.markD1SchemaReady(t, "logsBaseSchema"), e.markD1SchemaReady(t, "logsTableExists"), te.LogsReadinessProbeCache.delete(t), !0))().catch((a) => {
        throw J.LogsBaseDbReady.delete(t), a;
      }), J.LogsBaseDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.LogsBaseDbReady.get(t) === r && J.LogsBaseDbReady.delete(t);
      }
    },
    async ensureStatsHourlySchema(t) {
      if (!t) return !1;
      if (e.isD1SchemaReadyCached(t, "statsHourlySchema")) return !0;
      let r = J.StatsHourlyDbReady.get(t);
      r || (r = t.prepare(`CREATE TABLE IF NOT EXISTS ${e.STATS_HOURLY_TABLE} (
              bucket_date TEXT NOT NULL,
              bucket_hour INTEGER NOT NULL,
              request_count INTEGER NOT NULL DEFAULT 0,
              play_count INTEGER NOT NULL DEFAULT 0,
              playback_info_count INTEGER NOT NULL DEFAULT 0,
              updated_at TEXT NOT NULL,
              PRIMARY KEY (bucket_date, bucket_hour)
            )`).run().then(() => (e.markD1SchemaReady(t, "statsHourlySchema"), e.markD1SchemaReady(t, "statsTableExists"), te.LogsReadinessProbeCache.delete(t), !0)).catch((a) => {
        throw J.StatsHourlyDbReady.delete(t), a;
      }), J.StatsHourlyDbReady.set(t, r));
      try {
        return await r;
      } finally {
        J.StatsHourlyDbReady.get(t) === r && J.StatsHourlyDbReady.delete(t);
      }
    }
  };
}
function ih(o = {}, e = {}) {
  return {
    normalizeD1SchemaProfile(t = "") {
      const r = String(t || "").trim().toLowerCase();
      return r === "runtime-core" || r === "logs-core" || r === "logs-fts" ? r : "logs-core";
    },
    invalidateD1SchemaReadiness(t, r = "all") {
      if (!t) return;
      const a = String(r || "all").trim().toLowerCase();
      if ((a === "all" || a === "logs") && (e.clearD1SchemaReady(t, [
        "logsBaseSchema",
        "logsTableExists",
        "statsHourlySchema",
        "statsTableExists"
      ]), J.LogsBaseDbReady.delete(t), J.StatsHourlyDbReady.delete(t), te.LogsReadinessProbeCache.delete(t)), a === "all") {
        e.clearD1SchemaReady(t);
        const n = J.OpsStatusShadowCache.get(t);
        n?.payloadCache instanceof Map && n.payloadCache.clear(), J.AdminShellStatusWriteState.delete(t), J.DnsIpWorkspaceDbReady.delete(t), J.OpsStatusDbReady.delete(t), J.ScheduledLeaseDbReady.delete(t), J.AuthFailuresDbReady.delete(t), J.CfDashboardCacheDbReady.delete(t), J.CfRuntimeCacheDbReady.delete(t);
      }
    },
    async bootstrapD1Schema(t, r = "logs-core") {
      const a = e.normalizeD1SchemaProfile(r);
      if (!t) return {
        profile: a,
        runtimeTablesReady: !1,
        schemaReady: !1,
        statsReady: !1,
        ftsReady: !1,
        ftsResult: {
          migratedRows: 0,
          droppedTriggers: 0,
          rebuilt: !1,
          recreated: !1
        },
        steps: []
      };
      const n = [
        {
          name: "ensureSysStatusTable",
          run: () => e.ensureSysStatusTable(t)
        },
        {
          name: "ensureScheduledLeaseTable",
          run: () => e.ensureScheduledLeaseTable(t)
        },
        {
          name: "ensureDnsIpWorkspaceSchema",
          run: () => e.ensureDnsIpWorkspaceSchema(t)
        },
        {
          name: "ensureAuthFailuresTable",
          run: () => e.ensureAuthFailuresTable(t)
        },
        {
          name: "ensureCfDashboardCacheTable",
          run: () => e.ensureCfDashboardCacheTable(t)
        },
        {
          name: "ensureCfRuntimeCacheTable",
          run: () => e.ensureCfRuntimeCacheTable(t)
        }
      ], s = [{
        name: "ensureLogsBaseSchema",
        run: () => e.ensureLogsBaseSchema(t)
      }, {
        name: "ensureStatsHourlySchema",
        run: () => e.ensureStatsHourlySchema(t)
      }], i = a === "runtime-core" ? n : a === "logs-fts" ? [
        ...n,
        ...s,
        {
          name: "ensureLogsFtsSchema",
          run: () => e.ensureLogsFtsSchema(t)
        }
      ] : [...n, ...s], c = [];
      let l = {
        migratedRows: 0,
        droppedTriggers: 0,
        rebuilt: !1,
        recreated: !1
      };
      for (const d of i) {
        const u = await d.run();
        d.name === "ensureLogsFtsSchema" && $(u) && (l = {
          migratedRows: Math.max(0, Number(u.migratedRows) || 0),
          droppedTriggers: Math.max(0, Number(u.droppedTriggers) || 0),
          rebuilt: u.rebuilt === !0,
          recreated: u.recreated === !0
        }), c.push({
          name: d.name,
          ready: d.name === "ensureLogsFtsSchema" ? await e.isLogsFtsReady(t) : u === !0
        });
      }
      return te.LogsReadinessProbeCache.delete(t), {
        profile: a,
        runtimeTablesReady: n.every((d) => c.some((u) => u.name === d.name && u.ready === !0)),
        schemaReady: await e.hasLogsBaseTable(t),
        statsReady: await e.hasStatsHourlyTable(t),
        ftsReady: await e.isLogsFtsReady(t),
        ftsResult: l,
        steps: c
      };
    }
  };
}
function ch(o = {}, e = {}) {
  return {
    ...nh(o, e),
    ...oh(o, e),
    ...sh(o, e),
    ...ih(o, e)
  };
}
function lh() {
  const o = {
    createSummary(e = {}, t = "manual", r = {}) {
      return {
        ...e.summary,
        mode: t,
        deletedExpiredLogCount: 0,
        deletedExpiredLockCount: 0,
        deletedExpiredFetchCacheCount: 0,
        deletedExpiredProbeCacheCount: 0,
        deletedExpiredAuthFailureCount: 0,
        deletedExpiredDashboardCacheCount: 0,
        deletedExpiredRuntimeCacheCount: 0,
        deletedExpiredStatsHourlyCount: 0,
        rebuiltStatsHourly: !1,
        rebuiltLogsFts: !1,
        alignedStatsWindow: !1,
        optimizedDb: !1,
        migratedDnsIpPoolSourcesToKvCount: 0,
        clearedLegacyDnsIpPoolSourcesCount: 0,
        statsAlignStatus: r.alignStatsWindow ? "pending" : "skipped",
        statsAlignError: "",
        statsRebuildStatus: r.rebuildStatsHourly ? "pending" : "skipped",
        statsRebuildError: "",
        ftsRebuildStatus: r.rebuildLogsFts ? "pending" : r.rebuildLogsFtsDeferred ? "deferred" : "skipped",
        ftsRebuildRecovered: !1,
        ftsRebuildError: "",
        optimizeStatus: r.optimizeDb ? "pending" : r.optimizeDbDeferred ? "deferred" : "skipped",
        optimizeError: "",
        status: t === "scheduled" ? "skipped" : "success",
        reason: ""
      };
    },
    buildDeleteScopes(e, t = {}, r = {}, a) {
      return [
        [
          r.deleteExpiredLogs,
          "proxy_logs",
          "deletedExpiredLogCount",
          "deleteExpiredLogs",
          e.LOGS_TABLE,
          "timestamp < ?",
          [t.retentionCutoffMs]
        ],
        [
          r.deleteExpiredLocks,
          "sys_locks",
          "deletedExpiredLockCount",
          "deleteExpiredLocks",
          e.SCHEDULED_LOCKS_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredFetchCache,
          "dns_ip_pool_fetch_cache",
          "deletedExpiredFetchCacheCount",
          "deleteExpiredFetchCache",
          e.DNS_IP_POOL_FETCH_CACHE_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredProbeCache,
          "dns_ip_probe_cache",
          "deletedExpiredProbeCacheCount",
          "deleteExpiredProbeCache",
          e.DNS_IP_PROBE_CACHE_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredAuthFailures,
          "auth_failures",
          "deletedExpiredAuthFailureCount",
          "deleteExpiredAuthFailures",
          e.AUTH_FAILURES_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredDashboardCache,
          "cf_dashboard_cache",
          "deletedExpiredDashboardCacheCount",
          "deleteExpiredDashboardCache",
          e.CF_DASH_CACHE_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredRuntimeCache,
          "cf_runtime_cache",
          "deletedExpiredRuntimeCacheCount",
          "deleteExpiredRuntimeCache",
          e.CF_RUNTIME_CACHE_TABLE,
          "expires_at <= ?",
          [t.nowMs]
        ],
        [
          r.deleteExpiredStatsHourly,
          "proxy_stats_hourly",
          "deletedExpiredStatsHourlyCount",
          "deleteExpiredStatsHourly",
          e.STATS_HOURLY_TABLE,
          "bucket_date < ?",
          [t.statsRetentionBoundaryDate]
        ]
      ].filter(([n]) => n === !0).map(([, n, s, i, c, l, d]) => ({
        key: n,
        summaryKey: s,
        stepName: i,
        tableName: c,
        whereClause: l,
        bindParams: d,
        db: a
      }));
    },
    readChanges(e) {
      const t = Number(e?.meta?.changes ?? e?.changes ?? 0);
      return Number.isFinite(t) ? Math.max(0, Math.floor(t)) : 0;
    },
    async hasScopeRows(e) {
      return !!await e.db.prepare(`SELECT 1 AS present FROM ${e.tableName} WHERE ${e.whereClause} LIMIT 1`).bind(...e.bindParams).first();
    },
    async runBudgetedDeleteScopes(e = [], t = {}, r = async (n) => {
    }, a = {}) {
      const n = Number(a.startedAt) || H();
      let s = 0, i = "", c = [...e];
      for (; c.length > 0 && !i; ) {
        const u = [];
        for (const f of c) {
          if (s >= xa) {
            i = "row_limit";
            break;
          }
          if (H() - n >= Mr) {
            i = "time_limit";
            break;
          }
          await r(f.stepName);
          const m = Math.min(ls, xa - s), p = await f.db.prepare(`DELETE FROM ${f.tableName} WHERE rowid IN (SELECT rowid FROM ${f.tableName} WHERE ${f.whereClause} ORDER BY rowid LIMIT ?)`).bind(...f.bindParams, m).run(), g = o.readChanges(p);
          s += g, t[f.summaryKey] = Math.max(0, Number(t[f.summaryKey]) || 0) + g, g >= m && u.push(f);
        }
        c = u;
      }
      const l = [];
      for (const u of e) await o.hasScopeRows(u) && l.push(u.key);
      const d = Math.max(0, H() - n);
      return !i && l.length > 0 && (i = d >= Mr ? "time_limit" : s >= xa ? "row_limit" : ""), {
        hasMore: l.length > 0,
        remainingScopes: l,
        budget: {
          batchSize: ls,
          rowLimit: xa,
          timeLimitMs: Mr,
          processedRows: s,
          durationMs: d,
          exhaustedBy: i || null
        }
      };
    },
    async patchLogStatus(e, t, r, a, n, s, i = {}) {
      const c = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), l = String(a?.mode || i.mode || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", d = {
        schemaReady: !0,
        ftsReady: !0,
        statsReady: !0,
        categoryEnabled: !0
      };
      return (s.rebuildStatsHourly !== !0 || n.alignedStatsWindow === !0) && (d.statsUtcOffsetMinutes = a.statsUtcOffsetMinutes ?? a.utcOffsetMinutes), (n.rebuiltStatsHourly === !0 || n.alignedStatsWindow === !0) && (d.statsAlignedAt = c, d.statsAlignedWindowStartAt = new Date((l === "scheduled" ? a.statsStartTs : a.retentionCutoffMs) || a.retentionCutoffMs).toISOString(), d.statsAlignedWindowEndAt = new Date((l === "scheduled" ? a.statsEndTs : a.nowMs) || a.nowMs).toISOString()), l === "scheduled" && s.deleteExpiredLogs === !0 && Number(n.deletedExpiredLogCount) > 0 ? await e.bumpLogsRevision(r, d, i.ctx).catch(() => {
      }) : await pe(e.patchOpsStatus(r, { log: d }, i.ctx), "d1_tidy.patch_log_status", { mode: l }, null), c;
    }
  };
  return o;
}
function uh() {
  return {
    async readBoundedCount(o, e, t = "", r = []) {
      const a = String(t || "").trim(), n = `SELECT COUNT(*) AS total FROM (SELECT 1 FROM ${e}${a ? ` WHERE ${a}` : ""} LIMIT ${Oa + 1})`, s = await o.prepare(n).bind(...r).first(), i = Math.max(0, Number(s?.total ?? s?.count) || 0);
      return {
        count: Math.min(Oa, i),
        countIsLowerBound: i >= Oa,
        exceedsLimit: i > Oa
      };
    },
    buildContext(o = {}, e = {}) {
      const t = String(e.mode || "manual").trim().toLowerCase() === "scheduled" ? "scheduled" : "manual", r = nt(e.maintenanceMode, t), a = e.scheduledNow instanceof Date ? new Date(e.scheduledNow.getTime()) : new Date(e.scheduledNow || H()), n = Number(e.nowMs) || (t === "scheduled" ? a.getTime() : H()), s = le(o.logRetentionDays, k.Defaults.LogRetentionDays, 1, k.Defaults.LogRetentionDaysMax), i = Math.max(0, n - s * 24 * 60 * 60 * 1e3), c = Oe(o.scheduleUtcOffsetMinutes), l = $(e.dayWindow) ? e.dayWindow : st(a, o.scheduleUtcOffsetMinutes);
      return {
        mode: t,
        maintenanceMode: r,
        runtimeConfig: o,
        scheduledNow: a,
        nowTimestamp: n,
        retentionDays: s,
        retentionCutoffMs: i,
        utcOffsetMinutes: c,
        dayWindow: l,
        statsBucketDate: String(e.statsBucketDate || l?.dateKey || "").trim(),
        statsStartTs: Number(e.statsStartTs ?? l?.startTs) || 0,
        statsEndTs: Number(e.statsEndTs ?? l?.endTs) || 0,
        statsUtcOffsetMinutes: Oe(e.statsUtcOffsetMinutes ?? l?.utcOffsetMinutes ?? o.scheduleUtcOffsetMinutes),
        previousScheduledState: $(e.previousScheduledState) ? e.previousScheduledState : {},
        previousD1State: null,
        lastFtsRebuildAt: "",
        lastOptimizeAt: ""
      };
    },
    attachPreviousState(o, e, t = null) {
      const r = o.getPreviousD1TidyState(e.previousScheduledState, t), a = typeof r.lastFtsRebuildAt == "string" ? r.lastFtsRebuildAt : "", n = typeof r.lastOptimizeAt == "string" ? r.lastOptimizeAt : "";
      return {
        ...e,
        previousD1State: r,
        lastFtsRebuildAt: a,
        lastOptimizeAt: n || (typeof r.lastVacuumAt == "string" ? r.lastVacuumAt : "")
      };
    },
    async readFacts(o, e, t, r) {
      const a = await this.readBoundedCount(e, o.LOGS_TABLE, "timestamp < ?", [r.retentionCutoffMs]), n = await this.readBoundedCount(e, o.LOGS_TABLE, "timestamp >= ?", [r.retentionCutoffMs]), s = await this.readBoundedCount(e, o.SCHEDULED_LOCKS_TABLE, "expires_at <= ?", [r.nowTimestamp]), i = await this.readBoundedCount(e, o.DNS_IP_POOL_FETCH_CACHE_TABLE, "expires_at <= ?", [r.nowTimestamp]), c = await this.readBoundedCount(e, o.DNS_IP_PROBE_CACHE_TABLE, "expires_at <= ?", [r.nowTimestamp]), l = await this.readBoundedCount(e, o.AUTH_FAILURES_TABLE, "expires_at <= ?", [r.nowTimestamp]), d = await this.readBoundedCount(e, o.CF_DASH_CACHE_TABLE, "expires_at <= ?", [r.nowTimestamp]), u = await this.readBoundedCount(e, o.CF_RUNTIME_CACHE_TABLE, "expires_at <= ?", [r.nowTimestamp]), f = await this.readBoundedCount(e, o.STATS_HOURLY_TABLE), m = ot(r.retentionCutoffMs, r.utcOffsetMinutes).dateKey, p = await this.readBoundedCount(e, o.STATS_HOURLY_TABLE, "bucket_date < ?", [m]), g = await this.readBoundedCount(e, o.DNS_IP_POOL_ITEMS_TABLE), h = await this.readBoundedCount(e, o.DNS_IP_POOL_SOURCES_TABLE), y = await this.readBoundedCount(e, o.SYS_STATUS_TABLE), _ = await o.getOpsStatusSection({
        db: e,
        kv: t
      }, "log");
      return {
        deletedExpiredLogCount: a.count,
        preservedLogCount: n.count,
        preservedLogCountExceedsLimit: n.exceedsLimit,
        deletedExpiredLockCount: s.count,
        deletedExpiredFetchCacheCount: i.count,
        deletedExpiredProbeCacheCount: c.count,
        deletedExpiredAuthFailureCount: l.count,
        deletedExpiredDashboardCacheCount: d.count,
        deletedExpiredRuntimeCacheCount: u.count,
        deletedExpiredStatsHourlyCount: p.count,
        statsRetentionBoundaryDate: m,
        statsHourlyRowCount: f.count,
        dnsIpPoolItemCount: g.count,
        dnsIpPoolSourceCount: h.count,
        sysStatusCount: y.count,
        statsUtcOffsetMinutes: o.getStatsUtcOffsetMinutesFromStatus(_),
        countLowerBounds: {
          proxy_logs: a.countIsLowerBound,
          proxy_logs_retained: n.countIsLowerBound,
          proxy_logs_fts: n.countIsLowerBound,
          sys_locks: s.countIsLowerBound,
          dns_ip_pool_fetch_cache: i.countIsLowerBound,
          dns_ip_probe_cache: c.countIsLowerBound,
          auth_failures: l.countIsLowerBound,
          cf_dashboard_cache: d.countIsLowerBound,
          cf_runtime_cache: u.countIsLowerBound,
          proxy_stats_hourly: f.countIsLowerBound || p.countIsLowerBound,
          dns_ip_pool_items: g.countIsLowerBound,
          sys_status: y.countIsLowerBound
        },
        ftsReady: r.schemaStatus?.schemaReady === !0 || await o.isLogsFtsReady(e),
        d1DnsIpPoolSources: await o.getDnsIpPoolSourcesFromDb(e, { schemaReady: r.schemaStatus?.schemaReady === !0 }),
        kvDnsIpPoolSources: []
      };
    },
    buildSourcePolicy(o = []) {
      return {
        dnsIpPoolSourceAction: Array.isArray(o) && o.length > 0 ? "preserve_d1_primary" : "noop",
        skipDnsIpPoolSourceCleanup: !0
      };
    },
    buildFlags(o, e, t, r) {
      const a = t.deletedExpiredLogCount > 0, n = Zf(e.maintenanceMode, e.mode), s = o.shouldRunLogsFtsRebuild(e.lastFtsRebuildAt, { nowMs: e.nowTimestamp }), i = (!t.ftsReady || n || a) && s, c = t.preservedLogCount > ju || t.preservedLogCountExceedsLimit === !0, l = i && !c, d = n ? !0 : a && o.shouldRunLogsOptimize(e.lastOptimizeAt, { nowMs: e.nowTimestamp }), u = n || t.statsUtcOffsetMinutes !== e.utcOffsetMinutes;
      return {
        deleteExpiredLogs: a,
        deleteExpiredLocks: t.deletedExpiredLockCount > 0,
        deleteExpiredFetchCache: t.deletedExpiredFetchCacheCount > 0,
        deleteExpiredProbeCache: t.deletedExpiredProbeCacheCount > 0,
        deleteExpiredAuthFailures: t.deletedExpiredAuthFailureCount > 0,
        deleteExpiredDashboardCache: t.deletedExpiredDashboardCacheCount > 0,
        deleteExpiredRuntimeCache: t.deletedExpiredRuntimeCacheCount > 0,
        deleteExpiredStatsHourly: t.deletedExpiredStatsHourlyCount > 0,
        rebuildStatsHourly: u,
        rebuildLogsFts: l,
        rebuildLogsFtsDeferred: i && !l,
        ftsRebuildDeferredReason: c ? "deferred_size_guard" : "",
        rebuildLogsFtsForceRecreate: !1,
        optimizeDb: d,
        optimizeDbDeferred: e.mode === "scheduled" && a && d !== !0,
        alignStatsWindow: u,
        rebuildDailyStats: !1,
        processDnsIpPoolSources: !1
      };
    },
    buildPreview(o, e, t, r) {
      const a = [], n = ff(e.d1DnsIpPoolSources);
      be(a, e.deletedExpiredLogCount > 0, "proxy_logs", "超保留期 proxy_logs 日志", [], e.deletedExpiredLogCount, `只会删除早于 ${new Date(o.retentionCutoffMs).toISOString()} 的日志。`), be(a, e.deletedExpiredLockCount > 0, "sys_locks", "过期 sys_locks 定时租约", [], e.deletedExpiredLockCount, "只会删除 expires_at 已过期的租约记录。"), be(a, e.deletedExpiredFetchCacheCount > 0, "dns_ip_pool_fetch_cache", "过期 dns_ip_pool_fetch_cache 聚合缓存", [], e.deletedExpiredFetchCacheCount, "只会删除 expires_at 已过期的 API 抓取聚合缓存。"), be(a, e.deletedExpiredProbeCacheCount > 0, "dns_ip_probe_cache", "过期 dns_ip_probe_cache 探测缓存", [], e.deletedExpiredProbeCacheCount, "只会删除 expires_at 已过期的探测缓存。"), be(a, e.deletedExpiredAuthFailureCount > 0, "auth_failures", "过期 auth_failures 登录失败计数", [], e.deletedExpiredAuthFailureCount, "只会删除 expires_at 已过期的登录失败计数。"), be(a, e.deletedExpiredDashboardCacheCount > 0, "cf_dashboard_cache", "过期 cf_dashboard_cache 仪表盘缓存", [], e.deletedExpiredDashboardCacheCount, "只会删除 expires_at 已过期的仪表盘缓存。"), be(a, e.deletedExpiredRuntimeCacheCount > 0, "cf_runtime_cache", "过期 cf_runtime_cache 运行缓存", [], e.deletedExpiredRuntimeCacheCount, "只会删除 expires_at 已过期的运行缓存。"), be(a, e.deletedExpiredStatsHourlyCount > 0, "proxy_stats_hourly_expired", "过期 proxy_stats_hourly 日期桶", [], e.deletedExpiredStatsHourlyCount, `只删除早于边界日 ${e.statsRetentionBoundaryDate} 的统计桶。`);
      const s = [
        ft("proxy_stats_hourly", "proxy_stats_hourly 统计表", [], {
          count: Math.max(1, e.statsHourlyRowCount),
          note: r.rebuildStatsHourly ? `会清空当前统计（当前行数 ${e.statsHourlyRowCount}），并从后续新日志重新累计，不扫描历史日志。` : `保留当前统计，仅分页删除保留期边界前的日期桶（当前行数 ${e.statsHourlyRowCount}）。`
        }),
        ft("proxy_logs_fts", "proxy_logs_fts 全文索引", [], {
          count: Math.max(1, e.preservedLogCount),
          note: r.ftsRebuildDeferredReason === "deferred_size_guard" ? "基础日志超过 10000 行，本轮不会自动 rebuild。" : e.ftsReady ? "仅在无清理积压、预算有余量且满足最小间隔时重建。" : "当前未检测到 FTS 表，整理时会按资源预算决定是否补建。"
        }),
        ft("scheduled_d1_tidy", "scheduled.d1Tidy 运行状态", ["scheduled.d1Tidy"], {
          count: 1,
          note: "整理完成后会写入一份新的运行状态摘要。"
        })
      ], i = [
        ft("proxy_logs_retained", "保留期内 proxy_logs 日志", [], {
          count: e.preservedLogCount,
          note: `会保留最近 ${o.retentionDays} 天的日志。`
        }),
        ft("dns_ip_pool_items", "dns_ip_pool_items 共享 IP 池", [], {
          count: e.dnsIpPoolItemCount,
          note: "不会删除 dns_ip_pool_items。"
        }),
        ft("sys_status", "sys_status 运行状态", [], {
          count: e.sysStatusCount,
          note: "不会删除 sys_status 中的有效运行状态。"
        })
      ];
      be(i, e.d1DnsIpPoolSources.length > 0, "dns_ip_pool_sources_d1_primary", "dns_ip_pool_sources 主数据", n, e.d1DnsIpPoolSources.length, "dns_ip_pool_sources 现在是正式主数据，本次不会迁回 KV，也不会清空该表。");
      const c = { proxy_stats_hourly_expired: "proxy_stats_hourly" };
      for (const u of [
        ...a,
        ...s,
        ...i
      ]) {
        const f = c[u.key] || u.key;
        e.countLowerBounds?.[f] === !0 && (u.countIsLowerBound = !0);
      }
      const l = [], d = Math.max(0, Number(o.logQueuePendingCount) || 0);
      return d > 0 && l.push(`执行前会先尝试 flush ${d} 条内存日志，再开始清理 D1。`), l.push(o.maintenanceMode === "full" ? "当前为 full 维护模式；统计会清空后重新累计，FTS 与 optimize 仍受大小、积压、间隔和时间预算约束。" : "当前为 smart 维护模式，只在检测到必要条件且预算允许时执行较重的统计、FTS 与 optimize。"), a.length === 0 && l.push(o.mode === "scheduled" ? "当前定时 D1 维护没有检测到需要删除的旧数据，本轮会按计划检查统计与索引维护。" : "当前没有检测到需要删除的 D1 旧数据；本次主要会执行统计表与 FTS 维护。"), {
        scope: "d1",
        fieldGroups: [],
        deleteGroups: a,
        rewriteGroups: s,
        preserveGroups: i,
        warnings: l
      };
    },
    buildSummary(o, e, t, r = {}) {
      return {
        mode: o.mode,
        maintenanceMode: o.maintenanceMode,
        logRetentionDays: o.retentionDays,
        retentionCutoffAt: new Date(o.retentionCutoffMs).toISOString(),
        deletedExpiredLogCount: e.deletedExpiredLogCount,
        preservedLogCount: e.preservedLogCount,
        deletedExpiredLockCount: e.deletedExpiredLockCount,
        deletedExpiredFetchCacheCount: e.deletedExpiredFetchCacheCount,
        deletedExpiredProbeCacheCount: e.deletedExpiredProbeCacheCount,
        deletedExpiredAuthFailureCount: e.deletedExpiredAuthFailureCount,
        deletedExpiredDashboardCacheCount: e.deletedExpiredDashboardCacheCount,
        deletedExpiredRuntimeCacheCount: e.deletedExpiredRuntimeCacheCount,
        deletedExpiredStatsHourlyCount: e.deletedExpiredStatsHourlyCount,
        rebuiltStatsHourly: r.rebuildStatsHourly === !0,
        rebuiltLogsFts: r.rebuildLogsFts === !0,
        alignedStatsWindow: r.alignStatsWindow === !0,
        migratedDnsIpPoolSourcesToKvCount: 0,
        clearedLegacyDnsIpPoolSourcesCount: 0,
        preservedDnsIpPoolItemCount: e.dnsIpPoolItemCount,
        preservedDnsIpPoolSourceCount: e.dnsIpPoolSourceCount,
        preservedSysStatusCount: e.sysStatusCount,
        logQueuePendingCount: Math.max(0, Number(o.logQueuePendingCount) || 0),
        dnsIpPoolSourceAction: t.dnsIpPoolSourceAction,
        lastFtsRebuildAt: o.lastFtsRebuildAt,
        lastOptimizeAt: o.lastOptimizeAt
      };
    }
  };
}
var dh = Object.freeze({
  PREFIX: "node:",
  CONFIG_KEY: "sys:theme",
  NODES_INDEX_KEY: "sys:nodes_index:v1",
  NODES_SUMMARY_INDEX_KEY: "sys:nodes_index_full:v2",
  ADMIN_INDEX_UPLOAD_PREFIX: Au,
  ADMIN_ACTIVE_INDEX_KEY: Cu,
  LEGACY_OPS_STATUS_KEY: "sys:ops_status:v1",
  LEGACY_SCHEDULED_LOCK_KEY: "sys:scheduled_lock:v1",
  WORKER_PLACEMENT_REGION_OVERRIDE_PREFIX: "sys:worker_placement_region:v1:",
  CONFIG_SNAPSHOTS_KEY: "sys:config_snapshots:v1",
  CONFIG_META_KEY: "sys:config_meta:v1",
  CONFIG_SNAPSHOTS_META_KEY: "sys:config_snapshots_meta:v1",
  NODES_INDEX_META_KEY: "sys:nodes_index_meta:v1",
  LEGACY_DNS_IP_POOL_SOURCES_KEY: "sys:dns_ip_pool_sources:v1",
  DNS_RECORD_HISTORY_PREFIX: "sys:dns_record_history:v1:",
  LEGACY_TELEGRAM_ALERT_STATE_KEY: "sys:telegram_alert_state:v1",
  SYS_STATUS_TABLE: "sys_status",
  D1_SCHEMA_META_TABLE: "d1_schema_meta",
  SCHEDULED_LOCKS_TABLE: "sys_locks",
  SCHEDULED_LOCK_SCOPE: "scheduled",
  LOGS_TABLE: "proxy_logs",
  LOGS_FTS_TABLE: "proxy_logs_fts",
  LOGS_FTS_INSERT_TRIGGER: "proxy_logs_fts_ai",
  STATS_HOURLY_TABLE: "proxy_stats_hourly",
  AUTH_FAILURES_TABLE: "auth_failures",
  CF_DASH_CACHE_TABLE: "cf_dashboard_cache",
  CF_RUNTIME_CACHE_TABLE: "cf_runtime_cache",
  DNS_IP_POOL_ITEMS_TABLE: "dns_ip_pool_items",
  DNS_IP_POOL_SOURCES_TABLE: "dns_ip_pool_sources",
  DNS_IP_POOL_FETCH_CACHE_TABLE: "dns_ip_pool_fetch_cache",
  DNS_IP_PROBE_CACHE_TABLE: "dns_ip_probe_cache",
  OPS_STATUS_DB_SCOPE_ROOT: "ops_status:root",
  TELEGRAM_ALERT_STATE_DB_SCOPE: "telegram_alert_state",
  OPS_STATUS_SECTION_SCOPES: Object.freeze({
    log: "ops_status:log",
    scheduled: "ops_status:scheduled",
    dnsIpPool: "ops_status:dns_ip_pool"
  }),
  LEGACY_OPS_STATUS_SECTION_KEYS: Object.freeze({
    log: "sys:ops_status:log:v1",
    scheduled: "sys:ops_status:scheduled:v1",
    dnsIpPool: "sys:ops_status:dns_ip_pool:v1"
  })
});
function fh(o = {}) {
  const { nodeRepository: e } = o;
  return {
    async getNodesList(t, r) {
      const a = e.getKV(t);
      if (!a) return [];
      const n = Se(a);
      if (n.NodesListCache && n.NodesListCache.exp > H()) return n.NodesListCache.data;
      const s = await e.getNodesSummaryIndex(a, { ctx: r });
      if (Array.isArray(s)) return s;
      const i = await e.rebuildNodeIndexesFromKv(a, { ctx: r });
      return Array.isArray(i?.summaries) ? i.summaries : [];
    },
    async getNodesListStrict(t, r) {
      const a = e.getKV(t);
      if (!a) return [];
      const n = Se(a);
      if (n.NodesListCache && n.NodesListCache.exp > H()) return n.NodesListCache.data;
      const s = await e.getNodesSummaryIndexStrict(a, { ctx: r });
      if (Array.isArray(s)) return s;
      const i = await e.rebuildNodeIndexesFromKvStrict(a, { ctx: r });
      return Array.isArray(i?.summaries) ? i.summaries : [];
    },
    async invalidateList(t, r = null) {
      const a = e.getKV(r), n = Se(a);
      n.NodesListCache = null, n.NodesIndexCache = null, cr(a);
    },
    maybeCleanup(t = null) {
      const r = t ? Se(e.getKV(t)) : yt.current(), a = H(), n = r.CleanupState;
      if (a - (n.lastRunAt || 0) < k.Defaults.CleanupMinIntervalMs) return;
      n.lastRunAt = a;
      const s = k.Defaults.CleanupBudgetMs, i = k.Defaults.CleanupChunkSize, c = n.iterators || (n.iterators = {
        node: null,
        playbackRoute: null,
        crypto: null,
        rate: null,
        log: null,
        playbackInfo: null,
        failover: null,
        progress: null,
        monthlyTraffic: null
      }), l = a, d = (u, f, m, p = c, g = (h) => u.delete(h)) => {
        let h = p[m];
        h || (h = u.entries(), p[m] = h);
        let y = 0;
        for (; y < i && (y === 0 || H() - l < s); ) {
          const _ = h.next();
          if (_.done) {
            p[m] = null;
            break;
          }
          y += 1;
          const [S, T] = _.value;
          u.has(S) && f(T, a) && g(S);
        }
      };
      if (n.phase === 0)
        d(r.NodeCache, (u) => u?.exp && u.exp < a, "node", r.CleanupIterators), n.phase = 1;
      else if (n.phase === 1)
        d(r.PlaybackRouteHotCache, (u) => !u || Number(u.expiresAt) <= a, "playbackRoute", r.CleanupIterators), n.phase = 2;
      else if (n.phase === 2)
        d(te.CryptoKeyCache, (u) => u?.exp && u.exp < a, "crypto"), n.phase = 3;
      else if (n.phase === 3)
        d(We.RateLimitCache, (u) => !u || u.resetAt < a, "rate"), n.phase = 4;
      else if (n.phase === 4) n.phase = 5;
      else if (n.phase === 5)
        d(te.PlaybackInfoResponseCache, (u) => !u || (Number(u.expiresAt) || 0) <= a || !oi(u, wo), "playbackInfo", c), n.phase = 6;
      else if (n.phase === 6)
        d(te.ProxyFailoverStateCache, (u) => {
          if (!u || typeof u != "object") return !0;
          if (u.failingTargets instanceof Map)
            for (const [y, _] of u.failingTargets) Number(_) <= a && u.failingTargets.delete(y);
          const f = Number(u.preferredTargetExpiresAt) > a, m = u.failingTargets instanceof Map && u.failingTargets.size > 0, p = !!u.inFlightProbe && Number(u.inFlightProbe.expiresAt) > a, g = Number(u.lastProbeResult?.completedAt) || 0, h = !!u.lastProbeResult && g + k.Defaults.HedgePreferredTtlSec * 1e3 > a;
          return !f && !m && !p && !h;
        }, "failover"), n.phase = 7;
      else if (n.phase === 7) {
        const u = Math.max(3e4, Math.max(1, Number(k.Defaults.VideoProgressForwardIntervalSec) || 1) * 2e4);
        d(te.PlaybackProgressRelay, (f) => {
          if (!f || f.pendingSnapshot || f.activeFlushPromise) return !f;
          const m = Number(f.terminalTombstoneUntil) || 0;
          if (m > 0) return m < a;
          const p = Number(f.lastTouchedAt || f.lastForwardAt) || 0;
          return p > 0 && p + u <= a;
        }, "progress", c, tr), n.phase = 8;
      } else
        d(te.DashboardMonthlyTrafficCache, (u) => !u || (Number(u.staleUntil) || 0) <= a, "monthlyTraffic"), n.phase = 0;
    }
  };
}
function mh(o = {}, e = {}) {
  return {
    normalizeNodeIndex(t = []) {
      return [...new Set((Array.isArray(t) ? t : []).map((r) => String(r || "").toLowerCase().trim()).filter(Boolean))];
    },
    normalizeNodeSummaryPayload(t, r = {}) {
      if (!$(r)) return null;
      const a = String(t || r.name || "").toLowerCase().trim();
      if (!a) return null;
      const n = e.normalizeLines(r.lines, r.target, r.port).slice(0, zn);
      if (!n.length) return null;
      const s = e.resolveActiveLineId(r.activeLineId, n, Array.isArray(r.lines) ? r.lines : [], r.port), i = nr(r.entryMode);
      return {
        name: a,
        cacheRevision: oo(a, r),
        displayName: String(r.displayName ?? ""),
        entryMode: i,
        hostPrefixCnameTarget: i === "host_prefix" ? jt(r.hostPrefixCnameTarget) : "",
        secret: i === "host_prefix" ? "" : String(r.secret ?? ""),
        tag: $r(r.tags, r.tag)[0] || "",
        tags: $r(r.tags, r.tag),
        tagColor: String(r.tagColor ?? ""),
        remark: String(r.remark ?? ""),
        tmdbAggregationEnabled: r.tmdbAggregationEnabled === !0,
        lines: n.map((c) => ({
          id: String(c.id || "").trim(),
          name: String(c.name || "").trim(),
          target: String(c.target || "").trim()
        })),
        activeLineId: s,
        playbackInfoMode: Dr(r.playbackInfoMode),
        mediaAuthMode: Bt(r.mediaAuthMode),
        realClientIpMode: Nr(r.realClientIpMode),
        hedgeProbePath: la(r.hedgeProbePath),
        routingDecisionMode: xr(r.routingDecisionMode),
        mainVideoStreamMode: cn(r.mainVideoStreamMode ?? r.wangpanDirectMode ?? r.wangpanMode)
      };
    },
    buildComparableNodeSummary(t = {}) {
      return e.normalizeNodeSummaryPayload(t?.name, t);
    },
    areNodeSummariesEquivalent(t = {}, r = {}) {
      return ee(e.buildComparableNodeSummary(t)) === ee(e.buildComparableNodeSummary(r));
    },
    hasLegacyNodeMirrorFields(t = {}) {
      return $(t) ? Object.prototype.hasOwnProperty.call(t, "headers") || Object.prototype.hasOwnProperty.call(t, "target") || Object.prototype.hasOwnProperty.call(t, "port") || Object.prototype.hasOwnProperty.call(t, "schemaVersion") || Object.prototype.hasOwnProperty.call(t, "createdAt") || Object.prototype.hasOwnProperty.call(t, "updatedAt") || Object.prototype.hasOwnProperty.call(t, "remarkColor") || Object.prototype.hasOwnProperty.call(t, "wangpanDirectMode") || Object.prototype.hasOwnProperty.call(t, "wangpanMode") || [...Po, ...xo].some((r) => Object.prototype.hasOwnProperty.call(t, r)) ? !0 : (Array.isArray(t.lines) ? t.lines : []).some((r) => $(r) ? Object.prototype.hasOwnProperty.call(r, "port") || Object.prototype.hasOwnProperty.call(r, "latencyMs") || Object.prototype.hasOwnProperty.call(r, "latencyUpdatedAt") : !1) : !1;
    },
    summaryEntryRequiresNodeEntityRebuild(t = {}) {
      if (!$(t) || e.hasLegacyNodeMirrorFields(t)) return !0;
      const r = Array.isArray(t.lines) ? t.lines : [], a = e.normalizeLines(r, t.target, t.port);
      if (!a.length || r.length !== a.length) return !0;
      for (let n = 0; n < a.length; n += 1) {
        const s = r[n], i = a[n];
        if (!$(s) || !$(i) || String(s.target || "").trim() !== String(i.target || "").trim()) return !0;
      }
      return String(t.activeLineId || "").trim() !== e.resolveActiveLineId(t.activeLineId, a, r, t.port);
    },
    buildNodeSummary(t, r = {}, a = {}) {
      const n = String(t || r.name || "").toLowerCase().trim();
      if (!n || !$(r)) return {
        summary: null,
        changed: !1,
        legacyMirrorDetected: !1
      };
      const s = e.normalizeNode(n, r, a), i = e.normalizeNodeSummaryPayload(n, s.data);
      if (!i) return {
        summary: null,
        changed: !0,
        legacyMirrorDetected: e.hasLegacyNodeMirrorFields(r)
      };
      const c = e.normalizeNodeSummaryPayload(n, r), l = e.hasLegacyNodeMirrorFields(r);
      return {
        summary: i,
        changed: l || !e.areNodeSummariesEquivalent(c, i),
        legacyMirrorDetected: l
      };
    },
    normalizeNodeSummaryIndex(t = []) {
      const r = [], a = /* @__PURE__ */ new Set();
      let n = !1, s = !1, i = !1;
      for (const c of Array.isArray(t) ? t : []) {
        if (!$(c)) {
          n = !0, i = !0;
          continue;
        }
        const l = String(c.name || "").trim(), d = l.toLowerCase();
        if (!d || a.has(d)) {
          n = !0, i = !0;
          continue;
        }
        const { name: u, ...f } = c, m = e.buildNodeSummary(d, f);
        if (!m.summary) {
          n = !0, i = !0;
          continue;
        }
        (m.changed || l !== d) && (n = !0), m.legacyMirrorDetected && (s = !0), e.summaryEntryRequiresNodeEntityRebuild(f) && (i = !0), r.push(m.summary), a.add(d);
      }
      return {
        nodes: r,
        changed: n,
        legacyMirrorDetected: s,
        requiresRebuild: i
      };
    },
    primeNodeSummaryCaches(t = [], r = null) {
      const a = Se(r), n = Array.isArray(t) ? t.filter((i) => $(i) && i.name) : [], s = e.normalizeNodeIndex(n.map((i) => i.name));
      return a.NodesListCache = {
        data: n.map((i) => ({ ...i })),
        exp: H() + 6e4
      }, a.NodesIndexCache = {
        data: s,
        exp: H() + 6e4
      }, n;
    },
    async getNodesSummaryIndex(t, r = {}) {
      if (!t) return null;
      const a = Se(t);
      if (r.useCache !== !1 && a.NodesListCache?.exp > H() && Array.isArray(a.NodesListCache.data)) return a.NodesListCache.data;
      const n = a.NodesRevisionCacheGeneration;
      let s = null;
      try {
        s = await t.get(e.NODES_SUMMARY_INDEX_KEY, { type: "json" });
      } catch {
        return null;
      }
      if (a.NodesRevisionCacheGeneration !== n) return Array.isArray(s) ? e.normalizeNodeSummaryIndex(s).nodes : null;
      if (!Array.isArray(s)) return null;
      const i = e.normalizeNodeSummaryIndex(s);
      if (i.requiresRebuild === !0) {
        const c = await e.rebuildNodeIndexesFromKv(t, { ctx: r.ctx });
        return Array.isArray(c?.summaries) ? c.summaries : [];
      }
      return a.NodesRevisionCacheGeneration === n ? e.primeNodeSummaryCaches(i.nodes, t) : i.nodes;
    },
    async getNodesSummaryIndexStrict(t, r = {}) {
      if (!t) return null;
      const a = Se(t);
      if (r.useCache !== !1 && a.NodesListCache?.exp > H() && Array.isArray(a.NodesListCache.data)) return a.NodesListCache.data;
      const n = a.NodesRevisionCacheGeneration, s = await xe(t, e.NODES_SUMMARY_INDEX_KEY, { type: "json" });
      if (a.NodesRevisionCacheGeneration !== n) return Array.isArray(s) ? e.normalizeNodeSummaryIndex(s).nodes : [];
      if (!Array.isArray(s)) {
        const c = await e.rebuildNodeIndexesFromKvStrict(t, { ctx: r.ctx });
        return Array.isArray(c?.summaries) ? c.summaries : [];
      }
      const i = e.normalizeNodeSummaryIndex(s);
      if (i.requiresRebuild === !0) {
        const c = await e.rebuildNodeIndexesFromKvStrict(t, { ctx: r.ctx });
        return Array.isArray(c?.summaries) ? c.summaries : [];
      }
      return a.NodesRevisionCacheGeneration === n ? e.primeNodeSummaryCaches(i.nodes, t) : i.nodes;
    },
    async loadNodeSummariesForMutation(t, r = {}) {
      const a = await t.get(e.NODES_SUMMARY_INDEX_KEY, { type: "json" });
      if (Array.isArray(a)) {
        const n = e.normalizeNodeSummaryIndex(a);
        if (n.requiresRebuild !== !0) return n.nodes;
      }
      return (await e.loadAllNodeEntitiesFromKvStrict(t, { ctx: r.ctx })).map((n) => e.buildNodeSummary(n?.name, n).summary).filter(Boolean);
    },
    async commitNodesSummaryIndexMutation(t, r = {}) {
      const { kv: a, ctx: n, syncLegacyIndex: s = !1 } = r, i = e.normalizeNodeSummaryIndex(t).nodes, c = e.normalizeNodeIndex(i.map((g) => g.name)), l = e.buildNodesIndexMeta(c, i), d = await e.readRevisionMeta(a, e.NODES_INDEX_META_KEY, {
        count: 0,
        indexHash: "",
        fullIndexHash: ""
      }), u = [];
      (d.fullIndexHash !== l.fullIndexHash || !d.revision) && u.push(a.put(e.NODES_SUMMARY_INDEX_KEY, JSON.stringify(i))), s !== !1 && (d.indexHash !== l.indexHash || !d.revision) && u.push(a.put(e.NODES_INDEX_KEY, JSON.stringify(c)));
      const f = d.indexHash !== l.indexHash || d.fullIndexHash !== l.fullIndexHash || Number(d.count) !== Number(l.count) || !d.revision;
      if (u.length > 0) {
        const g = Promise.all(u);
        n && n.waitUntil(g), await g;
      }
      if (f) {
        const g = a.put(e.NODES_INDEX_META_KEY, JSON.stringify(l));
        n && n.waitUntil(g), await g;
      }
      const m = e.primeNodeSummaryCaches(i, a), p = f ? l : d;
      return Os(p.revision, a), {
        summaries: m,
        meta: p
      };
    },
    async persistNodesSummaryIndex(t, r = {}) {
      const { kv: a, ctx: n, syncLegacyIndex: s = !1 } = r, i = e.normalizeNodeSummaryIndex(t).nodes;
      if (!a) {
        const c = e.primeNodeSummaryCaches(i, a);
        return cr(a), c;
      }
      return await wr(async () => (await e.commitNodesSummaryIndexMutation(i, {
        kv: a,
        ctx: n,
        syncLegacyIndex: s
      })).summaries, a);
    },
    async listNodeEntityKeys(t) {
      return (await e.listKvKeys(t, { prefix: e.PREFIX })).map((r) => String(r || "").replace(e.PREFIX, "").toLowerCase().trim()).filter(Boolean);
    },
    async listNodeEntityKeysStrict(t) {
      return (await e.listKvKeysStrict(t, { prefix: e.PREFIX })).map((r) => String(r || "").replace(e.PREFIX, "").toLowerCase().trim()).filter(Boolean);
    },
    async loadAllNodeEntitiesFromKv(t, r = {}) {
      const { ctx: a } = r;
      return t ? (await Xr(await e.listNodeEntityKeys(t), k.Defaults.NodesReadConcurrency, async (n) => {
        try {
          const s = await t.get(`${e.PREFIX}${n}`, { type: "json" });
          if (!s) return null;
          const i = e.normalizeNode(n, s);
          if (i.changed && !Qe(n, i.data)) {
            const c = t.put(`${e.PREFIX}${n}`, JSON.stringify(i.data));
            a ? a.waitUntil(c) : await c;
          }
          return {
            name: n,
            ...i.data
          };
        } catch {
          return null;
        }
      })).filter(Boolean) : [];
    },
    async loadAllNodeEntitiesFromKvStrict(t, r = {}) {
      return t ? (await Xr(await e.listNodeEntityKeysStrict(t), k.Defaults.NodesReadConcurrency, async (a) => {
        const n = await xe(t, `${e.PREFIX}${a}`, { type: "json" });
        return n ? {
          name: a,
          ...e.normalizeNode(a, n).data
        } : null;
      })).filter(Boolean) : [];
    },
    async rebuildNodeIndexesFromKv(t, r = {}) {
      const { ctx: a, syncLegacyIndex: n = !1 } = r;
      return t ? await wr(async () => {
        const s = await e.loadAllNodeEntitiesFromKvStrict(t, { ctx: a }), i = s.map((l) => e.buildNodeSummary(l?.name, l).summary).filter(Boolean), c = await e.commitNodesSummaryIndexMutation(i, {
          kv: t,
          ctx: a,
          syncLegacyIndex: n
        });
        return {
          index: e.normalizeNodeIndex(c.summaries.map((l) => l?.name)),
          summaries: c.summaries,
          nodes: s
        };
      }, t) : {
        index: [],
        summaries: [],
        nodes: []
      };
    },
    async rebuildNodeIndexesFromKvStrict(t, r = {}) {
      if (!t) return {
        index: [],
        summaries: [],
        nodes: []
      };
      const a = Se(t), n = a.NodesRevisionCacheGeneration, s = await e.loadAllNodeEntitiesFromKvStrict(t, r), i = s.map((l) => e.buildNodeSummary(l?.name, l).summary).filter(Boolean), c = a.NodesRevisionCacheGeneration === n ? e.primeNodeSummaryCaches(i, t) : i;
      return {
        index: e.normalizeNodeIndex(c.map((l) => l?.name)),
        summaries: c,
        nodes: s
      };
    },
    async upsertNodeSummaryEntry(t, r, a = {}) {
      const { kv: n, ctx: s } = a;
      if (!n) return null;
      const i = String(t || "").toLowerCase().trim();
      if (!i || Qe(i, r)) return null;
      const c = e.buildNodeSummary(i, r).summary;
      if (!c) return null;
      const l = Se(n), d = l.NodesListCache?.exp > H() && Array.isArray(l.NodesListCache.data) ? l.NodesListCache.data.find((u) => String(u?.name || "").toLowerCase().trim() === i) : null;
      return d && e.areNodeSummariesEquivalent(d, c) ? d : await wr(async () => {
        const u = await e.loadNodeSummariesForMutation(n, { ctx: s });
        let f = !1;
        const m = u.map((p) => String(p?.name || "").toLowerCase().trim() !== i ? p : (f = !0, e.areNodeSummariesEquivalent(p, c) ? p : c));
        return f || m.push(c), (await e.commitNodesSummaryIndexMutation(m, {
          kv: n,
          ctx: s
        })).summaries.find((p) => String(p?.name || "").toLowerCase().trim() === i) || c;
      }, n);
    },
    async removeNodeSummaryEntry(t, r = {}) {
      const { kv: a, ctx: n } = r;
      if (!a) return [];
      const s = String(t || "").toLowerCase().trim();
      return await wr(async () => {
        const i = (await e.loadNodeSummariesForMutation(a, { ctx: n })).filter((c) => String(c?.name || "").toLowerCase().trim() !== s);
        return (await e.commitNodesSummaryIndexMutation(i, {
          kv: a,
          ctx: n
        })).summaries;
      }, a);
    },
    async getNodesIndex(t) {
      if (!t) return [];
      const r = Se(t);
      if (r.NodesIndexCache?.exp > H() && Array.isArray(r.NodesIndexCache.data)) return [...r.NodesIndexCache.data];
      if (r.NodesListCache?.exp > H() && Array.isArray(r.NodesListCache.data)) {
        const s = e.normalizeNodeIndex(r.NodesListCache.data.map((i) => i?.name));
        return r.NodesIndexCache = {
          data: s,
          exp: H() + 6e4
        }, [...s];
      }
      const a = r.NodesRevisionCacheGeneration, n = e.normalizeNodeIndex(await t.get(e.NODES_INDEX_KEY, { type: "json" }) || []);
      if (r.NodesRevisionCacheGeneration !== a) return [...n];
      if (!n.length) {
        const s = await e.rebuildNodeIndexesFromKv(t);
        return [...e.normalizeNodeIndex(s.index)];
      }
      return r.NodesRevisionCacheGeneration === a && (r.NodesIndexCache = {
        data: n,
        exp: H() + 6e4
      }), [...n];
    },
    buildPlaybackRouteHotSignature(t, r = {}) {
      const a = String(t || "").toLowerCase().trim(), n = ne(ee(e.getOrderedNodeLines(r).map((s) => String(s?.target || "").trim()).filter(Boolean)));
      return {
        cacheKey: `${a}:${String(r?.activeLineId || "").trim()}:${n}`,
        orderedTargetSignature: n
      };
    },
    buildPlaybackRouteHotSnapshot(t, r = {}, a = {}) {
      const n = String(t || "").toLowerCase().trim();
      if (!n || !$(r) || Qe(n, r)) return null;
      const s = e.getOrderedNodeLines(r), i = (s.length ? s.map((m) => m?.target) : String(r.target || "").split(",").map((m) => m.trim()).filter(Boolean)).map((m) => pn(m)).filter(Ze);
      if (!i.length) return null;
      const c = Array.isArray(r.lines) ? r.lines.map((m) => $(m) ? { ...m } : m) : [], l = $(r.headers) ? { ...r.headers } : {}, d = {
        ...r,
        lines: c,
        headers: l
      }, { cacheKey: u, orderedTargetSignature: f } = e.buildPlaybackRouteHotSignature(n, d);
      return {
        nodeName: n,
        cacheKey: u,
        expiresAt: H() + Bu,
        nodesRevision: String(a.nodesRevision || "").trim(),
        nodeCacheRevision: oo(n, d),
        orderedTargetSignature: f,
        secret: String(d.secret || "").trim(),
        headers: l,
        lines: c,
        activeLineId: String(d.activeLineId || "").trim(),
        mainVideoStreamMode: Hr(d),
        playbackInfoMode: Dr(d.playbackInfoMode),
        mediaAuthMode: Bt(d.mediaAuthMode),
        realClientIpMode: Nr(d.realClientIpMode),
        routingDecisionMode: xr(d.routingDecisionMode),
        targetRecords: i,
        nodeData: d
      };
    },
    getPlaybackRouteHotSnapshot(t, r = null) {
      const a = String(t || "").toLowerCase().trim();
      if (!a) return null;
      const n = Se(r ? e.getKV(r) : null).PlaybackRouteHotCache, s = n.get(a);
      return s ? Number(s.expiresAt) <= H() ? (n.delete(a), null) : (Za(n, a), s) : null;
    },
    async getVerifiedPlaybackRouteHotSnapshot(t, r) {
      const a = e.getKV(r), n = Se(a), s = Pe(t, n), i = e.getPlaybackRouteHotSnapshot(t, r);
      if (!i) return null;
      if (!a) return i;
      const c = await e.getNodesRevision(a);
      return Pe(t, n) !== s ? null : !i.nodesRevision || !c || i.nodesRevision === c ? i : (e.invalidatePlaybackRouteHotCache(t, r), null);
    },
    setPlaybackRouteHotSnapshot(t, r = {}, a = {}, n = null) {
      const s = e.buildPlaybackRouteHotSnapshot(t, r, a);
      return s ? (Ie(Se(n ? e.getKV(n) : null).PlaybackRouteHotCache, s.nodeName, s, sr), s) : null;
    },
    async primePlaybackRouteHotSnapshot(t, r = {}, a) {
      const n = e.getKV(a), s = Se(n), i = Pe(t, s), c = n ? await e.getNodesRevision(n) : "";
      return Pe(t, s) !== i ? null : e.setPlaybackRouteHotSnapshot(t, r, { nodesRevision: c }, a);
    },
    invalidatePlaybackRouteHotCache(t = [], r = null) {
      const a = Se(r ? e.getKV(r) : null).PlaybackRouteHotCache;
      for (const n of Array.isArray(t) ? t : [t]) {
        const s = String(n || "").toLowerCase().trim();
        s && a.delete(s);
      }
    },
    invalidateNodeCaches(t = [], r = {}) {
      const a = r.kv || (r.env ? e.getKV(r.env) : null), n = Se(a), s = [];
      for (const i of Array.isArray(t) ? t : [t]) {
        const c = String(i || "").toLowerCase().trim();
        c && (s.push(c), n.NodeCache.delete(c), n.PlaybackRouteHotCache.delete(c));
      }
      s.length > 0 && (Qm(s, n), il(s), cl(s)), r.invalidateList && (n.NodesListCache = null, n.NodesIndexCache = null, cr(a));
    },
    async persistNodesIndex(t, r = {}) {
      const { kv: a, ctx: n, invalidateList: s = !1 } = r, i = Se(a), c = e.normalizeNodeIndex(t);
      return s && (i.NodesListCache = null), a ? await wr(async () => {
        const l = await e.readRevisionMeta(a, e.NODES_INDEX_META_KEY, {
          count: 0,
          indexHash: "",
          fullIndexHash: ""
        }), d = ne(ee(c)), u = l.indexHash === d && l.revision ? l.updatedAt : /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(), f = {
          ...l,
          updatedAt: u,
          revision: l.indexHash === d && l.revision ? l.revision : Ht(ne(`${d}:${l.fullIndexHash || ""}:${c.length}`), u),
          hash: l.hash || "",
          count: c.length,
          indexHash: d,
          fullIndexHash: String(l.fullIndexHash || "")
        }, m = [];
        (l.indexHash !== d || !l.revision) && m.push(a.put(e.NODES_INDEX_KEY, JSON.stringify(c)));
        const p = l.indexHash !== d || Number(l.count) !== c.length || !l.revision;
        if (m.length > 0) {
          const g = Promise.all(m);
          n && n.waitUntil(g), await g;
        }
        if (p) {
          const g = a.put(e.NODES_INDEX_META_KEY, JSON.stringify(f));
          n && n.waitUntil(g), await g;
        }
        return i.NodesIndexCache = {
          data: c,
          exp: H() + 6e4
        }, Os(f.revision, a), c;
      }, a) : (i.NodesIndexCache = {
        data: c,
        exp: H() + 6e4
      }, cr(a), c);
    }
  };
}
function ph(o = {}, e = {}) {
  return {
    getDnsRecordHistoryKey(t, r) {
      const a = encodeURIComponent(String(t || "").trim() || "default"), n = encodeURIComponent(String(r || "").trim() || "unknown");
      return `${e.DNS_RECORD_HISTORY_PREFIX}${a}:${n}`;
    },
    getDnsHostHistoryRecordId(t) {
      return `host:${re(t) || "unknown"}`;
    },
    normalizeDnsHistoryValueKey(t, r) {
      return `${String(t || "").trim().toUpperCase()}::${String(r || "").trim().toLowerCase()}`;
    },
    normalizeDnsRecordHistoryEntry(t = {}) {
      const r = t && typeof t == "object" ? t : {}, a = String(r.type || "").trim().toUpperCase(), n = String(r.content || "").trim(), s = String(r.savedAt || r.updatedAt || r.createdAt || "").trim(), i = s ? new Date(s) : null, c = i && !Number.isNaN(i.getTime()) ? i.toISOString() : "", l = String(r.name || "").trim(), d = String(r.actor || "admin").trim() || "admin", u = String(r.source || "ui").trim() || "ui", f = re(r.requestHost), m = [
        a,
        n.toLowerCase(),
        l.toLowerCase(),
        f,
        c || s,
        u.toLowerCase()
      ].join("|");
      return {
        id: String(r.id || `dns-hist-${ne(m || "empty")}`),
        name: l,
        type: a,
        content: n,
        savedAt: c,
        actor: d,
        source: u,
        requestHost: f,
        preferredFallback: r.preferredFallback === !0
      };
    },
    normalizeDnsRecordHistory(t = []) {
      const r = [], a = /* @__PURE__ */ new Map();
      for (const s of Array.isArray(t) ? t : []) {
        const i = e.normalizeDnsRecordHistoryEntry(s);
        if (i.type !== "CNAME" || !i.content) continue;
        const c = e.normalizeDnsHistoryValueKey(i.type, i.content), l = a.get(c);
        if (Number.isInteger(l) && l >= 0) {
          i.preferredFallback === !0 && r[l] && (r[l].preferredFallback = !0);
          continue;
        }
        if (a.set(c, r.length), r.push(i), r.length >= k.Defaults.DnsHistoryLimit) break;
      }
      let n = !1;
      for (const s of r)
        if (s.preferredFallback === !0) {
          if (n) {
            s.preferredFallback = !1;
            continue;
          }
          n = !0;
        }
      return r;
    },
    async getDnsRecordHistory(t, r, a) {
      if (!t || !r || !a) return [];
      try {
        const n = await t.get(e.getDnsRecordHistoryKey(r, a), { type: "json" });
        return e.normalizeDnsRecordHistory(n);
      } catch {
        return [];
      }
    },
    async getDnsRecordHistoryForMutation(t, r, a) {
      if (!t || !r || !a) return [];
      const n = await t.get(e.getDnsRecordHistoryKey(r, a), { type: "json" });
      return e.normalizeDnsRecordHistory(n);
    },
    async persistDnsRecordHistory(t, r, a, n) {
      if (!t || !r || !a) return [];
      const s = e.normalizeDnsRecordHistory(n);
      return await t.put(e.getDnsRecordHistoryKey(r, a), JSON.stringify(s)), s;
    },
    async recordDnsRecordHistory(t, r, a, n = {}) {
      if (!t || !r || !a) return [];
      const s = await e.getDnsRecordHistoryForMutation(t, r, a), i = e.normalizeDnsRecordHistoryEntry(n);
      if (i.type !== "CNAME" || !i.content) return s;
      s.find((d) => e.normalizeDnsHistoryValueKey(d?.type, d?.content) === e.normalizeDnsHistoryValueKey(i.type, i.content))?.preferredFallback === !0 && (i.preferredFallback = !0);
      const c = e.normalizeDnsHistoryValueKey(i.type, i.content), l = s[0] ? e.normalizeDnsHistoryValueKey(s[0].type, s[0].content) : "";
      return l && l === c ? s : e.persistDnsRecordHistory(t, r, a, [i, ...s]);
    },
    async getDnsHostHistory(t, r, a) {
      return e.getDnsRecordHistory(t, r, e.getDnsHostHistoryRecordId(a));
    },
    async persistDnsHostHistory(t, r, a, n) {
      return e.persistDnsRecordHistory(t, r, e.getDnsHostHistoryRecordId(a), n);
    },
    async recordDnsHostHistory(t, r, a, n = {}) {
      return e.recordDnsRecordHistory(t, r, e.getDnsHostHistoryRecordId(a), n);
    },
    async setDnsHostHistoryPreferredFallback(t, r, a, n = "", s = !0) {
      if (!t || !r || !a) return [];
      const i = await e.getDnsHostHistory(t, r, a), c = String(n || "").trim();
      let l = !1;
      const d = i.map((u) => {
        const f = c && String(u?.id || "").trim() === c;
        return f && (l = !0), {
          ...u,
          preferredFallback: s === !0 ? f : !1
        };
      });
      if (s === !0 && c && !l) throw new Error("dns_history_entry_not_found");
      return e.persistDnsHostHistory(t, r, a, d);
    },
    getCurrentDateKey(t = /* @__PURE__ */ new Date(), r = k.Defaults.ScheduleUtcOffsetMinutes) {
      return ot(t, r).dateKey;
    }
  };
}
function gh(o = {}, e = {}) {
  return {
    buildLegacyConfigCacheKeys(...t) {
      const r = /* @__PURE__ */ new Set([Hc]);
      for (const a of t) {
        const n = e.getCurrentDateKey(/* @__PURE__ */ new Date(), a?.scheduleUtcOffsetMinutes);
        r.add(Us(a?.cfZoneId)), r.add(Us(a?.cfZoneId, n));
      }
      return [...r].filter(Boolean);
    },
    async listKvKeys(t, r = {}) {
      if (!t || typeof t.list != "function") return [];
      const a = String(r.prefix || ""), n = [];
      let s = "", i = 0, c = !1;
      const l = /* @__PURE__ */ new Set();
      for (; i < 1e3; ) {
        i += 1;
        const d = s ? await t.list({
          prefix: a,
          cursor: s
        }) : await t.list({ prefix: a });
        for (const f of d?.keys || []) {
          const m = String(f?.name || "").trim();
          m && n.push(m);
        }
        const u = typeof d?.cursor == "string" ? d.cursor : "";
        if (d?.list_complete === !0) {
          c = !0;
          break;
        }
        if (!u || u === s || l.has(u)) {
          const f = /* @__PURE__ */ new Error("KV key scan did not complete");
          throw f.code = "KV_SCAN_INCOMPLETE", f.status = 409, f.details = {
            prefix: a,
            pageCount: i,
            cursor: u,
            reason: u ? "repeated_cursor" : "missing_cursor"
          }, f;
        }
        l.add(u), s = u;
      }
      if (!c) {
        const d = /* @__PURE__ */ new Error("KV key scan exceeded the page safety limit");
        throw d.code = "KV_SCAN_INCOMPLETE", d.status = 409, d.details = {
          prefix: a,
          pageCount: i,
          cursor: s,
          reason: "page_limit"
        }, d;
      }
      return [...new Set(n)];
    },
    async listKvKeysStrict(t, r = {}) {
      if (!t || typeof t.list != "function") return [];
      const a = String(r.prefix || ""), n = [];
      let s = "", i = 0, c = !1;
      const l = /* @__PURE__ */ new Set();
      for (; i < 1e3; ) {
        i += 1;
        const d = await mf(t, s ? {
          prefix: a,
          cursor: s
        } : { prefix: a });
        for (const f of d?.keys || []) {
          const m = String(f?.name || "").trim();
          m && n.push(m);
        }
        const u = typeof d?.cursor == "string" ? d.cursor : "";
        if (d?.list_complete === !0) {
          c = !0;
          break;
        }
        if (!u || u === s || l.has(u)) {
          const f = /* @__PURE__ */ new Error("KV key scan did not complete");
          throw f.code = "KV_SCAN_INCOMPLETE", f.status = 409, f.details = {
            prefix: a,
            pageCount: i,
            cursor: u,
            reason: u ? "repeated_cursor" : "missing_cursor"
          }, f;
        }
        l.add(u), s = u;
      }
      if (!c) {
        const d = /* @__PURE__ */ new Error("KV key scan exceeded the page safety limit");
        throw d.code = "KV_SCAN_INCOMPLETE", d.status = 409, d.details = {
          prefix: a,
          pageCount: i,
          cursor: s,
          reason: "page_limit"
        }, d;
      }
      return [...new Set(n)];
    },
    async readRepairableRuntimeConfig(t) {
      if (!t) return {
        config: {},
        rawConfig: {},
        hadMalformedValue: !1,
        source: "missing",
        rawText: null
      };
      let r = null;
      try {
        r = await t.get(e.CONFIG_KEY);
      } catch (a) {
        const n = /* @__PURE__ */ new Error("KV tidy could not read the runtime config");
        throw n.code = "KV_TIDY_CONFIG_READ_FAILED", n.status = 503, n.details = {
          key: e.CONFIG_KEY,
          cause: se(a, "kv_read_failed")
        }, n;
      }
      if (r == null || r === "") return {
        config: {},
        rawConfig: {},
        hadMalformedValue: !1,
        source: "missing",
        rawText: null
      };
      try {
        const a = JSON.parse(String(r));
        return {
          config: ae($(a) ? a : {}),
          rawConfig: $(a) ? a : {},
          hadMalformedValue: !$(a),
          source: "text_json",
          rawText: String(r)
        };
      } catch {
        return {
          config: {},
          rawConfig: {},
          hadMalformedValue: !0,
          source: "text_invalid_json",
          rawText: String(r)
        };
      }
    },
    async readRawKvEntry(t, r) {
      if (!t) return {
        exists: !1,
        value: null
      };
      const a = await t.get(r);
      return a == null ? {
        exists: !1,
        value: null
      } : {
        exists: !0,
        value: String(a)
      };
    },
    async captureRawKvEntries(t, r = []) {
      const a = [], n = /* @__PURE__ */ new Set();
      for (const s of Array.isArray(r) ? r : []) {
        const i = String(s || "").trim();
        !i || n.has(i) || (n.add(i), a.push({
          key: i,
          ...await e.readRawKvEntry(t, i)
        }));
      }
      return a;
    },
    async applyKvMutationsWithRollback(t, r = []) {
      if (!t) return [];
      const a = [], n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
      for (const l of Array.isArray(r) ? r : []) {
        const d = String(l?.key || "").trim();
        if (!d) continue;
        const u = String(l?.type || "put").trim().toLowerCase() === "delete" ? "delete" : "put";
        a.push({
          type: u,
          key: d,
          value: String(l?.value ?? "")
        }), !s.has(d) && (s.add(d), n.set(d, {
          key: d,
          ...await e.readRawKvEntry(t, d)
        }));
      }
      const i = [], c = /* @__PURE__ */ new Map();
      try {
        for (const l of a)
          l.type === "delete" ? await t.delete(l.key) : await t.put(l.key, l.value), c.has(l.key) || i.push(l.key), c.set(l.key, l.type === "delete" ? {
            exists: !1,
            value: null
          } : {
            exists: !0,
            value: l.value
          });
        return a;
      } catch (l) {
        const d = [], u = [];
        for (let f = i.length - 1; f >= 0; f -= 1) {
          const m = i[f], p = n.get(m), g = c.get(m);
          if (!(!p || !g))
            try {
              const h = await e.readRawKvEntry(t, m);
              if (!(h.exists === g.exists && (g.exists !== !0 || h.value === g.value))) {
                u.push(m);
                continue;
              }
              p.exists ? await t.put(p.key, p.value) : await t.delete(p.key);
            } catch (h) {
              d.push(`${p.key}:${h?.message || String(h)}`);
            }
        }
        if (d.length > 0 || u.length > 0) {
          const f = /* @__PURE__ */ new Error(`${l?.message || String(l)}; rollback_incomplete`);
          throw f.code = "KV_MUTATION_ROLLBACK_CONFLICT", f.status = 409, f.details = {
            rollbackConflicts: u,
            rollbackFailures: d,
            originalError: se(l, "kv_mutation_failed")
          }, f;
        }
        throw l;
      }
    }
  };
}
function hh(o = {}, e = {}) {
  return {
    createEmptyTidyPreview(t = "kv") {
      return {
        scope: String(t || "kv").trim() || "kv",
        fieldGroups: [],
        deleteGroups: [],
        rewriteGroups: [],
        preserveGroups: [],
        warnings: []
      };
    },
    async readStoredNodesSummaryState(t) {
      const r = String(await t.get(e.NODES_SUMMARY_INDEX_KEY) || "");
      let a = null;
      try {
        a = r ? JSON.parse(r) : null;
      } catch {
        a = null;
      }
      return {
        rawStoredSummaryIndexText: r,
        storedSummaryIndexState: Array.isArray(a) ? e.normalizeNodeSummaryIndex(a) : null,
        previousFullIndexBytes: r ? new TextEncoder().encode(r).length : 0
      };
    },
    async classifyKvTidyKeys(t, r = []) {
      const a = [], n = /* @__PURE__ */ new Set(), s = new Set(Object.values(e.LEGACY_OPS_STATUS_SECTION_KEYS));
      let i = 0, c = 0, l = 0, d = 0, u = 0, f = 0, m = 0, p = 0, g = 0, h = 0;
      for (const y of r)
        if (y) {
          if (y.startsWith(e.PREFIX)) {
            a.push(y.slice(e.PREFIX.length));
            continue;
          }
          if (y.startsWith("fail:")) {
            n.add(y), g += 1;
            continue;
          }
          if (y === "sys:cf_dash_cache" || y.startsWith("sys:cf_dash_cache:")) {
            n.add(y);
            continue;
          }
          if (y === e.LEGACY_SCHEDULED_LOCK_KEY) {
            n.add(y);
            continue;
          }
          if (y.startsWith("sys:dns_ip_pool_fetch_lock:v1:")) {
            n.add(y), h += 1;
            continue;
          }
          if (y === e.CONFIG_META_KEY) {
            u += 1;
            continue;
          }
          if (y === e.CONFIG_SNAPSHOTS_META_KEY) {
            f += 1;
            continue;
          }
          if (y === e.NODES_INDEX_META_KEY) {
            m += 1;
            continue;
          }
          if (y === e.LEGACY_DNS_IP_POOL_SOURCES_KEY) {
            i += 1;
            continue;
          }
          if (y === e.LEGACY_TELEGRAM_ALERT_STATE_KEY) {
            i += 1;
            continue;
          }
          if (s.has(y) || y === e.LEGACY_OPS_STATUS_KEY) {
            i += 1;
            continue;
          }
          if (y.startsWith(e.DNS_RECORD_HISTORY_PREFIX)) {
            l += 1;
            continue;
          }
          y.startsWith(e.ADMIN_INDEX_UPLOAD_PREFIX) || y === e.CONFIG_KEY || y === e.NODES_INDEX_KEY || y === e.NODES_SUMMARY_INDEX_KEY || y === e.CONFIG_SNAPSHOTS_KEY || (i += 1);
        }
      return {
        nodeNames: a,
        removableKeys: n,
        untouchedOtherKeyCount: i,
        opsStatusKeyCount: c,
        dnsRecordHistoryKeyCount: l,
        dnsIpPoolSourceKeyCount: d,
        configMetaKeyCount: u,
        snapshotMetaKeyCount: f,
        nodeIndexMetaKeyCount: m,
        telegramAlertStateKeyCount: p,
        loginFailureKeyCount: g,
        dnsFetchLockKeyCount: h
      };
    },
    async collectKvTidyNodeMutations(t, r = [], a = {}, n = []) {
      const s = [], i = [];
      let c = 0, l = 0, d = 0, u = 0, f = 0, m = 0, p = ht(a.sourceDirectNodes || []);
      const g = [];
      for (const y of r) {
        const _ = `${e.PREFIX}${y}`;
        let S = null;
        try {
          S = await xe(t, _, { type: "json" });
        } catch (w) {
          const L = /* @__PURE__ */ new Error(`KV tidy could not read node ${y}`);
          throw L.code = "KV_TIDY_NODE_READ_FAILED", L.status = 503, L.details = {
            key: _,
            nodeName: y,
            cause: se(w, "kv_read_failed")
          }, L;
        }
        if (!$(S)) {
          const w = /* @__PURE__ */ new Error(`KV tidy found an invalid node entity: ${y}`);
          throw w.code = "KV_TIDY_NODE_INVALID", w.status = 409, w.details = {
            key: _,
            nodeName: y
          }, w;
        }
        const T = Ld(S);
        T.shouldAddToSourceDirectNodes && (p = ht([...p, y])), T.topLevelPortPresent && (d += 1), u += Number(T.linePortCount) || 0, T.defaultPortNodePresent && (f += 1), m += Number(T.defaultPortLineCount) || 0, l += T.legacyKeysPresent.length;
        const { data: b, changed: R } = e.normalizeNode(y, S, { dropLegacyDirectRouting: !0 });
        i.push({
          name: y,
          ...b
        }), !Qe(y, b) && R && (g.push({
          key: _,
          ...await e.readRawKvEntry(t, _)
        }), c += 1, s.push({
          name: y,
          data: b
        }));
      }
      let h = a;
      return ee(h.sourceDirectNodes || []) !== ee(p) && (h = ae({
        ...h,
        sourceDirectNodes: p
      })), {
        nextTidyConfig: h,
        rewrittenNodes: s,
        fullEntityNodes: i,
        rewrittenNodeCount: c,
        deletedLegacyNodeFieldCount: l,
        migratedTopLevelPortNodeCount: d,
        migratedLinePortCount: u,
        migratedDefaultPortNodeCount: f,
        migratedDefaultPortLineCount: m,
        rollbackKvEntries: [...n, ...g]
      };
    },
    buildKvTidyNoteParts(t = {}, r = {}) {
      const a = [];
      return Array.isArray(t.legacyKeysPresent) && t.legacyKeysPresent.length && a.push(`legacy_keys=${t.legacyKeysPresent.join(",")}`), Number(t.rewrittenNodeCount) > 0 && a.push(`rewritten_nodes=${t.rewrittenNodeCount}`), Number(t.migratedTopLevelPortNodeCount) > 0 && a.push(`top_level_port_nodes=${t.migratedTopLevelPortNodeCount}`), Number(t.migratedLinePortCount) > 0 && a.push(`line_ports=${t.migratedLinePortCount}`), Number(t.migratedDefaultPortNodeCount) > 0 && a.push(`default_port_nodes=${t.migratedDefaultPortNodeCount}`), Number(t.migratedDefaultPortLineCount) > 0 && a.push(`default_port_lines=${t.migratedDefaultPortLineCount}`), r.includeRepairSource === !0 && r.repairedConfig?.hadMalformedValue && a.push(`${r.repairLabel || "config_source"}=${r.repairedConfig.source}`), a;
    },
    buildKvTidyPlanHash(t = {}) {
      const r = (Array.isArray(t?.mutationPlan) ? t.mutationPlan : []).map((a) => ({
        type: String(a?.type || "put").trim().toLowerCase() === "delete" ? "delete" : "put",
        key: String(a?.key || "").trim(),
        value: String(a?.value ?? "")
      }));
      return ne(ee({
        scope: "kv",
        scannedKeys: [...new Set(Array.isArray(t?.scannedKeys) ? t.scannedKeys : [])].sort(),
        revisions: $(t?.revisions) ? t.revisions : {},
        mutationPlan: r,
        rebuiltNodeSummaries: Array.isArray(t?.rebuiltNodeSummaries) ? t.rebuiltNodeSummaries : []
      }));
    }
  };
}
function yh(o = {}, e = {}) {
  return {
    ...mh(o, e),
    ...ph(o, e),
    ...gh(o, e),
    ...hh(o, e)
  };
}
var Sh = class {
  constructor({ configReader: o, httpService: e, nodeRouteReader: t, proxyApi: r }) {
    this.configReader = o, this.httpService = e, this.nodeRouteReader = t, this.proxyApi = r;
  }
  #t(o, e, t, r = 200) {
    return this.httpService.buildCorsResponse(Yr(e, o), t, r, { mergeOriginVary: !0 });
  }
  #e(o, e) {
    const t = new URL(o.url);
    t.pathname = e + "/";
    const r = new Headers({
      Location: t.toString(),
      "Cache-Control": "no-store"
    });
    Ce(r);
    const a = o.method === "GET" || o.method === "HEAD" ? 301 : 307;
    return new Response(null, {
      status: a,
      headers: r
    });
  }
  #o(o, e = "") {
    const t = String(e || "").trim();
    if (!o || !t || o.status === 101) return o;
    const r = new Headers(o.headers || {});
    return r.append("Set-Cookie", t), new Response(o.body, {
      status: o.status,
      statusText: o.statusText,
      headers: r
    });
  }
  #s(o, e) {
    const t = this.#t(o, e, "Not Found", 404);
    return this.#o(t, Xc());
  }
  async #n(o, e, t, r) {
    if (!o || o.status === 101) return o;
    const a = await Ip(t, e, r);
    return a ? this.#o(o, Pp(a)) : o;
  }
  #r(o) {
    const e = o.segments;
    return e.length <= 1 ? !1 : this.httpService.isPlaybackCriticalSegments(e, 1) ? !0 : e.length <= 2 ? !1 : this.httpService.isPlaybackCriticalSegments(e, 2);
  }
  async #i(o, e, t, r) {
    if (!o.root) return null;
    const a = this.#r(o);
    let n = a ? await this.nodeRouteReader.getVerifiedPlaybackRouteHotSnapshot(o.root, e) : null, s = a ? n ? "hit" : "miss" : "skip";
    const i = n?.nodeData || await this.nodeRouteReader.getNode(o.root, e, t);
    if (!i) return null;
    const c = Qe(o.root, i) ? "oversized_bypass" : "";
    if (c && (s = c), Ye(i?.entryMode)) return null;
    const l = i.secret, d = _t(o.root, l), u = 1 + o.rootRaw.length, f = o.normalizedPathname.substring(u), m = Ws(f, o.requestUrl, d), p = m?.normalizedPath || f, g = `/${o.rootRaw}${p === "/" ? "/" : p}`, h = m ? g.split("/").filter(Boolean) : o.segments;
    let y = u;
    if (l) {
      const R = h[1] || "";
      if (It(R) !== l) return null;
      y += 1 + R.length;
    }
    const _ = g.substring(y), S = m ? (() => {
      const R = new URL(o.requestUrl.toString());
      return R.pathname = g, R;
    })() : o.requestUrl, T = sa(_);
    let b = T.remaining;
    return _ === "" && !S.pathname.endsWith("/") || T.needsTrailingSlashRedirect === !0 ? { response: this.#e(r, g) } : (b === "" && (b = "/"), a && !n && (n = await this.nodeRouteReader.primePlaybackRouteHotSnapshot(o.root, i, e)), {
      nodeData: i,
      secret: l,
      remaining: Y(b),
      linkVariant: T.linkVariant,
      requestUrl: S,
      pathNormalizationState: m,
      playbackRouteHotSnapshot: n,
      targetHotCacheState: s,
      nodeCacheState: c,
      entryMode: "kv_route"
    });
  }
  #c(o) {
    return o ? qa(sa(o.normalizedPathname)?.remaining || "/") : !1;
  }
  async #l(o, e, t, r) {
    const a = o?.hostPrefixMatch;
    if (!a?.prefix) return null;
    const n = a.prefix, s = this.#c(o);
    let i = s ? await this.nodeRouteReader.getVerifiedPlaybackRouteHotSnapshot(n, e) : null, c = s ? i ? "hit" : "miss" : "skip";
    const l = i?.nodeData || await this.nodeRouteReader.getNode(n, e, t);
    if (!l || !Ye(l?.entryMode)) return null;
    const d = Qe(n, l) ? "oversized_bypass" : "";
    d && (c = d);
    const u = sa(o.normalizedPathname);
    let f = u.remaining;
    return u.needsTrailingSlashRedirect === !0 ? { response: this.#e(r, o.normalizedPathname) } : (f === "" && (f = "/"), s && !i && (i = await this.nodeRouteReader.primePlaybackRouteHotSnapshot(n, l, e)), {
      nodeData: l,
      secret: "",
      remaining: Y(f),
      linkVariant: u.linkVariant,
      requestUrl: o.requestUrl,
      playbackRouteHotSnapshot: i,
      targetHotCacheState: c,
      nodeCacheState: d,
      entryMode: "host_prefix"
    });
  }
  #a(o) {
    const e = o?.requestHost || "", t = o?.configuredHost || "", r = o?.configuredLegacyHost || "";
    return e ? t && e === t ? !0 : !!(r && r !== t && e === r) : !1;
  }
  async #u(o, e, t, r, a = {}) {
    if (!this.#a(o) || !o?.root) return null;
    const n = o.root, s = this.#r(o);
    let i = s ? await this.nodeRouteReader.getVerifiedPlaybackRouteHotSnapshot(n, e) : null, c = s ? i ? "hit" : "miss" : "skip";
    const l = i?.nodeData || await this.nodeRouteReader.getNode(n, e, t);
    if (!l || !Ye(l?.entryMode)) return null;
    const d = Qe(n, l) ? "oversized_bypass" : "";
    d && (c = d);
    const u = _t(n, "", { entryMode: "kv_route" }), f = 1 + o.rootRaw.length, m = o.normalizedPathname.substring(f), p = Ws(m, o.requestUrl, u), g = p?.normalizedPath || m, h = `/${o.rootRaw}${g === "/" ? "/" : g}`, y = h.substring(f), _ = p ? (() => {
      const b = new URL(o.requestUrl.toString());
      return b.pathname = h, b;
    })() : o.requestUrl, S = sa(y);
    let T = S.remaining;
    return y === "" && !_.pathname.endsWith("/") || S.needsTrailingSlashRedirect === !0 ? { response: this.#e(r, h) } : (T === "" && (T = "/"), s && !i && (i = await this.nodeRouteReader.primePlaybackRouteHotSnapshot(n, l, e)), {
      nodeData: l,
      nodeName: n,
      secret: "",
      remaining: Y(T),
      linkVariant: S.linkVariant,
      requestUrl: _,
      pathNormalizationState: p,
      playbackRouteHotSnapshot: i,
      targetHotCacheState: c,
      nodeCacheState: d,
      entryMode: "kv_route",
      routeKindOverride: a.isLegacyHostRequest === !0 ? "legacy_host_prefix_path_compat" : "host_prefix_path_compat",
      attachLegacyProxyContext: a.isLegacyHostRequest === !0
    });
  }
  async #d(o, e, t, r) {
    if (!js(o?.normalizedPathname)) return null;
    const a = r.headers.get("Cookie") || "", n = String(Ra(a).get("legacy_proxy_ctx") || "").trim();
    if (!n) return null;
    const s = await Mp(n, e, { requestHost: o.requestHost });
    if (s?.ok !== !0) return { response: this.#s(r, e) };
    const i = String(s.payload?.node || "").trim().toLowerCase();
    if (!i) return { response: this.#s(r, e) };
    const c = qa(o.normalizedPathname);
    let l = c ? await this.nodeRouteReader.getVerifiedPlaybackRouteHotSnapshot(i, e) : null, d = c ? l ? "hit" : "miss" : "skip";
    const u = l?.nodeData || await this.nodeRouteReader.getNode(i, e, t);
    if (!u) return { response: this.#s(r, e) };
    const f = Qe(i, u) ? "oversized_bypass" : "";
    f && (d = f);
    const m = Ye(u?.entryMode);
    return c && !l && (l = await this.nodeRouteReader.primePlaybackRouteHotSnapshot(i, u, e)), {
      nodeData: u,
      nodeName: i,
      secret: m ? "" : u.secret,
      remaining: o.normalizedPathname,
      linkVariant: "main",
      requestUrl: o.requestUrl,
      playbackRouteHotSnapshot: l,
      targetHotCacheState: d,
      nodeCacheState: f,
      entryMode: "kv_route",
      routeKindOverride: m ? "legacy_host_context_cookie_host_prefix_compat" : "legacy_host_context_cookie"
    };
  }
  async handle(o, e, t, r) {
    if (!r) throw new TypeError("NodeProxyFacade.handle requires routeContext");
    const { requestHost: a, configuredHost: n, configuredLegacyHost: s } = r, i = await this.configReader.getRuntimeConfig(e), c = !!(s && s !== n && a === s), l = i.enableHostPrefixProxy === !0 && !!n && !c;
    r.hostPrefixMatch = l ? Eo(a, n) : null;
    const d = !!(l && a !== n && a.endsWith(`.${n}`));
    if (r.hostPrefixMatch) {
      const m = await this.#l(r, e, t, o);
      return m?.response ? m.response : m?.nodeData ? this.proxyApi.handle(o, m.nodeData, m.remaining, r.hostPrefixMatch.prefix, m.secret, e, t, {
        requestUrl: m.requestUrl || r.requestUrl,
        linkVariant: m.linkVariant,
        targetHotCacheState: m.targetHotCacheState,
        nodeCacheState: m.nodeCacheState,
        cachedTargetRecords: Array.isArray(m.playbackRouteHotSnapshot?.targetRecords) ? m.playbackRouteHotSnapshot.targetRecords : null,
        nodeCacheRevision: m.playbackRouteHotSnapshot?.nodeCacheRevision || "",
        runtimeConfig: i,
        runtimeRouteContext: r,
        entryMode: m.entryMode
      }) : this.#t(o, e, "Not Found", 404);
    }
    if (d) return this.#t(o, e, "Not Found", 404);
    const u = await this.#u(r, e, t, o, { isLegacyHostRequest: c });
    if (u?.response) return u.response;
    if (u?.nodeData) {
      const m = await this.proxyApi.handle(o, u.nodeData, u.remaining, u.nodeName, u.secret, e, t, {
        requestUrl: u.requestUrl || r.requestUrl,
        linkVariant: u.linkVariant,
        pathNormalizationState: u.pathNormalizationState,
        targetHotCacheState: u.targetHotCacheState,
        nodeCacheState: u.nodeCacheState,
        cachedTargetRecords: Array.isArray(u.playbackRouteHotSnapshot?.targetRecords) ? u.playbackRouteHotSnapshot.targetRecords : null,
        nodeCacheRevision: u.playbackRouteHotSnapshot?.nodeCacheRevision || "",
        runtimeConfig: i,
        runtimeRouteContext: r,
        entryMode: u.entryMode,
        routeKindOverride: u.routeKindOverride
      });
      return u.attachLegacyProxyContext === !0 ? await this.#n(m, a, u.nodeName, e) : m;
    }
    const f = await this.#i(r, e, t, o);
    if (f?.response) return f.response;
    if (f?.nodeData) {
      const m = await this.proxyApi.handle(o, f.nodeData, f.remaining, r.root, f.secret, e, t, {
        requestUrl: f.requestUrl || r.requestUrl,
        linkVariant: f.linkVariant,
        pathNormalizationState: f.pathNormalizationState,
        targetHotCacheState: f.targetHotCacheState,
        nodeCacheState: f.nodeCacheState,
        cachedTargetRecords: Array.isArray(f.playbackRouteHotSnapshot?.targetRecords) ? f.playbackRouteHotSnapshot.targetRecords : null,
        nodeCacheRevision: f.playbackRouteHotSnapshot?.nodeCacheRevision || "",
        runtimeConfig: i,
        runtimeRouteContext: r,
        entryMode: f.entryMode
      });
      return c ? await this.#n(m, a, r.root, e) : m;
    }
    if (c && js(r.normalizedPathname)) {
      const m = await this.#d(r, e, t, o);
      if (m?.response) return m.response;
      if (m?.nodeData) {
        const p = await this.proxyApi.handle(o, m.nodeData, m.remaining, m.nodeName, m.secret, e, t, {
          requestUrl: m.requestUrl || r.requestUrl,
          linkVariant: m.linkVariant,
          targetHotCacheState: m.targetHotCacheState,
          nodeCacheState: m.nodeCacheState,
          cachedTargetRecords: Array.isArray(m.playbackRouteHotSnapshot?.targetRecords) ? m.playbackRouteHotSnapshot.targetRecords : null,
          nodeCacheRevision: m.playbackRouteHotSnapshot?.nodeCacheRevision || "",
          runtimeConfig: i,
          runtimeRouteContext: r,
          entryMode: m.entryMode,
          routeKindOverride: m.routeKindOverride
        });
        return this.#n(p, a, m.nodeName, e);
      }
    }
    return this.#t(o, e, "Not Found", 404);
  }
};
function _h(o) {
  return Object.freeze({
    persistCloudflareDnsRecordsForHost(e) {
      return Tm({
        ...e,
        dnsHistoryRepository: o
      });
    },
    buildDnsIpWorkspaceItems(e, t, r, a = {}) {
      return Uc(e, t, r, {
        ...a,
        probeRepository: o
      });
    },
    buildDnsIpPoolWorkspacePreviewItems(e, t, r, a, n = {}) {
      return Hm(e, t, r, a, {
        ...n,
        probeRepository: o
      });
    },
    tryAcquireDnsIpPoolFetchRefreshLock(e, t) {
      return Wm({
        ...e,
        leaseRepository: o
      }, t);
    },
    releaseDnsIpPoolFetchRefreshLock(e, t) {
      return Gm({
        ...e,
        leaseRepository: o
      }, t);
    },
    runDnsIpPoolSourcesLiveRefresh(e) {
      return jm({
        ...e,
        poolRepository: o
      });
    }
  });
}
function bh(o, e) {
  const t = e.shellService, r = [
    Jm({
      kernel: o,
      bindingPort: o,
      CacheManager: e.cacheManager,
      LogQueryPlanner: e.logQueryPlanner,
      Logger: e.logger,
      requestModel: o,
      buildAdminLocalIndexUploadRecord: t.buildAdminLocalIndexUploadRecord,
      buildAdminShellState: t.buildAdminShellState,
      buildAdminUiContract: t.buildAdminUiContract,
      buildDnsIpPoolWorkspacePreviewItems: e.dns.buildDnsIpPoolWorkspacePreviewItems,
      buildDnsIpWorkspaceItems: e.dns.buildDnsIpWorkspaceItems,
      persistCloudflareDnsRecordsForHost: e.dns.persistCloudflareDnsRecordsForHost,
      releaseDnsIpPoolFetchRefreshLock: e.dns.releaseDnsIpPoolFetchRefreshLock,
      runDnsIpPoolSourcesLiveRefresh: e.dns.runDnsIpPoolSourcesLiveRefresh,
      tryAcquireDnsIpPoolFetchRefreshLock: e.dns.tryAcquireDnsIpPoolFetchRefreshLock,
      withAdminShellRuntimeStatus: t.withAdminShellRuntimeStatus
    }),
    rg({
      D1TidyExecutor: e.d1TidyExecutor,
      D1TidyPlanner: e.d1TidyPlanner,
      Logger: e.logger,
      buildAdminReleaseVendorManifest: t.buildAdminReleaseVendorManifest,
      normalizeAdminReleaseVendorManifestRecord: t.normalizeAdminReleaseVendorManifestRecord,
      validateAdminShellHtmlSource: t.validateAdminShellHtmlSource
    }, o),
    _g({
      CacheManager: e.cacheManager,
      persistCloudflareDnsRecordsForHost: e.dns.persistCloudflareDnsRecordsForHost
    }, o),
    Rg({
      bindingPort: o,
      schemaReadinessPort: o,
      statusPersistence: o
    }),
    ah({
      CacheManager: e.cacheManager,
      withAdminShellRuntimeStatus: t.withAdminShellRuntimeStatus
    }, o),
    ch({}, o),
    yh({}, o)
  ];
  for (const a of r) for (const [n, s] of Object.entries(a)) o[n] = s;
  return o;
}
var Eh = "video.emos.best", Th = "emos", On = "https://medb.lat/media/list/index?page_size=1", Rh = 60 * 1e3, Ah = 5e3;
function Ch(o) {
  const e = $(o?.items?.[0]?.counts) ? o.items[0].counts : $(o?.counts) ? o.counts : null;
  return e ? {
    MovieCount: e.movie ?? 0,
    SeriesCount: e.series ?? 0,
    EpisodeCount: e.episode ?? 0
  } : null;
}
async function wh() {
  const o = te.MedbItemsCountsCache.get(On);
  if (o && o.expiresAt > H()) return o.counts;
  const e = new AbortController(), t = setTimeout(() => e.abort("medb_counts_timeout"), Ah);
  try {
    const r = await fetch(On, {
      headers: { accept: "application/json" },
      signal: e.signal
    });
    if (!r.ok) return null;
    const a = Ch(await r.json());
    return a ? (te.MedbItemsCountsCache.set(On, {
      counts: a,
      expiresAt: H() + Rh
    }), a) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
function Lh(o, e) {
  if (String(e || "").trim().toLowerCase() === Th) return !0;
  for (const t of Array.isArray(o?.lines) ? o.lines : []) {
    const r = String(t?.target || "").trim();
    if (r)
      try {
        if (re(new URL(r).hostname) === Eh) return !0;
      } catch {
      }
  }
  return !1;
}
async function Nh(o, e, t, r, a) {
  if (o.method !== "GET" || String(Y(a)).replace(/\/+$/, "").toLowerCase() !== "/emby/items/counts" || !Lh(t, r)) return null;
  const n = await wh();
  return n ? Q(n, 200, Yr(e, o)) : null;
}
function Dh({ includeTestingSupport: o = !1 } = {}) {
  const e = { ...dh }, t = Object.freeze({ getRuntimeConfig: Re }), r = fh({ nodeRepository: e }), a = Tg({ logRepository: e }), n = bf({
    indexRepository: e,
    statusPort: e
  });
  bh(e, {
    cacheManager: r,
    d1TidyExecutor: lh(),
    d1TidyPlanner: uh(),
    dns: _h(e),
    logger: a,
    logQueryPlanner: bg(),
    shellService: n
  });
  const s = Yg({
    cachePort: r,
    configReader: t,
    fetchPort: { fetchRequest: Be },
    logger: a,
    nodeRepository: e
  }), i = new $d({
    actionHandlers: e.adminActionHandlers,
    bindingService: e,
    configReader: t,
    repository: e,
    requestModel: e,
    shellService: n
  }), c = new Sh({
    configReader: t,
    httpService: Object.freeze({
      buildCorsResponse: n.buildEdgeCorsResponse,
      isPlaybackCriticalSegments: n.isPlaybackCriticalSegments
    }),
    nodeRouteReader: e,
    proxyApi: s
  }), l = new ag({
    logger: a,
    service: e
  }), d = (m, p) => {
    const g = new URL(m.url), h = re(g.hostname), y = Y(g.pathname), _ = y.toLowerCase(), S = it(p), T = S.toLowerCase(), b = dn(S), R = b.toLowerCase(), w = Bi(p, {
      adminPath: S,
      loginPath: b
    }), L = y.split("/").filter(Boolean), U = L[0] || "", E = It(U).toLowerCase();
    return {
      initHealth: w,
      requestUrl: g,
      requestHost: h,
      configuredHost: ze(p),
      configuredLegacyHost: Kr(p),
      normalizedPathname: y,
      pathnameLower: _,
      adminPath: S,
      adminPathLower: T,
      adminLoginPath: b,
      adminLoginPathLower: R,
      segments: L,
      rootRaw: U,
      root: E
    };
  }, u = (m, p) => (p === "GET" || p === "HEAD") && m.pathnameLower === "/favicon.ico" || p === "GET" && m.normalizedPathname === "/" || Hi(m.pathnameLower, m.adminPathLower) || Ar(m.pathnameLower, m.adminLoginPathLower) ? !0 : m.adminPathLower === "/admin" && m.pathnameLower === "/api/auth/login" && m.root === "api" && m.segments[1] === "auth" && m.segments[2] === "login", f = {
    adminConsole: i,
    nodeProxy: c,
    scheduledMaintenance: l,
    workerHandler: Object.freeze({
      async fetch(m, p, g) {
        const h = d(m, p), y = m.method;
        if (!((y === "GET" || y === "HEAD") && h.pathnameLower === "/favicon.ico")) {
          const _ = await t.getRuntimeConfig(p), S = !!(h.configuredLegacyHost && h.configuredLegacyHost !== h.configuredHost && h.requestHost === h.configuredLegacyHost);
          if (_.enableHostPrefixProxy === !0 && h.configuredHost && !S && h.requestHost !== h.configuredHost && h.requestHost.endsWith(`.${h.configuredHost}`)) return c.handle(m, p, g, h);
        }
        if (u(h, y)) {
          const _ = await i.handle(m, p, g);
          if (_) return _;
        }
        return c.handle(m, p, g, h);
      },
      scheduled(m, p, g) {
        return l.handle(m, p, g);
      }
    })
  };
  return o === !0 && (f.testingSupport = Object.freeze({
    cacheManager: r,
    kernel: e,
    logger: a,
    shellService: n,
    buildNodeRouteContext: d,
    buildRouteCorsResponse(m, p, g, h = 200) {
      return n.buildEdgeCorsResponse(Yr(p, m), g, h, { mergeOriginVary: !0 });
    },
    isPlaybackCriticalRouteContext(m) {
      const p = Array.isArray(m?.segments) ? m.segments : [];
      return p.length <= 1 ? !1 : n.isPlaybackCriticalSegments(p, 1) ? !0 : p.length > 2 && n.isPlaybackCriticalSegments(p, 2);
    },
    isolateState: Fl,
    proxyService: s.testingSupport
  })), Object.freeze(f);
}
var { workerHandler: Ih } = Dh();
export {
  Ih as default
};
