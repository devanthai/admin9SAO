const router = require('express').Router()
const Gifcode = require('../models/Gifcode')
const Lichsunaptien = require('../models/Lichsunaptien')


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
router.post('/', async (req, res) => {
    const type = req.body.type
    if (type == "xoa") {
        const idddd = req.body.id

        const iddddd = await Gifcode.findOneAndDelete({ _id: idddd })
        if (iddddd) {
            res.send("thanh cong")
        }
        else {
            res.send("that bai")
        }
    }
    else if (type == "add") {
        if (Number(req.body.soluong) > 20) {
            return res.send("số lượng phải nhỏ hơn 21")
        }
        try {
            for (let i = 0; i < Number(req.body.soluong); i++) {
                const iddddd = await new Gifcode({ code: "9sao" + getRandomIntInclusive(0, 9999) + makeid(3), phanthuong: Number(req.body.sovang) }).save()
            }
            await new Lichsunaptien({ noidung: req.user.name + " đã tạo " + req.body.soluong + " gifcode " + req.body.sovang }).save()
            res.send("thanh cong")
        }
        catch { res.send("that bai") }
    }
})
router.get('/', async (req, res) => {

    if (!req.user.isLogin) {

        return res.redirect('/')
    }

    if (req.user.name != "thaipro2k2" && req.user.name != "tronganh"&& req.user.name != "tung") {
        return res.redirect('/')
    }   

    const idnr = await Gifcode.find({ status: 0 })
    res.render('index', { page: "gifcode", data: req.user, idnaprut: idnr })
})
module.exports = router
