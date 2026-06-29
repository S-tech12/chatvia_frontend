const body = document.body;

const themeToggle = document.getElementById('themeToggle');

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.classList.remove('bi-brightness-high-fill');
            themeToggle.classList.add('bi-moon-fill');
        } else {
            themeToggle.classList.remove('bi-moon-fill');
            themeToggle.classList.add('bi-brightness-high-fill');
        }
    });
}