//导入express模块
const express = require('express')
//创建服务器的实例对象
const app = express()

//导入定义验证规则的包
const joi = require('@hapi/joi')

//配置跨域
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件,注意这个中间件只能解析键值对的数据格式
app.use(express.urlencoded({ extended: false }))

//响应数据的中间件
app.use((req, res, next) => {
  // code=200为成功、code为404为错误
  res.cc = (err, code = 404) => {
    res.send({
      code,
      msg: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/\/api/] }))


//导入并使用用户模块路由
const userRouter = require('./router/user')
const res = require('express/lib/response')
app.use('/api', userRouter)

//导入并使用个人中心的路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//定义错误级别的中间件
app.use((err, req, res, next) => {
  //验证规则导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  //身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  //未知的错误
  res.cc(err)

})


//启动服务器
app.listen(3088, () => {
  console.log("serve running at http://127.0.0.1:3088");
})
