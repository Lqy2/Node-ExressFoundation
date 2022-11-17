//《表单验证规则》

//导入定义验证规则的包
const joi = require('joi')

//定义用户名和密码的验证规则   alphanum()表示用户名字段只能包含a~z,A~Z,0~9
const username = joi.string().alphanum().min(1).max(10).required()

//密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/).required()


//定义验证注册和登录表单数据的规则对象 
exports.reg_login_schema = {
  body: {
    username,
    password,
  }
}

//定义id ,nickname ,email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

//定义更新用户验证规则对象
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email: email,
  }
}

//定义重置密码验证规则
exports.update_password_schema = {
  body: {
    //使用password这个验证规则，验证req.body.oldPwd的值
    oldPwd: password,
    //joi.not(joi.ref('oldPwd')).concat(password)验证req.body.newPwd的值
    //joi.not()表示oldPwd的值不能等于newPwd的值
    //joi.ref()表示oldPwd的值必须与newPwd的值保持一致
    //concat()用于合并joi.not(joi.ref('oldPwd'))和password这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

//定义avatar的验证规则
//dataUri()
const avatar = joi.string().dataUri().required()

exports.update_avatar_schema = {
  body: {
    avatar
  }
}