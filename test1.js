// 2018/11/24


// function after(){

// }

// let fn = after(3,function(){
//     console.log("test")
// })
// fn()
// fn()

// executor 执行器 默认会被内部执行 立即执行
//给异步方法编造两个序号   宏任务settimeout 微任务 then
setTimeout(function(){
    console.log(1)
},0)
let p =new Promise(function(resolve,reject){
    console.log(2)
    resolve()
})

p.then(function(){  //异步执行  异步编程比settimeout执行速度要快 
    console.log(3)
})
