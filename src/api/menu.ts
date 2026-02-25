import request from '@/utils/request'

export const getMenuTree = () =>
  request({
    url: '/menus/tree',
    method: 'get',
  })
