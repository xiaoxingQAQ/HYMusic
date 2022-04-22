import hyRequest from './index'

const api = {
  songDetail: '/song/detail', // 歌曲详情
  lyric: '/lyric', // 歌词
}

/**
 * 获取歌曲详情
 * @param {number} ids 歌曲id
 * @returns 
 */
export function getSongDetail(ids) {
  return hyRequest.get(api.songDetail, {
    ids
  })
}

/**
 * 获取歌词
 * @param {number} id 歌曲id 
 */
export function getSongLyric(id) {
  return hyRequest.get(api.lyric, {
    id
  })
}