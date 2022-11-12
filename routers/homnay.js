const router = require('express').Router()
const moment = require('moment')

const Napvang = require('../models/Napvang')
const Rutvang = require('../models/Rutvang')

const RutThoi = require('../models/RutThoi')
const NapThoi = require('../models/Napthoi')


async function sumnapThoi(server) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await NapThoi.aggregate([{
        $match: { time: { $gte: startOfToday }, server: server, status: 1 },
    }, {
        $group: {
            _id: null,
            vang: {
                $sum: "$sovang"
            },
        }
    }])
    return sum[0]
}

async function sumrutThoi(server) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await RutThoi.aggregate([{
        $match: { time: { $gte: startOfToday }, server: server, status: 1 },
    }, {
        $group: {
            _id: null,
            vang: {
                $sum: "$sovang"
            },
        }
    }])
    return sum[0]
}


async function sumnap(server) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await Napvang.aggregate([{
        $match: { time: { $gte: startOfToday }, server: server, status: 1 },
    }, {
        $group: {
            _id: null,
            vang: {
                $sum: "$sovang"
            },
        }
    }])
    return sum[0]
}

async function sumrut(server) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await Rutvang.aggregate([{
        $match: { time: { $gte: startOfToday }, server: server, status: 1 },
    }, {
        $group: {
            _id: null,
            vang: {
                $sum: "$sovang"
            },
        }
    }])
    return sum[0]
}
router.get('/', async (req, res) => {
    if (!req.user.isLogin) {
        return res.redirect('/')
    }
    // var cccc = await game.sumCardThang()
    var nsv1 = 0;
    var nsv2 = 0;
    var nsv3 = 0;
    var nsv4 = 0;
    var nsv5 = 0;
    var nsv6 = 0;
    var nsv7 = 0;
    var nsv8 = 0;
    var nsv9 = 0;

    var rsv1 = 0;
    var rsv2 = 0;
    var rsv3 = 0;
    var rsv4 = 0;
    var rsv5 = 0;
    var rsv6 = 0;
    var rsv7 = 0;
    var rsv8 = 0;
    var rsv9 = 0;
    const sv1 = await sumnap(1); if (sv1) { nsv1 = sv1.vang }
    const sv2 = await sumnap(2); if (sv2) { nsv2 = sv2.vang }
    const sv3 = await sumnap(3); if (sv3) { nsv3 = sv3.vang }
    const sv4 = await sumnap(4); if (sv4) { nsv4 = sv4.vang }
    const sv5 = await sumnap(5); if (sv5) { nsv5 = sv5.vang }
    const sv6 = await sumnap(6); if (sv6) { nsv6 = sv6.vang }
    const sv7 = await sumnap(7); if (sv7) { nsv7 = sv7.vang }
    const sv8 = await sumnap(8); if (sv8) { nsv8 = sv8.vang }
    const sv9 = await sumnap(9); if (sv9) { nsv9 = sv9.vang }

    const rutsv1 = await sumrut(1); if (rutsv1) { rsv1 = rutsv1.vang }
    const rutsv2 = await sumrut(2); if (rutsv2) { rsv2 = rutsv2.vang }
    const rutsv3 = await sumrut(3); if (rutsv3) { rsv3 = rutsv3.vang }
    const rutsv4 = await sumrut(4); if (rutsv4) { rsv4 = rutsv4.vang }
    const rutsv5 = await sumrut(5); if (rutsv5) { rsv5 = rutsv5.vang }
    const rutsv6 = await sumrut(6); if (rutsv6) { rsv6 = rutsv6.vang }
    const rutsv7 = await sumrut(7); if (rutsv7) { rsv7 = rutsv7.vang }
    const rutsv8 = await sumrut(8); if (rutsv8) { rsv8 = rutsv8.vang }
    const rutsv9 = await sumrut(9); if (rutsv9) { rsv9 = rutsv9.vang }


    var nsv1thoi = 0;
    var nsv2thoi = 0;
    var nsv3thoi = 0;
    var nsv4thoi = 0;
    var nsv5thoi = 0;
    var nsv6thoi = 0;
    var nsv7thoi = 0;
    var nsv8thoi = 0;
    var nsv9thoi = 0;

    var rsv1thoi = 0;
    var rsv2thoi = 0;
    var rsv3thoi = 0;
    var rsv4thoi = 0;
    var rsv5thoi = 0;
    var rsv6thoi = 0;
    var rsv7thoi = 0;
    var rsv8thoi = 0;
    var rsv9thoi = 0;
    const sv1thoi = await sumnapThoi(1); if (sv1thoi) { nsv1thoi = sv1thoi.vang }
    const sv2thoi = await sumnapThoi(2); if (sv2thoi) { nsv2thoi = sv2thoi.vang }
    const sv3thoi = await sumnapThoi(3); if (sv3thoi) { nsv3thoi = sv3thoi.vang }
    const sv4thoi = await sumnapThoi(4); if (sv4thoi) { nsv4thoi = sv4thoi.vang }
    const sv5thoi = await sumnapThoi(5); if (sv5thoi) { nsv5thoi = sv5thoi.vang }
    const sv6thoi = await sumnapThoi(6); if (sv6thoi) { nsv6thoi = sv6thoi.vang }
    const sv7thoi = await sumnapThoi(7); if (sv7thoi) { nsv7thoi = sv7thoi.vang }
    const sv8thoi = await sumnapThoi(8); if (sv8thoi) { nsv8thoi = sv8thoi.vang }
    const sv9thoi = await sumnapThoi(9); if (sv9thoi) { nsv9thoi = sv9thoi.vang }

    const rutsv1thoi = await sumrutThoi(1); if (rutsv1thoi) { rsv1thoi = rutsv1thoi.vang }
    const rutsv2thoi = await sumrutThoi(2); if (rutsv2thoi) { rsv2thoi = rutsv2thoi.vang }
    const rutsv3thoi = await sumrutThoi(3); if (rutsv3thoi) { rsv3thoi = rutsv3thoi.vang }
    const rutsv4thoi = await sumrutThoi(4); if (rutsv4thoi) { rsv4thoi = rutsv4thoi.vang }
    const rutsv5thoi = await sumrutThoi(5); if (rutsv5thoi) { rsv5thoi = rutsv5thoi.vang }
    const rutsv6thoi = await sumrutThoi(6); if (rutsv6thoi) { rsv6thoi = rutsv6thoi.vang }
    const rutsv7thoi = await sumrutThoi(7); if (rutsv7thoi) { rsv7thoi = rutsv7thoi.vang }
    const rutsv8thoi = await sumrutThoi(8); if (rutsv8thoi) { rsv8thoi = rutsv8thoi.vang }
    const rutsv9thoi = await sumrutThoi(9); if (rutsv9thoi) { rsv9thoi = rutsv9thoi.vang }

    const ccc = {
        napsv1: nsv1, napsv2: nsv2, napsv3: nsv3, napsv4: nsv4, napsv5: nsv5, napsv6: nsv6, napsv7: nsv7, napsv8: nsv8, napsv9: nsv9,
        rutsv1: rsv1, rutsv2: rsv2, rutsv3: rsv3, rutsv4: rsv4, rutsv5: rsv5, rutsv6: rsv6, rutsv7: rsv7, rutsv8: rsv8, rutsv9: rsv9
    }
    const ccc2 = {
        napsv1: nsv1thoi, napsv2: nsv2thoi, napsv3: nsv3thoi, napsv4: nsv4thoi, napsv5: nsv5thoi, napsv6: nsv6thoi, napsv7: nsv7thoi, napsv8: nsv8thoi, napsv9: nsv9thoi,
        rutsv1: rsv1thoi, rutsv2: rsv2thoi, rutsv3: rsv3thoi, rutsv4: rsv4thoi, rutsv5: rsv5thoi, rutsv6: rsv6thoi, rutsv7: rsv7thoi, rutsv8: rsv8thoi, rutsv9: rsv9thoi
    }
    res.render('index', { page: "homnay", data: req.user, data: ccc,thoivang: ccc2 })

})
module.exports = router
