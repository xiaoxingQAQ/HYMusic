import hyRequest from "./index";

const api = {
  topMv: '/top/mv', // 获取热门MV
  MVUrl: '/mv/url', // 获取MV播放地址
  MVDetail: '/mv/detail', // 获取MV详情
  relatedAllVideo: '/related/allvideo', // 获取相关视频
}

/**
 * 获取热门MV
 * @param {number} offset 
 * @param {number} limit 
 * @returns {Promise} 
 */
export function getTopMv(offset, limit = 10) {
  return hyRequest.get(api.topMv, {
    offset,
    limit,
  });
}

/**
 * 获取MV播放地址
 * @param {number} id MV的id
 * @returns {Promise} 
 */
export function getMVUrl(id) {
  return hyRequest.get(api.MVUrl, {
    id
  })
}

/**
 * 获取MV详情
 * @param {number} mvid 
 * @returns {Promise} 
 */
export function getMvDetail(mvid) {
  return hyRequest.get(api.MVDetail, {
    mvid
  })  
}

/**
 * 获取相关视频
 * @param {number} id 
 * @returns {Promise} 
 */
export function getRelatedVideo(id) {
  return hyRequest.get(api.relatedAllVideo, {
    id
  })  
}