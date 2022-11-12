const router = require('express').Router()
const request = require('request');
router.post("/btx",async (req,res)=>{
    var x1 = req.body.x1
    var x2 = req.body.x2
    var x3 = req.body.x3
    
    await request.get('https://9sao.me/taixiu/setkq?x1='+x1+'&x2='+x2+'&x3='+x3, function (error, response, body) {
        console.log(body)
       return res.send(body)
    })
  
})



router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    
    res.render('index',{page:"choidep",data:req.user})

})
module.exports = router
