const express = require('express')

const router = express.Router()

//导入路由处理函数
const userinfo_handler = require('../router_handler/userinfo')

router.get('/userinfo', userinfo_handler.getuserinfo)

module.exports = router