const router = require('express').Router()
const Botnap = require('../models/Botnap')
const Botrut = require('../models/Botrut')
const Botthoi = require('../models/Botthoi')


router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    const botnap = await Botnap.find({})
    const botrut = await Botrut.find({})
    const botthoi = await Botthoi.find({})

    res.render('index',{page:"bot",data:req.user,botnap:botnap,botrut:botrut,botthoi:botthoi})

})
module.exports = router
