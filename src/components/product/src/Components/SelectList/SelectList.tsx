import { useState, useId } from 'react'
import { useProduct } from '../../Store'
import Select from '../Select'
import style from './SelectList.module.scss'

const SelectList: React.FC = () => {
    const fields = useProduct(store => store.series.fields)
    const products = useProduct(store => store.series.products_available)
    const userStatus= useProduct(store => store.userStatus)

    const { selectors, title, body } = style

    const id = useId()

    const [selectsState, setSelectsState] = useState<boolean[]>(Object.keys(fields).map(() => false))

    const handleSelectClick = (idx: number) => {
        let newSelectsState: boolean[] = []

        if (selectsState[idx]) {
            newSelectsState = [...selectsState.fill(false)]
        } else {
            for (let i = 0; i < selectsState.length; i++) {
                newSelectsState.push(i === idx)
            }
        }

        setSelectsState(newSelectsState)
    }

    const closeAllSelects = () => {
        let newSelectsState: boolean[] = []
        newSelectsState = [...selectsState.fill(false)]
        setSelectsState(newSelectsState)
    }

    const getSelectsList = () => {
        const selectsList: React.ReactNode[] = []

        Object.keys(fields).forEach((key, idx) => {
            selectsList.push(<Select
                key={`${id}-${idx}`}
                active={selectsState[idx]}
                field={key}
                idx={idx}
                handleSelectClick={() => handleSelectClick(idx)}
                closeAllSelects={closeAllSelects} />)
        })

        return selectsList
    }

    const getTitle = () => {
        if ( Array.isArray(fields) && fields.length === 0 ) {
            if (products.length > 1 && userStatus === 'admin') {
                console.warn('API отдает несколько продуктов, но не отдает данные для их фильтрации')
                console.warn('fields', fields);
                console.warn('store.series.products_available', products);
            }
            return null
        }

        return <h3 className={title}>Выбор комплектации</h3>
    }

    return (
        <div className={selectors}>
            { getTitle() }
            <div className={body}>
                { getSelectsList() }
            </div>
        </div>
    )
}

export default SelectList