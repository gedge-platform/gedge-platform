var ImageUI = (function (options) {

    var
        modules = {},
        ImageModel = Backbone.Model.extend({
            idAttribute: 'id',
            urlRoot: '/private/openstack/images?id=' + id,
            defaults: {
                id: null,
                name: '',
                type: '',
                state: '',
                visibility: '',
                isProtected: '',
                diskFormat: '',
                containerFormat: '',
                size: 0,
                minDisk: 0,
                minRam: 0,
                createdAt: '',
                updatedAt: '',
                file: '',
                schema: '',
                tag: [],
                virtualSize: 0,
                owner: '',
                checksum: '',
                instanceUuid: null
            }
        }),
        ImageCollection = Backbone.Collection.extend({
            model: ImageModel
        }),
        ImageDetailView = Backbone.View.extend({
            el: "#tab1",
            model: new ImageModel(),
            template: _.template('<div class="detail_data">\n    <table class="tb_data">\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.id\') }}</th>\n            <td>{{= id }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.type\') }}</th>\n            <td>{{= type }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.state\') }}</th>\n            <td>{{= state }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.size\') }}</th>\n            <td>{{= byteSizeFormatter(size) }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.minimumDisk\') }}</th>\n            <td>{{= minDisk }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.minimumRam\') }}</th>\n            <td>{{= minRam }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.diskFormat\') }}</th>\n            <td>{{= diskFormat }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.containerFormat\') }}</th>\n            <td>{{= containerFormat }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.createdAt\') }}</th>\n            <td>{{= createdAt }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.updatedAt\') }}</th>\n            <td>{{= updatedAt }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.file\') }}</th>\n            <td>{{= file }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.schema\') }}</th>\n            <td>{{= schema }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.tag\') }}</th>\n            <td>{{= tag }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.virtualSize\') }}</th>\n            <td>{{= virtualSize }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.ownerId\') }}</th>\n            <td>{{= owner }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.name\') }}</th>\n            <td>{{= name }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.visibility\') }}</th>\n            <td>{{= visibility }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.protected\') }}</th>\n            <td>{{= isProtected }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.checksum\') }}</th>\n            <td>{{= checksum }}</td>\n            <th></th>\n            <td></td>\n        </tr>\n\n    </table>\n</div><!-- //detail_data -->'),
            initialize: function () {
                var self = this;
                this.model.on('change', function(model) {
                    $('.detail_tit').text(model.get('name'));
                    self.render();
                });
            }
            // events: {
            //     "click button.btn_action_refresh": "reload"
            // }
        }),
        ImageView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {
                "click .cont_list .searchBtn": "search",
                "keyup .cont_list .input_search": "searchEnter",
                "click .cont_list .btn_control":"resetGrid",
                "click .detail_label_btn":"closeDetail"
            },
            search: function() {
                this.grid.search();
            },
            searchEnter: function(e) {
                if(e.keyCode == 13) {
                    this.grid.search();
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
            },
            closeDetail: function() {
                var self = this;
                $('.content').removeClass('detail_on');
                setTimeout(function() {
                    self.grid.resetSize();
                }, options.gridReSizeTime);
            },
            currentSelRow: function () {
                var selRow = this.grid.getGridParam("selrow");
                if (!selRow) {
                    alert("Image 정보가 선택되지 않았습니다.");
                    return null;
                }
                return this.collection.get(selRow);
            },
            initialize: function () {
                var self = this;
                this.gridId = "#image-grid";
                this.grid = $(this.gridId).jqGrid({
                    datatype: "json",
                    url: '/private/openstack/images?id=' + id,
                    jsonReader: {
                        repeatitems: false,
                        id: "id"
                    },
                    colNames: [
                        jQuery.i18n.prop('title.jqgrid.name'),
                        jQuery.i18n.prop('title.jqgrid.type'),
                        jQuery.i18n.prop('title.jqgrid.state'),
                        jQuery.i18n.prop('title.jqgrid.visibility'),
                        jQuery.i18n.prop('title.jqgrid.protected'),
                        jQuery.i18n.prop('title.jqgrid.diskFormat'),
                        jQuery.i18n.prop('title.jqgrid.size'),
                        jQuery.i18n.prop('title.jqgrid.minimumDisk'),
                        jQuery.i18n.prop('title.jqgrid.minimumRam'),
                        jQuery.i18n.prop('title.jqgrid.id'),
                        jQuery.i18n.prop('title.jqgrid.containerFormat'),
                        jQuery.i18n.prop('title.jqgrid.createdAt'),
                        jQuery.i18n.prop('title.jqgrid.updatedAt'),
                        jQuery.i18n.prop('title.jqgrid.file'),
                        jQuery.i18n.prop('title.jqgrid.schema'),
                        jQuery.i18n.prop('title.jqgrid.tag'),
                        jQuery.i18n.prop('title.jqgrid.virtualSize'),
                        jQuery.i18n.prop('title.jqgrid.ownerId'),
                        jQuery.i18n.prop('title.jqgrid.checksum'),
                        jQuery.i18n.prop('title.jqgrid.instanceUuid')
                    ],
                    colModel: [
                        {name: 'name'},
                        {name: 'type'},
                        {name: 'state'},
                        {name: 'visibility'},
                        {name: 'isProtected'},
                        {name: 'diskFormat'},
                        {name: 'size', sorttype:'integer', formatter:byteSizeFormatter},
                        {name: 'minDisk', sorttype:'integer', hidden: true},
                        {name: 'minRam', sorttype:'integer', hidden: true},
                        {name: 'id', hidden: true},
                        {name: 'containerFormat', hidden: true},
                        {name: 'createdAt', hidden: true},
                        {name: 'updatedAt', hidden: true},
                        {name: 'file', hidden: true},
                        {name: 'schema', hidden: true},
                        {name: 'tag', hidden: true},
                        {name: 'virtualSize', hidden: true},
                        {name: 'owner', hidden: true},
                        {name: 'checksum', hidden: true},
                        {name: 'instanceUuid', hidden: true}
                    ],
                    altRows: true,
                    sortname: "name",
                    sortorder: "asc",
                    loadonce: true,
                    autowidth: true,
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
                        // $("#image-grid tr:eq(1)").trigger('click');

                    }
                });

                this.collection = new ImageCollection();
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
            modules.view = new ImageView();
            modules.detailView = new ImageDetailView();

        };

    return {
        init: init,
        modules: modules
    };
})(config);