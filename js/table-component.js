Vue.component('table-component', {
//    template: '#table-component',
    props: {
        resizable: {
            type: Boolean,
            default: false
        },
        tableData: {
            type: Array,
            required: true
        },
        tableColumns: Array,
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
        window.addEventListener('scroll', this.loadMoreCheck);

        api.localStorage.tableCellsWidth.get().then(function (response) {
            shared.dimentions = response;
        })
    },
    mounted: function () {

    },
    updated: function () {
        this.$nextTick(function () {
            if (this.loadMode == 'lazyLoad') {
                this.loadMoreCheck();
            }
        })
    },
    destroyed: function () {
        window.removeEventListener('scroll', this.loadMoreCheck);
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
            var selected = {};
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
            api.localStorage.tableCellsWidth.set(shared.dimentions);
        },

        loadMoreCheck: function () {
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
