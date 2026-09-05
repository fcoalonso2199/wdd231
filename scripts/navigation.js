const menuButton = document.querySelector('#menu-button');
const primaryNav = document.querySelector('#primary-nav');

menuButton.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    menuButton.textContent = primaryNav.classList.contains('open') ? '❌' : '☰';
});