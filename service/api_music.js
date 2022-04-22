import hyRequest from "./index";

const api = {
  banner: '/banner', // 获取轮播图数据
  topList: '/top/list', // 获取排行榜数据
  topPlayList: '/top/playlist', // 获取歌单数据
  playlistDetailDynamic: '/playlist/detail/dynamic',
  playlistHot: '/playlist/hot', // 获取热门歌单分类名称
}

/**
 * 获取轮播图数据
 * @returns {Promise} 
 */
export function getBanners() {
  return hyRequest.get(api.banner, {
    type: 2
  });
}

/**
 * 获取排行榜数据
 * @param {number} idx 0: 新歌, 1: 热门, 2: 原创, 3: 飙升
 * @returns {Promise} 
 */
export function getRankings(idx) {
  return hyRequest.get(api.topList, {
    idx
  });
}

/**
 * 获取歌单数据
 * @param {string} cat 分类
 * @param {number} limit 数量
 * @param {number} offset 偏移量
 * @returns {Promise}
 */
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return hyRequest.get(api.topPlayList, {
    cat,
    limit,
    offset
  });
}

/**
 * 获取歌单详情
 * @param {number} id // 歌单id 
 * @returns {Promise} 
 */
export function getSongMenuDetail(id) {
  return hyRequest.get(api.playlistDetailDynamic, {
    id
  });
}

/**
 * 获取热门歌单分类名称
 * @returns {Promise} 
 */
export function getSongListTags() {
  return hyRequest.get(api.playlistHot);
}