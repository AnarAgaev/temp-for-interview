import { useId } from 'react';
import { useDots } from '../../Store'
import RadioButtonItem from '../RadioButtonItem'
import SelectorsHelper from '../SelectorsHelper'
import style from './RadioButtonList.module.scss'

const getProductsButtonList = (

    allProductsData: Products,
    filteredProducts: productButton[][] | undefined,
    stepName: string,
    stepNumber: number,
    required: boolean,
    id: string

): JSX.Element[] | null => {

    const listElementsArr: JSX.Element[] = []

    if (!filteredProducts) return null

    // Получаем список кнопок на основе отфильтрованного списка артикулов
    filteredProducts.forEach((product, idx) => {
        const selected = product[0].selected.stepNumber !== null
        const productName = product[0].name
        const productTitle = allProductsData[productName]?.title
        const productImage = allProductsData[productName]?.image
        const blockedStepNumber = product[0].blocked.stepNumber
        const blockedStepName = product[0].blocked.stepName

        listElementsArr.push(<RadioButtonItem
            key={`${id}-${idx}`}
            productName={productName}
            productTitle={productTitle}
            productImage={productImage}
            selected={selected}
            stepName={stepName}
            stepNumber={stepNumber}
            required={required}
            blockedStepNumber={blockedStepNumber}
            blockedStepName={blockedStepName} />
        )
    })

    return listElementsArr
}

const RadioButtonList = () => {
    // Added for force update Radio button list after global reset on first step
    useDots(store => store.steps)

    const userStatus = useDots(store => store.userStatus)
    const id = useId()
    const activeStep = useDots(store => store.getActiveStep())
    const allProductsData = useDots(store => store.products)
    const getFilteredActiveStepProducts = useDots(store => store.getFilteredActiveStepProducts)
    const filteredProducts = getFilteredActiveStepProducts(false)
    const filters = useDots(store => store.filters)

    if (!activeStep) return null

    const name = activeStep?.name
    const number = activeStep?.number
    const required = activeStep?.required

    const productButtonList = getProductsButtonList(
        allProductsData, filteredProducts, name, number, required, id)

    // Показываем кнопки только для страниц без фильтра и только для Админов
    let clazz = style.list
    if (required && filters && filters[name]) {
        clazz += userStatus !== 'admin'
            ? ' invisible'
            : ''
    }

    return (
        <>
            <SelectorsHelper />
            <ul className={clazz}>
                { productButtonList }
            </ul>
        </>
    )
}

export default RadioButtonList