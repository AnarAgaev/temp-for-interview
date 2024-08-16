// Частично логика фильтров находится в файле логики работы фильтра src\components\filters\script.js

// На стороне бэка нужно проинициализировать переменную window._PRODUCTS_PER_PAGE в которой храним количество товаров на странице каталога!
if (!window._PRODUCTS_PER_PAGE) {
    console.error('There is no variable number of products on the Catalog page! Should to add variable as window._PRODUCTS_PER_PAGE=10')
}

const RERENDER_PROD_TIMEOUT_DELAY = 1000

const setProdUrlParam = (name, val, type) => {
    let url = window.location.href

    // Проверяем, есть ли уже параметр с типом type и именем name в URL --- type[name]=
    if (url.indexOf(`${type}[${name}]=`) !== -1) {
        // Если значение val равно "reset", удаляем параметр из URL иначе обновляем на новое значение
        url = val === 'reset'
            ? url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), '')
            : url.replace(new RegExp(`(${type}\\[${name}\\]=)[^&]+`), `$1${val}`)
    } else { // Если параметра с именем name нет в URL, добавляем его
        url += url.indexOf("?") !== -1
            ? `&${type}[${name}]=${val}`
            : `?${type}[${name}]=${val}`
    }

    // Только для фильтров и сортировки удаляем параметрт страницы, так как меняется выборка
    if (type === 'filter' || type === 'sort') {
        url = url.replace(/&?select\[page\]=[^&]*/g, '');
    }

    // Удаляем лишние & из url и ? для ULR без параметров
    url = url.replace(/&+/g, '&')
    url = url.replace(/\?&/g, '?')
    url = url.replace(/&$/g, '')
    url = url.replace(/\?$/, '')
    url = decodeURIComponent(url)

    // Обновляем URL страницы
    window.history.pushState({}, "", url);

    // Стартуем процесс обрботки данных
    processProdData(url)
}

const initDefaultProdCatalog = () => {
    if (window._CATALOG) return
    window._CATALOG = {}
}

const requestProductData = async () => {
    window._CATALOG = []
    const res = await fetch('https://anaragaev.github.io/technolight.layout/mocks/products.json')
    if (res.ok) {
        const parsedData = await res.json()

        if ('data' in parsedData) {
            window._CATALOG = parsedData.data
        } else {
            console.error('В запрошенных данных каталога нет объекта с данными! Предполагается наличие свойства с data.');
        }

        if (window._CATALOG.length === 0) {
            console.error('Пришел пустой объкт с данными!');
        }

    } else {
        console.error('Ошибка запроса каталога товаров! Код ошибки:', res.status)
    }
}

const checkProductResetAllButton = () => {
    const checkedFilters = Array.from(document
        .querySelectorAll('.filters__options.checked'))

    const resetAllButton = document.querySelector('.filters__reset')

    checkedFilters.length > 0
        ? resetAllButton.classList.remove('disabled')
        : resetAllButton.classList.add('disabled')
}

const undroppProductFilterLists = (filters) => {
    filters.forEach(filter => {
        filter.classList.remove('dropped')
        setTimeout(() => filter.classList.remove('active'), 300)
    })
}

const resetAllProductsFilters = (node) => {
    const container = node.closest('.page-catalog .filters')

    const filters = container
            .querySelectorAll('.filters__list .filters__item')

    const options = Array.from(document
            .querySelectorAll('.page-catalog .filters__options'))

    const controllers = Array.from(container
            .querySelectorAll('input[type="radio"]:not([value="reset"]'))

    undroppProductFilterLists(filters)
    options.forEach(el => el.classList.remove('checked')) // hide rset option button
    controllers.forEach(controller => controller.checked = false) // reset all input controllers
    node.closest('.filters__reset').classList.add('disabled')
}

const removeFilterParamFromCatalogUrl = (url, param) => {
    const strRegex = `${param}[^&]*`
    const regex = new RegExp(strRegex, 'g')
    return url.replace(regex, '')
}

const initCatalogFilterReset = () => {
    const reset = document.querySelector('.page-catalog .filters__reset .filters__item')
    if (!reset) return

    reset.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const deletedParams = JSON.parse(this.dataset.deletedParams)
        let url = window.location.href

        // Проверяем, есть ли GET параметры в URL
        if (url.indexOf('?') === -1) return

        for (const param of deletedParams) {
            url = removeFilterParamFromCatalogUrl(url, param)
        }

        // Удаляем лишние & из url и ? для ULR без параметров
        url = url.replace(/&+/g, '&')
        url = url.replace(/\?&/g, '?')
        url = url.replace(/&$/g, '')
        url = url.replace(/\?$/, '')
        url = decodeURIComponent(url)

        // Обновляем URL страницы без GET параметров
        window.history.pushState({}, "", url)

        // Сбрасываем все выбранные фильтры
        resetAllProductsFilters(this)

        // Стартуем процесс обрботки данных
        processProdData(url)
    })
}

