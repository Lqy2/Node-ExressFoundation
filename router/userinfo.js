const express = require('express')

const router = express.Router()

//导入路由处理函数
const userinfo_handler = require('../router_handler/userinfo')

//导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

//导入需要的验证规则对象
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

//获取用户基本信息
router.get('/getuserinfo', userinfo_handler.getuserinfo)

//更新用户信息
router.post('/updateuserinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//重置用户密码
router.post('/updateuserinfopwd', expressJoi(update_password_schema), userinfo_handler.updateUserInfopwd)

//更改头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router