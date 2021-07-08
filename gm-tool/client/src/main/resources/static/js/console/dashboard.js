var DashboardUI = (function (options) {
    var
        modules = {},
        ServiceDashboardModel = Backbone.Model.extend({
            idAttribute: 'id',
            defaults: {
                id: null,
                type: '',
                totalServer: 0,
                runningServer: 0,
                stoppedServer: 0,
                etcServer: 0,
                account: 0,
                lastUpdatedAt: ''
            }
        }),
        ServiceDashboardCollection = Backbone.Collection.extend({
            url: '/dashboard/resources',
            model: ServiceDashboardModel
        }),
        ServiceDashboardView = Backbone.View.extend({
            el: ".cont_wrap",
            serverTemplate: _.template('<li class="swiper-slide" id="{{= id }}">\n    <div class="dashboard_circle_wrap">\n        <div class="dashboard_circle">\n            <div class="circle">\n                <div class="value">\n                    <div class="num">\n                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                            <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                            c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                            c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                            c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                        </svg>\n                    </div>\n                    <div  class="name">Server</div>\n                </div>\n            </div>\n        </div>\n        <ul class="dashboard_circle_info">\n            <li>\n                <div class="name">Running</div>\n                <div class="num">\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                        <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                                    c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                                    c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                                    c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                    </svg>\n                </div>\n            </li>\n            <li>\n                <div class="name">Stop</div>\n                <div class="num">\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                                <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                                c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                                c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                                c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                    </svg>\n                </div>\n            </li>\n            <li>\n                <div class="name">ETC</div>\n                <div class="num">\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                                <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                                c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                                c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                                c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                    </svg>\n                </div>\n            </li>\n        </ul>\n    </div>\n</li>'),
            credentialCollection: new (Backbone.Collection.extend({
                url: '/environments/credentials/names'
            })),
            events: {
            },
            serverDataLoad: function () {
                var self = this;
                this.collection.fetch({
                    success: function (collection, response, options) {

                        var publicTotal = 0;
                        var publicRunning = 0;
                        var publicStop = 0;
                        var publicEtc = 0;
                        var privateTotal = 0;
                        var privateRunning = 0;
                        var privateStop = 0;
                        var privateEtc = 0;
                        _.each(collection.models, function(model, index, list) {
                            var m = self.credentialCollection.findWhere({id: model.get("id")});
                            if (m) {
                                if (m.get('cloudType') == "public") {
                                    publicTotal += model.get('totalServer');
                                    publicRunning += model.get('runningServer');
                                    publicStop += model.get('stoppedServer');
                                    publicEtc += model.get('etcServer');
                                } else {
                                    privateTotal += model.get('totalServer');
                                    privateRunning += model.get('runningServer');
                                    privateStop += model.get('stoppedServer');
                                    privateEtc += model.get('etcServer');
                                }

                                $("#" + model.get('id')).find('.num').each(function (num) {
                                    var data = 0;
                                    switch(num) {
                                        case 0:
                                            data = model.get('totalServer');
                                            break;
                                        case 1:
                                            data = model.get('runningServer');
                                            break;
                                        case 2:
                                            data = model.get('stoppedServer');
                                            break;
                                        case 3:
                                            data = model.get('etcServer');
                                            break;
                                    }
                                    $("#" + model.get('id')).find(".num:eq("+num+")").toNumberSVG(data);
                                });
                            }

                            if(index == list.length - 1) {
                                $("#public_total").toNumberSVG(publicTotal);
                                $("#public_running").toNumberSVG(publicRunning);
                                $("#public_stop").toNumberSVG(publicStop);
                                $("#public_etc").toNumberSVG(publicEtc);
                                $("#private_total").toNumberSVG(privateTotal);
                                $("#private_running").toNumberSVG(privateRunning);
                                $("#private_stop").toNumberSVG(privateStop);
                                $("#private_etc").toNumberSVG(privateEtc);
                                $(".last_updated_at").html("Last Updated : " + model.get('lastUpdatedAt'));
                            }
                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });

                /*$(".c3").find('.num').each(function(num) {
                    var count = Math.floor(Math.random() * 100);

                    $(".c3").find(".num:eq("+num+")").toNumberSVG(count);
                });*/
            },
            initialize: function () {
                var self = this;
                this.collection = new ServiceDashboardCollection();

                this.credentialCollection.fetch({
                    success: function (collection, response, options) {
                        var privates = [];
                        var publics = [];

                        var swipers = [];
                        swipers.push(new Swiper('#public',{
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<button type="button" class="' + className + '">' + publics[index] + '</button>';
                                }
                            },
                            navigation: {
                                nextEl: '.btn_swiper_next',
                                prevEl: '.btn_swiper_prev'
                            },
                            on: {
                                slideChange: function () {
                                    var on = $("#public").find('.swiper-pagination-bullet-active');
                                    var target = $("#public").find('.tabs_inner');
                                    var left = on.position().left - 8;

                                    if(-left > target.position().left) {
                                        target.css('left', -left);
                                    } else if(on.position().left + on.width() > target.parent().width() - 20) {
                                        left = on.position().left - target.parent().width() + on.width() + 20;
                                        target.css('left', -left );
                                    }
                                }
                            }
                        }));

                        swipers.push(new Swiper('#private',{
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<button type="button" class="' + className + '">' + privates[index] + '</button>';
                                }
                            },
                            navigation: {
                                nextEl: '.btn_swiper_next',
                                prevEl: '.btn_swiper_prev'
                            }
                        }));

                        _.each(collection.models, function(model, index, list) {
                            if(model.get('cloudType') == 'public') {
                                publics.push(model.get('name'));
                                swipers[0].appendSlide(self.serverTemplate(model.toJSON()));
                            } else {
                                privates.push(model.get('name'));
                                swipers[1].appendSlide(self.serverTemplate(model.toJSON()));
                            }

                            if(index == list.length - 1) {
                                self.serverDataLoad();
                            }
                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            }
        }),
        ServiceDashboardBillingView = Backbone.View.extend({
            el: ".cont_wrap",
            billingTemplate: _.template('<li class="swiper-slide">\n    <div class="dashboard_cost">\n        <div class="tit">\n            <span>Present Cost</span>\n            <div class="cost">\n                <span class="{{=type}}_currency">$</span>\n                <div class="num" id="{{=type}}_total_cost">\n                    <!-- 0 -->\n                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                            <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                            c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                            c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                            c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                                            </svg>\n                </div>\n            </div>\n        </div>\n        <div class="dashboard_cost_progress">\n            <div class="dashboard_cost_progress_cont">\n                <div class="dashboard_progress_wrap">\n                    <div class="dashboard_progress_bar" id="{{=type}}_cur_cost_bar"></div>\n                    <div class="dashboard_progress_date"><span class="cur_cost_ym"></span></div>\n                </div>\n                <div class="dashboard_progress_info_wrap">\n                    <div class="dashboard_progress_info">\n                        <div class="txt"><span class="cur_cost_duration"></span></div>\n                        <div class="cost">\n                            <span class="{{=type}}_currency">$</span>\n                            <div class="num" id="{{=type}}_current_cost">\n                                <!-- 0 -->\n                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                            <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                            c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                            c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                            c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                                            </svg>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="dashboard_progress_info">\n                        <div class="txt"><span class="prediction_cost_duration"></span></div>\n                        <div class="cost">\n                            <span class="{{=type}}_currency">$</span>\n                            <div class="num" id="{{=type}}_predict_month_cost">\n                            </div>\n                        </div>\n                    </div>\n                </div><!-- //dashboard_progress_info_wrap -->\n            </div><!-- //dashboard_cost_progress_cont -->\n\n            <div class="dashboard_cost_progress_cont p2">\n                <div class="dashboard_progress_wrap">\n                    <div class="dashboard_progress_bar" id="{{=type}}_previous_cost_bar"></div>\n                    <div class="dashboard_progress_date"><span class="prev_cost_ym"></span></div>\n                </div>\n                <div class="dashboard_progress_info_wrap">\n                    <div class="dashboard_progress_info">\n                        <div class="txt"><span class="prev_cost_duration"></span></div>\n                        <div class="cost">\n                            <span class="{{=type}}_currency">$</span>\n                            <div class="num" id="{{=type}}_previous_cost">\n                                <!-- 0 -->\n                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                            <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                            c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                            c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                            c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                                            </svg>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="dashboard_progress_info">\n                        <div class="txt"><span class="prev_month_cost_duration"></span></div>\n                        <div class="cost">\n                            <span class="{{=type}}_currency">$</span>\n                            <div class="num" id="{{=type}}_previous_month_cost">\n                                <!-- 0 -->\n                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 35 50" style="enable-background:new 0 0 35 50;" xml:space="preserve">\n                                                            <path d="M33.4,34.7c0,4.8-1.6,8.7-4.8,11.5c-2.9,2.6-6.6,3.9-11,3.9c-4.4,0-8-1.3-11-3.9c-3.2-2.8-4.8-6.6-4.8-11.5V15.3\n                                                            c0-4.8,1.6-8.7,4.8-11.5C9.5,1.3,13.2,0,17.5,0c4.4,0,8,1.3,11,3.9c3.2,2.8,4.8,6.6,4.8,11.5V34.7z M22,34.7V15.3\n                                                            c0-1.7-0.4-2.9-1.2-3.8c-0.8-0.9-1.9-1.3-3.2-1.3c-1.3,0-2.4,0.4-3.2,1.3c-0.9,0.9-1.3,2.1-1.3,3.8v19.4c0,1.7,0.4,2.9,1.3,3.8\n                                                            c0.9,0.9,1.9,1.3,3.2,1.3c1.3,0,2.4-0.4,3.2-1.2C21.6,37.7,22,36.4,22,34.7z"/>\n                                                            </svg>\n                            </div>\n                        </div>\n                    </div>\n                </div><!-- //dashboard_progress_info_wrap -->\n            </div><!-- //dashboard_cost_progress_cont -->\n        </div><!-- //dashboard_cost_progress -->\n    </div><!-- //dashboard_cost -->\n</li>'),
            credentialCollection: new (Backbone.Collection.extend({
                url: '/environments/credentials/names'
            })),
            events: {
            },
            serverDataLoad: function () {
                var self = this;

                // 빌링 기간 정보 설정
                var curDate = new Date();
                var curFirstDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
                var curLastDate =  new Date(curDate.getFullYear(), curDate.getMonth()+1, 0);
                var prevFirstDate = new Date(curDate.getFullYear(), curDate.getMonth()-1, 1);
                var prevLastDate = new Date(curDate.getFullYear(), curDate.getMonth(), 0);
                var prevDate = new Date(prevLastDate.getFullYear(), prevLastDate.getMonth(), curDate.getDate() > prevLastDate.getDate() ? prevLastDate.getDate() : curDate.getDate());

                self.collection.fetch({
                    success: function (collection, response, options) {
                        _.each(collection.models, function (model, index, list) {
                            var type = model.get('type');
                            if (type == 'aws' || type == 'azure') {

                                // 빌링 기간 정보 설정
                                $(".cur_cost_duration").html(curFirstDate.format('yyyy-MM-dd') + ' ~ ' + curDate.getDate());
                                $(".prediction_cost_duration").html("Estimated cost (" + curFirstDate.format('yyyy-MM-dd') + ' ~ ' + curLastDate.getDate() + ")");
                                $(".prev_cost_duration").html(prevFirstDate.format('yyyy-MM-dd') + ' ~ ' + prevDate.getDate());
                                $(".prev_month_cost_duration").html(prevFirstDate.format('yyyy-MM-dd') + ' ~ ' + prevLastDate.getDate());
                                $(".cur_cost_ym").html(curFirstDate.format('yyyy.MM.'));
                                $(".prev_cost_ym").html(prevFirstDate.format('yyyy.MM.'));

                                // 총 빌링 정보 설정
                                var option = { comma : true, fixed: true, digits: 2 };
                                $("#"+type+"_total_cost").toNumberSVG(model.get('currentCost'), option);
                                $("#"+type+"_current_cost").toNumberSVG(model.get('currentCost'), option);
                                $("#"+type+"_predict_month_cost").toNumberSVG(model.get('predictMonthCost'), option);
                                $("#"+type+"_previous_cost").toNumberSVG(model.get('previousCost'), option);
                                $("#"+type+"_previous_month_cost").toNumberSVG(model.get('previousMonthCost'), option);

                                // 빌링 그래프 정보 설정
                                var curCostPercent = model.get('predictMonthCost') != 0 ? Math.floor(model.get('currentCost')/model.get('predictMonthCost') * 100) : 0;
                                var prevCostPercent = model.get('previousMonthCost') != 0 ? Math.floor(model.get('previousCost')/model.get('previousMonthCost') * 100) : 0;
                                $("#"+type+"_cur_cost_bar").css("width", curCostPercent+"%");
                                $("#"+type+"_previous_cost_bar").css("width", prevCostPercent+"%");

                                // 빌링 통화 설정
                                $("."+type+"_currency").html("$");
                            }
                        });
                    }
                });
            },
            initialize: function () {
                var self = this;
                self.collection = new ServiceDashboardCollection();

                self.credentialCollection.fetch({
                    success: function (collection, response, options) {
                        var publics = [];

                        var swiper = new Swiper('#swiper_03', {
                            pagination: {
                                el: '.swiper-pagination',
                                clickable: true,
                                renderBullet: function (index, className) {
                                    return '<button type="button" class="' + className + '">' + publics[index] + '</button>';
                                }
                            },
                            navigation: {
                                nextEl: '.btn_swiper_next',
                                prevEl: '.btn_swiper_prev'
                            }
                        });

                        _.each(collection.models, function (model, index, list) {
                            if (model.get('cloudType') == 'public') {
                                publics.push(model.get('name'));
                                swiper.appendSlide(self.billingTemplate(model.toJSON()));
                            }
                            if(index == list.length - 1) {
                                self.serverDataLoad();
                            }
                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            }
        }),
        init = function (isAdmin) {
            modules.view = new ServiceDashboardView();
            modules.billingView = new ServiceDashboardBillingView();

            /*var swiper_03 = new Swiper('#swiper_03',{
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        var arr = new Array;
                        arr = ['AWS EC2','AZURE'];
                        return '<button type="button" class="' + className + '">' + arr[index] + '</button>';
                    }
                },
                navigation: {
                    nextEl: '.btn_swiper_next',
                    prevEl: '.btn_swiper_prev'
                }
            });*/

            // $('.btn_swiper_next').on('click', function(){
            //     var target = $(this).parent().parent().find('.tabs_inner');
            //     var on = $(this).parent().parent().find('.swiper-pagination-bullet-active');
            //     var left = on.position().left - target.parent().width() + on.width() + 20;
            //
            //     if( on.position().left + on.width() > target.parent().width() - 20 ){
            //         target.css('left', -left );
            //     }
            // });
            // $('.btn_swiper_prev').on('click', function(){
            //     var target = $(this).parent().parent().find('.tabs_inner');
            //     var on = $(this).parent().parent().find('.swiper-pagination-bullet-active');
            //     var left = on.position().left - 8;
            //
            //     if( on.position().left + target.position().left < on.position().left ){
            //         target.css('left', -left );
            //     }
            // });
            // $('.swiper-pagination-bullet').on('click', function(){
            //     var target = $(this).parent('.tabs_inner');
            //     var left = $(this).position().left + ($(this).width()/2) - (target.parent().width()/2);
            //
            //     if( -left > 8 ){
            //         target.css('left', 8 );
            //     } else {
            //         target.css('left', -left );
            //     }
            // });
        };

    return {
        init: init,
        modules: modules
    };
})(config);
