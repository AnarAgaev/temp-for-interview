import { useDots } from '../../Store'
import style from './ButtonNext.module.scss'

const ButtonNext:React.FC = () => {
    const toggleStep = useDots(store => store.toggleStep)
    const activeStep = useDots(store => store.getActiveStep())

    // Added for force update Radio button list after global reset on first step
    useDots(store => store.getFirstSelectedProductByActiveStep())

    if (!activeStep) return null

    const isStepRequired = activeStep.required
    let isStepSelected = false

    for (const product of activeStep.products) {
        for (const item of product) {
            if (item.selected.stepNumber) isStepSelected = true
        }
    }

    let clazz = 'btn btn_block btn_dark'

    if (!isStepSelected && isStepRequired) {
        clazz += ` ${style.blocked}`
    }

    return (
        <div className={style.wrapper}>
            { !isStepSelected && isStepRequired &&
                <mark className={style.tooltip}>
                    Для перехода на следующий шаг, необходимо выбрать один из артикулов
                </mark>
            }
            <button type="button" className={clazz}
                onClick={() => toggleStep(1)} data-cy="buttonNext">
                <span>Далее</span>
            </button>
        </div>
    )
}

export default ButtonNext