// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'

const playModeNames = ['order', 'repeat', 'random'];

Page({

  data: {
    // 显示音乐界面的歌词
    isMusicLyric: true,
    // 当前的歌曲
    currentSong: {},
    // 歌曲持续时长
    durationTime: 0,

    // 当前播放时长
    currentTime: 0,
    // 当前歌词
    currentLyricText: '',
    // 当前歌词的索引
    currentLyricIndex: 0,

    // 是否在播放
    isPlaying: false,
    // 播放/暂停的图标
    playingName: 'pause',

    // 播放模式
    playModeIndex: 0,
    // 播放模式的图标名称
    playModeName: 'order',

    // 当前页面
    currentPage: 0,
    // 内容区的高度
    contentHeight: 0,
    // 进度条的值
    sliderValue: 0,
    // 正在改变进度条的值
    isSliderChanging: false,
    // 歌词信息
    lyricInfos: null,
    // 歌词滚动距离
    lyricScrollTop: 0,

  },

  onLoad(options) {
    // 1.过去传入的id
    const id = options.id;

    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener();

    // 3.动态计算内容区的高度
    const globalData = getApp().globalData;
    const screenHeight = globalData.screenHeight;
    const statusBarHeight = globalData.statusBarHeight;
    const navBarHeight = globalData.navBarHeight;
    const deviceRatio = globalData.deviceRatio;

    const contentHeight = screenHeight - statusBarHeight - navBarHeight;
    this.setData({ contentHeight, isMusicLyric: deviceRatio >= 2 })
  },

  // ==================== 事件处理 ====================
  handleSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },


  handleSliderChange(event) {
    // 1.获取slider变化的值W
    const value = event.detail.value;
    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * (value / 100);
    // 3.设置audioContext播放currentTime位置的音乐 
    // audioContext.pause()
    audioContext.seek(currentTime / 1000);
    
    // playerStore.setState('currentTime', currentTime);

    // 4.记录最新的sliderValue
    this.setData({ isSliderChanging: false });
  },

  handleSliderChanging(event) {
    const value = event.detail.value;
    const currentTime = this.data.durationTime * (value / 100);
    this.setData({ isSliderChanging: true, currentTime });
  },

  handleBackClick() {
    wx.navigateBack()
  },

  handleModeBtnClick() {
    // 计算最新的 playModeIndex
    let playModeIndex = this.data.playModeIndex + 1;
    if (playModeIndex === 3) playModeIndex = 0;
    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex', playModeIndex);
  },

  handlePlayBtnClick() {
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying);
  },

  // 上一曲
  handlePrevBtnClick() {
    playerStore.dispatch('changeNewMusicAction', false)
  },

  // 下一曲
  handleNextBtnClick() {
    playerStore.dispatch('changeNewMusicAction')
  },

  // ==================== 数据监听 ====================
  setupPlayerStoreListener() {
    // 监听currentSong/durationTime/lyricInfos
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], ({
      currentSong, durationTime, lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong });
      if (durationTime !== undefined) this.setData({ durationTime });
      if (lyricInfos) this.setData({ lyricInfos });
    });

    // 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime, currentLyricIndex, currentLyricText
    }) => {
      // 事件变化
      if (currentTime !== undefined && !this.data.isSliderChanging) {
        // 保留两位小数
        const sliderValue = currentTime / this.data.durationTime * 100;
        this.setData({ currentTime, sliderValue });
      }

      // 歌词变化
      if (currentLyricIndex) this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 30 });

      if (currentLyricText) this.setData({ currentLyricText })

    })

    // 监听播放模式相关的数据
    playerStore.onStates(['playModeIndex', 'isPlaying'], ({
      playModeIndex, isPlaying
    }) => {
      if (playModeIndex !== undefined) this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] });

      if (isPlaying !== undefined) {
        this.setData({
          isPlaying,
          playingName: isPlaying ? 'pause' : 'resume'
        })
      }
    })
  },

  onUnLoad() {
  },

})