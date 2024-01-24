import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { dashboardStore, clusterStore } from "@/store";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const CloudZoneSlider = observer(() => {
  const [VMList, setVMList] = useState({});
  const { loadVMStatusCnt, configName } = dashboardStore;
  const { loadVMList, clusterList } = clusterStore;

  useEffect(() => {
    loadVMList();
    loadVMStatusCnt();
  }, [VMList]);

  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

  const icon = (Provider) => {
    if (Provider === "AWS") {
      return <div className="iconBox aws">{Provider}</div>;
    } else if (Provider === "OPENSTACK") {
      return <div className="iconBox openstack">{Provider}</div>;
    }
  };

  const clusterStatus = () => {
    let VMcount = 0;
    let runCount = 0;
    let stopCount = 0;
    let pauseCount = 0;

    configName.forEach((e) => {
      const providerVMs = clusterList?.filter(
        (item) => item.ProviderName === e.ProviderName
      );
      providerVMs.forEach((providerVM) => {
        VMcount++;

        if (providerVM.VmStatus === "Suspended") {
          pauseCount++;
        } else if (providerVM.VmStatus === "Running") {
          runCount++;
        } else if (providerVM.VmStatus === "Stop") {
          stopCount++;
        }
      });

      VMList[e.ProviderName] = {
        VMcount,
        pauseCount,
        runCount,
        stopCount,
      };

      VMcount = 0;
      pauseCount = 0;
      runCount = 0;
      stopCount = 0;
    });
  };

  return (
    <div className="CloudZoneSliderWrap">
      <div className="CloudZoneSliderHeader">
        <div ref={navigationPrevRef} className="btn_prev" />
        <div ref={navigationNextRef} className="btn_next" />
      </div>

      <Swiper
        // install Swiper modules
        spaceBetween={20}
        slidesPerView={1}
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
          <div className="SliderWrap">
            {clusterStatus()}
            {Object.keys(VMList).map((providerName) => {
              const e = VMList[providerName];

              return (
                <div className="SliderBox">
                  <div
                    className={`iconBox ${
                      providerName === "OPENSTACK"
                        ? "openstack"
                        : providerName === "AWS"
                        ? "aws"
                        : providerName === "GCP"
                        ? "google"
                        : "azure"
                    }`}
                  >
                    {providerName}
                  </div>
                  <div className="contentsBox">
                    <div className="countBox">
                      <div class="Count">
                        1 <span>클러스터</span>
                      </div>
                      <div class="Count">
                        {e.VMcount} <span>VM</span>
                      </div>
                    </div>
                    <div className="StatusList">
                      <ul>
                        <li className="run">
                          <span className="tit">실행</span>{" "}
                          <span>{e.runCount}</span>
                        </li>
                        <li className="stop">
                          <span className="tit">중지</span>{" "}
                          <span>{e.stopCount}</span>
                        </li>
                        <li className="pause">
                          <span className="tit">일시중지</span>{" "}
                          <span>{e.pauseCount}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SwiperSlide>
        {/* <SwiperSlide>
          <div className="SliderWrap">
            <div className="SliderBox">
              <div className="iconBox azure">AZURE</div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    10 <span>클러스터</span>
                  </div>
                  <div class="Count">
                    10 <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span>7</span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span>2</span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span>1</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
});
export default CloudZoneSlider;
