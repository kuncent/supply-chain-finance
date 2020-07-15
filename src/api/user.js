import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/umsMember/list',
    method: 'get',
    params: params
  })
}

export function sendGift(params) {
  return request({
    url: '/umsMember/addGiftAmount',
    method: 'post',
    params: params
  })
}