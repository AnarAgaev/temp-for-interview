import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { dotsAPIDataContract, zodSteps } from "../zod.ts";
import { z } from 'zod'
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error';

const zodErrorOptions: ErrorMessageOptions = {
    delimiter: {
        error: '\n',
    },
    path: {
        enabled: true,
        type: 'zodPathArray',
        label: 'Zod Path: ',
    },
    code: {
        enabled: true,
    },
    message: {
        enabled: true,
        label: '',
    },
    transform: ({ errorMessage, index }) => `🔥 \x1b[31m Zod Error #${index + 1}: \x1b[33m ${errorMessage}`,
}

const normalizeSteps = (initSteps: z.infer<typeof zodSteps>,
    filters: Record<string, Record<string, string>> | null ) => {

    const normalizedData: {[key: string]: Step} = {}
    const firstStep = Object.keys(initSteps)[0]
    let stepNumber = 1

    for (const step in initSteps) {
        const stepProductsArr: productButton[][] = []
        let required = true

        initSteps[step].forEach(productsList => {
            const arr: productButton[] = []

            productsList.forEach((product: string | null) => {
                const name = product === null ? 'Нет' : product
                const blocked = { stepName: null, stepNumber: null }

                const selected = {
                    stepName: product === null ? step : null,
                    stepNumber: product === null ? stepNumber.toString() : null
                }

                if (product === null) required = false

                arr.push({ name, blocked, selected, default: !required })
            })

            stepProductsArr.push(arr)
        })

        normalizedData[step] = {
            name: step,
            number: stepNumber++,
            active: false,
            products: stepProductsArr,
            required,
            isLast: false
        }

        /**  Поучаем объект карты селектов по которым будем выводить селекты с каскадной возможностью выбора,
            * т.е. более нижние селекты можно будет выбрать только после выбора более верхних
            * В свойствах перечислены все свойства селекта в том же порядке как они приходят из БД
            *
            * selectOptionsMap[prop] может принимать значения
            *
            * 1. true - селект выбран
            * 2. null - селект НЕ ВЫБРАН, НО может быть выбрано в селекте
            * 3. false - селект НЕ ВЫБРАН и НЕ МОЖЕТ БЫТЬ ВЫБРАН
            *
            * По умолчанию первый селект ставим null (не выбран, но доступен к выборы)
            * остальные селекты false (не доступны к выбору)
        */
        if (filters && filters[step]) {
            const selectOptionsMap: { [key: string]: null | boolean } = {}

            Object.keys(filters[step]).map((el, idx) => {
                selectOptionsMap[el] = idx === 0 ? null : false
            })

            normalizedData[step]['selectOptionsMap'] = selectOptionsMap
        }
    }

    normalizedData['Параметры:'] = {
        name: 'Параметры:',
        number: stepNumber++,
        active: false,
        required: true,
        products: [],
        isLast: true
    }

    normalizedData[firstStep].active = true
    return normalizedData
}

