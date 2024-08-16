// Open and close mobile navigation
window.addEventListener("load", () => {
    const navClose = Array.from(document.querySelectorAll('.header__nav-close'))
    const navToggler = document.querySelector('.footer__nav-link_menu')
    const headerNav = document.querySelector('.header__nav')
    const modalBack = document.querySelector('.header__modal-back')
    const navProdLink = document.querySelector('.header__nav-link_product')
    const navItems = Array.from(document.querySelectorAll('.header__nav-item_with-inner'))
    const navLinks = Array.from(document.querySelectorAll('.header__nav-link'))
    const navCollapses = Array.from(document.querySelectorAll('.header__nav-collapse'))

    if (!navToggler) return

    const toggleNav = (direction) => {
        if (direction) {
            document.body.classList.add('modal-open')
            navToggler.classList.add('active')
            headerNav.classList.add('open')
            // modalBack.classList.add('show')

            setTimeout(() => {
                navProdLink.click()
            }, 100)

            return
        }

        document.body.classList.remove('modal-open')
        navToggler.classList.remove('active')
        headerNav.classList.remove('open')
        modalBack.classList.remove('show')

        collapsAllNavItem()
    }

    // Click on navigation burger
    navToggler.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            toggleNav(false)
            return
        }

        toggleNav(true)
    })

    // Click on navigation close button
    navClose.forEach(btn => {
        btn.addEventListener('click', () =>toggleNav(false))
    })

    modalBack.addEventListener('click', () => {
        toggleNav(false)
    })

    // Open and close Navigation items
    const collapsAllNavItem = () => {
        navItems.forEach(i => i.classList.remove('dropped'))
        navLinks.forEach(i => i.classList.remove('active'))
        navCollapses.forEach(i => i.classList.remove('open'))
    }

    const toggleNavItem = (btn) => {
        const isActive = btn.classList.contains('active')

        collapsAllNavItem()

        if (!isActive) {
            btn.classList.add('active')

            const navItem = btn.closest('.header__nav-item_with-inner')

            if (navItem) {
                const navCollapse = navItem.querySelector('.header__nav-collapse')

                navItem.classList.add('dropped')
                navCollapse.classList.add('open')
                modalBack.classList.add('show')
            }
        }
    }

    navLinks.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleNavItem(this)
        })
    })
})

