var NetworkUI = (function (options) {

    var
        modules = {},
        NetworkModel = Backbone.Model.extend({
            idAttribute: 'id',
            urlRoot: '/private/openstack/networks?id=' + id,
            defaults: {
                id: null,
                name: '',
                neutronSubnets: [],
                shared: false,
                external: false,
                state: '',
                adminStateUp: false,
                visibilityZones: [],
                projectId: '',
                projectName: ''
            }
        }),
        NetworkCollection = Backbone.Collection.extend({
            model: NetworkModel
        }),
        NetworkDetailView = Backbone.View.extend({
            el: "#tab1",
            model: new NetworkModel(),
            template: _.template('<div class="detail_data">\n    <table class="tb_data">\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.projectID\') }}</th>\n            <td>{{= projectId }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.projectName\') }}</th>\n            <td>{{= projectName }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.id\') }}</th>\n            <td>{{= id }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.name\') }}</th>\n            <td>{{= name }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.subnetsAssociated\') }}</th>\n            <td>{{= getNeutronSubnetsText(neutronSubnets) }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.shared\') }}</th>\n            <td>{{= shared }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.external\') }}</th>\n            <td>{{= external }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.state\') }}</th>\n            <td>{{= state }}</td>\n        </tr>\n        <tr>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.adminState\') }}</th>\n            <td>{{= adminStateUp }}</td>\n            <th>{{= jQuery.i18n.prop(\'title.jqgrid.zone\') }}</th>\n            <td>{{= getVisibilityZonesText(visibilityZones) }}</td>\n        </tr>\n    </table>\n</div><!-- //detail_data -->'),
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
        NetworkView = Backbone.View.extend({
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
                    alert("Network 정보가 선택되지 않았습니다.");
                    return null;
                }
                return this.collection.get(selRow);
            },
            initialize: function () {
                var self = this;
                this.gridId = "#network-grid";
                this.grid = $(this.gridId).jqGrid({
                    datatype: "json",
                    url: '/private/openstack/networks?id=' + id,
                    jsonReader: {
                        repeatitems: false,
                        id: "id"
                    },
                    colNames: [
                        jQuery.i18n.prop('title.jqgrid.projectName'),
                        jQuery.i18n.prop('title.jqgrid.name'),
                        jQuery.i18n.prop('title.jqgrid.subnetsAssociated'),
                        jQuery.i18n.prop('title.jqgrid.shared'),
                        jQuery.i18n.prop('title.jqgrid.external'),
                        jQuery.i18n.prop('title.jqgrid.state'),
                        jQuery.i18n.prop('title.jqgrid.adminState'),
                        jQuery.i18n.prop('title.jqgrid.zone'),
                        jQuery.i18n.prop('title.jqgrid.projectId'),
                        jQuery.i18n.prop('title.jqgrid.id')
                    ],
                    colModel: [
                        {name: 'projectName'},
                        {name: 'name'},
                        {name: 'neutronSubnets', formatter: getNeutronSubnetsText, sorttype: function(cell, row) {
                            if(cell.length > 0) {
                                return cell[0]['name'];
                            }
                            return cell;
                            }},
                        {name: 'shared'},
                        {name: 'external'},
                        {name: 'state'},
                        {name: 'adminStateUp'},
                        {name: 'visibilityZones', formatter: getVisibilityZonesText, sorttype: function(cell, row) {
                                if(cell.length > 0) {
                                    return cell[0]
                                }
                            }},
                        {name: 'projectId', hidden: true},
                        {name: 'id', hidden: true}
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

                this.collection = new NetworkCollection();
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
            modules.view = new NetworkView();
            modules.detailView = new NetworkDetailView();

        };

    return {
        init: init,
        modules: modules
    };
})(config);