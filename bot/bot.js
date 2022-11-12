const mongoose = require('mongoose');
const Cuoc = require('../models/Cuoc')
const Game = require('../models/Game')
const Clan = require('../models/Clan')
const User = require('../models/User')
const Nohu = require('../models/Nohu')
const userControl = require('../controller/userControl')
const fs = require('fs');
mongoose.connect('mongodb://localhost:27017/thaiDb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Bot Connected to db'));
const { getCuocCsmmUserRedis, getCuocCsmmRedis, updateCuocCsmmRedisId, addCuocCsmmRedisUser, addCuocCsmmRedis } = require("../CuocRedisManager")
getrandomvang = (min, max) => {
    var rd = random(min, max.toFixed(2))
    if (rd > 9) {
        rd = (Math.round(rd / 10) * 10)
    }
    return rd * 1000000
}
randomserverCuoc = () => {
    percent = [
        { server: 1, pct: 1 },
        { server: 2, pct: 1 },
        { server: 3, pct: 1 },
        { server: 4, pct: 1 },
        { server: 5, pct: 1 },
        { server: 6, pct: 1 },
        { server: 7, pct: 1 },
        { server: 8, pct: 1 },
        { server: 9, pct: 1 },
        { server: 10, pct: 91 }
    ];
    const expanded = percent.flatMap(percentz => Array(percentz.pct).fill(percentz));
    const server = expanded[Math.floor(Math.random() * expanded.length)];
    return server.server
}
getRandomCuoc = () => {
    percent = [
        { type: 0, value: 0, pct: 20 },
        { type: 0, value: 1, pct: 20 },
        { type: 0, value: 2, pct: 20 },
        { type: 0, value: 3, pct: 20 },
        { type: 4, value: 0, pct: 5 },
        { type: 4, value: 1, pct: 5 },
        { type: 4, value: 2, pct: 5 },
        { type: 4, value: 3, pct: 5 }
    ];
    const expanded = percent.flatMap(percentz => Array(percentz.pct).fill(percentz));
    const aaaaa = expanded[Math.floor(Math.random() * expanded.length)];
    return aaaaa
}
getBot = () => {
    var botfile = fs.readFileSync('./bot.txt', { encoding: 'utf8', flag: 'r' })
    const arr = botfile.toString().replace(/\r\n/g, '\n').split('\n');
    return arr //console.log(arr)
}
datcuoc = async (botname, phienChay, vang) => {

    var rdvang = vang

    var userbot = await User.findOne({ username: botname })
    if (!userbot) {
        await new User({ username: botname, tenhienthi: botname, password: '$2a$10$2jXOzBJF/.bgIjPiMMufEOcapyvCW6DWGQqtB88N8Ssh8WYdIwjqW', bot: true, server: 1, vang: 2000000000, kimcuong: 2 }).save()
        return false
    }
    else {
        if (userbot.bot == true) {
            var getrancuoc = getRandomCuoc()
             const cuoczzz = new Cuoc({ phien: phienChay._id, server: phienChay.server, vangdat: rdvang, bot: true, type: getrancuoc.type, chon: getrancuoc.value, uid: userbot._id, nhanvat: botname })
            await addCuocCsmmRedis(cuoczzz)
            await cuoczzz.save()
            var vangpercent = rdvang - (rdvang * 85 / 100)
            var nohu = await Nohu.findOne()
            var nowpart = nohu.nowpart
            var foundIndex = nowpart.findIndex(x => x.name == userbot.username);

            if (foundIndex != -1) {
                nowpart[foundIndex].vang += Math.round(vangpercent);
            }
            else {
                nowpart.push({ vang: Math.round(vangpercent), name: userbot.username, uid: userbot._id })
            }
            const thanhtich = await userControl.upThanhtich(userbot._id, rdvang)
            const sodu = await userControl.sodu(userbot._id, "Cược con số may mắn", "-" + numberWithCommas(rdvang))
            await Nohu.findOneAndUpdate({}, { nowpart: nowpart, $inc: { vanghu: Math.round(vangpercent) } })
            var type = getrancuoc.type
            var value = getrancuoc.value
            if (type == 0) {
                if (value == 0) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: rdvang } })

                }
                else if (value == 1) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: rdvang } })

                }
                else if (value == 2) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangtai: rdvang } })

                }
                else if (value == 3) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangxiu: rdvang } })

                }
            }
            else if (type == 4) {
                if (value == 0) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: rdvang, vangtai: rdvang } })

                }
                else if (value == 1) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangchan: rdvang, vangxiu: rdvang } })

                }
                else if (value == 2) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: rdvang, vangtai: rdvang } })

                }
                else if (value == 3) {
                    await Game.updateOne({ _id: phienChay._id }, { $inc: { vangle: rdvang, vangxiu: rdvang } })

                }
            }
        }
    }
    return true
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}


var indexBot = Number(fs.readFileSync('./counter.txt', { encoding: 'utf8', flag: 'r' }))

var botRunning = []
var lastphien = ""
var countPut = 0
var lastserver = 0

writeCounter = async (couter) => {
    await fs.writeFileSync('./counter.txt', couter + "");
}


readSetting = () => {
    return JSON.parse(fs.readFileSync('./setting.json', { encoding: 'utf8', flag: 'r' }))
}



autoBot()
async function autoBot() {

    try {


        var start = Date.now()

        if (readSetting().auto == "off") {
            return
        }
        if (indexBot > getBot().length - 1) {
            indexBot = 0
            writeCounter(indexBot)

        }
        var botname = getBot()[indexBot]

        if (botRunning.includes(botname.split('|')[0])) {
            indexBot++
            botname = getBot()[indexBot]
        }
        if (indexBot > getBot().length - 1) {
            indexBot = 0
            writeCounter(indexBot)
            botname = getBot()[indexBot]
        }
        //console.log(indexBot)
        var usernamebot = botname.split('|')[0]
        var min = botname.split('|')[1].split('-')[0]
        var max = botname.split('|')[1].split('-')[1]
        var vangggggg = getrandomvang(Number(min), Number(max))
        writeCounter(indexBot)

        var server = 10//randomserverCuoc()
        const phienChay = await Game.findOne({ server: server, status: 0 }).sort({ $natural: -1 })
        if (phienChay) {
            if (lastserver == 0) {
                lastserver = phienChay.server
            }
            if (lastphien == "") {
                lastphien = phienChay._id.toString()
            }


            if (phienChay._id.toString() == lastphien && Number(lastserver) == phienChay.server && countPut < readSetting().pem1lan) {
                lastphien = phienChay._id.toString()
                countPut++
                writeCounter(indexBot)
                botRunning.push(usernamebot)
                var ccc = await datcuoc(usernamebot, phienChay, vangggggg)
            }
            if (lastphien.toString() != phienChay._id.toString() && lastserver == phienChay.server) {
                setTimeout(() => {
                    console.log("rs" + countPut)
                    countPut = 0
                    writeCounter(indexBot)
                    botRunning = []
                    lastphien = phienChay._id.toString()
                }, 5000)

            }
        }
        var end = Date.now()
        console.log(start - end)
    } catch { }
    setTimeout(async () => {
        autoBot()
    }, (120 / readSetting().pem1lan) * 1000)

}
