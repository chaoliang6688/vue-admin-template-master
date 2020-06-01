import request from '@/utils/request'

export default {
  //添加课程信息
  addCourseInfo(courseInfo){
    return request({
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  //查询所有讲师
  getTeacherList(courseInfo){
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get'
    })
  },
  //根据课程id查询课程基本信息
  getCourseInfo(courseId){
    return request({
      url: `/eduservice/course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfoVo){
    return request({
      url: `/eduservice/course/updateCourseInfo`,
      method: 'post',
      data: courseInfoVo
    })
  },
  //课程信息确认
  getPublishCourseInfo(courseId){
    return request({
      url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
      method: 'get',
    })
  },
  //课程最终发布
  publishCourse(courseId){
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: 'post',
    })
  },
  //查询所有的课程
  //课程全部信息查询
  getListCourse(){
    return request({
      url: `/eduservice/course/publishAll`,
      method: 'get'
    })
  },
  //删除课程
  deleteTeacherById(courseId){
    return request({
      url: `/eduservice/course/${courseId}`,
      method: 'delete'
    })
  }
}

