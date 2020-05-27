<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">返回修改</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">发布课程</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
    export default {
      data() {
        return{
          saveBtnDisabled: false
        }
      },
      created() {
      },
      methods: {
        previous() {
          //跳转到上一步
          this.$router.push({path:'/course/charpter/1'})
        },
        next() {
          //跳转到第三步
          this.$router.push({path:'/course/list'})
        }
      }
    }
</script>
<style scoped>
</style>
