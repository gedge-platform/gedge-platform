import React from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

const CloudZoneSlider = () => {
  const navigationPrevRef = React.useRef(null);
  const navigationNextRef = React.useRef(null);

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
        onSwiper={swiper => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
        onInit={swiper => {
          swiper.params.navigation.prevEl = navigationPrevRef.current;
          swiper.params.navigation.nextEl = navigationNextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        <SwiperSlide>
          <div className="SliderWrap">
            {/* <div className="SliderBox">
                            <div className="iconBox azure">AZURE</div>
                            <div className="contentsBox">
                                <div className="countBox">
                                    <div class="Count">10 <span>클러스터</span></div>
                                    <div class="Count">10 <span>VM</span></div>
                                </div>
                                <div className="StatusList">
                                    <ul>
                                        <li className="run"><span className="tit">실행</span> <span>7</span></li>
                                        <li className="stop"><span className="tit">중지</span> <span>2</span></li>
                                        <li className="pause"><span className="tit">일시중지</span> <span>1</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="SliderBox">
                            <div className="iconBox azure">AZURE</div>
                            <div className="contentsBox">
                                <div className="countBox">
                                    <div class="Count">10 <span>클러스터</span></div>
                                    <div class="Count">10 <span>VM</span></div>
                                </div>
                                <div className="StatusList">
                                    <ul>
                                        <li className="run"><span className="tit">실행</span> <span>7</span></li>
                                        <li className="stop"><span className="tit">중지</span> <span>2</span></li>
                                        <li className="pause"><span className="tit">일시중지</span> <span>1</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="SliderBox">
                            <div className="iconBox azure">AZURE</div>
                            <div className="contentsBox">
                                <div className="countBox">
                                    <div class="Count">10 <span>클러스터</span></div>
                                    <div class="Count">10 <span>VM</span></div>
                                </div>
                                <div className="StatusList">
                                    <ul>
                                        <li className="run"><span className="tit">실행</span> <span>7</span></li>
                                        <li className="stop"><span className="tit">중지</span> <span>2</span></li>
                                        <li className="pause"><span className="tit">일시중지</span> <span>1</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="SliderBox">
                            <div className="iconBox google">GOOGLE</div>
                            <div className="contentsBox">
                                <div className="countBox">
                                    <div class="Count">10 <span>클러스터</span></div>
                                    <div class="Count">10 <span>VM</span></div>
                                </div>
                                <div className="StatusList">
                                    <ul>
                                        <li className="run"><span className="tit">실행</span> <span>7</span></li>
                                        <li className="stop"><span className="tit">중지</span> <span>2</span></li>
                                        <li className="pause"><span className="tit">일시중지</span> <span>1</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}

            <div className="SliderBox">
              <div className="iconBox openstack">OPENSTACK</div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    2 <span>클러스터</span>
                  </div>
                  <div class="Count">
                    3 <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span>8</span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span>0</span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span>0</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="SliderBox">
              <div className="iconBox aws">AWS</div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    3 <span>클러스터</span>
                  </div>
                  <div class="Count">
                    3 <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span>3</span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span>0</span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span>0</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="SliderBox">
              <div className="iconBox"></div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    <span>클러스터</span>
                  </div>
                  <div class="Count">
                    <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span></span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span></span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="SliderBox">
              <div className="iconBox"></div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    <span>클러스터</span>
                  </div>
                  <div class="Count">
                    <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span></span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span></span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="SliderBox">
              <div className="iconBox"></div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    <span>클러스터</span>
                  </div>
                  <div class="Count">
                    <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span></span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span></span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="SliderBox">
              <div className="iconBox"></div>
              <div className="contentsBox">
                <div className="countBox">
                  <div class="Count">
                    <span>클러스터</span>
                  </div>
                  <div class="Count">
                    <span>VM</span>
                  </div>
                </div>
                <div className="StatusList">
                  <ul>
                    <li className="run">
                      <span className="tit">실행</span> <span></span>
                    </li>
                    <li className="stop">
                      <span className="tit">중지</span> <span></span>
                    </li>
                    <li className="pause">
                      <span className="tit">일시중지</span> <span></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        {/* 아래는 추가를 위한 확인용 슬라이드 */}
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

            <div className="SliderBox">
              <div className="iconBox google">GOOGLE</div>
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

            <div className="SliderBox">
              <div className="iconBox openstack">OPENSTACK</div>
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

            <div className="SliderBox">
              <div className="iconBox aws">AWS</div>
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
          </div>
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
};
export default CloudZoneSlider;
