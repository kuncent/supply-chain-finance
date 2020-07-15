import request from '@/utils/request'
import axios from 'axios'

export function fetchList(params) {
  return request({
    url: '/orderItem/list',
    method: 'get',
    params: params
  })
}

export function closeOrder(params) {
  return request({
    url: '/order/update/close',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/order/delete',
    method: 'post',
    params: params
  })
}

export function deliveryOrder(data) {
  return request({
    url: '/order/update/delivery',
    method: 'post',
    data: data
  });
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/order/update/note',
    method: 'post',
    params: params
  })
}

export function exportUnshippedOrderItem(params) {
  return request({
    url: '/orderItem/exportUnshippedOrderItem',
    method: 'post',
    params: params
  })
}

export function importShippingByUrl(params) {
  return request({
    url: '/orderItem/importShippingByUrl',
    method: 'post',
    params: params
  })
}

export function fetchHistoryList(params) {
  return request({
    url: '/orderItem/listExportUnshippedOrderItemHistory',
    method: 'get',
    params: params
  })
}

export function download(params) {
  return request({
    url: '/orderItem/localFile/download',
    method: 'get',
    params: params
  })
}

export function fetcRefund(params) {
  return request({
    url: '/orderItem/refund',
    method: 'post',
    params: params
  })
}

export function sendMsg(params) {
  return request({
    url: '/orderItem/sendMsg',
    method: 'post',
    params: params
  })
}

export function viewDelivery(id) {
  return request({
    url: '/orderItem/logistics?id='+id,
    method: 'get',
  })
}

export function uploadFile(file) {
  const formData = new FormData();
  formData.fileType = 'file';
  formData.file = file;
  return axios.post(
    process.env.BASE_API + '/localFile/upload',
    {
      formData
    }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  },
  )
}
