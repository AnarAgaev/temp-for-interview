import {useEffect, useState} from 'react'
import { useDots } from '../../Store'
import TotalProductList from '../TotalProductList'
import CartForm from '../CartForm'
import RenameConfiguration from '../RenameConfiguration'
import style from './Results.module.scss'

const { results, header, header_block, caption } = style

const Results = () => {
    const isLastStep = useDots(store => store.getActiveStep()?.isLast)
    const customName = useDots(store => store.customName)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const headerClassName = isLastStep
        ? `${header} ${header_block}`
        : `${header}`

    return (
        <div className={results}>
            { windowWidth <= 991 && <RenameConfiguration /> }
            <div className={headerClassName}>
                <h2 className={caption}>
                    <span>{customName ? customName : 'Состав комплекта'}</span>
                </h2>
                <TotalProductList />
                { isLastStep && <CartForm /> }
            </div>
        </div>
    )
}

export default Results