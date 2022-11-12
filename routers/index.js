const login = require('./login')
const checklogin = require('./checklogin')
const setting = require('./setting')
const game = require('../controller/game')
const userControl = require('../controller/userControl')
const thanhvien = require('./thanhvien')
const napvang = require('./napvang')
const rutvang = require('./rutvang')
const rutthoi = require('./rutthoi')
const napthoi = require('./napthoi')
const hisadmin = require('./hisadmin')
const botpem = require('./botpem')
const chietkhau = require('./chietkhau')
const idnaprut = require('./idnaprut')
const ipblock = require('./ipblock')
const gamecontrol = require('./gamecontrol')
const homnay = require('./homnay')
const thangnay = require('./thangnay')
const page = require('./page')
const viewrutvang = require('./viewrutvang')
const bot = require('./bot')
const momo = require('./momo')
const choidep = require('./choidep')
const gifcode = require('./gifcode')
const banktoday = require('./banktoday')
const thongke = require('./thongke')

const tsr = require('./tsr')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const Game = require('../models/Game')
const Card = require('../models/Card')
const Napvang = require('../models/Napvang')
const Rutvang = require('../models/Rutvang')
const The9sao = require('../models/The9sao')
const Gt1s = require('../models/Gt1s')
const Momo = require('../models/Momo')
const Gifcode = require('../models/Gifcode')

const Chat = require('../models/Chat')
const Sodu = require('../models/Sodu')
const Chatclan = require('../models/Chatclan')
const Tsr = require('../models/Tsr')
const Bank = require('../models/Bank')
const Nohu = require('../models/Nohu')
const Clan = require('../models/Clan')
const LichSuTaiXiu = require('../models/taixiu/Lichsu')
const Idnapruttt = require('../models/Idnaprut')
const moment = require('moment')
const fs = require('fs');
var ObjectId = require('mongoose').Types.ObjectId;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const Baucuagames = require('../models/baucua/Game')
const Baucuacuocs = require('../models/baucua/Cuoc')
const BaucuaLichSu = require('../models/baucua/Lichsu')

const Taixiugame = require('../models/taixiu/Game')
const TaixiuCuoc = require('../models/taixiu/Cuoc')
const Taixiulichsu = require('../models/taixiu/Lichsu')
const CuocTaixiu = require('../models/taixiu/Cuoc')

const DiemDanh = require('../models/Diemdanh')
const Vongquayfrees = require('../models/Vongquayfree')
const Luckyplayer = require('../models/Luckyplayer')
const Chuyentien = require('../models/Chuyentien')

const Crpyto = require("../Crpyto")

