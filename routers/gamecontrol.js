const router = require('express').Router()
const Clan = require('../models/Clan')
const User = require('../models/User')
const Cuoc = require('../models/Cuoc')
const Napvang = require('../models/Napvang')
const Usercontrol = require('../controller/userControl')
const botTele = require('../telegram/botrac')
var CronJob = require('cron').CronJob;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var cronNewDay = new CronJob('00 00 00 * * *', function () {
    console.log("Hello new day~")
    newDayTraogiao()

}, function () {
    /* This function is executed when the job stops */
},
    true, /* Start the job right now */
    'Asia/Ho_Chi_Minh' /* Time zone of this job. */
);


router.get('/rstop', async (req, res) => {
    const ccc = await User.updateMany({}, { thanhtichngay: 0 })
    const cc = await Clan.updateMany({}, { thanhtich: 0 })
    res.send("thanhcong")
})


async function newDayTraogiao() {
    try {
        var infoclan = ""
        const topclans = await Clan.find({}).sort({ thanhtich: -1 }).limit(10)
        const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
        var index = 1;
        var sovanggggg = 0;
        for (let i = 0; i < topclans.length; i++) {
            var item = topclans[i]
            try {
                const checkusClan = await User.find({ 'clan.id': item._id.toString() })
                var giaithuong = 0;
                if (index == 1) giaithuong = 500000000
                else if (index == 2) giaithuong = 250000000
                else if (index == 3) giaithuong = 100000000
                else if (index == 4) giaithuong = 75000000
                else if (index == 5) giaithuong = 50000000
                else if (index == 6) giaithuong = 40000000
                else if (index == 7) giaithuong = 30000000
                else if (index == 8) giaithuong = 20000000
                else if (index == 9) giaithuong = 10000000
                else if (index == 10) giaithuong = 5000000
                for (let iz = 0; iz < checkusClan.length; iz++) {
                    try {
                        var item = checkusClan[iz]
                        sovanggggg = sovanggggg + giaithuong
                        const cccccc = await Usercontrol.upMoney(item._id, giaithuong)
                        infoclan += "Top " + index + " name: " + item.username + " Clanname: " + topclans[i].name + " Giai: " + giaithuong + "\n"
                        try {
                            const us = await User.findByIdAndUpdate(item._id, { "clan.thanhtichngay": 0 })
                        } catch { }
                        const sd = await Usercontrol.sodu(item._id, "+" + numberWithCommas(giaithuong), "Thưởng top " + index + " bang hội")

                    } catch { }
                }
            } catch { }
            await Clan.findByIdAndUpdate(item._id, { thanhtich: 0 })
            index++
        }
        const cc = await Clan.updateMany({}, { thanhtich: 0, "clan.thanhtichngay": 0 })
        try {
            botTele.sendMessage(-550321171, "Giải bang hội:\n" + infoclan + "Tổng: " + sovanggggg);
        }
        catch { }
        console.log("đã trao giải bang hội tổng: " + sovanggggg)
    }
    catch { }
    try {
        const topUser = await User.find({}).sort({ thanhtichngay: -1 }).limit(7)
        var indexTop = 1;
        var sovanggggggggg = 0;
        var info = ""
        for (let i = 0; i < topUser.length; i++) {
            try {
                var giaithuong = 0
                if (indexTop == 1) { giaithuong = 10000000000 }
                else if (indexTop == 2) { giaithuong = 5000000000 }
                else if (indexTop == 3) { giaithuong = 3000000000 }
                else if (indexTop == 4) { giaithuong = 1000000000 }
                else if (indexTop == 5) { giaithuong = 500000000 }
                else if (indexTop == 6) { giaithuong = 300000000 }
                else if (indexTop == 7) { giaithuong = 100000000 }
                const cccccc = await Usercontrol.upMoney(topUser[i]._id, giaithuong)
                const sd = await Usercontrol.sodu(topUser[i]._id, "+" + numberWithCommas(giaithuong), "Thưởng top " + indexTop + " BXH")
                info += "Top: " + (i + 1) + " " + topUser[i].username + " TT:" + topUser[i].thanhtichngay + " Giai:" + giaithuong + "\n"
                await User.findByIdAndUpdate(topUser[i]._id, { thanhtichngay: 0 })
                console.log(indexTop + "|" + giaithuong)
                indexTop++
                sovanggggggggg += giaithuong
            }
            catch { }
        }
        const ccc = await User.updateMany({}, { thanhtichngay: 0, hanmuc: 0 })
        try {
            botTele.sendMessage(-550321171, "Giải cá nhân:\n" + info + "Tổng: " + sovanggggggggg);
        }
        catch { }
        console.log("đã trao giải xongg")
    }
    catch { }
}


