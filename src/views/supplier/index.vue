<template>
    <div>   
           
                <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
               <!--表单元素被指定了prop才会被重置-->
                <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="供应商名称" ></el-input>
                </el-form-item>
                  <el-form-item prop="linkname" v-if="!isDialog">
                    <el-input v-model="searchMap.linkname" placeholder="联系人"></el-input>
                   </el-form-item>
                   <el-form-item prop="mobile"  v-if="!isDialog">
                <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
                </el-form-item>
                <el-form-item>

                    <el-button type="primary" @click="fetchData">查询</el-button>
                     <el-button  v-if="!isDialog" type="primary"  @click="handleAdd">新增</el-button>
                    <el-button   v-if="!isDialog" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
                </el-form>

         

<!-- highlight-current-row 激活单选框-->
          <el-table
           @current-change="handleCurrentChange1"
            :highlight-current-row="isDialog"
            :data="list"
            height="380px"
            border
            style="width: 100%">
            <el-table-column type="index"  label="序号" width="60"> </el-table-column>
            <el-table-column  prop="name" label="供应商名称"> </el-table-column>
            <el-table-column  prop="linkman" label="联系人"> </el-table-column>
            <el-table-column v-if="!isDialog" prop="mobile" label="联系电话"> </el-table-column>
            <el-table-column v-if="!isDialog" prop="remark" label="备注" ></el-table-column>

             <el-table-column v-if="!isDialog" label="操作" width="150">
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
         <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20]"
                :page-size="pageSize"
                :layout="!isDialog?'total, sizes, prev, pager, next,jumper':'prev, pager,next'"
                :total="total">
         </el-pagination>

         <!--新增-->
                            <el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
                         <el-form  :model="pojo" ref="pojoForm" label-width="100px" label-position="right"
                        style="width:400px" :rules="rules"
                        >
                            <el-form-item label="供应商名称" prop="name">
                            <el-input v-model="pojo.name" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="联系人" prop="linkman">
                            <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
                            </el-form-item>
                          
                            <el-form-item label="联系号码号码" prop="mobile">
                            <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="备注" prop="remark" >
                            <el-input v-model="pojo.remark" autocomplete="off"></el-input>
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
import SupplierApi from '@/api/supplier';
export default {
    props:{
      //通过父组件传递的的东西判断是否为弹窗
      isDialog:Boolean
    },
    created(){
        this.fetchData();
    },
    data(){
        return{
            list:[],
            pageSize:10,
            currentPage:1,//当前页码
            total:0,//总纪律数
            pojo:{
                   id:null,
                  name:'',
                 linkman:'',
                 mobile:'',
                 remark:''
            },
             dialogTableVisible: false,
             dialogFormVisible: false,
             searchMap:{
                 name:'',
                 linkman:'',
                 mobile:'',
                 remark:''
             },
               rules:{
                  name:[
                    {required:true,message:'卡号不能为空',trigger:'blur'}
                  ],
                  linkman:[
                    {required:true,message:'姓名不能为空',trigger:'blur'}
                  ]
                 
            }
        }
    },
    methods: {
          handleCurrentChange1(currentRow) {
             this.$emit('option-supplier',currentRow);
      },
        updatedData(formName) {
         this.$refs[formName].validate(valid=>{
                  if(valid){
                    SupplierApi.updated(this.pojo).then(response=>{
                      const res=response.data
                         if(res.flag){
                           this.fetchData();
                           this.dialogFormVisible=false;
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
          //提交新增数据
      addData(formName){
         this.$refs[formName].validate(valid=>{
           if(valid){
                  SupplierApi.add(this.pojo).then(response=>{
                       const resp=response.data;
                       if(resp.flag){
                         this.fetchData();
                         //关闭窗口
                          this.dialogFormVisible = false;

                           
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
           resetForm(formName) {
          
        this.$refs[formName].resetFields();
       },
           handleAdd(){
           this.dialogFormVisible = true;
            this.$nextTick(()=>{
               this.$refs['pojoForm'].resetFields();
            })
           
      },
           handleSizeChange(val) {
           this.pageSize=val;
           this.fetchData();
          },
         handleCurrentChange(val) {
          this.currentPage=val;
          this.fetchData();
         },
        fetchData(){
            SupplierApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
                const res=response.data;
                this.total=res.data.total;
                this.list=res.data.rows;
            
            })
        },    handleEdit(id) { 
            this.handleAdd();
            SupplierApi.getById(id).then(response=>{
           
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
              SupplierApi.deleteById(id).then(response=>{
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
    },
}
</script>