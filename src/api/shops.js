import request from '@/utils/request'
import axios from 'axios'

// 每日统计
export function fetchList(params) {
  return request({
    url: '/shop/listAll',
    method: 'get',
    params: params
  })
}

// 报表统计
export function createShops(params) {
  return request({
    url: '/shop/create',
    method: 'post',
    params: params
  })
}

// 订单统计
export function updateShops(params, id) {
  return request({
    url: '/shop/update/' + id,
    method: 'post',
    params: params
  })
}