import mongoose, { Document, InferSchemaType, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { usernameRegex } from "@/lib/common/constants";

export interface IUser extends Document {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            maxLength: [30, "Username must not exceed 30 characters"],
            minlength: [5, "Username must be atleast 5 characters long"],
            lowercase: true,
            match: [usernameRegex, "Username must contain only lowercase alphabets, digits or underscore (_)"]
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        firstname: {
            type: String,
            trim: true,
            maxLength: [70, "First name must not exceed 70 characters"],
            default: null
        },
        lastname: {
            type: String,
            trim: true,
            maxLength: [70, "Last name must not exceed 70 characters"],
            default: null
        }
    },
    { timestamps: true },
);

userSchema.pre("save", function () {
    // Hash the password
    if (this.password) this.password = bcrypt.hashSync(this.password)
})

// Validate password
userSchema.methods.validPassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export type UserPayload = InferSchemaType<typeof userSchema>
export default User;