const useDots = create<dotsStoreInterface>()(devtools((set, get) => ({
    userStatus: null,
    loading: true,
    error: null,
    steps: {},
    products: {},
    totalPrice: 0,
    totalHeight: null,
    totalProductList: null,
    blacklists: [],
    titles: null,
    complectCount: 1,
    hoverImage: null,
    hoverTitle: null,
    filters: null,
    warning: { isVisible: false },
    isDotInCart: false,
    customName: undefined,
    visibleCustomName: false,
    characteristics: {},
    units: {},
    combos: [],
    description: undefined,
    videos: undefined,
    files: undefined,

    fetchDotsInitData: async () => {
        set({ loading: true })

        const dotsDataLink = window.dotsDataLink
        const userStatus = get().userStatus

        try {
            if (!dotsDataLink && userStatus === 'admin') {
                console.error('There is no link window.dotsDataLink on the page to request data.')
            }

            const res = await fetch(dotsDataLink)

            if (!res.ok && userStatus === 'admin') {
                console.error('Failed to fetch json initial dots file! URL link is', dotsDataLink)
            }

            const safeData = dotsAPIDataContract.safeParse(await res.json())

            if (!safeData.success) {
                const errorMessage = generateErrorMessage(safeData.error.issues, zodErrorOptions)
                console.log(errorMessage)

                return
            }

            set({
                loading: false,
                error: null,
                steps: normalizeSteps(safeData.data.steps, safeData.data.filters),
                stepsCount: safeData.data.stepsCount,
                products: safeData.data.products,
                blacklists: safeData.data.blacklists,
                titles: safeData.data.titles,
                filters: safeData.data.filters,
                characteristics: safeData.data.characteristics,
                units: safeData.data.units,
                combos: safeData.data.combos,
                description: safeData.data.description,
                videos: safeData.data.videos,
                files: safeData.data.files,
                userStatus: safeData.data.is_admin ? 'admin' : null
            })
        } catch (error: Error | unknown) {
            set({ loading: false, error: error })
        }
    },

    showCustomName: (direction) => {
        set({visibleCustomName: direction})
    },

    setCustomName: (name?: string) => {
        set({ customName: name })
    },

    getActiveStep: () => {
        const steps = get().steps

        for (const key in steps) {
            if (steps[key].active) {
                return steps[key]
            }
        }
    },

    getStepByNumber: (stepNumber) => {
        const steps = {...get().steps}

        for (const step in steps) {
            if (steps[step].number === stepNumber) {
                return steps[step]
            }
        }

        return null
    },

    getFirstSelectedProductByActiveStep: () => {
        const activeStep = get().getActiveStep()
        if (!activeStep) return null

        const activeStepProducts = activeStep.products
        const products = get().products

        const selectedProducts = activeStepProducts.filter(product => product[0].selected.stepNumber !== null)

        if (selectedProducts.length === 0) return null

        return products[selectedProducts[0][0].name]
    },

    getBlackList: (article) => {
        const blacklists = get().blacklists
        const resBlockedListArr = new Set<string>()

        blacklists.forEach(blockedListArr => blockedListArr
            .forEach(item => {
                if (item === article) {
                    blockedListArr.forEach(art => resBlockedListArr.add(art))
                }
            }))
        return Array.from(resBlockedListArr)
    },

    unblockProductsByStep: (stepNumber) => {
        const steps = { ...get().steps }

        for (const step in steps) {
            const productsList = steps[step].products

            productsList.forEach((productList, productListIdx) => {
                productList.forEach((product, productIdx) => {
                    if (product.blocked.stepNumber === stepNumber) {
                        steps[step].products[productListIdx][productIdx].blocked.stepNumber = null
                        steps[step].products[productListIdx][productIdx].blocked.stepName = null
                    }
                })
            })
        }

        return steps
    },

    blockProducts: (steps, article, stepName, stepNumber) => {
        let blackListArr: string[] | null = get().getBlackList(article)

        if (blackListArr === null) return steps

        blackListArr = blackListArr.filter(item => item !== article)

        for (const step in steps) {
            steps[step].products.forEach((productList, productListIdx) => {

                productList.forEach((product, productIdx) => {

                    if (blackListArr
                            && blackListArr.includes(product.name)
                            && steps[step].number > parseInt(stepNumber)) {

                        steps[step].products[productListIdx][productIdx].blocked.stepName = stepName
                        steps[step].products[productListIdx][productIdx].blocked.stepNumber = stepNumber
                    }
                })
            })
        }

        return steps
    },

    setSelectedProductToStep: (article, stepName, stepNumber, selected) => {

        if (article === '') return

        // At first unblocking previously blocked products by the current step
        let steps = get().unblockProductsByStep(stepNumber)

        // At second blocking products according blacklist
        steps = get().blockProducts(steps, article, stepName, stepNumber)

        let stepProducts = null
        let selectedProductIdx = null

        for (const key in steps) {
            if (steps[key].number === stepNumber) {
                stepProducts = steps[key].products
            }
        }
        if (stepProducts === null) return

        stepProducts.forEach((products: productButton[], idx: number) => {
            products.forEach(item => {
                if (item.name === article) {
                    selectedProductIdx = idx
                }

                // Reset all selected products to NULL for reset the previously selected product
                item.selected.stepNumber = null
                item.selected.stepName = null
            })
        })
        if (selectedProductIdx === null) return

        if (!selected) {
            stepProducts[selectedProductIdx].forEach((product: productButton) => {
                product.selected.stepName = stepName
                product.selected.stepNumber = stepNumber
            })
        }

        // Update selected product
        steps[stepName] = {
            ...steps[stepName],
            products: stepProducts
        }

        set({ steps })

        // Updating Price, Product list on right side and Total height of the dot
        get().updateTotalPrice()
        get().updateTotalProductList()
        get().updateTotalHeight()
    },

    resetSelectedProductsByActiveStep: () => {
        const activeStep = get().getActiveStep()

        if (!activeStep) return null

        const activeStepProducts = [...activeStep.products]

        // Reset previously selected articles
        activeStepProducts.forEach(products => {
            products.forEach(item => {
                item.selected.stepNumber = null
                item.selected.stepName = null
            })
        })

        return activeStepProducts
    },

    getAllSelectedProducts: () => {
        const steps = get().steps
        const selectedProductsArr: {article: string, step: string}[] = []

        // Getting all selected products names from all steps
        for (const step in steps) {
            for (const products of steps[step].products) {
                for (const product of products) {
                    if (product.selected.stepName) {
                        selectedProductsArr.push(
                            {
                                article: product.name,
                                step: product.selected.stepName
                            }
                        )
                    }
                }
            }
        }

        return selectedProductsArr.length > 0
            ? selectedProductsArr :
            null
    },

    updateTotalPrice: () => {
        const products = get().products
        const selectedProducts = get().getAllSelectedProducts()
        const stepsCount = get().stepsCount
        let totalPrice = 0

        if (!selectedProducts) {
            set({ totalPrice })
            return
        }

        // Increasing the total price for selected products
        selectedProducts.forEach(product => {
            const currentProduct: Product = products[product.article]
            const count = (stepsCount && stepsCount[product.step])
                ? stepsCount[product.step]
                : 1

            if (currentProduct && currentProduct.price) {
                totalPrice += currentProduct.price * count
            }

            // Удалить перед релизом --- START
            if (!currentProduct && product.article !== 'Нет' && get().userStatus === 'admin') {
                console.error('Артикул:', product, 'отсутствует в массиве products')
            }
            // Удалить перед релизом --- FINISH
        })

        if (totalPrice !== 0) {
            set({ totalPrice })
        }
    },

    updateTotalProductList: () => {
        const products = get().products
        const selectedProductsArr = get().getAllSelectedProducts()
        const totalProductList: Product[] = []

        if (!selectedProductsArr) {
            set({ totalProductList })
            return
        }

        // Push selected products to the total product list (totalProductList)
        selectedProductsArr.forEach(product => {
            const currentProduct: Product = products[product.article]

            if (currentProduct) {
                totalProductList.push({
                    article: currentProduct.article,
                    title: currentProduct.title,
                    price: currentProduct.price,
                    link: currentProduct.link,
                    onStep: product.step
                })
            }
        })

        if (totalProductList.length > 0) {
            set({ totalProductList })
        }
    },

    updateTotalHeight: () => {
        const products = get().products
        const selectedProductsArr = get().getAllSelectedProducts()
        let totalHeight = 0

        if (!selectedProductsArr) return

        // Increasing the total height for selected products
        selectedProductsArr.forEach(product => {
            const currentProduct: Product = products[product.article]

            if (currentProduct && currentProduct.height_in_assembly) {
                totalHeight += currentProduct.height_in_assembly
            }
        })

        if (totalHeight !== 0) {
            set({ totalHeight })
        }
    },

    toggleStep: (direction) => {
        const steps = { ...get().steps }

        // Current step
        const currentActiveStep = get().getActiveStep()
        if (!currentActiveStep) return
        const currentActiveStepName = currentActiveStep.name
        const currentActiveStepNumber = currentActiveStep.number

        // New step
        const newActiveStepNumber = currentActiveStepNumber + direction
        const newActiveStep = get().getStepByNumber(newActiveStepNumber)
        if (!newActiveStep) return
        const newActiveStepName = newActiveStep.name

        steps[currentActiveStepName].active = false
        steps[newActiveStepName].active = true

        set({
            steps,
            isDotInCart: false,
            customName: undefined
        })
    },

    updateComplectCount: (direction) => {
        const complectCount = get().complectCount
        let newCount = complectCount + direction

        if (newCount < 1) newCount = 1

        set({ complectCount: newCount })
    },

    getFinalImage: () => {
        const resultAdditionalData = get().getResultStepAdditionalData()

        if (resultAdditionalData.final_image) {
            return resultAdditionalData.final_image
        }

        return ''
    },

    getFinalScheme: () => {
        const resultAdditionalData = get().getResultStepAdditionalData()

        if (resultAdditionalData.final_drawing) {
            return resultAdditionalData.final_drawing
        }

        return ''
    },

    setHoverProduct: (src, title) => {
        set({
            hoverImage: src,
            hoverTitle: title
        })
    },

    removeHoverProduct: () => {
        set({
            hoverImage: null,
            hoverTitle: null
        })
    },

    resetConfiguration: (fromStepNumber) => {
        const steps = {...get().steps}
        const activeStepNumber = fromStepNumber === 0 ? 1 : fromStepNumber

        get().toggleVisibleWarning(false)

        for (const step in steps) {
            const currentStepNumber = steps[step].number
            const products = steps[step].products

            steps[step].active = steps[step].number === activeStepNumber

            if (currentStepNumber <= fromStepNumber && currentStepNumber !== 0) continue

            delete steps[step].selectedFilters

            // Reset filters
            if (steps[step]) {
                const currentStep = steps[step]

                currentStep?.selectOptionsMap &&
                    Object.keys(currentStep?.selectOptionsMap).forEach((key, idx) => {
                        if (currentStep.selectOptionsMap) {
                            currentStep.selectOptionsMap[key] = idx === 0 ? null : false
                        }
                    })
            }

            products.forEach(productList => productList
                .forEach(product => {
                    product.selected.stepName = !product.default
                    ? null
                    : steps[step].name

                    product.selected.stepNumber = !product.default
                        ? null
                        : steps[step].number.toString()

                    // Сбрасываем авто-выбор и блокировку артикула,
                    // только в том случае если она была сделана
                    // на шаге идущем после сбрасываемого
                    if (typeof product.blocked.stepNumber === 'number'
                        && product.blocked.stepNumber >= fromStepNumber) {
                        product.blocked.stepName = null
                        product.blocked.stepNumber = null
                    }
            }))
        }

        set({
            steps: steps,
            totalPrice: 0,
            totalHeight: null,
            totalProductList: null,
            complectCount: 1,
            isDotInCart: false,
            customName: undefined
        })
    },

    checkSelectedStepMoreTarget: (stepNumber) => {
        const steps = {...get().steps}
        let isSelectedStepsMore = false

        for (const step in steps) {
            const currentStepNumber = steps[step].number

            if (currentStepNumber <= stepNumber) continue;

            steps[step].products.forEach(productsList => productsList
                .forEach(product => {
                    if (product.selected.stepNumber !== null && !product.default) {
                        isSelectedStepsMore = true
                        return
                    }
                }))
        }

        return isSelectedStepsMore
    },

    setSelectedFilterToCurrentStep: (value, productProperty) => {
        const steps = get().steps
        const activeStep = get().getActiveStep()

        if (!activeStep) return

        const activeStepName = activeStep.name
        const selectedFilters = {...activeStep.selectedFilters}
        const selectOptionsMap = {...activeStep.selectOptionsMap}

        selectedFilters[productProperty] = value

        /**
         * Обновляем селекты в карте, все идущие ниже после выбранного
         * Текущий оставляем как есть
         * Следующий за текущим ставим в null - не выбран, но может быть выбран
         * Все последующие ставим в false - не выбран и не может быть выбран (пока не выбран текущий)
         */
        let isResetOption: boolean | null = false
        for (const key in selectOptionsMap) {
            if (isResetOption === true) {
                selectOptionsMap[key] = false
                continue
            }

            if (isResetOption === null) {
                selectOptionsMap[key] = null
                isResetOption = true
            }

            if (key === productProperty) isResetOption = null
        }

        /**
         * Удаляем выбранные ранне Фильтры. Все идущие после выбранного
         */
        isResetOption = false
        for (const key in selectedFilters) {
            if (isResetOption) delete selectedFilters[key]
            if (key === productProperty) isResetOption = true
        }

        set({
            steps: {
                ...steps,
                [activeStepName]: {
                    ...activeStep,
                    selectedFilters: selectedFilters,
                    selectOptionsMap: selectOptionsMap
                }
            }
        })
    },

    resetSelectedFilterAtStep: (productProperty) => {
        const steps = get().steps
        const activeStep = get().getActiveStep()

        if (!activeStep) return

        const activeStepName = activeStep.name
        const selectedFilters = {...activeStep.selectedFilters}
        const selectOptionsMap = {...activeStep.selectOptionsMap}

        /**
         * Сбрасываем селекты в карте, начиная с выбранного (его сбрасываем) и ниже
         * Текущий ставим в null - не выбран, но может быть выбран
         * Все последующие ставим в false - не выбран и не может быть выбран (пока не выбран текущий)
         */
        let isResetOption = false
        for (const key in selectOptionsMap) {
            if (isResetOption) selectOptionsMap[key] = false

            if (key === productProperty) {
                selectOptionsMap[key] = null
                isResetOption = true
            }
        }

        /**
         * Удаляем выбранные ранне Фильтры, начиная с выбранного и ниже
         */
        isResetOption = false
        for (const key in selectedFilters) {
            if (key === productProperty) isResetOption = true
            if (isResetOption) delete selectedFilters[key]
        }

        set({
            steps: {
                ...steps,
                [activeStepName]: {
                    ...activeStep,
                    selectedFilters: selectedFilters,
                    selectOptionsMap: selectOptionsMap
                }
            }
        })
    },

    updateSelectOptionsMapAndSetAutoSelectedArticle: (productProperty) => {
        let steps = get().steps
        const activeStep = get().getActiveStep()

        if (!activeStep) return

        let activeStepProducts = [...activeStep.products]
        const stepName = activeStep?.name
        const stepNumber = activeStep?.number.toString()
        let selectOptionsMap = {...activeStep?.selectOptionsMap}
        let selectedFilters = {...activeStep?.selectedFilters}

        let isCurrentPropAfterSelected = false

        if (!stepName) return

        for (const prop in selectOptionsMap) {
            if (isCurrentPropAfterSelected) {
                selectOptionsMap[prop] = null
                isCurrentPropAfterSelected = false
            }

            if (productProperty === prop) {
                selectOptionsMap[prop] = true
                isCurrentPropAfterSelected = true
            }
        }

        /**
         * Если после фильтрации остался только один продукт, выставляем по нему
         * у активного шага свойства selectOptionsMap и selectedFilters
         * чтобы привести Селекты в соответствие с авто-выбором
         *
         * Если после фильтрации остался более одного продукта,
         * тогда сбрасываем ранее выбранный артикул у активного шага
        */
        const getFilteredActiveStepProducts = get().getFilteredActiveStepProducts
        const filteredProducts = getFilteredActiveStepProducts(false)

        if (filteredProducts?.length === 1) {
            const [ newSelectOptionsMap, newFilters ] = get()
                .setCurrentStepFilterByAutoSelectFinalArticle(filteredProducts[0][0])

            selectOptionsMap = newSelectOptionsMap
            selectedFilters = newFilters

            // Разблокируем, а затем блокируем артикулы по блэклисту
            const article = filteredProducts[0][0].name

            // At first unblocking previously blocked products by the current step
            steps = {...get().unblockProductsByStep(stepNumber)}

            // At second blocking products according blacklist
            steps = {...get().blockProducts(steps, article, stepName, stepNumber)}


        } else {
            const clearedProducts = get().resetSelectedProductsByActiveStep()
            if (clearedProducts != null) activeStepProducts = [...clearedProducts]
        }

        set({
            steps: {
                ...steps,
                [stepName]: {
                    ...activeStep,
                    products: activeStepProducts,
                    selectOptionsMap: selectOptionsMap,
                    selectedFilters: selectedFilters
                }
            }
        })

        // Updating Price, Product list on right side and Total height of the dot
        get().updateTotalPrice()
        get().updateTotalProductList()
        get().updateTotalHeight()
    },

    setAutoSelectedArticle: () => {
        let steps = {...get().steps}
        const activeStep = get().getActiveStep()

        if (!activeStep) return

        let activeStepProducts = [...activeStep.products]
        const stepName = activeStep.name
        const stepNumber = activeStep.number.toString()

        /**
         * Если после фильтрации остался более одного продукта,
         * тогда сбрасываем ранее выбранный артикул у активного шага
        */
        const getFilteredActiveStepProducts = get().getFilteredActiveStepProducts
        const filteredProducts = getFilteredActiveStepProducts(false)

        if (filteredProducts?.length !== 1) {
            const clearedProducts = get().resetSelectedProductsByActiveStep()
            if (clearedProducts != null) activeStepProducts = [...clearedProducts]
        } else {
            const article = filteredProducts[0][0].name

            // At first unblocking previously blocked products by the current step
            steps = {...get().unblockProductsByStep(stepNumber)}

            // At second blocking products according blacklist
            steps = {...get().blockProducts(steps, article, stepName, stepNumber)}
        }

        set({
            steps: {
                ...steps,
                [stepName]: {
                    ...activeStep,
                    products: activeStepProducts
                }
            }
        })

        // Updating Price, Product list on right side and Total height of the dot
        get().updateTotalPrice()
        get().updateTotalProductList()
        get().updateTotalHeight()
    },

    getFilteredActiveStepProducts: (propKey) => {
        const allProductsData = get().products
        const activeStep = get().getActiveStep()
        const selectedFilters = {...activeStep?.selectedFilters}

        let activeStepProducts = activeStep?.products

        if (!selectedFilters) return activeStepProducts

        /**
         * Если список артикулов активного шага запрашивает Опция Селекта
         * (не список кнопок RadioButtonList), то обрезаем выбранные фильтры
         * selectedFilters от текущего и все, что ниже. Для того, чтобы
         * не блокировать соседние опции на первом селекте
         */
        let isAfterProp = false
        if (propKey) {
            for (const prop in selectedFilters) {
                if (prop === propKey) {
                    isAfterProp = true
                }

                if (isAfterProp) {
                    delete selectedFilters[prop]
                }
            }
        }

        // Функция фильтрации
        const filtering = (
            productList: productButton[][] | undefined,
            filterProp: string): productButton[][] | undefined => {

            if (!productList) return productList

            const selectedFilterValue = selectedFilters[filterProp]

            productList = productList.filter(product => {

                // Исключаем из отфильтрованного списка продуктов ЗАБЛОКИРОВАННЫЕ
                if (product[0].blocked.stepName !== null) return false

                const article = product[0].name

                if (!allProductsData[article]) return false // Если в массиве products нет текущего артикула НЕ ВЫВОДИМ после фильтрации

                let currentProductFilterValue = allProductsData[article][filterProp]

                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в НИЖНЕМ регистре
                if (!currentProductFilterValue) {
                    currentProductFilterValue = allProductsData[article][filterProp.toLocaleLowerCase()]
                }

                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в ВЕРХНЕМ регистре
                if (!currentProductFilterValue) {
                    currentProductFilterValue = allProductsData[article][filterProp.toLocaleUpperCase()]
                }

                if (Array.isArray(currentProductFilterValue)) {
                    for (const value of currentProductFilterValue) {
                        if (value == selectedFilterValue) return true
                    }

                    return false

                } else {
                    return currentProductFilterValue == selectedFilterValue
                }
            })

            return productList
        }

        for (const filterProp in selectedFilters) {
            activeStepProducts = filtering(activeStepProducts, filterProp)
        }

        return activeStepProducts
    },

    toggleVisibleWarning: (direction, fromStepNumber, callbacksObj) => {
        set({
            warning: {
                isVisible: direction,
                fromStepNumber: fromStepNumber,
                callbacksObj: callbacksObj,
            }
        })
    },

    pushDotToCart: async () => {
        const stepsCount = get().stepsCount
        const customName = get().customName

        const configurationName = customName ? customName : 'Дот в сборе'

        const order = {
            name: configurationName,
            image: get().getFinalImage(),
            count: get().complectCount,
            arts: get().totalProductList?.map(product => {
                const count = (stepsCount && product.onStep)
                    ? stepsCount[product.onStep]
                    : 1

                return {
                    ...product,
                    art: product.article,
                    count: count // Количество отдельного артикула в составе Дота
                }
            })
        }

        const response = window.addDotToCart(order)

        response.then(result => {
            if (result) {
                // В случае успешного ответа, если нужно, можно сбросить конфигуратор
                // В этом случае не нужно ставить свойство isDotInCart: true
                // get().resetConfiguration(0)

                set({isDotInCart: true})
            }
        })
    },

    getCharacteristics: () => {
        const characteristics = get().characteristics
        let total: Record<string, string> = {}
        let isThereIPClass = false
        // let isThereProtectionClassIK = false

        for (const step in characteristics) { // обходим характеристики по свойства/шагам
            const articlesArr = getSelectedProductsOnStep(step) // Получаем массивы выбранных на шаге артикулов
            const characteristicsObj = getCharacteristicsBySelectedArticles(articlesArr, characteristics[step]) // получаем характеристику из выбранных артикулов
            total = Object.assign(total, characteristicsObj) // Добавляем характеристики в итоговый объект
        }

        function getSelectedProductsOnStep(step: string): string[] {
            const totalProductList = get().totalProductList
            const productsArr: string[] = []

            if (totalProductList) {
                for (const product of totalProductList) {
                    if (product.onStep === step) {
                        if (product.article) productsArr.push(product.article)
                    }
                }
            }
            return productsArr
        }

        function getCharacteristicsBySelectedArticles (
            articlesArr: string[],
            characteristicsObj: Record<string, string>
        ): Record<string, string> {

            const productsAll = get().products
            const units = get().units
            const resCharacteristics: Record<string, string> = {}

            for (const article of articlesArr) { // обходим выбранные на шагах артикулы
                for (const characteristic in characteristicsObj) { // обходим характеристики
                    if (productsAll[article]
                        && productsAll[article][characteristic] !== null
                        && productsAll[article][characteristic] !== undefined) {

                        const property = characteristicsObj[characteristic]

                        let value

                        // Для IP (Степень пыле-влагозащищенности сначала идут единицы)
                        if (characteristic === 'ip_class') {
                            isThereIPClass = true
                            value = (units && units[characteristic] ? `${units[characteristic]}` : '') + productsAll[article][characteristic]
                        } else if (characteristic === 'protection_class_ik') {
                            // isThereProtectionClassIK = true
                            value = (units && units[characteristic] ? `${units[characteristic]}` : '') + productsAll[article][characteristic]
                        } else {
                            value = productsAll[article][characteristic] + (units && units[characteristic] ? `${units[characteristic]}` : '')
                        }

                        if (!resCharacteristics[property]) { // Записываем характеристику только один раз
                            resCharacteristics[property] = value
                        }
                    }
                }
            }

            for (const characteristic in characteristicsObj) {
                if (characteristic === 'ip_class') continue // Характеристики ip_class (степень пыле-влагозащищенности) может не быть

                const prop = characteristicsObj[characteristic]
                if (!resCharacteristics[prop] && get().userStatus === 'admin') {
                    console.log('\x1b[31m%s\x1b[0m', `Для артикулов ${articlesArr} не указана характеристика ${characteristic} - ${prop}`);
                }
            }

            return resCharacteristics
        }

        // Если нигде не указан IP (степень пыле-влагозащищенности), то указываем дефолтное значение
        if (!isThereIPClass) {
            total['Степень пыле-влагозащищенности'] = "IP20"
        }

        return total
    },

    getResultStepAdditionalData: () => {
        const totalProductList = get().totalProductList
        const combinationsArr = get().combos
        const stepsAndProducts: Record<string, string> = {}
        const checkedCombs: Combos = []
        const resultStepData: {light_flow?: number, final_image?: string, final_drawing?: string, files: Record<string, string>[]} = {
            files: []
        }
        const isLastStep = get().getActiveStep()?.isLast

        if (!isLastStep) return resultStepData

        if (!totalProductList || !combinationsArr) return {}

        totalProductList.forEach(product => {
            if (product.onStep && product.article && !stepsAndProducts[product.onStep]) {
                stepsAndProducts[product.onStep] = product.article
            }
        })

        for (const combination of combinationsArr) {
            if (typeof combination.combo === 'number'
                || typeof combination.combo === 'string'
                || Array.isArray(combination.combo)) continue

            const isMatch = checkCombination(Object.values(stepsAndProducts), combination.combo)

            if (isMatch) checkedCombs.push(combination)
        }

        function checkCombination(selectedArticles: Array<string>, combination: Record<string, Array<string>>) {
            let isMatch = true

            for (const step in combination) {
                const isIncludes = combination[step].some(
                    article => selectedArticles.includes(article))
                if (!isIncludes) isMatch = false
            }

            return isMatch
        }

        if (checkedCombs.length === 0 && get().userStatus === 'admin') {
            console.warn("Не найдено ни одного совпадения комбинаций (Люмены, Картинка, Чертеж) с выбранными пользователем артикулами!");
        } else {
            checkedCombs.forEach(i => {
                if (!resultStepData.light_flow
                    && i.light_flow
                    && typeof i.light_flow === 'number'
                ) { resultStepData['light_flow'] = i.light_flow }

                if (!resultStepData.final_image
                    && i.final_image
                    && typeof i.final_image === 'string'
                ) { resultStepData['final_image'] = i.final_image }

                if (!resultStepData.final_drawing
                    && i.final_drawing
                    && typeof i.final_drawing === 'string'
                ) { resultStepData['final_drawing'] = i.final_drawing }

                if (i.files && Array.isArray(i.files)
                ) { resultStepData['files'] = [...resultStepData['files'], ...i.files] }
            })
        }

        return resultStepData
    },

    // Данная функция получает объект, где в свойствах имена функций в Store,
    // а в значениях массив атрибутов и вызывает все функции в цикле.
    dispatchStoreActions: (callbacksObj) => {
        if (callbacksObj) {
            for (const cb in callbacksObj) {
                const storeFn = get()[cb]
                if (typeof storeFn === 'function') {
                    storeFn(...callbacksObj[cb])
                }
            }
        }
    },

    setCurrentStepFilterByAutoSelectFinalArticle: (product) => {
        const activeStep = get().getActiveStep()
        const newSelectOptionsMap = {...activeStep?.selectOptionsMap}
        const newFilters = {...activeStep?.selectedFilters}
        const products = get().products

        for (const option in newSelectOptionsMap) {
            if (newSelectOptionsMap[option]) continue

            const value = products[product.name][option]

            if (typeof value === "number" || typeof value === 'string') {
                // Set filters
                newFilters[option] = typeof value === 'string' ? value : value.toString()

                // Set Options
                newSelectOptionsMap[option] = true
            }
        }

        return [newSelectOptionsMap, newFilters]
    }

})))

export default useDots