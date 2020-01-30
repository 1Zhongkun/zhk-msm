import request from '@/utils/request'


// request.get(url).then(response=>{
 //export 单个导出 但是接受时需要加{}   export defalut可以直接 道处对象 
// 如果没有导出任何东西，就可以直接不需要对象})

//以对象配置的方式
request({
  method: "get",
  url: ''
});

