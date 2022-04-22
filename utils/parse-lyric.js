const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
/**
 * 解析歌词
 * @param {string} lyricString 歌词字符串
 * @returns 
 */
export function parseLyric(lyricString) {
  const lyricInfos = [];
  // 去掉换行符
  const lyricStrings = lyricString.split('\n');
  lyricStrings.forEach(item => {
    const timeResult = timeRegExp.exec(item);
    if (timeResult) {
      // 获取时间
      const minute = timeResult[1] * 60 * 1000;
      const second = timeResult[2] * 1000;
      const millisecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1;
      const time = minute + second + millisecond
  
      // 获取歌词文本
      const text = item.replace(timeRegExp, '');
      lyricInfos.push({ time, text });
    }
  })
  return lyricInfos
}















