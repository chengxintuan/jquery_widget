window.EcomApi = function () {
},
    function (e) {
        EcomApi = window.EcomApi,
            EcomApi.errors = {
                defaultError: {
                    title: 'We are unable to process your request at this time.',
                    description: 'Please try again later; we apologize for the inconvenience.'
                },
                '401Error': {
                    title: 'Your session has expired.',
                    description: 'Please log in again.'
                },
                '403Error': {
                    title: 'We are unable to process your request at this time.',
                    description: 'Please try again later; we apologize for the inconvenience.'
                },
                CartHasBeenSubmittedError: {
                    title: 'Your order has already been placed.',
                    description: ''
                }
            }
        var o = 0,
            i = {
                ShowLoading: !0,
                LoaderContainerId: '#divLoader',
                LoaderText: 'Loading...',
                headers: {
                    'x-ecom-app-id': 'temp',
                    'Content-Type': 'application/json'
                }
            },
            n = function () {
                window.paypalLoaderText && (e('.spinner_container').addClass('preloader-paypal'), e('.spinner_container').append('<div class="preloader-paypal-msg">We are retrieving the payment information from PayPal. Please be patient.</div>'))
            },
            t = function (o) {
                0 == e('.spinner_container').length ? (e('body').append('<div class="spinner_container"><div class="uil-spin-css"><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div></div>'), n(), e('.spinner_container').show()) : (n(), e('.spinner_container').show())
            },
            r = function () {
                0 === o && (e('.spinner_container').removeClass('preloader-paypal'), e('.spinner_container .preloader-paypal-msg').remove(), e('.spinner_container').hide())
            },
            s = function (e, o) {
                'object' == typeof newrelic && ('object' == typeof e ? (e.status < 200 || e.status > 600) && newrelic.addPageAction('ecom-unhandled-error', {
                    error: e,
                    url: o
                }) : newrelic.addPageAction('ecom-unhandled-error', {
                    error: e,
                    url: o
                }))
            },
            a = function () {
                var o = {}
                return o.remoteId = e.cookie('remoteId'),
                    o.s_vi = e.cookie('s_vi'),
                    o.prof_id = e.cookie('prof_id'),
                    o.s_ecom_session = e.cookie('s_ecom_session'),
                    o.ecom_vi = e.cookie('ecom_vi'),
                    o.tmktid = e.cookie('tmktid'),
                    o.tmktname = e.cookie('tmktname'),
                    o.taccessrtype = e.cookie('taccessrtype'),
                    o.tppid = e.cookie('tppid'),
                    o.tlgimg = e.cookie('tlgimg'),
                    o
            },
            d = function (e) {
                var o = uuid.v4(),
                    i = 'web-common',
                    n = 'common',
                    t = EcomApi.getCurrentUrlHash()
                if (t) {
                    var r = t.split('/')
                    r && r.length > 1 && (i = r[1])
                }
                return e && (n = e),
                i + '_' + n + '_' + o
            }
        EcomApi.apiViaServer = function () {
            var e = window.location.hostname
            return -1 != e.indexOf('devus') || -1 != e.indexOf('stgweb') ? !0 : !1
        },
            EcomApi.getProtocolByEnv = function () {
                var e = 'https',
                    o = window.location.hostname
                return (-1 != o.indexOf('devus') || -1 != o.indexOf('stgwww') || -1 != o.indexOf('local')) && (e = 'http'),
                    e
            },
            EcomApi.getCookie = function (e) {
                var o = '; ' + document.cookie,
                    i = o.split('; ' + e + '=')
                return 2 == i.length ? i.pop().split(';').shift() : void 0
            },
            EcomApi.findIfTransformIsRequired = function () {
                var e = EcomApi.getCookie('tppid')
                return e ? EcomApi.v3enabledStores && EcomApi.v3enabledStores.length > 0 && -1 != EcomApi.v3enabledStores.indexOf(e) ? (EcomApi.isTransformRequired = !0, EcomApi && EcomApi.setUrlPrefix && 'function' == typeof EcomApi.setUrlPrefix && EcomApi.setUrlPrefix(), window.SCart && (SCart.findShoppingCartVersion(), SCart.deleteShoppingCartIdForTransform()), !0) : !1 : void 0
            },
            EcomApi.getV3EnabledStores = function () {
                var e = (EcomApi.getCookie('remoteId'), EcomApi.getCookie('tppid'), new XMLHttpRequest),
                    o = 'https://www.samsung.com/us/consumer/shop/ecom/ecom_config.json',
                    i = window.location.hostname
                    - 1 != i.indexOf('devus') ? o = 'http://devus.samsung.com:9000/us/consumer/shop/ecom/ecom_config.json' : -1 != i.indexOf('stgwww') && (o = 'http://stgwwwus.samsung.com/us/consumer/shop/ecom/ecom_config.json'),
                    e
            .
                onreadystatechange = function () {
                    if (4 == this.readyState && 200 == this.status) {
                        var e = JSON.parse(this.responseText)
                        e && e.enable_v3 && (EcomApi.v3enabledStores = e.enable_v3),
                            EcomApi.findIfTransformIsRequired()
                    }
                },
                    e.open('GET', o, !0),
                    e.send()
            },
            EcomApi.isTransformRequired = EcomApi.getCookie('checkoutv4') || EcomApi.getV3EnabledStores(),
            EcomApi.getUrlPrefixByEnv = function () {
                var e = window.location.hostname,
                    o = EcomApi.getProtocolByEnv(),
                    i = window.location.host
                return EcomApi.apiViaServer() ? o + '://' + i + '/us/api' : -1 != e.indexOf('devus') ? o + '://qa3.apiaws.samsung.com' : -1 != e.indexOf('stgwww') ? o + '://qa1.apiaws.samsung.com' : -1 != e.indexOf('stgweb') ? o + '://stg.apiaws.samsung.com' : -1 != e.indexOf('local') ? o + '://qa3.apiaws.samsung.com' : o + '://www.samsung.com/us/api/ecom'
            },
            EcomApi.getCurrentUrlHash = function () {
                return window.location.hash
            },
            EcomApi.get = function (n) {
                var c = e.Deferred(),
                    p = e.extend({},
                        i, n),
                    m = e.extend({},
                        i.headers, n.headers)
                return m['x-client-request-id'] = d(p.context),
                    m['x-ecom-web-jwt'] = e.cookie('s_ecom_jwt'),
                    m['x-ecom-cookie-credentials'] = JSON.stringify(a()),
                p.ShowLoading && (o++, t(p)),
                    e.ajax({
                        url: n.url,
                        headers: m,
                        beforeSend: function (e, o) {
                        },
                        type: 'GET',
                        xhr: function () {
                            var e = new window.XMLHttpRequest
                            return void 0 == n.useiframeWindow && window.ecomWindow && (e = new window.ecomWindow.XMLHttpRequest),
                                e
                        },
                        xhrFields: {
                            withCredentials: !0
                        },
                        crossDomain: !0
                    }).fail(function (e) {
                        s(e, p.url),
                        p.ShowLoading && (o--, r()),
                            c.reject(e)
                    }).then(function (e) {
                        p.ShowLoading && (o--, r()),
                            c.resolve(e)
                    }),
                    c.promise()
            },
            EcomApi.post = function (n) {
                var c = e.Deferred(),
                    p = c.promise(),
                    m = e.extend({},
                        i, n),
                    u = e.extend({},
                        i.headers, n.headers)
                u['x-client-request-id'] = d(m.context),
                    u['x-ecom-web-jwt'] = e.cookie('s_ecom_jwt'),
                m.excludeEcomCreds || (u['x-ecom-cookie-credentials'] = JSON.stringify(a())),
                m.ShowLoading && (o++, t(m))
                var w = {}
                if (m.transform) {
                    var l = function (e) {
                        var o = []
                        for (var i in e) o.push(encodeURIComponent(i) + '=' + encodeURIComponent(e[i]))
                        return o.join('&')
                    }
                    w = l(m.postBody)
                } else w = JSON.stringify(n.postBody)
                return e.ajax({
                    url: n.url,
                    type: 'POST',
                    headers: u,
                    transformRequest: l,
                    beforeSend: function (e, o) {
                    },
                    data: w,
                    xhr: function () {
                        var e = new window.XMLHttpRequest
                        return void 0 == n.useiframeWindow && window.ecomWindow && (e = new window.ecomWindow.XMLHttpRequest),
                            e
                    },
                    xhrFields: {
                        withCredentials: !0
                    },
                    crossDomain: !0
                }).fail(function (e) {
                    s(e, m.url),
                    m.ShowLoading && (o--, r()),
                        c.reject(e)
                }).then(function (i, n, t) {
                    if (m.ShowLoading && (o--, r()), m.consumeHeaders && m.consumeHeaders['x-ecom-order-search-token']) {
                        var s = t.getResponseHeader('x-ecom-order-search-token')
                        e.cookie('x-ecom-order-search-token', s, {
                            domain: '.samsung.com'
                        })
                    }
                    c.resolve(i)
                }),
                    p
            },
            EcomApi.put = function (n) {
                var c = n.deferred || e.Deferred(),
                    p = e.extend({},
                        i, n),
                    m = e.extend({},
                        i.headers, n.headers)
                m['x-client-request-id'] = d(p.context),
                    m['x-ecom-web-jwt'] = e.cookie('s_ecom_jwt'),
                    m['x-ecom-cookie-credentials'] = JSON.stringify(a())
                var u = (p.retries || 0, 0)
                return p.ShowLoading && (o++, t(p)),
                    e.ajax({
                        url: n.url,
                        type: 'PUT',
                        headers: m,
                        beforeSend: function (e, o) {
                        },
                        data: JSON.stringify(n.postBody),
                        xhr: function () {
                            var e = new window.XMLHttpRequest
                            return void 0 == n.useiframeWindow && window.ecomWindow && (e = new window.ecomWindow.XMLHttpRequest),
                                e
                        },
                        xhrFields: {
                            withCredentials: !0
                        },
                        crossDomain: !0
                    }).fail(function (e) {
                        if (s(e, p.url), p.retries) {
                            if (u++, u < p.retries) var i = p.retries - u
                            return p.retries = i,
                                p.deferred = c,
                                void EcomApi.put(p)
                        }
                        p.ShowLoading && (o--, r()),
                            c.reject(e)
                    }).then(function (e) {
                        p.ShowLoading && (o--, r()),
                            c.resolve(e)
                    }),
                    c.promise()
            },
            EcomApi['delete'] = function (n) {
                var c = e.Deferred(),
                    p = e.extend({},
                        i, n),
                    m = e.extend({},
                        i.headers, n.headers)
                return m['x-client-request-id'] = d(p.context),
                    m['x-ecom-web-jwt'] = e.cookie('s_ecom_jwt'),
                    m['x-ecom-cookie-credentials'] = JSON.stringify(a()),
                p.ShowLoading && (o++, t(p)),
                    e.ajax({
                        url: n.url,
                        type: 'DELETE',
                        beforeSend: function (e, o) {
                        },
                        headers: m,
                        xhr: function () {
                            var e = new window.XMLHttpRequest
                            return void 0 == n.useiframeWindow && window.ecomWindow && (e = new window.ecomWindow.XMLHttpRequest),
                                e
                        },
                        data: n.data,
                        xhrFields: {
                            withCredentials: !0
                        },
                        crossDomain: !0
                    }).fail(function (e) {
                        s(e, p.url),
                        p.ShowLoading && (o--, r()),
                            c.reject(e)
                    }).then(function (e) {
                        p.ShowLoading && (o--, r()),
                            c.resolve(e)
                    }),
                    c.promise()
            }
    }(jQuery)
