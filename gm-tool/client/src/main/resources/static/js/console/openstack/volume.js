var VolumeUI = (function (options) {

    var
        modules = {},
        VolumeModel = Backbone.Model.extend({
            idAttribute: 'id',
            urlRoot: '/private/openstack/volumes?id=' + id,
            defaults: {
                name: '',
                description: '',
                state: '',
                size: 0,
                zone: '',
                bootable: false,
                createdAt: '',
                id: null,
                projectId: '',
                projectName: '',
                attachmentInfos: [],
                metaData: {},
                volumeType: ''
            }
        }),
        VolumeCollection = Backbone.Collection.extend({
            model: VolumeModel
        }),
        VolumeDetailView = Backbone.View.extend({
            el: "#tab1",
            model: new VolumeModel(),
            template: _.template('<div class="detail_data">\n    <table class="tb_data">\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.projectId\') }}</th>\n            <td>{{= projectId }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.projectName\') }}</th>\n            <td>{{= projectName }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.id\') }}</th>\n            <td>{{= id }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.name\') }}</th>\n            <td>{{= name }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.description\') }}</th>\n            <td>{{= description }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.state\') }}</th>\n            <td>{{= state }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.size\') }}</th>\n            <td>{{= size }}GiB</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.zone\') }}</th>\n            <td>{{= zone }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.bootable\') }}</th>\n            <td>{{= bootable }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.createdAt\') }}</th>\n            <td>{{= createdAt }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.attachedTo\') }}</th>\n            <td>{{= getAttachmentsText(attachmentInfos) }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.metaData\') }}</th>\n            <td>{{= objToString(metaData) }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.volumeType\') }}</th>\n            <td>{{= volumeType }}</td>\n            <th></th>\n            <td></td>\n        </tr>\n    </table>\n</div><!-- //detail_data -->'),
            initialize: function () {
                var self = this;
                this.model.on('change', function(model) {
                    if(model.get('name') == "") {
                        $('.detail_tit').text(model.get('id'));
                    } else {
                        $('.detail_tit').text(model.get('name'));
                    }
                    self.render();
                });
            }
        }),
        VolumeView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {
                "click .cont_list .searchBtn": "search",
                "keyup .cont_list .input_search": "searchEnter",
                "click .cont_list .btn_control":"resetGrid",
                "click .detail_label_btn":"closeDetail"
            },
            search: function() {
                this.grid.search();
                this.clearDetail();
            },
            searchEnter: function(e) {
                if(e.keyCode == 13) {
                    this.grid.search();
                    this.clearDetail();
                }
            },
            resetGrid: function() {
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
            closeDetail: function() {
                var self = this;
                $('.content').removeClass('detail_on');
                setTimeout(function() {
                    self.grid.resetSize();
                }, options.gridReSizeTime);
            },
            clearDetail: function() {
                modules.detailView.model.reset();
            },
            currentSelRow: function () {
                var selRow = this.grid.getGridParam("selrow");
                if (!selRow) {
                    alert("Volume 정보가 선택되지 않았습니다.");
                    return null;
                }
                return this.collection.get(selRow);
            },
            initialize: function () {
                var self = this;
                this.gridId = "#volume-grid";
                this.grid = $(this.gridId).jqGrid({
                    datatype: "json",
                    url: '/private/openstack/volumes?id=' + id,
                    jsonReader: {
                        repeatitems: false,
                        id: "id"
                    },
                    colNames: [
                        jQuery.i18n.prop('title.jqgrid.projectName'),
                        jQuery.i18n.prop('title.jqgrid.name'),
                        jQuery.i18n.prop('title.jqgrid.description'),
                        jQuery.i18n.prop('title.jqgrid.size'),
                        jQuery.i18n.prop('title.jqgrid.state'),
                        jQuery.i18n.prop('title.jqgrid.attachedTo'),
                        jQuery.i18n.prop('title.jqgrid.zone'),
                        jQuery.i18n.prop('title.jqgrid.bootable'),
                        jQuery.i18n.prop('title.jqgrid.createdAt'),
                        jQuery.i18n.prop('title.jqgrid.projectId'),
                        jQuery.i18n.prop('title.jqgrid.id'),
                        jQuery.i18n.prop('title.jqgrid.metaData'),
                        jQuery.i18n.prop('title.jqgrid.volumeType')
                    ],
                    colModel: [
                        {name: 'projectName'},
                        {name: 'name'},
                        {name: 'description'},
                        {name: 'size', sorttype:'integer', formatter:function (cellVal, options, row) {
                                return cellVal + "GiB";
                            }},
                        {name: 'state'},
                        {name: 'attachmentInfos', formatter: getAttachmentsText, sorttype: function (cell, row) {
                                if(cell.length > 0) {
                                    return cell[0]["serverName"];
                                }
                                return cell;
                            }},
                        {name: 'zone'},
                        {name: 'bootable'},
                        {name: 'createdAt', hidden: true},
                        {name: 'projectId', hidden: true},
                        {name: 'id', hidden: true},
                        {name: 'metaData', hidden: true},
                        {name: 'volumeType', hidden: true}
                    ],
                    altRows: true,
                    sortname: "createdAt",
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
                        var m = self.collection.get(id);
                        // if ($("#detailBtn").hasClass("selected")) {
                        modules.detailView.model.set(m.toJSON());
                        // }
                        $('.content').addClass('detail_on');
                        setTimeout(function() {
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

                this.collection = new VolumeCollection();
                this.collection.on("add", function (model) {
                    self.grid.addRowData(model.attributes.id, model.toJSON(), "first");
                });
                this.collection.on("change", function (model) {
                    self.grid.setRowData(model.attributes.id, model.toJSON());
                    modules.detailView.model.set(model.toJSON());
                });
                this.collection.on("remove", function(model) {
                    self.grid.delRowData(model.get('id'));
                    modules.detailView.model.reset();
                });
            }
        }),
        init = function (isAdmin) {
            modules.view = new VolumeView();
            modules.detailView = new VolumeDetailView();

        };

    return {
        init: init,
        modules: modules
    };
})(config);
