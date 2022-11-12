const router = require('express').Router()
const Idnaprut = require('../models/Idnaprut')


router.post('/', async (req, res) => {
    const type = req.body.type
    if (type == "xoa") {
        const idddd= req.body.id
        console.log(idddd)

        const iddddd = await Idnaprut.findOneAndDelete({tnv:idddd})
        if (iddddd) {
            res.send("thanh cong")
        }
        else {
            res.send("that bai")
        }
    }
    else if(type=="add")
    {
        const iddddd = await new Idnaprut({tnv:req.body.tnv}).save()
        if (iddddd) {
            res.send("thanh cong")
        }
        else {
            res.send("that bai")
        }
    }

})
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    const idnr = await Idnaprut.find({})
    res.render('index', { page: "idnaprut", data: req.user, idnaprut: idnr })

})
module.exports = router
