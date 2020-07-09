'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// BASE_API: '"http://kks-mall.glqas.jpushoa.com/admin"'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://kks-mall.glqas.jpushoa.com/admin"'
})
