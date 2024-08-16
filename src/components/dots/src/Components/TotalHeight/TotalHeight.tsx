import { useDots } from '../../Store'
import style from './TotalHeight.module.scss'

const TotalHeight: React.FC = () => {
    const totalHeight = useDots(store => store.totalHeight)

    if (!totalHeight) return null

    return (
        <p className={style.height}>
            Высота изделия { totalHeight.toLocaleString('ru-RU') } мм
        </p>
    )
}

export default TotalHeight