import { useDots } from '../../Store/'
import style from './StepWithoutChoice.module.scss'

const checkBlockedSelectors = (step: Step): boolean => {
    if (!step) return false

    const products = step.products
    let isUnblockedSelector = true

    products.forEach(productsList => {
        productsList.forEach(product => {
            if (!product.default && product.blocked.stepName === null) {
                isUnblockedSelector = false
            }
        })
    })

    return isUnblockedSelector
}

const StepWithoutChoice: React.FC = () => {
    const activeStep = useDots(store => store.getActiveStep())
    let isAllSelectorsBlocked = false

    if (activeStep) {
        isAllSelectorsBlocked = checkBlockedSelectors(activeStep)
    }

    return (
        isAllSelectorsBlocked &&
            <span className={style.warning}>
                На предыдущем шаге вы сделали выбор,
                при котором на этом шаге элементы недоступны.
                Так как такой конфигурации не существует.
            </span>
    )
}

export default StepWithoutChoice