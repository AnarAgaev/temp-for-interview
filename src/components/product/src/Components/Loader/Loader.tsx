import style from './Loader.module.scss'

const Loader:React.FC = () => {
    const { loader, loader_visible, body, message, process, point } = style

    return(
        <div className={`${loader} ${loader_visible}`}>
            <div className={body}>
                <span className={message}>
                    Загружаем продукт
                    <mark className={process}>
                        <i className={point}></i>
                        <i className={point}></i>
                        <i className={point}></i>
                    </mark>
                </span>
            </div>
        </div>
    )
}

export default Loader