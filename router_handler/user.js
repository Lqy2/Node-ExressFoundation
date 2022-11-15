// 导入bcryptjs  用户密码加密
const bcrypt = require('bcryptjs')

//导入用户登录成功后生成token的包
const jwt = require('jsonwebtoken')

//导入全局的配置文件
const config = require('../config')

//导入数据库操作模块
const db = require('../db/index')

//用户注册
exports.register = (req, res) => {

  // 获取客户端的提交信息
  const userinfo = req.body

  // 对表单中的数据，进行合法性判断
  // if (!userinfo.username || !userinfo.password)
  //   return res.send({ code: 401, msg: '用户名或密码为空' })


  //定义sql语句
  const sqlStr = 'select * from ev_users where username=?'

  db.query(sqlStr, userinfo.username, (err, results) => {
    if (err) return res.cc(err)
    // return res.send({ code: 404, msg: err.message })


    if (results.length > 0) return res.cc('用户名重复')
    // return res.send({ code: 401, msg: '用户名重复' })


    // console.log(results.length, userinfo.username);
  })

  //调用bcrypt.hashSync方法对密码进行加密
  userinfo.password = bcrypt.hashSync(userinfo.password, 10)

  //注册新用户
  const register = 'insert into ev_users set?'
  db.query(register, { username: userinfo.username, password: userinfo.password }, (err, results) => {
    if (err) return res.cc(err)
    // return res.send({ code: 404, msg: err.message })


    if (results.affectedRows !== 1) return res.cc('用户注册失败，请重试!')
    // return res.send({ code: 402, msg: '用户注册失败，请重试!' })


    res.send({ code: 200, msg: '用户注册成功!' })
  })

}

// 用户登录
exports.login = (req, res) => {
  //接受表单的数据
  const userinfo = req.body

  const sql = 'select * from ev_users where username=?'

  db.query(sql, userinfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('登录失败!')
    // 判断密码是否正确 //bcrypt.compareSync（用户提交的密码，数据库的密码）方法比较密码是否正确

    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('登录失败!')

    //登陆成功后生成token的字符串
    // 剔除用户的敏感信息（密码和头像）
    const user = { ...results[0], password: '', user_pic: '' }
    //对用户的信息进行加密，生成token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })

    res.send({
      code: 200,
      msg: '登陆成功',
      token: 'Bearer ' + tokenStr
    })
  })
  res.send('login OK')
}