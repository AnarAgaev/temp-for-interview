import { useDots } from '../../Store'
import style from './SelectedProductPrice.module.scss'

const { price, caption, sum } = style

const SelectedProductPrice: React.FC = () => {
    const selectedProduct = useDots(store => store.getFirstSelectedProductByActiveStep())

    return (
        <>
            {selectedProduct?.price &&
                <span className={price}>
                    <mark className={caption}>Стоимость детали:</mark>
                    <i className={sum}>
                        {selectedProduct?.price.toLocaleString('ru-RU')} ₽
                    </i>
                </span>}
        </>
    )
}

export default SelectedProductPrice