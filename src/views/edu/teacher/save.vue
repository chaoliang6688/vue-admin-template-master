<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
                      数据类型一定要和取出的json中的一致，否则没法回填
                      因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!--头像缩略图-->
        <pan-thumb :image="teacher.avatar"/>
        <!--文件上传按钮-->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
       <!-- v-show:是否显示上传组件
        :key:类似于id，如果一个页面多个图片上传控件，可以做区分
        :url:后台上传的url地址
        @close:关闭组件
        @crop-upload-success:上传成功后的回调
         field:类似于定义格式
        -->
        <image-cropper v-show="imagecropperShow" :width="300" :height="300" :key="imagecropperKey"
          :url="BASE_API + '/eduoss/fileoss'" field="file" @close="close" @crop-upload-success="cropSuccess">
        </image-cropper>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import teacherApi from "@/api/edu/teacher";
  import ImageCropper from '@/components/ImageCropper';
  import PanThumb from '@/components/PanThumb';
  const defaultForm = {
    name: '',
    sort: 0,
    level: 1,
    career: '',
    intro: '',
    avatar: 'https://edu-lc.oss-cn-chengdu.aliyuncs.com/2020/05/22/b7821b853d8b4af3b4a0fe7ab00227040206.jpg'
  }
  export default {
    components: {ImageCropper,PanThumb},
    data() {
      return {
        teacher: {
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: ''
        },
        //上传弹框组件是否显示
        imagecropperShow: false,
        //上传组件key值
        imagecropperKey: 0,
        //获取dev.env.js里面的地址
        BASE_API: process.env.BASE_API,
        saveBtnDisabled: false //保存按钮是否禁用
      }
    },
    watch: {//监听
      $route(to,from) {
        this.init();
      }
    },
    created() {
      this.init()
      /*组件渲染时，两个组件出现数据重用，先点击编辑再点击添加，数据重用了，使用init处理该bug*/
      /*//判断路径有id值，做修改
      if (this.$route.params && this.$route.params.id){
        //从路径中获取id
        const id = this.$route.params.id
        //调用根据id查询方法
        this.getInfo(id);
      }else{
        this.teacher = {}
      }*/
    },
    methods: {
      //关闭上传弹框的方法
      close() {
         this.imagecropperShow = false;
         //上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
         this.imagecropperKey = this.imagecropperKey + 1;
      },
      //上传成功方法
      cropSuccess(data) {
        this.imagecropperShow = false;
        //上传之后返回图片地址
        this.teacher.avatar = data.url;//response.data.url
        //上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1;
      },
      //根据讲师id查询的方法
      getInfo(id) {
        teacherApi.getTeacherInfo(id)
          .then(response => {
            this.teacher = response.data.teacher;
          })
      },
      saveOrUpdate() {
        //
        //判断是修改还是添加
        //根据teacher是否有id
        if(!this.teacher.id){
          //添加
          this.saveTeacher();
        }else{
          //修改
          this.updateTeacher();
        }
      },
      //修改讲师方法
      updateTeacher() {
        teacherApi.updateTeacherInfo(this.teacher)
          .then(response => {
            return this.$message({
              type: 'success',
              message: '修改成功'
          })
          }).then(response => {
          //回到列表  路由跳转
          this.$router.push({path: '/edu/table'})
        }).catch(response => {
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        });
      },
      //添加讲师的方法
      saveTeacher() {
        teacherApi.addTeacher(this.teacher)
          .then(response => {//添加成功
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            //回到列表  路由跳转
            this.$router.push({path: '/edu/table'})
          })
      },
      init() {
        if (this.$route.params && this.$route.params.id){
          const id = this.$route.params.id
          this.getInfo(id)
        }else{
          this.teacher = {...defaultForm};
        }
      }
    }
  }
</script>
<style scoped>
</style>
