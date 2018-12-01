class Promise{
    //成功调用
    constructor(executor){
        let self = this
        self.value = undefined;
        self.reason = undefined;
        self.status = 'pending';
        self.onResolvedCallbacks = [];
        self.onRejectedCallbacks = [];
        let resolve=(value)=>{
            if(self.status==='pending'){
                self.value = value;
                self.status = 'fulfilled';
                self.onResolvedCallbacks.forEach(fn => {
                    fn()
                });
            }
        }
        //失败调用
        let reject=(reason)=>{
            if(self.status==='pending'){
                self.reason = reason;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(fn => {
                    fn()
                });
            }
        }
        try{
            executor(resolve,reject)
        }catch(e){
            reject(e)   //捕获错误
        }
    }
    then(onFulfilled,onRejected) {
        let self = this
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
          if (self.status === 'fulfilled') {
            setTimeout(() => {
              try {
                let x = onFulfilled(self.value);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          };
          if (self.status === 'rejected') {
            setTimeout(() => {
              try {
                let x = onRejected(self.reason);
                resolvePromise(promise2, x, resolve, reject);
              } catch (e) {
                reject(e);
              }
            }, 0);
          };
          if (self.status === 'pending') {
            self.onResolvedCallbacks.push(() => {
              setTimeout(() => {
                try {
                  let x = onFulfilled(self.value);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                  reject(e);
                }
              }, 0);
            });
            self.onRejectedCallbacks.push(() => {
              setTimeout(() => {
                try {
                  let x = onRejected(self.reason);
                  resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                  reject(e);
                }
              }, 0)
            });
          };
        });
        return promise2;
      }
      catch(fn){
        return self.then(null,fn);
      }
    }
    function resolvePromise(promise2, x, resolve, reject){
      if(x === promise2){
        return reject(new TypeError('Chaining cycle detected for promise'));
      }
      let called;
      if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
          let then = x.then;
          if (typeof then === 'function') { 
            then.call(x, y => {
              if(called)return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            }, err => {
              if(called)return;
              called = true;
              reject(err);
            })
          } else {
            resolve(x);
          }
        } catch (e) {
          if(called)return;
          called = true;
          reject(e); 
        }
      } else {
        resolve(x);
      }
}

Promise.deferred = Promise.defer = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
    })
    return dfd
  }
module.exports = Promise;