Vue.filter('searchFilter', function (value) {
    //            return ableData.filter(function (i) {
    return value.file.indexOf(this.search) !== -1;
    //            })
})

var dimentions = {
    get: function () {
        return new Promise(function (resolve, reject) {
            if (typeof (Storage) !== "undefined") {
                resolve(JSON.parse(localStorage.getItem('dimentions') || "{}"));
            } else {
                reject(new Error('Sorry! No Web Storage support..'));
            }
        })

    },
    set: function (dimentions) {
        //app.$toastr.success('Favourites changed');
        localStorage.setItem('dimentions', JSON.stringify(dimentions));
        return dimentions;

    },
}

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

    props: {
        resizable: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            required: true
        },
        tableColumns: [Array],
        loadingCompleted: {
            type: Boolean,
            default: false,
        },
        pagination: Boolean,

    },
    data: function () {
        return {
            search: '',
            page: 1,
            loadMoreCounter: 1,
            rowsPerPage: 3,
            loadMode: 'all',
            currentTarget: {},
            showOnlySelected: false,
            selectedRows: [],
            markers: shared.markers,
            statuses: shared.statuses,
        }
    },
    created: function () {
        var vm = this;
        window.addEventListener('scroll', vm.checkLoadTable);

        dimentions.get().then(function (response) {
            shared.dimentions = response;
        })
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
        selected: function () {
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
            var vm = this;
            var fields = _.keys(vm.tableData[0]);
            return this.tableColumns || fields;
        },
        columnSizes: function () {
            this.columnNames.forEach(function (val) {
                if (!shared.dimentions[val]) {
                    shared.dimentions[val] = 100;
                }
            })
            return shared.dimentions;
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
                    //_.debounce(function(){
                    //    console.log(123);
                    shared.dimentions[this.targetName] = newWidth;

                    //}, 1000)
                }
            }
        },
        onMouseUp: function () {
            this.currentTarget = {}
            dimentions.set(shared.dimentions);
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

var shared = {
    dimentions: {},
    markers: [
                'green', 'green', 'yellow', 'red',
                'grey', 'blue', 'orange',
                'black', 'darkred', 'lightgrey',
            ],
    statuses: [
                'не становить интерес',
                'малой ценности',
                'составляет интерс',
                'ценное',
                'эксклюзив',
            ],
}

function formatDate(dateString) {
    return moment(dateString).format("DD.MM.YYYY hh:mm:ss");
}

var app = new Vue({
    el: '#app',
    data: {
        headersTable: [""],
        tableData: [],
        loadingCompleted: false,

    },
    created: function () {
        var vm = this;

        axios.get('dataA.json')
            .then(function (response) {
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
