import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/prefrenceArea/list',
    method: 'get',
    params: params
  })
}

export function fetchGoodsList(params, id) {
  return request({
    url: '/prefrenceArea/listProduct/' + id,
    method: 'get',
    params: params
  })
}

export function updateRecommendStatus(data) {
  return request({
    url: '/home/recommendProduct/update/recommendStatus',
    method: 'post',
    data: data
  })
}

export function createTag(data) {
  return request({
    url: '/prefrenceArea/create',
    method: 'post',
    data: data
  })
}

export function updateTag(data, id) {
  return request({
    url: '/prefrenceArea/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteHotProduct(data) {
  return request({
    url: '/home/recommendProduct/delete',
    method: 'post',
    data: data
  })
}

export function deleteSelectProduct(data,id) {
  return request({
    url: '/prefrenceArea/deleteProduct/' + id,
    method: 'post',
    data: data
  })
}

export function createHotProduct(data) {
  return request({
    url: '/home/recommendProduct/create',
    method: 'post',
    data: data
  })
}

export function createSelectProduct(params, id) {
  return request({
    url: '/prefrenceArea/addProduct/' + id,
    method: 'post',
    params: params
  })
}

export function updateHotProductSort(params) {
  return request({
    url: '/home/recommendProduct/update/sort/' + params.id,
    method: 'post',
    params: params
  })
}

export function updateSelectProductSort(params,id) {
  return request({
    url: 'prefrenceArea/setProductSort/' + id,
    method: 'post',
    params: params
  })
}
