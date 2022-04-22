// pages/home-video/index.js
import { getTopMv } from '../../service/api_video.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 自动下拉刷新
    wx.startPullDownRefresh()
  },

  // 封装网络请求的方法
  /* 获取MV */
  async getTopMvData(offset) {
    // 判断是否可以请求
    if (!this.data.hasMore) return

    // 展示加载动画
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: 'Loading...',
      mask: true,
    });

    // 请求数据
    const res = await getTopMv(offset);
    let newData = this.data.topMvs;
    if (offset === 0) {
      newData = res.data;
    } else {
      newData = newData.concat(res.data);
    }

    // 设置数据
    this.setData({ topMvs: newData });
    this.setData({ hasMore: res.hasMore })

    // 关闭加载动画
    wx.hideNavigationBarLoading()
    wx.hideLoading()
    if (offset === 0) wx.stopPullDownRefresh();
  },

  // 封装事件处理的方法
  /* 跳转视频详情页 */
  handleVideoItemClick(e) {
    // 获取视频id
    const id = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: `/packageDetail/pages/detail-video/index?id=${id}`,
    })
  },

  // 其他生命周期函数
  /**
   * 下拉刷新生命周期函数
   */
  onPullDownRefresh() {
    this.getTopMvData(0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  async onReachBottom() {
    this.getTopMvData(this.data.topMvs.length);
  },

  /**
   * 刷新操作
   */
  onRefresh() {

  },
})