router.post('/', async (req, res) => {
    newDayTraogiao()

    return res.send("ok")
    const type = req.body.type
    return res.send("zz")
    if (type == "banghoi") {
        const topclans = await Clan.find({}).sort({ thanhtich: -1 }).limit(10)
        const checkUserClan = await User.find({ "clan": { "$ne": 0 } })
        var index = 1;
        var sovanggggg = 0;
        for (let i = 0; i < topclans.length; i++) {
            var item = topclans[i]
            try {


                const checkusClan = await User.find({ 'clan.id': item._id.toString() })
                var giaithuong = 0;
                if (index == 1) giaithuong = 500000000
                else if (index == 2) giaithuong = 250000000
                else if (index == 3) giaithuong = 100000000
                else if (index == 4) giaithuong = 75000000
                else if (index == 5) giaithuong = 50000000
                else if (index == 6) giaithuong = 40000000
                else if (index == 7) giaithuong = 30000000
                else if (index == 8) giaithuong = 20000000
                else if (index == 9) giaithuong = 10000000
                else if (index == 10) giaithuong = 5000000

                giaithuong

                for (let iz = 0; iz < checkusClan.length; iz++) {
                    try {
                        var item = checkusClan[iz]
                        // const cuocss = await Cuoc.countDocuments({ uid: item._id });
                        // const napvangs = await Napvang.countDocuments({ uid: item._id });
                        // if (napvangs && napvangs > 1 || item.topup > 0) {
                        sovanggggg = sovanggggg + giaithuong
                        const cccccc = await Usercontrol.upMoney(item._id, giaithuong)

                        try {
                            const us = await User.findByIdAndUpdate(item._id, { "clan.thanhtichngay": 0 })
                        } catch { }

                        const sd = await Usercontrol.sodu(item._id, "+" + numberWithCommas(giaithuong), "Thưởng top " + index + " bang hội")

                        //   }
                    } catch { }

                }
            } catch { }


            await Clan.findByIdAndUpdate(item._id, { thanhtich: 0 })
            index++
        }
        const cc = await Clan.updateMany({}, { thanhtich: 0 })
        return res.send("đã trao giải bang hội tổng: " + sovanggggg)
    }
    else if (type == "top") {
        const topUser = await User.find({ thanhtichngay: { "$ne": 0 } }).sort({ thanhtichngay: -1 })
        console.log(topUser)
        var indexTop = 1;
        for (let i = 0; i < topUser.length; i++) {
            var giaithuong = 0
            if (indexTop == 1) { giaithuong = 5000000000 }
            else if (indexTop == 2) { giaithuong = 2000000000 }
            else if (indexTop == 3) { giaithuong = 1000000000 }
            else if (indexTop == 4) { giaithuong = 500000000 }
            else if (indexTop == 5) { giaithuong = 200000000 }
            else if (indexTop == 6) { giaithuong = 100000000 }
            else if (indexTop == 7) { giaithuong = 50000000 }

            giaithuong += topUser[i].thanhtichngay * 0.05
            const cccccc = await Usercontrol.upMoney(topUser[i]._id, giaithuong)
            const sd = await Usercontrol.sodu(topUser[i]._id, "+" + numberWithCommas(giaithuong), "Thưởng top " + indexTop + " BXH")
            await User.findByIdAndUpdate(topUser[i]._id, { thanhtichngay: 0 })
            console.log(indexTop + "|" + giaithuong)
            indexTop++

        }
        const ccc = await User.updateMany({}, { thanhtichngay: 0 })
        return res.send("đã trao giải xongg")
    }
})

router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }

    res.render('index', { page: "gamecontrol", data: req.user })

})
module.exports = router
