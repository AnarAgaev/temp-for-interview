import React, { useState, useId, useEffect } from 'react'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { SwiperRef } from 'swiper/react'
import { useProduct } from '../../Store'
import { Fancybox } from "@fancyapps/ui"
import InstructionVideo from '../InstructionVideo'
import style from './Instructions.module.scss'
import 'swiper/scss'

const Instructions: React.FC = function () {
    const videos = useProduct(state => state.series.videos)

    const { swiper, paginationContainer, pagination, pagination_hide,
            bullet, bullet_active } = style

    const swiperRef = React.useRef<SwiperRef | null>(null)
    // const prevRef = React.useRef<HTMLButtonElement>(null)
    // const nextRef = React.useRef<HTMLButtonElement>(null)

    // const handlerPrevClick = () => { swiperRef.current && swiperRef.current.swiper.slidePrev() }
    // const handlerNextClick = () => { swiperRef.current && swiperRef.current.swiper.slideNext() }

    const [slidesCount, setSlidesCount] = useState<number | null>(0)
    // const [slideCurrent, setSlideCurrent] = useState<number | null>(1)

    const videoId = useId()

    useEffect(() => {
        Fancybox.bind('[data-fancybox="video-instructions"]')
        return () => {
            Fancybox.unbind('[data-fancybox="video-instructions"]')
            Fancybox.close()
        }
    })

    return (
        videos === null
            ? null
            : <>
                <Swiper className={swiper}
                    ref={swiperRef}
                    modules={[Navigation, Pagination]}
                    slidesPerView={'auto'}
                    grabCursor
                    observer
                    observeParents
                    observeSlideChildren
                    watchOverflow
                    // onSlideChange={(swiper) => {
                    //     setSlideCurrent(swiper.activeIndex + 1)
                    // }}
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
                    }}
                    >
                    {videos.map((video, idx: number) =>
                        <SwiperSlide key={`${videoId}-${idx}`}>
                            <InstructionVideo params={video} />
                        </SwiperSlide>)}
                </Swiper>

                <div className={paginationContainer}>
                    {/* {slidesCount && slidesCount > 1 ?
                        <button ref={prevRef}
                            className={navigation}
                            onClick={handlerPrevClick}>{slideCurrent}</button>
                        : null} */}
                    <div className={
                        slidesCount && slidesCount > 1
                            ? `${pagination}`
                            : `${pagination} ${pagination_hide}`
                    }></div>
                    {/* {slidesCount && slidesCount > 1 ?
                        <button ref={nextRef}
                            className={navigation}
                            onClick={handlerNextClick}>{slidesCount}</button>
                        : null} */}
                </div>
            </>
    )
}

export default Instructions
