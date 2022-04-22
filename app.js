// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from '/service/api_login';
import { TOKEN_KEY } from './constants/token-const';

App({
  onLaunch() {
    const info = wx.getSystemInfoSync();
    // 设置屏幕宽高
    this.globalData.screenWidth = info.screenWidth;
    this.globalData.screenHeight = info.screenHeight;
    this.globalData.statusBarHeight = info.statusBarHeight;
    const deviceRatio = this.globalData.screenHeight / this.globalData.screenWidth;
    this.globalData.deviceRatio = deviceRatio;

    // 让用户默认登录
    this.handleLogin()
  },

  async handleLogin() {
    const token = wx.getStorageSync(TOKEN_KEY);
    // 判断token有没有过期
    const checkResult = await checkToken(token);
    // 判断session是否过期
    const isSessionValid = await checkSession();

    if (!token || checkResult.errorCode || !isSessionValid) {
      this.loginAction()
    }
  },

  async loginAction() {
    // 1. 获取code
    const { code } = await getLoginCode();
    console.log('code: ', code);
    // 2.将code发送给服务器，获取token
    const { token } = await codeToToken(code);
    console.log('token: ', token);

    // 3.将token保存到本地
    wx.setStorageSync(TOKEN_KEY, token);
  },

  globalData: {
    // 屏幕宽度
    screenWidth: 0,
    // 屏幕高度
    screenHeight: 0,
    // 手机的状态栏高度
    statusBarHeight: 0,
    // 导航栏的高度
    navBarHeight: 44,
    // 设备宽高比
    deviceRatio: 0,
  }
})
