import hyRequest from "./index";

const api = {
  searchHot: '/search/hot', // 热门搜索的关键字
  searchSuggest: '/search/suggest', // 搜索
  search: '/search', // 搜索
}

/**
 * 获取热门搜索的关键字
 * @returns {Promise}
 */
export function getSearchHot() {
  return hyRequest.get(api.searchHot);
}

export function getSearchSuggest(keywords) {
  return hyRequest.get(api.searchSuggest, {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords) {
  return hyRequest.get(api.search, {
    keywords
  })
}