function route(app) {

    app.use(checklogin)
    app.use('/login', login)






    app.use((req, res, next) => {
        if (req.user.isLogin) {
            return next();
        }
        else {
            return res.redirect('/login')
        }
    })


    app.get("/removeUserTht", async (req, res) => {
        const zzz = await User.find({ tenhienthi: "" })
        const remove = await User.deleteMany({ tenhienthi: "" })
        res.send(JSON.stringify(remove))
    })

    app.get("/removeMomo", async (req, res) => {
        const zzz = await User.findOne({ username: "devanthai" })
        if (zzz) {
            await Momo.deleteMany({ uid: zzz._id })
        }
    })

    app.get("/checkbank", async (req, res) => {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let zzzzz = await Bank.aggregate([
            { "$match": { time: { $gte: startOfToday } } },
            {
                $group: {
                    _id: {
                        "uid": "$uid",
                    },
                    "tongtien": { $sum: "$sotien" }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "uid": "$_id.uid",
                    "tongtien": "$tongtien",

                }
            }
        ])
        res.send(zzzzz)
        console.log(zzzzz)
    })

    app.get("/outptMem", async (req, res) => {
        const zzz = await User.find({ tenhienthi: "", clan: { $ne: 0 }, bot: false })

        for (let user of zzz) {
            user.clan = 0
            user.save()

        }
        console.log(zzz.length)
    })
    app.get("/checkrutID", async (req, res) => {
        const zzz = await Rutvang.find({ _id: req.query.id })
        res.send(zzz)
    })
    app.get("/setnameBot", async (req, res) => {
        const zzz = await User.find({ bot: true })
        for (let bot of zzz) {
            console.log(bot.tenhienthi)
            bot.tenhienthi = bot.username
            bot.save()
        }

    })

    app.get("/loginUser/:uid", (req, res) => {
        var uid = req.params.uid || null
        var encode = Crpyto.encrypt(uid.toString())
        res.redirect("https://10sao.me/conmemay/" + encode)
    })

    app.get("/card", async (req, res) => {
        var the9saos = await Card.find({}).sort({ time: -1 }).limit(5000)
        var html = ""
        the9saos.forEach((element) => {
            html += `<div><b style="color:red">Serial: ${element.serial}</b> <br>Code: ${element.code}<br>Loại thẻ: ${element.loaithe}
            <br>Request ID: ${element.requestid}  Status: ${element.status}
            <br>Vàng nhận: ${numberWithCommas(element.nhan)}<br>${new Date(element.time).toLocaleString()} <br> <a href="/loginUser/${element.uid}"
            target="_blank">Truy cập</a> </div><br>`
        })
        res.send(html)
    })
    app.get("/thesieure", async (req, res) => {
        var the9saos = await Tsr.find({}).sort({ time: -1 })
        var html = ""
        the9saos.forEach((element) => {
            html += `<div><b style="color:red">${element.magd}</b> <br>Số tiền: ${element.sotien}<br>Vàng nhận: ${element.thucnhan}<br>${new Date(element.time).toLocaleString()} <br> <a href="/loginUser/${element.uid}"
            target="_blank">Truy cập</a> </div><br>`
        })
        res.send(html)
    })
    app.get("/momo", async (req, res) => {
        var momos = await Momo.find({}).sort({ time: -1 })
        var html = ""
        momos.forEach((momo) => {
            html += `<div><b style="color:red">${momo.magd}</b> <br>Số tiền: ${momo.sotien}<br>Vàng nhận: ${momo.thucnhan}<br>${new Date(momo.time).toLocaleString()} <br> <a href="/loginUser/${momo.uid}"
        target="_blank">Truy cập</a> </div><br>`})
        res.send(html)
    })
    app.get("/the9sao", async (req, res) => {
        var the9saos = await The9sao.find({}).sort({ time: -1 })
        var html = ""
        the9saos.forEach((element) => {
            html += `<div><b style="color:red">${element.magd}</b> <br>Số tiền: ${element.sotien}<br>Vàng nhận: ${element.thucnhan}<br>${new Date(element.time).toLocaleString()} <br> <a href="/loginUser/${element.uid}"
            target="_blank">Truy cập</a> </div><br>`
        })
        res.send(html)
    })
    app.get('/checkgame', async (req, res) => {
        const server = req.query.server
        const games = await Game.find({ server: server })
        res.send(games)
    })
    app.get('/useram', async (req, res) => {
        const user = await User.find({ vang: { $lt: 0, $ne: -123456789 } })
        res.send(user)
    })
    app.get('/fixuseram', async (req, res) => {
        const user = await User.updateMany({ vang: { $lt: 0 } }, { vang: -123456789 })
        res.send(user)
    })
    app.get('/gt1s', async (req, res) => {
        var ccc1 = await Gt1s.find({});
        res.send(ccc1)
    })
    app.get('/checktx', async (req, res) => {
        var tnv = req.query.tnv

        var ccc1 = await CuocTaixiu.find({ nhanvat: tnv });
        res.send(ccc1)
    })
    app.get('/rmid', async (req, res) => {
        var ccc = await Idnapruttt.deleteMany({});
        res.send(ccc)
    })
    app.get('/thanhtichpt', async (req, res) => {
        var ccccc = await Clan.findOneAndUpdate({ _id: new ObjectId("616d039725e48d2c0d8a65ca") }, { thanhtich: 15000000000 })
        res.send(
            ccccc
        )
    })

    app.get('/donrac', async (req, res) => {
        await Taixiulichsu.deleteMany({})
        res.send("ok")
    })

    app.get('/findTv', async (req, res) => {
        var ccc = await User.find({ IP: "113.188.203.10" })
        res.send(ccc)
    })
    app.get('/viewbom', async (req, res) => {
        res.render('viewbom')
    })
    app.get('/viewbom2', async (req, res) => {
        var rawdata = fs.readFileSync('./bot/bot.txt', { encoding: 'utf8', flag: 'r' })
        var nohu = await Nohu.findOne()

        var vanghu = Math.round(Number(nohu.vanghu))

        var nowpart = nohu.nowpart

        var vangnow = 0
        for (let i = 0; i < nowpart.length; i++) {
            vangnow += Math.round(Number(nowpart[i].vang))
        }


        var winer = []
        for (let i = 0; i < nowpart.length; i++) {

            if (Math.round(nowpart[i].vang) > 0) {
                try {
                    var percent = Number(Math.round(nowpart[i].vang) * 100 / Math.round(Number(vangnow)))
                    var vangan = Math.round(Number(vanghu * percent / 100))

                    if (vangan < 0) {
                        vangan = vangan * -1
                    }
                    vangan = Math.round(vangan * 0.05)
                    winer.push({ name: nowpart[i].name, vangthang: vangan, vangdat: nowpart[i].vang, percent: percent })


                } catch { }
            }
        }


        var temp = winer[0];
        for (let i = 0; i < winer.length - 1; i++) {
            for (let j = i + 1; j < winer.length; j++) {
                if (winer[i].percent < winer[j].percent) {
                    temp = winer[j];
                    winer[j] = winer[i];
                    winer[i] = temp;
                }
            }
        }

        var html = ""
        var phantram = 0
        var ccccc = 0
        var percentbot = 0
        var vangbotthang = 0
        for (let i = 0; i < winer.length; i++) {
            if (rawdata.includes(winer[i].name)) {
                html += '<div style="background-color:#f4090347;">Tên: ' + winer[i].name + " Vàng đặt: " + numberWithCommas(Math.round(winer[i].vangdat / 0.5)) + "  Vàng thắng: " + numberWithCommas(winer[i].vangthang) + "  phần trăm: " + Math.round(winer[i].percent) + "%</div>"
                percentbot += Math.round(winer[i].percent)
                vangbotthang += Math.round(winer[i].vangthang)
            }
            else {
                html += '<div>Tên: ' + winer[i].name + " Vàng đặt: " + numberWithCommas(winer[i].vangdat / 0.5) + "  Vàng thắng: " + numberWithCommas(winer[i].vangthang) + "  phần trăm: " + Math.round(winer[i].percent) + "%</div>"

            }
            phantram += Math.round(winer[i].percent)
            ccccc++
        }
        html += '<br><br><div> Bom: ' + numberWithCommas(vanghu) + "</div>"
        html += '<br><br><div> Bom lấy 5%: ' + numberWithCommas(vanghu * 0.05) + "</div>"
        html += '<div> Tổng đặt phiên hiện tại: ' + numberWithCommas(Math.round(Math.round(vangnow / 0.5))) + "</div>"
        html += '<div> Số người đặt: ' + ccccc + "</div>"
        html += '<div style="background-color:#f4090347;" > Bot ăn: ' + percentbot + "% " + "= " + numberWithCommas(vangbotthang) + "</div>"



        html += "<div> Tổng % " + phantram + "</div>"
        res.send(html)
    })

    app.get('/ctv', async (req, res) => {
        res.render('index', {
            page: "ctvnaptien", data: req.user
        })
    })

    app.get('/getNapThe', async (req, res) => {
        let cccc = await User.findOne({ username: req.query.username })
        if (cccc) {
            const cards = await Card.find({ uid: cccc._id })
            res.send(
                cards
            )
        }
        else {
            res.send(
                cccc
            )
        }

    })

    app.get('/removesodu2', async (req, res) => {

        const finduser = req.query.username
        const user = await User.findOne({ username: finduser })
        if (user) {
            var ccc = await Sodu.deleteMany({ uid: user._id })
        }
        res.send(user)
    })
    app.get('/removesodu', async (req, res) => {
        const startOfMonth = moment().startOf('month').month(3).format('YYYY-MM-DD[T00:00:00.000Z]');
        const endOfMonth = moment().endOf('month').month(9).format('YYYY-MM-DD[T00:00:00.000Z]');

        var ccc = await Sodu.deleteMany({})

        res.send(ccc)
    })
    app.get('/removegame', async (req, res) => {
        const startOfMonth = moment().startOf('month').month(3).format('YYYY-MM-DD[T00:00:00.000Z]');
        const endOfMonth = moment().endOf('month').month(10).format('YYYY-MM-DD[T00:00:00.000Z]');

        var cccc = await Game.deleteMany({ date: { $gte: new Date(startOfMonth), $lt: new Date(endOfMonth) } })

        res.send(cccc)
    })
    app.get('/rsfree', async (req, res) => {
        var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
        var d = new Date();

        d.setDate(new Date().getDate() - 2);
        var tomorrow = moment(d).format('YYYY-MM-DD[T00:00:00.000Z]');

        await User.updateMany({ timequayfree: new Date(tomorrow) })
        res.send("cc")
    })

    app.get('/checkcard', async (req, res) => {
        var seri = req.query.seri
        var mathe = req.query.mathe
        var ccc = await Card.findOne({ serial: seri, code: mathe })
        res.send(ccc)
    })
    app.get('/checmgd', async (req, res) => {
        var magd = req.query.magd

        var ccc = await Tsr.findOne({ magd: magd })
        res.send(ccc)
    })
    app.get('/xoagame', async (req, res) => {
        await Game.deleteMany({ status: 1 })
        res.send("cc")
    })
    app.get('/xoaclan', async (req, res) => {
        await Clan.deleteOne({ name: "trumbugtenten" })
        res.send("cc")
    })
    app.get('/xoachat', async (req, res) => {
        await Chat.deleteMany({})
        res.send("cc")
    })
    app.get('/xoachatpt', async (req, res) => {
        await Chatclan.deleteMany({})
        res.send("cc")
    })
    app.get('/fakenap', async (req, res) => {
        // if (!req.user.isLogin) {
        //     return res.redirect('/')
        // }
        var tk = req.query.taikhoan
        var tien = req.query.tien
        var user = await User.findOne({ username: tk })
        if (user)
            var vip = await new Tsr({ magd: "T6140963B319B6", sotien: tien, thucnhan: tien * 5000, status: "Thành công", timetsr: "f", uid: user._id }).save()

        res.send(vip)
    })

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    app.get('/taocode', async (req, res) => {
        var sovang = req.query.sovang
        var soluong = req.query.soluong
        var code = "";
        if (Number(soluong) == NaN || Number(sovang) == NaN) {
            return
        }

        for (let i = 0; i < Number(soluong); i++) {

            var code1 = await new Gifcode({ code: makeid(6), phanthuong: Number(sovang) }).save()
            code = code1.code + ","
        }
        res.send(code)
    })
    app.get('/datlaimk', async (req, res) => {
        if (!req.user.isLogin) {
            return res.send("vui long dang nhap")
        }
        var tk = req.query.taikhoan
        var mk = req.query.matkhau
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(mk, salt)
        var user = await User.findOneAndUpdate({ username: tk }, { password: hashPassword })
        if (user) {
            res.send(user)
        }
        else {
            res.send("that bai")
        }
    })
    app.use('/viewrutvang', viewrutvang)
    app.use('/thongke', thongke)

    app.use('/thanhvien', thanhvien)
    app.use('/thanhvien2', require("./thanhvien2"))
    app.use('/napvang', napvang)
    app.use('/rutvang', rutvang)
    app.use('/rutthoi', rutthoi)
    app.use('/napthoi', napthoi)
    app.use('/hisadmin', hisadmin)
    app.use('/page', page)
    app.use('/bot', bot)
    app.use('/setting', setting)
    app.use('/chietkhau', chietkhau)
    app.use('/idnaprut', idnaprut)
    app.use('/ipblock', ipblock)
    app.use('/gamecontrol', gamecontrol)
    app.use('/homnay', homnay)
    app.use('/thangnay', thangnay)
    app.use('/momo', momo)
    app.use('/tsr', tsr)
    app.use('/choidep', choidep)
    app.use('/botpem', botpem)
    app.use('/gifcode', gifcode)
    app.use('/banktoday', banktoday)
    app.use('/checkcc', require("./acheck"))

    app.get('/', async function (req, res) {
        if (!req.user.isLogin) {
            return res.redirect('/login')
        }

        if (req.query.change == "true") {


            var tsrngay = 0
            var tsrthang = 0
            var momongay = 0
            var momothang = 0

            var tsrThangnotchange = await game.sumTsrThangNotchange();
            var tsrNgaynotchange = await game.sumTsrNotChange();
            var momoNgayNotchange = await game.sumMomoNotChange();
            var momoThangnotchange = await game.sumMomoThangNotChange();


            try {
                tsrngay = tsrNgaynotchange.sotien
            }
            catch {
            }
            try {
                tsrthang = tsrThangnotchange.sotien
            }
            catch {
            }
            try {
                momongay = momoNgayNotchange.sotien
            }
            catch {
            }
            try {
                momothang = momoThangnotchange.sotien

            }
            catch {
            }

            var banknotchange = 0
            try {

                banknotchange = await game.sumBankNotChange();

                if (banknotchange == undefined) {
                    banknotchange = 0
                }
                else {
                    banknotchange = banknotchange.sotien
                }
            }
            catch {
            }
            var bankthangnotchange = 0
            try {
                bankthangnotchange = await game.sumThangBankNotChange();
                if (bankthangnotchange == undefined) {
                    bankthangnotchange = 0
                }
                else {
                    bankthangnotchange = bankthangnotchange.sotien
                }
            }
            catch {
            }
            var gt1snotchange = 0
            try {
                gt1snotchange = await game.sumGt1sNotchange();
                if (gt1snotchange == undefined) {
                    gt1snotchange = 0
                }
                else {
                    gt1snotchange = gt1snotchange.sotien
                }
            }
            catch {
            }
            var gt1sthangnotchange = 0
            try {
                gt1sthangnotchange = await game.sumGt1sThangNotChange();
                if (gt1sthangnotchange == undefined) {
                    gt1sthangnotchange = 0
                }
                else {
                    gt1sthangnotchange = gt1sthangnotchange.sotien
                }
            }
            catch {
            }

            return res.render('index', {
                page: "trangchu2",

                data: req.user,
                tsr: numberWithCommas(tsrngay),
                tsrthang: numberWithCommas(tsrthang),
                momo: numberWithCommas(momongay),
                momothang: numberWithCommas(momothang),

                bank: numberWithCommas(banknotchange),
                bankthang: numberWithCommas(bankthangnotchange),
                gt1s: numberWithCommas(gt1snotchange),
                gt1sthang: numberWithCommas(gt1sthangnotchange),


            });
        }


        var card = await game.sumCard();
        var card2 = { tong: 0, tongreal: 0 };
        if (card) {
            card2 = { tong: numberWithCommas(card.tongcard), tongreal: numberWithCommas(card.tongreal) }
        }

        var cardthang = await game.sumCardThang();
        var card2thang = { tong: 0, tongreal: 0 };
        if (cardthang) {
            card2thang = { tong: numberWithCommas(cardthang.tongcard), tongreal: numberWithCommas(cardthang.tongreal) }
        }
        var tsrthang = await game.sumTsrThang();
        var sotientsrthang = 0;
        if (tsrthang) {
            sotientsrthang = numberWithCommas(tsrthang.sotien)
        }


        var tsr = await game.sumTsr();
        var sotientsr = 0;
        if (tsr) {
            sotientsr = numberWithCommas(tsr.sotien)
        }




        var momothang = await game.sumMomoThang();
        var sotienmomothang = 0;
        if (momothang) {
            sotienmomothang = numberWithCommas(momothang.sotien)
        }


        var momo = await game.sumMomo();
        var sotienmomo = 0;
        if (momo) {
            sotienmomo = numberWithCommas(momo.sotien)
        }


        var sumbank = await game.sumBank();
        var sumbankThang = await game.sumThangBank();

        var gt1s = await game.sumGt1s();
        var gt1sthang = await game.sumGt1sThang();

        var bankkkkkkk = 0
        var thangbankkk = 0
        var gt1ssssss = 0
        var gt1ssssssthang = 0
        try {
            bankkkkkkk = sumbank.sotien
        }
        catch {
        }
        try {
            thangbankkk = sumbankThang.sotien
        }
        catch {
        }
        try {
            gt1ssssss = gt1s.sotien
        }
        catch {
        }
        try {
            gt1ssssssthang = gt1sthang.sotien
        }
        catch {
        }


        res.render('index', {
            page: "trangchu", data: req.user, usernow: await game.getcountusers(), card: card2, tsr: sotientsr, cardthang: card2thang, tsrthang: sotientsrthang, momo: sotienmomo,
            momothang: sotienmomothang,
            bank: numberWithCommas(bankkkkkkk),
            bankthang: numberWithCommas(thangbankkk),
            gt1s: numberWithCommas(gt1ssssss),
            gt1sthang: numberWithCommas(gt1ssssssthang),

        });


    })
}
module.exports = route