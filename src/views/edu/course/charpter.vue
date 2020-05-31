<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form label-width="120px">
      <el-button type="text" @click="openChapterDialog">{{contextTitle}}</el-button>
      <!--添加和修改章节表单-->
      <el-dialog :visible.sync="dialogCharpterFormVisible" title="添加章节">
        <el-form :model="charpter" label-width="120px">
          <el-form-item label="章节标题">
            <el-input v-model="charpter.title"></el-input>
          </el-form-item>
          <el-form-item label="章节排序">
            <el-input-number v-model="charpter.sort" :min="0" controls-position="right"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCharpterFormVisible = false">取消</el-button>
          <el-button type="primary" @click="saveOrUpdate">确定</el-button>
        </div>
      </el-dialog>
      <!--章节-->
      <ul class="chapterList">
        <li v-for="chapter in chapterVideoList" :key="chapter.id">
          <p>
            {{chapter.title}}
            <span class="acts">
              <el-button type="text">添加课时</el-button>
              <el-button style="" type="text" @click="openEditCharpter(chapter.id)">编辑</el-button>
              <el-button type="text">删除</el-button>
            </span>
          </p>
          <!--视频-->
          <ul class="chapterList videoList">
            <li v-for="video in chapter.children" :key="video.id">
              <p>
                {{video.title}}
                <span class="acts">
                  <el-button type="text">编辑</el-button>
                  <el-button type="text">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import chapter from "@/api/edu/chapter";
    export default {
      data() {
        return{
          saveBtnDisabled: false,
          chapterVideoList: [],
          courseId: '',//课程ID
          dialogCharpterFormVisible: false,//章节弹框
          contextTitle: '',
          charpter: { //封装章节数据
            title: '',
            sort: 0,

          }
        }
      },
      created() {
        //获取路由的id值
        if(this.$route.params && this.$route.params.id){
          this.courseId = this.$route.params.id;
          //根据课程id查询章节和小节，页面渲染前加载
          this.getChapterVideo();
        }
      },
      methods: {
        //修改章节弹框
        openEidtCharpter(chapterId){
          this.dialogCharpterFormVisible = true;
          chapter.getChapter(chapterId)
            .then(response => {
              this.charpter = response.data.chapter;
            })
        },
        //弹框添加章节页面
        openChapterDialog(){
          //弹框
          this.dialogCharpterFormVisible = true;
          //表单数据清空
          this.charpter.title = '';
          this.charpter.sort = 0;
        },
        //添加章节
        addCharpter() {
          //设置课程id
          this.charpter.courseId = this.courseId;
          this.contextTitle = "添加课程";
          chapter.addChapter(this.charpter)
            .then(response => {
              //关闭弹框
              this.dialogCharpterFormVisible = false;
              //提示
              this.$message({
                type: 'success',
                message: '添加章节成功'
              })
              //刷新页面
              this.getChapterVideo();
            })
        },
        //修改章节
        updateCharpter(){
          this.contextTitle = "修改课程";
          chapter.updateCharpter(this.charpter)
            .then(response => {
              //关闭弹框
              this.dialogCharpterFormVisible = false;
              //提示
              this.$message({
                type: 'success',
                message: '修改章节成功'
              })
              //刷新页面
              this.getChapterVideo();
            })
        },
        saveOrUpdate() {
          if (!this.charpter.id){
            this.addCharpter();
          }else{
            this.updateCharpter();
          }
        },
        //根据课程id查询章节和小节
        getChapterVideo() {
          chapter.getAllChapterVideo(this.courseId)
            .then(response => {
              this.chapterVideoList = response.data.allCharpterVideo;
            })
        },
        previous() {
          //跳转到上一步
          this.$router.push({path:'/course/info/'+this.courseId})
        },
        next() {
          //跳转到第三步
          this.$router.push({path:'/course/publish/'+this.courseId})
        }

      }

    }
</script>
<style scoped>
  .chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chapterList li{
    position: relative;
  }
  .chapterList p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chapterList .acts{
    float: right;
    font-size: 14px;
  }
  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
</style>
