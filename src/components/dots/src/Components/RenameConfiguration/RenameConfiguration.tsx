import { useDots } from '../../Store'
import style from './RenameConfiguration.module.scss'

const { modal, caption, controller, help } = style

const RenameConfiguration = () => {
    const customName = useDots(store => store.customName)
    const setCustomName = useDots(store => store.setCustomName)
    const showCustomName = useDots(store => store.showCustomName)
    const pushDotToCart = useDots(store => store.pushDotToCart)
    const visible = useDots(store => store.visibleCustomName)

    if (!visible) return null

    const onSave = () => {
        pushDotToCart()
        showCustomName(false)
    }

    return (
        <div className={modal}>
            <h3 className={caption}>Название конфигурации</h3>
            <label className={controller}>
                <i></i>
                <input type="text" value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder='Введите название вашей конфигурации'/>
            </label>
            <p className={help}>
                При желании, вы можете дать комплекту имя,
                под которым он отобразится в корзине,
                например "DOT над кухонным столом"
            </p>
            <button className='btn btn_block btn_dark'
                onClick={onSave}>
                <span>Продолжить</span>
            </button>
        </div>
    )
}

export default RenameConfiguration