import React from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const ClusterKind = () => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  return (
    <div className="ClusterKindWrap">
      {/* <div ref={navigationPrevRef} className="btn_prev" />
            <div ref={navigationNextRef} className="btn_next" /> */}

      <Swiper
        // install Swiper modules
        spaceBetween={50}
        slidesPerView={5}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        // navigation
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        <SwiperSlide>
          <div className="slide azure">AZURE</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide google">GOOGLE</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide openstack">OPENSTACK</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide aws">AWS</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide baremetal">BAREMETAL</div>
        </SwiperSlide>

        {/* <SwiperSlide><div className="slide add"></div></SwiperSlide> */}
        {/* 아래는 추가를 위한 확인용 슬라이드 */}
        {/* <SwiperSlide><div className="slide"></div></SwiperSlide> */}
      </Swiper>
    </div>
  );
};
export default ClusterKind;
