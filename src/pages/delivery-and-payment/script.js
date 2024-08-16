// Dap is an abbreviation of the Delivery and payment
const dapTabs = Array.from(document.querySelectorAll('.dap__tabs-item'))
const dapContents = Array.from(document.querySelectorAll('.dap__tabs-content'))

const resetAllDapTabs = () => {
    dapTabs.forEach(tab => tab.classList.remove('dap__tabs-item_active'))
}

const resetAllDapContentExcludingTarget = (target) => {
    dapContents.forEach(el => {
        if (el !== target) {
            el.classList.add('hidden') // during of animation is 100ms
            setTimeout(() => el.classList.add('hide'), 100)
        } else {
            setTimeout(() => target.classList.remove('hide'), 100)
        }
    })
}

const initDapTabs = () => {
    dapTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('dap__tabs-item_active')) return

            const targetName = this.dataset.target
            const target = document.querySelector(`[data-tab-target="${targetName}"]`)

            resetAllDapTabs()
            resetAllDapContentExcludingTarget(target)
            this.classList.add('dap__tabs-item_active')

            setTimeout(() => {target.classList.remove('hidden')}, 150)
        })
    })
}

window.addEventListener('load', () => {
    initDapTabs()
})