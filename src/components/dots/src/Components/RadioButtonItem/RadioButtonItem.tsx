import { useDots } from '../../Store'
import style from './RadioButtonItem.module.scss'

interface propsTypes {
    productName: string
    productTitle: string | unknown
    productImage: string | unknown
    selected: boolean
    stepName: string
    stepNumber: number
    required: boolean
    blockedStepNumber: string | null
    blockedStepName: string | null
}

const RadioButtonItem: React.FC<propsTypes> = ({

    productName,
    stepName,
    productTitle,
    productImage,
    stepNumber,
    selected,
    required,
    blockedStepNumber,
    blockedStepName

}) => {

    const checkSelectedStepMoreTarget = useDots(store => store.checkSelectedStepMoreTarget)
    const setHoverProduct = useDots(store => store.setHoverProduct)
    const removeHoverProduct = useDots(store => store.removeHoverProduct)
    const setSelectedProductToStep = useDots(store => store.setSelectedProductToStep)
    const titles = useDots(store => store.titles)
    const toggleVisibleWarning = useDots(store => store.toggleVisibleWarning)

    let title = typeof productTitle === 'string' ? productTitle : ''
    if (titles) title = titles[productName]

    const src = typeof productImage === 'string' ? productImage : ''

    const onButtonClick = () => {
        if (selected || blockedStepNumber) return

        const isSelectedStepsMore = checkSelectedStepMoreTarget(stepNumber)

        if (isSelectedStepsMore) {
            toggleVisibleWarning(
                true,
                stepNumber,
                { 'setSelectedProductToStep': [ productName, stepName, stepNumber, selected ] }
            )
        } else {
            setSelectedProductToStep( productName, stepName, stepNumber, selected)
        }
    }

    let clazz = `${style.item}`
    if (selected) clazz += ` ${style.item_selected}`
    if (!required) clazz += ` ${style.item_resettable}`
    if (blockedStepNumber) clazz += ` ${style.item_blocked}`


    // Временный код, нужен для того чтобы покрасить available: false продукты в красный --- START
    const allProductsData = useDots(store => store.products)
    const errorButtonStyle: {backgroundColor?: string} = {}
    if (allProductsData[productName] && allProductsData[productName].available === false) errorButtonStyle.backgroundColor = '#ff0000b5'
    // Временный код, нужен для того чтобы покрасить available: false продукты в красный --- END


    return (
        <>
            {
                // !blockedStepNumber &&
                <li className={clazz}>
                    { blockedStepNumber &&
                        <mark className={style.tooltip}>
                            {`В этой модификации данный артикул не доступен.
                                Заблокировано на шаге ${blockedStepNumber}: ${blockedStepName}`}
                        </mark>
                    }
                    <button

                        // Временный код, нужен для того чтобы покрасить available: false продукты в красны --- START
                            style={errorButtonStyle}
                        // Временный код, нужен для того чтобы покрасить available: false продукты в красны --- END

                        className="btn btn_lite"
                        title={title}
                        onClick={onButtonClick}
                        onMouseEnter={() => setHoverProduct(src, `${productName} — ${title}`)}
                        onMouseLeave={removeHoverProduct}
                        data-cy="buttonArticle">
                        <span>{productName}</span>
                    </button>
                </li>
            }
        </>
    )
}

export default RadioButtonItem