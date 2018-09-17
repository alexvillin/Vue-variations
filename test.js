//import VueResource from 'vue-resource';
//Vue.use(VueResource);
Vue.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
});
Vue.filter('searchFilter', function (value) {
//            return ableData.filter(function (i) {
                return value.file.indexOf(this.search) !== -1;
//            })
        })
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
        
        
    },
    data: function(){
        return {        
            currentTarget: null,
            search: '1',
            text: 'kjghjkjghjgjhgjhgjh',
            
        }
    },
//    filters: {
//         searchFilter: function () {
//            return this.tableData.filter(function (i) {
//                return i.status.indexOf(this.search) !== -1;
//            })
//        },
//        
//    },
    computed: {
emptyTable: function () {
 return _.isEmpty(this.filteredData);   
},
        filteredData: function(){
            var vm = this;
            return this.tableData.filter(function (row) {
                return _.values(row).join().indexOf(vm.search) !== -1;
            })
        },
        columnNames: function(){
            return Object.keys(this.tableData[0]);
        },        
        //this.tableData = 
    },

    methods: {
        searchData: function() {
            console.log(123);
        },
        setCurrentTarget: function(e){
            this.currentTarget = e.target;
        },
        resizeColumn: function(e){
            if(e.which){
                this.currentTarget.style.width = e.pageX - this.currentTarget.offsetLeft + 'px';
//                console.log($('table'));
            }   
        },
    },
    //template: "#table-component",
//    `<table class="table table-bordered table-striped resizable">
//        <thead>
//<template v-for="header in Object.keys(tableData[0])">
//            <th @mousedown="setCurrentTarget($event)" @mousemove="resizeColumn($event)">{{header}}</th>
//</template>
//        </thead>
//        <tbody v-for="item in tableData">
//        <tr>
//            <td v-for="(key, value) in item">{{key}}</td>
//        </tr>
//        </tbody>
//    </table>`,
});

Vue.component('button-counter', {
    inheritAttrs: false,
    props: {
        titleString: [String, Object],
        title: String, //default syntax
        likes: Number,
        isPublished: Boolean,
        commentIds: Array,
        author: Object,
        person: Person, //constructor
        object: {
            type: [Array, Object],
            required: true,
            default: 100, // or function(){}
            validator: function (value) {
                return Array.isArray(value);
            }
        }
    },
    data: function () {
        return {
            count: 0,
            //title: this.title.toUpperCase(),
            obj: function () {
                //console.log(this.object);
                return 123;
            },

        }
    },
    computed: {

    },
    template: '<button @click="count++">\
        You clicked me {{ count }} times. {{title}}\
        <p>{{obj}}</p>\
        </button>',
});
//
//Vue.component('blog-post', {
//    props: this.        post: Object,lod//        title: String
//
//    },
//    template: `
//        <div class="blog-post">
//            <h3>{{ post.title }}</h3>
//            <slot></slot>    
//            <button class="btn btn-primary" @click="$emit('growth')">Uptext</button>
//        </div>
//    `
//});
/*
var root = new Vue({
    el: '#',
    data: {},
    methods: {},
    computed: {},
    created: function(){}, //no arrow functions here
    updated: function(){},
    mounted: function(){},
    destroyed: function(){},
    
    watcher: {},
    
    components:{}
    render: {}
})
*/
//console.log(_);

function Person(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
}


var app5 = new Vue({
    el: '#app-5',
    data: {
        message: 'Привет, Vue.js!',
        firstName: 'Foo',
        lastName: 'Bar',
        question: '',
        ok: true,
        obj: {
            name: 'Ann'
        },
        time: moment().format(),
        
        tableData: [],
        //th: [],
        answer: 'Пока вы не зададите вопрос, я не могу ответить!',
        //debouncedGetAnswer: _.debounce(this.getAnswer, 500)
        //        debouncedGetAnswer: ''
    },
    created: function () {
        //        console.log(this);
        var vm =this;
        this.debouncedGetAnswer = _.debounce(this.getAnswer, 500);
             
        axios.get('dataA.json')
                .then(function (response) {
               console.log(response);
                  vm.tableData = response.data.slice(0,10);
                })
                .catch(function (error) {
                    console.log('Ошибка! Не могу связаться с API. ' + error);
                })

    
    },
    mounted: function(){
        
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        },
        getAnswer: function () {
            if (this.question.indexOf('?') === -1) {
                this.answer = 'Вопросы обычно заканчиваются вопросительным знаком. ;-)'
                return
            }
            this.answer = 'Думаю...'
            var vm = this
            axios.get('https://yesno.wtf/api')
                .then(function (response) {
                    vm.answer = _.capitalize(response.data.answer)
                })
                .catch(function (error) {
                    vm.answer = 'Ошибка! Не могу связаться с API. ' + error
                })
        },

    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('');
        },
        //        fullName: function () {
        //            return this.firstName + ' ' + this.lastName
        //        },
        fullName: {
            // геттер:
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            // сеттер:
            set: function (newValue) {
                var names = newValue.split(' ')
                this.firstName = names[0]
                this.lastName = names[names.length - 1]
            }
        }

    },
    watch: {
        // эта функция запускается при любом изменении вопроса
        question: function (newQuestion, oldQuestion) {
            this.answer = 'Ожидаю, когда вы закончите печатать...'
            this.debouncedGetAnswer();
        }
    },
})
/*
Vue.set(app5.obj, 'age', 27);
app5.obj = Object.assign({}, app5.obj, {
    age: 29,
    favoriteColor: 'Vue Green'
})
*/
var f = new Vue({
    el: "#first",
    created: function () {
        Vue.http.get('./items.json').then(function (response) {
            //console.log(response.bodyText);
            return this.items = response.body;
        })
    },
    data: {
        items: [],
        aaa: {
            t: 123,
            v: 'str'
        },

        postFontSize: 1,
        person: new Person,

        posts: [
            {
                id: 1,
                title: 'My journey with Vue',
                author: 'shakesper'
              },
            {
                id: 2,
                title: 'Blogging with Vue',
                author: 'shakesper2'

              },
            {
                id: 3,
                title: 'Why Vue is so fun',
                author: 'shakesper3'

              }
        ],
        list: [{
            id: 123,
            content: 'fdgfdgfdgfd'

                }, {
            id: 124,
            content: 'fdgfdgfdgfdyyyyyyy'

                }, {
            id: 125,
            content: 'fdgfdgfyyyyydgfd'

                }],
        email: "dassadasd",
        password: 'sfsdfsdf',
        checkbox: 'dfsdfdsfsdf',
        options: [
            {
                text: 'sdfsdfsdf',
                value: 1
                    },
            {
                text: 'rsfsfsdfsdfs',
                value: 2
                    },
            {
                text: 'gdfgfdgdf',
                value: 3
                    }

                ],
        selected: 1,
        radio: 123,
    },

    methods: {
        setZero: function () {
            this.person = "Nwew pers";

        },
        setTrue: function () {
            this.person = 'true';

        },
        upText: function () {
            console.log(1233344)
            this.postFontSize += 0.1;
        },
        getItems: function () {

        }

    }

});
console.log(f);


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