var bodyparser = require("body-parser");
var mongoose = require("mongoose");
// var urlencodedparser = bodyparser.urlencoded({ extended: false });
const db = "mongodb+srv://navyasree1370:Carbon12@cluster0.tjk87jm.mongodb.net/Birthdayapi?retryWrites=true&w=majority"

mongoose.connect(db).then(() => {
    console.log("connection succussful");
}).catch((err) => console.log(err));


var appschema = new mongoose.Schema({
    Name: { type: String },
    Birthday: {
        type: String,
        max: 8, min: 8
    }
});
var user = mongoose.model('User', appschema);

module.exports = function (app) {
    app.use(bodyparser.json());
    //NOT project
    // app.get('/home', function (req, res) {
    //     res.render('index1');
    // });
    // app.post('/home', function (req, res) {
    //     var newuser = req.body;
    //     var newdata = new user(newuser);
    //     if (user.exists({ Name: newuser.Name })) {
    //         res.json('user already exist');
    //     } else {
    //         var addoneitem = async () => {

    //             await newdata.save()
    //         }

    //         addoneitem().then(() => {
    //             console.log('successfully resolved');
    //         }).catch(e => console.log(e))
    //         console.log(newuser.Name);
    //     }

    // })
    //project
    //adding new user
    app.post('/', async (req, res) => {
        var newuser = req.body;
        const useritem = await user.findOne(newuser);
        if (useritem) {
            res.send("user already exist");
        } else {
            var newdata = new user(newuser);
            var addoneitem = async () => {

                await newdata.save()
            }

            addoneitem().then(() => {
                res.send("successfully saved");
                console.log('successfully saved');
            }).catch(e => console.log(e))
        }

    })
    function datetostring(Thedate) {
        var date = Thedate.getDate();
        var month = Thedate.getMonth() + 1;
        var year = Thedate.getFullYear();
        if ((date > 9) && (month > 9)) {
            return '' + date + month + year;
        } else if ((date > 9) && (month <= 9)) {
            return '' + date + '0' + month + year;
        } else if (date <= 9 && month > 9) {
            return '0' + date + month + year;
        } else {
            return '0' + date + '0' + month + year;
        }
    }

    //Get closests birthday 
    app.get('/nearestbirthday', async (req,res) => {
        var today = new Date();
        var nextdaystring = datetostring(today);
        for (let i = 1; i < 367; i++) {
            const regexPattern = new RegExp('^' + nextdaystring.substring(0, 4), 'i');
        var nearestday = await user.findOne({ Birthday: { $regex: regexPattern } });
        if (nearestday) {
            res.send(nearestday.Name);
            break;
        } else {
            today.setDate(today.getDate() + 1);
            var nextdaystring = datetostring(today);
        }
    }
    })



//udating
app.put('/person/:name', async (req, res) => {
    const itemname = req.params.name;
    const itemdate = req.body.Birthday;
    const useritem = await user.findOneAndUpdate({ Name: itemname }, { Birthday: itemdate });
    if (useritem) {
        res.send("updated")
    } else res.send("user not found");
});
//delete specific persons 
app.delete('/person/:name', async (req, res) => {
    const itemname = req.params.name;
    const useritem = await user.findOneAndDelete({ Name: itemname });
    if (useritem) {
        res.send("deleted")
    } else res.send("user not found");
});
//fetch a specific persons birthday
app.get('/person/:name', async (req, res) => {
    const itemone = req.params.name;
    const useritem = await user.findOne({ Name: itemone });
    if (useritem) {
        res.send(useritem.Birthday);
    } else res.send("user not found");
});

};