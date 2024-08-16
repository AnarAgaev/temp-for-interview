import { useState, useEffect } from "react";
import { useProduct } from "../../Store";
import Stock from "../Stock";
import style from "./Cart.module.scss";

interface CustomWindow extends Window {
    showModalMsg: (title?: string, message?: string) => void
    addProductToCart: ({ art, count }: { art: string, count: number }) => Promise<Record<string, unknown>>
    cartLink: string
}

declare let window: CustomWindow

const { form, counter, calc, buttons, inc, dec } = style

const Cart: React.FC = () => {
    const cart = useProduct(store => store.cart)
    const updateCart = useProduct(store => store.updateCart)
    const setCountInCart = useProduct(store => store.setCountInCart)
    const series = useProduct(store => store.series)
    const currentProd = useProduct(store => store.current)
    const [inCart, setInCart] = useState<boolean>(false)
    const [count, setCount] = useState<number>(1)
    const [countInCart, updateCountInCart] = useState<number>(0)

    const handleInc: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (inCart && currentProd.article) {
            setCountInCart(currentProd.article, 1)
            return
        }

        setCount(count + 1)
    }

    const handleDec: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (inCart && currentProd.article) {
            setCountInCart(currentProd.article, -1)
            return
        }

        setCount((count - 1) <= 0 ? 1 : count - 1)
    }

    const handleButtonClick = () => {
        if (!currentProd.article) return

        window.addProductToCart({
            art: currentProd.article,
            count: count
        }).then(cart => {
            updateCart(cart)
            setInCart(true)
            window.showModalMsg(`${series.title}`, "Добавлен в корзину")
        })
    }

    useEffect(() => {
        let isInCart = false
        let countProductInCart

        cart.products?.forEach(el => {
            if (el.article === currentProd.article) {
                isInCart = true
                countProductInCart = el.count
            }
        })

        setInCart(isInCart)

        isInCart && countProductInCart
            ? updateCountInCart(countProductInCart)
            : setCount(1)

    }, [cart, currentProd])

    return (
        <div className={form}>
            <form className={counter} onSubmit={e => e.preventDefault()}>
                <div className={`${calc}`}>
                    <button type="button" onClick={handleDec}
                        className={`btn btn_lite ${(inCart ? countInCart : count) === 1 ? ' disabled' : ''}`}>
                        <i className={inc}></i>
                    </button>

                    {
                        inCart
                            ? <input type="text" value={countInCart} readOnly />
                            : <input type="text" value={count} readOnly />
                    }

                    {/* <input type="text" value={inCart ? countInCart : count} readOnly />
                    <input type="text" value={inCart ? countInCart : count} readOnly /> */}

                    <button className="btn btn_lite" type="button" onClick={handleInc}>
                        <i className={dec}></i>
                    </button>
                </div>
                <Stock />
            </form>
            <div className={buttons}>
                {
                    inCart
                        ? <a className="btn btn_block btn_dark" href={window.cartLink}>
                            <span>В корзине</span>
                        </a>
                        : <button className="btn btn_block btn_dark" onClick={handleButtonClick}>
                            <span>Добавить в корзину</span>
                        </button>
                }
                {/*<a className="btn btn_block btn_lite" href="#">*/}
                {/*    <span>Перейти в конфигуратор</span>*/}
                {/*</a>*/}
            </div>
        </div>
    )
}

export default Cart