//Vue.config.performance = true;
//class TableRowModel {
//  construct(data) {
//    this.data = data
//  }
//
//  name() {
//    return this.data.firstname + ' ' + this.data.lastname
//  }
//
//  // and so on, put other methods here
//}

const api = {
    table: {
        get: function (url) {
            return axios.get(url);
        }
    },
    localStorage: {
        tableCellsWidth: {
            name: 'tableCellsWidth',
            get: function () {
                return new Promise(function (resolve, reject) {
                    if (typeof (Storage) !== "undefined") {
                        resolve(JSON.parse(localStorage.getItem(this.name) || "{}"));
                    } else {
                        reject(new Error('Sorry! No Web Storage support..'));
                    }
                })
            },
            set: function (data) {
                //app.$toastr.success('Changed');
                localStorage.setItem(this.name, JSON.stringify(data));
                return data;

            },
        }
    },

}


var shared = {
    dimentions: {},
    markers: [
                'green', 'green', 'yellow', 'red',
                'grey', 'blue', 'orange',
                'black', 'darkred', 'lightgrey',
            ],
    statuses: [
                'not interesting',
                'interesting',
                'very interesting',
                'valuable',
                'unique',
            ],
    items: []
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

        api.table.get('dataA.json')
            .then(function (response) {
                vm.tableData = response.data;
                vm.prepareData();
                vm.loadingCompleted = true;
            })
            .catch(function (error) {
                console.log('Error! Can`t get json data' + error.message);
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
