<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form label-width="120px">
      <el-button type="text" @click="openChapterDialog">添加章节</el-button>
      <!--添加和修改章节表单-->
      <el-dialog :visible.sync="dialogCharpterFormVisible" :title="contextTitle">
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
      <!--添加和修改小节的弹框-->
      <el-dialog :visible.sync="dialogVideoFormVisible" :title="contextTitle">
        <el-form :model="video" label-width="120px">
          <el-form-item label="课时标题">
            <el-input v-model="video.title"/>
          </el-form-item>
          <el-form-item label="课时排序">
            <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
          </el-form-item>
          <el-form-item label="是否免费">
            <el-radio-group v-model="video.free">
              <el-radio :label="true">免费</el-radio>
              <el-radio :label="false">默认</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传视频">
            <!---->
          </el-form-item>
        </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取消</el-button>
            <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确定</el-button>
          </div>
      </el-dialog>
      <!--章节-->
      <ul class="chapterList">
        <li v-for="chapter in chapterVideoList" :key="chapter.id">
          <p>
            {{chapter.title}}
            <span class="acts">
              <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
              <el-button style="" type="text" @click="openEidtCharpter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="removeCharpter(chapter.id)">删除</el-button>
            </span>
          </p>
          <!--视频-->
          <ul class="chapterList videoList">
            <li v-for="video in chapter.children" :key="video.id">
              <p>
                {{video.title}}
                <span class="acts">
                  <el-button type="text" @click="openEidtVideo(video.id)">编辑</el-button>
                  <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
    </el-form>
      <div class="contex">
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </div>
  </div>
</template>
<script>
  import chapter from "@/api/edu/chapter";
  import video from "@/api/edu/video";
  const baseVideo = {
      title: '',
      sort: 0,
      free: 0,
      videoSourceId: ''
  }
    export default {
      data() {
        return{
          saveBtnDisabled: false,
          saveVideoBtnDisabled: false,
          chapterVideoList: [],
          courseId: '',//课程ID
          dialogCharpterFormVisible: false,//章节弹框
          dialogVideoFormVisible: false,//小节弹框
          contextTitle: '',
          video: baseVideo,
          charpter: { //封装章节数据
            title: '',
            sort: 0,
          },
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
        //删除小节
        removeVideo(videoId){
          this.$confirm('此操作将永久删除该课时记录，是否继续？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {//确定删除
            video.deleteVideo(videoId)
              .then(response => {//删除成功
                //提示信息
                this.$message({
                  type: 'success',
                  message: '删除课时成功'
                });
                //返回界面
                this.getChapterVideo();
              })
          })
        },
        //添加课时弹框的方法
        openVideo(chapterId){
          //弹框
          this.dialogVideoFormVisible = true;
          //清空上次添加的信息
          this.video = {...baseVideo}
          //设置章节id
          this.video.chapterId = chapterId;
          //增加描述信息
          this.contextTitle = "添加课时";
        },
        openEidtVideo(videoId){
          this.dialogVideoFormVisible = true;
          this.contextTitle = "修改课时";
          video.getVideo(videoId)
            .then(response => {
              this.video = response.data.video;
            })
        },
        //添加课时
        addVideo(){
          //设置课程id
          this.video.courseId = this.courseId;
          video.addVideo(this.video)
            .then(response => {
                //关闭弹框
                this.dialogVideoFormVisible = false;
                //提示
                this.$message({
                  type: 'success',
                  message: '添加课时成功'
                })
                //刷新页面
                this.getChapterVideo();
              })
        },
        //修改课时
        updateVideo(){
          video.updateVideo(this.video)
            .then(response =>{
              //关闭弹框
              this.dialogVideoFormVisible = false;
              //提示
              this.$message({
                type: 'success',
                message: '修改课时成功'
              })
              //刷新页面
              this.getChapterVideo();
            })
        },
        saveOrUpdateVideo(){
          if (!this.video.id){
            this.addVideo();
          }else{
            this.updateVideo();
          }
        },
        //删除章节
        removeCharpter(chapterId){
          this.$confirm('此操作将永久删除该章节记录，是否继续？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {//确定删除
            chapter.deleteChapter(chapterId)
              .then(response => {//删除成功
                //提示信息
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                //返回界面
                this.getChapterVideo();
              })
          })
        },
        //修改课程弹框
        openEidtCharpter(chapterId){
          this.dialogCharpterFormVisible = true;
          this.contextTitle = "修改课程";
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
          this.contextTitle = "添加章节";
        },
        //添加章节
        addCharpter() {
          //设置课程id
          this.charpter.courseId = this.courseId;
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
          chapter.updateChapter(this.charpter)
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
  .contex {
    float: right;
    margin-right: 20px;
  }
</style>
