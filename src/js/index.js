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

