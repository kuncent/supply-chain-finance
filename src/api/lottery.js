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

export function lotteryCreate(params) {
  return request({
    url: '/luckdraw/create',
    method: 'post',
    params: params
  })
}

export function lotteryCreateItem(params) {
  return request({
    url: '/luckdraw/createItem',
    method: 'post',
    params: params
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

export function lotteryUpdate(params) {
  return request({
    url: '/luckdraw/update',
    method: 'post',
    params: params
  })
}

export function lotteryUpdateItem(params) {
  return request({
    url: '/luckdraw/updateItem',
    method: 'post',
    params: params
  })
}