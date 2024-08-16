import { useProduct } from '../../Store'
import style from './Content.module.scss'

const Content:React.FC = () => {
    const product = useProduct(store => store.current)

    const { article, color, price, sale } = product

    const { content, header, code, oldPrice, params, colorClassName, priceClassName } = style

    const salePrice = sale && sale !== 0 && sale !== ''
        ? <span className={oldPrice}>{sale} ₽</span>
        : null

    return (
        <div className={content}>
            <div className={header}>
                <div className={code}>{article}</div>
                <div className={params}>
                    <div className={colorClassName}>{color}</div>
                    <div className={priceClassName}>
                        <span>{price} ₽</span>
                        { salePrice }
                    </div>
                </div>
            </div>
            {/* <div className={footer}>
                <ul className={list}>
                    <li className={item}>
                        <span>Производитель</span>
                        <span>Technolight®</span>
                    </li>
                    <li className={item}>
                        <span>Тип монтажа</span>
                        <span>Для натяжных потолков</span>
                    </li>
                    <li className={item}>
                        <span>Вес</span>
                        <span>3,6 кг</span>
                    </li>
                    <li className={item}>
                        <span>Габариты</span>
                        <span>
                            <mark>2 000 мм</mark>
                            <mark>74 мм</mark>
                            <mark>53 мм</mark>
                        </span>
                    </li>
                </ul>
            </div> */}
        </div>
    )
}

export default Content