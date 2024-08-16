// Add product to favorites
const addToFavoritesClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message
    const headerFavorites = document
        .querySelector('.header__buttons-link_favorites .header__buttons-count')
    const currentFavoritesCount = parseInt(headerFavorites.innerText)

    if (!isSelected) {
        _this.classList.add('selected')
        headerFavorites.innerText = currentFavoritesCount + 1
        headerFavorites.classList.add('selected')
        setTimeout(() => headerFavorites.classList.remove('selected'), 1000)

        showModalMsg(title, message)

        // console.error('Здесь надо будет написать асинхронный запрос добавления товара в избранные');
        return
    }

    _this.classList.remove('selected')
    headerFavorites.innerText = currentFavoritesCount - 1
    // console.error('Async query to DELETE selected product from Favorites');
}

const initAddToFavorites = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__favorites'))

    btns.forEach(btn => btn.addEventListener('click', addToFavoritesClickHandler))
}

// Add product to cart
const addToCartClickHandler = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const _this = e.target
    const isSelected = _this.classList.contains('selected')
    const title = _this.dataset.title
    const message = _this.dataset.message

    if (!isSelected) {
        _this.classList.add('selected')
        showModalMsg(title, message)

        // Push current product to Cart Global Object (window.CART)
        window.addProductToCart({ art: _this.dataset.productId, count: 1 })

        return
    }

    _this.classList.remove('selected')
    showModalMsg(title, 'Удален из корзины')

    // Remove current product from Cart Global Object (window.CART)
    window.removeProductFromCart({ art: _this.dataset.productId, count: 1 })
}
const initAddToCart = () => {
    const btns = Array.from(document
        .querySelectorAll('.product-item__cart'))

    btns.forEach(btn => btn.addEventListener('click', addToCartClickHandler))
}

window.addEventListener('load', () => {
    initAddToFavorites()
    initAddToCart()
})