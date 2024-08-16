import { useState, useId, useEffect, useRef } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperRef } from 'swiper/react'
import { Fancybox } from "@fancyapps/ui"
import { useDots } from '../../Store'
import style from './Total.module.scss'
import 'swiper/scss'

const { total, caption, buttons, content, text, text_active,
    downloads, downloads_active, creatives, videos_active,
    swiper, paginationContainer, pagination, pagination_hide,
    bullet, bullet_active, videoLink, pic, play } = style

const Total = () => {
    const resultStepAdditionalData = useDots(store => store.getResultStepAdditionalData())
    const files = useDots(store => store.files)
    const description = useDots(store => store.description)
    const videos = useDots(store => store.videos)
    const id = useId()
    const swiperRef = useRef<SwiperRef | null>(null)
    const [slidesCount, setSlidesCount] = useState<number | null>(0)

    const totalFiles = [
        ...(files || []),
        ...(resultStepAdditionalData.files || [])
    ]

    let countsOfBtns = 0
    if (description) ++countsOfBtns
    if (totalFiles.length > 0 ) ++countsOfBtns
    if (videos && videos.length > 0) ++countsOfBtns


    const [tabs, setTabs] = useState<{info?: boolean, down?: boolean, video?: boolean}>(
        description
            ? { info: true, down: false, video: false }
            : (!description && totalFiles.length > 0)
                ? { info: false, down: true, video: false }
                : { info: false, down: false, video: true }
    )

    useEffect(() => {
        Fancybox.bind('[data-fancybox="video-creative"]')
        return () => {
            Fancybox.unbind('[data-fancybox="video-creative"]')
            Fancybox.close()
        }
    })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const slidesCount = swiperRef.current
                && swiperRef.current.swiper.slides.length
            setSlidesCount(slidesCount)
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [tabs])


    const downFileList = ((): JSX.Element[] => {
        const totalList: JSX.Element[] = []

        totalFiles.map((file, idx) => {
            totalList.push(
                <a key={`${id}-${idx}`} href={file.file} download="" target="_blank"
                    className="btn btn_small btn_lite btn_download">
                    <i></i>
                    <span>{file.name}</span>
                </a>
            )
        })

        return totalList
    })()

    if ((!description || description === null)
        && downFileList.length === 0
        && videos?.length === 0) return null

    return (
        <div className={total}>
            { countsOfBtns === 1
                ?
                    <div className={caption}>
                        <h2 className="container_caption-text">
                            { description && 'описание' }
                            { totalFiles.length > 0 && 'файлы для скачивания' }
                            { videos && videos?.length > 0 && 'видео' }
                        </h2>
                    </div>

                :
                    <div className={buttons}>
                        { description &&
                            <button className={`btn btn_dark ${tabs.info ? 'active' : ''}`}
                                onClick={() => setTabs({info: true, down: false, video: false})}>
                                <span>описание</span>
                            </button>
                        }

                        { totalFiles.length > 0 &&
                            <button className={`btn btn_dark ${tabs.down ? 'active' : ''}`}
                                onClick={() => setTabs({info: false, down: true, video: false})}>
                                <span>файлы для скачивания</span>
                            </button>
                        }

                        { videos && videos?.length > 0 &&
                            <button className={`btn btn_dark ${tabs.video ? 'active' : ''}`}
                                onClick={() => setTabs({info: false, down: false, video: true})}>
                                <span>видео</span>
                            </button>
                        }
                    </div>
            }

            { countsOfBtns !== 0 &&
                <div className={content}>
                    { description &&
                        <p className={`${text} ${tabs.info ? text_active : ''}`}>
                            {description}
                        </p>
                    }

                    { totalFiles.length > 0 &&
                        <div className={`${downloads} ${tabs.down ? downloads_active : ''}`}>
                            { downFileList }
                        </div>
                    }

                    { videos && videos?.length > 0 &&
                        <div className={`${creatives} ${tabs.video ? videos_active : ''}`}>
                            <Swiper className={swiper}
                                ref={swiperRef}
                                modules={[Navigation, Pagination]}
                                slidesPerView={'auto'}
                                grabCursor
                                observer
                                observeParents
                                observeSlideChildren
                                watchOverflow
                                onSwiper={() => {
                                    const slidesCount = swiperRef.current
                                        && swiperRef.current.swiper.slides.length
                                    setSlidesCount(slidesCount)
                                }}
                                pagination={{
                                    el: `.${pagination}`,
                                    bulletClass: bullet,
                                    bulletActiveClass: bullet_active,
                                    clickable: true,
                                }} >

                                { videos && videos.map((video, idx) =>
                                    <SwiperSlide key={`${id}-${idx}`}>
                                        <a className={videoLink} href={video.video} data-fancybox="video-creative">
                                            <span className={pic}>
                                                <img src={video.poster} alt="" loading="lazy" />
                                            </span>
                                            <span className={`button-play ${play}`}></span>
                                        </a>
                                    </SwiperSlide>)
                                }
                            </Swiper>

                            <div className={paginationContainer}>
                                <div className={
                                    slidesCount && slidesCount > 1
                                        ? `${pagination}`
                                        : `${pagination} ${pagination_hide}`
                                }></div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Total