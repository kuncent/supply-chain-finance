import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/umsMember/list',
    method: 'get',
    params: params
  })
}