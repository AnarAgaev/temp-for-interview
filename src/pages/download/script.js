// Tabs
const resetAllDownTabs = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => tab.classList.remove('active'))
}

const resetAllDownContentExcludingTarget = (target) => {
    const downContents = Array.from(document.querySelectorAll('.download__tabs-content'))
    downContents.forEach(el => {
        if (el !== target) {
            el.classList.add('hidden') // during of animation is 100ms
            setTimeout(() => el.classList.add('hide'), 100)
        } else {
            setTimeout(() => target.classList.remove('hide'), 100)
        }
    })
}

const initDownTabsHandlers = () => {
    const downTabs = Array.from(document.querySelectorAll('.download__tabs-item'))
    downTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.classList.contains('active')) return

            const targetName = this.dataset.target
            const target = document.querySelector(`[data-tab-target="${targetName}"]`)

            resetAllDownTabs()
            resetAllDownContentExcludingTarget(target)
            this.classList.add('active')

            setTimeout(() => {target.classList.remove('hidden')}, 150)
        })
    })
}

// Getting and setting data
const initDownData = async () => {

    if (!window.DownloadFilesDataLink) {
        console.warn('Не указана API URL файлы для скачивания window.DownloadFilesDataLink')
        return
    }

    (async () => {
        window.spinner.show()

        try {
            const res = await fetch(window.DownloadFilesDataLink)
            if (!res.ok) {
                throw new Error('Сетевая ошибка при запросе даннах файлов для скачивания!')
            }
            const data = await res.json()
            setDownData(data)
        } catch (error) {
            console.error(error)
        }
    })()

    const setDownData = (data) => {
        const normalizedData = {}

        data.forEach(el => {
            const category = el.category

            if (!normalizedData[category]) normalizedData[category] = []

            normalizedData[category].push(el)
        })

        setTimeout(() => {
            window.spinner.hide()
            setDownCaption()
            setDownTabs(normalizedData)
            setDownFiles(normalizedData)
            showAnimElements()
            initDownTabsHandlers()
        }, 100)
    }
}

const setDownCaption = () => {
    const target = document.getElementById('DownloadCaption')

    const insertHtml = `
        <div class="container container_caption animation-element">
            <div class="row">
                <div class="col col-xl-8">
                    <h2 class="container_caption-text">Скачать</h2>
                </div>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownTabs = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadTabsList')

    let insertHtml = `
        <div class="container">
            <div class="download__tabs animation-element">
                <ul class="download__tabs-list">
    `

    insertHtml += `
                    <li class="download__tabs-item active" data-target="${data['Каталоги'][0].category_id}">
                        <button type="button"><span>Каталоги</span></button>
                    </li>
    `

    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `
                    <li class="download__tabs-item" data-target="${data[category][0].category_id}">
                        <button type="button"><span>${category}</span></button>
                    </li>
        `
    })

    insertHtml += `
                </ul>
            </div>
        </div>
    `

    if (target) target.innerHTML = insertHtml
}

const setDownFiles = (data) => {
    const categories = Object.keys(data)
    const target = document.getElementById('DownloadFilesList')

    let insertHtml = ''

    // Первым рендерим Каталоги
    const catalogs = data['Каталоги']

    if (catalogs && catalogs.length > 0) {
        insertHtml += `
            <div class="download__tabs-content animation-element" data-tab-target="${data['Каталоги'][0].category_id}">
                <div class="container container_caption">
                    <div class="row">
                        <div class="col col-xl-8">
                            <h2 class="container_caption-text">Каталоги</h2>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="row">
        `

        catalogs.forEach(catalog => {
            insertHtml += `
                        <div class="col-12 col-md-6 col-xl-4">
                            <div class="download__content">
                                <div class="download__card">
                                    <div class="download__poster">
                                        <img src="${catalog.preview}" alt="" />
                                    </div>
                                    <div class="download_description">
                                        <h4 class="download__name">${catalog.name}</h4>
                                        <span class="download__text">Каталог</span>
                                        <span class="download__text uppercase">${catalog.extension} - ${catalog.size_human}</span>
                                    </div>
                                </div>
                                <div class="download__button">
                                    <a class="btn btn_block btn_dark btn_download" href="${catalog.download}" download="download">
                                        <i></i>
                                        <span>Скачать каталог</span>
                                    </a>
                                </div>
                            </div>
                        </div>
            `
        })

        insertHtml += `
                    </div>
                </div>
            </div>
        `
    }

    // Остальные файлы для скачивания
    categories.forEach((category) => {
        if (category === 'Каталоги') return

        insertHtml += `<div class="download__tabs-content hide hidden" data-tab-target="${data[category][0].category_id}">`

        if (data[category].length > 0) {
            const sections = getDataFilesSections(data[category])

            for (const fileSection in sections) {
                insertHtml += `
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${fileSection}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col-12">
                                <div class="download__wrap">
                                    <table class="download__table">
                `

                sections[fileSection].forEach(el => {
                    insertHtml += `
                                        <tr>
                                            <td>${el.name}</td>
                                            <td>${el.extension} - ${el.size_human}</td> <!-- ${category} -->
                                            <td><a class="btn btn_dark btn_download" href="${el.download}"><i></i></a></td>
                                        </tr>
                    `
                })

                insertHtml += `
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }
        }

        insertHtml += '</div>'
    })

    if (target) target.innerHTML = insertHtml
}

const getDataFilesSections = (data) => {
    const normalizedData = {}

    data.forEach(el => {
        const tag = el.tags.length > 0 ? el.tags[0] : ''

        if (!normalizedData[tag]) normalizedData[tag] = []

        normalizedData[tag].push(el)
    })

    return normalizedData
}

window.addEventListener('load', initDownData)