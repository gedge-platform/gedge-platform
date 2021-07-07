var ServerUI = (function (options) {

    var
        modules = {},
        ServerModel = Backbone.Model.extend({
            idAttribute: "status.nodeInfo.machineID",
            urlRoot: '/private/openstack/GEdge/nodes',
        }),
        MonitorUrl = Backbone.Model.extend({
            defaults:{
                cpu:'',
                memory:'',
                network:'',
                disk:''
            }
        }),
        ServerCollection = Backbone.Collection.extend({
            model: ServerModel
        }),
        ServerDetailView = Backbone.View.extend({
            el: "#tab1",
            model: new ServerModel(),
            template: _.template('<div class="detail_data">\n    <table class="tb_data">\n        <tr>\n            <th>Name</th>\n            <td>{{= metadata.name }}</td>\n            <th>MachineID</th>\n            <td>{{= status.nodeInfo.machineID }}</td>\n        </tr>\n        <tr>\n            <th>State</th>\n            <td>{{= stateIconFormatter(status.nodeInfo.state, \'state\', {\'state\':status.nodeInfo.state}) }}</td>\n            <th>IP</th>\n            <td>{{= status.addresses[0].address }}</td>\n        </tr>\n        <tr>\n            <th>Architecture</th>\n            <td>{{= status.nodeInfo.architecture }}</td>\n            <th>Role</th>\n            <td>{{= status.nodeInfo.role }}</td>\n        </tr>\n        <tr>\n            <th>OS Image</th>\n            <td>{{= status.nodeInfo.osImage }}</td>\n            <th>Operating System</th>\n            <td>{{= status.nodeInfo.operatingSystem }}</td>\n        </tr>\n        <tr>\n            <th>Kernel Version</th>\n            <td>{{= status.nodeInfo.kernelVersion }}</td>\n            <th>Container Runtime Version</th>\n            <td>{{= status.nodeInfo.containerRuntimeVersion }}</td>\n        </tr>\n        <tr>\n            <th>Kubelet Version</th>\n            <td>{{= status.nodeInfo.kubeletVersion }}</td>\n            <th>Kube Proxy Version</th>\n            <td>{{= status.nodeInfo.kubeProxyVersion }}</td>\n        </tr>\n    </table>\n</div><!-- //detail_data -->'),
            initialize: function () {
                var self = this;
                console.log(this.model);
                this.model.on('change', function (model) {
                    $('.detail_tit').text(model.get('id'));
                    self.render();
                })
                $('tab1').append(this.template)

            }
            // events: {
            //     "click button.btn_action_refresh": "reload"
            // }
        }),

        ServerView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {
                "click .cont_list .searchBtn": "search",
                "keyup .cont_list .input_search": "searchEnter",
                "click .cont_list .btn_control": "resetGrid",
                "click .detail_label_btn": "closeDetail",
                "click .detail_tab a": "detailView",
                "click #server_start": "serverStart",
                "click #server_stop": "serverStop",
                "click #server_reboot": "serverReBoot",
                "click #server_hard_reboot": "serverHardReBoot",
                "click #server_delete": "serverDelete",
                "click #server_pause": "serverPause",
                "click #server_unpause": "serverUnPause",
                "click #server_lock": "serverLock",
                "click #server_unlock": "serverUnLock",
                "click #server_suspend": "serverSuspend",
                "click #server_resume": "serverResume",
                "click #server_rescue": "serverRescue",
                "click #server_unrescue": "serverUnRescue",
                "click #server_snapshot": "serverSnapshot",
                "click #server_create": "create",
                "click #server_interface_attach": "attachInterface",
                "click #server_interface_detach": "detachInterface",
                "click #server_floatingip_connect": "connectFloatingIp",
                "click #server_floatingip_disconnect": "disconnectFloatingIp",
                "click #tab6 .cont_top_search": "serverMonitoringReload",
                "click #tab6 .detail_monitoring_tit button": "serverDetailMonitoringDisplay"
            },
            testTemplate: _.template('<div class="detail_monitoring_box">' +
                '<div class="detail_monitoring_convas">' +
                '<iframe src={{=cpu}} scrolling="no" width="100%" height="100%"></iframe>' +
                '</div>' +
                '</div>'+
                '<div class="detail_monitoring_box">' +
                '<div class="detail_monitoring_convas">' +
                '<iframe src={{=memory}} scrolling="no" width="100%" height="100%"></iframe>' +
                '</div>'+
                '</div>'+
                '<div class="detail_monitoring_box">' +
                '<div class="detail_monitoring_convas">' +
                '<iframe src={{=network}} scrolling="no" width="100%" height="100%"></iframe>' +
                '</div>'+
                '</div>'+
                '<div class="detail_monitoring_box">' +
                '<div class="detail_monitoring_convas">' +
                '<iframe src={{=disk}} scrolling="no" width="100%" height="100%"></iframe>' +
                '</div>'+
                '</div>'),

            search: function () {
                this.grid.search();
                this.clearDetail();
            },
            searchEnter: function (e) {
                if (e.keyCode == 13) {
                    this.grid.search();
                    this.clearDetail();
                }
            },
            resetGrid: function () {
                this.$el.find(".cont_list .input_search").val('');
                this.grid.setGridParam({
                    datatype: "json",
                    page: 1,
                    postData: {
                        filters: '{"groupOp":"AND","rules":[]}'
                    }
                }).trigger("reloadGrid");
                this.clearDetail();
            },
            closeDetail: function () {
                var self = this;
                $('.content').removeClass('detail_on');
                setTimeout(function () {
                    self.grid.resetSize();
                }, options.gridReSizeTime);
            },
            clearDetail: function () {
                modules.detailView.model.reset();
            },
            detailView: function () {
                var m = this.currentSelRow();
                if (m) {
                    var tabIndex = $('.detail_tab a.on').index();
                    if (tabIndex == 1) {
                        console.log("dfsd")

                        $('#test').empty()
                        $('#test').append(this.testTemplate(urlmodel.toJSON()))

                        // MonitoringUI.modules.loadingEfftect("on");
                        // MonitoringUI.modules.reload(m);
                    }
                } else {
                    var tabIndex = $('.detail_tab a.on').index();
                    if (tabIndex == 1) {
                        $('#test').empty()
                        var urlmodel = modules.monitor
                        console.log(urlmodel)
                        $('#test').append(this.testTemplate(urlmodel.toJSON()))
                    }
                }
            },
            serverStart: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (!(m.get('state') == "shutoff" || m.get('state') == "stopped")) {
                    alert("중지 상태가 아닙니다.");
                    return;
                }
                if (confirm("서버를 시작 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "START"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverStop: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (m.get('state') != "active") {
                    alert("실행 상태가 아닙니다.");
                    return;
                }
                if (confirm("서버를 중지 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "STOP"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverReBoot: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (m.get('state') != "active") {
                    alert("서버가 실행 상태가 아닙니다.");
                    return;
                }

                if (confirm("서버를 재시작 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "REBOOT_SOFT"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverHardReBoot: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (!(m.get('state') == "active" || m.get('state') == "shutoff" || m.get('state') == "rescued" || m.get('taskState') == "resize verify" || m.get('taskState') == "unset")) {
                    alert("서버 상태를 확인하세요.");
                    return;
                }

                if (confirm("서버를 강제 재시작 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "REBOOT_HARD"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverDelete: function () {
                var self = this;
                if (confirm("서버를 삭제 하시겠습니까?")) {
                    var m = modules.view.currentSelRow();
                    if (!m) return;

                    var model = new Backbone.Model({
                        action: "DELETE"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.remove(model, {merge: true});
                            self.clearDetail();
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverPause: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (!(m.get('state') == "active" || m.get('state') == "shutoff" || m.get('state') == "rescued" || m.get('taskState') == "resize verify" || m.get('taskState') == "unset")) {
                    alert("서버 상태를 확인하세요.");
                    return;
                }

                if (confirm("서버를 일시중지 하시겠습니까?")) {

                    var model = new Backbone.Model({
                        action: "PAUSE"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverUnPause: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (m.get('state') != "paused") {
                    alert("일시중지 상태가 아닙니다.");
                    return;
                }

                if (confirm("서버의 일시중지를 해제 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "UNPAUSE"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverLock: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                var model = new Backbone.Model({
                    action: "LOCK"
                });
                model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                model.save(model.attributes, {
                    success: function (model, response, options) {
                        modules.view.collection.add(model, {merge: true});
                    },
                    error: function (model, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },
            serverUnLock: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                var model = new Backbone.Model({
                    action: "UNLOCK"
                });
                model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                model.save(model.attributes, {
                    success: function (model, response, options) {
                        modules.view.collection.add(model, {merge: true});
                    },
                    error: function (model, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },
            serverSuspend: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (!(m.get('state') == "active" || m.get('state') == "shutoff")) {
                    alert("서버 상태를 확인하세요.");
                    return;
                }

                if (confirm("서버를 일시중단 하시겠습니까?")) {

                    var model = new Backbone.Model({
                        action: "SUSPEND"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverResume: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (m.get('state') != "suspended") {
                    alert("일시중단 상태가 아닙니다.");
                    return;
                }
                if (confirm("서버의 일시중단을 해제 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "RESUME"
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/action?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverSnapshot: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;

                if (!(m.get('state') == "active" || m.get('state') == "shutoff")) {
                    alert("실행 또는 중지 상태가 아닙니다.");
                    return;
                }

                modules.createServerSnapshotView.open();
            },
            create: function () {
                modules.createView.open();
            },
            attachInterface: function () {
                modules.attachInterfaceView.open();
            },
            detachInterface: function () {
                modules.detachInterfaceView.open();
            },
            connectFloatingIp: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;
                var exist = false;
                _.each(m.get('addresses'), function (ip) {
                    if (ip.type == "floating") {
                        exist = true;
                        return false;
                    }
                });

                if (exist) {
                    alert('Floating IP가 존재합니다.');
                    return;
                }

                modules.connectFloatingIpView.open();
            },
            disconnectFloatingIp: function () {
                var m = modules.view.currentSelRow();
                if (!m) return;
                var floatingIp = '';
                _.each(m.get('addresses'), function (ip) {
                    if (ip.type == "floating") {
                        floatingIp = ip.addr;
                        return false;
                    }
                });

                if (floatingIp == '') {
                    alert('Floating IP가 없습니다.');
                    return;
                }

                if (confirm("Floating IP를 연결 해제 하시겠습니까?")) {
                    var model = new Backbone.Model({
                        action: "DISCONNECT_FLOATING_IP",
                        floatingIp: floatingIp,
                        projectId: m.get('projectId')
                    });
                    model.url = '/private/openstack/servers/' + m.get('id') + '/floatingip?id=' + id;

                    model.save(model.attributes, {
                        success: function (model, response, options) {
                            modules.view.collection.add(model, {merge: true});
                        },
                        error: function (model, response, options) {
                            ValidationUtil.getServerError(response);
                        }
                    });
                }
            },
            serverMonitoringReload: function () {
                var m = this.currentSelRow();
                if (m) {
                    MonitoringUI.modules.loadingEfftect("on");
                    MonitoringUI.modules.reload(m);
                }
            },
            serverDetailMonitoringDisplay: function (e) {
                MonitoringDetailUI.modules.display($(e.currentTarget).parents().eq(1).find(".detail_monitoring_convas").attr("id"));
            },
            currentSelRow: function () {
                var selRow = this.grid.getGridParam("selrow");
                console.log("selRow");
                if (!selRow) {
                    alert("Server 정보가 선택되지 않았습니다.");
                    return null;
                }
                return this.collection.get(selRow);
            },
            initialize: function () {
                var self = this;
                this.gridId = "#server-grid";
                this.grid = $(this.gridId).jqGrid({
                    datatype: "json",
                    url: '/private/openstack/GEdge/nodes',
                    // url: '/private/openstack/' + id,
                    jsonReader: {
                        repeatitems: false,
                        id: "status.nodeInfo.machineID"
                    },
                    colNames: [
                        'Name',
                        'State',
                        'Uid',
                        'Cpu',
                        'Using Cpu',
                        'Memory',
                        'Using Memory',
                        'Storage',
                        'Pods',
                        'Using Pods',
                        'Allocated Cpu',
                        'Allocated Memory',
                        'Allocated Pods',
                        'IP',
                        'MachineID',
                        'Kernel Version',
                        'Os Image',
                        'Container Runtime Version',
                        'Kubelet Version',
                        'Kube Proxy Version',
                        'Operating System',
                        'Architecture'
                    ],
                    colModel: [
                        {name: 'metadata.name'},
                        {name: 'status.nodeInfo.state', formatter: stateIconFormatter},
                        {name: 'metadata.uid', hidden: true},
                        {
                            name: 'status.capacity.cpu', formatter: function (cellVal, options, row) {
                                return Math.abs(cellVal) + "Core"
                            }
                        },
                        {name: 'status.allocatable.usingCpu', formatter: function (cellVal, options, row) {
                                var value = parseInt(cellVal) / 1000;
                                return Math.abs(value) + "Core"
                            }
                        },
                        {
                            name: 'status.capacity.memory', formatter: function (cellVal, options, row) {
                                var value = parseInt(cellVal) / 100000000;
                                return value.toFixed(2) + "GB"
                            }
                        },
                        {name: 'status.allocatable.usingMemory', formatter: function (cellVal, options, row) {
                                var value = parseInt(cellVal) / 100000000;
                                return value.toFixed(2) + "GB"
                            }
                        },
                        {
                            name: 'status.capacity.ephemeral_storage', formatter: function (cellVal, options, row) {
                                var value;
                                if(cellVal.indexOf("Ki") !== -1){
                                    value = parseInt(cellVal) / 100000000;
                                }else{
                                    value = parseInt(cellVal) / 100000000000;
                                }
                                return value.toFixed(2) + "GB"
                            }
                        },
                        {name: 'status.capacity.pods'},
                        {name: 'status.allocatable.usingPods'},
                        {name: 'status.allocatable.cpu', hidden: true},
                        {name: 'status.allocatable.memory', hidden: true},
                        {name: 'status.allocatable.pods', hidden: true},
                        {name: 'status.addresses.0.address'},
                        {name: 'status.nodeInfo.machineID', hidden: true},
                        {name: 'status.nodeInfo.kernelVersion', hidden: true},
                        {name: 'status.nodeInfo.osImage', hidden: true},
                        {name: 'status.nodeInfo.containerRuntimeVersion', hidden: true},
                        {name: 'status.nodeInfo.kubeletVersion', hidden: true},
                        {name: 'status.nodeInfo.kubeProxyVersion', hidden: true},
                        {name: 'status.nodeInfo.operatingSystem', hidden: true},
                        {name: 'status.nodeInfo.architecture', hidden: true}
                    ],
                    altRows: true,
                    sortname: "metadata.name",
                    sortorder: "desc",
                    loadonce: true,
                    autowidth: true,
                    // width:1618,
                    gridComplete: function () {
                        $(this).resetSize();
                    },
                    // multiSort: true,
                    scrollOffset: 0,
                    rowNum: setRowNum(15, self.gridId),
                    loadtext: "",
                    autoencode: true,
                    onSelectRow: function (id) {
                        var m;
                        _.each(self.collection.models, function (model, index, list) {
                            if (model.attributes.status.nodeInfo.machineID === id) {
                                m = model;
                                if(m.attributes.metadata.name ==='gedgemaster'){
                                    modules.monitor.set({cpu:'http://192.168.48.131:3000/d/G_HWQm0Mz/gedgemaster?orgId=1&panelId=6&fullscreen',memory : 'http://192.168.48.131:3000/d/G_HWQm0Mz/gedgemaster?orgId=1&panelId=4&fullscreen',network : 'http://192.168.48.131:3000/d/G_HWQm0Mz/gedgemaster?orgId=1&panelId=8&fullscreen',disk : 'http://192.168.48.131:3000/d/G_HWQm0Mz/gedgemaster?orgId=1&panelId=2&fullscreen'})

                                }else if(m.attributes.metadata.name ==='gedgeworker01'){
                                    modules.monitor.set({cpu:'http://192.168.48.131:3000/d/VCRrRZ0Mk/gedgeworker01?orgId=1&panelId=2&fullscreen',memory : 'http://192.168.48.131:3000/d/VCRrRZ0Mk/gedgeworker01?orgId=1&panelId=4&fullscreen',network : 'http://192.168.48.131:3000/d/VCRrRZ0Mk/gedgeworker01?orgId=1&panelId=6&fullscreen',disk : 'http://192.168.48.131:3000/d/VCRrRZ0Mk/gedgeworker01?orgId=1&panelId=8&fullscreen'})

                                }else if(m.attributes.metadata.name ==='gedgeworker02'){
                                    modules.monitor.set({cpu:'http://192.168.48.131:3000/d/lCgZzW0Mz/gedgeworker02?orgId=1&panelId=2&fullscreen',memory : 'http://192.168.48.131:3000/d/lCgZzW0Mz/gedgeworker02?orgId=1&panelId=4&fullscreen',network : 'http://192.168.48.131:3000/d/lCgZzW0Mz/gedgeworker02?orgId=1&panelId=6&fullscreen',disk : 'http://192.168.48.131:3000/d/lCgZzW0Mz/gedgeworker02?orgId=1&panelId=8&fullscreen'})

                                }else if(m.attributes.metadata.name ==='gedgeworker03'){
                                    modules.monitor.set({cpu:'http://192.168.48.131:3000/d/xHS5kZ0Gk/gedgeworker03?orgId=1&panelId=2&fullscreen',memory : 'http://192.168.48.131:3000/d/xHS5kZ0Gk/gedgeworker03?orgId=1&panelId=4&fullscreen',network : 'http://192.168.48.131:3000/d/xHS5kZ0Gk/gedgeworker03?orgId=1&panelId=6&fullscreen',disk : 'http://192.168.48.131:3000/d/xHS5kZ0Gk/gedgeworker03?orgId=1&panelId=8&fullscreen'})
                                }
                                console.log(modules.monitor)
                            }
                        });
                        var tabIndex = $('.detail_tab a.on').index();
                        modules.detailView.model.set(m.toJSON());
                        console.log(m.attributes.metadata.name)
                        if (tabIndex == 1) {
                            self.detailView()
                        }
                        $('.content').addClass('detail_on');
                        setTimeout(function () {
                            self.grid.resetSize()
                        }, options.gridReSizeTime);
                    },
                    loadComplete: function (data) {
                        self.collection.reset(data.rows);
                        data.gridId = self.gridId;
                        data.getPageParam = function (data) {
                            return {
                                'q0': $(".select_search option:selected").val(),
                                'q1': $(".input_search").val()
                            }
                        };
                        data.rowNum = $(this).getGridParam("rowNum");
                        data.reccount = $(this).getGridParam("reccount");
                        $("#pager1").pager(data);
                        // $("#flavor-grid tr:eq(1)").trigger('click');

                    }
                });

                this.collection = new ServerCollection();

                this.collection.on("add", function (model) {
                    self.grid.addRowData(model.attributes.id, model.toJSON(), "first");
                });
                this.collection.on("change", function (model) {
                    self.grid.setRowData(model.attributes.id, model.toJSON());
                    modules.detailView.model.set(model.toJSON());
                });
                this.collection.on("remove", function (model) {
                    self.grid.delRowData(model.get('id'));
                    modules.detailView.model.reset();
                });

                $("#tab6 .select_wrap ul li").on("click", function () {
                    self.serverMonitoringReload();
                });
            }
        }),

        init = function (isAdmin) {
            modules.view = new ServerView();
            modules.detailView = new ServerDetailView();
            modules.monitor = new MonitorUrl();

            stompUtil.addListener('/topic/openstack/' + options.userId, function (msg) {
                var payload = null;
                try {
                    payload = JSON.parse(msg.body).payload;
                } catch (e) {
                    console.log(e);
                    return;
                }
                console.log("Payload (/topic/openstack) :", payload);
                switch (payload.action) {
                    case "ATTACH_VOLUME":
                    case "DETACH_VOLUME":
                        if (payload.id) {
                            var m = modules.detailServerVolumeView.collection.get(payload.object.id);
                            if (m) {
                                if (payload.object.state == "available") {
                                    modules.detailServerVolumeView.collection.remove(m, {merge: true});
                                } else {
                                    m.set(payload.object);
                                }
                            }
                        } else {
                            stompUtil.getError(payload);
                        }
                        break;
                    default:
                        if (payload.id) {
                            var m = modules.view.collection.get(payload.object.id);
                            if (m) {
                                m.set(payload.object);
                            }
                        } else {
                            stompUtil.getError(payload);
                        }
                        break;
                }
            });
        };

    return {
        init: init,
        modules: modules
    };
})(config);

stompUtil.connect();
