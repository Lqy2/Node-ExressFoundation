const express = require('express')
//导入用户路由处理函数
const userHandle = require('../router_handler/user')

//创建路由对象
const router = express.Router()

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

//导入需要验证规则对象 {}解构赋值
const { reg_login_schema } = require('../schema/user')



//注册新用户
router.post('/register', expressJoi(reg_login_schema), userHandle.register)

//登录
router.post('/login', expressJoi(reg_login_schema), userHandle.login)

module.exports = router