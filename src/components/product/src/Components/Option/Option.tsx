import { useProduct } from '../../Store'
import style from './Option.module.scss'

interface optionPropsInterface {
    val: string
    active: boolean
    field: string
    closeAllSelects: () => void
}

const Option: React.FC<optionPropsInterface> = (props) => {
    const updateProduct = useProduct(store => store.updateProduct)
    const selectsMap = { ...useProduct(store => store.selectsMap) }
    let products = [...useProduct(store => store.series.products_available)]

    const { val, field, active, closeAllSelects } = props
    const { property, property_active, disabled } = style

    const clazz = active
        ? `${property} ${property_active}`
        : property

    const getBooleanVal = (val: string) => {
        let value: boolean | string = val

        if (typeof val === 'string' && val.toLowerCase() === 'нет') value = false
        if (typeof val === 'string' && val.toLowerCase() === 'да') value = true

        return value
    }

    const checkClickableOption = (field: string, val: boolean | string) => {

        // Обрезаем объект селектов до текущего селекта текущей опции
        let isAfterProp = false
        for (const prop in selectsMap) {
            if (prop == field) {
                isAfterProp = true
            }

            if (isAfterProp) {
                delete selectsMap[prop]
            }
        }

        // Фильтруем все продукты в соответствии с обрезанным ранее массивом селектов
        const filteredProducts = (products: productInterface[], prop: string) => {
            return products.filter(product => {
                return product[prop] == selectsMap[prop]
            })
        }
        for (const prop in selectsMap) {
            if (selectsMap[prop]) {
                products = filteredProducts(products, prop)
            }
        }

        // Ищем в отфильтрованном массиве продуктов текущий опшин и если он там есть, разблокируем
        for (const prod of products) {
            if (prod[field] == val) return true
        }
    }

    const isClickableOption = checkClickableOption(field, getBooleanVal(val))

    return (
        <label className={isClickableOption ? undefined : disabled}
            onClick={(e) => {
                e.stopPropagation()

                if (!isClickableOption) return

                closeAllSelects()
                updateProduct(field, getBooleanVal(val))
            }}>
            <input className="invisible" type="radio" />
            <span className={clazz}>{val}</span>
        </label>
    )
}

export default Option