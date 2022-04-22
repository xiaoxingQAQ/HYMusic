import { HYEventStore } from 'hy-event-store';
// 接口
import { getRankings } from '../service/api_music';

const rankingMap = { 0: 'newRanking', 1: 'hotRanking', 2: 'originRanking', 3: 'upRanking' };

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0 新歌
    hotRanking: {}, // 1 热门
    originRanking: {}, // 2 原创
    upRanking: {}, // 3 飙升
  },
  actions: {
    getRankingDataAction(context) {
      for (let i = 0; i < 4; i++) {
        getRankings(i).then(res => {
          const rankingName = rankingMap[i];
          context[rankingName] = res.playlist;
        })
      }
    }
  }
});

export {
  rankingStore,
  rankingMap
};