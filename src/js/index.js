import Swiper from 'swiper/bundle';

const swiper = new Swiper('.slider__content', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    slidesPerView: 3,
    spaceBetween: 30,
    watchOverflow: true,
});

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

