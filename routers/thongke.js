const router = require('express').Router()
const Vongquayfree = require("../models/Vongquayfree")
const Vongquay = require("../models/Vongquay")
const Sodu = require("../models/Sodu")
const Gifcode = require("../models/Gifcode")
var LuckyPlayer = require("../models/Luckyplayer")


var Cuoc = require("../models/Cuoc")
var Cuockeno = require("../models/Cuockeno")
var TaiXiu = require("../models/taixiu/Lichsu")
var BauCua = require("../models/baucua/Lichsu")
var Chanle = require("../models/chanle/Lichsu")

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
router.get("/", async (req, res) => {

    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (req.query.time == "thang") {
        startOfToday = new Date(now.getFullYear(), now.getMonth());
    }
    var result = []
    var adminLost = 0
    const sumTaixiu = await TaiXiu.aggregate([{ $match: { time: { $gte: startOfToday } }, }, { $group: { _id: null, totalVangDat: { $sum: "$vangdat" }, totalVangWin: { $sum: "$vangnhan" } } }])

    if (sumTaixiu[0]) {
        var taixiu = `Đặt tài xỉu tổng: ${numberWithCommas(Math.round(sumTaixiu[0].totalVangDat))} tổng vàng thắng: ${numberWithCommas(Math.round(sumTaixiu[0].totalVangWin))}   Lời: ${numberWithCommas(Math.round(sumTaixiu[0].totalVangDat - sumTaixiu[0].totalVangWin))}`
        result.push(taixiu)
    }

    adminLost += Math.round(sumTaixiu[0].totalVangDat - sumTaixiu[0].totalVangWin)

    const sumBauCua = await BauCua.aggregate([{ $match: { time: { $gte: startOfToday } }, }, { $group: { _id: null, totalVangDat: { $sum: "$vangdat" }, totalVangWin: { $sum: "$vangnhan" } } }])
    if (sumBauCua[0]) {
        var baucua = `Đặt bầu cua tổng: ${numberWithCommas(Math.round(sumBauCua[0].totalVangDat))} tổng vàng thắng: ${numberWithCommas(Math.round(sumBauCua[0].totalVangWin))}  Lời: ${numberWithCommas(Math.round(sumBauCua[0].totalVangDat - sumBauCua[0].totalVangWin))}`
        result.push(baucua)
    }

    adminLost += Math.round(sumBauCua[0].totalVangDat - sumBauCua[0].totalVangWin)

    const sumChanLe = await Chanle.aggregate([{ $match: { time: { $gte: startOfToday } }, }, { $group: { _id: null, totalVangDat: { $sum: "$vangdat" }, totalVangWin: { $sum: "$vangnhan" } } }])
    if (sumChanLe[0]) {
        var chanle = `Đặt Chẵn lẻ tổng: ${numberWithCommas(Math.round(sumChanLe[0].totalVangDat))} tổng vàng thắng: ${numberWithCommas(Math.round(sumChanLe[0].totalVangWin))}  Lời: ${numberWithCommas(Math.round(sumChanLe[0].totalVangDat - sumChanLe[0].totalVangWin))}`
        result.push(chanle)
    }
    adminLost += Math.round(sumChanLe[0].totalVangDat - sumChanLe[0].totalVangWin)



    const sumChanLeOne = await Cuoc.aggregate([{ $match: { time: { $gte: startOfToday }, bot: false }, }, { $group: { _id: null, totalVangDat: { $sum: "$vangdat" }, totalVangWin: { $sum: "$vangnhan" } } }])
    if (sumChanLeOne[0]) {
        var chanleThuong = `Đặt Chẵn lẻ - Tài Xỉu tổng: ${numberWithCommas(Math.round(sumChanLeOne[0].totalVangDat))} tổng vàng thắng: ${numberWithCommas(Math.round(sumChanLeOne[0].totalVangWin))}  Lời: ${numberWithCommas(Math.round(sumChanLeOne[0].totalVangDat - sumChanLeOne[0].totalVangWin))}`
        result.push(chanleThuong)
    }

    adminLost += Math.round(sumChanLeOne[0].totalVangDat - sumChanLeOne[0].totalVangWin)


    const sumKeno = await Cuockeno.aggregate([{ $match: { time: { $gte: startOfToday } }, }, { $group: { _id: null, totalVangDat: { $sum: "$vangdat" }, totalVangWin: { $sum: "$vangnhan" } } }])
    if (sumKeno[0]) {
        var chanleThuongz = `Đặt Keno Xỉu tổng: ${numberWithCommas(Math.round(sumKeno[0].totalVangDat))} tổng vàng thắng: ${numberWithCommas(Math.round(sumKeno[0].totalVangWin))}  Lời: ${numberWithCommas(Math.round(sumKeno[0].totalVangDat - sumKeno[0].totalVangWin))}`
        result.push(chanleThuongz)
    }

    adminLost += Math.round(sumKeno[0].totalVangDat - sumKeno[0].totalVangWin)


    const sodus = await Sodu.find({ noidung: "Vòng quay may mắn", time: { $gte: startOfToday } })
    var Vòngquayvangf = sodus.filter((item) => !item.giaodich.includes('Kim cương')).reduce(function (sum, tax) {
        return sum + Number(tax.giaodich.replaceAll("+", "").replaceAll(",", ""));
    }, 0);

    adminLost -= Math.round(Vòngquayvangf)


    var VòngquayKimCương = sodus.filter(({ giaodich }) => giaodich.includes('Kim cương')).reduce((sum, tax) => sum + Number(tax.giaodich.replaceAll("+", "").replaceAll(" Kim cương", "")), 0);
    var chanleThuongz = `Vòng quay vàng tổng: ${numberWithCommas(Math.round(Vòngquayvangf))}`

    result.push(chanleThuongz)
    result.push(`Vòng quay kim cương tổng: ${numberWithCommas(Math.round(VòngquayKimCương))}`)

    const sumGifcode = await Gifcode.aggregate([{ $match: { time: { $gte: startOfToday } }, }, { $group: { _id: null, total: { $sum: "$phanthuong" } } }])
    if (sumGifcode[0]) {
        var chanleThuongz = `Gifcode nhập tổng: ${numberWithCommas(Math.round(sumGifcode[0].total))}`
        result.push(chanleThuongz)
    }
    adminLost -= Math.round(sumGifcode[0].total)


    const sodupickme = await Sodu.find({ giaodich: "THẮNG PICKME", time: { $gte: startOfToday } })
    var Pickme = sodupickme.reduce((sum, tax) => sum + Number(tax.noidung.replaceAll("+", "").replaceAll(",", "")), 0);
    result.push(`Pickme tổng: ${numberWithCommas(Math.round(Pickme))}`)

    adminLost -= Math.round(Pickme)


    const soduquavip = await Sodu.find({ noidung: "Nhận quà vip", time: { $gte: startOfToday } })
    var quavip = soduquavip.reduce((sum, tax) => sum + Number(tax.giaodich.replaceAll("+", "").replaceAll(",", "")), 0);
    result.push(`Nhận vip tổng: ${numberWithCommas(Math.round(quavip))}`)
    adminLost -= Math.round(quavip)



    const sodubom = await Sodu.find({ giaodich: "Bạn bị bom nổ", time: { $gte: startOfToday } })
    var bomno = sodubom.reduce((sum, tax) => sum + Number(tax.noidung.replaceAll("+", "").replaceAll(",", "")), 0);
    result.push(`Bom nổ tổng: ${numberWithCommas(Math.round(bomno))}`)
    adminLost -= Math.round(bomno)

    result.push(`--------------`)
    result.push(`Tổng doanh thu vàng: ${numberWithCommas(adminLost)}`)


    res.render('index', { page: "thongke", data: req.user, result,adminLost })
})

module.exports = router