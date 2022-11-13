const router = require('express').Router()
const TaiXiu = require("../models/taixiu/Cuoc")
const ChanLe = require("../models/chanle/Cuoc")
const TaiXiu2 = require("../models/taixiu/Lichsu")
const ChanLe2 = require("../models/chanle/Lichsu")
const Cuoc = require("../models/Cuoc")

router.get("/taixiu", async (req, res) => {


    let time = req.query.start;

    let [dateValues, timeValues] = time.split(' ');

    let [month, day, year] = dateValues.split('/');
    let [hours, minutes, seconds] = timeValues.split(':');

    const dateStart = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

    time = req.query.end
    [dateValues, timeValues] = time.split(' ');

    [month, day, year] = dateValues.split('/');
    [hours, minutes, seconds] = timeValues.split(':');

    const dateEnd = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

    console.log(dateStart,dateEnd)

    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await TaiXiu.find({ time: { $gte: DATE } }).sort({ time: -1 })
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