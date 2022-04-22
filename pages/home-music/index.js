// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from '../../store/index';

// 接口
import { getBanners, getSongMenu } from '../../service/api_music.js';

import queryRect from '../../utils/query-rect.js';
import throttle from '../../utils/throttle.js';

const throttleQueryRect = throttle(queryRect, 1000, { leading: true, trailing: true });

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0, // 轮播图高度
    banners: [], // 轮播图数据
    hotSongMenu: [], // 热门歌单
    recommendSongMenu: [], // 推荐歌单
    recommendedSongs: [], // 推荐歌曲
    rankings: { 0: {}, 2: {}, 3: {} }, // 排行榜

    currentSong: {}, // 当前歌曲
    isPlaying: false, // 是否在播放
    playAnimState: 'paused', // 封面动画是否播放
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面数据
    this.getPageData()

    // 从store获取数据
    this.setupPlayerStoreListener()
  },

  // ==================== 网络请求函数 ====================
  /* 获取页面数据 */
  getPageData() {
    // 获取轮播图数据
    getBanners().then(res => {
      this.setData({ banners: res.banners });
    })
    // 获取热门歌单数据
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists });
    })
    // 获取华语推荐歌单数据
    getSongMenu('华语').then(res => {
      this.setData({ recommendSongMenu: res.playlists });
    })
  },

  // ==================== 事件处理 ====================
  /* 跳转搜索页 */
  handleSearchClick() {
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },
  /* 监听轮播图图片加载完成 */
  handleSwiperImageLoaded() {
    // 获取轮播图图片高度
    throttleQueryRect('#swiper-image').then(res => {
      const swiperHeight = res[0].height;
      this.setData({ swiperHeight });
    })
  },

  /* 监听推荐歌曲更多的点击事件 */
  handleMoreClick() {
    this.navigateToDetailSongsPage('hotRanking')
  },
  /* 监听榜单选项的点击事件 */
  handleRankingItemClick(event) {
    const idx = event.currentTarget.dataset.idx;
    const rankingName = rankingMap[idx];
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage(rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`
    })
  },

  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState('playListSongs', this.data.recommendedSongs);
    playerStore.setState('playListIndex', index)
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },

  handlePlayBarClick() {
    wx.navigateTo({
      url: '/packagePlayer/pages/music-player/index?=' + this.data.currentSong.id
    })
  },


  // 页面卸载的生命周期函数
  onUnload() {
    // rankingStore.offState('newRanking', this.getNewRankingHandler);
  },

  setupPlayerStoreListener() {
    // 发起共享数据的请求
    rankingStore.dispatch('getRankingDataAction');

    // 从store中获取共享的数据
    rankingStore.onState('hotRanking', res => {
      if (!res.tracks) return;
      const recommendedSongs = res.tracks.slice(0, 6);
      this.setData({ recommendedSongs });
    })

    rankingStore.onState('newRanking', this.getRankingHandler(0));
    rankingStore.onState('originRanking', this.getRankingHandler(2));
    rankingStore.onState('upRanking', this.getRankingHandler(3));

    // 播放器的监听
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      if (currentSong) this.setData({ currentSong })
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? 'running' : 'paused'
        })
      }
    })
  },


  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return;
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3);
      const rankingObj = { name, coverImgUrl, songList, playCount }
      const newRankings = {...this.data.rankings, [idx]: rankingObj};
      this.setData({ rankings: newRankings });
    }
  },

})