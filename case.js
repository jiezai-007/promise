let Promise = require('./promise');

//resolve方法
Promise.resolve = function(val){
return new Promise((resolve,reject)=>{
    resolve(val)
});
}
//reject方法
Promise.reject = function(val){
return new Promise((resolve,reject)=>{
    reject(val)
});
}
//race方法 
Promise.race = function(promises){
return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
    promises[i].then(resolve,reject)
    };
})
}
  //all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises){
let arr = [];
let i = 0;
function processData(index,data){
    arr[index] = data;
    i++;
    if(i == promises.length){
    resolve(arr);
    };
};
return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
    promises[i].then(data=>{
        processData(i,data);
    },reject);
    };
});
}