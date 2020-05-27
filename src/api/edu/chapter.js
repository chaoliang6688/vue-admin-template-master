import request from '@/utils/request'

export default {
  //根据课程id获取章节和小节的数据列表
  getAllChapterVideo(courseId){
    return request({
      url: `/eduservice/charpter/getCharpterVideo/${courseId}`,
      method: 'get'
    })
  }
}
