
import Swiper from 'swiper/bundle';

function slider() {
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
}

export default slider;