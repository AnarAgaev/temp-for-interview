import { useState, useEffect } from 'react'
import { useDots } from '../../Store'
import style from './Billboard.module.scss'

const { image, description, back, buttons, button } = style

const Billboard = () => {
    const [hoverImage, hoverTitle] = useDots(store => [store.hoverImage, store.hoverTitle])
    const selectedProduct = useDots(store => store.getFirstSelectedProductByActiveStep())
    const isLastStep = useDots(store => store.getActiveStep()?.isLast)
    const finalImage = useDots(store => store.getFinalImage())
    const finalScheme = useDots(store => store.getFinalScheme())
    const userStatus = useDots(store => store.userStatus)
    const titles = useDots(store => store.titles)

    const getResultStepAdditionalData = useDots(store => store.getResultStepAdditionalData)
    useEffect(
        () => {
            if (isLastStep && userStatus === 'admin') {
                console.log('\x1b[34m%s\x1b[0m', 'Данные из итоговых комбинаций', getResultStepAdditionalData())
            }
        },
        [isLastStep, getResultStepAdditionalData, userStatus]
    )

    const [creative, setCreative] = useState<'pic' | 'scheme'>('pic')

    const productArticle = selectedProduct && selectedProduct.article
    const productTitle = selectedProduct && productArticle && titles && titles[productArticle]

    let src = selectedProduct ? selectedProduct?.image : ''

    if (hoverImage) src = hoverImage

    if (isLastStep) src = (creative === 'pic')
        ? finalImage
        : finalScheme

    return (
        <div className={image}>
            { !hoverTitle && !isLastStep &&
                <div className={back}>
                    <i></i>
                    <span>Выберите элемент в фильтре</span>
                </div> }

            { hoverImage &&
                <>
                    <span className={description}>
                        { hoverTitle }
                    </span>

                    <img src={src} alt="" />
                </>
            }

            { !hoverImage && src &&
                <>
                    {
                        productArticle && productTitle &&
                        <span className={description}>
                            { `${productArticle} — ${productTitle}` }
                        </span>
                    }

                    <img src={src} alt="" />
                </>
            }

            { isLastStep && finalImage && finalScheme &&
                <div className={buttons}>
                    <button className={button} onClick={() => setCreative('pic')}>
                        <img src={finalImage} alt="" />
                    </button>
                    <button className={button} onClick={() => setCreative('scheme')}>
                        <img src={finalScheme} alt="" />
                    </button>
                </div>
            }
        </div>
    )
}

export default Billboard