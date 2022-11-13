const router = require('express').Router()
const TaiXiu = require("../models/taixiu/Cuoc")
const ChanLe = require("../models/chanle/Cuoc")
const TaiXiu2 = require("../models/taixiu/Lichsu")
const ChanLe2 = require("../models/chanle/Lichsu")
const Cuoc = require("../models/Cuoc")


startMid = (req, res, next) => {
    let time = req.query.start;

    let [dateValues, timeValues] = time.split(' ');

    let [month, day, year] = dateValues.split('/');
    let [hours, minutes, seconds] = timeValues.split(':');

    const dateStart = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    req.dateStart = dateStart
    next()
}
endMid = (req, res, next) => {
    let time = req.query.end;

    let [dateValues, timeValues] = time.split(' ');

    let [month, day, year] = dateValues.split('/');
    let [hours, minutes, seconds] = timeValues.split(':');

    const dateStart = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    req.dateEnd = dateStart
    next()
}
router.get("/taixiu", startMid, endMid, async (req, res) => {


   

    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await TaiXiu.find({ time: { $gte: req.dateStart, $lte: req.dateEnd } }).sort({ time: -1 })
    res.render("checkcan/taixiu", { taixius })
})

router.get("/chanle", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await ChanLe.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("checkcan/chanle", { taixius })
})


router.get("/taixiu2", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await TaiXiu2.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("checkcan/taixiu", { taixius })
})

router.get("/chanle2", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await ChanLe2.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("checkcan/chanle", { taixius })
})

router.get("/csmm", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await Cuoc.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("checkcan/csmm", { taixius })
})
module.exports = router