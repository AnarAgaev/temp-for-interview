import { useId, useMemo } from 'react'
import { useDots } from '../../Store'
import style from './TotalProductList.module.scss'

const {item, counts, list, link, content, text, sum} = style

const getProductList = (
    totalProductList: Product[] | null,
    id: string,
    titles: {[key: string]: string} | null,
    stepCount: { [key: string]: number; } | undefined
): JSX.Element[] | null => {

    if (!totalProductList) return null

    return totalProductList.map((product) => {
        const multipleCount = product && product.onStep && stepCount && stepCount[product.onStep]

        let title = product.title

        if (titles && product.article && titles[product.article] !== undefined) {
            title = titles[product.article]
        }

        return (
            <li className={item} key={`${id}-${product.article}`}>
                <span className={content}>
                    <a className={link} href={product.link} target='_blank' data-cy="article">
                        {product.article}
                    </a>
                    <span className={text}>
                        {`${title} `}
                        <span className={sum}>{`(${product.price?.toLocaleString('ru-RU')} р.)`}</span>
                        { multipleCount && multipleCount > 1
                            ? <strong className={counts} data-cy="doubleValue">{` - ${multipleCount} шт.`}</strong>
                            : null
                        }
                    </span>
                </span>
            </li>
        )}
    )
}

const TotalProductList: React.FC = () => {
    const id = useId()
    const totalProductList = useDots(store => store.totalProductList)
    const titles = useDots(store => store.titles)
    const stepCount = useDots(store => store.stepsCount)

    const totalProducts = useMemo(
        () => getProductList(totalProductList, id, titles, stepCount),
        [totalProductList, id, titles, stepCount]
    )

    if (!totalProductList) return null

    return (
        <ul className={list}>
            { totalProducts }
        </ul>
    )
}

export default TotalProductList