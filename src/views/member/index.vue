<template>
      <div>
                <el-form ref="searchForm" :inline="true" :model="searchMap" class="demo-form-inline" style="margin-top:20px">
               <!--表单元素被指定了prop才会被重置-->
                <el-form-item prop="cardNum">
                <el-input v-model="searchMap.cardNum" placeholder="会员卡号" ></el-input>
                </el-form-item>
                  <el-form-item prop="name" >
                <el-input v-model="searchMap.name" placeholder="会员名字"></el-input>
                </el-form-item>
                <el-form-item prop="payType">
                <el-select v-model="searchMap.payType" placeholder="支付类型">
                <el-option  v-for="item in payType"
                :key="item.type"
                :label="item.name"
                :value="item.type"></el-option>
              
                    </el-select>
                </el-form-item>
                <el-form-item prop="date">
  
               <el-date-picker
             v-model="searchMap.birthday"
             type="date"
             placeholder="出生日期">
            </el-date-picker>

                </el-form-item>
                <el-form-item>

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
            <el-table-column  prop="cardNum" label="会员卡号"> </el-table-column>
            <el-table-column  prop="name" label="会员姓名"> </el-table-column>
            <el-table-column  prop="birthday" label="会员生日"> </el-table-column>
            <el-table-column  prop="phone" label="会员号码" ></el-table-column>
            <el-table-column  prop="integral" label="会员积分"width="100"> </el-table-column>
            <el-table-column  prop="money" label="开卡金额" width="100"> </el-table-column>
            <el-table-column  prop="payType" label="支付方式" width="80">
                   <template slot-scope="scope">
                      <span>{{scope.row.payType|payTypeFilter}}</span>
                  </template>
                
                 </el-table-column>
            <el-table-column  prop="address" label="地址"> </el-table-column>
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


         <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
        <el-form  :model="pojo" ref="pojoForm" label-width="100px" label-position="right"
        style="width:400px" :rules="rules"
        >
            <el-form-item label="会员卡号" prop="cardNum">
            <el-input v-model="pojo.cardNum" autocomplete="off"></el-input>
            </el-form-item>

              <el-form-item label="会员姓名" prop="name">
            <el-input v-model="pojo.name" autocomplete="off"></el-input>
            </el-form-item>
              <el-form-item label="会员生日" prop="birthday" >
            <el-date-picker
             v-model="pojo.birthday"
             type="date"
             placeholder="会员生日">
            </el-date-picker>
            </el-form-item>
              <el-form-item label="手机号码" prop="phone">
            <el-input v-model="pojo.phone" autocomplete="off"></el-input>
            </el-form-item>
              <el-form-item label="开卡金额" prop="money" >
            <el-input v-model="pojo.money" autocomplete="off"></el-input>
            </el-form-item>
              <el-form-item label="可用积分" prop="integral">
            <el-input v-model="pojo.integral" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="支付类型" prop="payType">
                <el-select v-model="pojo.payType" placeholder="支付类型">
                <el-option  v-for="item in payType"
                :key="item.type"
                :label="item.name"
                :value="item.type"></el-option>
              
                    </el-select>
                </el-form-item>

        <el-form-item label="会员地址" prop="address">
            <el-input v-model="pojo.address" autocomplete="off"></el-input>
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
import memberApi from'@/api/member';
const payType=[
    {type:'1',name:"现金"},
    {type:'2',name:"微信"},
    {type:'3',name:"支付宝"},
    {type:'4',name:"银行卡"}
]
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
                cardNum:'',
                name:'',
                payType:'',
                date:''
            },//条件查询的条件值
            payType,
             dialogTableVisible: false,
             dialogFormVisible: false,
            pojo:{
              id:null,
              cardNum:'',
              name:'',
              birthday:'',
              phone:'',
              money:'',
              integral:0,
              payType:'',
              address:''
            },
            rules:{
                  cardNum:[
                    {required:true,message:'卡号不能为空',trigger:'blur'}
                  ],
                  name:[
                    {required:true,message:'姓名不能为空',trigger:'blur'}
                  ],
                  payType:[
                    {required:true,message:'支付类型不能为空',trigger:'change'}
                  ]
            }
        }
    },
    methods: {
        fetchData(){
            memberApi.search(this.currentPage,this.pageSize,this.searchMap).then(response=>{
                 const res=response.data;
                 this.list=res.data.rows;
                 this.total=res.data.total;
                
            })
        },
        //修改会员
          handleEdit(id) { 
            this.handleAdd();
            memberApi.getById(id).then(response=>{
           
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
              memberApi.deleteById(id).then(response=>{
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
                  memberApi.add(this.pojo).then(response=>{
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
      updatedData(formName) {
         this.$refs[formName].validate(valid=>{
                  if(valid){
                    memberApi.updated(this.pojo).then(response=>{
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
      //弹出新增窗口
      handleAdd(){
           this.dialogFormVisible = true;
            this.$nextTick(()=>{
               this.$refs['pojoForm'].resetFields();
            })
           
      }
    },
    filters:{
         payTypeFilter(type){
               const payobj= payType.find(obj=>{
                 return   obj.type===type
              })
              return  payobj ?payobj.name:null
               
         }
    }
}
</script>