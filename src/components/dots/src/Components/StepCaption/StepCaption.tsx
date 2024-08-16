import { useDots } from '../../Store';
import style from './StepCaption.module.scss'

const StepCaption: React.FC = () => {
    const activeStep = useDots(store => store.getActiveStep())

    return (
        <h2 className={style.caption}>
            { activeStep?.name }
        </h2>
    )
}

export default StepCaption