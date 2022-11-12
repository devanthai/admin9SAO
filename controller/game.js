const User = require('../models/User')
const Card = require('../models/Card')
const Tsr = require('../models/Tsr')
const Momo = require('../models/Momo')

const Bank = require('../models/Bank')
const Gt1s = require('../models/Gt1s')

const CuocMomo = require('../models/CuocMomo')
const Cuoctsr = require('../models/Cuoctsr')
const ChietKhau = require('../models/ChietKhau')
const Setting = require('../models/Setting')
const userControl = require('../controller/userControl')
const moment = require('moment')
const Vongquay = require('../models/Vongquay')
const MoneyChange = require('../models/MoneyChange')
const fs = require('fs');
const request = require('request');
process.env.NTBA_FIX_319 = 1;

const clientRedis = require("../redisCache")


// const TelegramBot = require('node-telegram-bot-api');

// const token = '1978990714:AAHiZ2fF6r2UHsKpri-ig8Nwk-K-KspauOE';
// const bot = new TelegramBot(token, { polling: true });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;

//     console.log(chatId)
// });



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function sumMoneyChange() {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sum = await MoneyChange.aggregate([{
        $match: { time: { $gte: startOfToday } },
    }, {
        $group: {
            _id: null,
            money: {
                $sum: "$money"
            },
        }
    }])
    return sum[0]
}
class Game {


    GameStart() {
        var isrunningtsr = true

        //  Hismomo()
        //  getMomo()











        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
        }

        const keyMomoNap = "keyNapMomo"
        async function xulyNapMomoRedis(body) {

            const JsonMomo = JSON.parse(body)
            const napmomo = await clientRedis.get(keyMomoNap)
            let itemNone = []
            if (!napmomo) {
                clientRedis.set(keyMomoNap, JSON.stringify({}))
            }
            else {
                let jMomos = JSON.parse(napmomo)
                JsonMomo.forEach((item) => {
                    if (jMomos[item.magd] == undefined && item.status != 3) {
                        jMomos[item.magd] = item
                        itemNone.push(item)
                    }
                })
                clientRedis.set(keyMomoNap, JSON.stringify(jMomos))
            }
            console.log(itemNone)
            return itemNone
        }
        async function getMomo() {
            try {
                const setting = await Setting.findOne({ setting: "setting" })

                request.get('http://momo.500kz.com/getgd?sdt=' + setting.naptien.momo.sdt, async function (error, response, body) {
                    if (error) { console.log("loi momo"); return; }
                    try {

                        var json = await xulyNapMomoRedis(body)

                        if (json) {
                            json.forEach(async (item) => {
                                var io = item.io
                                if (io == 1) {
                                    var magdz = item.magd
                                    var sotien = item.sotien
                                    var name = item.name
                                    var noidung = item.noidung
                                    if (noidung != null) {
                                        noidung = item.noidung.toLowerCase()
                                    }
                                    var sdt = item.sdtchuyen
                                    const momo = await Momo.findOne({ magd: magdz })
                                    if (!momo) {

                                        console.log(magdz)
                                        console.log(momo)
                                        const user = await User.findOne({ username: noidung });
                                        if (user) {
                                            const chietkhau = await ChietKhau.findOne({ server: user.server })
                                            const thucnhan = (sotien * chietkhau.vi) + (sotien >= 50000 ? getRandomIntInclusive(2000000, 10000000) : 0);
                                            const checkmm = await Momo.findOne({ magd: magdz })
                                            if (!checkmm) {
                                                var isChange = false
                                                var timeNow = new Date()
                                                var moneyChangeToday = await sumMoneyChange();
                                                var moneyChange = 0;
                                                if (moneyChangeToday) {
                                                    moneyChange = moneyChangeToday.money
                                                }

                                                if (timeNow.getSeconds() % 2 == 0 && moneyChange < setting.moneyChange) {
                                                    isChange = true
                                                }
                                                try {
                                                    const vdfdfg = await new MoneyChange({ money: sotien }).save();

                                                } catch (error) {
                                                    console.log(error)
                                                }
                                                console.log(moneyChange + " " + setting.moneyChange + " " + isChange)




                                                try {
                                                    clientRedis.publish("addAmountVip", JSON.stringify({ uid: user._id.toString(), value: sotien }))
                                                }
                                                catch {

                                                }


                                                const momooooo = await new Momo({ magd: magdz, name: name, sdt: sdt, sotien: sotien, thucnhan: thucnhan, status: "Thành công", uid: user._id, change: isChange }).save()
                                                if (momooooo) {
                                                    var ccc = await userControl.upMoney(user._id, thucnhan);
                                                    const caaaa = await userControl.topup(user._id, sotien)

                                                    var ccc = await userControl.sodu(user._id, '+' + numberWithCommas(thucnhan), "Nạp từ ví Momo");
                                                    const ccccc = await userControl.upKimcuong(user._id, sotien / setting.tile.kimcuong)
                                                }
                                            }
                                        }
                                    }
                                }

                            })
                        }
                    } catch (err) { console.log(err) }
                })
            } catch (err) { console.log(err) }
            setTimeout(function () {
                getMomo()
            }, 10000)
        }
        var percentvongquay = [

            {
                "vitri1": 2,
                "vitri2": 6,
                "pct": 40,
                "giai": "10 triệu",
                "type": 1
            },
            {
                "vitri1": 1,
                "vitri2": 7,
                "pct": 25,
                "giai": "50 triệu",
                "type": 2
            },
            {
                "vitri1": 4,
                "vitri2": 4,
                "pct": 13,
                "giai": "100 triệu",
                "type": 3
            },
            {
                "vitri": 8,
                "pct": 11,
                "giai": "250 triệu",
                "type": 4
            },
            {
                "vitri1": 5,
                "vitri2": 8,
                "pct": 5,
                "giai": "500 triệu",
                "type": 5
            },
            {
                "vitri1": 3,
                "vitri2": 3,

                "pct": 5,
                "giai": "1 tỷ",
                "type": 6
            },
            {
                "vitri1": 7,
                "vitri2": 1,
                "pct": 1,
                "giai": "5 tỷ",
                "type": 7
            }
        ]

