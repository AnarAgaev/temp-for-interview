import { useState } from 'react'
import style from './AccordionItem.module.scss'

const AccordionItem = (props: { title: string, children: React.ReactNode, isOpen: boolean }) => {

    const { item, collapse, collapse_open,
        inner, button, button_open } = style

    const [isCollapsed, toggleCollapse] = useState<boolean | null>(!props.isOpen)

    return (
        <li className={item}>
            <div className={isCollapsed ? button : `${button} ${button_open}`}
                onClick={() => toggleCollapse(!isCollapsed)}>
                <span>{props.title}</span>
            </div>

            <div className={isCollapsed ? collapse : `${collapse} ${collapse_open}`}>
                <div className={inner}>
                    {props.children}
                </div>
            </div>
        </li>
    )
}

export default AccordionItem