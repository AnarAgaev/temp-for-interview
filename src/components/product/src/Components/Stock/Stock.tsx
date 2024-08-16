import { useState, useEffect } from 'react'
import { useProduct } from '../../Store'
import { usePopper } from 'react-popper'
import style from './Stock.module.scss'

const Stock = () => {
    const stock = useProduct(store => store.current.stock)

    const { message, informer } = style

    // Setting tooltip about product is out of stock
    const [tooltipBtn, setTooltipBtn] = useState<HTMLButtonElement | null>(null)
    const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null)
    const [isTooltipVisible, setIsTooltipVisible] = useState(false)
    const { styles, attributes } = usePopper(tooltipBtn, tooltip, {
        placement: 'top-end',
        modifiers: [
            { name: 'offset', options: { offset: [-20, 0] } },
        ],
    })

    const handleTooltipButtonClick = () => {
        setIsTooltipVisible(!isTooltipVisible)
    }

    useEffect(() => {
        const handleClickOutsideTooltip = (event: MouseEvent) => {
            const el: HTMLElement | null = event.target as HTMLElement

            if (el && !el.classList.contains(informer)) {
                setIsTooltipVisible(false)
            }
        }

        document.addEventListener('click', handleClickOutsideTooltip)

        return () => document.removeEventListener('click', handleClickOutsideTooltip)
    }, [informer])

    if (typeof stock === 'number' && stock === 0) {
        return (
            <div className={message}>
                Товара нет на складе
                <button type="button"
                    ref={setTooltipBtn}
                    onClick={handleTooltipButtonClick}
                    className={`tooltip__icon ${informer}`}></button>
                { isTooltipVisible && (
                    <div ref={setTooltip}
                        style={styles.popper}
                        className='tooltip__body'
                        {...attributes.popper}>
                        Количество и сроки уточняйте у менеджера
                    </div>
                )}
            </div>
        )
    }

    if (typeof stock === 'number' && stock > 0) {
        return (
            <div className={message}>
                На складе {stock} шт.
            </div>
        )
    }

    if (stock === null) {
        return null
    }

    return null
}

export default Stock