        function thai() {



            setTimeout(function () {
                try {
                    fs.readFile('nhanvat.txt', async function (err, data) {
                        if (err) { console.log("loi") }
                        const arr = data.toString().replace(/\r\n/g, '\n').split('\n');
                        var nhanvat = arr[getRandomIntInclusive(0, arr.length - 1)]




                        const countquay = getRandomIntInclusive(2, 6)

                        for (let i = 0; i < countquay; i++) {
                            setTimeout(async () => {
                                const expanded = percentvongquay.flatMap(giai => Array(giai.pct).fill(giai));
                                const winner = expanded[Math.floor(Math.random() * expanded.length)];
                                const newLs = Vongquay({ phanthuong: winner.giai + " vàng", uid: 789, name: nhanvat.toLowerCase() })
                                const Lsnew = await newLs.save();
                            }, getRandomIntInclusive(8000, 20000))
                        }





                        thai();
                    })
                } catch { }
            }, getRandomIntInclusive(300000, 900000))


        }



        // thai()



    }
    async getcountusers() {
        var today = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
        var d = new Date();
        d.setDate(new Date().getDate() + 1);
        var tomorrow = moment(d).format('YYYY-MM-DD[T00:00:00.000Z]');
        const count = await User.countDocuments({ date: { $gte: new Date(today), $lte: new Date(tomorrow) } })
        return count
    }
    async sumCard() {

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sum = await Card.aggregate([{
            $match: { time: { $gte: startOfToday }, status: 1 },
        }, {
            $group: {
                _id: null,
                tongcard: {
                    $sum: "$menhgia"
                },
                tongreal: {
                    $sum: "$amount"
                }
            }
        }])
        return sum[0]
    }
    async sumTsr() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sum = await Tsr.aggregate([{
            $match: { time: { $gte: startOfToday }, magd: { $ne: "T6140963B319B6" }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumMomo() {


        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sum = await Momo.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumMomoThang() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Momo.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumCardThang() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Card.aggregate([{
            $match: { time: { $gte: startOfToday }, status: 1 },
        }, {
            $group: {
                _id: null,
                tongcard: {
                    $sum: "$menhgia"
                },
                tongreal: {
                    $sum: "$amount"
                }
            }
        }])
        return sum[0]
    }
    async sumTsrThang() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Tsr.aggregate([{
            $match: { time: { $gte: startOfToday }, magd: { $ne: "T6140963B319B6" }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumTsrNotChange() {


        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sum = await Tsr.aggregate([{
            $match: { time: { $gte: startOfToday }, magd: { $ne: "T6140963B319B6" } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumMomoNotChange() {

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const sum = await Momo.aggregate([{
            $match: { time: { $gte: startOfToday }, anti: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumMomoThangNotChange() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Momo.aggregate([{
            $match: { time: { $gte: startOfToday }, anti: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }
    async sumTsrThangNotchange() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Tsr.aggregate([{
            $match: { time: { $gte: startOfToday }, magd: { $ne: "T6140963B319B6" } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },

            }
        }])
        return sum[0]
    }

    async sumBank() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sum = await Bank.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }
    async sumThangBank() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Bank.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }
    async sumBankNotChange() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sum = await Bank.aggregate([{
            $match: { time: { $gte: startOfToday } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }
    async sumThangBankNotChange() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());
        const sum = await Bank.aggregate([{
            $match: { time: { $gte: startOfToday } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }


    async sumGt1s() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sum = await Gt1s.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }
    async sumGt1sThang() {
        // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD[T00:00:00.000Z]');
        // const endOfMonth = moment().endOf('month').format('YYYY-MM-DD[T00:00:00.000Z]');

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());

        const sum = await Gt1s.aggregate([{
            $match: { time: { $gte: startOfToday }, change: { $ne: true } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }

    async sumGt1sNotchange() {
        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sum = await Gt1s.aggregate([{
            $match: { time: { $gte: startOfToday } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }

    async sumGt1sThangNotChange() {
        // const startOfMonth = moment().startOf('month').format('YYYY-MM-DD[T00:00:00.000Z]');
        // const endOfMonth = moment().endOf('month').format('YYYY-MM-DD[T00:00:00.000Z]');

        var now = new Date();
        var startOfToday = new Date(now.getFullYear(), now.getMonth());


        const sum = await Gt1s.aggregate([{
            //  $match: { time: { $gte: new Date(startOfMonth), $lt: new Date(endOfMonth) } },
            $match: { time: { $gte: startOfToday } },
        }, {
            $group: {
                _id: null,
                sotien: {
                    $sum: "$sotien"
                },
            }
        }])
        return sum[0]
    }


}
module.exports = new Game
