// pages/detail-search/index.js
// 接口
import { getSearchHot, getSearchSuggest, getSearchResult } from '../../../service/api_search';
// 工具函数
import debounce from '../../../utils/debounce';
import stringToNodes from '../../../utils/string-to-nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest, 300);

Page({
  data: {
    hotKeywords: [], // 热门搜索的关键字
    suggestSongs: [], // 建议搜索
    suggestSongsNodes: [], // 建议搜多的节点  
    resultSongs: [], // 歌曲搜索结果
    searchValue: '', // 搜索的关键字
  },

  onLoad(options) {
    // 获取页面数据
    this.getPageData()
  },
  // 网络请求
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots });
    })
  },

  // 事件处理
  handleSearchChange(event) {
    const searchValue = event.detail.trim();
    // 保留关键字
    this.setData({ searchValue });

    // 判断关键字为空的处理逻辑
    if (!searchValue) {
      // 取消防抖请求
      debounceGetSearchSuggest.cancel()
      this.setData({ suggestSongs: [] });
      this.setData({ resultSongs: [] });
      return
    }
    // 请求搜索建议
    debounceGetSearchSuggest(searchValue).then(res => {
      if (res.code !== 200) return
      // 获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch;
      this.setData({ suggestSongs });
      // 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword);
      const suggestSongsNodes = [];
      for (let keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },

  handleSearchAction() {
    const searchValue = this.data.searchValue;
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },

  handleKeywordItemClick(event) {
    // 获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword;
    // 将关键字设置到searchValue
    this.setData({ searchValue: keyword });
    this.handleSearchAction()
  },
})