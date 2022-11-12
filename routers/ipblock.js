const router = require('express').Router()
const Ipblock = require('../models/Ipblock')


router.post('/', async (req, res) => {
    const type = req.body.type
    if (type == "xoa") {
        const idddd= req.body.id
        console.log(idddd)

        const iddddd = await Ipblock.findOneAndDelete({ip:idddd})
        if (iddddd) {
            res.send("thanh cong")
        }
        else {
            res.send("that bai")
        }
    }
    else if(type=="add")
    {
        const iddddd = await new Ipblock({ip:req.body.ip}).save()
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
    const idnr = await Ipblock.find({})
    res.render('index', { page: "ipblock", data: req.user, idnaprut: idnr })

})
module.exports = router
