// 插件
import { HYEventStore } from 'hy-event-store';
// 接口
import { getSongDetail, getSongLyric } from '../service/api_player'
// 工具
import { parseLyric } from '../utils/parse-lyric'
// 播放器实例
// const audioContext = wx.createInnerAudioContext();
const audioContext = wx.getBackgroundAudioManager();

const playerStore = new HYEventStore({
  state: {
    // 是否已经关闭音乐
    isStopping: false,
    // 是否是第一次播放
    isFirstPlay: true,
    // 当前的歌曲id
    id: 0,
    // 当前的歌曲
    currentSong: {},
    // 歌曲持续时长
    durationTime: 0,
    // 歌词信息
    lyricInfos: [],

    // 当前播放时长
    currentTime: 0,
    // 当前歌词的索引
    currentLyricIndex: 0,
    // 当前歌词
    currentLyricText: '',

    // 是否在播放
    isPlaying: false,

    // 当前播放模式 0 循环播放、 1 单曲循环、 2 随机播放
    playModeIndex: 0,

    // 歌曲列表
    playListSongs: [],
    // 当前歌曲索引
    playListIndex: 0,
  },

  actions: {
    playMusicWithSongIdAction(context, { id, isRefresh = false }) {
      if (context.id == id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      };
      // 设置歌曲id
      context.id = id;

      // 0.修改播放状态
      context.isPlaying = true;
      // 清空歌曲信息
      context.currentSong = {};
      context.durationTime = 0;
      context.lyricInfos = [];
      context.currentTime = 0;
      context.currentLyricIndex = 0;
      context.currentLyricText = '';

      // 1.请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        context.currentSong = res.songs[0];
        context.durationTime = res.songs[0].dt;
        audioContext.title = res.songs[0].name;
      })

      // 请求歌词信息
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric;
        const lyricInfos = parseLyric(lyricString)
        context.lyricInfos = lyricInfos;
      })

      // 2.使用 audioContext 播放歌曲
      audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;
      audioContext.title = id;

      // 3.监听audioContext的一些事件
      if (context.isFirstPlay) {
        this.dispatch('setupAudioContextListenerAction', context);
        context.isFirstPlay = false;
      }
    },

    setupAudioContextListenerAction(context) {
      // 监听音频进入可以播放状态
      audioContext.onCanplay(() => {
        audioContext.play()
      })

      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        let currentTime = audioContext.currentTime * 1000;
        // 2.根据当前时间修改currentTime
        context.currentTime = currentTime;

        const lyricInfos = context.lyricInfos;
        if (!lyricInfos.length) return;
        // 3.根据当前时间去查找播放的歌词
        let i = 0;
        for (; i < lyricInfos.length; i++) {
          const lyricInfo = lyricInfos[i];
          if (currentTime < lyricInfo.time) {
            break;
          }
        }

        // 设置当前歌词的索引和内容
        const currentLyricIndex = i - 1;
        if (context.currentLyricIndex !== currentLyricIndex) {
          const currentLyricInfo = lyricInfos[currentLyricIndex];
          context.currentLyricText = currentLyricInfo.text;
          context.currentLyricIndex = currentLyricIndex;
        }
      })

      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      // 监听音乐播放
      audioContext.onPlay(() => {
        context.isPlaying = true;
      })

      // 监听音乐暂停
      audioContext.onPause(() => {
        context.isPlaying = false;
      })

      // 监听背景音乐的关闭
      audioContext.onStop(() => {
        context.isPlaying = false;
        context.isStopping = true;
      })
    },
    // 改变播放状态
    changeMusicPlayStatusAction(context, isPlaying = true) {
      context.isPlaying = isPlaying;
      if (context.isPlaying && context.isStopping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${context.id}.mp3`;
        audioContext.autoplay = true;
        audioContext.title = context.currentSong.name;
        audioContext.startTime = context.currentTime / 1000;
        context.isStopping = false;
      }
      context.isPlaying ? audioContext.play() : audioContext.pause();
    },

    // 下一曲/上一曲
    changeNewMusicAction(context, isNext = true) {
      // 获取当前歌曲索引
      let index = context.playListIndex;

      // 根据不同的播放模式获取下一首歌曲的索引
      switch (context.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1;
          if (index === -1) index = context.playListSongs.length - 1;
          if (index === context.playListSongs.length) index = 0;
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * context.playListSongs.length)
          break;
      }

      // 获取当前歌曲
      let currentSong = context.playListSongs[index];
      if (!currentSong) {
        currentSong = context.currentSong;
      } else {
        // 记录最新的歌曲索引
        context.playListIndex = index;
      }

      // 播放新的歌曲
      this.dispatch('playMusicWithSongIdAction', { id: currentSong.id, isRefresh: true })
    },
  }
});

export {
  audioContext,
  playerStore
}