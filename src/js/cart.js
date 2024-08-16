/**
 * Флаг, указывающий на режим разработки.
 * @type {boolean}
 *
 * Для сервера верстки собирать и пушить в режиме DEV_MODE = true
 * На прод и дев собирать и пушить в режиме DEV_MODE = false
 *
 * В режиме DEV_MODE = true, при локальной разработке,
 * также необходимо править путь до файла main.js
 *
 * Прим.: <script src="http://localhost:номер_пота/js/main.js" defer></script>
 */
const DEV_MODE = window.MODE === 'dev' // dev - true, build - false

// Init cart custom Event
const cartEvent = new CustomEvent('cartUpdateEvent', {
    detail: {
        message: 'Fired cart product updated custom Event!'
    },
    bubbles: false,
    cancelable: false
})

const normalizeResponseCartData = (data) => {
    const products = []

    if (data.dots) {
        data.dots.forEach(dot => {
            products.push({ article: dot.id, count: dot.count })
        });
    }

    if (data.products) {
        data.products.forEach(product => {
            products.push({ article: product.article, count: product.count })
        });
    }

    return products
}

// Methods to work with cart for PRODUCTS
window.setProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество товара в корзине:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-set.json')
        : await fetch('/ajax/cart/set', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили товар в корзине. Получили ответ', data)

        return data

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения товара в Корзине! Код ошибки:', res.status)
    }
}

window.addProductToCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление товара в корзину:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-add.json')
        : await fetch('/ajax/cart/add', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Добавили товар в корзину. Получили данные', data)
        return data
    } else {
        // console.error('Ошибка добавления товара в Корзину! Код ошибки:', res.status)
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
    }
}

window.removeProductFromCart = async ({art, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Удаление товара из корзины:', art, ' - ', count);

    const formData = new FormData()
    formData.append('art', art)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-del.json')
        : await fetch('/ajax/cart/del', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили товар из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления товара из Корзины! Код ошибки:', res.status)
    }
}

// Methods to work with cart for DOTS
window.setDotToCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Размещаем фиксированное количество Дотов в корзине:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-setDot.json')
        : await fetch('/ajax/cart/set', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Разместили Доты в корзине. Получили ответ', data);

    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка размещения Дотов в Корзине! Код ошибки:', res.status)
    }
}

window.addDotToCart = async (order) => {
    window.safeCall(window.spinner.show)

    // console.log('Добавление дота в корзину. Отправляем данные:', order)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-addDot.json')
        : await fetch('/ajax/cart/addDot', { method: 'POST', body: JSON.stringify(order) })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]
        window.showModalMsg("Добавили Дот в корзину. Получили данные", data)

        return true
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        console.error('Ошибка добавления Дота в Корзину! Код ошибки:', res.status)
        return false
    }
}

window.removeDotFromCart = async ({id, count}) => {
    window.safeCall(window.spinner.show)

    // console.log('Удаление Дота из корзины:', id, ' - ', count);

    const formData = new FormData()
    formData.append('id', id)
    formData.append('count', count)

    const res = DEV_MODE
        ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-delDot.json')
        : await fetch('/ajax/cart/delDot', { method: 'POST', body: formData })

    if (res.ok) {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        const data = await res.json()
        window.CART.products = [...normalizeResponseCartData(data)]

        // console.log('Удалили Dot из корзины. Получили данные', data);
    } else {
        setTimeout(() => window.safeCall(window.spinner.hide), 300)
        // console.error('Ошибка удаления Дота из Корзины! Код ошибки:', res.status)
    }
}


// Cart Proxy
const cartGet = (target, prop) => {
    return target[prop]
}

const cartSet = (target, prop, val) => {


    if (prop === 'products') {
        // Проверьте, отличается ли новое значение от старого значения.
        const is_same = (target.products.length === val.length) && target.products.every(
            function(element, index) {
                return element.article === val[index].article && element.count === val[index].count;
            }
        );
        if (!is_same) {
            // console.log('SETTING');
            // console.log('target', target);
            // console.log('prop', prop);
            // console.log('val', val);

            target.products = [...val];
            cartEvent.detail.products = target.products;
            // Dispatching custom cart update Event
            const cartProductCountNode = document.querySelector("#cartProductCount");
            if (cartProductCountNode) cartProductCountNode.dispatchEvent(cartEvent);
        }
    }

    return true
}

const initCart = async () => {
    if (!window.CART) {

        const res = DEV_MODE
            ? await fetch('https://anaragaev.github.io/technolight.layout/mocks/cart-get.json')
            : await fetch('/ajax/cart/get', { method: 'POST' })

        if (res.ok) {
            const data = await res.json()

            window.CART = new Proxy({
                products: [...normalizeResponseCartData(data)]
            }, {
                get: cartGet,
                set: cartSet
            })

            // console.log('Инициализируем корзину -------------------------- START');
            // console.log('Response data', data)
            // console.log('window.CART', window.CART)
            // console.log('Инициализируем корзину -------------------------- FINISH');

        } else {
            console.error('Ошибка запроса Корзины! Код ошибки:', res.status)
        }
    }
}

window.addEventListener('load', initCart)

window.cartUpdateInterval = setInterval(async () => {
    if (window.CART !== undefined && !DEV_MODE) {
        const res = await fetch('/ajax/cart/get', { method: 'POST' })
        if (res.ok) {
            const data = await res.json()
            window.CART.products = [...normalizeResponseCartData(data)]
        }
    }
}, 5000)