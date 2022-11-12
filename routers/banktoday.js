const router = require('express').Router()
const Bank = require('../models/Bank')


router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const banks = await Bank.find({ time: { $gte: startOfToday } }).sort({time:-1})
    res.render('index', { page: "banktoday", data: req.user, banks: banks })
})
module.exports = router
