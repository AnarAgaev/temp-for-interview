import { useId, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { useProduct } from "../../Store";
import style from "./Gallery.module.scss";
import "swiper/scss";

// interface CustomWindow extends Window {
//     showModalMsg: (title: string, message: string) => void
// }

// declare let window: CustomWindow

const { gallery, image, paginationContainer, pagination,
    bullet, bullet_active, swiper, badgeList, badge,
    pagination_hide } = style

const Gallery = function () {
    const product = useProduct(state => state.current)
    const series = useProduct(state => state.series)
    const badges = useProduct(state => state.series.badges)
    const id = useId()

    const swiperRef = useRef<SwiperRef | null>(null)
    // const prevRef = useRef<HTMLButtonElement>(null)
    // const nextRef = useRef<HTMLButtonElement>(null)

    // const handlerPrevClick = () => { swiperRef.current && swiperRef.current.swiper.slidePrev() }
    // const handlerNextClick = () => { swiperRef.current && swiperRef.current.swiper.slideNext() }

    const [slidesCount, setSlidesCount] = useState<number | null>(0)
    // const [slideCurrent, setSlideCurrent] = useState<number | null>(1)
    // const [isFavorite, setFavorite] = useState<boolean | null>(false)

    return (
        <div className={gallery}>
            { badges && badges.length > 0 &&
                <ul className={badgeList}>
                    { badges.map((item, idx) => (
                        <li key={`${id}-${idx}`} className={badge}>
                            {item}
                        </li>
                    ))}
                </ul>
            }
            <Swiper className={swiper}
                ref={swiperRef}
                modules={[Navigation, Pagination]}
                slidesPerView={1}
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
                }}>
                {/*<button type="button"*/}
                {/*    onClick={() => {*/}
                {/*        setFavorite(!isFavorite)*/}

                {/*        if (!isFavorite) {*/}
                {/*            window.showModalMsg(`${series.title}`, "Добавлен в избранное")*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    className={isFavorite ? `${favorite} ${favorite_selected}` : favorite}>*/}
                {/*</button>*/}

                {/* Сначала выводим картинку продукта/артикула */}
                <SwiperSlide key={id}>
                    <div className={image}>
                        <img src={product.image} alt="" loading="lazy" />
                    </div>
                </SwiperSlide>

                {/* Вторым выводим список картинок-чертежей из продукта/артикула */}
                {
                    product.drawings && product.drawings.length > 0 && product.drawings.map((i, idx) => (
                        <SwiperSlide key={`${id}-${idx}-drawings`}>
                            <div className={image}>
                                <img src={i} alt="" loading="lazy" />
                            </div>
                        </SwiperSlide>
                    ))
                }

                {/* Третьим выводим галерею из продукта/артикула*/}
                {
                    series.gallery && series.gallery.map((i, idx) =>
                        (<SwiperSlide key={`${id}-${idx}-gallery`}>
                            <div className={image}>
                                <img src={i} alt="" loading="lazy" />
                            </div>
                        </SwiperSlide>)
                    )
                }
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
        </div>
    )
}

export default Gallery
