const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
});

function updateThemeUI(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
        themeLabel.textContent = 'Dark';
    } else {
        themeIcon.className = 'fas fa-sun';
        themeLabel.textContent = 'Light';
    }
}

document.getElementById('pdfExport').addEventListener('click', () => {
    window.print();
});


const navLinks = document.querySelectorAll('.section-nav a');
const sections = document.querySelectorAll('.section[id]');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

document.querySelectorAll('.collapsible .item-header').forEach(header => {
    header.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        header.closest('.collapsible').classList.toggle('collapsed');
    });
});

const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');

const cmdItems = [
    { label: 'Summary', icon: 'fas fa-user', action: () => scrollToSection('summary'), hint: 'Section' },
    { label: 'Experience', icon: 'fas fa-briefcase', action: () => scrollToSection('experience'), hint: 'Section' },
    { label: 'Projects & Homelab', icon: 'fas fa-code', action: () => scrollToSection('projects'), hint: 'Section' },
    { label: 'Education', icon: 'fas fa-graduation-cap', action: () => scrollToSection('education'), hint: 'Section' },
    { label: 'Skills', icon: 'fas fa-tools', action: () => scrollToSection('skills'), hint: 'Section' },
    { label: 'Publications', icon: 'fas fa-book', action: () => scrollToSection('publications'), hint: 'Section' },
    { label: 'Toggle Theme', icon: 'fas fa-adjust', action: () => themeToggle.click(), hint: 'Action' },
    { label: 'Download PDF', icon: 'fas fa-download', action: () => window.print(), hint: 'Action' },
    { label: 'Back to Top', icon: 'fas fa-arrow-up', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), hint: 'Action' },
];

let cmdActiveIndex = 0;

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function openPalette() {
    cmdOverlay.classList.add('open');
    cmdInput.value = '';
    cmdActiveIndex = 0;
    renderResults(cmdItems);
    cmdInput.focus();
}

function closePalette() {
    cmdOverlay.classList.remove('open');
}

function renderResults(items) {
    cmdResults.innerHTML = '';
    items.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'cmd-item' + (i === cmdActiveIndex ? ' active' : '');
        div.innerHTML = '<i class="' + item.icon + ' cmd-item-icon"></i>'
            + '<span class="cmd-item-label">' + item.label + '</span>'
            + '<span class="cmd-item-hint">' + item.hint + '</span>';
        div.addEventListener('click', () => { closePalette(); item.action(); });
        div.addEventListener('mouseenter', () => {
            cmdActiveIndex = i;
            cmdResults.querySelectorAll('.cmd-item').forEach((el, j) => el.classList.toggle('active', j === i));
        });
        cmdResults.appendChild(div);
    });
}

function getFilteredItems() {
    const q = cmdInput.value.toLowerCase().trim();
    if (!q) return cmdItems;
    return cmdItems.filter(item => item.label.toLowerCase().includes(q));
}

cmdInput.addEventListener('input', () => {
    cmdActiveIndex = 0;
    renderResults(getFilteredItems());
});

cmdInput.addEventListener('keydown', (e) => {
    const filtered = getFilteredItems();
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex + 1) % filtered.length;
        renderResults(filtered);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex - 1 + filtered.length) % filtered.length;
        renderResults(filtered);
    } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        closePalette();
        filtered[cmdActiveIndex].action();
    } else if (e.key === 'Escape') {
        closePalette();
    }
});

cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closePalette();
});

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        cmdOverlay.classList.contains('open') ? closePalette() : openPalette();
    }
});
