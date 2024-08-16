import { useDots } from '../../Store'
import TotalPrice from '../TotalPrice'
import style from './CartForm.module.scss'

const { form, wrap, counter, inc, dec, price, counter_blocked } = style

const CartForm: React.FC = () => {
    const showCustomName = useDots(store => store.showCustomName)
    const updateComplectCount = useDots(store => store.updateComplectCount)
    const complectCount = useDots(store => store.complectCount)
    const isDotInCart = useDots(store => store.isDotInCart)
    const totalSum = useDots(store => store.totalPrice)
    const totalValue = totalSum * complectCount

    const onButtonInc = () => updateComplectCount(1)
    const onButtonDec = () => updateComplectCount(-1)

    return (
        <form className={form} action="">
            <TotalPrice />
            <div className={wrap}>
                <div className={`${counter} ${isDotInCart ? counter_blocked : ''}`} >
                    <button className="btn btn_lite" type="button"
                        onClick={onButtonDec}>
                        <i className={dec}></i>
                    </button>
                    <input type="text" value={complectCount} readOnly/>
                    <button className="btn btn_lite" type="button"
                        onClick={onButtonInc}>
                        <i className={inc}></i>
                    </button>
                </div>
                <div className={price}>
                    Итого: { totalValue.toLocaleString('ru-RU') } р.
                </div>
            </div>

            { isDotInCart
                ?   <a href={ window.cartLink } className="btn btn_block btn_dark">
                        <span>В корзине</span>
                    </a>
                :   <button type="button" className="btn btn_block btn_dark"
                        onClick={ () => showCustomName(true) } data-cy="addCart">
                        <span>Добавить в корзину</span>
                    </button>
            }
        </form>
    )
}

export default CartForm