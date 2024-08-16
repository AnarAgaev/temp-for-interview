import style from './InstructionVideo.module.scss'

const InstructionVideo = (props: { params: {[key: string]: string} }) => {
    const { url, name, poster } = props.params
    const { video, pic, play } = style

    return (
        <a className={video} href={url} data-fancybox="video-instructions">
            <span className={pic}>
                <img src={poster} title={name} alt={name} loading="lazy" />
            </span>
            <span className={`button-play ${play}`}></span>
        </a>
    )
}

export default InstructionVideo