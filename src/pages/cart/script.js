const updateProductSum = (inputNode, isInc) => {

    const value = parseInt(inputNode.value)
    const calc = inputNode.closest('.cart__calc')

    const sumNode = calc.querySelector('[data-total]')
    const priceNode = calc.querySelector('[data-price]')
    const price = parseFloat(priceNode.innerText.replace(/\s/g, ""))

    const totalNode = document.querySelector('#total')
    const total = parseFloat(totalNode.innerText.replace(/\s/g, ""))

    const totalValue = isInc ? total + price : total - price

    sumNode.innerText = formatNumber(price * value)
    totalNode.innerText = formatNumber(Math.abs(totalValue))
}

const cartRequest = window.throttle(function(code, val) {
    window.setProductToCart({ art: code, count: val })
}, 3000)

const dotRequest = window.throttle(function(code, val) {
    window.setDotToCart({ id: code, count: val })
}, 3000)

const initCartCounter = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc-counter button'))

    btns.forEach(el => {
        el.addEventListener('click', function() {
            const isInc = this.dataset.type === 'inc'
            const input = this.parentNode.querySelector('input')
            const decBtn = this.parentNode.querySelector('[data-type="dec"')
            let val = input.value

            val = isInc
                ? parseInt(val) + 1
                : parseInt(val) - 1

            if (val === 0) val++

            decBtn.disabled = !(val > 1)

            input.value = val

            updateProductSum(input, isInc)

            const cartItem = this.closest('.cart__item')
            const cartDot = this.closest('.cart__dot')

            if (!cartItem && !cartDot) return
            if (cartItem) cartRequest(cartItem.dataset.productId, val)
            if (cartDot) dotRequest(cartDot.dataset.productId, val)
        })
    })
}

const getTotalValue = () => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        const total = cartTotal.innerText
        return parseInt(total.replace(/\s/g, ""))
    }

    return 0
}

const updateTotalPrice = (val) => {
    const cartTotal = document.getElementById('total')

    if (cartTotal) {
        cartTotal.innerText = formatNumber(getTotalValue() + val)
    }
}

const resetTotalText = () => {
    const textWrap = document.querySelector('.cart__actions-total')
    textWrap.innerHTML = '<p>В корзине нет товаров</p>'

    const btnWrap = document.querySelector('.cart__actions-buttons')
    const btnSearch = btnWrap.querySelector('.btn_search')
    while (btnWrap.firstChild) btnWrap.removeChild(btnWrap.firstChild)
    btnWrap.appendChild(btnSearch)
}

const checkTotalPrice = () => {
    const total = getTotalValue()
    if (total <= 0) resetTotalText()
}

const delProduct = (el) => {
    let height = el.offsetHeight

    el.style.maxHeight = height + 'px'

    setTimeout(() => el.classList.add('removed'), 10)
    setTimeout(() => el.remove(), 1000)
    setTimeout(() => {
        showAnimElements()
        setAnimationElms()
    }, 300)
}

const initDelProdBtns = () => {
    const btns = Array.from(document.querySelectorAll('.cart__calc .btn_del'))

    btns.forEach(el => el.addEventListener('click', function() {
        const product = el.closest('[data-product]')

        if (!product) return

        const isDot = product.classList.contains('cart__dot')
        const totalText = product.querySelector('[data-total]').innerText
        const total = parseInt(totalText.replace(/\s/g, ""))
        const input = product.querySelector('input')
        const code = product.dataset.productId

        const productName = isDot
            ? product.querySelector('.cart__title').innerText
            : product.querySelector('.cart__subtitle').innerText

        if (isDot) {
            // Удаляем DOT  асинхронно из БД
            window.removeDotFromCart({ id: code, count: parseInt(input.value) })
        } else {
            // Удаляем продукт асинхронно из БД
            window.removeProductFromCart({ art: code, count: parseInt(input.value) })
        }

        delProduct(product) // Удаляем продукт с экрана
        updateTotalPrice(total * -1)
        checkTotalPrice()
        showModalMsg(productName, 'Удален из корзины')
    }))
}

const setErrorOnController = (inputNode, errorText) => {
    const container = inputNode.parentNode
    const message = container.querySelector('.error-message')

    container.classList.add('has-error')
    message.innerText = errorText

    inputNode.addEventListener('input', () => {
        container.classList.remove('has-error')
    })
}

const resetErrorOnController = (inputNode) => {
    inputNode.parentNode.classList.remove('has-error')
}

const clearCart = () => {
    const products = Array.from(document.querySelectorAll('[data-product]'))
    products.forEach(el => delProduct(el))
    resetTotalText()
}

const initOrderSubmit = () => {
    const form = document.getElementById('setOrderForm')
    if (!form) {
        return;       
    }
    const formValid = {name: true, phone: true, email: true}
    const phoneNumber = form.querySelector('[name="phone"]')

    // Phone masking
    const phoneMaskOptions = {
        mask: '+{7} (000) 000-00-00',
        lazy: true,
        placeholderChar: '#'
    }
    const phoneMask = IMask(
        phoneNumber,
        phoneMaskOptions
    )

    phoneNumber.addEventListener('focus', () => phoneMask.updateOptions({lazy: false}))
    phoneNumber.addEventListener('blur', () => phoneMask.updateOptions({lazy: true}))

    form.addEventListener('submit', function(e) {
        e.preventDefault()

        const name  = this.querySelector('[name="name"]')
        const phone = this.querySelector('[name="phone"]')
        const email = this.querySelector('[name="email"]')

        // Check name
        if (name.value === '') {
            setErrorOnController(name, 'Заполните поле ФИО')
            formValid.name = false
        } else {
            resetErrorOnController(name)
            formValid.name = true
        }

        // Check phone
        if (phone.value === '') {
            setErrorOnController(phone, 'Заполните поле Телефон')
            formValid.phone = false
        } else {

            if (window.validatePhone(parseInt(phoneMask.unmaskedValue))) {
                resetErrorOnController(phone)
                formValid.phone = true
            } else {
                setErrorOnController(phone, 'Некорректный номер телефона')
                formValid.phone = false
            }
        }

        // Check email
        if (email.value !== '') {
            if (window.validateEmail(email.value)) {
                resetErrorOnController(email)
                formValid.email = true
            } else {
                setErrorOnController(email, 'Некорректный адрес электронной почты')
                formValid.email = false
            }
        } else {
            resetErrorOnController(email)
            formValid.email = true
        }

        // Sending form data
        if (formValid.name && formValid.phone && formValid.email) {

            console.log('Send fromData to back -------------------------------------');
            const formData = new FormData(form);
            for (let [name, value] of formData) {
                console.log(`${name}: ${value}`);
            }

            form.reset()
            clearCart()
            toggleModalDialog('#orderSentMsg')
        }
    })
}

const SaveAsPDF = () => {
    const showHiddenElements = () => {
        const animationElms = Array.from(document
            .querySelectorAll('.animation-element'))

        animationElms.forEach(el => el
            .classList.remove('animation-element'))
    }

    const printPage = () => {
        showHiddenElements()
        window.print()
    }

    document.getElementById('SaveAsPDF')
        .addEventListener('click', printPage)

    window.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'p') {
            showHiddenElements()
        }
    })

    window.addEventListener('beforeprint', showHiddenElements)
}

window.addEventListener('load', () => {
    window.safeCall(initCartCounter)
    window.safeCall(initDelProdBtns)
    window.safeCall(initOrderSubmit)
    window.safeCall(SaveAsPDF)
})

