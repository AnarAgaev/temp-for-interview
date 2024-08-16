import { useDots } from '../../Store'
import style from './TotalPrice.module.scss'

const TotalPrice: React.FC = () => {
    const totalPrice = useDots(store => store.totalPrice)

    if (!totalPrice) return null

    return (
        <mark className={style.price}>
            <i className={style.caption}>Стоимость одного комплекта:</i>
            { totalPrice.toLocaleString('ru-RU') } р.
        </mark>
    )
}

export default TotalPrice