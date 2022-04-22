// pages/detail-video/index.js
import {getMVUrl, getMvDetail,  getRelatedVideo } from '../../../service/api_video.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrlInfo: {}, // MV播放地址
    mvDetail: {}, // MV详情
    relatedVideo: {}, // MV相关视频
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取传入的id
    const id = options.id;
    // 获取页面数据
    this.getPageData(id);
  },

  // 网络请求的方法
  /* 获取页面数据 */
  getPageData(id) {
    // 请求播放地址
    getMVUrl(id).then(res => {
      this.setData({ mvUrlInfo: res.data })
    })
    // 请求视频信息
    getMvDetail(id).then(res => {
      this.setData({ mvDetail: res.data })
    })
    // 请求相关视频
    getRelatedVideo(id).then(res => {
      this.setData({ relatedVideo: res.data })
    })
  },

  // 其他生命周期函数
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})