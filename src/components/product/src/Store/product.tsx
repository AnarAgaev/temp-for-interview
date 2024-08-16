import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { productAPIDataContract } from './zod.ts'
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

declare global {
    interface Window {
        productDataLink: string
        getCartLink: string
        setProductToCart: ({art, count}: {art: string, count: number}) => Promise<Record<string, unknown>>
        terms: Array<string>
        debounce: (func: (article: string, count: number) => void, ms: number) => () => void
        showModalMsg: (title?: string, message?: string) => void
        getUrlParameterByName: (name: string, url?: string) => string | null
        initInformers: () => void
    }
}

const useProduct = create<productStoreInterface>()(devtools((set, get) => ({
    current: {
        article: '',
        price: 0,
        image: '',
        color: '',
        colorful_temperature: 0,
        light_flow: 0,
        power: 0,
        angle_of_light: 0,
        brightness_adjustment: false,
        stock: null
    },

    series: {
        title: '',
        gallery: [],
        products_available: [],
        fields: {},
        translate: {},
        units: {},
        videos: null,
        specifications: null,
        description: null,
        files: null,
        badges: null
    },

    loading: true,
    error: null,
    selectsMap: {},
    cart: {},
    userStatus: null,

    updateCart: (cart) => set({cart}),

    updateProductCountInRemoteCart: window.debounce(function (article: string, count: number): void {
        window.showModalMsg("Изменили количество товара")
        window.setProductToCart({ art: article, count: count })
            .then(data => {
                set({cart: data})
            })
    }, 500),

    setCountInCart: (article, direction) => {
        const cart = get().cart
        const products = cart.products

        let newCount

        const newProducts = products?.map(el => {
            if (el.article === article) {
                newCount = el.count + direction
                if (newCount <= 0) newCount = 1
                el.count = newCount
            }
            return el
        })

        const newCart = {
            ...cart,
            products: newProducts
        }

        if (newCount) {
            set({cart: newCart})
            get().updateProductCountInRemoteCart(article, newCount)
        }
    },

    count: 1,
    setCount: (count) => set({count}),

    fetchProductInitData: async () => {
        set({ loading: true })

        try {
            if (!window.productDataLink && !window.getCartLink) {
                throw new Error(`На странице не указаны ссылки на Продукт (window.productDataLink) и/или Корзину (window.getCartLink)`)
            }

            const fetchProduct = fetch(window.productDataLink)
            const fetchCart = fetch(window.getCartLink)
            const [resProducts, resCart] = await Promise.all([fetchProduct, fetchCart])
            const [products, cart] = await Promise.all([resProducts.json(), resCart.json()])

            const safeData = productAPIDataContract.safeParse(products)

            if (!safeData.success) {
                const errorMessage = generateErrorMessage(safeData.error.issues, zodErrorOptions)
                console.log(errorMessage)

                return
            }

            set({
                cart,
                series: products.data,
                userStatus: safeData.data.is_admin ? 'admin' : null,
                loading: false,
                error: null
            })

            get().setInitProduct()

        } catch (error) {
            if (get().userStatus === 'admin') {
                console.error(`Ошибка запроса данных Продукта (window.productDataLink) и/или Корзины (window.getCartLink)`, error)
            }

            set({ error: error, loading: false })
        }
    },

    setInitProduct: () => {
        const products = get().series.products_available
        const fields = get().series.fields
        const selectsMap: productInterface = {}
        let article: string | undefined | null

        // For the testing, at first getting article from the URL
        article = window.getUrlParameterByName('article')

        if (!article) article = (document.querySelector('[data-product-article]') as HTMLElement).dataset.productArticle

        const currentProduct = products.filter(product => article === product.article)

        if (currentProduct.length !== 0) {
            // Add select map for selects from current Product
            for (const prop in fields) {
                selectsMap[prop] = currentProduct[0][prop]
            }

            set({
                current: currentProduct[0],
                selectsMap
            })
        } else {
            throw new Error("There's no correct product article at the data-product attribute on page! [data-product-article] should be filled.")
        }
    },

    updateProduct: (field: string, value: number | string | boolean | undefined = undefined) => {
        let products = [...get().series.products_available]
        const currentProduct: productInterface = { ...get().current }
        const fields = get().series.fields
        let resetMarker = false // По этому маркеру отслеживаем, что обрабатываемое поле находится после кликнутого (ниже его) в списке выбираемых опций товара

        const selectsMap: productInterface = {}
        /**
         * Карта свойств по которым выводим селекты.
         * В свойствах перечислены все свойства селекта: color, power и т.д.
         *
         * selectsMap[prop] может принимать значения
         *
         * 1. текущее значение соответствующего свойства активного продукта
         * 2. null - не имеет значения, НО может быть выбрано в селекте
         * 3. undefined - не имеет значения и не может быть выбрано в селекте
         */

        for (const prop in fields) {
            if (field === prop) { // Если выбранное поле равно текущему в цикле
                resetMarker = true
                selectsMap[prop] = value !== undefined ? value : null
                continue
            }

            if (resetMarker) {
                // Если в текущем массиве свойств есть только одно свойство, это значит, что у всех товаров значение этого свойство идентично. Тогда сразу ставим его выбранным.
                if ((fields[prop] as unknown[]).length === 1 && value !== undefined) {
                    selectsMap[prop] = (fields[prop] as {value: string}[])[0].value;
                    continue
                }

                if (value) {
                    selectsMap[prop] = null
                    value = undefined
                } else {
                    selectsMap[prop] = undefined
                }

            } else {
                selectsMap[prop] = currentProduct[prop]
            }
        }

        const filteredProducts = (products: productInterface[], prop: string) => {
            return products.filter(product => {
                return product[prop] == selectsMap[prop]
            })
        }

        const getCheapestProduct = (products: productInterface[]) => {
            let minPrice = Infinity
            let cheapestProduct = {}

            for (const product of products) {
                if (typeof product.price !== 'number') continue

                if (product.price < minPrice) {
                    minPrice = product.price
                    cheapestProduct = product
                }

            }
            return cheapestProduct
        }

        // Filtering products
        if (get().userStatus === 'admin') {
            console.log('Продукты до фильтрации', products)
        }

        for (const prop in selectsMap) {
            if (selectsMap[prop]) {
                products = filteredProducts(products, prop)
            }
        }

        if (get().userStatus === 'admin') {
            console.log('Продукты после фильтрации', products);
        }

        const newProduct: productInterface = getCheapestProduct(products)

        if (get().userStatus === 'admin') {
            console.log('Самый дешёвый из отфильтрованных', newProduct)
        }

        set({
            current: getCheapestProduct(products),
            selectsMap
        })
    }
})))

export default useProduct