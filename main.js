Vue.filter('searchFilter', function (value) {
    //            return ableData.filter(function (i) {
    return value.file.indexOf(this.search) !== -1;
    //            })
})

var options = [
    {
        value: '0',
        text: 'не становить интерес'
                },
    {
        value: '1',
        text: 'малой ценности'
                },
    {
        value: '2',
        text: 'составляет интерс'
                },
    {
        value: '3',
        text: 'ценное'
                },
    {
        value: '4',
        text: 'эксклюзив'
                },
            ];

Vue.component('table-component', {
    //inheritAttrs: false,
    //['label', 'value'],
    props: {
        resizable: {
            type: Boolean,
            default: false
        },
        tableData: [Array],
        //search: String
        tableColumns: [Array],
        //        rowsPerPage: {
        //            type: Number,
        //            default: 3,
        //            validator: function (v) {
        //                return v > 0;
        //            }
        //        },
        loadingCompleted: {
            type: Boolean,
            default: false,
        },
        pagination: Boolean,
        //        loadMode: {
        //            type: String,
        //            default: 'handle',
        //            validator: function (value) {
        //                // The value must match one of these strings
        //                return ['lazyLoad', 'handle'].indexOf(value) !== -1
        //            }
        //        },

    },
    data: function () {
        return {
            search: '',
            text: 'kjghjkjghjgjhgjhgjh',
            markers: [
                'green', 'green', 'yellow', 'red',
                'grey', 'blue', 'orange',
                'black', 'darkred', 'lightgrey',
            ],
            page: 1,
            loadMoreCounter: 1,
            loadMode: 'all',
            //tableWidth: 'auto',
            //currentTarget: {},
            startPosition: 0,
            //options: options,
            selected: {},
            showOnlyChecked: false,
            statuses: [
                'не становить интерес',
                'малой ценности',
                'составляет интерс',
                'ценное',
                'эксклюзив',
            ],
            visibleRows: [],
            rowsPerPage: 3,

        }
    },
    created: function () {
        window.addEventListener('scroll', this.checkLoadTable);


    },
    mounted: function () {

    },
    updated: function () {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been re-rendered

        })

    },
    destroyed: function () {
        window.removeEventListener('scroll', this.checkLoadTable);
    },
//    watch: {
//        visibleRows: function (val) {
//            this.items = {};
//            var vm = this;
//            vm.selected = {}
//            //            this.selected = !this.selected;
//            val.forEach(function (item) {
//                vm.selected[item] = true;
//
//            });
//            console.log(this.selected);
//        }
//    },
    //    filters: {
    //         searchFilter: function () {
    //            return this.tableData.filter(function (i) {
    //                return i.status.indexOf(this.search) !== -1;
    //            })
    //        },
    //        
    //    },
    computed: {
        items: function () {
            if (this.showOnlyChecked) {
                console.log(123);
                return this.selectedData();
            }
            if (this.loadMode == 'all') {
                return this.filteredData;
            }
            if (this.loadMode == 'pagination') {
                var from = this.rowsPerPage * (this.page - 1),
                    to = from + this.rowsPerPage;
                return this.filteredData.slice(from, to);
            }


            return this.filteredData.slice(0, this.rowsPerPage * this.loadMoreCounter);
        },

        emptyTable: function () {
            return _.isEmpty(this.filteredData) || _.isEmpty(this.tableData);
        },

        filteredData: function () {
            var vm = this;
            return vm.tableData.filter(function (row) {
                return _.values(row).join().indexOf(vm.search) !== -1;
            })

        },
        
        //                rowsPerPage: function () {
        //                    return this.rowsInput; 
        //                },
        columnNames: function () {
            var fields = _.keys(this.tableData[0]);
            //fields[0] = {key: 'id', sortable: true}
            return this.tableColumns || fields;
        },
//        columnWidth: {
//            get: function () {
//                var obj = {};
//                _.keys(this.tableData[0]).forEach(function (value) {
//                    obj[value] = '';
//                })
//                console.log(obj);
//                return obj;
//            },
//            set: function (name) {
//
//
//            },
//        },

    },

    methods: {
        filterSelected: function () {
            var vm = this;
            this.items = this.items.filter(function (val) {
                return vm.visibleRows.indexOf(val.id) !== -1;
            })
        },
        resetProperties: function () {
            this.page = 1;
            this.loadMoreCounter = 1;
        },

        onMouseDown: function (e) {
            this.currentTarget = e.target;
            this.targetName = $(e.target).attr('name');
        },
        onMouseMove: function (e) {
            if (e.which) {
                var newWidth = e.pageX - this.currentTarget.offsetLeft;
                if (newWidth > 20) {
                    $('col[name="' + this.targetName + '"]').css('width', newWidth + 'px')
                }
            }
        },

        checkLoadTable: function () {
            if (this.loadMode !== 'lazyLoad') {
                return;
            }
            var clientWindowHeight = document.documentElement.clientHeight;
            var pageOffset = window.pageYOffset || document.documentElement.scrollTop;
            var tableOffset = $('table').offset().top + $('table').height();
            if (pageOffset == tableOffset) {
                console.log('stickyheader');
            }
            if (clientWindowHeight + pageOffset > tableOffset) {
                console.log(clientWindowHeight + pageOffset, tableOffset);
                this.loadMoreCounter++;
                this.checkLoadTable();
            }
        },
        selectedData: function(){
            var vm = this;
            return this.tableData.filter(function(row){
                return vm.visibleRows.indexOf(row.id) !== -1; 
            })
            
        },

    },
});


function formatDate(dateString) {
    return moment(dateString).format("DD.MM.YYYY hh:mm:ss");
}

var app5 = new Vue({
    el: '#app-5',
    data: {
        headersTable: [""],
        tableData: [],
        loadingCompleted: false,

    },
    created: function () {
        var vm = this;

        axios.get('dataA.json')
            .then(function (response) {
                console.log(response);
                vm.tableData = response.data;
                vm.prepareData();
                vm.loadingCompleted = true;
            })
            .catch(function (error) {
                console.log('Ошибка! Не могу связаться с API. ' + error);
            })

        //        $(document).on('scroll', this.checkLoadTable);

    },
    methods: {
        //create model instance
        prepareData: function () {
            this.tableData.forEach(function (row) {
                row.start = formatDate(row.start);
                if (row.start !== row.finish) {
                    row.start += "-" + formatDate(row.finish);
                }
                row.createdon = formatDate(row.createdon);
                delete row.finish;
            })
        },

    },


})
/*
Vue.set(app5.obj, 'age', 27);
app5.obj = Object.assign({}, app5.obj, {
    age: 29,
    favoriteColor: 'Vue Green'
})
*/

// vprop
/*
        
camelCase: {
    type: [Array, Object],
    required: true,
    default: 100, // or function(){}
    validator: function (value) {
        return Array.isArray(value);
    }


*/
