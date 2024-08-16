class Informer {
    static _instances

    static getInstances() {
        if (!Informer._instances) {
            Informer._instances = new Informer()
        }
        return Informer._instances
    }

    constructor() {
        this.informer = document.getElementById("informer")
        if (!this.informer) {
            console.warn("На странице отсутствует html обертка для Информера")
            return false
        }
        this.informerBody = this.informer.querySelector(".informer__body")
        this.informerBack = this.informer.querySelector(".informer__back")
        this.informerClose = this.informer.querySelector(".informer__close")
        this.init()
    }
    init() {
        this.btns = Array.from(document.querySelectorAll("span[data-term]"))
        this.initEventListeners()
        return this
    }

    initEventListeners() {
        this.btns.forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation()
                e.preventDefault()
                await this.getInformation(btn.dataset.term)
            })
        })

        this.informerBack.addEventListener("click", () => this.hideInformer())
        this.informerClose.addEventListener("click", () => this.hideInformer())
    }

    async getInformation(term) {
        window.spinner.show()

        const formData = new FormData()
        formData.append("term", term)

        const res = DEV_MODE ?
            await fetch("https://anaragaev.github.io/technolight.layout/mocks/inform.html") :
            await fetch("/api/term", {
                method: "POST",
                body: formData
            })

        if (res.ok) {
            const html = await res.text()
            this.updateInformerContent(html)
        } else {
            console.warn("Не удалось получить информацию для Термина", term)
            setTimeout(window.spinner.hide, 300)
        }
    }

    updateInformerContent(data) {
        const informerContent = this.informer.querySelector(".informer__content")

        while (informerContent.firstChild) {
            informerContent.removeChild(informerContent.firstChild)
        }

        informerContent.innerHTML = data
        this.showInformer()
        setTimeout(window.spinner.hide, 300)
    }

    showInformer() {
        this.informer.classList.add("visible")

        setTimeout(() => {
            this.informerBack.classList.add("visible")
            this.informerBody.classList.add("visible")
        }, 100)
    }

    hideInformer() {
        this.informerBack.classList.remove("visible")
        this.informerBody.classList.remove("visible")

        setTimeout(() => this.informer.classList.remove("visible"), 500)
    }
}
window.initInformers = () => Informer.getInstances().init()
window.addEventListener("load", () => window.informer = window.initInformers())