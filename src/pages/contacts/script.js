const initContactsVideo = () => {
    const btn = document.querySelector('.contacts__card_video .contacts__poster')
    const iframe = document.querySelector('.contacts__card_video iframe')

    if (!iframe) return

    btn.addEventListener('click', () => {
        btn.classList.add('unshowing')
        iframe.src = iframe.dataset.src + "&autoplay=true"

        setTimeout(() => btn.classList.add('hide'), 1100)
    })
}

const initContactsMap = () => {
    const container = document.getElementById('mapWrapper')

    if (!container) return

    const map = container.querySelector('#map')
    const title = document.createElement('div')

    title.className = 'title'
    title.textContent = 'Для активации карты кликните по ней'
    container.appendChild(title)

    container.addEventListener('click', () => {
        map.removeAttribute('style')
        title.parentElement.removeChild(title)
    })

    container.addEventListener('mousemove', (e) => {
        title.style.display = 'block'
        if(e.offsetY > 10) title.style.top = e.offsetY + 20 + 'px'
        if(e.offsetX > 10) title.style.left = e.offsetX + 20 + 'px'
    })

    container.addEventListener('mouseleave', (e) => {
        title.style.display = 'none'
    })
}

window.addEventListener('load', () => {
    initContactsVideo()
    initContactsMap()
})
