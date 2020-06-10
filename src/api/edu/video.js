import request from '@/utils/request'

export default {
  //添加章节
  addVideo(video){
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },
  //根据id查询章节
  getVideo(videoId){
    return request({
      url: `/eduservice/video/getVideo/${videoId}`,
      method: 'get',
    })
  },
  //修改课时
  updateVideo(video){
    return request({
      url: `/eduservice/video/updateVideo`,
      method: 'post',
      data: video
    })
  },
  //删除课时
  deleteVideo(videoId){
   return request({
     url: `/eduservice/video/deleteVideo/${videoId}`,
     method: 'delete',
   })
  },
  //删除课时视频
  removeAlyVideo(id){
    return request({
      url: `/eduvod/video/removeAlyVideo/${id}`,
      method: 'delete',
    })
}
}
