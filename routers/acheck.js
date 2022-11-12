const router = require('express').Router()
const TaiXiu = require("../models/taixiu/Cuoc")
const ChanLe = require("../models/chanle/Cuoc")
const Cuoc = require("../models/Cuoc")

router.get("/taixiu", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await TaiXiu.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("/checkcan/taixiu", { taixius })
})

router.get("/chanle", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await ChanLe.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("/checkcan/chanle", { taixius })
})

router.get("/csmm", async (req, res) => {
    let now = new Date();
    let DATE = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (req.query.day || 0));
    const taixius = await Cuoc.find({ time: { $gte: DATE } }).sort({ time: -1 })
    res.render("/checkcan/csmm", { taixius })
})
module.exports = router