import { useEffect, useState } from 'react'
import { useDots } from '../../Store'
import StepCaption from '../StepCaption'
import SelectedProductPrice from '../SelectedProductPrice'
import RadioButtonList from '../RadioButtonList'
import ButtonPrev from '../ButtonPrev'
import ButtonNext from '../ButtonNext'
import SelectList from '../SelectList'
import ResetWarning from '../ResetWarning'
import StepWithoutChoice from '../StepWithoutChoice'
import RenameConfiguration from '../RenameConfiguration'
import Characteristics from '../Characteristics'
import style from './Selector.module.scss'

const { selector, header, actions } = style

const Selector = () => {
    const isLastStep = useDots(store => store.getActiveStep()?.isLast)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className={selector}>
            {windowWidth > 991 && <RenameConfiguration />}
            <div className={header}>
                <StepCaption />
                { isLastStep && <Characteristics />}
                <SelectList />
                <RadioButtonList />
                <SelectedProductPrice />
                { !isLastStep && <StepWithoutChoice /> }
            </div>
            <div className={actions}>
                <ButtonPrev />
                { !isLastStep && <ButtonNext /> }
            </div>
            <ResetWarning />
        </div>
    )
}

export default Selector