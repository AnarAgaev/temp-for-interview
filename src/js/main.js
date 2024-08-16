// Deleting blocking of all animation for fix animation artefacts
const removeAnimationBlocker = () => {
    Array.from(document.querySelectorAll('.transition-blocker'))
        .forEach(el => el.classList.remove('transition-blocker'))
}
window.addEventListener('load', removeAnimationBlocker)

// Blocking all animation at the window resizing process
const addAnimationBlocker = () => {
    document.body.classList.add('transition-blocker')
}

let blockAnimationTimer

window.addEventListener("resize", () => {
    clearTimeout(blockAnimationTimer)
    window.safeCall(addAnimationBlocker)

    blockAnimationTimer = setTimeout(() => {
        window.safeCall(removeAnimationBlocker)
    }, 300)
})

// Handle link with smooth animation to anchor place on the page
const smoothLinks = document.querySelectorAll('a[href^="#"]')
for (let smoothLink of smoothLinks) {
    smoothLink.addEventListener('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        const id = smoothLink.getAttribute('href')

        try {
            const targetNode = document.querySelector(`${id}`)
            const targetOffset = targetNode.offsetTop
            const deviceOffset = window.outerWidth > 768 ? -100 : -20

            smoothScrollTo(targetOffset + deviceOffset, 700)
        } catch (error) {
            console.error("There's no target node for scrolling to place. The selector isn't correct!");
            console.error(error)
        }
    })
};

// Animation items when user has scrolled screen to place of item
const checkAnimationElms = () => {
    const animationElms = Array.from(document
        .querySelectorAll('.animation-element'))

    return animationElms.length > 0
}

const showAnimElements = () => {
    const elms = Array.from(document
        .querySelectorAll('.animation-element'))

    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    // const pointOfDisplay = windowHeight / 1.2 // for show on the half of the screen
    const pointOfDisplay = windowHeight

    elms.forEach(function (el) {
        const rect = el.getBoundingClientRect()
        const distanceFromTop = rect.top + window.pageYOffset

        if (distanceFromTop - pointOfDisplay < scrollTop) {
            el.classList.remove('animation-element')
        }
    })

    if (!checkAnimationElms()) {
        window.removeEventListener('scroll', showAnimElements)
    }
}

const setAnimationElms = () => {
    if (checkAnimationElms()) {
        window.addEventListener('scroll', showAnimElements)
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        window.safeCall(showAnimElements)
        window.safeCall(setAnimationElms)
    }, 100)
})

// Phone masking
const initPhonesMask = () => {
    const phoneInputs = Array.from(document
        .querySelectorAll('[type="tel"]:not(.cart__calc [type="tel"])'))

    phoneInputs.forEach(phone => {
        const phoneMaskOptions = {
            mask: '+{7} (000) 000-00-00',
            lazy: true,
            placeholderChar: '#'
        }
        const phoneMask = IMask(
            phone,
            phoneMaskOptions
        )

        phone.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
        phone.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))
    })
}

window.addEventListener('load', () => {
    window.safeCall(initPhonesMask)
})

// Fixing chat-24 widget position -- START
let chat24IntervalId = null
let chat24TimeoutId = null
let chart24StyleNode = null
let chart24Node = null

const fixChat24WidgetPosition = () => {
    chart24Node = document.querySelector('chat-24')

    if (!chart24Node) return

    if (window.innerWidth < 1024 && !chart24StyleNode) {
        chart24StyleNode = document.createElement('style')

        chart24StyleNode.innerHTML = `
            .startBtn.startBtn--outside.startBtn--bottom {
                bottom: 67px;
            }
            .startBtn.startBtn--open {
                transform: translateY(50%) scale(0.6) !important;
            }
        `;

        chart24Node.shadowRoot.prepend(chart24StyleNode)
    }

    if (window.innerWidth >= 1024 && chart24StyleNode !== null) {
        console.log('chart24StyleNode', chart24StyleNode);
        chart24StyleNode.remove()
        chart24StyleNode = null
    }

    clearInterval(chat24IntervalId)
    chat24IntervalId = null

    clearTimeout(chat24TimeoutId)
    chat24TimeoutId = null
}

const chat24RenderListener = () => {
    chat24IntervalId = setInterval(fixChat24WidgetPosition, 100)
}

const hardRemoveChat24RenderListener = () => {
    chat24TimeoutId = setTimeout(() => {
        if (chat24IntervalId) clearInterval(chat24IntervalId)
    }, 10000)
}

window.addEventListener('load', () => {
    window.safeCall(chat24RenderListener);
    window.safeCall(hardRemoveChat24RenderListener);
})

window.addEventListener('resize', () => {
    if (window.innerWidth < 1024) {
        window.safeCall(chat24RenderListener)
        return
    }

    if (chart24StyleNode) chart24StyleNode.remove()
})
// Fixing chat-24 widget position -- FINISH