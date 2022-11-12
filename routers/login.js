const router = require('express').Router()
const Admin = require('../models/Admin')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateSecret, verify } = require('2fa-util');

router.post('/changepass', async (req, res) => {

    var mkcu = req.body.mkcu
    var mkmoi = req.body.mkmoi

    try {
        const user = await Admin.findOne({ _id: req.session.userId })

        const vaildPass = await bcrypt.compare(mkcu, user.password)

        if (!vaildPass) return res.send({ error: 1, message: 'Mật khẩu cũ không chính xác' })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(mkmoi, salt)

        await Admin.updateOne({ _id: user._id }, { password: hashPassword })
        req.session.destroy(function (err) {

        })
        return res.json({ error: 0, message: "Đổi mật khẩu thành công" });
    } catch {

        return res.json({ error: 1, message: "Lỗi không xác định vui lòng thử lại" });
    }

});

router.get('/logout', (req, res) => {
    cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', { expires: new Date(0) });
    }
    req.session = null
    res.redirect('/')
});

// router.get('/rmuser',async(req, res) => {
//    await Admin.deleteMany({})
//    res.send("cccc")
// })

router.get('/add', async (req, res) => {
    const code = req.query.code
    const is2Fa = await verify(code,process.env.secret2fa)
    if (!is2Fa) {
        return res.send("param: acc,pass,code(gg 2fa)")
    }
    const type = req.query.type

    const pass = req.query.pass
    const acc = req.query.acc
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(pass, salt)
    const zzz = await new Admin({ username: acc, password: hashPassword, type: type }).save()
    res.send(zzz)
})

router.get('/resest', async (req, res) => {
    const code = req.query.code
    const is2Fa = await verify(code, process.env.secret2fa)
    if (!is2Fa) {
        return res.send("param: acc,pass,code(gg 2fa)")
    }

    const pass = req.query.pass
    const acc = req.query.acc
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(pass, salt)

    let v = await Admin.findOne({username:acc})
    if(v)
    {
        v.password = hashPassword
        v.save()
    }
    res.send(v)
})
router.get('/', (req, res) => {



    if (req.user.isLogin) {
        return res.redirect('/')
    }
    res.render('user/login')
})
router.post('/', async (req, res) => {
    const taikhoan = req.body.taikhoan
    const matkhau = req.body.matkhau
    const code = req.body.code
    const is2Fa = await verify(code, process.env.secret2fa)
    if (!is2Fa) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }


    const admin = await Admin.findOne({ username: taikhoan })

    if (!admin) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }

    const vaildPass = await bcrypt.compare(matkhau, admin.password)

    if (!vaildPass) {
        return res.send("taikhoan hoac mat khau k chinh xacs")
    }
    req.session.userId = admin._id
    res.send("thanhcong")
})
module.exports = router