// Searching and Sticky header
window.addEventListener("load", () => {
    const header = document.querySelector('.header')
    const searchToggler = document.querySelector('.header__buttons-link_search')
    const searchClose = document.querySelector('.header__search-close')
    const searchPanel = document.querySelector('.header__search')
    const searchInput = document.querySelector('.header__search-input')
    const searchReset = document.querySelector('.header__search-reset')
    const searchHints = document.querySelector('.header__search-hints')

    if (!searchToggler) return

    const toggleSearchPanel = (hide = false) => {
        const isVisible = searchPanel.classList.contains('visible')
        const timeout = 100

        if (!isVisible && !hide) {
            searchPanel.classList.remove('disable')
            header.classList.add('header_with-search-panel')
            searchToggler.classList.add('active')

            setTimeout(() => {
                searchPanel.classList.add('visible')
            }, timeout)

            return
        }

        searchToggler.classList.remove('active')
        searchPanel.classList.remove('visible')

        if (window.innerWidth < 992) {
            searchHints.classList.remove('visible')
            searchReset.click()
            resetHandlerFormHelpersEventListeners()
        }

        setTimeout(() => {
            searchPanel.classList.add('disable')
            header.classList.remove('header_with-search-panel')
        }, 200)
    }

    searchToggler.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    searchClose.addEventListener('click', e => {
        e.stopPropagation()
        toggleSearchPanel()
    })

    // const SEARCH_REQUEST_URL = 'https://anaragaev.github.io/technolight.layout/mocks/search.json'
    // const SEARCH_REQUEST_URL = 'https://test-technolightv2.massive.ru/api/product/search'

    const SEARCH_REQUEST_URL = '/api/product/search'
    // const SEARCH_REQUEST_URL = 'https://technolight.lightopt.ru/api/product/search'
    const THROTTLE_TIMEOUT = 300
    let searchRequestTimeoutId

    const setStrongText = (str, query) => {
        const regex = new RegExp(query, 'gi')
        return str.replace(regex, `<strong>$&</strong>`)
    }

    const printQueryResult = (data, query) => {

        console.log('Получили поисковую выдачу', data);

        // Reset all children nodes of search hints
        while (searchHints.firstChild) {
            searchHints.removeChild(searchHints.firstChild)
        }

        // Set link, similar or No Result
        const links = document.createElement('div')
        links.classList.add('header__search-links')

        const similar = document.createElement('div')
        similar.classList.add('header__search-similar')

        if (data.length === 0) {
            // No results
            const span = document.createElement('span')
            span.classList.add('no-results')
            span.innerText = 'По Вашему запросу ничего не найдено'
            links.appendChild(span)
        } else {
            // Links
            const hint = data[0]
            const link = document.createElement('a')
            link.href = hint.url
            link.innerHTML = setStrongText(hint.title, query)
            links.appendChild(link)

            // Similar
            similar.innerHTML = '<h5>смотрите похожие</h5>'

            for (const num in data) {
                if (num < 1) continue

                // Link
                const hint = data[num]
                const link = document.createElement('a')
                link.href = hint.url

                // Image
                const picSpan = document.createElement('span')
                picSpan.classList.add('pic')

                const img = document.createElement('img')
                img.src = hint.image
                img.alt = hint.title
                picSpan.appendChild(img)

                // Text
                const textSpan = document.createElement('span')
                textSpan.classList.add('text')
                textSpan.innerHTML = setStrongText(hint.title, query)

                link.appendChild(picSpan)
                link.appendChild(textSpan)
                similar.appendChild(link)

                if (num > 6) break
            }
        }

        searchHints.appendChild(links)
        searchHints.classList.add('visible')

        if (data.length > 1) {
            searchHints.appendChild(similar)
        }

        // Нужно только для полного меню
        // setHandlerToHelpers()

        if (window.innerWidth < 992) {
            document.body.classList.add('modal-open')
        }
    }

    const fetchSearchingData = async(query) => {
        try {
            const res = await fetch(SEARCH_REQUEST_URL + `?query=${query}`)

            if (!res.ok) {
                throw new Error('Ошибка запроса поиска')
            }

            const data = await res.json()
            printQueryResult(data, query)

        } catch (error) {
            console.error(error)
        }
    }

    searchInput.addEventListener('input', function() {
        if (this.value === '' ) {
            searchReset.classList.remove('visible')
            searchHints.classList.remove('visible')
            clearTimeout(searchRequestTimeoutId)
            return
        }

        searchReset.classList.add('visible')

        // *** Fetching search requests and show results --- START
        clearTimeout(searchRequestTimeoutId)
        searchRequestTimeoutId = setTimeout(
            () => fetchSearchingData(this.value),
            THROTTLE_TIMEOUT
        )
        // *** Fetching search requests and show results --- FINISH
    })

    searchReset.addEventListener('click', (e) => {
        e.stopPropagation()
        searchReset.classList.remove('visible')
        searchHints.classList.remove('visible')
        resetHandlerFormHelpersEventListeners()
        document.body.classList.remove('modal-open')
    })

    document.addEventListener('click', e => {
        const isSearchToggle = e.target
            .closest('.header__buttons-link_search')

        const isSearchPanel = e.target
            .closest('.header__search')

        const isTachDevice = window.innerWidth < 992

        if (!isTachDevice && !isSearchPanel && !isSearchToggle) {
            toggleSearchPanel(true)
        }
    })

    // Set help text from helper button under the search input to the search value
    const requestCompletion = (e) => {
        const additionValue = e.target.innerText
        searchInput.value = `${searchInput.value} ${additionValue}`
    }

    const setHandlerToHelpers = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => btn
            .addEventListener('click', requestCompletion))
    }

    const resetHandlerFormHelpersEventListeners = () => {
        const searchHelpers = Array.from(document
            .querySelectorAll('.header__search-helps span'))

        searchHelpers.forEach(btn => {
            btn.removeEventListener('click', requestCompletion)
        })
    }

    // Sticky header
    let beforeScrollTop = 0

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight
        const header = document.getElementById("header")
        const headerHeight = header.clientHeight
        const delay = '.7s'

        let currentScrollTop = window.scrollY

        if (window.innerWidth > 991) {
            if (currentScrollTop > windowHeight) {
                    header.classList.add('compressed')
                } else {
                    header.classList.remove('compressed')
                }
            return
        }

        if (currentScrollTop > 100 && currentScrollTop > beforeScrollTop) {
            const isVisibleSearch = searchPanel
                .classList.contains('visible')

            let intervalId

            if (isVisibleSearch) {
                header.style.transitionDelay = delay
                toggleSearchPanel(true)
                intervalId = setInterval(() => {
                    header.style.transitionDelay = '0s'
                    clearInterval(intervalId)
                }, 1000)
            }

            header.style.top = `-${headerHeight}px`
        } else {
            header.style.top = 0
        }

        beforeScrollTop = window.pageYOffset
    });
})

// Cart update listening
const setCartUpdateListener = () => {
    const cartProductCountNode = document.querySelector('#cartProductCount')

    if (!cartProductCountNode) return

    cartProductCountNode.addEventListener('cartUpdateEvent', function(e) {

        const products = window.CART.products
        let productCount = 0

        for (const iterator of products) {
            productCount += iterator.count
        }

        cartProductCountNode.innerText = productCount
        cartProductCountNode.dataset.count = productCount.toString()
        cartProductCountNode.classList.add('selected')
        setTimeout(() => cartProductCountNode.classList.remove('selected'), 1000)

        console.log(e.detail.message)
    })
}

window.addEventListener('load', setCartUpdateListener)

// Open and close subLists
const toggleSubNavLists = () => {
    const togglers = Array.from(document
        .querySelectorAll('.header__nav-inner-toggle'))

    const closeAllTogglers = () => {
        togglers.forEach(el => {
            const wrap = el.closest('.header__nav-inner-caption')
            wrap.classList.remove('dropped')

            const collapse = wrap.querySelector('.header__nav-sublist-collapse')
            collapse.classList.remove('open')

            el.classList.remove('active')
        })
    }

    togglers.forEach(el => el.addEventListener('click', () => {
        const wrap = el.closest('.header__nav-inner-caption')
        const collapse = wrap.querySelector('.header__nav-sublist-collapse')
        const isCurrentDropped = wrap.classList.contains('dropped')

        // closeAllTogglers()

        // Toggle current
        if (!isCurrentDropped) {
            wrap.classList.add('dropped')
            el.classList.add('active')
            collapse.classList.add('open')
        } else {
            wrap.classList.remove('dropped')
            el.classList.remove('active')
            collapse.classList.remove('open')
        }
    }))

    // Close all subnav list on out click
    document.addEventListener('click', e => {
        const isTarget = e.target
            .classList
            .contains('header__nav-inner-toggle')

        if(!isTarget) closeAllTogglers()
    })
}

window.addEventListener('load', toggleSubNavLists)
