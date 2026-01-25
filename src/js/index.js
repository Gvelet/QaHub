import slider from './modules/slider.js'
slider()

const spoilers = document.querySelectorAll('.resources__spoilers-item');
const spoilersTexts = document.querySelectorAll('.resources__spoilers-text');
const pluses = document.querySelectorAll('.resources-plus')

spoilers.forEach((spoiler, index) => {
    const spoilersText = spoilersTexts[index];
    const plus = pluses[index];

    spoiler.addEventListener('click', () => {
            spoilersText.classList.toggle('show');
            spoiler.classList.toggle('show');
            plus.classList.toggle('transform-Rotate45')
    });
});

const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu-mobile');
const body = document.body;

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
    body.classList.toggle('body-lock');
});

document.querySelectorAll('.menu-mobile .menu__link').forEach(link => {
link.addEventListener('click', () => {
    burger.classList.remove('active');
    menu.classList.remove('active');
    body.classList.remove('body-lock');
});
});

window.addEventListener('load', function() {
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
    }
});

