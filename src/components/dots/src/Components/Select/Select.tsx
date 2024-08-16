import { useId, useRef, useMemo } from 'react'
import { useDots } from '../../Store'
import Option from '../Option'
import style from './Select.module.scss'

interface propsInterface {
    productProperty: string
    selectName: string
    isOpen: boolean
    closeAllSelects: () => void
    handleSelectClick: () => void
}

const { select, select_open, caption, wrap, reset, value, value_open,
    value_disabled, value_current, drop, drop_open, options } = style

const Select: React.FC<propsInterface> = ({
    productProperty,
    selectName,
    isOpen,
    closeAllSelects,
    handleSelectClick
}) => {

    const id = useId()
    const setAutoSelectedArticle = useDots(store => store.setAutoSelectedArticle)
    const resetSelectedFilterAtStep = useDots(store => store.resetSelectedFilterAtStep)
    const products = useDots(store => store.products)
    const activeStep = useDots(store => store.getActiveStep())
    const activeStepProducts = activeStep?.products
    const selectedFilters = activeStep?.selectedFilters
    const selectOptionsMap = activeStep?.selectOptionsMap
    const toggleVisibleWarning = useDots(store => store.toggleVisibleWarning)
    const checkSelectedStepMoreTarget = useDots(store => store.checkSelectedStepMoreTarget)
    const selectRef = useRef<HTMLDivElement | null>(null)
    const selectClass = isOpen ? `${select} ${select_open}` : select
    const dropClass = isOpen ? `${drop} ${drop_open}` : drop
    const userStatus = useDots(store => store.userStatus)

    let valClass = ''
    if (selectOptionsMap && selectOptionsMap[productProperty] === false) valClass += `${value} ${value_disabled}`
    else if (selectOptionsMap && selectOptionsMap[productProperty] === null) valClass += `${value} ${value_current}`
    else valClass += value

    if (isOpen) valClass += ` ${value_open}`

    const optionsElementList = useMemo(() => {
        const optionList: React.ReactNode[] = []
        let uniqueOptions = []

        if (!activeStepProducts) return optionList

        // Getting unique options to the object
        for (const productsList of activeStepProducts) {

                const item = productsList[0] // Берем всегда только первый артику из пары (покупаются только вместе)

                // Исключаем заблокированные артикулы
                if ( item.blocked.stepNumber !== null ) continue

                // Исключаем артикулы которых нет в Объекте со всеми данными всех продуктов STORE.products
                if (!products[item.name]) continue

                let optionValue = products[item.name][productProperty]

                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в НИЖНЕМ регистре
                if (!optionValue) {
                    optionValue = products[item.name][productProperty.toLocaleLowerCase()]
                }

                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в ВЕРХНЕМ регистре
                if (!optionValue) {
                    optionValue = products[item.name][productProperty.toLocaleUpperCase()]
                }

                if (optionValue) {
                    if (Array.isArray(optionValue)) {
                        for (const o of optionValue) {
                            uniqueOptions.push(o)
                        }
                    } else {
                        uniqueOptions.push(optionValue)
                    }
                }
        }

        uniqueOptions = [...new Set(uniqueOptions)]

        // Сортируем опции селекта по возрастанию
        if (uniqueOptions.every(item => typeof item === 'number')) {
            uniqueOptions.sort((a, b) => a - b)
        } else if (uniqueOptions.every(item => typeof item ==='string')) {
            uniqueOptions.sort((a, b) => a.localeCompare(b))
        } else {
            if (userStatus === 'admin') {
                console.log('\x1b[31m%s\x1b[0m', 'Значения свойств в селектах фильтров имеют разные типы.')
                for (let i = 0; i < uniqueOptions.length; i++) {
                    console.log(uniqueOptions[i], typeof uniqueOptions[i])
                }
            }
        }

        for (const option of uniqueOptions) {
            const isSelected = !!selectedFilters && selectedFilters[productProperty] == option

            optionList.push(<Option
                key={`${id}-${option}`}
                value={option}
                isSelected={isSelected}
                productProperty={productProperty}
                closeAllSelects={closeAllSelects}
                stepNumber={activeStep?.number}
            />)
        }

        return optionList
    }, [ activeStepProducts, closeAllSelects, id, productProperty, products, selectedFilters, activeStep, userStatus ])

    const onResetClick = (evt: React.MouseEvent<HTMLLabelElement>) => {
        evt.stopPropagation()
        closeAllSelects()

        if (activeStep?.number) {
            const isSelectedStepsMore = checkSelectedStepMoreTarget(activeStep?.number)

            if (isSelectedStepsMore) {
                toggleVisibleWarning(
                    true,
                    activeStep?.number,
                    {
                        'resetSelectedFilterAtStep': [ productProperty ],
                        'setAutoSelectedArticle': []
                    }
                )
            } else {
                resetSelectedFilterAtStep(productProperty)
                setAutoSelectedArticle()
            }
        }
    }

    const onSelectClick = () => {
        const el = selectRef.current

        if (el && !el.classList.contains(value_disabled)) {
            handleSelectClick()
        }
    }

    return (
        <>
            { optionsElementList.length === 0
                ? null
                : <div className={selectClass}>
                    <span className={caption}><mark>{selectName}</mark></span>
                    <div className={wrap}>
                        <div ref={selectRef} className={valClass} onClick={onSelectClick} data-cy="selectFilter">
                            <span>
                                {
                                    !selectedFilters
                                        ? 'Не выбрано'
                                        : !selectedFilters[productProperty]
                                            ? 'Не выбрано'
                                            : selectedFilters[productProperty]
                                }
                            </span>
                        </div>
                        <div className={dropClass}>
                            <div className={options} data-cy="openSelectFilter">
                                { optionsElementList }
                                { selectedFilters && selectedFilters[productProperty]
                                    && <label onClick={ onResetClick }>
                                        <span className={reset}>
                                            Сбросить
                                        </span>
                                    </label>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Select
