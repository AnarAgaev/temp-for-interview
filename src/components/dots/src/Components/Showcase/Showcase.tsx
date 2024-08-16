import Billboard from '../Billboard'
import TotalHeight from '../TotalHeight'
import style from './Showcase.module.scss'

const Showcase: React.FC = () => {
    return (
        <div className={style.showcase}>
            <Billboard />
            <TotalHeight />
        </div>
    )
}

export default Showcase