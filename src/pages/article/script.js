const articleSlides = Array.from(document.querySelectorAll('.billboard__slider .swiper-slide'))

const initArticleSwiper = () => {
    const nodeAll = document.querySelector('.article__navigation_next')
    const nodeCurrent = document.querySelector('.article__navigation_prev')
    const setCountSlides = (num, node) => node.innerText = num

    new Swiper('.article__swiper', {
        loop: true,
        slidesPerView: '1',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        pagination: {
            el: '.article__pagination',
            bulletClass: 'article__bullet',
            bulletActiveClass: 'article__bullet_active',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.article__navigation_prev',
        //     nextEl: '.article__navigation_next',
        // },
        on: {
            init: function() {
                const count = this.slides.length
                if (count > 1) {
                    // setCountSlides(count, nodeAll)
                    // setCountSlides(this.realIndex + 1, nodeCurrent)
                } else {
                    this.pagination.destroy()
                    this.el.closest('.article__gallary')
                        .querySelector('.article__pagination-container')
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

const initVideoInstructionsSwiper = () => {
    const nodeAll = document.querySelector('.article__accordion-navigation_next')
    const nodeCurrent = document.querySelector('.article__accordion-navigation_prev')
    const setCountSlides = (num, node) => node.innerText = num

    new Swiper('.article__accordion-video .swiper', {
        loop: false,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        watchOverflow: true,
        grabCursor: true,
        pagination: {
            el: '.article__accordion-pagination',
            bulletClass: 'article__accordion-bullet',
            bulletActiveClass: 'article__accordion-bullet_active',
            clickable: true,
        },
        // navigation: {
        //     prevEl: '.article__accordion-navigation_prev',
        //     nextEl: '.article__accordion-navigation_next',
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
                        .querySelector('.article__pagination-container')
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

// Add product to favorites
const initAddArticleToFavorites = () => {
    const btns = Array.from(document
        .querySelectorAll('.article__favorite'))

    btns.forEach(btn => btn.addEventListener(
        'click',
        addToFavoritesClickHandler
    ))
}

const initToggleArticleAccordion = () => {
    const btns = Array.from(document.querySelectorAll('.article__accordion-button'))
    if (btns.length === 0) return

    btns.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const dropdown = this.parentNode
            .querySelector('.article__accordion-collapse')

        this.classList.toggle('open')
        dropdown.classList.toggle('open')
    }))
}

const initArticleContentTooltip = () => {
    const btns = Array.from(document.querySelectorAll('.article__content-informer'))
    if (btns.length === 0) return

    const addClickOnHandler = () => {
        btns.forEach(el => el.addEventListener('click', function() {
            this.querySelector('span').classList.toggle('visible')
        }))
    }

    const addClickOutsideHandler = () => {
        document.addEventListener('click', e => {
            const target = e.target
            const isTooltip = target.closest('.article__content-informer')

            if (!isTooltip) {
                btns.forEach(node => node
                    .querySelector('span')
                    .classList
                    .remove('visible'))
            }
        })
    }

    // Only for touchable
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        addClickOnHandler()
        addClickOutsideHandler()
    }
}

// Calc
const initArticleCalc = () => {
    const input = document.querySelector('.article__content-calc input')
    let count = input.value

    const cartRequest = window.debounce(function () {
        const buttonRequest = document.querySelector('.article__add-to-cart')

        const code = document
            .querySelector('[data-product-article]')
            .dataset
            .productArticle

        if (!buttonRequest && code) {
            window.setProductToCart({ art: code, count: count })
            showModalMsg("Изменили количество товара")
        }

    }, 500)

    const updateCount = () => {
        input.value = count
        cartRequest()

        const btn = document.querySelector('.article__content-calc button:has(.dec)')
        if (btn && count === 1) {
            btn.classList.add('disabled')
        } else {
            btn.classList.remove('disabled')
        }
    }

    const setDefaultCount = () => {
        count = 1
        updateCount()
    }

    // Increment
    const incBtn = document.querySelector('.article__content-calc .inc')

    const handleInc = (val) => {
        if (val === '') {
            setDefaultCount()
            return
        }

        count = (typeof val === 'number')
            ? count + 1
            : parseInt(count) + 1

        updateCount()
    }

    incBtn.addEventListener('click', () => handleInc(input.value))

    // Decrement
    const decBtn = document.querySelector('.article__content-calc .dec')

    const handleDec = (val) => {
        if (val === '') {
            setDefaultCount()
            return
        }

        let newCount = typeof val === 'number'
            ? count - 1
            : parseInt(count) - 1

        if (newCount <= 0) newCount = 1

        count = newCount
        updateCount()
    }

    decBtn.addEventListener('click', () => handleDec(input.value))

    // Blur for input
    // const handleBlur = (val) => {
    //     if (val === '' || parseInt(val) === 0) {
    //         setDefaultCount()
    //     }
    // }

    // input.addEventListener('blur', () => {
    //     const val = input.value
    //     handleBlur(val)
    // })

    // Change value into the input
    // const handleChange = e => {
    //     const currentVal = e.target.value

    //     if (currentVal === '') return

    //     const onlyDigits = /^\d+$/.test(currentVal)

    //     if (onlyDigits) {
    //         count = currentVal
    //         updateCount()
    //         return
    //     }

    //     updateCount()
    // }
    // input.addEventListener('input', handleChange)
}

// Add to cart
const initAddArticleToCart = () => {
    const btn = document.querySelector('.article__add-to-cart')

    if (!btn) return

    const handler = (btn) => {
        const val = parseInt(document.querySelector('.article__content-calc input').value)
        const art = btn.dataset.productId
        const title = btn.dataset.title
        const msg = btn.dataset.message

        window.addProductToCart({ art: art, count: val })

        showModalMsg(title, msg)

        // Replace button to link
        const link = document.createElement('a')
        link.classList.add('btn', 'btn_block', 'btn_dark')
        link.href = 'cart.html'
        const text = document.createElement('span')
        text.innerText = 'В корзине'
        link.appendChild(text)
        btn.parentNode.replaceChild(link, btn)
    }

    btn.addEventListener('click', function() {
        handler(this)
    })
}

window.addEventListener('load', () => {
    const isArticlePage = document.querySelector('.page-article')

    // Initialize slider only for Article pages
    if (!isArticlePage) return

    initArticleSwiper()
    initVideoInstructionsSwiper()
    initAddArticleToFavorites()
    initToggleArticleAccordion()
    initArticleContentTooltip()
    initArticleCalc()
    initAddArticleToCart()

    // Initialize fancybox
    Fancybox.bind('[data-fancybox="video-instructions"]')
})
