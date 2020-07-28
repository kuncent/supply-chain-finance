import request from '@/utils/request'
import axios from 'axios'

// 每日统计
export function fetchList(params) {
  return request({
    url: '/stat/listCouponUserStat',
    method: 'get',
    params: params
  })
}

// 订单统计
export function fetchOrderStatList(params) {
  return request({
    url: '/stat/orderStat',
    method: 'get',
    params: params
  })
}