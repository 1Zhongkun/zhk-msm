<template>
    <div>   
           
                <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
               <!--表单元素被指定了prop才会被重置-->
                <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="商品名称" ></el-input>
                </el-form-item>
                  <el-form-item prop="code" >
                <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
                </el-form-item>
                   <el-form-item prop="supplierName" >
                <el-input
                @click.native="dialogvisible=true"
                 readonly v-model="searchMap.supplierName" placeholder="选择供应商"></el-input>
                </el-form-item>
                <el-form-item>

                    <el-button type="primary" @click="fetchData">查询</el-button>
                     <el-button type="primary"  @click="handleAdd">新增</el-button>
                    <el-button @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
                </el-form>

         


          <el-table
            :data="list"
            height="380px"
            border
            style="width: 100%">
            <el-table-column type="index"  label="序号" width="60"> </el-table-column>
            <el-table-column  prop="name" label="商品名称"> </el-table-column>
            <el-table-column  prop="code" label="商品编码"> </el-table-column>
            <el-table-column  prop="spec" label="商品规格"> </el-table-column>
            <el-table-column  prop="retailPrice" label="零售价" ></el-table-column>
               <el-table-column  prop="purchasePrice" label="进货价"> </el-table-column>
            <el-table-column  prop="storageNum" label="库存数量"> </el-table-column>
            <el-table-column  prop="supplierName" label="供应商"> </el-table-column>
           
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
         <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next,jumper"
                :total="total">
         </el-pagination>

         <!--新增-->
                            <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
                         <el-form  :model="pojo" ref="pojoForm" label-width="100px" label-position="right"
                        style="width:400px" :rules="rules"
                        >
                            <el-form-item label="商品名称" prop="name">
                            <el-input v-model="pojo.name" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="商品编号" prop="code">
                            <el-input v-model="pojo.code" autocomplete="off"></el-input>
                            </el-form-item>
                          
                            <el-form-item label="商品规格" prop="spec">
                            <el-input v-model="pojo.spec" autocomplete="off"></el-input>
                            </el-form-item>

                             <el-form-item label="零售价" prop="retailPrice">
                            <el-input v-model="pojo.retailPrice" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="进货价" prop="purchasePrice">
                            <el-input v-model="pojo.purchasePrice" autocomplete="off"></el-input>
                            </el-form-item>
                          
                            <el-form-item label="库存数量" prop="storageNum">
                            <el-input v-model="pojo.storageNum" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item  label="供应商名称" prop="supplierName" >
                            <el-input readonly @click.native="editSupplier" v-model="pojo.supplierName" autocomplete="off"></el-input>
                            </el-form-item>
                        
                           
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
                    <el-button type="primary" @click="pojo.id===null?addData('pojoForm'):updatedData('pojoForm')">确 定</el-button>
                </div>
                </el-dialog>



                <!--选择供应商对话框-->

                        <el-dialog title="选择供应商" :visible.sync="dialogvisible" width="500" > 
                              <!--子组件向父组件发送的参数--->
                            <Supplier @option-supplier="optionSupplier" :isDialog="true"></Supplier>
                        </el-dialog>

                    </div>
</template>

<script>
import GoodsApi from '@/api/goods';
import Supplier from '@/views/supplier';
export default {
    components:{
         Supplier
    },
    created(){
        this.fetchData();
    },
    data(){
        return{
            dialogvisible:false,//弹出供应商对话框
            list:[],
            pageSize:10,
            currentPage:1,//当前页码
            total:0,//总纪律数
            pojo:{
                id:null,
                name: '',
                code: '',
                spec: '',
                retailPrice: '',
                purchasePrice: '',
                storageNum: '',
                supplierName:''
        
            },
             dialogTableVisible: false,
             dialogFormVisible: false,
             searchMap:{
                 code:'',
                 name:'',
                 supplierName:''
             },
             isEdit:false,//判断给那一股
               rules:{
                  name:[
                    {required:true,message:'商品名称不能为空',trigger:'blur'}
                  ],
                  code:[
                    {required:true,message:'商品编号不能为空',trigger:'blur'}
                  ],
                   retailPrice:[
                    {required:true,message:'零售价不能为空',trigger:'blur'}
                  ]
                 
            }
        }
    },
    methods: {
      editSupplier(){
           this.isEdit=true//新增打开的选择供应商
           this.dialogvisible=true;
          
      },
        optionSupplier(val){
          //用来判断是哪一个在用
          if(this.isEdit){
             this.pojo.supplierName=val.name;
             this.pojo.supplierId=val.id;
          }else{
            this.searchMap.supplierName=val.name;//供应商名称
            this.searchMap.supplierId=val.id;
        
          }
              this.isEdit=false;//改回原来的状态
              this.dialogvisible=false;
        },
        updatedData(formName) {
         this.$refs[formName].validate(valid=>{
                  if(valid){
                    GoodsApi.updated(this.pojo).then(response=>{
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
           console.log("123")
           if(valid){
                  GoodsApi.add(this.pojo).then(response=>{
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
            GoodsApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
                const res=response.data;
                this.total=res.data.total;
                this.list=res.data.rows;
            
            })
        },    handleEdit(id) { 
            this.handleAdd();
            GoodsApi.getById(id).then(response=>{
           
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
              GoodsApi.deleteById(id).then(response=>{
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