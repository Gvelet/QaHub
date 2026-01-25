
import Swiper from 'swiper/bundle';

function slider() {
    const swiper = new Swiper('.slider__content', {
        navigation: {
            enabled: true,
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

        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    enabled: false,
                },
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 25,
                navigation: {
                    enabled: false,
                },
            },
            1220: {
                slidesPerView: 3,
                spaceBetween: 25,
            }
        }
    })

}

export default slider;