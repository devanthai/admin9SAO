const router = require('express').Router()
const Rutvang = require('../models/RutThoi')
const User = require('../models/User')
const userControl = require('../controller/userControl')
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
router.post('/', async (req, res) => {
    if (req.body.type == "hoan") {
        const rutvang = await Rutvang.findOne({ _id: req.body.id, status: 0 })
        console.log(rutvang)
        if (rutvang) {
            const rut = await Rutvang.findOneAndUpdate({ _id: req.body.id, status: 0 }, { status: 2 })
            const user = await User.findOneAndUpdate({ _id: rutvang.uid }, { $inc: { vang: rutvang.sovang * 37000000 } })
            const sodu = await userControl.sodu(rutvang.uid, "+" + numberWithCommas(rut.sovang * 37000000), "Hoàn đơn rút vàng")
            const zzzz = await userControl.upHanmuc(rutvang.uid, rut.sovang * 37000000, rutvang.server)
            return res.send("thanh cong")
        }
        res.send("that baiiiiiiiiiii")
    }
})

router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var perPage = 9
    var page = req.query.page || 1
    var data = await Rutvang.find({}).skip((perPage * page) - perPage).limit(perPage).sort({ 'time': -1 });
    var count = await Rutvang.countDocuments({});
    res.render('index', { page: "rutthoi", data: req.user, rutvang: data, current: page, pages: Math.ceil(count / perPage) })

})
module.exports = router
