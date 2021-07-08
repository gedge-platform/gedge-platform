var DashboardUI = (function (options) {
    var
        modules = {},
        ServiceDashboardModel = Backbone.Model.extend({
            idAttribute: 'id',
            defaults: {
                id: null,
                name: '',
                ip: ''
            }
        }),
        ServiceDashboardCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/getEdge',
            model: ServiceDashboardModel
        }),
        TotalNodeModel = Backbone.Model.extend({
            idAttribute: 'id',
            defaults: {
                id: null,
                name: '',
                ip: ''
            }
        }),
        TotalNodeCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/totalnode',
            model: TotalNodeModel
        }),
        MasterNodeModel = Backbone.Model.extend({
            idAttribute: 'id',
            defaults: {
                id: null,
                cpu: '',
                memory: '',
                pods: '',
                ephemeral_storage: '',
            }
        }),
        MasterNodeCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/masternode',
            model: MasterNodeModel
        }),
        PodCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/getPods'
        }),
        WorkerNodeModel = Backbone.Model.extend({
            idAttribute: 'id',
            defaults: {
                id: null,
                cpu: '',
                memory: '',
                pods: '',
                ephemeral_storage: '',
            }
        }),
        WorkerNodeCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/totalnode',
            model: WorkerNodeModel
        }),
        WorkerNodeUsageCollection = Backbone.Collection.extend({
            url: '/private/openstack/dashboard/getNodeUsage',
        }),
        ServiceDashboardView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {},
            serverDataLoad: function () {
                var self = this;
                this.collection.fetch({
                    success: function (collection, response, options) {

                        var template = _.template('');
                        _.each(collection.models, function (model, index, list) {

                            console.log(model);
                            console.log(list);

                            template = _.template($("#public_resource_list").html());

                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },
            initialize: function () {
                var self = this;
                this.collection = new ServiceDashboardCollection();

                this.collection.fetch({
                    success: function (collection, response, options) {
                        $("#clouds").empty();
                        var template = _.template('');
                        _.each(collection.models, function (model, index, list) {
                            console.log(model);
                            // for (var i = 0; i < list.length; i++) {
                                template = _.template($("#aws_logo_template").html());
                                $("#clouds").append(template(model.toJSON()));

                                // console.log(model.attributes.items.metadata.name);

                            // }

                            if (index == list.length - 1) {
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
        TotalNodeDashboardView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {},
            serverDataLoad: function () {
                var self = this;
                this.collection.fetch({
                    success: function (collection, response, options) {
                        var nodeTotalMaster = 0;
                        var cpu = 0;
                        var memory = 0;
                        var ephemeral_storage =  0;
                        var nodeTemplate = _.template('');
                        _.each(collection.models, function(model, index, list) {

                            console.log(model);
                            console.log(list);

                            nodeTotalMaster = model.attributes.items.length;
                            for(var i = 0; i < model.attributes.items.length; i++){
                                cpu += model.attributes.items[i].status.capacity.cpu;
                                memory += parseInt(model.attributes.items[i].status.capacity.memory);
                                ephemeral_storage += parseInt(model.attributes.items[i].status.capacity.ephemeral_storage);
                            }

                            $("#edge_account").toNumberSVG(nodeTotalMaster, {unit: "<span>node</span>"});

                            nodeTemplate = _.template($("#total_node_template").html());

                            if(index == list.length - 1) {

                                $("#node_total").toNumberSVG(nodeTotalMaster);
                                $("#total_node_cpu").toNumberSVG(cpu, {unit: '<span class="num_unit">Core</span>'});
                                $("#total_node_memory").toNumberSVG(memory/100000000, {unit: '<span class="num_unit">GB</span>'});
                                $("#total_node_storage").toNumberSVG(ephemeral_storage/100000000, {unit: '<span class="num_unit">GB</span>'});

                            }
                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },

            initialize: function () {
                var self = this;
                // var test;
                this.collection = new TotalNodeCollection();

                this.collection.fetch({
                    success: function (collection, response, options) {
                        this.collection2 = new PodCollection();
                        // $("#public_resource_list").empty();

                        _.each(collection.models, function (model, index, list) {

                            this.collection2.fetch({
                                success: function (collection2, response2, options2) {
                                    _.each(collection2.models, function(model2, index2, list2) {
                                        for(var i = 0; i < model2.attributes.items.length; i++){

                                            test = model2.attributes.items[i].metadata.name;
                                            console.log(test);

                                            var html = '<li>' +
                                                '<div class="name">' + test + '</div>\n' +
                                                '</li>';

                                            // $(".dashboard_public_detail_item:eq("+i+")").find(".name").append(template(model2.toJSON()));;
                                            $("#public_resource_list").append(html);
                                            // $(".dashboard_public_detail_item:eq("+i+")").find(".name:eq(0)").toString(model.attributes.items[i].name);
                                            // $(".dashboard_public_detail_item:eq("+i+")").find(".num:eq(1)").toNumberSVG(model.attributes.items[i].status.capacity.memory);
                                            var nodeTotalMaster = model2.attributes.items.length;
                                            $("#public_resource").toNumberSVG(nodeTotalMaster);
                                        }
                                    });
                                },
                                error: function (collection2, response2, options2) {

                                }
                            });





                            if (index == list.length - 1) {
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
        MasterNodeDashboardView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {},
            serverDataLoad: function () {
                var self = this;
                this.collection.fetch({
                    success: function (collection, response, options) {
                        var nodeTotalMaster = 0;
                        var cpu = 0;
                        var memory = 0;
                        var ephemeral_storage = 0;
                        var nodeTemplate = _.template('');
                        _.each(collection.models, function (model, index, list) {

                            console.log(model);
                            console.log(list);

                            nodeTotalMaster = model.attributes.items.length;
                            cpu += model.attributes.items[0].status.capacity.cpu;
                            memory += model.attributes.items[0].status.capacity.memory;
                            ephemeral_storage += model.attributes.items[0].status.capacity.ephemeral_storage;

                            nodeTemplate = _.template($("#edge_node_template").html());

                            if (index == list.length - 1) {

                                $("#node_total_master").toNumberSVG(nodeTotalMaster);
                                $("#node_cpu").toNumberSVG(cpu, {unit: '<span class="num_unit">Core</span>'});
                                $("#node_memory").toNumberSVG(parseInt(memory) / 100000000, {unit: '<span class="num_unit">GB</span>'});
                                $("#node_storage").toNumberSVG(parseInt(ephemeral_storage) / 100000000, {unit: '<span class="num_unit">GB</span>'});

                                modules.workernodeview.initialize(list.length, cpu, parseInt(memory) / 100000000, parseInt(ephemeral_storage) / 100000000);

                                // if(memory < 1024) {
                                //     $("#node_memory").toNumberSVG(memory, {unit: '<span class="num_unit">EA</span>'});
                                // } else {
                                //     $("#node_memory").toNumberSVG((memory/1024).toFixed(1), {unit: '<span class="num_unit">GB</span>', fixed: true});
                                // }
                            }
                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },
            initialize: function () {
                var self = this;
                this.collection = new MasterNodeCollection();

                this.collection.fetch({
                    success: function (collection, response, options) {
                        this.collection2 = new WorkerNodeUsageCollection();
                        $("#master_node_detail").empty();
                        var template = _.template('');
                        _.each(collection.models, function(model, index, list) {
                            this.collection2.fetch({
                                success: function (collection2, response2, options2) {
                                    _.each(collection2.models, function(model2, index2, list2) {

                                        for(var i = 0; i < model.attributes.items.length; i++){
                                            var html = '<div class="tit"><span>'+ model.attributes.items[i].metadata.name +'</span></div>';
                                            $("#edge_node_template").prepend(html);
                                            template = _.template($("#edge_node_template").html());
                                            // template = template + html;
                                            $("#master_node_detail").append(template(model.toJSON()));

                                            // test = model2.attributes.items[0].usage.cpu;

                                            $(".dashboard_public_detail_item:eq("+i+")").find(".num:eq(1)").toNumberSVG(parseInt(model2.attributes.items[i].usage.cpu)/1000, {unit: '<span class="num_unit">Core / </span>'});
                                            $(".dashboard_public_detail_item:eq("+i+")").find(".num:eq(0)").toNumberSVG(model.attributes.items[i].status.capacity.cpu, {unit: '<span class="num_unit"> Core</span>'});
                                            $(".dashboard_public_detail_item:eq("+i+")").find(".num:eq(3)").toNumberSVG((parseInt(model2.attributes.items[i].usage.memory)/100000).toFixed(2), {unit: '<span class="num_unit">MB / </span>'});
                                            $(".dashboard_public_detail_item:eq("+i+")").find(".num:eq(2)").toNumberSVG((parseInt(model.attributes.items[i].status.capacity.memory)/100000).toFixed(2), {unit: '<span class="num_unit"> MB</span>'});

                                        }
                                    });
                                },
                                error: function (collection2, response2, options2) {

                                }
                            });

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
        WorkerNodeDashboardView = Backbone.View.extend({
            el: ".cont_wrap",
            events: {
            },
            serverDataLoad: function (master_length, master_cpu, master_memory, master_ephemeral_storage) {
                var self = this;
                this.collection.fetch({
                    success: function (collection, response, options) {
                        var nodeTotal = 0;
                        var nodeTotalworker = 0;
                        var total_cpu = 0;
                        var worker_cpu = 0;
                        var total_memory = 0;
                        var total_memory2 = 0;
                        var worker_memory = 0;
                        var total_ephemeral_storage =  0;
                        var total_ephemeral_storage2 =  0;
                        var worker_ephemeral_storage =  0;
                        var nodeTemplate = _.template('');
                        _.each(collection.models, function(model, index, list) {

                            if(master_length != undefined && master_cpu != undefined && master_memory != undefined && master_ephemeral_storage != undefined){
                                nodeTotal = model.attributes.items.length;

                                for(var i = 0; i < model.attributes.items.length; i++){
                                    total_cpu += model.attributes.items[i].status.capacity.cpu;
                                    total_memory += parseInt(model.attributes.items[i].status.capacity.memory);
                                    total_ephemeral_storage += parseInt(model.attributes.items[i].status.capacity.ephemeral_storage);
                                }

                                total_memory2 = parseInt(total_memory)/100000000;
                                total_ephemeral_storage2 = parseInt(total_ephemeral_storage)/100000000;
                                nodeTotalworker = nodeTotal - master_length;
                                worker_cpu = total_cpu - master_cpu;
                                worker_memory = total_memory2 - master_memory;
                                worker_ephemeral_storage = total_ephemeral_storage2 - master_ephemeral_storage;

                                nodeTemplate = _.template($("#edge_worker_node_template").html());

                                if(index == list.length - 1) {

                                    $("#node_total_worker").toNumberSVG(nodeTotalworker);
                                    $("#worker_node_cpu").toNumberSVG(worker_cpu, {unit: '<span class="num_unit">Core</span>'});
                                    $("#worker_node_memory").toNumberSVG(worker_memory, {unit: '<span class="num_unit">GB</span>'});
                                    $("#worker_node_storage").toNumberSVG(worker_ephemeral_storage, {unit: '<span class="num_unit">GB</span>'});

                                    // if(memory < 100000000) {
                                    //     $("#worker_node_memory").toNumberSVG(memory, {unit: '<span class="num_unit">EA</span>'});
                                    // } else {
                                    //     $("#worker_node_memory").toNumberSVG((memory/100000000), {unit: '<span class="num_unit">GB</span>', fixed: true});
                                    // }
                                }
                            }

                        });
                    },
                    error: function (collection, response, options) {
                        ValidationUtil.getServerError(response);
                    }
                });
            },
            initialize: function (master_length, master_cpu, master_memory, master_ephemeral_storage) {
                var self = this;
                this.collection = new WorkerNodeCollection();

                this.collection.fetch({
                    success: function (collection, response, options) {
                        this.collection2 = new WorkerNodeUsageCollection();
                        $("#worker_node_detail").empty();
                        // var template = _.template('');
                        var cpuTemplate = _.template('');
                        _.each(collection.models, function(model, index, list) {
                            this.collection2.fetch({
                               success: function (collection2, response2, options2) {
                                   _.each(collection2.models, function(model2, index2, list2) {

                                       for(var i = 0; i < model.attributes.items.length-master_length; i++){
                                           var template = _.template('');
                                           console.log("i = " + i);
                                           var j = i+master_length;
                                           console.log("j = " + j);
                                           var html = '<div class="tit" id="tit_' + j + '"><span>'+ model.attributes.items[j].metadata.name +'</span></div>';

                                           $("#edge_worker_node_template").prepend(html);
                                           template = _.template($("#edge_worker_node_template").html());
                                           $("#worker_node_detail").append(template(model.toJSON()));
                                           // console.log(model2.attributes.items[j].usage.cpu);
                                           // console.log(model.attributes.items[j].status.capacity.cpu);
                                           // console.log(model2.attributes.items[j].usage.memory);
                                           // console.log(model.attributes.items[j].status.capacity.memory);

                                           // test = model2.attributes.items[0].usage.cpu;

                                           $(".dashboard_public_detail_item:eq("+j+")").find(".num:eq(1)").toNumberSVG(parseInt(model2.attributes.items[j].usage.cpu)/1000, {unit: '<span class="num_unit">Core / </span>'});
                                           $(".dashboard_public_detail_item:eq("+j+")").find(".num:eq(0)").toNumberSVG(model.attributes.items[j].status.capacity.cpu, {unit: '<span class="num_unit"> Core</span>'});
                                           $(".dashboard_public_detail_item:eq("+j+")").find(".num:eq(3)").toNumberSVG((parseInt(model2.attributes.items[j].usage.memory)/100000).toFixed(2), {unit: '<span class="num_unit">MB / </span>'});
                                           $(".dashboard_public_detail_item:eq("+j+")").find(".num:eq(2)").toNumberSVG((parseInt(model.attributes.items[j].status.capacity.memory)/100000).toFixed(2), {unit: '<span class="num_unit"> MB</span>'});

                                           console.log("============");

                                           // $("#tit_" + j).hide();

                                       }
                                   });
                               },
                               error: function (collection2, response2, options2) {

                               }
                            });



                            if(index == list.length - 1) {
                                self.serverDataLoad(master_length, master_cpu, master_memory, master_ephemeral_storage);
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
            modules.totalnodeview = new TotalNodeDashboardView();
            modules.masternodeview = new MasterNodeDashboardView();
            modules.workernodeview = new WorkerNodeDashboardView();
        };

    return {
        init: init,
        modules: modules
    };
})(config);
