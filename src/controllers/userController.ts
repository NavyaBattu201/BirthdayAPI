import { Request, Response } from "express";
import User from "../models/userModel";
import  { Document } from "mongoose";
interface IUser extends Document{
    name: string;
    birthday: string;
}

export const createUser = async (req: Request, res: Response) => {
    let newUser = req.body;
    try {
        const newData = new User(newUser);
        await newData.save()
        return res.status(201).send("successfully saved");
    } catch (err) {
        console.error(err)
        res.status(409).send(err);
    }
};

export const getNearestBirthday = async (req: Request, res: Response) => {
    try {
        const allUsers:IUser[] = await User.find({});
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        let minDiff = 12;
        let diffInMonth: number[] = [];
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
            if (minDiff == 0 && diffInMonth[i] == 0 && (day - currentDay) < minDiffDate && (day - currentDay) >= 0) {
                minDiffDate = (day - currentDay);
                x = i;
            } else if (minDiff != 0 && diffInMonth[i] == minDiff && day < minDiffDate) {
                minDiffDate = day;
                x = i;
            }
        }
        return res.status(200).send(allUsers[x]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
};

export const updatePerson = async (req: Request, res: Response) => {
    try {
        const useritem = await User.findOneAndUpdate({ name: req.params.name }, { birthday: req.body.birthday });
        if (useritem) {
            return res.status(201).send("updated")
        }
        return res.status(409).send("user not found");
    } catch (err) {
        console.error(err);
    }
};

export const deletePerson = async (req: Request, res: Response) => {
    try {
        const useritem = await User.findOneAndDelete({ name: req.params.name });
        if (useritem) {
            return res.status(200).send("deleted")
        }
        return res.status(404).send("user not found");
    } catch (err) {
        console.error(err);
    }
};

export const getPersonBirthday = async (req: Request, res: Response) => {
    try {
        const userItem = await User.findOne({ name: req.params.name });
        if (userItem) {
            return res.status(200).send(userItem.birthday);
        }
        return res.status(404).send("user not found");
    } catch (err) {
        console.error(err);
    }
};
