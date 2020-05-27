<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模板说明</el-tag>
        <el-tag>
          <i class="el-icon-download"></i>
          <a :href="OSS_PATH + '/micosoft/excel/templet.xlsx'">点击下载模板</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择excel">
        <el-upload
          ref="upload"
          :action="BASE_API + '/edu/subject/save'"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          name="file"
          accept="application/vnd.ms-excel"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{fileUploadBtnText}}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    export default {
      data() {
        return{
          BASE_API: process.env.BASE_API, // 接口API地址
          OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
          fileUploadBtnText: '上传到服务器', // 按钮文字
          importBtnDisabled: false, // 按钮是否禁用,
          loading: false
        }
      },
      created() {
      },
      methods: {
        //点击按钮上传文件到接口里面
        submitUpload(){
          this.fileUploadBtnText = "正在上传";
          this.importBtnDisabled = true;
          this.loading = true;
          //js:document.getElementById("upload").submit()
          this.$refs.upload.submit()
        },
        //上传成功
        fileUploadSuccess(response) {
          //上传成功
          this.loading = false;
          this.$message({
            type: 'success',
            message: '添加课程分类成功'
          })
          //跳转到课程分类列表
          this.$router.push({path:'/subject/list'})
        },
        //上传失败
        fileUploadError(response){
          this.loading = false;
          this.$message({
            type: 'error',
            message: '添加课程失败'
          })
        }
      }
    }
</script>
<style scoped>
</style>
