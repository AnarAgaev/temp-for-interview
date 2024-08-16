import Content from '../Content'
import SelectList from '../SelectList'
import Accordion from '../Accordion'
import Cart from '../Cart'
import style from './Body.module.scss'

const { wrapper } = style

const Body = function () {
    return (
        <>
            <div className={wrapper}>
                <Content />
                <SelectList />
            </div>
            <Cart />
            <Accordion />
        </>
    )
}

export default Body
