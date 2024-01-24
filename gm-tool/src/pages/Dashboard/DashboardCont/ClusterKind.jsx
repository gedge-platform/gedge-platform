import React from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import dashboardStore from "../../../store/Dashboard";
import { useEffect } from "react";
import { observer } from "mobx-react";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const ClusterKind = observer(() => {
  const { edgeInfo, loadDashboardCnt } = dashboardStore;

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  useEffect(() => {
    loadDashboardCnt();
  }, []);

  return (
    <div className="ClusterKindWrap">
      <div className="clusterKindBoxTitle">Clusters</div>
      <div ref={navigationPrevRef} className="btn_prev" />
      <div ref={navigationNextRef} className="btn_next" />

      <Swiper
        style={{ padding: "30px 0px 0px 60px" }}
        // install Swiper modules
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: navigationPrevRef.current,
          nextEl: navigationNextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        <SwiperSlide>
          <div className="slide aws">aws-edge</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide baremetal">gm-cluster</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide baremetal">onpremess(dongjak) </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide baremetal">mec(ilsan)</div>
        </SwiperSlide>
        {/* 아래는 추가를 위한 확인용 슬라이드 */}
        {/* <SwiperSlide><div className="slide"></div></SwiperSlide> */}
      </Swiper>
    </div>
    // </div>
  );
});
export default ClusterKind;
