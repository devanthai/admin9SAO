const router = require('express').Router()
const request = require('request');


router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    
    res.render('index',{page:"choidep",data:req.user})

})
module.exports = router
