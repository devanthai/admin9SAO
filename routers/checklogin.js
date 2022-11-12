const Admin = require('../models/Admin')


module.exports = async function (req, res, next) {

  if (req.session && req.session.userId) {


    var isLogin = false;
    var name = "";
    const user = await Admin.findOne({ _id: req.session.userId })
    isLogin = true;
    name = user.username;


    req.user = { _id: user._id, name: name, isLogin: isLogin, type: user.type }

    if (req.user.type == 1) {
      return res.render('index', {
        page: "ctvnaptien", data: req.user
      })
    }
    return next();
  } else {
    //  return res.render("index",{page:"pages/user/dangnhap"});
    req.user = { isLogin: false }
    return next();
  }
}


