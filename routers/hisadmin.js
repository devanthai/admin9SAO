const router = require('express').Router()
const Lichsunaptien = require('../models/Lichsunaptien')


router.get("/check", async (req, res) => {
    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth());
    let checks = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: req.query.text } });
    let checks2 = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: req.query.text+"nap" } });
    checks = [...checks,...checks2]

    let text = ""
    checks.forEach((item) => {
        if (!item.noidung.includes("kim cương") && !item.noidung.includes("gifcode")) {
            text += item.noidung + "  " + new Date(item.date).toLocaleString() + "<br>"
        }
    })
    res.send(text)
})

router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }


    let now = new Date();
    let startOfToday = new Date(now.getFullYear(), now.getMonth());
    let tungs = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: "tung" } });
    let tungnaps = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: "tungnap" } });
    let tais = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: "tai" } });
    let tainaps = await Lichsunaptien.find({ date: { $gte: startOfToday }, $text: { $search: "tainap" } });
    tungs = [...tungs,...tungnaps]
    tais = [...tais,...tainaps]

    tungs.forEach((item, index) => {
        if (item.noidung.includes("kim cương") || item.noidung.includes("gifcode")) {
            tungs.splice(index, 1);
        }
    })
    tais.forEach((item, index) => {
        if (item.noidung.includes("kim cương") || item.noidung.includes("gifcode")) {
            tais.splice(index, 1);

        }
    })

    const data = await Lichsunaptien.find({}).sort({ 'date': -1 });

    res.render('index', { page: "hisadmin", data: req.user, lichsu: data, tungs, tais })

})
module.exports = router
