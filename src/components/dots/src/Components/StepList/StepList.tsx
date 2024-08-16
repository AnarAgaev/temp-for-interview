import { useId, useMemo, useEffect, useState, useRef } from "react"
import { useDots } from "../../Store"
import Step from "../Step"
import style from "./StepList.module.scss"

const getStepList = (steps: {[key: string]: Step}, id: string): JSX.Element[] => {
    const stepList = []

    for (const key in steps) {
        stepList.push(<Step key={`${id}-${key}`} step={steps[key]} />)
    }

    return stepList
}

const isStep = (activeStep: void | Step): activeStep is Step => {
    return (activeStep as Step).number !== undefined
}

function listSmoothScroll(container: HTMLUListElement, targetScrollLeft: number, duration: number) {
    const start = container.scrollLeft;
    const distance = targetScrollLeft - start;
    const startTime = performance.now();

    function scrollAnimation(currentTime: number) {
        const elapsedTime = currentTime - startTime;
        const scrollAmount = Math.floor(start + distance * (elapsedTime / duration));
        container.scrollLeft = scrollAmount;

        if (elapsedTime < duration) {
            requestAnimationFrame(scrollAnimation);
        } else {
            container.scrollLeft = targetScrollLeft;
        }
    }

    requestAnimationFrame(scrollAnimation);
}

const StepList = () => {
    const activeStep = useDots(store => store.getActiveStep())
    const resetConfiguration = useDots(store => store.resetConfiguration)
    const steps = useDots(store => store.steps)
    const id = useId()
    const listRef = useRef<null | HTMLUListElement>(null)
    const [activeStepNumber, setActiveStepNumber] = useState<number>(1)

    const stepsCaptionList: JSX.Element[] = useMemo(
        (): JSX.Element[] => getStepList(steps, id),
        [steps, id]
    )

    useEffect(() => {
        if (isStep(activeStep)) {
            setActiveStepNumber(activeStep.number)
        }
    }, [activeStep])

    useEffect(() => {
        const containerLeft = listRef.current?.offsetLeft
        const stepEl: HTMLLIElement | null | undefined = listRef.current?.querySelector('.active')
        const stepLeft = stepEl?.offsetLeft

        if (stepLeft !== undefined && containerLeft !== undefined && listRef.current) {
            const distance = stepLeft - containerLeft
            listSmoothScroll(listRef.current,  distance - 10, 300)
        }
    }, [activeStepNumber])

    return (
        <div className={style.wrap}>
            <button className={style.reset} type='button'
                onClick={() => resetConfiguration(0)}>
                <span>Очистить все</span>
            </button>
            <div className={style.listWrapper}>
                <ul ref={listRef} className={style.list}>
                    {stepsCaptionList}
                </ul>
            </div>
        </div>
    )
}

export default StepList