// Filter chips for the app grid. Without JS every card stays visible.
(function () {
    var chips = document.querySelectorAll('.chip[data-filter]');
    var cards = document.querySelectorAll('#apps .card');
    var empty = document.getElementById('appsEmpty');
    var status = document.getElementById('filterStatus');
    var bar = document.querySelector('.chips');
    if (!chips.length || !cards.length) return;
    if (bar) bar.hidden = false;

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var f = chip.getAttribute('data-filter');
            chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
            var shown = 0;
            cards.forEach(function (card) {
                var tags = (card.getAttribute('data-tags') || '').split(' ');
                var show = f === 'all' || tags.indexOf(f) !== -1;
                card.hidden = !show;
                if (show) shown++;
            });
            if (empty) empty.hidden = shown !== 0;
            if (status) status.textContent = shown + (shown === 1 ? ' app' : ' apps') + ' shown';
        });
    });
})();
