// components/navigation-bar/index.js
const globalData = getApp().globalData;

Component({
  options: {
    multipleSlots: true
  },

  properties: {
    title: {
      type: String,
      value: '默认标题'
    },
  },
  
  data: {
    // 状态栏的高度
    statusBarHeight: globalData.statusBarHeight,
    navBarHeight: globalData.navBarHeight
  },

  lifetimes: {
    ready() {

    },
  },

  methods: {
    handleLeftClick() {
      this.triggerEvent('click')
    },
  }
})
