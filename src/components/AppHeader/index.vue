<template>
     <div class="header">
         <a href="#/">
         <img  class="logo" src="@/assets/logo.png" width="25px">
         <span class="company">会员管理系统</span>
         </a>
        <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      
      <el-dropdown-menu slot="dropdown"  >
        <el-dropdown-item icon="el-icon-edit" command="a">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" command="b">退出系统</el-dropdown-item>
      
      </el-dropdown-menu>
    </el-dropdown>

<!--修改密码-->
<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" style="width:300px" label-width="100px" class="demo-ruleForm">
  <el-form-item label="旧密码" prop="oldpass">
    <el-input type="oldpass" v-model="ruleForm.oldpass" autocomplete="off"></el-input>
  </el-form-item>
   <el-form-item label="新密码" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</el-dialog>
     </div>
</template>
<script>
import {logout} from '@/api/login';
import passwodrApi from '@/api/password';
  export default {
     data() {
      var validateoldPass = (rule, value, callback) => {
            passwodrApi.checkPwd(this.user.id,value).then(response=>{
                const res=response.data;
                if(res.flag){
                  callback();
                }else{
                  callback(new Error("密码错误"))
                }
            })
      };
      //校验新密码是否一致
      //value 是确认密码
     var validatePass=(rule, value, callback) => {
             if(value!=this.ruleForm.pass){
                 callback(new Error('两次密码不一样'))
             }else{
               callback();
             }
     } ;
          return {
        // user:JSON.parse(localStorage.getItem('mxg-msm-user')),
         user: this.$store.state.user.user,
        dialogFormVisible:false,
        ruleForm: {
           oldpass: '',
          pass: '',
          checkPass: ''
         
        },
        rules: {
           oldpass: [
            { validator: validateoldPass, trigger: 'blur' },
             {required:true,message:'旧密码不能为空',trigger:'blur'}
          ],
          pass: [
           
             {required:true,message:'新密码不能为空',trigger:'blur'}
          ],
          checkPass: [
               { validator: validatePass, trigger: 'change' },
             {required:true,message:'确认密码不能为空',trigger:'blur'}
          ]
        }
      };
    },
  
      
    methods: {
         submitForm(formName) {
           this.$refs[formName].validate((valid) => {
          if (valid) {
              passwodrApi.updatePwd(this.user.id,this.ruleForm.checkPass).then(response=>{
                const res=response.data;
                //不管是失败成功还是失败都提醒
                     this.$message({
                    message:res.message,
                    type:res.flag?'success':'warning',

                   
                  });
                  if(res.flag){
                    this.handlelogout(); 
                    this.dialogFormVisible=false;
                  }
              })
          } else {
           
            return false;
          }
        });
      },
       resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //打开密码窗口
      handlePwd(){
          this.dialogFormVisible=true;
          this.$nextTick(()=>{
            this.$refs['ruleForm'].resetFields();
          })
      },
      handlelogout(){
          this.$store.dispatch('Logout').then(response => {
                if(response.flag) {
                    // 退出成功
                    // 回到登录页面
                    this.$router.push('/login')
                }else {
                    this.$message({
                        message: resp.message,
                        type: 'warning',
                        duration: 500 // 弹出停留时间
                    });
                }
            })
      },
      handleCommand(command) {
      
        switch(command){
          //打开密码窗口
            case 'a':  this.handlePwd();;break;
             case 'b': this.handlelogout();        
             ;break;
             default:break;
        }
      }
    }
  }
</script>
<style scope>
.logo{
    vertical-align: middle;
    padding: 0px 10px 0px 40px;
}
.company{
    color: white;
    position: absolute;
}
.el-dropdown{
    float: right;
    margin-right:40px ;
}
.el-dropdown-link{
    color:white;
    cursor: pointer;
}
</style>
