<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="status[0]" label="未发布"/>
          <el-option :value="status[1]" label="已发布"/>
        </el-select>
      </el-form-item>
   <!--   <el-form-item label="添加时间">
        <el-date-picker v-model="teacherQuery.begin" type="datetime"
                        placeholder="选择开始时间" value-format="yyyy-MM-dd HH:mm:ss"
                        default-time="00:00:00"/>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="teacherQuery.end" type="datetime" placeholder="选择截止时间"
                        value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"/>
      </el-form-item>-->
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table :data="list" element-loading-text="数据加载中" fit border
              highlight-current-row>
      <el-table-column align="center" label="序号" width="120">
        <template slot-scope="scope">
          {{(page-1) * limit + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="title" label="课程名称" width="300"></el-table-column>
      <el-table-column align="center" label="课程状态" width="130">
        <template slot-scope="scope">
          {{scope.row.status === 'Draft'?'未发布':'已发布'}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="lessonNum" label="课时数" width="100"></el-table-column>
      <el-table-column align="center" prop="gmtCreate" label="添加时间" width="250"></el-table-column>
      <el-table-column align="center" prop="viewCount" label="浏览数量" width="150"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/charpter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination :current-page.sync="page" :page-size="limit" :total="total"
                   style="padding: 30px 0;text-align: center;" layout="total,prev,pager,next,jumper"
                   @current-change="getList">
    </el-pagination>
  </div>
</template>
<script>
  //引入调用course.js文件
  import course from "@/api/edu/course";
  export default {
    //写核心代码
    /*data: {
    },*/
    data() {//定义变量和初始值
      return {
        list: null,//查询之后接口返回的集合
        page: 1,//当前页数
        limit: 10,//每页记录数
        total: 0,
        status: ["Draft","Normal"],
        courseQuery: {//条件封装对象
          title: '',
          status: ''
        }
      }
    },
    created() {//页面渲染之前执行，一般调用methods定义的方法
      this.getList()
    },
    methods: {//创建具体的方法，调用course.js定义
      //课程列表的方法
      getList(page = 1) {
        this.page = page;
        course.pageCourseCondition(this.page,this.limit,this.courseQuery)
          .then(response => {//请求成功
            //response接口返回的数据
            this.list = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {//请求失败
            console.log(error)
          })
      },
      resetData(){//清空的方法
        //表单输入项数据清空
        this.courseQuery = {}
        //查询所有讲师
        this.getList();
      },
      //删除课程
      removeDataById(id) {
        this.$confirm('此操作将永久删除讲师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          course.deleteCourseById(id)
            .then(response => {//删除成功
              //提示信息
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              //返回到列表页面
              this.getList();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style scoped>
</style>
