import { useState, useEffect, useId, useMemo, useCallback } from 'react'
import { useDots } from '../../Store'
import Select from '../Select'
import style from './SelectList.module.scss'

const { selectors, body } = style

const SelectList: React.FC = () => {
    // Added for force update this function component after global reset Dots configurator
    useDots(store => store.steps)

    const activeStep = useDots(store => store.getActiveStep())
    const filters = useDots(store => store.filters)
    const id = useId()

    const [selectsStates, setSelectsState] = useState<boolean[]>([])

    useEffect(() => {
        let statesArr: boolean[] = []

        if (filters && activeStep) {
            statesArr = filters[activeStep.name]
                ? Object.keys(filters[activeStep.name]).map(() => false)
                : []
        }

        setSelectsState(statesArr)
    }, [filters, activeStep])

    const handleSelectClick = useCallback((idx: number) => {
        let newSelectsState: boolean[] = []

        if (selectsStates[idx]) {
            newSelectsState = [...selectsStates.fill(false)]
        } else {
            for (let i = 0; i < selectsStates.length; i++) {
                newSelectsState.push(i === idx)
            }
        }

        setSelectsState(newSelectsState)
    }, [selectsStates])

    const closeAllSelects = useCallback(() => {
        setSelectsState([...selectsStates.fill(false)])
    }, [selectsStates])

    const selectsList = useMemo(() => {
        const selectsList: React.ReactNode[] = []

        if (filters && activeStep) {
            const currentStepFilters = filters[activeStep.name]

            if (!currentStepFilters) return null

            Object.keys(currentStepFilters).forEach((property, idx) => {
                selectsList.push(<Select
                    key={`${id}-${idx}`}
                    productProperty={property}
                    selectName={currentStepFilters[property]}
                    isOpen={selectsStates[idx]}
                    closeAllSelects={closeAllSelects}
                    handleSelectClick={() => handleSelectClick(idx)} />
                )
            })
        }

        return selectsList
    }, [activeStep, closeAllSelects, filters, handleSelectClick, id, selectsStates])

    return (
        <>
            { filters && activeStep && selectsStates.length > 0
                ? <div className={selectors}>
                        <div className={body}>
                            {selectsList}
                        </div>
                    </div>
                : null
            }
        </>
    )
}

export default SelectList