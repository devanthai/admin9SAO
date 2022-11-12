const router = require('express').Router()
const Rutvang = require('../models/Rutvang')
const Rutthoi = require('../models/RutThoi')
const User = require('../models/User')
const userControl = require('../controller/userControl')
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
router.post('/', async (req, res) => {
    if (req.body.type == "hoan") {
        const rutvang = await Rutvang.findOne({ _id: req.body.id, status: 0 })
        if (rutvang) {
            const rut = await Rutvang.findOneAndUpdate({ _id: req.body.id, status: 0 }, { status: 2 })
            const user = await User.findOneAndUpdate({ _id: rutvang.uid }, { $inc: { vang: rutvang.sovang } })
            const sodu = await userControl.sodu(rutvang.uid, "+" + numberWithCommas(rut.sovang), "Hoàn đơn rút vàng")
            return res.send("thanh cong")
        }
        res.send("that baiiiiiiiiiii")

    }
})

router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (req.query.type == "taikhoan") {

        var ccc = await Rutvang.aggregate([
            { $match: { time: { $gte: startOfToday } } }
            ,
            {
                $group: {
                    _id: {
                        "server": "$server",
                        "taikhoan": "$taikhoan",
                        "uid": "$uid",
                    },
                    "tongvang": { $sum: "$sovang" }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "server": "$_id.server",
                    "taikhoan": "$_id.taikhoan",
                    "uid": "$_id.uid",
                    "tongvang": "$tongvang"
                }
            },
            { $sort: { "tongvang": -1 } }
        ])



        res.render('index', { page: "rutvang2", data: req.user, rutvang: ccc })

    }
    if (req.query.type == "taikhoanthoi") {

        var ccc = await Rutthoi.aggregate([
            { $match: { time: { $gte: startOfToday } } }
            ,
            {
                $group: {
                    _id: {
                        "server": "$server",
                        "taikhoan": "$taikhoan",
                        "uid": "$uid",
                    },
                    "tongvang": { $sum: "$sovang" }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "server": "$_id.server",
                    "taikhoan": "$_id.taikhoan",
                    "uid": "$_id.uid",
                    "tongvang": "$tongvang"
                }
            },
            { $sort: { "tongvang": -1 } }
        ])



        res.render('index', { page: "rutvang2", data: req.user, rutvang: ccc })

    }
    else if (req.query.type == "tnv") {
        // var ccc = await Rutvang.aggregate([
        //     { $match: {  } }
        //     ,
        //     {
        //         $lookup: {
        //             from: "users",       // other table name
        //             localField: "username",   // name of users table field
        //             foreignField: "taikhoan", // name of userinfo table field
        //             as: "user_info"         // alias for userinfo table
        //         }
        //     },
        //     { $unwind: "$user_info" },     // $unwind used for getting data in object or for one record only
        //     {
        //         $group: {
        //             _id: {
        //                 "server": "$server",
        //                 "taikhoan": "$taikhoan",
        //                 "tnv": "$tnv",
        //                 "uid": "$uid",
                        
        //             },
        //             "tongvang": { $sum: "$sovang" }
        //         }
        //     },
        //     {
        //         "$project": {
        //             "_id": 0,
        //             "server": "$_id.server",
        //             "taikhoan": "$_id.taikhoan",
        //             "uid": "$_id.uid",
        //             "tnv": "$_id.tnv",
        //             "tongvang": "$tongvang",
        //             "zzzz": "$user_info.t",
        //         }
        //     },
        //     { $sort: { "tongvang": -1 } }
        // ])


        var cccc = await Rutvang.aggregate([

            // Join with user_info table
            {
                $lookup: {
                    from: "users",       // other table name
                    localField: "username",   // name of users table field
                    foreignField: "taikhoan", // name of userinfo table field
                    as: "user_info"         // alias for userinfo table
                }
            }
        ]);
        console.log(cccc)
        // cccc.forEach((item)=>{
        //     console.log(item.worksnapsTimeEntries)
        // })
        //res.render('index', { page: "rutvang3", data: req.user, rutvang: ccc })
    }
})

router.get('/', async (req, res) => {

    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());


})
module.exports = router
