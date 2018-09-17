//default params
var link = function (height = 50, color = 'red', url = 'http://azat.co') {
        //  ...
    }
    //template literals
var y = `${variabel}`
var name = `Your name is ${first} ${last}.`
var url = `http://localhost:3000/api/messages/${id}`

//multiline
var mult =
    `hjdfgk
    next HTMLInputEleme
    ntnextline`;

//arrow functions
var a = new Promise((resolve, reject) => {
    console.log(123);

}).then(error => {

    console.log(error);
})

var n = () => new Promise((resolve, reject) => {
    return resolve;
});

n().then().then();

//blocks in es6 for {} let const
function calculateTotalAmount(vip) {
    var amount = 0 // probably should also be let, but you can mix var and let
    if (vip) {
        let amount = 1 // first amount is still 0
    }

    { // more crazy blocks!
        let amount = 100 // first amount is still 0
            {
                let amount = 1000 // first amount is still 0
            }
    }
    return amount
}

console.log(calculateTotalAmount(true));



new Promise((resolve, reject) => {
    //code
    resolve('okey');
    //code
    reject(new Error("OOO"));
});

r.then().then().catch()