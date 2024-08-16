import { useId, useEffect } from 'react'
import { useDots } from '../../Store'
import style from './SelectorsHelper.module.scss'

const { message, desc, params } = style

const SelectorsHelper = () => {
    const id = useId()
    const getFilteredActiveStepProducts = useDots(store => store.getFilteredActiveStepProducts)
    const filteredProductList = getFilteredActiveStepProducts(false)
    const filters = useDots(store => store.filters)
    const activeStep = useDots(store => store.getActiveStep())
    const setSelectedProductToStep = useDots(store => store.setSelectedProductToStep)
    const isFinalProduct = filteredProductList?.length === 1
    const selectOptionsMap = activeStep?.selectOptionsMap
    const filterList = filters && activeStep?.name && filters[activeStep?.name]
    const needSelectList: JSX.Element[]  = []
    const product = filteredProductList && filteredProductList[0] && filteredProductList[0][0]
    const article = product ? product.name : ''
    const stepName = activeStep?.name
    const stepNumber = activeStep?.number
    const showContent = filters && stepName && filters[stepName]

    useEffect(() => {
        if (isFinalProduct) {
            setTimeout(() => {setSelectedProductToStep (
                article,
                stepName,
                stepNumber,
                false
            )}, 100)
        }

    }, [isFinalProduct, setSelectedProductToStep, article, stepName, stepNumber]);

    if (!showContent) return null // Если это не шаг со специфическим фильтром, React компонент вернет null

    if (selectOptionsMap) {
        const selectOptionsKeysMapArr = Object.keys(selectOptionsMap)
        selectOptionsKeysMapArr && selectOptionsKeysMapArr.forEach((key, idx) => {
            if (!selectOptionsMap[key]) {
                needSelectList.push(
                    <span key={`${id}-${key}`}>{filterList && filterList[key].split(",")[0]}{
                        idx === selectOptionsKeysMapArr.length - 1 ? '' : ', '
                    }</span>
                )
            }
        })
    }

    return (
        <>
            { isFinalProduct
                ? null
                : <div className={message}>
                    <span className={desc}>Для перехода к следующему шагу Вам необходимо выбрать параметр(ы):</span>
                    <span className={params}>{needSelectList}</span>
                </div>
            }
        </>
    )
}

export default SelectorsHelper