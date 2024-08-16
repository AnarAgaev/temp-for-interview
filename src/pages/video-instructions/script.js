const initVIVideo = () => {
    const btns = Array.from(document.querySelectorAll('.video-instructions__video'))

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

window.addEventListener('load', () => {
    initVIVideo()
})