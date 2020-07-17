import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/luckdraw/list',
    method: 'get',
    params: params
  })
}

export function lotteryDict(params) {
  return request({
    url: '/luckdraw/dict',
    method: 'get',
    params: params
  })
}

export function lotteryListItem(params) {
  return request({
    url: '/luckdraw/listItem',
    method: 'get',
    params: params
  })
}

export function lotteryCreate(data) {
  return request({
    url: '/luckdraw/create',
    method: 'post',
    data: data
  })
}

export function lotteryCreateItem(data) {
  return request({
    url: '/luckdraw/createItem',
    method: 'post',
    data: data
  })
}

export function lotteryDeleteItem(params) {
  return request({
    url: '/luckdraw/deleteItem',
    method: 'post',
    params: params
  })
}

export function lotteryOffShelves(params) {
  return request({
    url: '/luckdraw/offShelves',
    method: 'post',
    params: params
  })
}

export function lotteryRelease(params) {
  return request({
    url: '/luckdraw/release',
    method: 'post',
    params: params
  })
}

export function lotteryUpdate(data) {
  return request({
    url: '/luckdraw/update',
    method: 'post',
    data: data
  })
}

export function lotteryUpdateItem(data) {
  return request({
    url: '/luckdraw/updateItem',
    method: 'post',
    data: data
  })
}