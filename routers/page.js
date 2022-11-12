const router = require('express').Router()
const Setting = require('../models/Setting')

router.post('/upsetting', async (req, res) => {

    res.send("thanh cong")

})

router.post('/', async (req, res) => {


    var cltx = req.body.cltx
    var xien = req.body.xien
    var kimcuong = req.body.kimcuong
    var dudoankq = req.body.dudoankq
    var urlcard = req.body.urlcard
    var partnerid = req.body.partnerid
    var partnerkey = req.body.partnerkey
    var chatkey = req.body.chatkey


    var sdtmomo = req.body.sdtmomo
    var namemomo = req.body.namemomo
    var moneychange = req.body.moneychange
    var gt1s = req.body.gt1s
    var the9sao = req.body.the9sao


    const setting = await Setting.findOneAndUpdate({ setting: "setting" }
        ,
        {
            thongbao: req.body.thongbao,
            cuoitrang: req.body.cuoitrang,
            'tile.cltx': cltx,
            'tile.xien': xien,
            'tile.gt1s':gt1s,
            'tile.the9sao':the9sao,
            'tile.kimcuong': kimcuong,
            'tile.dudoankq': dudoankq,
            'cardsetting.url': urlcard,
            'cardsetting.partnerid': partnerid,
            'cardsetting.partnerkey': partnerkey,
            'chatkey': JSON.parse(chatkey),
            'naptien.momo.sdt':sdtmomo,
            'naptien.momo.name':namemomo,
            'moneyChange':moneychange,


        })
    if (setting) {
        res.send("thanh cong")
    }
    else {
        await new Setting({ setting: "setting", thongbao: req.body.thongbao, cuoitrang: req.body.cuoitrang }).save()
        res.send("that bai")
    }
})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    const setting = await Setting.findOne({ setting: "setting" })



    res.render('index', { page: "page", data: req.user, setting: setting })

})
module.exports = router
