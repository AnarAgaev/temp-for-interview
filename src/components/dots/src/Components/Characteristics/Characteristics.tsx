import { useEffect, useMemo, useId } from 'react'
import { useDots } from '../../Store'
import style from './Characteristics.module.scss'

const { list, item, name, val } = style

const termsArr = window.terms
    ? window.terms.map(term => term.toLowerCase())
    : []

const getList = (
    characteristics: Record<string, string>,
    id: string
): JSX.Element[] => {

    const hasInformerWrap = document.getElementById('informer')
    const elList:JSX.Element[] = []

    for (const key in characteristics) {
        elList.push(
            <li key={`${id}-${key}`}className={item}>
                <div className={name}>
                    {
                        hasInformerWrap && (termsArr.indexOf(key.toLowerCase()) !== -1)
                            ? <span data-term={`${key}`}>
                                <span>{key}</span>
                            </span>
                            : <span>{key}</span>
                    }
                </div>
                <span className={val}>{characteristics[key]}</span>
            </li>
        )
    }

    return elList
}

const Characteristics = () => {
    const units = useDots(store => store.units)
    const characteristics = useDots(store => store.getCharacteristics())
    const resultStepAdditionalData = useDots(store => store.getResultStepAdditionalData())
    const id = useId()

    if (resultStepAdditionalData.light_flow) {
        characteristics['Световой поток'] = resultStepAdditionalData.light_flow.toString()
            + (units && units['light_flow'] ? units['light_flow'] : '')
    }

    const characteristicsList = useMemo(
        () => getList(characteristics, id),
        [characteristics, id]
    )

    useEffect(() => {
        window.initInformers()
    }, [characteristics])

    return (
        <>
            {
                (characteristicsList.length <= 0)
                    ? null
                    : <ul className={list}>
                        { ...characteristicsList }
                    </ul>
            }
        </>
    )
}

export default Characteristics