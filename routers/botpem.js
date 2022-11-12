const router = require('express').Router()
const fs = require('fs');


router.post('/', async (req, res) => {
    var data = req.body.hello
    var settig = req.body.setting
    var cccc = await fs.writeFileSync('./bot/bot.txt', data);
    var zzz = await fs.writeFileSync('./bot/setting.json', settig);
    const arr = data.toString().replace(/\r\n/g, '\n').split('\n');
    res.send("Thanh cong")


})

router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var rawdata = fs.readFileSync('./bot/bot.txt', { encoding: 'utf8', flag: 'r' })
    var setting = fs.readFileSync('./bot/setting.json', { encoding: 'utf8', flag: 'r' })
   

    res.render('index', { page: "botpem", data: req.user, databot: rawdata, setting: setting })

})
module.exports = router
