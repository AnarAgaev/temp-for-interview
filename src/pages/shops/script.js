const initShopsVideo = () => {
    const btns = Array.from(document.querySelectorAll('.shops__video'))

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

const initShopsMap = () => {
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
    initShopsVideo()
    initShopsMap()
})