const initProjectVideo = () => {
    const btns = Array.from(document.querySelectorAll('.project__video'))

    if (btns.length === 0) return

    btns.forEach(el => {
        el.addEventListener('click', function() {
            const iframe = this.querySelector('iframe')
            const poster = this.querySelector('.poster')
            const play = this.querySelector('.button-play')

            if (!iframe) return

            poster.classList.add('unshowing')
            iframe.src = iframe.dataset.src + "&autoplay=true"

            setTimeout(() => {
                poster.classList.add('hide')
                play.classList.add('hide')
            }, 1100)
        })
    })
}

const setNumberToNode = (num, node) => {
    node.innerText = num
}

const initProjectSwiper = () => {
    new Swiper('.project__collage .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        spaceBetween: 10,
        // freeMode: true,
        scrollbar: {
            el: '.swiper-scrollbar',
            draggable: true
        },
        // navigation: {
        //     prevEl: '.project__collage-page_current',
        //     nextEl: '.project__collage-page_all',
        // },
        breakpoints: {
            1440: {
                spaceBetween: 20
            },
        },
        on: {
            init: function () {
                // const nodeAll = document.querySelector('.project__collage-page_all')
                // const nodeCurrent = document.querySelector('.project__collage-page_current')
                // const count = this.slides.length
                // setNumberToNode(count, nodeAll)
                // setNumberToNode(this.realIndex + 1, nodeCurrent)
            },
            // slideChange: function () {
            //     const nodeCurrent = document.querySelector('.project__collage-page_current')
            //     setTimeout(() => {
            //         setNumberToNode(this.realIndex + 1, nodeCurrent)
            //     }, 100)
            // }
        }
    });
}

window.addEventListener('load', () => {
    initProjectVideo()
    initProjectSwiper()

    // Initialazing fancybox gallery
    Fancybox.bind('[data-fancybox="post-collage"]');
})