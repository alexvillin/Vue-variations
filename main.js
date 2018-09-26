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
            markers: [
                'green', 'green', 'yellow', 'red',
                'grey', 'blue', 'orange',
                'black', 'darkred', 'lightgrey',
            ],
            page: 1,
            loadMoreCounter: 1,
            rowsPerPage: 3,
            loadMode: 'all',
            //tableWidth: 'auto',
            currentTarget: {},
            startPosition: 0,
            //options: options,
            showOnlySelected: false,
            statuses: [
                'не становить интерес',
                'малой ценности',
                'составляет интерс',
                'ценное',
                'эксклюзив',
            ],
            selectedRows: [],
            columnSize: {},

        }
    },
    created: function () {
        window.addEventListener('scroll', this.checkLoadTable);
    },
    mounted: function () {

    },
    updated: function () {
        this.$nextTick(function () {
            if (this.loadMode == 'lazyLoad') {
                this.checkLoadTable();
            }
            // Code that will run only after the
            // entire view has been re-rendered

        })

    },
    destroyed: function () {
        window.removeEventListener('scroll', this.checkLoadTable);
    },

    computed: {
        //pagination
        items: function () {
            var vm = this;
            if (vm.loadMode == 'all') {
                return vm.filteredData;
            }
            if (vm.loadMode == 'pagination') {
                var from = vm.rowsPerPage * (vm.page - 1),
                    to = from + vm.rowsPerPage;
                return vm.filteredData.slice(from, to);
            }
            return vm.filteredData.slice(0, vm.rowsPerPage * vm.loadMoreCounter);
        },
        totalPages: function () {
            return Math.ceil(this.filteredData.length / this.rowsPerPage);
        },
        //selected helper
        selected: function(){
            var selected = [];
            this.selectedRows.forEach(function (id) {
                selected[id] = true;
            })
            return selected;
        },
        //for search and select filters
        filteredData: function () {
            var vm = this;
            //create new array for dont touch reactive variable
            var items = vm.tableData.slice();
            if (vm.search) {
                items = items.filter(function (row) {
                    return _.values(row).join().indexOf(vm.search) !== -1;
                })
            }
            if (vm.showOnlySelected) {
                items = items.filter(function (item) {
                    return vm.selectedRows.indexOf(item.id) !== -1;
                })
            }
            return items;
        },
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
                    this.columnSize[this.targetName] = newWidth;
                }
            }
        },
        onMouseUp: function(){
            this.currentTarget = {}
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
            }
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
        
camelCase: {
    type: [Array, Object],
    required: true,
    default: 100, // or function(){}
    validator: function (value) {
        return Array.isArray(value);
    }


*/
