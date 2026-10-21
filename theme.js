// Theme toggle. The page head applies a saved choice before paint; with no saved
// choice the page follows the system setting via prefers-color-scheme.
(function () {
    var root = document.documentElement;
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var media = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
        return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
    }
    function label() {
        var next = current() === 'dark' ? 'light' : 'dark';
        btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
        btn.title = 'Switch to ' + next + ' theme';
    }

    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        label();
    });
    if (media.addEventListener) media.addEventListener('change', label);
    label();
})();
