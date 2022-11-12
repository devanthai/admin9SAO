const router = require('express').Router()
const ChietKhau = require('../models/ChietKhau')
const Setting = require('../models/Setting')
router.post('/', async (req, res) => {
    const chietkhau = await ChietKhau.deleteMany({})
    var data = JSON.parse(req.body.jssss)
    var hanmuc = JSON.parse(req.body.hanmuc)
    data.forEach(async (element) => {
        await new ChietKhau({ server: element.server, vi: element.vi, card: element.card }).save()
    });
    await Setting.findOneAndUpdate({ setting: "setting" }, {
        "hanmuc.server1": hanmuc.server1,
        "hanmuc.server2": hanmuc.server2,
        "hanmuc.server3": hanmuc.server3,
        "hanmuc.server4": hanmuc.server4,
        "hanmuc.server5": hanmuc.server5,
        "hanmuc.server6": hanmuc.server6,
        "hanmuc.server7": hanmuc.server7,
        "hanmuc.server8": hanmuc.server8,
        "hanmuc.server9": hanmuc.server9
    })
    if (chietkhau) {
        res.send("thanh cong")
    }
    else {
        res.send("that bai")
    }
})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    const chietkhau = await ChietKhau.find({})
    var setting = await Setting.findOne({ setting: "setting" })
    res.render('index', { page: "chietkhau", data: req.user, chietkhau: JSON.stringify(chietkhau), hanmuc: JSON.stringify(setting.hanmuc) })
})
module.exports = router
