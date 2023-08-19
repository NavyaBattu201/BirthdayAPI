import mongoose from "mongoose";
const appSchema = new mongoose.Schema({
    name: { type: String,
        unique: true },
    birthday: {
        type: String,
        validate: {
            validator: function(value:string) {
              return /^\d{8}$/.test(value);
            },
            message: 'Birthday must be in the format DDMMYYYY'
          },
    }
});
let User = mongoose.model('user', appSchema);
export default User;