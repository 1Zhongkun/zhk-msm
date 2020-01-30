<template>
      <div>
                <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
               <!--表单元素被指定了prop才会被重置-->
                <el-form-item prop="username">
                <el-input v-model="searchMap.username" placeholder="用户" ></el-input>
                </el-form-item>
                  <el-form-item prop="name" >
                <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
                </el-form-item>
         

                    <el-button type="primary" @click="fetchData">查询</el-button>
                     <el-button type="primary"  @click="handleAdd">新增</el-button>
                    <el-button @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
                </el-form>
        <!--tableData固定渲染的数据
        border 表格边框
        
        -->

        <el-table
            :data="list"
            height="380px"
            border
            style="width: 100%">
            <el-table-column type="index"  label="序号" width="60"> </el-table-column>
            <el-table-column  prop="username" label="用户"> </el-table-column>
            <el-table-column  prop="name" label="姓名"> </el-table-column>
            <el-table-column  prop="age" label="年龄"> </el-table-column>
            <el-table-column  prop="mobile" label="电话号码" ></el-table-column>
            <el-table-column  prop="salary" label="薪酬"width="100"> </el-table-column>
            <el-table-column  prop="money" label="开卡金额" width="100"> </el-table-column>
            <el-table-column  prop="entryDate" label="入企时间" width="80">  
                 </el-table-column>
             <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                size="mini"
                @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
          <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next,jumper"
                :total="total">
         </el-pagination>


         <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form  :model="pojo" ref="pojoForm" label-width="100px" label-position="right"
        style="width:400px" :rules="rules"
        >
            <el-form-item label="用户" prop="username">
            <el-input v-model="pojo.username" autocomplete="off"></el-input>
            </el-form-item>

              <el-form-item label="姓名" prop="name">
            <el-input v-model="pojo.name" autocomplete="off"></el-input>
            </el-form-item>
           
              <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
            </el-form-item>
              <el-form-item label="薪酬" prop="salary" >
            <el-input v-model="pojo.salary" autocomplete="off"></el-input>
            </el-form-item>

               <el-form-item label="入企时间" prop="entryDate" >
            <el-date-picker
             v-model="pojo.entryDate"
             type="date"
             placeholder="入企时间">
            </el-date-picker>
            </el-form-item>
            
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
     <el-button type="primary" @click="pojo.id===null?addData('pojoForm'):updatedData('pojoForm')">确 定</el-button>
  </div>
</el-dialog>
    </div>
</template>
<script>
import staffApi from'@/api/staff';
export default {
    created(){
        this.fetchData();
    },
    data(){
        return{
            list:[],
            total:0,
            currentPage:1,
            pageSize:10,
            searchMap:{
                  username: '',
                 name: ''
            },//条件查询的条件值
             dialogTableVisible: false,
             dialogFormVisible: false,
            pojo:{
                id:null,
                username: '',
                 name: '',
                age: '',
                mobile: '',
                salary: '',
                entryDate: ''
            },
            rules:{
                  username:[
                    {required:true,message:'用户不能为空',trigger:'blur'}
                  ],
                  name:[
                    {required:true,message:'姓名不能为空',trigger:'blur'}
                  ]
            }
        }
    },
    methods: {
        fetchData(){
            staffApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
                 const res=response.data;
                 this.list=res.data.rows;
                 this.total=res.data.total;
                
            })
        },
        //修改会员
          handleEdit(id) { 
            this.handleAdd();
            staffApi.getById(id).then(response=>{
           
              const resp=response.data
                if(resp.flag){
                    this.pojo=resp.data; 
                }
            })
            },
            //删除会员
         handleDelete(id) {
        console.log(id);
       this.$confirm('确认删除这条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
              staffApi.deleteById(id).then(response=>{
                   const res=response.data;
                    this.$message({
                        type:res.flag?'success':'error',
                        message: res.message
                      });
                 if(res.flag){
                     this.fetchData();
                  
                 }
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        },
        handleSizeChange(val) {
           this.pageSize=val;
           this.fetchData();
      },
      handleCurrentChange(val) {
          this.currentPage=val;
          this.fetchData();
      },
        resetForm(formName) {
          
        this.$refs[formName].resetFields();
      },
      //提交新增数据
      addData(formName){
         this.$refs[formName].validate(valid=>{
           if(valid){
                  staffApi.add(this.pojo).then(response=>{
                       const resp=response.data;
                       if(resp.flag){
                        
                         this.fetchData();
                         //关闭窗口
                          this.dialogFormVisible = false;
                           this.$message({
                           message:"初始密码为123456",
                           type:"success"
                         })
                           
                       }else{
                         this.$message({
                           message:"添加失败",
                           type:"warning"
                         })
                       }
                  })
           }else{
             return false;
           }
         });
      },
      updatedData(formName) {
         this.$refs[formName].validate(valid=>{
                  if(valid){
                    staffApi.updated(this.pojo).then(response=>{
                      const res=response.data
                         if(res.flag){
                           this.fetchData();
                           this.dialogFormVisible=false;
                           this.pojo.id=null;//新增的bug
                         }
                    })
                  }else{
                     this.$message({
                        message:"修改失败",
                        type:"warning"
                     })
                  }
         });
      },
      //弹出新增窗口
      handleAdd(){
           this.dialogFormVisible = true;
            this.$nextTick(()=>{
               this.$refs['pojoForm'].resetFields();
            })
           
      }
    }
}
</script>