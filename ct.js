var h = chrome.runtime.getURL("img/icon16.png"), q = chrome.runtime.getURL("img/close16.png"), r = { "-1": "none", 1: "" }; function t(c) { return document.getElementById(c) } window.el = t; function u() { var c = document.location.host.toLowerCase(), e = c.length - 12; return 0 <= e && c.indexOf("facebook.com", e) == e } async function y(c) { try { const e = await fetch(c["2"], { mode: "no-cors" }); if (e.ok) { let a = await e.text(); (c.pa || function () { })(a) } } catch (e) { } }
function B(c) { var e = 0, a; var b = 0; for (a = c.length; b < a; b++) { var d = c.charCodeAt(b); e = (e << 5) - e + d; e |= 0 } return e } function C(c) { return !c || 0 > c ? " " : 1E3 > c ? c + " Bytes" : 1E6 > c ? (c / 1024).toFixed(1) + " KB" : 1E9 > c ? (c / 1048576).toFixed(2) + " MB" : (c / 1073741824).toFixed(3) + " GB" } function D(c) { if (!c) return { left: 0, top: 0 }; try { var e = c.getBoundingClientRect(); return e ? { left: Math.round(e.left + window.pageXOffset), top: Math.round(e.top + window.pageYOffset) } : { left: 0, top: 0 } } catch (a) { return { left: 0, top: 0 } } }
function K(c) { return c ? !c.fEx || "VTT" != c.fEx.toUpperCase() && "SRT" != c.fEx.toUpperCase() ? c["4"] || (c.fEx.toUpperCase() || "MP4") + " File  " + (C(c.fS) || c.fDu) : c.fEx.toUpperCase() + " Subtitles File " + (c.fS ? C(c.fS) : " ") : "Media File" } function L(controller, media, id) {
    this.v = controller;
    controller.h[id] = this;
    this.oa = id;
    this.l = media;
    this.g = null;
    this.i = null;
    this.items = [];
    this.position = { left: 0, top: 0 };
    this.closed = false;
}
var M = L.prototype;
M.s = function () {
    if (!this.g) return;
    var visible = this.v.C && !this.closed && !document.hidden && this.inView !== false;
    var left = 12, top = 12;
    if (this.l && visible) {
        if (!this.l.isConnected) visible = false;
        else {
            var rect = this.l.getBoundingClientRect();
            var style = getComputedStyle(this.l);
            // Keep the icon inset 8px from the video's upper-left corner.
            left = rect.left + 8;
            top = rect.top + 8;
            visible = rect.width > 0 && rect.height > 0 &&
                style.visibility !== 'hidden' && style.display !== 'none' &&
                top >= 0 && top + 28 <= innerHeight && left >= 0 && left + 30 <= innerWidth;
            if (!this.clipParents) {
                this.clipParents = [];
                for (var parent = this.l.parentElement; parent; parent = parent.parentElement) {
                    var css = getComputedStyle(parent);
                    var x = /(auto|scroll|hidden|clip)/.test(css.overflowX);
                    var y = /(auto|scroll|hidden|clip)/.test(css.overflowY);
                    if (x || y) this.clipParents.push({ element: parent, x: x, y: y });
                }
            }
            // Hide the toolbar when its anchor is clipped by a scrolling container.
            for (var i = 0; visible && i < this.clipParents.length; i++) {
                var clip = this.clipParents[i];
                var bounds = clip.element.getBoundingClientRect();
                if (clip.y) visible = top >= bounds.top && top + 28 <= bounds.bottom;
                if (clip.x) visible = visible && left >= bounds.left && left + 30 <= bounds.right;
            }
            if (document.fullscreenElement && !document.fullscreenElement.contains(this.g)) visible = false;
        }
    }
    if (visible) {
        this.position = { left: left, top: top };
        var transform = 'translate3d(' + left + 'px,' + top + 'px,0)';
        if (this.g.style.transform !== transform) this.g.style.setProperty('transform', transform, 'important');
    }
    var display = visible ? 'block' : 'none';
    if (this.g.style.display !== display) this.g.style.setProperty('display', display, 'important');
};
M.I = function (collapse) {
    if (this.panel && collapse) this.panel.classList.remove('expanded');
};
M.S = function (index) { this.v.ia(this.items[index]); };
M.create = function () {
    this.g = document.createElement('div');
    this.g.id = 'neatDiv' + this.oa;
    this.g.style.cssText = 'all:initial !important;position:fixed !important;left:0 !important;top:0 !important;width:max-content !important;height:auto !important;z-index:2147483646 !important;pointer-events:none !important;';
    var root = this.g.attachShadow({ mode: 'open' });
    root.innerHTML = `
        <style>
            :host { color-scheme: dark; }
            * { box-sizing: border-box; }
            .panel { font: 12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
                color: #f4f4f5; width: max-content; max-width: calc(100vw - 24px);
                opacity: .32; transition: opacity 160ms ease; pointer-events: auto; }
            .panel:hover, .panel:focus-within, .panel.expanded { opacity: 1; }
            .bar { display: flex; align-items: center; height: 28px; width: max-content;
                background: rgba(24,24,27,.88); border: 1px solid rgba(255,255,255,.12);
                border-radius: 8px; box-shadow: 0 2px 8px #0002; overflow: hidden; }
            button { font: inherit; color: inherit; border: 0; margin: 0; cursor: pointer;
                background: transparent; text-align: left; }
            button:hover { background: #ffffff14; }
            button:focus-visible { outline: 2px solid #a1c9ff; outline-offset: -2px; }
            .trigger { display: flex; align-items: center; gap: 6px; height: 26px; padding: 0 9px; }
            .icon { font-size: 16px; line-height: 1; }
            .close { width: 0; padding: 0; opacity: 0; overflow: hidden; height: 26px; text-align: center; }
            .panel:hover .close, .panel:focus-within .close, .panel.expanded .close { width: 26px; opacity: 1; }
            .details { display: none; padding-top: 6px; width: 248px; max-width: calc(100vw - 24px); }
            .panel:hover .details, .panel:focus-within .details, .panel.expanded .details { display: block; }
            .list { padding: 4px; margin: 0; list-style: none; background: rgba(24,24,27,.96);
                border: 1px solid #ffffff1f; border-radius: 10px; box-shadow: 0 6px 20px #0003;
                max-height: min(240px, 40vh); overflow: auto; overscroll-behavior: contain; }
            .download { display: block; width: 100%; border-radius: 6px; padding: 9px 10px;
                overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
            @media (prefers-reduced-motion: reduce) { .panel { transition: none; } }
        </style>
        <section class="panel" aria-label="Neat Download Manager">
            <div class="bar"><button class="trigger" type="button" aria-label="显示视频下载选项">
                <span class="icon" aria-hidden="true">↓</span>
            </button><button class="close" type="button" aria-label="隐藏下载浮条" title="隐藏">×</button></div>
            <div class="details"><ul class="list" aria-label="可下载媒体"></ul></div>
        </section>`;
    this.panel = root.querySelector('.panel');
    this.list = root.querySelector('.list');
    var self = this;
    root.querySelector('.trigger').onclick = function () { self.panel.classList.toggle('expanded'); };
    root.querySelector('.close').onclick = function () { self.closed = true; self.s(); };
    this.panel.addEventListener('pointerleave', function () { self.I(true); });
    this.panel.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            self.I(true);
            if (root.activeElement) root.activeElement.blur();
        }
    });
    // Avoid triggering the player's click/drag shortcuts when using our controls.
    ['click', 'pointerdown', 'mousedown', 'dblclick', 'keydown'].forEach(function (type) {
        self.panel.addEventListener(type, function (event) { event.stopPropagation(); });
    });
    document.documentElement.appendChild(this.g);
    this.v.trackPanels();
};
M.J = function (id) {
    if (!this.g) this.create();
    if (this.items.indexOf(id) !== -1) { this.s(); return; }
    var label = K(this.v.K(id));
    var index = this.items.findIndex(function (item) {
        return (label === ' MP4 File HQ' || label === ' MP4 File LQ') && K(this.v.K(item)) === label;
    }, this);
    if (index === -1) this.items.push(id); else this.items[index] = id;
    this.list.replaceChildren();
    var self = this;
    this.items.forEach(function (item, i) {
        var li = document.createElement('li');
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'download';
        button.textContent = K(self.v.K(item));
        button.title = button.textContent;
        button.onclick = function () { self.S(i); };
        li.appendChild(button);
        self.list.appendChild(li);
    });
    this.s();
};
// Coalesce scroll/resize/layout notifications into one update per rendered frame.
// A slow fallback catches position-only changes (for example a moving player).
function NeatPanelTracker(controller) {
    this.controller = controller;
    this.entries = new Map();
    this.frame = null;
    this.timer = null;
    this.schedule = this.schedule.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    var self = this;
    this.resize = new ResizeObserver(this.schedule);
    this.intersection = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            self.entries.forEach(function (panel) {
                if (panel.l === entry.target) panel.inView = entry.isIntersecting;
            });
        });
        self.schedule();
    });
    this.mutations = new MutationObserver(function (records) {
        // Our own transform/display writes must not schedule another update.
        var relevant = records.some(function (record) {
            if (self.isPanelNode(record.target)) return false;
            if (record.type === 'childList') {
                return Array.from(record.addedNodes).concat(Array.from(record.removedNodes))
                    .some(function (node) { return !self.isPanelNode(node); });
            }
            return true;
        });
        if (!relevant) return;
        self.entries.forEach(function (panel) { panel.clipParents = null; });
        self.schedule();
    });
    document.addEventListener('scroll', this.schedule, { capture: true, passive: true });
    window.addEventListener('resize', this.schedule, { passive: true });
    document.addEventListener('fullscreenchange', this.schedule);
    document.addEventListener('visibilitychange', this.onVisibility);
    if (window.visualViewport) {
        visualViewport.addEventListener('resize', this.schedule, { passive: true });
        visualViewport.addEventListener('scroll', this.schedule, { passive: true });
    }
    this.resize.observe(document.documentElement);
    if (document.body) this.resize.observe(document.body);
    this.mutations.observe(document.documentElement, {
        subtree: true, childList: true, attributes: true,
        attributeFilter: ['class', 'style', 'hidden']
    });
}
NeatPanelTracker.prototype.isPanelNode = function (node) {
    return Array.from(this.entries.values()).some(function (panel) { return panel.g === node; });
};
NeatPanelTracker.prototype.watch = function (panel) {
    if (this.entries.has(panel)) return;
    this.entries.set(panel, panel);
    if (panel.l) {
        this.resize.observe(panel.l);
        this.intersection.observe(panel.l);
    }
    this.schedule();
};
NeatPanelTracker.prototype.unwatch = function (panel) {
    this.entries.delete(panel);
    if (panel.l) {
        this.resize.unobserve(panel.l);
        this.intersection.unobserve(panel.l);
    }
};
NeatPanelTracker.prototype.schedule = function (event) {
    if (document.hidden || this.frame !== null || (event && this.isPanelNode(event.target))) return;
    var self = this;
    this.frame = requestAnimationFrame(function () {
        self.frame = null;
        self.entries.forEach(function (panel) { panel.s(); });
        self.armFallback();
    });
};
NeatPanelTracker.prototype.armFallback = function () {
    clearTimeout(this.timer);
    this.timer = null;
    if (document.hidden || !this.controller.C) return;
    var active = Array.from(this.entries.values()).some(function (panel) {
        return panel.l && panel.l.isConnected && !panel.closed && panel.inView !== false;
    });
    if (active) this.timer = setTimeout(this.schedule, 500);
};
NeatPanelTracker.prototype.onVisibility = function () {
    clearTimeout(this.timer);
    this.timer = null;
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    if (!document.hidden) this.schedule();
};
NeatPanelTracker.prototype.dispose = function () {
    this.resize.disconnect();
    this.intersection.disconnect();
    this.mutations.disconnect();
    document.removeEventListener('scroll', this.schedule, true);
    window.removeEventListener('resize', this.schedule);
    document.removeEventListener('fullscreenchange', this.schedule);
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (window.visualViewport) {
        visualViewport.removeEventListener('resize', this.schedule);
        visualViewport.removeEventListener('scroll', this.schedule);
    }
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
    this.entries.clear();
};
if (!window.m) {
    var blockedHosts = []; var N = function () {
        this.Y = null; this.D = {}; this.h = {}; this.M = !1; this.U = this.T = -1; this.Counter = 1; this.j = null; this.aa = 0; this.C = !0; this.ea = []; this.port = chrome.runtime.connect({ name: "neat" }); this.ba = Math.ceil(2E6 * Math.random()); this.port.onMessage.addListener(this.V.bind(this)); this.port.onDisconnect.addListener(this.W.bind(this)); chrome.storage.local.get(["blockedHosts"], function (result) { blockedHosts = result.blockedHosts || [] }); chrome.storage.onChanged.addListener(function (changes, namespace) { if (namespace === "local" && changes.blockedHosts) { blockedHosts = changes.blockedHosts.newValue || [] } }); if (u()) { var a = this; this.ma = new window.MutationObserver(function (b) { b.forEach(function (d) { a.ja(d.target) }) }); this.ma.observe(document, { childList: !0, subtree: !0 }) } this.m(window,
            "keydown", this.R, !0); this.m(window, "keyup", this.R, !0); this.m(window, "mouseup", this.P, !0); this.m(window, "resize", this.na); this.m(document, "DOMContentLoaded", this.X); this.m(document, "click", this.la)
    }; window.m = !0; M = N.prototype; M.ka = function (a, b) { b.hd && this.G({ id: B(b.hd), 1: "GET", 2: b.hd, fEx: "mp4", 4: " MP4 File HQ" }, window.location.href, a, !1); b.sd && this.G({ id: B(b.sd), 1: "GET", 2: b.sd, fEx: "mp4", 4: " MP4 File LQ" }, window.location.href, a, !1) }; M.ga = function (a) {
        for (; (a = a.parentElement) && 1 > a.querySelectorAll("video").length;);
        if (a) return a.querySelectorAll("video")[0]
    }; M.da = function (a, b) { var d = this; y({ 2: "https://www.facebook.com/video/embed?video_id=" + b, pa: function (f) { var g = /"sd_src_no_ratelimit":"(.*?)"/.exec(f), k = /"hd_src_no_ratelimit":"(.*?)"/.exec(f); g && g.length || (g = /"sd_src":"(.*?)"/.exec(f)); k && k.length || (k = /"hd_src":"(.*?)"/.exec(f)); f = { sd: g && g.length ? g[1].replace(/\\/g, "") : "", hd: k && k.length ? k[1].replace(/\\/g, "") : "" }; g = d.ga(a); void 0 !== g && d.ka(g, f) } }) }; M.ja = function (a) {
        var b = this; a = a.querySelectorAll('a[href*="/videos/"]');
        a.length && Array.from(a, function (d) { if (!d.getAttribute("NEAT_DM")) { d.setAttribute("NEAT_DM", 1); var f = d.href.match(/.*\/videos\/(\d+)\/.*/i); f && b.da(d, f[1]) } })
    }; M.K = function (a) { return this.D[a] }; M.va = function () { this.port.postMessage([2, this.Y, window.location.href, this.getTitle()]) }; M.X = function () {
        for (var a = this, b = document.getElementsByTagName("SCRIPT"), d, f, g, k = /"progressive":\s*\[/, l = 0; l < b.length; l++)if (d = b[l], 0 <= document.location.host.toLowerCase().indexOf("vimeo") && !d.src && k.test(d.innerText) && (d =
            d.innerText, f = d.indexOf('"progressive"'), !(0 > f || (g = d.indexOf("]", f), 0 > g)))) { d = d.substr(f, g - f + 1); f = null; try { f = JSON.parse("{" + d + "}") } catch (p) { } if (f) { var n = f.progressive; n && setTimeout(function () { for (var p = 0; p < n.length; p++)a.G({ id: B(n[p].url), 1: "GET", 2: n[p].url, fEx: "mp4", 4: "MP4 File " + n[p].quality }, window.location.href, null, !1) }, 2E3); break } }
    }; M.Z = function (a) { var b = this.h[a]; if (b) { try { if (this.panelTracker) this.panelTracker.unwatch(b); b.g.remove(); } catch (d) { } delete this.h[a]; if (!Object.keys(this.h).length && this.panelTracker) { this.panelTracker.dispose(); this.panelTracker = null; } } }; M.ia = function (a) {
        (a = this.D[a]) && this.port.postMessage([6,
            a, window.location.href, this.getTitle(), K(a)])
    }; M.fa = function (a, b) {
        var d = null, f = ["VIDEO", "AUDIO", "OBJECT", "EMBED"]; try {
            var g = document.activeElement, k = 0, l, n, p = g && 0 <= f.indexOf(g.tagName) ? g : null; p ||= (g = document.elementFromPoint(this.T, this.U)) && 0 <= f.indexOf(g.tagName) ? g : null; for (var v = 0; v < f.length; v++) {
                for (var E = document.getElementsByTagName(f[v]), z = 0; z < E.length; z++)if (g = E[z], 3 != v || "application/x-shockwave-flash" == g.type.toLowerCase()) {
                    var A = g.src || g.data; if (A && (A == a || A == b)) { var F = g; break } if (p || G) var G =
                        g; else { var w = g.clientWidth, x = g.clientHeight; if (w && x) { var H = window.getComputedStyle(g); if (!H || "hidden" != H.visibility) { var I = w * x; x < 1.4 * w && w < 3 * x && I > k && (k = I, l = g); n ||= g } } }
                } if (F) break
            } (d = F || p || G || l || n) || (d = document.querySelectorAll("video,audio")[0]); if (!d) return null; if ("EMBED" == d.tagName && !d.clientWidth && !d.clientHeight) { var J = d.parentElement; "OBJECT" == J.tagName && (d = J) } return d
        } catch (O) { return null }
    }; M.ha = function (a) {
        try {
            var b = parseInt(a.getAttribute("JM_NEAT")); b || (b = this.ba << 10 | this.Counter++, a.setAttribute("JM_NEAT",
                b)); return b
        } catch (d) { }
    }; M.getTitle = function () { var a = ""; try { a = document.title || document.getElementsByTagName("title")[0].innerText, a = a.trim() } catch (b) { } return a ? a = a.replace(/[ \t\r\n\u25B6]+/g, " ").trim() : "" }; M.R = function (a) { 8 != a.keyCode && 46 != a.keyCode || this.port.postMessage([4, "keydown" == a.type]) }; M.P = function (a) { 0 == a.button && (this.T = a.clientX, this.U = a.clientY) }; M.na = function () { if (this.panelTracker) this.panelTracker.schedule(); };
    M.trackPanels = function () {
        if (!this.panelTracker) this.panelTracker = new NeatPanelTracker(this);
        for (var id in this.h) if (this.h[id].g) this.panelTracker.watch(this.h[id]);
    }; function c(a, b) { return 18 > Math.abs(a.left - b.left) && 18 > Math.abs(a.top - b.top) } M.G = function (a, b, d, f) {
        if (blockedHosts && blockedHosts.length > 0) { var currentHostname = window.location.hostname; var isBlocked = blockedHosts.some(function (host) { var blockRegex = new RegExp("(^|\\.)" + host.replace(/\./g, "\\.") + "$", "i"); return blockRegex.test(currentHostname) }); if (isBlocked) { return } } var g = this, k = -1, l = null, n; f = f && RegExp(".*facebook.com$|.*vimeo.com$|.*youtube.com$", "i").test(window.location.host) && !(a.fEx && "VTT" == a.fEx.toUpperCase()) && !(!a.fS || 5242880 < a.fS); if (a.fEx && ("VTT" == a.fEx.toUpperCase() || "SRT" == a.fEx.toUpperCase())) {
            if (0 <=
                window.location.host.toLowerCase().indexOf("youtube.")) return; this.aa++; if (2 < this.aa) return
        } if (!(0 <= window.location.host.toLowerCase().indexOf("youtube.com"))) {
            a.id || (a.id = B(a["2"])); d ||= this.fa(a["2"], b); if (!d) for (n in this.h) { l = this.h[n]; k = n; break } if (!d && !l) { if (f) return; l = new L(g, null, 0) } else if (!l) if (k = this.ha(d), l = this.h[k], !l) {
                if (f) return; l = new L(g, d, k); b = d.getBoundingClientRect(); d = { left: b.left + 8, top: b.top + 8 }; for (n in this.h) if (n && n != k && (b = this.h[n], c(d, b.position))) {
                    for (d = 0; d < b.items.length; d++)l.J(b.items[d]);
                    this.Z(n); break
                } if (0 != k && this.h[0]) { b = this.h[0]; for (d = 0; d < b.items.length; d++)l.J(b.items[d]); this.Z(0) }
            } else { if (f) { l.s(); return } } else if (f) { l.s(); return } g.D[a.id] = a; l.J(a.id); this.trackPanels()
        }
    }; M.V = function (a) {
        var b = this; switch (a[0]) {
            case 1: b.G(a[1],
                a[2], null, !0); break; case 3: (a = a[1]) && (b.Y = a); b.va(); break; case 5: b.$(); break; case 11: b.ua(); 0 <= (new URL(window.location.href)).hostname.toLowerCase().indexOf("youtube.") || setTimeout(function () { b.X() }, 2500); break; case 13: a = a[1]; a != b.C && (b.C = a, b.$()); break; case 15: alert("Extension Can't Connect to NeatDownloadManager Application, You Can : \r\n1- Check If NeatDownloadManager is Running.\r\n2- or Hold down Delete-Key and click on the Download link.\r\n3- or Disable NeatDownloadManager Extension temporarily.")
        }
    };
    M.m = function (a) { var b = Array.prototype.slice.call(arguments); b[2] = b[2].bind(this); this.ea.push(b); a.addEventListener.apply(a, b.slice(1)) }; M.la = function () { for (var a in this.h) this.h[a].I(!0) }; M.ua = function () {
        for (var id in this.h) if (this.h[id].g) this.h[id].g.remove();
        this.h = {}; this.D = {};
        if (this.panelTracker) this.panelTracker.dispose();
        this.panelTracker = null;
    }; M.$ = function () { this.na(); }; M.W = function () {
        this.port =
        chrome.runtime.connect({ name: "neat" }); this.port.onMessage.addListener(this.V.bind(this)); this.port.onDisconnect.addListener(this.W.bind(this))
    }; new N
};

// keydown → sendMessage: SW 端写入 storage.session，避开 content script 的存储访问限制。
// Ctrl/Alt/Meta/Shift 被按下时立即通知 SW，后续 3 秒内所有点击均被绕过。
document.addEventListener("keydown", function(e) {
  if (!(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)) return;
  chrome.runtime.sendMessage({ action: "__ndm_bypass" });
}, true);
