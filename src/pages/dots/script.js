// Adding JavaScript resources of the React Dots component
//=require components/dots/dots.js

const initVideoInstructionsSwiper = () => {
    const nodeAll = document.querySelector('.accordion__navigation_next')
    const nodeCurrent = document.querySelector('.accordion__navigation_prev')
    const setCountSlides = (num, node) => node.innerText = num

    new Swiper('.accordion__video .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        pagination: {
            el: '.accordion__pagination',
            bulletClass: 'accordion__bullet',
            bulletActiveClass: 'accordion__bullet_active',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.accordion__navigation_prev',
        //     nextEl: '.accordion__navigation_next',
        // },
        on: {
            init: function() {
                const count = this.slides.length
                if (count > 1) {
                    // setCountSlides(count, nodeAll)
                    // setCountSlides(this.realIndex + 1, nodeCurrent)
                } else {
                    this.pagination.destroy()
                    this.el
                        .querySelector('.accordion__pagination-container')
                        .classList.add('hide')
                }
            },
            // slideChange: function() {
            //     setTimeout(() => {
            //         setCountSlides(this.realIndex + 1, nodeCurrent)
            //     }, 100)
            // }
        }
    })
}

const initToggleAccordion = () => {
    const btns = Array.from(document.querySelectorAll('.accordion__button'))
    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const dropdown = this.parentNode
            .querySelector('.accordion__collapse')

        this.classList.toggle('open')
        dropdown.classList.toggle('open')
    }))
}

window.addEventListener('load', () => {
    const isDotsPage = document.querySelector('.page-dots')

    // Initialize slider only for Dots pages
    if (!isDotsPage) return

    initToggleAccordion()
    initVideoInstructionsSwiper()

    // Initialize fancybox
    Fancybox.bind('[data-fancybox="video-instructions"]')
})
