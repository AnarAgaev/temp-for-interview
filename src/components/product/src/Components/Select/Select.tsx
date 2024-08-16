import { getOptionListType } from './types'
import { useId, useRef } from 'react'
import { useProduct } from '../../Store'
import Option from '../Option'
import style from './Select.module.scss'
interface SelectPropsInterface {
    active: boolean
    field: string
    idx: boolean | number
    handleSelectClick: () => void
    closeAllSelects: () => void
}

const { select, select_open, caption, wrap, reset, value, value_open,
    value_disabled, value_current, drop, drop_open, options } = style

const termsArr = window.terms
    ? window.terms.map(term => term.toLowerCase())
    : []

const hasInformerWrap = document.getElementById('informer')

const Select: React.FC<SelectPropsInterface> = ({ active, field, handleSelectClick, closeAllSelects }) => {

    const [fields, translate, units] = useProduct(store => [
        store.series.fields,
        store.series.translate,
        store.series.units
    ])

    const selectMap = useProduct(store => store.selectsMap)
    const current = useProduct(store => store.current) as productInterface & { [key: string]: string }
    const updateProduct = useProduct(store => store.updateProduct)
    const selectRef = useRef<HTMLDivElement | null>(null)
    const id = useId()

    let selectedVal = current[field]
    if (typeof selectedVal === 'boolean') selectedVal = selectedVal ? 'Да' : 'Нет'

    const dropClass = active ? `${drop} ${drop_open}` : drop
    const selectClass = active ? `${select} ${select_open}` : select

    let valClass = ''
    if (selectMap[field] === undefined) valClass += `${value} ${value_disabled}`
    else if (selectMap[field] === null) valClass += `${value} ${value_current}`
    else valClass = value

    if (active) valClass += ` ${value_open}`

    const handleResetClick = () => {
        updateProduct(field, undefined)
        handleSelectClick()
    }

    const getOptionList: getOptionListType = (current, fields, field, id, isSelected) => {
        const propsArr = fields[field]
        const optionList: React.ReactNode[] = [];

        (propsArr as Array<{ value: string }>).forEach((propsObj: { value: string }, idx: number) => {
            let value = propsObj.value
            const isActive = isSelected ? current[field] == value : false

            if (typeof value === 'boolean') value = value ? 'Да' : 'Нет'

            optionList.push(<Option
                key={`${id}-${idx}`}
                val={value}
                active={isActive}
                field={field}
                closeAllSelects={closeAllSelects} />)
        })

        return optionList
    }

    const isSelected = !(selectMap[field] === undefined || selectMap[field] === null)

    if (isSelected) {
        selectedVal = `${selectedVal}`
        selectedVal += units[field]
            ? field !== 'light_angle'
                ? ` ${units[field]}`
                : `${units[field]}`
            : ``
    } else {
        selectedVal = 'Не выбрано'
    }

    const onSelectClick = () => {
        const el = selectRef.current

        if (el && !el.classList.contains(value_disabled)) {
            handleSelectClick()
        }
    }

    return (
        <div className={selectClass}>
            <span className={caption}>
                {
                    translate[field] && hasInformerWrap && (termsArr.indexOf(translate[field].toLowerCase()) !== -1)
                        ? <span data-term={`${translate[field]}`}>
                            <span>{translate[field]}</span>
                        </span>
                        : translate[field]
                            ? translate[field]
                            : field
                }
            </span>

            <div className={wrap}>
                <div ref={selectRef} className={valClass} onClick={onSelectClick}>
                    {selectedVal}
                </div>
                <div className={dropClass}>
                    <div className={options}>
                        {getOptionList(current, fields, field, id, isSelected)}
                        {isSelected
                            ? <label>
                                    <span className={reset} onClick={handleResetClick}>
                                        Сбросить
                                    </span>
                                </label>
                            : null
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Select