const initCatalogFilterControllers = () => {
    const controllers = Array.from(document.querySelectorAll('.page-catalog .filters input[type="radio"]'))

    controllers.forEach(el => el.addEventListener('change', function(e) {
        e.preventDefault()
        e.stopPropagation()

        const container = this.closest('.filters__options')

        this.value !== 'reset'
            ? container.classList.add('checked')
            : container.classList.remove('checked')

        setProdUrlParam(this.name, this.value, this.dataset.type)
        checkProductResetAllButton()
    }))
}

const getCurrentPageNumberFromUrl = () => {
    const url = window.location.href
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('select[page]');
}

const initCatalogPaginationControllers = () => {
    const countsOfPage = document.querySelectorAll('.page-catalog .pagination .pagination__btn_page').length
    const pagination = document.querySelector('.page-catalog .pagination')
    const controllers = Array.from(pagination.querySelectorAll('.page-catalog .pagination button'))
    const first = pagination.querySelector('[data-page="first"]')
    const last = pagination.querySelector('[data-page="last"]')
    const prev = pagination.querySelector('[data-page="prev"]')
    const next = pagination.querySelector('[data-page="next"]')

    const resetAllPaginationBtns = () => {
        controllers.forEach(el => el.classList.remove('disabled', 'active'))
    }

    const actievFirst = () => {
        first.classList.add('disabled')
        prev.classList.add('disabled')
        pagination.querySelector('[data-page="1"]').classList.add('active')
    }

    const activeLast = () => {
        last.classList.add('disabled')
        next.classList.add('disabled')
        pagination.querySelector(`[data-page="${countsOfPage}"]`).classList.add('active')
    }

    const activePage = (page) => {
        if (parseInt(page) === 1) {
            actievFirst()
            return
        }

        if (parseInt(page) === countsOfPage) {
            activeLast()
            return
        }

        pagination
            .querySelector(`[data-page="${page}"]`)
            .classList.add('active')
    }

    controllers.forEach(el => el.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()
        const currentPage = getCurrentPageNumberFromUrl()

        let page = this.dataset.page

        resetAllPaginationBtns()

        switch (page) {
            case 'first': {
                page = 1
                actievFirst()
            } break;
            case 'last': {
                page = countsOfPage
                activeLast()
            } break;
            case 'prev': {
                page = currentPage - 1
                activePage(page)
            } break;
            case 'next': {
                page = currentPage ? parseInt(currentPage) + 1 : 2
                activePage(page)
            } break;
            default: {
                activePage(page)
            } break;
        }

        if (page !== currentPage) setProdUrlParam('page', page, 'select')
    }))
}

const parseProdUrl = (url) => {
    const params = {}
    const queryString = url.split('?')[1]

    if (queryString) {
        const paramPairs = queryString.split('&')

        paramPairs.forEach(pair => {
            const [param, val] = pair.split('=')

            if (!param.includes('[')) return

            const [type, dirtyProp] = param.split('[')
            const prop = dirtyProp.slice(0, -1);

            if (!params[type]) params[type] = {}

            params[type][prop] = val
        })
    }

    return params
}

