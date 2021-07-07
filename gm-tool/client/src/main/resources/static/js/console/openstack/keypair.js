var KeyPairUI = (function (options) {

    var
        modules = {},
        KeyPairModel = Backbone.Model.extend({
            idAttribute: 'name',
            urlRoot: '/private/openstack/keypairs?id=' + id,
            defaults: {
                name: '',
                fingerprint: '',
                publicKey: ''
            }
        }),
        KeyPairCollection = Backbone.Collection.extend({
            model: KeyPairModel
        }),
        KeyPairDetailView = Backbone.View.extend({
            el: "#tab1",
            model: new KeyPairModel(),
            template: _.template('<div class="detail_data">\n    <table class="tb_data">\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.name\') }}</th>\n            <td>{{= name }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.fingerprint\') }}</th>\n            <td>{{= fingerprint }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.publicKey\') }}</th>\n            <td colspan="3" style="word-break: break-all;">{{= publicKey }}</td>\n        </tr>\n    </table>\n</div><!-- //detail_data -->'),
            initialize: function () {
                var self = this;
                this.model.on('change', function(model) {
                    $('.detail_tit').text(model.get('name'));
                    self.render();
                });
            }
        //     events: {
        //         "click button.btn_action_refresh": "reload"
        //     }
        }),
        KeyPairView = Backbone.View.extend({
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
                    alert("KeyPair 정보가 선택되지 않았습니다.");
                    return null;
                }
                return this.collection.get(selRow);
            },
            initialize: function () {
                var self = this;
                this.gridId = "#keypair-grid";
                this.grid = $(this.gridId).jqGrid({
                    datatype: "json",
                    url: '/private/openstack/keypairs?id=' + id,
                    jsonReader: {
                        repeatitems: false,
                        id: "name"
                    },
                    colNames: [
                        jQuery.i18n.prop('title.jqgrid.name'),
                        jQuery.i18n.prop('title.jqgrid.fingerprint'),
                        jQuery.i18n.prop('title.jqgrid.publicKey')
                    ],
                    colModel: [
                        {name: 'name'},
                        {name: 'fingerprint'},
                        {name: 'publicKey', hidden: true}
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
                        // $("#flavor-grid tr:eq(1)").trigger('click');

                    }
                });

                this.collection = new KeyPairCollection();
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
            modules.view = new KeyPairView();
            modules.detailView = new KeyPairDetailView();

        };

    return {
        init: init,
        modules: modules
    };
})(config);