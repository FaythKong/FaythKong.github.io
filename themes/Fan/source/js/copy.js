$(function () {
    var $copyIcon = $('<i class="fa fa-clipboard" aria-hidden="true"></i>');
    var $notice = $('<div class="copy-notice"></div>');

    /**
     * @description 代码块复制按钮，pjax 切换页面后需要重新注入
     */
    function addCopyButtons() {
        $('figure.highlight').each(function () {
            var $figure = $(this);
            if ($figure.children('.fa-clipboard').length > 0) {
                return;
            }
            $figure.prepend($copyIcon.clone());
            $figure.prepend($notice.clone());
        });
    }

    // copy function
    function copy (text, ctx) {
        if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            try {
                document.execCommand('copy'); // Security exception may be thrown by some browsers.
                $(ctx).prev('.copy-notice')
                    .text(GLOBAL_CONFIG.copy.success)
                    .velocity({
                        translateX: -30,
                        opacity: 1
                    }, {
                        loop: 1,
                        duration: 750,
                        easing: 'easeOutQuint'
                    });
            } catch (ex) {
                $(ctx).prev('.copy-notice')
                    .text(GLOBAL_CONFIG.copy.error)
                    .velocity({
                        translateX: -30,
                        opacity: 1
                    }, {
                        loop: 1,
                        duration: 750,
                        easing: 'easeOutQuint'
                    });
                return false;
            }
        } else {
            $(ctx).prev('.copy-notice').text(GLOBAL_CONFIG.copy.noSupport);
        }
    }
    // click events
    $(document).on('click', '.highlight .fa-clipboard', function () {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents($(this).next('table').find('.code pre')[0]);
        selection.removeAllRanges();
        selection.addRange(range);
        var text = selection.toString();
        copy(text, this);
        selection.removeAllRanges();
    });

    window.fanBindCopy = addCopyButtons;
    addCopyButtons();
});
