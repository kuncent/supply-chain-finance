'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// BASE_API: "http://113.31.131.13:8086/admin"
// BASE_API: '"http://kks-mall.glqas.jpushoa.com/admin"'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://kks-mall.keke66.cn/admin"'
})
