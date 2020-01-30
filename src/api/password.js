import request from '@/utils/request';

export default {
    //校验密码  uid pwd
      checkPwd(userId,password){
          return request({
              url:'/user/pdw',
             method:'post',
             data:{
                 userId,
                 password
             }
          })
      },
      //修改密码
    updatePwd(userId, password){
          return request({
              url: '/user/pdw',
              method: 'put',
              data: {
                  userId,
                  password
              }
          })
      }
}