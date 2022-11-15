//导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')


//获取用户基本信息
exports.getuserinfo = (req, res) => {
  const sql = 'selecti id, username,nicknamr,email,user_pic where id=? '
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