/**
 * 常驻音乐播放器的展开/收起，收起状态记录在本地，刷新或切换页面后保持。
 */
(function () {
    var STORAGE_KEY = 'fan-music-collapsed';
    var player = document.getElementById('music-player');
    if (!player) {
        return;
    }
    var bar = player.querySelector('.music-player-bar');
    if (!bar) {
        return;
    }

    function setCollapsed(collapsed) {
        player.classList.toggle('collapsed', collapsed);
        try {
            localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        } catch (e) {
            // localStorage 不可用时忽略
        }
    }

    try {
        if (localStorage.getItem(STORAGE_KEY) === '1') {
            player.classList.add('collapsed');
        }
    } catch (e) {
        // localStorage 不可用时忽略
    }

    bar.addEventListener('click', function () {
        setCollapsed(!player.classList.contains('collapsed'));
    });
}());
