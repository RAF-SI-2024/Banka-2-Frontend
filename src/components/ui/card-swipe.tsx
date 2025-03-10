import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/effect-cards"
import { EffectCards } from "swiper/modules"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import "swiper/css/effect-coverflow"
import { Autoplay, Navigation, Pagination } from "swiper/modules"


interface CarouselProps {
  elements: React.ReactNode[]
  autoplayDelay?: number
  slideShadows: boolean
}


export const CardSwipe: React.FC<CarouselProps> = ({
  elements,
  autoplayDelay = 1500,
  slideShadows = false,
}) => {

  return (

              <Swiper
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"cards"}
                grabCursor={true}
                loop={true}
                slidesPerView={"auto"}
                rewind={true}
                cardsEffect={{
                  slideShadows: slideShadows,
                }}
                className="!max-w-90 !w-90 "

                modules={[EffectCards, Autoplay, Pagination, Navigation]}
              >
                {elements.map((element, index) => (
                  <SwiperSlide key={index} className="!size-fit rounded-2xl  flex justify-center">

                        {element}

                  </SwiperSlide>
                ))}

              </Swiper>

  )
}
