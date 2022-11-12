const router = require('express').Router()
const Cuoctsr = require('../models/Cuoctsr')



router.get('/remove',async (req,res)=>{

    const cc = await  Botvang.remove({})
    res.send("cccc")
})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var perPage = 9
    var page = req.query.page || 1
    var data = await Cuoctsr.find({}).skip((perPage * page) - perPage).limit(perPage).sort({ 'time': -1 });
    var count = await Cuoctsr.countDocuments({});
    res.render('index',{page:"momo",data:req.user,napvang: data, current: page, pages: Math.ceil(count / perPage)})

})
module.exports = router
