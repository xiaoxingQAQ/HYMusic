import { hyLoginRequest } from './index';

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => { 
        reject(err);
      }
    });
  })
}

export function codeToToken(code) {
  return hyLoginRequest.post('/login', {
    code
  })
}

export function checkToken(token) {
  return hyLoginRequest.post('/auth', {}, true)
}

export function checkSession() {
  return new Promise(resolve => {
    wx.checkSession({
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      }
    });
  })
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}