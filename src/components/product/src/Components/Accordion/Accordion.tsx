import { useId, useMemo, useEffect } from 'react'
import { useProduct } from '../../Store'
import AccordionItem from '../AccordionItem'
import Instructions from '../Instructions'
import style from './Accordion.module.scss'

const { accordion, list, table, cellCaption, buttons, video, desc } = style

const termsArr = window.terms
    ? window.terms.map(term => term.toLowerCase())
    : []

const hasInformerWrap = document.getElementById('informer')

interface GetSpecificationsProps {
    id: string
    characteristics: Array<string> | undefined
    product: productInterface
    translate: Record<string, string>
    units: Record<string, string>
    userStatus: "admin" | "manager" | "user" | null
}

const getSpecificationList = ({
    characteristics,
    id,
    product,
    translate,
    units,
    userStatus
}: GetSpecificationsProps) => {

    // if (!specifications && !characteristics) return // Проверка наличия Характеристик и в Серии и в Артикуле
    if (!characteristics) return // Проверка наличия только в Артикуле

    const specificationList: JSX.Element[] = []

    if (characteristics && characteristics.length > 0) {
        characteristics.forEach((i, idx) => {
            const term = translate[i]
            const value = product[i]
            const unit = units[i]
            let valueText

            if (i === 'ip_class') {
                valueText = `${unit ? unit : ''}${value ? value : 'Не указано у артикула'}`
            } else {
                valueText = `${value ? value : 'Не указано у артикула'}${unit ? unit : ''}`
            }

            if (userStatus === 'admin') {
                if (!value) console.log('\x1b[33m%s\x1b[0m', `У артикула ${product.article} не указано свойство ${i}`, product)
                if (!term) console.log('\x1b[33m%s\x1b[0m', `Для Характеристики ${i} не указан перевод в объекте translate`)
                // if (!unit) console.log('\x1b[33m%s\x1b[0m', `Для Характеристики ${i} не указаны единицы измерения в объекте units`)
            } else {
                if (!value) return null
            }

            specificationList.push(
                <tr key={`${id}-specification-${idx}`}>
                    <td className={cellCaption}>
                        {
                            term && hasInformerWrap && (termsArr.indexOf(term.toLowerCase()) !== -1)
                                ? <span data-term={`${term}`}>
                                    <span>{term}</span>
                                </span>
                                : term
                                    ? term
                                    : i
                        }
                    </td>
                    <td>{valueText}</td>
                </tr>
            )
        })
    }

    return specificationList
}

interface GetFilesProps {
    files: {
        id: number,
        url: string,
        name: string
    }[] | null,
    id: string
}

const getFilesList = ({ files, id } : GetFilesProps) => {
    if (files === null) return

    const filesList: JSX.Element[] = []

    for (const iterator in files) {
        filesList.push(
            <a key={`${id}-file-${iterator}`}
                className="btn btn_small btn_lite btn_download"
                href={files[iterator].url}
                download><i></i><span>{files[iterator].name}</span>
            </a>
        )
    }

    return filesList
}

const Accordion = () => {
    const id = useId()

    const [
        description,
        files,
        videos,
        characteristics,
        translate,
        units,
        product,
        userStatus
    ] = useProduct(state => [
        state.series.description,
        state.series.files,
        state.series.videos,
        state.series.characteristics,
        state.series.translate,
        state.series.units,
        state.current,
        state.userStatus
    ])

    const specificationsList = useMemo(
        () => getSpecificationList({characteristics, id, product, translate, units, userStatus}),
        [ characteristics, id, product, translate, units, userStatus ]
    )

    const filesList = useMemo(
        () => getFilesList({files, id}),
        [files, id]
    )

    useEffect(() => {
        window.initInformers()
    }, [product])

    const hasAccordionData = specificationsList || filesList || (description && description !== null && description !== '') || videos

    return (
        !hasAccordionData
            ? null
            : <div className={accordion}>
                <ul className={list}>
                    {
                        product.description && product.description !== ''
                            ? <AccordionItem key={`${id}-item-1`} title="Описание" isOpen={false}>
                                <div className={desc} dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            </AccordionItem>
                            : null
                    }
                    {
                        specificationsList && specificationsList.length > 0
                            ? <AccordionItem key={`${id}-item-2`} title="Характеристики" isOpen={false}>
                                <table className={table} border={0}>
                                    <tbody>
                                        {specificationsList}
                                    </tbody>
                                </table>
                            </AccordionItem>
                            : null
                    }
                    {
                        files !== null && filesList && filesList.length > 0
                            ? <AccordionItem key={`${id}-item-3`} title="Файлы для скачивания" isOpen={false}>
                                <div className={buttons}>
                                    {filesList}
                                </div>
                            </AccordionItem>
                            : null
                    }
                    {
                        videos !== null && videos.length > 0
                            ? <AccordionItem key={`${id}-item-4`} title="Видеоинструкция" isOpen={false}>
                                <div className={video}>
                                    <Instructions />
                                </div>
                            </AccordionItem>
                            : null
                    }
                </ul>
            </div>
    )
}

export default Accordion