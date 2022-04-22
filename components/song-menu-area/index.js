// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '默认歌单'
    },
    songMenu: {
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 监听歌曲菜单item的点击 */
    handleMenuItemClick(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`,
      });
    },
    /* 监听热门歌单更多的点击事件 */
    handleMoreSongMenuClick(event) {
      const title = event.currentTarget.dataset.title;
      if (title === '热门歌单') {
        this.navigateToDetailSongMenuPage('全部');
      } else if (title === '推荐歌单') {
        this.navigateToDetailSongMenuPage('华语');
      }
    },
    /* 跳转到歌单详情页 */
    navigateToDetailSongMenuPage(category) {
      wx.navigateTo({
        url: `/packageDetail/pages/detail-songs/index?category=${category}&type=songList`
      })
    },
  }
})
