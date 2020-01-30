<template>
  <div class="login-container">
  <el-form ref="form" :model="form"  :rules="rules" label-width="80px" class="loginForm">  
      <h2 class="form-title">会员管理系统</h2>
  <el-form-item label="账号" prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="form.password"  type="password"></el-input>
  </el-form-item>
   <el-form-item>
    <el-button class="submit" type="primary" @click="submitForm('form')">登录</el-button>
  </el-form-item>
</el-form>
    
  </div>
</template>

<script>
  import {login,getUserInfo} from '@/api/login';
  export default {
     data() {
      return {
        form: {
          username: '',
          password:'',
        },
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }, 
          ],
           password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
         }
      }
    },
   created(){
     
      
   },
    methods:{
         submitForm(form) {
            this.$refs[form].validate(valid => {
          if (valid) {
              // login(this.form.username,this.form.password).then(response=>{
              //      const resp=response.data
              //      if(resp.flag){
              //          //验证成功
              //          getUserInfo(resp.data.token).then(response=>{
              //              const respUser=response.data;
              //              if(respUser.flag){
              //                   //保存loken
              //              localStorage.setItem("mxg-msm-user",JSON.stringify(respUser.data));
              //                localStorage.setItem("mxg-msm-token",resp.data.token);
              //               this.$router.push('/')
              //              }else{
              //          //未通过
              //              this.$message({
              //                message: '验证 失败',
              //                type: 'warning'
              //                });
              //           }
                          
              //          })

                    this.$store.dispatch('Login',this.form).then(response=>{
                           if(response.flag){
                             console.log(response.flag)
                              this.$router.push('/')
                           }else{
                             //未通过
                           this.$message({
                             message: '验证失败',
                             type: 'warning'
                             });
                        }

                    }).catch(error=>{

                    });
                   

                   }
              });
          }
        }
    }

     
    
</script>
<style  scoped>
 .loginForm{
     width:350px;
     margin:160px auto;/*上下160px 左右居中 */  
     border-radius: 20px;
     padding: 20px; 
     background: white;
 }
.login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../assets/login.jpg')
}
 .form-title{
     color:#303133;
     text-align: center;
 }
</style>