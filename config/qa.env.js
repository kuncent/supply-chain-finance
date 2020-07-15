'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"qa"',
  BASE_API: '"http://kks-mall.glqas.jpushoa.com/  "'
})
