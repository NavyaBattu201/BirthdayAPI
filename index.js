const mongoose = require("mongoose");
require('dotenv').config();
const dburl = process.env.DB_URL;
const dbport = process.env.DB_PORT;

mongoose.connect(dburl).then(() => {
    console.log("connection successful");
}).catch((err) => console.log(err));


const appSchema = new mongoose.Schema({
    name: { type: String,
        unique: true },
    birthday: {
        type: String,
        validate: {
            validator: function(value) {
              return /^\d{8}$/.test(value);
            },
            message: 'Birthday must be in the format DDMMYYYY'
          },
    }
});
let user = mongoose.model('user', appSchema);
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//adding new user
app.post('/', async (req, res) => {
    let newUser = req.body;
    try {
        var newData = new user(newUser);
        await newData.save()
        res.status(201).send("successfully saved");
        console.log('successfully saved');
    } catch (err) {
        console.error(err)
        res.status(409).send(err.message);
    }
});
//nearest birthday
app.get('/nearestbirthday', async (req, res) => {
    user.find({})
    .then(allUsers => {
        let today = new Date();
        currentDay = today.getDate();
        currentMonth = today.getMonth() + 1;
        let minDiff = 12;
        diffInMonth = []
        for (let i = 0; i < allUsers.length; i++) {
            const month = parseInt(allUsers[i].birthday.substring(2, 4));
            const day = parseInt(allUsers[i].birthday.substring(0, 2));
            if ((month - currentMonth) >= 0) {
                diffInMonth[i] = (month - currentMonth);
                if ((diffInMonth[i] < minDiff) && (diffInMonth[i] != 0)) {
                    minDiff = diffInMonth[i];
                } else if ((diffInMonth[i] == 0) && (day - currentDay) >= 0) {
                    minDiff = diffInMonth[i];
                }
            } else diffInMonth[i] = 13;

        }
        let x = 0;
        let minDiffDate = 32;
        for (let i = 0; i < allUsers.length; i++) {
            const day = parseInt(allUsers[i].birthday.substring(0, 2));
            if(minDiff==0&&diffInMonth[i]==0&&(day-currentDay)<minDiffDate&&(day-currentDay)>=0){
                minDiffDate=(day-currentDay);x=i;
            }else if(minDiff!=0&&diffInMonth[i]==minDiff&&day<minDiffDate){
                minDiffDate=day;x=i;
            }
        }
        res.status(200).send(allUsers[x]);
    })
    .catch(error => {
        console.error(error);

    });
});

//udating
app.put('/person/:name', async (req, res) => {
    try {
        const useritem = await user.findOneAndUpdate({ name: req.params.name }, { birthday: req.body.birthday });
        if (useritem) {
            return res.status(201).send("updated")
        }
        res.status(409).send("user not found");
    } catch (err) {
        console.error(err);
    }
});
//delete specific persons 
app.delete('/person/:name', async (req, res) => {
    try {
        const useritem = await user.findOneAndDelete({ name: req.params.name });
        if (useritem) {
            return res.status(200).send("deleted")
        }
        res.status(404).send("user not found");
    } catch (err) {
        console.error(err);
    }

});
//fetch a specific persons birthday
app.get('/person/:name', async (req, res) => {
    try {
        const userItem = await user.findOne({ name: req.params.name });
        if (userItem) {
            return res.status(200).send(userItem.birthday);
        }
        res.status(404).send("user not found");
    } catch (err) {
        console.error(err);
    }
});


app.listen(dbport, () => {
    console.log("server running on port 3000");
});