import { useDots } from '../../Store'
import style from './Step.module.scss'

const { item, item_active, item_passed } = style

interface propsInterface {
    step: Step
}

const Step: React.FC<propsInterface> = ({ step }) => {
    const activeStep = useDots(store => store.getActiveStep())
    const activeStepNumber = activeStep && activeStep.number

    let clazz = `${item}`

    if (step.active) clazz += ` ${item_active} active`

    if (activeStepNumber &&
        step.number < activeStepNumber) clazz += ` ${item_passed}`

    const stepText = step.isLast ? 'Итоговый вариант' : step.name

    return (
        <li className={clazz} data-cy="stepName">
            {stepText}
        </li>
    )
}

export default Step