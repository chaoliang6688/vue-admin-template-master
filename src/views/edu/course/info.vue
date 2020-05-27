<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="示例:机器语言学习项目课程: 从基础到搭建项目视频课程。专业名称注意大小写"></el-input>
      </el-form-item>
      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" placeholder="请选择" @change="subjectLevelOneChange">
          <el-option v-for="subject in subjectOneList" :key="subject.id" :label="subject.title" :value="subject.id" ></el-option>
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option v-for="subject in subjectTwoList" :key="subject.id" :label="subject.title" :value="subject.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name" :value="teacher.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"></el-input-number>
      </el-form-item>
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description" :height="300"></tinymce>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :action="BASE_API+'/eduoss/fileoss'" class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import course from '@/api/edu/course';
  import subject from "@/api/edu/subject";
  import Tinymce from '@/components/Tinymce';
  const defaultForm = {
    title: '',
    subjectId: '',//二级分类ID
    subjectParentId: '',//一级分类ID
    teacherId: '',
    lessonNum: 0,
    description: '',
    cover: '/static/0206.jpg',
    price: 0
  }
    export default {
      components: {Tinymce},
      data() {
        return{
          courseInfo: defaultForm,
          teacherList: [],
          subjectOneList: [],//一级分类
          subjectTwoList: [],//二级分类
          saveBtnDisabled: false, //保存按钮是否禁用
          BASE_API: process.env.BASE_API //接口API地址
        }
      },
      created() {
        //初始化所有讲师
        this.getTeacherList();
        //初始化一级分类
        this.getOneSubject();
      },
      methods: {
        //上传封面成功调用的方法
        handleAvatarSuccess(res,file){
          this.courseInfo.cover = res.data.url;
        },
        //上传之前调用的方法
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size/1024/1024 < 2;
          if (!isJPG){
            this.$message.error("上传封面图片只能是JPEG格式");
          }
          if (!isLt2M){
            this.$message.error('上传头像图片不能超过2MB');
          }
          return isJPG && isLt2M;

        },
        //点击某一个一级分类，触发一个change事件，显示对应二级分类
        subjectLevelOneChange(value) {
          //value就是一级分类id值，这个是框架实现，如果原始方法是传入this.value
          for (let i = 0; i < this.subjectOneList.length; i++){
            if (this.subjectOneList[i].id === value){
              this.subjectTwoList = this.subjectOneList[i].children;
              //把二级分类id清空
              this.courseInfo.subjectId = "";
            }
          }
        },
        //查询所有得一级分类
        getOneSubject() {
          subject.getSubjectList()
            .then(response => {
              this.subjectOneList = response.data.list;
            })
        },
        //查询所有讲师
        getTeacherList() {
          course.getTeacherList()
            .then(response => {
              this.teacherList = response.data.items
            })
        },
        saveOrUpdate() {
          course.addCourseInfo(this.courseInfo)
            .then(response => {
              //提示
              this.$message({
                type: 'success',
                message: '添加课程信息成功'
              });
              //跳转到第二步
              this.$router.push({path:'/course/charpter/'+response.data.courseId})
            })
        }
      }
    }
</script>
<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
