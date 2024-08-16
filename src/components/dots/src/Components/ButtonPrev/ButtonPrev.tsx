import { useDots } from '../../Store'
import style from './ButtonPrev.module.scss'

const ButtonPrev:React.FC = () => {
    const activeStepNumber = useDots(store => store.getActiveStep()?.number)
    const toggleStep = useDots(store => store.toggleStep)
    const isLastStep = useDots(store => store.getActiveStep()?.isLast)
    const resetConfiguration = useDots(store => store.resetConfiguration)
    const isDotInCart = useDots(store => store.isDotInCart)
    const showCustomName = useDots(store => store.showCustomName)

    let clazz = 'btn btn_block btn_lite'

    if (activeStepNumber === 1) clazz += ` ${style.blocked}`

    const buttonCaption = isLastStep
        ? isDotInCart
            ? 'Рассчитать новый комплект'
            : 'Назад к расчетам'
        : 'Назад'

    const onClick = () => {
        isDotInCart ? resetConfiguration(0) : toggleStep(-1)
        showCustomName(false)
    }

    return (
        <button type='button' className={clazz}
            onClick={onClick}>
            <span>{buttonCaption}</span>
        </button>
    )
}

export default ButtonPrev