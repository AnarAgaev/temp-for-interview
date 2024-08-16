const initToggleSchemeImg = () => {
    const btns = Array.from(document.querySelectorAll('.products__toggle-scheme'))

    btns.forEach(el => el.addEventListener('click', e => {
        e.stopPropagation()
        e.preventDefault()

        const scheme = el.parentNode.querySelector('.products__scheme')

        el.classList.toggle('close')
        scheme.classList.toggle('visible')
    }))
}

window.addEventListener('load', initToggleSchemeImg)