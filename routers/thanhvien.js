const router = require('express').Router()
const User = require('../models/User')
const Lichsunaptien = require('../models/Lichsunaptien')
const Momo = require('../models/Momo')
const ChietKhau = require('../models/ChietKhau')
const Setting = require('../models/Setting')
const Usercontrol = require('../controller/userControl')


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
router.post('/search', async (req, res) => {
    const tvv = await User.findOne({ username: req.body.taikhoan })
    if (tvv) {
        var table = '<tr><td>' + tvv.username + '</td><td>' + tvv.server + '</td><td>' + numberWithCommas(tvv.vang) + '</td><td>' + tvv.kimcuong + '</td><td>' + numberWithCommas(tvv.thanhtichngay) + '</td><td>' + numberWithCommas(tvv.topup) + '</td><td>' + new Date(tvv.date).toLocaleString() + '</td><td>' + tvv.IP + '</td><td>' + '<a href="/loginUser/' + tvv._id + '" target="_blank">Truy cập</a></td><td>' + '<a onclick="xoa(\'' + tvv._id + '\')">Xóa</a></td></tr>';
        res.send({ error: 0, message: "success", table: table })
    }
    else {
        res.send({ error: 1, message: "Khong tim thayy" })
    }

})
router.post('/xoa', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập 😠😠😠😠😠😠😠😠😠😠")
    }
    var id = req.body.id
    var cc = await User.deleteOne({ _id: id })
    if (cc) {
        return res.send("Thanh cong")
    }
})

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}



router.post('/napbank', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập 😠😠😠😠😠😠😠😠😠😠")
    }

    let amount = req.body.amount
    let typebanktay = req.body.typebanktay
    const taikhoan = req.body.taikhoan

    amount = Number(amount.replace(/,/g, ''))

    const setting = await Setting.findOne({ setting: "setting" })

    let user = await User.findOne({ username: taikhoan })
    if (user) {


        const chietkhau = await ChietKhau.findOne({ server: user.server })
        const thucnhan = (amount * chietkhau.vi) + (amount >= 50000 ? getRandomIntInclusive(2000000, 10000000) : 0);

        user.vang += thucnhan
        user.topup += amount
        user.kimcuong += Number(amount / setting.tile.kimcuong)
        user.save()

        const changesss = (typebanktay == 1 ? true : false)
        const anti = (typebanktay == 1 ? true : false)
        await new Momo({ magd: "9SAO-MOMO-ERROR", name: "9SAO.ME", sdt: "9SAO.ME", sotien: amount, thucnhan: thucnhan, status: "Thành công", uid: user._id, change: changesss, anti: anti }).save()

        await new Lichsunaptien({ noidung: req.user.name + "nap momo tay" + amount + " $ cho " + user.username }).save()
        Usercontrol.sodu(user._id, '+' + numberWithCommas(thucnhan), "Nạp từ ví Admin - momo - Lỗi nạp");

        return res.send("Thành công")
    }
    else {
        return res.send("Thất bại k tim thay thanh vien")
    }
})


router.post('/naptien', async (req, res) => {
    if (!req.user.isLogin) {
        return res.send("Vui lòng đăng nhập 😠😠😠😠😠😠😠😠😠😠")
    }
    if (req.body.zzz == "vang") {
        const type = req.body.type
        const gold = req.body.gold
        const taikhoan = req.body.taikhoan
        console.log(req.body)
        const gold2 = Number(gold.replace(/,/g, ''))
        const user = await User.findOneAndUpdate({ username: taikhoan }, { $inc: { vang: (type == 1 ? gold2 : gold2 * -1) } })
        if (user) {

            const sd = await Usercontrol.sodu(user._id, "+" + numberWithCommas(gold2), "Nhận Vàng từ Admin")

            await new Lichsunaptien({ noidung: req.user.name + (type == 1 ? " nạp " : " trừ ") + gold + " vàng cho " + taikhoan }).save()
            return res.send("Thành công")
        }
        else {
            return res.send("Thất bại")
        }
    }
    if (req.body.zzz == "kimcuong") {
        const type = req.body.type
        const gold = req.body.gold
        const taikhoan = req.body.taikhoan

        const user = await User.findOneAndUpdate({ username: taikhoan }, { $inc: { kimcuong: (type == 1 ? gold : gold * -1) } })

        if (user) {

            const sd = await Usercontrol.sodu(user._id, "+" + numberWithCommas(gold), "Nhận Kim cương từ Admin")
            await new Lichsunaptien({ noidung: req.user.name + (type == 1 ? " nạp " : " trừ ") + gold + " kim cương cho " + taikhoan }).save()
            return res.send("Thành công")
        }
        else {
            return res.send("Thất bại")
        }
    }
})
router.post("/searchip", async (req, res) => {
    const tvv = await User.find({ IP: req.body.taikhoan })
    if (tvv.length > 0) {
        var table = ""
        tvv.forEach(element => {
            table += '<tr><td>' + element.username + '</td><td>' + element.server + '</td><td>' + numberWithCommas(element.vang) + '</td><td>' + element.kimcuong + '</td><td>' + numberWithCommas(element.thanhtichngay) + '</td><td>' + numberWithCommas(element.topup) + '</td><td>' + new Date(element.date).toLocaleString() + '</td><td>' + element.IP + '</td><td>' + '<a href="/loginUser/' + element._id + '" target="_blank">Truy cập</a></td><td>' + '<a onclick="xoa(\'' + element._id + '\')">Xóa</a></td></tr>';

        });
        res.send({ error: 0, message: "success", table: table })
    }
    else {
        res.send({ error: 1, message: "Khong tim thayy" })
    }
})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var perPage = 9
    var page = req.query.page || 1
    var data = await User.find({ bot: { $ne: true } }).skip((perPage * page) - perPage).limit(perPage).sort({ 'vang': -1 });
    var count = await User.countDocuments({ bot: { $ne: true } });
    res.render('index', { page: "thanhvien", data: req.user, products: data, current: page, pages: Math.ceil(count / perPage) })
})

module.exports = router
