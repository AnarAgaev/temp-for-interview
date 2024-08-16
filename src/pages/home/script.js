window.addEventListener('load', () => {
    // Life section Swipers
    const setCountSlides = (num, node) => {
        node.innerText = num
    }

    const setCurrentSlide = (num, node) => {
        node.innerText = num
    }

    const lifeSwiperCommonProps = {
        loop: false,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
    }

    const lifeSwiperContent = new Swiper('.life__content .swiper', {
        ...lifeSwiperCommonProps,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            prevEl: '.life__page_current',
            nextEl: '.life__page_all',
        },
        on: {
            init: function () {
                const nodeAll = document.querySelector('.life__page_all')
                const nodeCurrent = document.querySelector('.life__page_current')
                const count = this.slides.length
                setCountSlides(count, nodeAll)
                setCurrentSlide(this.realIndex + 1, nodeCurrent)
            },
            slideChange: function () {
                const nodeCurrent = document.querySelector('.life__page_current')
                setTimeout(() => {
                    setCurrentSlide(this.realIndex + 1, nodeCurrent)
                }, 100)
            }
        }
    });

    const lifeSwiperBillboard = new Swiper('.life__billboard .swiper', {
        ...lifeSwiperCommonProps,
        // grabCursor: true,
    });

    // Life section swipers mutual controlling
    lifeSwiperContent.controller.control = lifeSwiperBillboard
    lifeSwiperBillboard.controller.control = lifeSwiperContent

    // Billboard section Swipers
    const billboardVideoContainers = Array.from(document.querySelectorAll('.billboard__slider .swiper-slide'))

    const activeBillboardVideo = (node) => {
        if (!node.classList.contains('activated')) {
            node.classList.add('activated')
        }
    }

    const toggleBillboardVideo = (video) => {
        if (!video.paused) {
            video.pause()
        } else {
            video.play()
        }
    }

    const setBillboardVideoSource = () => {
        billboardVideoContainers.forEach(node => {
            const video = node.querySelector('video')

            if (!video) return

            const src = video.dataset.src
            video.src = src
            video.load()
            video.removeAttribute('data-src')
        });
    }

    const swiperBillboard = new Swiper('.billboard__slider .swiper', {
        loop: true,
        slidesPerView: 'auto',
        // speed: 3000,
        // observer: true,
        // observeParents: true,
        // observeSlideChildren: true,
        // watchOverflow: true,
        // grabCursor: true,
        // slideToClickedSlide: true,
        breakpoints: {
            768: {
                spaceBetween: 20,
                centeredSlides: true,
                // initialSlide: 1
            },
        },
        // autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false
        // },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.billboard__page_current',
        //     nextEl: '.billboard__page_all',
        // },
        on: {
            init: function () {
                // Set values to the swiper navigation buttons
                // const nodeAll = document.querySelector('.billboard__page_all')
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // const count = this.slides.length

                // if (count > 1) {
                //     setCountSlides(count, nodeAll)
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }

                // Set video resources
                setBillboardVideoSource()

                const activeSlide = this.slides[this.activeIndex]
                const activeVideo = activeSlide.querySelector('video')
                if (activeVideo) activeVideo.classList.add('blockedPlay')

                setTimeout(() => document.querySelector('.billboard')
                    .classList.remove('inactive'), 100)
            },
            slideChange: function () {
                // Set values to the swiper navigation buttons
                // const nodeCurrent = document.querySelector('.billboard__page_current')
                // setTimeout(() => {
                //     setCurrentSlide(this.realIndex + 1, nodeCurrent)
                // }, 100)

                // Toggle video playing
                billboardVideoContainers.forEach(node => {
                    const video = node.querySelector('video')
                    if (video) video.pause()
                })
                setTimeout(() => {
                    const activeSlide = this.slides[this.activeIndex]
                    const activeContainer = activeSlide.querySelector('.billboard__container')
                    const activeVideo = activeSlide.querySelector('video')

                    if (activeVideo && !activeVideo.classList.contains('blockedPlay')) {
                        activeBillboardVideo(activeContainer)
                        activeVideo.play()
                    }

                    if (activeVideo) activeVideo.classList.remove('blockedPlay')
                }, 100)
            }
        }
    });

    // Actions for the video content at the Billboard Swiper
    const addHandlerToBillboardVideo = () => {
        billboardVideoContainers.forEach(el => {
            el.addEventListener('click', function() {
                const container = el.querySelector('.billboard__container')
                const video = el.querySelector('video')

                const isActiveSlide = container.closest('.swiper-slide')
                    .classList.contains('swiper-slide-active')

                if (!video || !isActiveSlide) return

                activeBillboardVideo(container)
                toggleBillboardVideo(video)
            })
        })
    }
    addHandlerToBillboardVideo()
})

window.addEventListener('scroll', e => {
    const billboard = document.querySelector('.billboard')
    const videoArr = Array.from(billboard.querySelectorAll('video'))

    videoArr.forEach(video => video.pause())
})
