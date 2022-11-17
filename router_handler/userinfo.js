//导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

//导入处理密码的处理模块
const bcrypt = require('bcryptjs')


//获取用户基本信息
exports.getuserinfo = (req, res) => {
  const sql = 'select id, username,nickname,email,user_pic from ev_users where id=? '
  //调用db.query()执行SQL语句
  //req对象上的user属性，是token解析成功，express-jwt中间件帮我们挂在上去的
  db.query(sql, req.user.id, (err, results) => {
    //执行SQL语句失败

    if (err) return res.cc(err)
    //执行成功但查询结果可能为空
    if (results.length !== 1) return res.cc('获取用户信息失败')
    res.send({
      code: 200,
      msg: '获取成功',
      results: results[0]
    })
  })
}

//更新用户基本信息
exports.updateUserInfo = (req, res) => {
  const sql = 'update ev_users set ? where id =?'
  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('更新用户信息失败!')
    res.cc('更新用户信息成功', 200)
  })
}

//重置密码
exports.updateUserInfopwd = (req, res) => {
  const sql = 'select*from ev_users where id=?'
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('用户不存在!')

    //判断用户输入密码是否正确
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if (!compareResult) return res.cc('旧密码错误!')

    //定义更新密码的SQL语句
    const sqls = 'update ev_users set password=? where id=?'
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
    db.query(sqls, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err)
      if (results.length !== 1) return res.cc('重置密码失败!')
      res.cc('更新密码成功')
    })
  })
}

//更改头像
exports.updateAvatar = (req, res) => {
  const sql = 'update ev_users set user_pic=? where id=?'
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('更新头像失败!')
    return res.cc('更新头像成功！')
  })
}