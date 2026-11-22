/**
 * 站内跳转使用 fetch + innerHTML 替换完成，避免整页重载。
 * 由于 #content-inner 与 #sidebar 之外的内容不会被替换，
 * 固定在页面上的音乐播放器（#music-player 里的 iframe）在切换页面时不会重新加载。
 */
(function () {
    if (!window.fetch || !window.history || !window.history.pushState || !window.DOMParser) {
        return;
    }

    var CONTENT_SELECTOR = '#content-inner';
    var SIDEBAR_SELECTOR = '#sidebar';
    var loading = false;

    function resolve(href) {
        try {
            return new URL(href, location.href);
        } catch (e) {
            return null;
        }
    }

    function isNavigable(link, event) {
        if (!link) {
            return false;
        }
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return false;
        }
        if (link.target && link.target !== '_self') {
            return false;
        }
        if (link.hasAttribute('download') || link.hasAttribute('data-no-pjax')) {
            return false;
        }
        var url = resolve(link.getAttribute('href'));
        if (!url || url.origin !== location.origin) {
            return false;
        }
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }
        // 同页锚点交给浏览器处理
        if (url.pathname === location.pathname && url.search === location.search && url.hash) {
            return false;
        }
        return true;
    }

    function resetScroll(url) {
        if (!window.jQuery || !$.fn.mCustomScrollbar) {
            window.scrollTo(0, 0);
            return;
        }
        $('#content-outer').mCustomScrollbar('update');
        if (url.hash) {
            var target = document.querySelector(decodeURIComponent(url.hash));
            if (target) {
                $('#content-outer').mCustomScrollbar('scrollTo', target, { scrollInertia: 300 });
                return;
            }
        }
        $('#content-outer').mCustomScrollbar('scrollTo', 'top', { scrollInertia: 0 });
    }

    function afterSwap(url) {
        if (window.fanBindScroll) {
            window.fanBindScroll();
        }
        if (window.fanBindSidebar) {
            window.fanBindSidebar();
        }
        if (window.fanBindCopy) {
            window.fanBindCopy();
        }
        resetScroll(url);
        if (window.MathJax && MathJax.Hub) {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
        }
    }

    function swap(doc, url) {
        var incoming = doc.querySelector(CONTENT_SELECTOR);
        var current = document.querySelector(CONTENT_SELECTOR);
        if (!incoming || !current) {
            return false;
        }
        current.innerHTML = incoming.innerHTML;

        var incomingSidebar = doc.querySelector(SIDEBAR_SELECTOR);
        var currentSidebar = document.querySelector(SIDEBAR_SELECTOR);
        if (incomingSidebar && currentSidebar) {
            currentSidebar.innerHTML = incomingSidebar.innerHTML;
        }

        if (doc.title) {
            document.title = doc.title;
        }
        afterSwap(url);
        return true;
    }

    function navigate(href, push) {
        if (loading) {
            return;
        }
        var url = resolve(href);
        if (!url) {
            return;
        }
        loading = true;
        fetch(url.href, { credentials: 'same-origin' })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('HTTP ' + res.status);
                }
                return res.text();
            })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');
                // 加密文章复用 head 中定义的密码校验，避免整页重载打断音乐
                var password = doc.body && doc.body.getAttribute('data-password');
                if (password && window.fanCheckPassword && !window.fanCheckPassword(password)) {
                    loading = false;
                    return;
                }
                if (!swap(doc, url)) {
                    throw new Error('missing ' + CONTENT_SELECTOR);
                }
                if (push) {
                    history.pushState({ pjax: true }, '', url.href);
                }
                loading = false;
            })
            .catch(function () {
                location.href = url.href;
            });
    }

    document.addEventListener('click', function (event) {
        if (loading) {
            return;
        }
        var link = event.target && event.target.closest ? event.target.closest('a') : null;
        if (!isNavigable(link, event)) {
            return;
        }
        event.preventDefault();
        navigate(link.href, true);
    });

    window.addEventListener('popstate', function () {
        navigate(location.href, false);
    });
}());
