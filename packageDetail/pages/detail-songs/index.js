// pages/detail-songs/index.js
import { rankingStore, playerStore } from '../../../store/index'
// 接口
import { getSongMenuDetail, getSongMenu, getSongListTags } from '../../../service/api_music'
Page({
  data: {
    type: null, // 类型
    ranking: null, // 排行名称
    songInfo: {}, // 排行数据
    songList: [], // 歌单数据
  },

  onLoad(options) {
    const type = options.type;
    this.setData({ type })
    if (type === 'menu') {
      const id = options.id;
      // 发送请求
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    } else if (type === 'rank') {
      const ranking = options.ranking;
      this.setData({ ranking })
      // 获取数据
      rankingStore.onState(ranking, this.getRankingDataHandler)
    } else if (type === 'songList') {
      this.goSongDetailPage(options)
    }
  },

  // ==================== 事件处理函数 ====================
  /* 跳转至歌单详情页 */
  goSongDetailPage(options) {
    const category = options.category;
    // 发送请求
    if (category === '全部') {
      getSongListTags().then(res => {
        const songListTags = [];
        const songList = [];
        res.tags.forEach(item => {
          const tag = item.name;
          songListTags.push(tag)
        })
        songListTags.forEach(item => {
          getSongMenu(item).then(res => {
            songListTags.forEach((item, index) => {
              if (res.cat === item) songList[index] = res;
            })
            this.setData({ songList })
          })
        })
      })
    } else if (category === '华语') {
      getSongMenu('华语').then(res => {
        this.setData({ songList: [res] })
      })
    }
  },

  handleMenuItemClick(event) {
    const item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?id=${item.id}&type=menu`
    })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState('playListSongs', this.data.songInfo.tracks);
    playerStore.setState('playListIndex', index)
  },

  onUnload() {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler);
    }
  },

  // 回调函数
  getRankingDataHandler(res) {
    this.setData({ songInfo: res })
  },

})