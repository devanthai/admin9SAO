const router = require('express').Router()
const Napthoi = require('../models/Napthoi')



router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var perPage = 9
    var page = req.query.page || 1
    var data = await Napthoi.find({}).skip((perPage * page) - perPage).limit(perPage).sort({ 'time': -1 });
    var count = await Napthoi.countDocuments({});
    res.render('index',{page:"napthoi",data:req.user,napthoi: data, current: page, pages: Math.ceil(count / perPage)})

})
module.exports = router
