import { useDots } from '../../Store'
import style from './ResetWarning.module.scss'

const { dialog, close, text, buttons } = style

const ResetWarning: React.FC = () => {
    const dispatchStoreActions = useDots(store => store.dispatchStoreActions)
    const resetConfiguration = useDots(store => store.resetConfiguration)
    const warning = useDots(store => store.warning)
    const toggleVisibleWarning = useDots(store => store.toggleVisibleWarning)

    const onCloseClick = () => toggleVisibleWarning(false)

    const onResetClick = () => {
        toggleVisibleWarning(false)
        if (warning.fromStepNumber && warning.callbacksObj) {
            resetConfiguration(warning.fromStepNumber) // Сбрасываем от текущего шага
            dispatchStoreActions(warning.callbacksObj) // Устанавливаем текущий выбор в Store
        }
    }

    return (
        <>
            {! warning.isVisible
                ? null
                : <div className={dialog}>
                    <div className={close}>
                        <button type="button" data-modal-action="close"
                            onClick={onCloseClick}></button>
                    </div>
                    <mark className={text}>
                        При внесении изменений на данном шаге
                        выбранные параметры будут очищены!
                    </mark>
                    <p className={buttons}>
                        <button type='button'
                            className='btn btn_block btn_lite'
                            onClick={onCloseClick}>
                            <span>Оставить выбор</span>
                        </button>
                        <button type='button'
                            className='btn btn_block btn_dark'
                            onClick={onResetClick}>
                            <span>Сбросить</span>
                        </button>
                    </p>
                </div>
            }
        </>
    )
}

export default ResetWarning