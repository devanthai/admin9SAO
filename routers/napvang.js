const router = require('express').Router()
const Napvang = require('../models/Napvang')
const Botvang = require('../models/Botvang')
const Botnap = require('../models/Botnap')
const Botrut = require('../models/Botrut')
const Chat = require('../models/Chat')
const Cuoc = require('../models/Cuoc')
const Clan = require('../models/Clan')
const Sodu = require('../models/Sodu')
const TaixiuCuoc = require('../models/taixiu/Cuoc')
const TaixiuLichsu = require('../models/taixiu/Lichsu')
const Taixiugame = require('../models/taixiu/Game')
const Baucuagame = require('../models/baucua/Game')
var ObjectId = require('mongoose').Types.ObjectId;
router.get('/removetx2', async (req, res) => {
    //const cc = await Taixiugame.remove({})
    const cczzz = await Baucuagame.remove({})
    res.send("cccc")
})

router.get('/removechat', async (req, res) => {

    const cc = await Chat.remove({})

    res.send("cccc")
})
router.get('/removecuoc', async (req, res) => {

    const cc = await Cuoc.remove({ status: { $ne: -1 } })

    res.send("cccc")
})
router.get('/removeclan', async (req, res) => {

    const cc = await Clan.updateMany({}, { thanhtich: 0 })

    res.send("cccc")
})
router.get('/remove', async (req, res) => {

    const cc = await Botvang.remove({})
    const ccz = await Botnap.remove({})
    const cczz = await Botrut.remove({})
    res.send("cccc")
})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var perPage = 9
    var page = req.query.page || 1
    var data = await Napvang.find({}).skip((perPage * page) - perPage).limit(perPage).sort({ 'time': -1 });
    var count = await Napvang.countDocuments({});
    res.render('index', { page: "napvang", data: req.user, napvang: data, current: page, pages: Math.ceil(count / perPage) })

})
module.exports = router
