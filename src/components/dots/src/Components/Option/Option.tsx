import { useRef } from 'react'
import { useDots } from '../../Store'
import style from './Option.module.scss'

interface propsInterface {
    value: string
    productProperty: string
    isSelected: boolean
    closeAllSelects: () => void
    stepNumber: number
}

const { property, property_active, disabled } = style

const Option: React.FC<propsInterface> = ({ value, productProperty, closeAllSelects, isSelected, stepNumber }) => {
    const setSelectedFilterToCurrentStep = useDots(store => store.setSelectedFilterToCurrentStep)
    const updateSelectOptionsMapAndSetAutoSelectedArticle = useDots(store => store.updateSelectOptionsMapAndSetAutoSelectedArticle)
    const getFilteredActiveStepProducts = useDots(store => store.getFilteredActiveStepProducts)
    const allProducts = useDots(store => store.products)
    const toggleVisibleWarning = useDots(store => store.toggleVisibleWarning)
    const checkSelectedStepMoreTarget = useDots(store => store.checkSelectedStepMoreTarget)
    const isSelectedStepsMore = checkSelectedStepMoreTarget(stepNumber)

    const valueSpanRef = useRef<HTMLSpanElement | null>(null)

    const clazz = isSelected ? `${property} ${property_active}` : property

    const checkDisableOfOption = () => {

        const filteredActiveStepProducts = getFilteredActiveStepProducts(productProperty)

        if (!filteredActiveStepProducts) return false // not disabled

        for (const product of filteredActiveStepProducts) {
            const prod = allProducts[product[0].name]
            let prodFilterValue: string | number | unknown = prod[productProperty]

            if (prodFilterValue == value) return false // not disabled

            if (typeof productProperty === 'string' && typeof value === 'string') {
                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в НИЖНЕМ регистре
                prodFilterValue = prod[productProperty.toLocaleLowerCase()]
                if (prodFilterValue == value.toLocaleLowerCase()) return false // not disabled

                // Если не нашли текущее значение фильтра в данных продукта, пробуем найти в ВЕРХНЕМ регистре
                prodFilterValue = prod[productProperty.toLocaleUpperCase()]
                if (prodFilterValue == value.toLocaleUpperCase()) return false // not disabled
            }
        }

        return true // disabled
    }

    const isDisabledOption = checkDisableOfOption()

    const handleOptionClick = (
        event: React.MouseEvent<HTMLLabelElement>,
        value: string,
        productProperty: string ) => {

        event.stopPropagation()
        closeAllSelects()

        if (isSelected) return
        if (isDisabledOption) return

        if (isSelectedStepsMore) {
            toggleVisibleWarning(
                true,
                stepNumber,
                {
                    'setSelectedFilterToCurrentStep': [ value, productProperty ],
                    'updateSelectOptionsMapAndSetAutoSelectedArticle': [ productProperty ]
                }
            )
        } else {
            setSelectedFilterToCurrentStep(value, productProperty)
            updateSelectOptionsMapAndSetAutoSelectedArticle(productProperty)
        }
    }

    return (
        <label className={ isDisabledOption ? disabled : undefined }
            onClick={(e) => handleOptionClick(e, value, productProperty)}>
            <input className="invisible" type="radio" />
            <span ref={valueSpanRef} className={clazz} data-cy="optionFilter">{value}</span>
        </label>
    )
}

export default Option