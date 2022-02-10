import hyRequest from "../index";

const api = {
  topMv: '/top/mv', // 获取热门mv
}

// 获取mv列表
export function getTopMv(offset, limit = 10) {
  return hyRequest.get(api.topMv, {
    offset,
    limit,
  });
}