import request from '@/utils/request'


export default {
    //获取会员列表数据
    getList(){
       return request({
              url:'/member/list',
              method:'get'
          })
    },
    //当前页面 page size几条数据   查询条件
    search(page,size,searchMap){
       return  request({
           url: `/member/list/search/${page}/${size}`,
           method: 'post',
           data:searchMap
        })
    },
    add(pojo){
        return request({
            url:'/member',
            method:'post',
            data: pojo
        }) 
    },
    //查询会员信息 通过id
    getById(id){
        return request({
            url:`/member/${id}`,
            method:'get',
            
        })
    },
         updated(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data:pojo
        })
    },
    deleteById(id) {
        return request({
            url: `/member/${id}`,
            method: 'delete'
        })
    }
}