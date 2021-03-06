import request from '@/utils/request'
import charpter from "@/views/edu/course/charpter";

export default {
  //根据课程id获取章节和小节的数据列表
  getAllChapterVideo(courseId){
    return request({
      url: `/eduservice/charpter/getCharpterVideo/${courseId}`,
      method: 'get'
    })
  },
  //添加章节
  addChapter(charpter){
    return request({
      url: `/eduservice/charpter/addCharpter`,
      method: 'post',
      data: charpter
    })
  },
  //根据id查询章节
  getChapter(chapterId){
    return request({
      url: `/eduservice/charpter/getCharpterInfo/${chapterId}`,
      method: 'get',
    })
  },
  //修改章节
  updateChapter(charpter){
    return request({
      url: `/eduservice/charpter/updateCharpter`,
      method: 'post',
      data: charpter
    })
  },
  //删除章节
  deleteChapter(charpterId){
   return request({
     url: `/eduservice/charpter/deleteCharpter/${charpterId}`,
     method: 'delete',
   })
  }
}