const updateProdPagination = (totalProducts, pageNumber, totalPages) => {
    const paginationNode = document.querySelector('.page-catalog .pagination')

    // Рассчитвыем страницы и подeфолту показываем первую
    totalPages = Math.ceil(totalProducts / window._PRODUCTS_PER_PAGE)

    const isFirstPage = pageNumber === 1 ? 'disabled' : ''
    const isLastPage = pageNumber === totalPages ? 'disabled' : ''
    let paginationLayout = ''

    paginationLayout += `<button class="pagination__extremum ${isFirstPage}" href="" data-page="first">первая</button>`
    paginationLayout += `<button class="pagination__btn pagination__btn_prev ${isFirstPage}" href="" data-page="prev"><i></i></button>`

    for (let i = 1; i <= totalPages; i++) {
        const isActivePage = pageNumber === i ? 'active': ''
        paginationLayout += `<button class="pagination__btn pagination__btn_page ${isActivePage}" href="" data-page="${i}">${i}</button>`
    }

    paginationLayout += `<button class="pagination__btn pagination__btn_next ${isLastPage}" href="" data-page="next"><i></i></button>`
    paginationLayout += `<button class="pagination__extremum ${isLastPage}" href="" data-page="last">последняя</button>`

    // Блокируем текущую пагинацию
    paginationNode.classList.add('blocked')

    // Искусственно добавляем задержку в перерендер пагинации
    // Аналогичная задержка в рендеринге контента
    setTimeout(() => {
        // Если после филтрации и сортировки нет подходящих продуктов, скрываем пагинацию
        if (totalProducts === 0) {
            paginationNode.classList.add('hide')
            return
        } else {
            paginationNode.classList.remove('hide')
        }

        paginationNode.innerHTML = paginationLayout
        initCatalogPaginationControllers()
        paginationNode.classList.remove('blocked')
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const filterProdData = (filter, initilaData) => {
    if (!filter) return initilaData // Если нет фильтров, просто пробрасываем данные дальше

    let data = initilaData

    for (const key in filter) {
        let val = filter[key]
        if (val === 'Не указан'
                || val === 'Не указано'
                || val === 'Не указана'
                || val === 'Без категории') {
            val = ''
        }

        data = data.filter(prod => {
            if (Array.isArray(prod[key])) {
                if (val === '') return prod[key].length === 0

                return prod[key].includes(val)
            }
            return prod[key] === val
        })
    }

    console.log('after FILTER', data);
    console.log('FILTER --------------------------------------------------------');

    return data
}

const sortProdData = (sort, filteredData) => {
    if (!sort) return filteredData // Если нет сортировки, просто пробрасываем данные дальше

    let data = filteredData

    for (const key in sort) {
        let val = sort[key]
        data = data.sort( function(a, b) {
            if (val === 'По возрастанию') {
                return a[key] - b[key]
            }
            return b[key] - a[key]
        })
    }

    console.log('after SORT', data);
    console.log('SORT -------------------------------------------------------------');

    return data
}

const getPageFromProdData = (select, filteredAndSortedData) => {
    let data = filteredAndSortedData

    // Если нет параметра select со страницей, либо страница не указана, то выбираем первую страницу
    let pageNumber = !select
        ? 1
        : !select.page || select.page === ''
            ? 1
            : parseInt(select.page)

    // Вычисляем общее количество страниц
    const totalPages = Math.ceil(data.length / window._PRODUCTS_PER_PAGE)

    // Если номер страницы отрицательный, возвращаем первую страницу
    if (pageNumber < 1) {
        pageNumber = 1
    }

    // Если номер страницы больше максимальной, возвращаем последнюю страницу
    if (pageNumber > totalPages) {
        pageNumber = totalPages
    }

    // Вычисляем индексы начала и конца для текущей страницы
    const startIndex = (pageNumber - 1) * window._PRODUCTS_PER_PAGE
    const endIndex = startIndex + window._PRODUCTS_PER_PAGE
    data = data.slice(startIndex, endIndex)

    console.log('after get PAGE', data);
    console.log('GET PAGE --------------------------------------');

    // Обновляем пагинацию после того как получили подмасив товаров нужной страницы
    updateProdPagination(filteredAndSortedData.length, pageNumber, totalPages)

    return data
}

const sortProdByCategory = (filteredSortedPagedData) => {
    const categorys = {}

    for (const prod of filteredSortedPagedData) {
        let currentCategory = prod.category[0]
        if (!currentCategory) {
            currentCategory = 'Без категории'
        }

        // Если текущей категории нет в объекте categorys, добавляем
        const isCategory = currentCategory in categorys
        if (!isCategory) {
            categorys[currentCategory] = []
        }

        // Пушим товар в соответствующую категорию
        categorys[currentCategory].push(prod)
    }

    console.log('after replaced By Category', categorys);
    console.log('Replaced By Category --------------------------------------');

    return categorys
}

const buildProductListLayout = (categorys) => {
    let productSectionsHtmlLayout = ''

    for (const key in categorys) {
        let sectionHtmlLayout = ''

        sectionHtmlLayout += `
            <section class="section section_product-list">
                <div class="product-item__container">
                    <div class="container container_caption">
                        <div class="row">
                            <div class="col col-xl-8">
                                <h2 class="container_caption-text">${key}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="product-item__list">
                        <div class="container">
                            <div class="row">`

            for (const singleProduct of categorys[key]) {
                // Добавляем теги если они есть
                const tags = singleProduct.tags

                let badgeLayout = ''

                if (!Array.isArray(tags) && Object.keys(tags)) {
                    badgeLayout += '<div class="product-item__badge-list">'
                        if (tags['new']) badgeLayout += '<span class="product-item__badge-item">Новинка</span>'
                        if (tags['IP']) badgeLayout += '<span class="product-item__badge-item product-item__badge-item_waterproof">IP 44<i></i></span>'
                    badgeLayout += '</div>'
                }

                const price = singleProduct.price ? singleProduct.price + ' ₽' : ''

                sectionHtmlLayout += `
                    <div class="col-12 col-sm-6 col-md-4 col-xl-3">
                        <div class="product-item__card">
                            <a class="product-item__body" href="#" title="${singleProduct.title}">
                                ${badgeLayout}
                                <div class="product-item__pic">
                                    <img src="${singleProduct.image}" alt="" loading="lazy">
                                    <button class="product-item__favorites"
                                        type="button"
                                        data-product-id="${singleProduct.article}"
                                        data-title="${singleProduct.title}"
                                        data-message="Добавлен в избранное"></button>
                                </div>
                                <div class="product-item__content">
                                    <div class="product-item__desc">
                                        <span class="product-item__code">${singleProduct.article}</span>
                                        <p class="product-item__name">${singleProduct.title}</p>
                                    </div>
                                    <div class="product-item__buy">
                                        <span class="product-item__price">${price}</span>
                                        <button class="product-item__cart"
                                            type="button"
                                            data-product-id="${singleProduct.article}"
                                            data-title="${singleProduct.title}"
                                            data-message="Добавлен в корзину">
                                        </button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>`
            }

        sectionHtmlLayout += `
                            </div>
                        </div>
                    </div>
                </div>
            </section>`

        productSectionsHtmlLayout += sectionHtmlLayout
    }
    return productSectionsHtmlLayout
}

const buildNoProductListMsgLayout = () => {
    return `
        <section class="section section_product-list">
            <div class="description__msg display visible">
                <div class="container">
                    <span>К сожалению, по Вашему запросу ничего не найдено. Товара с данными параметрами нет.</span>
                </div>
            </div>
        </section>
    `
}

const updateProductListOnPage = (categorys) => {
    window.spinner.show()

    // Собираем контент страницы в зависимости от того есть ли в выборке товары
    const productSectionsHtmlLayout = Object.keys(categorys).length === 0
        ? buildNoProductListMsgLayout()
        : buildProductListLayout(categorys)

    const remoteNodes = Array.from(document
        .querySelectorAll('.page-catalog .section_product-list'))
    // Блокируем текущие продукты
    remoteNodes.forEach(node => node.classList.add('blocked'))

    // Искусственно добавляем задержку в перерендер контента
    // Аналогичная задержка в рендеринге пагинации
    setTimeout(() => {
        // Удаляем текущие продукты со страницы
        remoteNodes.forEach(node => node.parentNode.removeChild(node))

        const referenceNode = document.querySelector('.page-catalog .section_filter')

        // Вставляем HTML код после referenceNode
        referenceNode.insertAdjacentHTML('afterend', productSectionsHtmlLayout)

        // Скролим в начало страницы
        smoothScrollTo(0, 1000)

        // Инициализируем кнопки добавления в избранные и в корзину
        initAddToFavorites()
        initAddToCart()

        // Скрываем спиннер
        window.spinner.hide()

        // Показываем анимируемые секции если нужно
        showAnimElements()
    }, RERENDER_PROD_TIMEOUT_DELAY)
}

const processProdData = (url) => {

    // Получаем параметры сортировки и фильтрации из url
    const manipulationDataObj = parseProdUrl(url)

    console.log('manipulationDataObj', manipulationDataObj);

    // Step 5. Обновляем список товаров на стрнице
    updateProductListOnPage(

        // Step 4. Сортируем товары по категориями. --- Возвращает: объект с категориями, где в занчении каждой категории лежит массив с товарами этой категории
        sortProdByCategory(

            // Step 3. Выбираем подмассив нужную страницу. --- Возвращает: подмассив с продуктамии соответструющей страницы
            // После получения страницы (внутри метода) обновляем пагинацию!
            getPageFromProdData(
                manipulationDataObj.select,

                // Step 2. Сортируем данные --- Возвращает: отсортированный массив с продуктами
                sortProdData(
                    manipulationDataObj.sort,

                    // Step 1. Фильтруем данные --- Возвращает: отфильтрованный массив с продуктами
                    filterProdData(
                        manipulationDataObj.filter,
                        window._CATALOG
                    )
                )
            )
        )
    )
}

window.addEventListener('load', () => {
    const isPageCatalog = document.querySelector('.page-catalog')
    if (!isPageCatalog) return

    initCatalogFilterControllers()
    initCatalogFilterReset()
    initCatalogPaginationControllers()
    initDefaultProdCatalog()
    requestProductData()
})
